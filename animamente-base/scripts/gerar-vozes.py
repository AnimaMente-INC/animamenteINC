#!/usr/bin/env python3
"""
Gera as vozes de um roteiro com Kokoro TTS (offline, em português do Brasil).

Uso:
    python3 scripts/gerar-vozes.py roteiros/meu-video.json [--modelos pasta-dos-modelos]

Antes, uma única vez:
    pip install kokoro-onnx soundfile
    # baixe os dois arquivos do modelo para a pasta "modelos-voz/" (ou passe --modelos):
    #   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
    #   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
    # precisa do ffmpeg instalado (para mudar o tom das vozes).

Saída:
    public/vozes/<id>/cenaNN.wav  — um áudio por cena (fala do personagem ou narração)
    public/vozes/<id>/manifesto.json  — duração de cada áudio (o vídeo se ajusta a ele)

Cada personagem tem voz, velocidade e tom definidos em src/tema/vozes.json.
Áudios cujo texto não mudou não são gerados de novo.
"""
import argparse
import hashlib
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


def limpar(texto: str) -> str:
    """Remove a marcação de destaque (*...* e _..._) antes de falar."""
    return re.sub(r"[*_]", "", texto).strip()


# Palavras que a voz lê errado em português: troca só no que é FALADO (a tela continua igual).
PRONUNCIA = {
    "videogame": "vídeo gueime",
    "Steam": "istím",
    "SUS": "sus",
    "Enem": "enêm",
}


def pronunciar(texto: str) -> str:
    for palavra, som in PRONUNCIA.items():
        texto = re.sub(rf"\b{re.escape(palavra)}\b", som, texto, flags=re.IGNORECASE)
    return texto


def fala_da_cena(cena: dict):
    for p in cena.get("personagens") or []:
        if p.get("fala"):
            return p["id"], limpar(p["fala"]), "fala"
    if cena.get("narracao"):
        return cena.get("narrador", "neuro"), limpar(cena["narracao"]), "narracao"
    # cena "chat": a última mensagem é a fala, na voz de quem a escreveu
    if cena.get("tipo") == "chat" and cena.get("mensagens"):
        ultima = cena["mensagens"][-1]
        return ultima["quem"], limpar(ultima["texto"]), "narracao"
    return None


def mudar_tom(entrada: Path, saida: Path, semitons: float, sr: int):
    if abs(semitons) < 0.01:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(entrada), str(saida)], check=True)
        return
    f = 2 ** (semitons / 12)
    filtro = f"asetrate={int(sr * f)},aresample={sr},atempo={1 / f:.5f}"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(entrada), "-af", filtro, str(saida)], check=True)


def duracao_wav(arq: Path) -> float:
    import soundfile as sf

    info = sf.info(str(arq))
    return info.frames / info.samplerate


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("roteiro")
    ap.add_argument("--modelos", default=str(RAIZ / "modelos-voz"))
    a = ap.parse_args()

    roteiro = json.loads(Path(a.roteiro).read_text(encoding="utf-8"))
    vid = roteiro.get("id")
    if not vid:
        sys.exit('O roteiro precisa de um "id" (ex.: "id": "meu-video").')
    vozes = json.loads((RAIZ / "src/tema/vozes.json").read_text(encoding="utf-8"))
    pasta = RAIZ / "public" / "vozes" / vid
    pasta.mkdir(parents=True, exist_ok=True)
    manifesto_arq = pasta / "manifesto.json"
    antigo = json.loads(manifesto_arq.read_text()) if manifesto_arq.exists() else {"cenas": {}}

    kokoro = None
    manifesto = {"cenas": {}}
    for i, cena in enumerate(roteiro["cenas"]):
        f = fala_da_cena(cena)
        if not f:
            continue
        quem, texto, tipo = f
        cfg = vozes[quem]
        falado = pronunciar(texto)
        chave = hashlib.sha1(json.dumps([falado, cfg], sort_keys=True).encode()).hexdigest()[:12]
        nome = f"cena{i:02d}.wav"
        destino = pasta / nome
        anterior = antigo["cenas"].get(str(i))
        if anterior and anterior.get("chave") == chave and destino.exists():
            manifesto["cenas"][str(i)] = anterior
            print(f"  cena {i:2d} ({quem}): sem mudanças")
            continue
        if kokoro is None:
            from kokoro_onnx import Kokoro

            m = Path(a.modelos)
            kokoro = Kokoro(str(m / "kokoro-v1.0.onnx"), str(m / "voices-v1.0.bin"))
        import soundfile as sf

        amostras, sr = kokoro.create(falado, voice=cfg["voz"], speed=cfg["velocidade"], lang="pt-br")
        with tempfile.TemporaryDirectory() as t:
            bruto = Path(t) / "bruto.wav"
            sf.write(str(bruto), amostras, sr)
            mudar_tom(bruto, destino, cfg.get("tom", 0), sr)
        d = round(duracao_wav(destino), 3)
        manifesto["cenas"][str(i)] = {"arquivo": f"vozes/{vid}/{nome}", "duracao": d, "quem": quem, "tipo": tipo, "texto": texto, "chave": chave}
        print(f"  cena {i:2d} ({quem}, {d:.1f}s): {texto}")

    manifesto_arq.write_text(json.dumps(manifesto, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ {len(manifesto['cenas'])} áudio(s) em {pasta.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
