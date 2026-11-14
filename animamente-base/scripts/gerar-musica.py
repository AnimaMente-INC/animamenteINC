#!/usr/bin/env python3
"""
Compõe e sintetiza as trilhas de fundo da animamente — música ORIGINAL, gerada por código,
sem direitos autorais de terceiros. Cada trilha é um loop perfeito (o vídeo repete sem emenda).

Uso:
    python3 scripts/gerar-musica.py            # gera todas as trilhas em public/musica/
    python3 scripts/gerar-musica.py animada-2  # só uma

Instrumentos: pad suave, arpejo dedilhado (Karplus-Strong), baixo, bateria leve
(bumbo, palma, chimbal) e uma melodia de sininho na segunda metade.
Precisa de numpy, scipy e ffmpeg.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter, sosfilt

RAIZ = Path(__file__).resolve().parent.parent
SR = 44100

# nome: (bpm, tônica MIDI, progressão em graus da escala maior, semente, swing)
TRILHAS = {
    "animada-1": (112, 60, [0, 4, 5, 3], 1, 0.0),  # Dó maior · I–V–vi–IV
    "animada-2": (120, 65, [5, 3, 0, 4], 2, 0.0),  # Fá maior · vi–IV–I–V
    "animada-3": (100, 67, [0, 5, 3, 4], 3, 0.12),  # Sol maior · I–vi–IV–V, com leve swing
}

ESCALA = [0, 2, 4, 5, 7, 9, 11]
PENTA = [0, 2, 4, 7, 9]


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def acorde(tonica, grau):
    """Tríade da escala maior a partir do grau (0 = I)."""
    return [tonica + ESCALA[(grau + k) % 7] + 12 * ((grau + k) // 7) for k in (0, 2, 4)]


def env(n, a, d, sus=0.0, r=0.0):
    """Envelope simples (ataque, queda exponencial, sustentação)."""
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * (sus + (1 - sus) * np.exp(-t / max(d, 1e-4)))
    if r > 0:
        fim = int(r * SR)
        if fim < n:
            e[-fim:] *= np.linspace(1, 0, fim)
    return e


def soma(buf, sinal, inicio, pan=0.0, vol=1.0):
    """Mixa um sinal mono no buffer estéreo (com volta no fim → loop sem emenda)."""
    n = len(sinal)
    esq = sinal * vol * np.sqrt(0.5 * (1 - pan))
    dir_ = sinal * vol * np.sqrt(0.5 * (1 + pan))
    L = buf.shape[0]
    idx = (np.arange(n) + inicio) % L
    np.add.at(buf[:, 0], idx, esq)
    np.add.at(buf[:, 1], idx, dir_)


def pad(freqs, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for f in freqs:
        for h in range(1, 6):
            s += np.sin(2 * np.pi * f * h * t * (1 + 0.0015 * np.sin(2 * np.pi * 0.3 * t))) / h**2
    sos = butter(2, 1800, "low", fs=SR, output="sos")
    return sosfilt(sos, s) * env(n, 0.35, 99, 1.0, 0.4) / len(freqs)


def dedilhado(f, dur, rng):
    """Karplus-Strong: corda dedilhada."""
    n = int(dur * SR)
    N = max(2, int(SR / f))
    ruido = rng.uniform(-1, 1, N)
    x = np.zeros(n)
    x[:N] = ruido
    a = np.zeros(N + 2)
    a[0] = 1
    a[N] = -0.497
    a[N + 1] = -0.497
    y = lfilter([1.0], a, x)
    b, a2 = butter(1, 5000, "low", fs=SR)
    return lfilter(b, a2, y) * env(n, 0.002, dur * 0.6)


def baixo(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) + 0.08 * np.sin(6 * np.pi * f * t)
    return s * env(n, 0.006, 0.35, 0.25, 0.05)


def bumbo():
    n = int(0.32 * SR)
    t = np.arange(n) / SR
    freq = 45 + 85 * np.exp(-t * 30)
    fase = 2 * np.pi * np.cumsum(freq) / SR
    return np.sin(fase) * np.exp(-t * 11)


def palma(rng):
    n = int(0.2 * SR)
    t = np.arange(n) / SR
    sos = butter(2, [900, 4500], "band", fs=SR, output="sos")
    r = sosfilt(sos, rng.uniform(-1, 1, n))
    e = np.exp(-t * 22) * (1 + 0.6 * (np.sin(2 * np.pi * 90 * t) > 0) * (t < 0.03))
    return r * e * 1.6


def chimbal(rng, aberto=False):
    n = int((0.12 if aberto else 0.045) * SR)
    t = np.arange(n) / SR
    sos = butter(2, 7000, "high", fs=SR, output="sos")
    return sosfilt(sos, rng.uniform(-1, 1, n)) * np.exp(-t * (25 if aberto else 70))


def sininho(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 6)
    return s * env(n, 0.003, 0.45)


def gerar(nome):
    bpm, tonica, prog, semente, swing = TRILHAS[nome]
    rng = np.random.default_rng(semente)
    batida = 60 / bpm
    compassos = 16  # A (8 compassos) + B (8 compassos, com melodia)
    L = int(round(compassos * 4 * batida * SR))
    buf = np.zeros((L, 2))
    amostra = lambda b: int(round(b * batida * SR))  # noqa: E731  (b = posição em batidas)

    # motivo da melodia (2 compassos), repetido com variação
    motivo = [(0, 4), (1, 2), (1.5, 1), (2.5, 2), (3, 3), (4.5, 1), (5, 0), (6, 2), (7, 1)]

    for c in range(compassos):
        grau = prog[c % 4]
        tri = acorde(tonica, grau)
        ini = c * 4
        # pad (oitava baixa da tríade)
        soma(buf, pad([hz(m - 12) for m in tri], 4 * batida + 0.4), amostra(ini), pan=0.0, vol=0.16)
        # arpejo dedilhado em colcheias
        padrao = [0, 1, 2, 1, 0, 2, 1, 2] if c % 2 == 0 else [0, 2, 1, 2, 0, 1, 2, 1]
        for k, i in enumerate(padrao):
            b = ini + k * 0.5 + (swing * 0.5 if k % 2 else 0)
            soma(buf, dedilhado(hz(tri[i] + 12), 0.6, rng), amostra(b), pan=0.35, vol=0.46 if k % 2 == 0 else 0.34)
        # baixo
        raiz = hz(tri[0] - 24)
        quinta = hz(tri[2] - 24)
        for b, f, d in [(0, raiz, 0.9), (1.5, raiz, 0.4), (2, quinta, 0.9), (3.5, raiz, 0.4)]:
            soma(buf, baixo(f, d * batida + 0.1), amostra(ini + b), vol=0.26)
        # bateria leve
        for b in (0, 2) + ((2.5,) if c % 4 == 3 else ()):
            soma(buf, bumbo(), amostra(ini + b), vol=0.30)
        for b in (1, 3):
            soma(buf, palma(rng), amostra(ini + b), pan=-0.1, vol=0.26)
        for k in range(8):
            b = ini + k * 0.5 + (swing * 0.5 if k % 2 else 0)
            soma(buf, chimbal(rng, aberto=(k == 7 and c % 2 == 1)), amostra(b), pan=0.25, vol=0.10 if k % 2 == 0 else 0.15)
        # melodia de sininho na segunda metade (B)
        if c >= 8 and c % 2 == 0:
            for b, grau_p in motivo:
                desloc = PENTA[grau_p % 5] + (12 if grau_p >= 5 else 0)
                nota = tonica + 12 + desloc + (2 if c == 14 and b >= 6 else 0)
                soma(buf, sininho(hz(nota), 0.9), amostra(ini + b), pan=-0.3, vol=0.24)

    # mixagem: compressão suave + normalização (−16 dBFS RMS); o vídeo ainda abaixa o volume
    # corta graves inaudíveis no celular e deixa a trilha "leve"
    buf = sosfilt(butter(2, 45, "high", fs=SR, output="sos"), buf, axis=0)
    buf = np.tanh(buf * 1.4) / 1.4
    rms = np.sqrt(np.mean(buf**2))
    buf *= 10 ** (-16 / 20) / max(rms, 1e-9)
    buf = np.clip(buf, -0.98, 0.98)

    destino = RAIZ / "public" / "musica"
    destino.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as t:
        wav = Path(t) / f"{nome}.wav"
        wavfile.write(str(wav), SR, (buf * 32767).astype(np.int16))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-c:a", "libmp3lame", "-b:a", "160k", str(destino / f"{nome}.mp3")], check=True)
    print(f"✓ public/musica/{nome}.mp3  ({L / SR:.1f}s em loop, {bpm} bpm)")


if __name__ == "__main__":
    nomes = sys.argv[1:] or list(TRILHAS)
    for n in nomes:
        gerar(n)
