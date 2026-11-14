#!/usr/bin/env python3
"""
Importa as falas GRAVADAS PELA EQUIPE para dentro do vídeo.

Uso:
    python3 scripts/importar-gravacoes.py roteiros/meu-video.json pasta-das-gravacoes/

A pasta deve ter um arquivo por fala, com os nomes do roteiro de locução:
    fala01.wav, fala02.m4a, fala03.mp3 ...   (wav, mp3, m4a, ogg, aac, flac)

O script:
  1. corta o silêncio do começo e do fim de cada gravação e normaliza o volume;
  2. salva em public/vozes/<id>/cenaNN.wav;
  3. escreve o manifesto (origem "gravacao"). O vídeo passa a tocar as vozes, ajusta o tempo
     das cenas, sincroniza boca e balão, e abaixa a música de fundo.

Antes, gere o roteiro de locução (npm run locucao -- roteiros/meu-video.json): ele cria o
mapa fala → cena em roteiros/locucao/<id>.falas.json.
Precisa do ffmpeg instalado.
"""
import json
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
EXTS = [".wav", ".mp3", ".m4a", ".ogg", ".aac", ".flac", ".opus", ".webm"]


def duracao(arq: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(arq)],
        capture_output=True,
        text=True,
        check=True,
    )
    return float(r.stdout.strip())


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    roteiro_arq = Path(sys.argv[1])
    pasta = Path(sys.argv[2])
    roteiro = json.loads(roteiro_arq.read_text(encoding="utf-8"))
    vid = roteiro.get("id") or roteiro_arq.stem
    mapa_arq = roteiro_arq.parent / "locucao" / f"{vid}.falas.json"
    if not mapa_arq.exists():
        sys.exit(f"Rode antes: npm run locucao -- {roteiro_arq}")
    mapa = json.loads(mapa_arq.read_text(encoding="utf-8"))["falas"]

    destino = RAIZ / "public" / "vozes" / vid
    destino.mkdir(parents=True, exist_ok=True)
    manifesto = {"origem": "gravacao", "cenas": {}}
    faltando = []
    for item in mapa:
        nome = f"fala{item['fala']:02d}"
        achado = next((pasta / f"{nome}{e}" for e in EXTS if (pasta / f"{nome}{e}").exists()), None)
        if not achado:
            faltando.append(nome)
            continue
        saida = destino / f"cena{item['cena']:02d}.wav"
        # corta silêncio no começo/fim, normaliza a voz e converte para wav mono 44,1 kHz
        filtro = (
            "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,"
            "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse,"
            "highpass=f=80,loudnorm=I=-16:TP=-1.5:LRA=11"
        )
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(achado), "-af", filtro, "-ac", "1", "-ar", "44100", str(saida)], check=True)
        d = round(duracao(saida), 3)
        manifesto["cenas"][str(item["cena"])] = {
            "arquivo": f"vozes/{vid}/{saida.name}",
            "duracao": d,
            "quem": item["quem"],
            "tipo": "gravacao",
        }
        print(f"  {nome} → cena {item['cena'] + 1} ({item['quem']}, {d:.1f}s)")

    (destino / "manifesto.json").write_text(json.dumps(manifesto, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ {len(manifesto['cenas'])} gravação(ões) importada(s) para public/vozes/{vid}/")
    if faltando:
        print(f"⚠ faltando: {', '.join(faltando)}. Essas cenas ficam com o tempo estimado e sem voz.")


if __name__ == "__main__":
    main()
