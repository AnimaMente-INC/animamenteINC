#!/usr/bin/env python3
"""
Vozes de IA (Kokoro) para um roteiro de PASSEIO (roteiros/passeio/<id>.json): vídeo contínuo, sem pausas.
Gera public/vozes/<id>/falaNN.wav e grava "inicio"/"duracao" (segundos) em cada fala do roteiro,
uma colada na outra. Campo opcional "voz" = como a fala deve ser PRONUNCIADA (siglas e nomes estrangeiros).
Uso: python3 scripts/gerar-vozes-passeio.py roteiros/passeio/<id>.json [--modelos pasta]
"""
import argparse, json, re, subprocess, tempfile
from pathlib import Path
import soundfile as sf

RAIZ = Path(__file__).resolve().parent.parent
RESPIRO = 0.12  # segundos entre uma fala e a próxima
INICIO = 0.5
FIM = 1.6

ap = argparse.ArgumentParser(); ap.add_argument("roteiro"); ap.add_argument("--modelos", default=str(RAIZ / "modelos-voz"))
a = ap.parse_args()
arq = Path(a.roteiro); r = json.loads(arq.read_text(encoding="utf-8"))
vozes = json.loads((RAIZ / "src/tema/vozes.json").read_text(encoding="utf-8"))
pasta = RAIZ / "public" / "vozes" / r["id"]; pasta.mkdir(parents=True, exist_ok=True)
from kokoro_onnx import Kokoro
m = Path(a.modelos); k = Kokoro(str(m / "kokoro-v1.0.onnx"), str(m / "voices-v1.0.bin"))
t = INICIO
for i, f in enumerate(r["falas"]):
    cfg = vozes[f["quem"]]; texto = re.sub(r"[*_]", "", f.get("voz") or f["texto"]).strip()
    amostras, sr = k.create(texto, voice=cfg["voz"], speed=cfg["velocidade"], lang="pt-br")
    destino = pasta / f"fala{i:02d}.wav"
    with tempfile.TemporaryDirectory() as d:
        bruto = Path(d) / "b.wav"; sf.write(str(bruto), amostras, sr)
        fator = 2 ** (cfg.get("tom", 0) / 12)
        filtro = f"asetrate={int(sr * fator)},aresample={sr},atempo={1 / fator:.5f},silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(bruto), "-af", filtro, str(destino)], check=True)
    info = sf.info(str(destino)); dur = round(info.frames / info.samplerate, 3)
    f["arquivo"] = f"vozes/{r['id']}/fala{i:02d}.wav"; f["inicio"] = round(t, 3); f["duracao"] = dur
    print(f"  {i:2d} {f['quem']:5s} {t:6.2f}s +{dur:.2f}s  {texto}")
    t += dur + RESPIRO
r["duracao"] = round(t + FIM, 2)
arq.write_text(json.dumps(r, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"✓ {len(r['falas'])} falas, vídeo de {r['duracao']} s")
