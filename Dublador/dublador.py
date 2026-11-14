# -*- coding: utf-8 -*-
"""
Dublador Animamente
===================
Grava a locução por cima de um vídeo, trecho a trecho, com o roteiro
aparecendo como teleprompter. Cada trecho é revisado antes de seguir e, no
final, o vídeo completo (com cada fala no tempo certo) é salvo na pasta
"videos_finalizados" que fica junto deste programa.

Como abrir: dê dois cliques em ABRIR_DUBLADOR.bat
Formato do roteiro: veja LEIA-ME.md (ou roteiro_modelo.txt)
"""

import os
import re
import sys
import json
import math
import time
import queue
import hashlib
import threading
import traceback
import subprocess
from datetime import datetime

import tkinter as tk
from tkinter import ttk, filedialog, messagebox

APP_DIR = os.path.dirname(os.path.abspath(__file__))
PROJ_ROOT = os.path.join(APP_DIR, "projetos")
OUT_DIR = os.path.join(APP_DIR, "videos_finalizados")
CONFIG_PATH = os.path.join(APP_DIR, "config.json")
LOG_PATH = os.path.join(APP_DIR, "erros.log")
GUIA_PATH = os.path.join(APP_DIR, "LEIA-ME.md")
MODELO_PATH = os.path.join(APP_DIR, "roteiro_modelo.txt")


def log_erro(texto):
    try:
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(f"\n[{datetime.now():%Y-%m-%d %H:%M:%S}]\n{texto}\n")
    except Exception:
        pass


try:
    import numpy as np
    import cv2
    import sounddevice as sd
    import soundfile as sf
    import imageio_ffmpeg
    from PIL import Image, ImageTk
except Exception as _e:  # pragma: no cover
    log_erro(traceback.format_exc())
    _r = tk.Tk()
    _r.withdraw()
    messagebox.showerror(
        "Dublador Animamente",
        "Faltam bibliotecas para o programa funcionar.\n\n"
        "Abra sempre pelo arquivo ABRIR_DUBLADOR.bat — ele instala tudo "
        "sozinho na primeira vez.\n\nDetalhe: " + str(_e))
    sys.exit(1)

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
SR = 48000            # taxa de amostragem de trabalho
PREROLL = 3.0         # segundos de contagem regressiva antes do trecho
PALAVRAS_POR_SEG = 2.6  # ritmo médio de fala em português (~155 palavras/min)
NO_WINDOW = 0x08000000 if os.name == "nt" else 0

# Identidade visual animamente
TINTA = "#1F1A3D"
CORAL = "#F0476B"
AMARELO = "#FFC23D"
LAVANDA = "#C9C5DD"
NEVOA = "#F7F6FB"
ARDOSIA = "#5A5675"
LIDO = "#8C88A8"
VERDE = "#4CC38A"

CFG_PADRAO = {
    "mic_nome": "",
    "ouvir_original": False,
    "ouvir_auto": True,
    "modo_posicao": "roteiro",   # "roteiro" = começa no tempo do roteiro | "natural" = como eu falei
    "vol_original": 100,
    "duck": 35,                  # % do volume original enquanto alguém fala
    "folga": 1.5,
    "fonte": 30,
    "ultimo_dir": "",
}


# --------------------------------------------------------------------------- #
#  Utilidades
# --------------------------------------------------------------------------- #
def carregar_cfg():
    cfg = dict(CFG_PADRAO)
    try:
        with open(CONFIG_PATH, encoding="utf-8") as f:
            cfg.update(json.load(f))
    except Exception:
        pass
    return cfg


def salvar_cfg(cfg):
    try:
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(cfg, f, ensure_ascii=False, indent=2)
    except Exception:
        log_erro(traceback.format_exc())


def rodar_ffmpeg(args):
    p = subprocess.run([FFMPEG, "-hide_banner", "-y"] + args,
                       stdin=subprocess.DEVNULL, capture_output=True,
                       text=True, encoding="utf-8", errors="replace",
                       creationflags=NO_WINDOW)
    return p.returncode, p.stderr


def duracao_ffmpeg(caminho):
    _, err = rodar_ffmpeg(["-i", caminho])
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", err)
    if not m:
        return None
    h, mi, s = m.groups()
    return int(h) * 3600 + int(mi) * 60 + float(s)


def fmt(t):
    if t is None:
        return "--:--"
    t = max(0.0, t)
    return f"{int(t // 60):02d}:{t % 60:04.1f}"


def abrir_no_sistema(caminho):
    try:
        if os.name == "nt":
            os.startfile(caminho)  # type: ignore[attr-defined]
        elif sys.platform == "darwin":
            subprocess.Popen(["open", caminho])
        else:
            subprocess.Popen(["xdg-open", caminho])
    except Exception:
        log_erro(traceback.format_exc())


# --------------------------------------------------------------------------- #
#  Roteiro
# --------------------------------------------------------------------------- #
class ErroRoteiro(Exception):
    pass


class Trecho:
    def __init__(self, n, inicio, fim, locutor, texto, linha, fim_explicito):
        self.n = n
        self.inicio = inicio
        self.fim = fim
        self.locutor = locutor
        self.texto = texto
        self.linha = linha
        self.fim_explicito = fim_explicito

    @property
    def janela(self):
        return max(0.1, self.fim - self.inicio)

    def assinatura(self):
        return hashlib.sha1(self.texto.strip().encode("utf-8")).hexdigest()[:12]

    def texto_falado(self):
        return re.sub(r"\([^)]*\)", " ", self.texto)

    def estimativa(self):
        palavras = len(self.texto_falado().split())
        return palavras / PALAVRAS_POR_SEG


CABECALHO_RE = re.compile(r"^\s*\[([^\]]*)\]\s*(.*)$")
SEPARADOR_RE = re.compile(r"\s*(?:-|–|—|\bat[eé]\b)\s*", re.IGNORECASE)


def parse_tempo(s):
    """Aceita 5 | 5.5 | 00:05 | 0:05,5 | 1:02:03.4 | 5s"""
    s = s.strip().lower().replace(",", ".")
    if s.endswith("s"):
        s = s[:-1].strip()
    partes = s.split(":")
    if not 1 <= len(partes) <= 3 or not all(re.fullmatch(r"\d+(?:\.\d+)?", p) for p in partes):
        raise ValueError(s)
    total = 0.0
    for p in partes:
        total = total * 60 + float(p)
    return total


def ler_texto_arquivo(caminho):
    with open(caminho, "rb") as f:
        bruto = f.read()
    for enc in ("utf-8-sig", "cp1252", "latin-1"):
        try:
            return bruto.decode(enc)
        except UnicodeDecodeError:
            continue
    return bruto.decode("utf-8", errors="replace")


TEMPO_MD = r"\d+(?::\d+){0,2}(?:[.,]\d+)?"
TITULO_MD_RE = re.compile(
    r"^\s*#{1,6}\s*(?:\d+\s*[.)]\s*)?(.*?)\s*[·|\-–—:]\s*\**\s*(" + TEMPO_MD + r")\s*(?:→|->|–|—|-|\bat[eé]\b)\s*("
    + TEMPO_MD + r")\s*\**\s*$", re.IGNORECASE)
CAMPO_MD_RE = re.compile(r"^\s*[-*]\s*\*\*([^*:]+):?\*\*:?\s*(.*)$")


def limpar_md(t):
    """Tira a formatação de Markdown (negrito, itálico, código) de um texto."""
    t = re.sub(r"\*\*(.+?)\*\*", r"\1", t)
    t = re.sub(r"__(.+?)__", r"\1", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"\1", t)
    t = re.sub(r"(?<![\w_])_(?!\s)(.+?)(?<!\s)_(?![\w_])", r"\1", t)
    return t.replace("`", "")


def converter_md(texto):
    """Aceita o roteiro de locução em Markdown gerado pela base de animação
    ("### 1. Neuro · 0:00.5 → 0:02.6" + "> fala" + "- **Jeito de falar:** ...")
    e devolve o mesmo roteiro no formato do Dublador. Se o texto não for desse
    tipo, devolve None."""
    linhas = texto.splitlines()
    if not any(TITULO_MD_RE.match(l) for l in linhas):
        return None
    blocos, atual = [], None
    for l in linhas:
        m = TITULO_MD_RE.match(l)
        if m:
            atual = {"quem": limpar_md(m.group(1)).strip(), "ini": m.group(2), "fim": m.group(3),
                     "fala": [], "jeito": "", "solto": []}
            blocos.append(atual)
            continue
        if re.match(r"^\s*#", l):      # outro título (ex.: "## Como gravar") encerra a fala
            atual = None
            continue
        if atual is None:
            continue
        s = l.strip()
        if s.startswith(">"):
            atual["fala"].append(limpar_md(s.lstrip(">").strip()))
            continue
        c = CAMPO_MD_RE.match(l)
        if c:
            if "jeito" in c.group(1).lower():
                jeito = limpar_md(c.group(2)).split(",")[0].strip()
                if jeito and jeito.lower() != "natural":
                    atual["jeito"] = jeito
            continue
        if s and not re.match(r"^([-*_]\s*){3,}$", s) and not s.startswith("|"):
            atual["solto"].append(limpar_md(s))
    saida = []
    for k, b in enumerate(blocos):
        fala = [x for x in (b["fala"] or b["solto"]) if x]
        ini, fim = parse_tempo(b["ini"]), parse_tempo(b["fim"])
        if k + 1 < len(blocos):          # deixa um respiro antes da próxima fala
            prox = parse_tempo(blocos[k + 1]["ini"])
            if prox > ini:
                fim = max(ini + 0.5, min(fim, prox - 0.3))
        jeito = f"({b['jeito']}) " if b["jeito"] else ""
        saida.append(f"[{ini:.2f} - {fim:.2f}] {b['quem']}\n{jeito}{' '.join(fala)}\n")
    return "\n".join(saida)


def ler_roteiro(texto, duracao=None):
    """Transforma o texto do roteiro em uma lista de Trecho. Devolve (trechos, avisos).
    Aceita o formato do Dublador (.txt) e o roteiro de locução em Markdown (.md)."""
    convertido = converter_md(texto)
    if convertido is not None:
        texto = convertido
    else:
        # roteiro no formato do Dublador, mas escrito com enfeites de Markdown
        texto = "\n".join(limpar_md(re.sub(r"^\s*>\s?", "", l)) for l in texto.splitlines())
    erros, avisos, brutos = [], [], []
    atual = None
    for i, linha in enumerate(texto.splitlines(), 1):
        s = linha.strip()
        if s.startswith("#"):
            continue
        if re.match(r"^\s*([-*_]\s*){3,}$", linha):   # linha separadora do Markdown
            continue
        m = CABECALHO_RE.match(linha)
        if m:
            partes = [p for p in SEPARADOR_RE.split(m.group(1).strip()) if p]
            if not 1 <= len(partes) <= 2:
                erros.append(f"Linha {i}: \"{s}\" — use [início - fim], ex.: [00:05 - 00:10]")
                atual = None
                continue
            try:
                ini = parse_tempo(partes[0])
                fim = parse_tempo(partes[1]) if len(partes) == 2 else None
            except ValueError:
                erros.append(f"Linha {i}: tempo inválido em \"{s}\". Use minutos:segundos, ex.: [01:05.5 - 01:09]")
                atual = None
                continue
            locutor = m.group(2).strip().rstrip(":").strip()
            atual = {"ini": ini, "fim": fim, "loc": locutor, "linhas": [], "linha": i}
            brutos.append(atual)
        else:
            if atual is None:
                if s:
                    erros.append(f"Linha {i}: texto fora de um trecho (\"{s[:40]}\"). "
                                 "Todo texto precisa vir abaixo de um tempo, ex.: [00:05 - 00:10]")
                continue
            atual["linhas"].append(linha.rstrip())

    if not brutos and not erros:
        erros.append("Nenhum trecho encontrado. Cada fala precisa começar com uma linha de tempo, "
                     "ex.: [00:00 - 00:04] Neuro")

    trechos = []
    for k, b in enumerate(brutos):
        txt = "\n".join(b["linhas"]).strip()
        txt = re.sub(r"\n\s*\n+", "\n\n", txt)
        if not txt:
            erros.append(f"Linha {b['linha']}: o trecho [{fmt(b['ini'])}] está sem texto.")
        fim = b["fim"]
        explicito = fim is not None
        if fim is None:
            if k + 1 < len(brutos):
                fim = brutos[k + 1]["ini"]
            elif duracao:
                fim = duracao
            else:
                fim = b["ini"] + max(2.0, len(txt.split()) / PALAVRAS_POR_SEG + 1.0)
        trechos.append(Trecho(k + 1, b["ini"], fim, b["loc"], txt, b["linha"], explicito))

    for k, t in enumerate(trechos):
        if k > 0 and t.inicio < trechos[k - 1].inicio:
            erros.append(f"Trecho {t.n} (linha {t.linha}): começa em {fmt(t.inicio)}, antes do trecho "
                         f"anterior ({fmt(trechos[k - 1].inicio)}). Os trechos precisam estar em ordem de tempo.")
        if t.fim <= t.inicio and (t.fim_explicito or k + 1 >= len(trechos) or trechos[k + 1].inicio >= t.inicio):
            erros.append(f"Trecho {t.n} (linha {t.linha}): o fim ({fmt(t.fim)}) precisa ser depois do início ({fmt(t.inicio)}).")
        if k + 1 < len(trechos) and t.fim > trechos[k + 1].inicio + 0.01:
            avisos.append(f"Trecho {t.n}: termina em {fmt(t.fim)}, depois que o trecho {t.n + 1} "
                          f"começa ({fmt(trechos[k + 1].inicio)}). As falas podem se sobrepor.")
        if duracao and t.inicio >= duracao:
            erros.append(f"Trecho {t.n}: começa em {fmt(t.inicio)}, mas o vídeo só tem {fmt(duracao)}.")
        elif duracao and t.fim > duracao + 0.01:
            avisos.append(f"Trecho {t.n}: termina em {fmt(t.fim)}, depois do fim do vídeo ({fmt(duracao)}).")
            t.fim = duracao
        est = t.estimativa()
        if t.texto and est > t.janela * 1.05:
            avisos.append(f"Trecho {t.n}: ~{est:.1f} s de fala para {t.janela:.1f} s de janela — "
                          "vai ficar corrido. Encurte o texto ou aumente o tempo.")

    if erros:
        raise ErroRoteiro("\n".join(erros))
    return trechos, avisos


# --------------------------------------------------------------------------- #
#  Áudio
# --------------------------------------------------------------------------- #
def reamostrar(x, sr_de, sr_para):
    if sr_de == sr_para or len(x) == 0:
        return x.astype(np.float32)
    n = int(round(len(x) * sr_para / sr_de))
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)


def processar_take(bruto, sr):
    """Corta o silêncio do começo e do fim, equaliza o volume e devolve
    (audio_48k_mono, segundos_cortados_do_inicio) — ou (None, None) se não houver fala."""
    x = np.asarray(bruto, dtype=np.float32).reshape(-1)
    if len(x) < sr * 0.2:
        return None, None
    x = x - float(np.mean(x))
    hop = max(1, int(sr * 0.02))
    n = len(x) // hop
    q = x[: n * hop].reshape(n, hop)
    rms = np.sqrt((q ** 2).mean(axis=1)) + 1e-9
    db = 20 * np.log10(rms)
    piso = float(np.percentile(db, 10))
    pico = float(db.max())
    limiar = max(piso + 12.0, pico - 35.0, -55.0)
    if pico < -50 or pico - piso < 8:
        return None, None
    voz = (db > limiar).astype(int)
    nucleo = np.convolve(voz, np.ones(3, dtype=int), "same") >= 3   # ignora estalos curtos
    idx = np.flatnonzero(nucleo)
    if len(idx) == 0:
        return None, None
    a = max(0, (idx[0] - 1) * hop - int(0.12 * sr))
    b = min(len(x), (idx[-1] + 2) * hop + int(0.25 * sr))
    y = x[a:b].copy()
    # volume: fala em torno de -20 dBFS RMS, sem estourar
    rms_voz = float(np.sqrt(np.mean(q[voz.astype(bool)] ** 2))) if voz.any() else float(np.sqrt(np.mean(y ** 2)))
    pk = float(np.abs(y).max()) + 1e-9
    ganho = min(0.1 / max(rms_voz, 1e-6), 0.89 / pk, 10.0)
    y *= ganho
    fi, fo = int(0.01 * sr), int(0.03 * sr)
    if len(y) > fi + fo:
        y[:fi] *= np.linspace(0, 1, fi)
        y[-fo:] *= np.linspace(1, 0, fo)
    return reamostrar(y, sr, SR), a / sr


def ler_wav_amostras(caminho, s0, n):
    """Lê n amostras estéreo a partir da amostra s0 (completa com silêncio fora do arquivo)."""
    out = np.zeros((n, 2), dtype=np.float32)
    if not caminho or not os.path.exists(caminho) or n <= 0:
        return out
    with sf.SoundFile(caminho) as f:
        sa, sb = max(0, s0), min(f.frames, s0 + n)
        if sb > sa:
            f.seek(sa)
            d = f.read(sb - sa, dtype="float32", always_2d=True)
            if d.shape[1] == 1:
                d = np.repeat(d, 2, axis=1)
            out[sa - s0: sa - s0 + len(d)] = d[:, :2]
    return out


def limitar(x, lim=0.92):
    a = np.abs(x)
    over = a > lim
    if over.any():
        x[over] = np.sign(x[over]) * (lim + (1 - lim) * np.tanh((a[over] - lim) / (1 - lim)))
    return x


def mixar(s0, n, takes, orig_wav, vol_orig, duck):
    """takes = [(posição_em_amostras, audio_mono)]. Devolve (mix estéreo, voz mono)."""
    voz = np.zeros(n, dtype=np.float32)
    for p, y in takes:
        a, b = p - s0, p - s0 + len(y)
        sa, sb = max(a, 0), min(b, n)
        if sb > sa:
            voz[sa:sb] += y[sa - a: sb - a]
    orig = ler_wav_amostras(orig_wav, s0, n) * float(vol_orig)
    if orig_wav and takes and duck < 0.999:
        D = 240
        e0 = s0 - SR
        m = (n + 2 * SR) // D + 2
        mask = np.zeros(m, dtype=np.float32)
        for p, y in takes:
            i0 = (p - int(0.15 * SR) - e0) // D
            i1 = (p + len(y) + int(0.20 * SR) - e0) // D
            i0, i1 = max(i0, 0), min(i1, m)
            if i1 > i0:
                mask[i0:i1] = 1.0
        suave = np.convolve(mask, np.ones(60, dtype=np.float32) / 60.0, "same")
        ganho_ctrl = 1.0 - (1.0 - duck) * np.clip(suave, 0, 1)
        ganho = np.interp(s0 + np.arange(n), e0 + np.arange(m) * D, ganho_ctrl).astype(np.float32)
        orig *= ganho[:, None]
    mix = orig + voz[:, None]
    return limitar(mix), voz


class Microfone:
    """Mantém o microfone aberto o tempo todo (para o medidor de nível) e só
    guarda o áudio enquanto está gravando."""

    def __init__(self):
        self.stream = None
        self.sr = SR
        self.gravando = False
        self.buf = []
        self.nivel = 0.0
        self.lock = threading.Lock()

    def abrir(self, dispositivo):
        self.fechar()
        erro = None
        taxas = [SR]
        try:
            taxas.append(int(sd.query_devices(dispositivo)["default_samplerate"]))
        except Exception:
            pass
        for taxa in taxas:
            try:
                st = sd.InputStream(device=dispositivo, channels=1, samplerate=taxa,
                                    dtype="float32", callback=self._cb)
                st.start()
                self.stream, self.sr = st, taxa
                return
            except Exception as e:
                erro = e
        raise erro if erro else RuntimeError("não foi possível abrir o microfone")

    def _cb(self, indata, frames, t, status):
        mono = indata[:, 0]
        pk = float(np.abs(mono).max()) if len(mono) else 0.0
        if pk > self.nivel:
            self.nivel = pk
        if self.gravando:
            with self.lock:
                self.buf.append(mono.copy())

    def pegar_nivel(self):
        v, self.nivel = self.nivel, 0.0
        return v

    def latencia(self):
        try:
            lat = self.stream.latency
            return float(lat[0] if isinstance(lat, (tuple, list)) else lat)
        except Exception:
            return 0.0

    def iniciar(self):
        with self.lock:
            self.buf = []
        self.gravando = True

    def parar(self):
        self.gravando = False
        with self.lock:
            dados = np.concatenate(self.buf) if self.buf else np.zeros(0, dtype=np.float32)
            self.buf = []
        return dados

    def fechar(self):
        self.gravando = False
        if self.stream is not None:
            try:
                self.stream.stop()
                self.stream.close()
            except Exception:
                pass
        self.stream = None


def listar_microfones():
    devs = sd.query_devices()
    try:
        padrao = sd.default.device[0]
    except Exception:
        padrao = -1
    if padrao is None or padrao < 0:
        try:
            padrao = sd.query_devices(kind="input")["index"]
        except Exception:
            padrao = -1
    api = devs[padrao]["hostapi"] if 0 <= padrao < len(devs) else None
    lista = []
    for i, d in enumerate(devs):
        if d["max_input_channels"] > 0 and (api is None or d["hostapi"] == api):
            lista.append((i, d["name"] + ("  (padrão do Windows)" if i == padrao else "")))
    if not lista:
        apis = sd.query_hostapis()
        for i, d in enumerate(devs):
            if d["max_input_channels"] > 0:
                lista.append((i, f"{d['name']} [{apis[d['hostapi']]['name']}]"))
    return lista, padrao


# --------------------------------------------------------------------------- #
#  Vídeo
# --------------------------------------------------------------------------- #
class Video:
    def __init__(self, caminho):
        self.caminho = caminho
        self.cap = cv2.VideoCapture(caminho)
        if not self.cap.isOpened():
            raise RuntimeError("Não consegui abrir este vídeo.")
        self.fps = self.cap.get(cv2.CAP_PROP_FPS) or 30.0
        if self.fps <= 1 or self.fps > 240:
            self.fps = 30.0
        nfr = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        dur = duracao_ffmpeg(caminho)
        self.duracao = dur if dur else (nfr / self.fps if nfr else 0)
        self.nframes = nfr if nfr > 0 else int(self.duracao * self.fps)
        self.prox = 0
        self.ult_idx = -1
        self.ult_frame = None

    def frame_em(self, t):
        idx = int(max(0.0, t) * self.fps)
        idx = max(0, min(idx, max(0, self.nframes - 1)))
        if idx == self.ult_idx and self.ult_frame is not None:
            return self.ult_frame, idx
        if idx < self.prox or idx - self.prox > self.fps * 2:
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            self.prox = idx
        while self.prox < idx:
            if not self.cap.grab():
                break
            self.prox += 1
        ok, fr = self.cap.read()
        self.prox += 1
        if ok:
            self.ult_frame, self.ult_idx = fr, idx
        return self.ult_frame, self.ult_idx

    def fechar(self):
        try:
            self.cap.release()
        except Exception:
            pass


# --------------------------------------------------------------------------- #
#  Projeto (guarda as gravações de cada vídeo para poder continuar depois)
# --------------------------------------------------------------------------- #
class Projeto:
    def __init__(self, video_path):
        base = os.path.basename(video_path)
        tam = os.path.getsize(video_path)
        chave = hashlib.sha1(f"{base}|{tam}".encode("utf-8")).hexdigest()[:8]
        self.nome = re.sub(r"[^\w\-]+", "_", os.path.splitext(base)[0]).strip("_")[:40] or "video"
        self.dir = os.path.join(PROJ_ROOT, f"{self.nome}_{chave}")
        os.makedirs(self.dir, exist_ok=True)
        self.json = os.path.join(self.dir, "projeto.json")
        self.dados = {"video": video_path, "roteiro": None, "trechos": {}}
        if os.path.exists(self.json):
            try:
                with open(self.json, encoding="utf-8") as f:
                    self.dados.update(json.load(f))
            except Exception:
                log_erro(traceback.format_exc())
        self.dados["video"] = video_path
        self.salvar()

    def caminho(self, nome):
        return os.path.join(self.dir, nome)

    def info(self, n):
        return self.dados["trechos"].setdefault(str(n), {"status": "pendente"})

    def tem_take(self, n):
        inf = self.dados["trechos"].get(str(n), {})
        return bool(inf.get("take")) and os.path.exists(self.caminho(inf["take"]))

    def salvar(self):
        tmp = self.json + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(self.dados, f, ensure_ascii=False, indent=2)
        os.replace(tmp, self.json)


# --------------------------------------------------------------------------- #
#  Interface
# --------------------------------------------------------------------------- #
STATUS_ROTULO = {"pendente": "○ pendente", "gravado": "● revisar", "aprovado": "✔ aprovado"}


class App:
    def __init__(self, root):
        self.root = root
        self.cfg = carregar_cfg()
        self.mic = Microfone()
        self.video = None
        self.projeto = None
        self.trechos = []
        self.atual = None
        self.roteiro_path = None
        self.orig_wav = None
        self.estado = "parado"     # parado | gravando | tocando | exportando
        self.fila = queue.Queue()
        self.cache_takes = {}
        self.palavras = []
        self.cum = None
        self.prog_palavra = -1
        self.vu_val = 0.0
        self._foto = None
        self._ult_render = None
        self._t_tela = 0.0

        os.makedirs(PROJ_ROOT, exist_ok=True)
        os.makedirs(OUT_DIR, exist_ok=True)

        root.title("Dublador Animamente")
        root.geometry("1400x880")
        root.minsize(1100, 700)
        root.configure(bg=TINTA)
        root.report_callback_exception = self._erro_tk
        self._estilo()
        self._montar()
        self._atalhos()
        self._carregar_mics()
        root.protocol("WM_DELETE_WINDOW", self._fechar)
        root.after(30, self._tick)
        root.after(300, self._boas_vindas)

    # ------------------------------------------------------------------ UI
    def _estilo(self):
        st = ttk.Style()
        try:
            st.theme_use("clam")
        except Exception:
            pass
        base = ("Segoe UI", 10)
        st.configure(".", font=base)
        st.configure("TFrame", background="#F3F2F8")
        st.configure("Topo.TFrame", background=TINTA)
        st.configure("Topo.TLabel", background=TINTA, foreground=NEVOA)
        st.configure("TLabel", background="#F3F2F8")
        st.configure("TLabelframe", background="#F3F2F8")
        st.configure("TLabelframe.Label", background="#F3F2F8", font=("Segoe UI", 10, "bold"))
        st.configure("TCheckbutton", background="#F3F2F8")
        st.configure("TRadiobutton", background="#F3F2F8")
        st.configure("TButton", padding=(10, 6))
        st.configure("Rec.TButton", font=("Segoe UI", 11, "bold"), foreground="white", background=CORAL)
        st.map("Rec.TButton", background=[("active", "#D93A5C"), ("disabled", "#E9A3B3")])
        st.configure("Ok.TButton", font=("Segoe UI", 11, "bold"), foreground=TINTA, background=AMARELO)
        st.map("Ok.TButton", background=[("active", "#F2B21F"), ("disabled", "#F5DFA8")])
        st.configure("Exp.TButton", font=("Segoe UI", 11, "bold"), foreground="white", background=TINTA)
        st.map("Exp.TButton", background=[("active", "#2E2758"), ("disabled", ARDOSIA)])
        st.configure("Treeview", rowheight=26, font=("Segoe UI", 10))
        st.configure("Treeview.Heading", font=("Segoe UI", 10, "bold"))
        st.configure("Tempo.Horizontal.TProgressbar", background=CORAL, troughcolor="#E4E2EE")

    def _montar(self):
        r = self.root
        # ---- barra superior
        topo = ttk.Frame(r, style="Topo.TFrame", padding=(10, 8))
        topo.pack(fill="x")
        for txt, cmd in (("🎬 Abrir vídeo", self.abrir_video),
                         ("📝 Abrir roteiro", self.abrir_roteiro),
                         ("⟳ Recarregar roteiro", self.recarregar_roteiro),
                         ("❔ Como escrever o roteiro", self.abrir_guia)):
            ttk.Button(topo, text=txt, command=cmd, takefocus=False).pack(side="left", padx=(0, 6))
        ttk.Label(topo, text="   Microfone:", style="Topo.TLabel").pack(side="left")
        self.cb_mic = ttk.Combobox(topo, state="readonly", width=42)
        self.cb_mic.pack(side="left", padx=6)
        self.cb_mic.bind("<<ComboboxSelected>>", lambda e: self._trocar_mic())
        self.vu = tk.Canvas(topo, width=150, height=16, bg="#2E2758", highlightthickness=0)
        self.vu.pack(side="left", padx=4)
        self.vu_rect = self.vu.create_rectangle(0, 0, 0, 16, fill=VERDE, width=0)
        ttk.Button(topo, text="↻", width=3, command=self._carregar_mics, takefocus=False).pack(side="left", padx=4)

        rod = ttk.Label(r, text="Atalhos:  Espaço = gravar / parar   ·   P = ouvir com vídeo   ·   "
                               "Enter = aprovar e próximo   ·   ↑ ↓ = trocar de trecho   ·   Esc = parar",
                        style="Topo.TLabel", padding=(10, 4))
        rod.pack(fill="x", side="bottom")
        self.lbl_arquivos = ttk.Label(rod, text="Nenhum vídeo aberto", style="Topo.TLabel")
        self.lbl_arquivos.place(relx=1.0, rely=0.5, anchor="e", x=-10)

        corpo = ttk.PanedWindow(r, orient="horizontal")
        corpo.pack(fill="both", expand=True, padx=8, pady=8)

        # ---- coluna esquerda: trechos + opções + exportar
        esq = ttk.Frame(corpo, width=360)
        corpo.add(esq, weight=0)
        ttk.Label(esq, text="Trechos do roteiro", font=("Segoe UI", 11, "bold")).pack(anchor="w")
        fr_tree = ttk.Frame(esq)
        fr_tree.pack(fill="both", expand=True, pady=(4, 6))
        self.tree = ttk.Treeview(fr_tree, columns=("n", "tempo", "loc", "status"), show="headings",
                                 selectmode="browse", height=6)
        for col, txt, w, anc in (("n", "#", 32, "center"), ("tempo", "Tempo", 138, "w"),
                                 ("loc", "Quem fala", 80, "w"), ("status", "Status", 92, "w")):
            self.tree.heading(col, text=txt)
            self.tree.column(col, width=w, anchor=anc, stretch=(col == "loc"))
        sb = ttk.Scrollbar(fr_tree, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=sb.set)
        self.tree.pack(side="left", fill="both", expand=True)
        sb.pack(side="right", fill="y")
        self.tree.tag_configure("pendente", foreground="#333")
        self.tree.tag_configure("gravado", background="#FFF1CC")
        self.tree.tag_configure("aprovado", background="#D9F5E7")
        self.tree.bind("<<TreeviewSelect>>", self._ao_selecionar)

        op = ttk.LabelFrame(esq, text="Opções", padding=8)
        op.pack(fill="x")
        self.var_ouvir_orig = tk.BooleanVar(value=self.cfg["ouvir_original"])
        self.var_auto = tk.BooleanVar(value=self.cfg["ouvir_auto"])
        self.var_modo = tk.StringVar(value=self.cfg["modo_posicao"])
        self.var_vol = tk.IntVar(value=self.cfg["vol_original"])
        self.var_duck = tk.IntVar(value=self.cfg["duck"])
        self.var_folga = tk.DoubleVar(value=self.cfg["folga"])
        self.var_fonte = tk.IntVar(value=self.cfg["fonte"])
        ttk.Checkbutton(op, text="Ouvir o som do vídeo enquanto grava (use fone!)",
                        variable=self.var_ouvir_orig, takefocus=False).pack(anchor="w")
        ttk.Checkbutton(op, text="Tocar a revisão logo depois de gravar",
                        variable=self.var_auto, takefocus=False).pack(anchor="w")
        ttk.Label(op, text="Onde colocar cada fala:").pack(anchor="w", pady=(6, 0))
        ttk.Radiobutton(op, text="Exatamente no tempo do roteiro", value="roteiro",
                        variable=self.var_modo, command=self._opcao_mudou, takefocus=False).pack(anchor="w")
        ttk.Radiobutton(op, text="No momento em que eu comecei a falar", value="natural",
                        variable=self.var_modo, command=self._opcao_mudou, takefocus=False).pack(anchor="w")
        fr = ttk.Frame(op)
        fr.pack(fill="x", pady=(6, 0))
        ttk.Label(fr, text="Volume do som original (%)").grid(row=0, column=0, sticky="w")
        tk.Scale(fr, from_=0, to=150, orient="horizontal", variable=self.var_vol, length=150,
                 bg="#F3F2F8", highlightthickness=0, takefocus=0,
                 command=lambda v: self._opcao_mudou()).grid(row=0, column=1)
        ttk.Label(fr, text="Som original durante a voz (%)").grid(row=1, column=0, sticky="w")
        tk.Scale(fr, from_=0, to=100, orient="horizontal", variable=self.var_duck, length=150,
                 bg="#F3F2F8", highlightthickness=0, takefocus=0,
                 command=lambda v: self._opcao_mudou()).grid(row=1, column=1)
        ttk.Label(fr, text="Tempo extra no fim do trecho (s)").grid(row=2, column=0, sticky="w", pady=2)
        ttk.Spinbox(fr, from_=0, to=10, increment=0.5, width=6, textvariable=self.var_folga,
                    command=self._opcao_mudou).grid(row=2, column=1, sticky="w")
        ttk.Label(fr, text="Tamanho da letra").grid(row=3, column=0, sticky="w", pady=2)
        ttk.Spinbox(fr, from_=14, to=72, increment=2, width=6, textvariable=self.var_fonte,
                    command=self._mudar_fonte).grid(row=3, column=1, sticky="w")

        ex = ttk.LabelFrame(esq, text="Finalizar", padding=8)
        ex.pack(fill="x", pady=(6, 0))
        self.b_exportar = ttk.Button(ex, text="💾 Exportar vídeo final", style="Exp.TButton",
                                     command=self.exportar, takefocus=False)
        self.b_exportar.pack(fill="x")
        self.pb_exp = ttk.Progressbar(ex, mode="determinate", maximum=100)
        self.pb_exp.pack(fill="x", pady=4)
        self.lbl_exp = ttk.Label(ex, text="", foreground=ARDOSIA)
        self.lbl_exp.pack(anchor="w")
        ttk.Button(ex, text="📂 Abrir pasta dos vídeos prontos", takefocus=False,
                   command=lambda: abrir_no_sistema(OUT_DIR)).pack(fill="x", pady=(4, 0))

        # ---- coluna central: vídeo + teleprompter + controles
        centro = ttk.Frame(corpo)
        corpo.add(centro, weight=1)
        self.canvas = tk.Canvas(centro, bg="black", highlightthickness=0)
        self.canvas.pack(fill="both", expand=True)
        self.img_id = self.canvas.create_image(0, 0, anchor="center")
        self.cd_id = self.canvas.create_text(0, 0, text="", fill=AMARELO,
                                             font=("Segoe UI", 110, "bold"), tags=("overlay",))
        self.rec_id = self.canvas.create_text(16, 16, text="", fill=CORAL, anchor="nw",
                                              font=("Segoe UI", 16, "bold"), tags=("overlay",))
        self.tempo_id = self.canvas.create_text(16, 0, text="", fill=NEVOA, anchor="sw",
                                                font=("Consolas", 12), tags=("overlay",))
        self.canvas.bind("<Configure>", lambda e: self._redesenhar())

        self.lbl_loc = tk.Label(centro, text="", bg=TINTA, fg=AMARELO, anchor="w",
                                font=("Segoe UI", 12, "bold"), padx=14, pady=4)
        self.lbl_loc.pack(fill="x")
        self.tp = tk.Text(centro, height=4, wrap="word", bg=TINTA, fg=NEVOA, bd=0,
                          font=("Segoe UI Semibold", self.var_fonte.get()), padx=24, pady=10,
                          cursor="arrow", spacing2=6, spacing3=4, takefocus=0)
        self.tp.pack(fill="x")
        self.tp.tag_configure("centro", justify="center")
        self.tp.tag_configure("dir", foreground=LAVANDA,
                              font=("Segoe UI", max(10, self.var_fonte.get() - 8), "italic"))
        self.tp.tag_configure("lido", foreground=LIDO)
        self.tp.tag_configure("atual", foreground=AMARELO, underline=True)
        self.tp.configure(state="disabled")
        self.lbl_prox = tk.Label(centro, text="", bg=TINTA, fg=ARDOSIA, anchor="w",
                                 font=("Segoe UI", 10), padx=14, pady=4)
        self.lbl_prox.pack(fill="x")
        self.pb_tempo = ttk.Progressbar(centro, mode="determinate", maximum=100,
                                        style="Tempo.Horizontal.TProgressbar")
        self.pb_tempo.pack(fill="x")

        ctl = ttk.Frame(centro, padding=(0, 8, 0, 0))
        ctl.pack(fill="x")
        self.b_gravar = ttk.Button(ctl, text="● Gravar  [Espaço]", style="Rec.TButton",
                                   command=self.gravar, takefocus=False)
        self.b_gravar.pack(side="left")
        self.b_ouvir = ttk.Button(ctl, text="▶ Ouvir com vídeo  [P]", command=self.ouvir_com_video,
                                  takefocus=False)
        self.b_ouvir.pack(side="left", padx=6)
        self.b_voz = ttk.Button(ctl, text="🔊 Só a voz", command=self.ouvir_voz, takefocus=False)
        self.b_voz.pack(side="left")
        self.b_aprovar = ttk.Button(ctl, text="✔ Aprovar e ir para o próximo  [Enter]",
                                    style="Ok.TButton", command=self.aprovar, takefocus=False)
        self.b_aprovar.pack(side="right")

        ctl2 = ttk.Frame(centro, padding=(0, 6, 0, 0))
        ctl2.pack(fill="x")
        ttk.Label(ctl2, text="Ajuste fino da posição (s):").pack(side="left")
        self.var_ajuste = tk.DoubleVar(value=0.0)
        self.sp_ajuste = ttk.Spinbox(ctl2, from_=-5, to=5, increment=0.05, width=7,
                                     textvariable=self.var_ajuste, command=self._ajuste_mudou)
        self.sp_ajuste.pack(side="left", padx=4)
        self.sp_ajuste.bind("<Return>", lambda e: self._ajuste_mudou())
        self.sp_ajuste.bind("<FocusOut>", lambda e: self._ajuste_mudou())
        self.b_acelerar = ttk.Button(ctl2, text="⏩ Acelerar para caber", command=self.acelerar,
                                     takefocus=False)
        self.b_acelerar.pack(side="left", padx=8)
        self.lbl_info = tk.Label(ctl2, text="Abra um vídeo e um roteiro para começar.",
                                 bg="#F3F2F8", fg=ARDOSIA, anchor="w", font=("Segoe UI", 10, "bold"))
        self.lbl_info.pack(side="left", fill="x", expand=True, padx=8)


    def _atalhos(self):
        def ligar(seq, acao):
            def h(ev):
                if isinstance(ev.widget, (tk.Entry, ttk.Entry, tk.Spinbox, ttk.Spinbox, ttk.Combobox)):
                    return None
                if seq in ("<Up>", "<Down>") and isinstance(ev.widget, ttk.Treeview):
                    return None  # a própria lista já troca de trecho
                acao()
                return "break"
            self.root.bind_all(seq, h)
        ligar("<space>", self.gravar)
        ligar("<Return>", self.aprovar)
        ligar("<KP_Enter>", self.aprovar)
        ligar("<p>", self.ouvir_com_video)
        ligar("<P>", self.ouvir_com_video)
        ligar("<Escape>", self.parar_tudo)
        ligar("<Up>", lambda: self._mover(-1))
        ligar("<Down>", lambda: self._mover(1))

    def _boas_vindas(self):
        if not self.video:
            self._mostrar_texto_livre(
                "Bem-vindo ao Dublador! 1) Abra o vídeo  2) Abra o roteiro  "
                "3) Escolha o microfone  4) Aperte Espaço para gravar cada trecho.")

    # ------------------------------------------------------------- microfone
    def _carregar_mics(self):
        try:
            self.mics, padrao = listar_microfones()
        except Exception as e:
            self.mics, padrao = [], -1
            log_erro(traceback.format_exc())
            messagebox.showerror("Microfone", f"Não consegui listar os microfones:\n{e}")
        self.cb_mic["values"] = [m[1] for m in self.mics]
        if not self.mics:
            self.cb_mic.set("Nenhum microfone encontrado")
            return
        escolha = 0
        for k, (i, nome) in enumerate(self.mics):
            if self.cfg.get("mic_nome") and nome == self.cfg["mic_nome"]:
                escolha = k
                break
            if i == padrao:
                escolha = k
        self.cb_mic.current(escolha)
        self._trocar_mic()

    def _trocar_mic(self):
        if self.estado == "gravando":
            return
        k = self.cb_mic.current()
        if k < 0 or k >= len(self.mics):
            return
        idx, nome = self.mics[k]
        try:
            self.mic.abrir(idx)
            self.cfg["mic_nome"] = nome
            salvar_cfg(self.cfg)
        except Exception as e:
            log_erro(traceback.format_exc())
            messagebox.showerror("Microfone", f"Não consegui abrir \"{nome}\".\nEscolha outro na lista.\n\n{e}")

    # ---------------------------------------------------------------- arquivos
    def abrir_video(self):
        if self.estado == "exportando":
            return
        p = filedialog.askopenfilename(
            title="Escolha o vídeo", initialdir=self.cfg.get("ultimo_dir") or os.path.expanduser("~"),
            filetypes=[("Vídeos", "*.mp4 *.mov *.mkv *.webm *.avi *.m4v"), ("Todos os arquivos", "*.*")])
        if p:
            self.cfg["ultimo_dir"] = os.path.dirname(p)
            self.carregar_video(p)

    def carregar_video(self, p):
        self.parar_tudo()
        try:
            v = Video(p)
        except Exception as e:
            messagebox.showerror("Vídeo", f"Não consegui abrir o vídeo:\n{e}")
            return
        if self.video:
            self.video.fechar()
        self.video = v
        self.projeto = Projeto(p)
        self.cache_takes.clear()
        self.orig_wav = None
        self._t_tela = 0.0
        self._ult_render = None
        self._extrair_audio_original()
        self.root.title(f"Dublador Animamente — {os.path.basename(p)}")
        roteiro_salvo = self.projeto.dados.get("roteiro")
        if roteiro_salvo and os.path.exists(roteiro_salvo):
            self.roteiro_path = roteiro_salvo   # continua de onde parou
        if self.roteiro_path:
            self.aplicar_roteiro()
        else:
            self._mostrar_frame(0)
            self._mostrar_texto_livre("Vídeo aberto! Agora clique em “📝 Abrir roteiro”.")
        self._atualizar_rotulo_arquivos()

    def _extrair_audio_original(self):
        proj = self.projeto
        destino = proj.caminho("audio_original.wav")
        if os.path.exists(destino) and os.path.getsize(destino) > 1000:
            self.orig_wav = destino
            return
        if proj.dados.get("sem_audio"):
            return
        video = self.video.caminho

        def trabalho():
            code, err = rodar_ffmpeg(["-i", video, "-vn", "-ac", "2", "-ar", str(SR),
                                      "-c:a", "pcm_s16le", destino])
            ok = code == 0 and os.path.exists(destino) and os.path.getsize(destino) > 1000
            self.fila.put(("audio_orig", proj, destino if ok else None))
        threading.Thread(target=trabalho, daemon=True).start()

    def abrir_roteiro(self):
        if self.estado == "exportando":
            return
        p = filedialog.askopenfilename(
            title="Escolha o roteiro", initialdir=self.cfg.get("ultimo_dir") or APP_DIR,
            filetypes=[("Roteiro (texto)", "*.txt *.md"), ("Todos os arquivos", "*.*")])
        if p:
            self.cfg["ultimo_dir"] = os.path.dirname(p)
            self.roteiro_path = p
            self.aplicar_roteiro()

    def recarregar_roteiro(self):
        if not self.roteiro_path:
            messagebox.showinfo("Roteiro", "Abra um roteiro primeiro.")
            return
        self.aplicar_roteiro(manter_posicao=True)

    def aplicar_roteiro(self, manter_posicao=False):
        self.parar_tudo()
        try:
            texto = ler_texto_arquivo(self.roteiro_path)
            trechos, avisos = ler_roteiro(texto, self.video.duracao if self.video else None)
        except ErroRoteiro as e:
            messagebox.showerror("Roteiro com problema",
                                 f"{e}\n\nCorrija o arquivo e clique em “⟳ Recarregar roteiro”.\n"
                                 "Dúvidas? Clique em “❔ Como escrever o roteiro”.")
            return
        except Exception as e:
            log_erro(traceback.format_exc())
            messagebox.showerror("Roteiro", f"Não consegui ler o roteiro:\n{e}")
            return
        anterior = self.atual
        self.trechos = trechos
        self.cache_takes.clear()
        if self.projeto:
            self.projeto.dados["roteiro"] = self.roteiro_path
            for t in trechos:
                inf = self.projeto.info(t.n)
                if inf.get("sig") and inf["sig"] != t.assinatura():
                    # o texto mudou: a gravação antiga não vale mais
                    inf.update({"status": "pendente", "take": None, "sig": None})
                if inf.get("status") != "pendente" and not self.projeto.tem_take(t.n):
                    inf["status"] = "pendente"
            self.projeto.salvar()
        self._preencher_lista()
        alvo = 0
        if manter_posicao and anterior is not None and anterior < len(trechos):
            alvo = anterior
        else:
            for k, t in enumerate(trechos):
                if self._status(t.n) != "aprovado":
                    alvo = k
                    break
        self._selecionar(alvo)
        self._atualizar_rotulo_arquivos()
        if avisos:
            messagebox.showwarning("Atenção ao roteiro", "\n\n".join(avisos[:12]) +
                                   ("\n\n..." if len(avisos) > 12 else ""))
        if not self.video:
            self._mostrar_texto_livre("Roteiro aberto! Agora clique em “🎬 Abrir vídeo”.")

    def abrir_guia(self):
        if os.path.exists(GUIA_PATH):
            abrir_no_sistema(GUIA_PATH)
        if os.path.exists(MODELO_PATH):
            abrir_no_sistema(MODELO_PATH)

    def _atualizar_rotulo_arquivos(self):
        v = os.path.basename(self.video.caminho) if self.video else "—"
        r = os.path.basename(self.roteiro_path) if self.roteiro_path else "—"
        self.lbl_arquivos.configure(text=f"Vídeo: {v}    Roteiro: {r}")

    # ------------------------------------------------------------- lista
    def _status(self, n):
        if not self.projeto:
            return "pendente"
        return self.projeto.dados["trechos"].get(str(n), {}).get("status", "pendente")

    def _preencher_lista(self):
        self.tree.delete(*self.tree.get_children())
        for k, t in enumerate(self.trechos):
            st = self._status(t.n)
            self.tree.insert("", "end", iid=str(k), tags=(st,),
                             values=(t.n, f"{fmt(t.inicio)} – {fmt(t.fim)}", t.locutor or "—",
                                     STATUS_ROTULO.get(st, st)))

    def _atualizar_linha(self, k):
        t = self.trechos[k]
        st = self._status(t.n)
        self.tree.item(str(k), tags=(st,), values=(t.n, f"{fmt(t.inicio)} – {fmt(t.fim)}",
                                                   t.locutor or "—", STATUS_ROTULO.get(st, st)))

    def _ao_selecionar(self, _ev=None):
        sel = self.tree.selection()
        if not sel:
            return
        k = int(sel[0])
        if self.estado == "gravando":
            if self.atual is not None and k != self.atual:
                self.tree.selection_set(str(self.atual))
            return
        if k != self.atual:
            self._ir_para(k)

    def _selecionar(self, k):
        if not self.trechos:
            return
        k = max(0, min(k, len(self.trechos) - 1))
        self.tree.selection_set(str(k))
        self.tree.see(str(k))
        self._ir_para(k)

    def _mover(self, d):
        if self.estado == "gravando" or not self.trechos:
            return
        self._selecionar((self.atual or 0) + d)

    def _ir_para(self, k):
        if self.estado == "tocando":
            self.parar_reproducao()
        self.atual = k
        t = self.trechos[k]
        self._mostrar_texto(t)
        quem = f"{t.locutor}  ·  " if t.locutor else ""
        self.lbl_loc.configure(text=f"Trecho {t.n}/{len(self.trechos)}  ·  {quem}"
                                    f"{fmt(t.inicio)} → {fmt(t.fim)}  ({t.janela:.1f} s)")
        if k + 1 < len(self.trechos):
            p = self.trechos[k + 1]
            prev = re.sub(r"\s+", " ", p.texto)[:110]
            self.lbl_prox.configure(text=f"A seguir{(' (' + p.locutor + ')') if p.locutor else ''}: {prev}")
        else:
            self.lbl_prox.configure(text="Este é o último trecho.")
        inf = self.projeto.info(t.n) if self.projeto else {}
        self.var_ajuste.set(round(float(inf.get("ajuste", 0.0)), 2))
        self.pb_tempo["value"] = 0
        self._mostrar_frame(t.inicio)
        self._atualizar_info()

    # -------------------------------------------------------- teleprompter
    def _mostrar_texto_livre(self, txt):
        T = self.tp
        T.configure(state="normal")
        T.delete("1.0", "end")
        T.insert("1.0", txt, ("centro",))
        T.configure(state="disabled")
        self.palavras, self.cum = [], None

    def _mostrar_texto(self, t):
        T = self.tp
        T.configure(state="normal")
        T.delete("1.0", "end")
        T.insert("1.0", t.texto, ("centro",))
        self.palavras = []
        pesos = []
        for m in re.finditer(r"\([^)]*\)|\S+", t.texto):
            a, b = f"1.0+{m.start()}c", f"1.0+{m.end()}c"
            w = m.group()
            if w.startswith("("):
                T.tag_add("dir", a, b)
                peso = 6
            else:
                peso = len(w) + 2 + (6 if w[-1] in ".!?…" else 3 if w[-1] in ",;:" else 0)
            self.palavras.append((a, b))
            pesos.append(peso)
        self.cum = (np.cumsum(pesos) / max(1, sum(pesos))) if pesos else None
        T.configure(state="disabled")
        T.yview_moveto(0)
        self.prog_palavra = -1

    def _destacar(self, frac):
        if self.cum is None or not self.palavras:
            return
        k = int(np.searchsorted(self.cum, min(max(frac, 0.0), 1.0)))
        k = min(k, len(self.palavras) - 1)
        if k == self.prog_palavra:
            return
        self.prog_palavra = k
        T = self.tp
        T.tag_remove("lido", "1.0", "end")
        T.tag_remove("atual", "1.0", "end")
        a, b = self.palavras[k]
        T.tag_add("lido", "1.0", a)
        T.tag_add("atual", a, b)
        T.see(b)

    def _limpar_destaque(self):
        self.tp.tag_remove("lido", "1.0", "end")
        self.tp.tag_remove("atual", "1.0", "end")
        self.prog_palavra = -1
        self.tp.yview_moveto(0)

    def _mudar_fonte(self):
        try:
            tam = int(self.var_fonte.get())
        except Exception:
            return
        self.tp.configure(font=("Segoe UI Semibold", tam))
        self.tp.tag_configure("dir", font=("Segoe UI", max(10, tam - 8), "italic"))
        self._opcao_mudou()

    # ---------------------------------------------------------------- vídeo
    def _mostrar_frame(self, t):
        if not self.video:
            return
        self._t_tela = t
        fr, idx = self.video.frame_em(t)
        cw, ch = self.canvas.winfo_width(), self.canvas.winfo_height()
        self.canvas.coords(self.cd_id, cw / 2, ch / 2)
        self.canvas.coords(self.tempo_id, 12, ch - 8)
        self.canvas.itemconfigure(self.tempo_id, text=f"{fmt(t)} / {fmt(self.video.duracao)}")
        if fr is None or cw < 10 or ch < 10:
            return
        chave = (idx, cw, ch)
        if chave == self._ult_render:
            return
        self._ult_render = chave
        h, w = fr.shape[:2]
        esc = min(cw / w, ch / h)
        nw, nh = max(1, int(w * esc)), max(1, int(h * esc))
        img = cv2.resize(fr, (nw, nh), interpolation=cv2.INTER_AREA if esc < 1 else cv2.INTER_LINEAR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self._foto = ImageTk.PhotoImage(Image.fromarray(img))
        self.canvas.itemconfigure(self.img_id, image=self._foto)
        self.canvas.coords(self.img_id, cw / 2, ch / 2)
        self.canvas.tag_raise("overlay")

    def _redesenhar(self):
        self._ult_render = None
        if self.video:
            self._mostrar_frame(self._t_tela)

    # ------------------------------------------------------------- takes
    def _trecho(self):
        if self.atual is None or not self.trechos:
            return None
        return self.trechos[self.atual]

    def _take(self, t):
        if not self.projeto or not self.projeto.tem_take(t.n):
            return None
        inf = self.projeto.info(t.n)
        caminho = self.projeto.caminho(inf["take"])
        mt = os.path.getmtime(caminho)
        c = self.cache_takes.get(t.n)
        if c and c[0] == mt:
            return c[1]
        y, sr = sf.read(caminho, dtype="float32", always_2d=False)
        if y.ndim > 1:
            y = y.mean(axis=1)
        y = reamostrar(y, sr, SR)
        self.cache_takes[t.n] = (mt, y)
        return y

    def _pos(self, t):
        inf = self.projeto.info(t.n)
        base = t.inicio
        if self.var_modo.get() == "natural":
            base += float(inf.get("rel", 0.0))
        return max(0.0, base + float(inf.get("ajuste", 0.0)))

    def _limite(self, k):
        if k + 1 < len(self.trechos):
            return self.trechos[k + 1].inicio
        return self.video.duracao if self.video else self.trechos[k].fim

    def _atualizar_info(self):
        t = self._trecho()
        if not t:
            return
        y = self._take(t)
        tem = y is not None
        self.b_gravar.configure(text=("● Regravar  [Espaço]" if tem else "● Gravar  [Espaço]"))
        for b in (self.b_ouvir, self.b_voz, self.b_aprovar, self.b_acelerar):
            b.configure(state=("normal" if tem else "disabled"))
        if not tem:
            est = t.estimativa()
            self.lbl_info.configure(text=f"Ainda não gravado. Aperte Espaço para gravar "
                                         f"(janela de {t.janela:.1f} s, texto de ~{est:.1f} s).",
                                    fg=ARDOSIA)
            return
        dur = len(y) / SR
        pos = self._pos(t)
        lim = self._limite(self.atual)
        fim_fala = pos + dur
        st = "aprovado ✔" if self._status(t.n) == "aprovado" else "esperando sua revisão"
        if fim_fala > lim + 0.05:
            self.lbl_info.configure(
                text=f"A fala tem {dur:.1f} s e passa {fim_fala - lim:.1f} s do início do próximo trecho "
                     f"({fmt(lim)}). Regrave mais rápido ou use “Acelerar para caber”.", fg="#C62842")
        elif fim_fala > t.fim + 0.05:
            self.lbl_info.configure(
                text=f"Fala de {dur:.1f} s: passou um pouco do fim do trecho, mas cabe antes do próximo. ({st})",
                fg="#B7791F")
        else:
            self.lbl_info.configure(
                text=f"Fala de {dur:.1f} s em {fmt(pos)} — cabe na janela de {t.janela:.1f} s. ({st})",
                fg="#1E8A57")

    def _ajuste_mudou(self):
        t = self._trecho()
        if not t or not self.projeto:
            return
        try:
            v = float(str(self.sp_ajuste.get()).replace(",", "."))
        except ValueError:
            return
        inf = self.projeto.info(t.n)
        if abs(float(inf.get("ajuste", 0.0)) - v) > 1e-6:
            inf["ajuste"] = v
            self.projeto.salvar()
            self._atualizar_info()

    def _opcao_mudou(self):
        try:
            self.cfg.update({
                "ouvir_original": bool(self.var_ouvir_orig.get()),
                "ouvir_auto": bool(self.var_auto.get()),
                "modo_posicao": self.var_modo.get(),
                "vol_original": int(self.var_vol.get()),
                "duck": int(self.var_duck.get()),
                "folga": float(self.var_folga.get()),
                "fonte": int(self.var_fonte.get()),
            })
        except Exception:
            return
        if self._trecho():
            self._atualizar_info()

    # ------------------------------------------------------------- gravação
    def gravar(self):
        if self.estado == "gravando":
            self.parar_gravacao()
            return
        if self.estado == "exportando":
            return
        if self.estado == "tocando":
            self.parar_reproducao()
        t = self._trecho()
        if not self.video:
            messagebox.showinfo("Dublador", "Abra o vídeo primeiro.")
            return
        if not t:
            messagebox.showinfo("Dublador", "Abra o roteiro primeiro.")
            return
        if self.mic.stream is None:
            messagebox.showerror("Microfone", "Nenhum microfone ativo. Escolha um na lista lá em cima.")
            return
        self._opcao_mudou()
        self.estado = "gravando"
        self.g_ini_video = t.inicio - PREROLL
        self.g_rec = False
        self.g_rec_vt0 = t.inicio
        try:
            self.g_folga = max(0.0, float(self.var_folga.get()))
        except Exception:
            self.g_folga = 1.5
        self._limpar_destaque()
        self.b_gravar.configure(text="■ Parar  [Espaço]")
        for b in (self.b_ouvir, self.b_voz, self.b_aprovar, self.b_acelerar, self.b_exportar):
            b.configure(state="disabled")
        self.lbl_info.configure(text="Prepare-se… a gravação começa quando a contagem chegar a zero.",
                                fg=CORAL)
        if self.var_ouvir_orig.get() and self.orig_wav:
            s0 = int(round(self.g_ini_video * SR))
            n = int(round((t.fim + self.g_folga - self.g_ini_video) * SR))
            som = ler_wav_amostras(self.orig_wav, s0, n) * (self.var_vol.get() / 100.0)
            try:
                sd.play(som, SR)
            except Exception:
                log_erro(traceback.format_exc())
        self.g_t0 = time.perf_counter()

    def _tick_gravacao(self):
        t = self._trecho()
        el = time.perf_counter() - self.g_t0
        vt = self.g_ini_video + el
        self._mostrar_frame(min(max(vt, 0.0), max(0.0, self.video.duracao - 0.01)))
        if vt < t.inicio:
            self.canvas.itemconfigure(self.cd_id, text=str(int(math.ceil(t.inicio - vt))))
            return
        if not self.g_rec:
            self.mic.iniciar()
            self.g_rec = True
            self.g_rec_vt0 = vt
            self.canvas.itemconfigure(self.cd_id, text="")
            self.canvas.itemconfigure(self.rec_id, text="● GRAVANDO")
            self.lbl_info.configure(text="Gravando… aperte Espaço quando terminar de falar.", fg=CORAL)
        dec = vt - t.inicio
        self._destacar(dec / max(t.janela * 0.95, 0.1))
        self.pb_tempo["value"] = min(100.0, dec / t.janela * 100.0)
        resta = t.fim - vt
        self.canvas.itemconfigure(
            self.rec_id, text=(f"● GRAVANDO   faltam {resta:.1f} s" if resta >= 0
                               else f"● GRAVANDO   tempo do trecho acabou (+{-resta:.1f} s)"))
        if vt >= t.fim + self.g_folga:
            self.parar_gravacao()

    def parar_gravacao(self):
        if self.estado != "gravando":
            return
        t = self._trecho()
        gravou = self.g_rec
        dados = self.mic.parar()
        try:
            sd.stop()
        except Exception:
            pass
        self.estado = "parado"
        self.canvas.itemconfigure(self.cd_id, text="")
        self.canvas.itemconfigure(self.rec_id, text="")
        self.b_exportar.configure(state="normal")
        self._limpar_destaque()
        if not gravou or len(dados) == 0:
            self._atualizar_info()
            self.lbl_info.configure(text="Gravação cancelada.", fg=ARDOSIA)
            return
        self._salvar_take(t, dados, self.mic.sr, self.g_rec_vt0, self.mic.latencia())

    def _salvar_take(self, t, dados, sr, vt0, lat):
        proj = self.projeto
        inf = proj.info(t.n)
        nome_bruto = f"trecho_{t.n:02d}_bruto.wav"
        sf.write(proj.caminho(nome_bruto), dados, sr, subtype="PCM_16")
        y, corte = processar_take(dados, sr)
        if y is None:
            self._atualizar_info()
            self.lbl_info.configure(text="Não ouvi nenhuma fala nesta gravação. Confira o microfone "
                                         "(a barrinha lá em cima deve mexer quando você fala).", fg="#C62842")
            return
        nome = f"trecho_{t.n:02d}.wav"
        sf.write(proj.caminho(nome), y, SR, subtype="PCM_16")
        inf.update({
            "status": "gravado",
            "sig": t.assinatura(),
            "bruto": nome_bruto,
            "take": nome,
            "rel": round((vt0 - lat) - t.inicio + corte, 4),
            "ajuste": 0.0,
            "velocidade": 1.0,
            "dur": round(len(y) / SR, 3),
            "gravado_em": datetime.now().isoformat(timespec="seconds"),
        })
        proj.salvar()
        self.cache_takes.pop(t.n, None)
        self.var_ajuste.set(0.0)
        self._atualizar_linha(self.atual)
        self._atualizar_info()
        if self.var_auto.get():
            self.root.after(250, self.ouvir_com_video)

    # ----------------------------------------------------------- revisão
    def _takes_no_intervalo(self, a, b):
        res = []
        for t in self.trechos:
            y = self._take(t)
            if y is None:
                continue
            p = self._pos(t)
            if p < b and p + len(y) / SR > a:
                res.append((int(round(p * SR)), y))
        return res

    def ouvir_com_video(self):
        if self.estado == "tocando":
            self.parar_reproducao()
            return
        if self.estado != "parado":
            return
        t = self._trecho()
        if not t or not self.video:
            return
        y = self._take(t)
        if y is None:
            return
        pos = self._pos(t)
        a = max(0.0, min(t.inicio, pos) - 0.6)
        b = min(self.video.duracao, max(t.fim, pos + len(y) / SR) + 0.6)
        s0, n = int(round(a * SR)), int(round((b - a) * SR))
        mix, _ = mixar(s0, n, self._takes_no_intervalo(a, b), self.orig_wav,
                       self.var_vol.get() / 100.0, self.var_duck.get() / 100.0)
        try:
            sd.play(mix, SR)
        except Exception as e:
            log_erro(traceback.format_exc())
            messagebox.showerror("Som", f"Não consegui tocar o áudio:\n{e}")
            return
        self.p_t0, self.p_a, self.p_b = time.perf_counter(), a, b
        self.estado = "tocando"
        self.b_ouvir.configure(text="■ Parar  [P]")

    def _tick_reproducao(self):
        vt = self.p_a + (time.perf_counter() - self.p_t0)
        if vt >= self.p_b:
            self.parar_reproducao()
            return
        self._mostrar_frame(vt)
        t = self._trecho()
        if t and t.inicio <= vt <= t.fim:
            self.pb_tempo["value"] = (vt - t.inicio) / t.janela * 100.0

    def parar_reproducao(self):
        try:
            sd.stop()
        except Exception:
            pass
        if self.estado == "tocando":
            self.estado = "parado"
        self.b_ouvir.configure(text="▶ Ouvir com vídeo  [P]")
        t = self._trecho()
        if t:
            self._mostrar_frame(t.inicio)
            self.pb_tempo["value"] = 0

    def ouvir_voz(self):
        if self.estado == "gravando":
            return
        t = self._trecho()
        if not t:
            return
        y = self._take(t)
        if y is not None:
            if self.estado == "tocando":
                self.parar_reproducao()
            sd.play(y, SR)

    def parar_tudo(self):
        if self.estado == "gravando":
            self.parar_gravacao()
        elif self.estado == "tocando":
            self.parar_reproducao()
        else:
            try:
                sd.stop()
            except Exception:
                pass

    def aprovar(self):
        if self.estado == "gravando":
            return
        t = self._trecho()
        if not t:
            return
        if self._take(t) is None:
            self.lbl_info.configure(text="Grave este trecho antes de aprovar (aperte Espaço).", fg="#C62842")
            return
        if self.estado == "tocando":
            self.parar_reproducao()
        self.projeto.info(t.n)["status"] = "aprovado"
        self.projeto.salvar()
        self._atualizar_linha(self.atual)
        n = len(self.trechos)
        for d in range(1, n + 1):
            k = (self.atual + d) % n
            if self._status(self.trechos[k].n) != "aprovado":
                self._selecionar(k)
                return
        self._atualizar_info()
        messagebox.showinfo("Tudo pronto!", "Todos os trechos foram aprovados. 🎉\n\n"
                                            "Clique em “💾 Exportar vídeo final”.")

    def acelerar(self):
        if self.estado != "parado":
            return
        t = self._trecho()
        y = self._take(t) if t else None
        if y is None:
            return
        pos = self._pos(t)
        disp = self._limite(self.atual) - pos - 0.05
        dur = len(y) / SR
        if disp <= 0.2:
            messagebox.showinfo("Acelerar", "Não sobra espaço para esta fala. Mude o ajuste fino ou regrave.")
            return
        fator = dur / disp
        if fator <= 1.0:
            messagebox.showinfo("Acelerar", "Esta fala já cabe antes do próximo trecho. 👍")
            return
        if fator > 1.3 and not messagebox.askyesno(
                "Acelerar", f"Seria preciso acelerar {int((fator - 1) * 100)}% — a voz pode ficar estranha.\n"
                            "Quer acelerar mesmo assim? (Regravar costuma ficar melhor.)"):
            return
        inf = self.projeto.info(t.n)
        orig = self.projeto.caminho(inf["take"])
        tmp = self.projeto.caminho(f"trecho_{t.n:02d}_tmp.wav")
        code, err = rodar_ffmpeg(["-i", orig, "-filter:a", f"atempo={fator:.4f}",
                                  "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", tmp])
        if code != 0:
            log_erro(err)
            messagebox.showerror("Acelerar", "Não consegui acelerar o áudio (detalhes em erros.log).")
            return
        os.replace(tmp, orig)
        inf["velocidade"] = round(float(inf.get("velocidade", 1.0)) * fator, 4)
        inf["status"] = "gravado"
        self.projeto.salvar()
        self.cache_takes.pop(t.n, None)
        self._atualizar_linha(self.atual)
        self._atualizar_info()

    # ------------------------------------------------------------ exportar
    def exportar(self):
        if self.estado != "parado":
            if self.estado == "tocando":
                self.parar_reproducao()
            else:
                return
        if not self.video or not self.trechos:
            messagebox.showinfo("Exportar", "Abra o vídeo e o roteiro primeiro.")
            return
        sem = [t.n for t in self.trechos if self._take(t) is None]
        nao_ap = [t.n for t in self.trechos if self._status(t.n) != "aprovado" and t.n not in sem]
        if sem or nao_ap:
            msg = []
            if sem:
                msg.append(f"Sem gravação (vão ficar sem voz): {', '.join(map(str, sem))}")
            if nao_ap:
                msg.append(f"Gravados mas não aprovados: {', '.join(map(str, nao_ap))}")
            if not messagebox.askyesno("Exportar mesmo assim?", "\n".join(msg) + "\n\nExportar mesmo assim?"):
                return
        if len(sem) == len(self.trechos):
            messagebox.showinfo("Exportar", "Nenhum trecho foi gravado ainda.")
            return
        takes = []
        for t in self.trechos:
            y = self._take(t)
            if y is not None:
                takes.append((int(round(self._pos(t) * SR)), y))
        carimbo = datetime.now().strftime("%Y-%m-%d_%H-%M")
        saida = os.path.join(OUT_DIR, f"{self.projeto.nome}_dublado_{carimbo}.mp4")
        voz = os.path.join(OUT_DIR, f"{self.projeto.nome}_so_a_voz_{carimbo}.wav")
        mixwav = self.projeto.caminho("mix_final.wav")
        args = dict(video=self.video.caminho, duracao=self.video.duracao, takes=takes,
                    orig=self.orig_wav, vol=self.var_vol.get() / 100.0, duck=self.var_duck.get() / 100.0,
                    saida=saida, voz=voz, mixwav=mixwav)
        self.estado = "exportando"
        for b in (self.b_gravar, self.b_ouvir, self.b_voz, self.b_aprovar, self.b_acelerar, self.b_exportar):
            b.configure(state="disabled")
        self.pb_exp["value"] = 0
        self.lbl_exp.configure(text="Juntando as falas…")
        threading.Thread(target=self._exportar_trabalho, kwargs=args, daemon=True).start()

    def _exportar_trabalho(self, video, duracao, takes, orig, vol, duck, saida, voz, mixwav):
        try:
            exportar_video(video, duracao, takes, orig, vol, duck, saida, voz, mixwav,
                           progresso=lambda p, txt: self.fila.put(("exp_prog", p, txt)))
            self.fila.put(("exp_ok", saida))
        except Exception as e:
            log_erro(traceback.format_exc())
            self.fila.put(("exp_erro", str(e)))

    # ----------------------------------------------------------- laço
    def _tick(self):
        try:
            self._tick_vu()
            self._tratar_fila()
            if self.estado == "gravando":
                self._tick_gravacao()
            elif self.estado == "tocando":
                self._tick_reproducao()
        except Exception:
            log_erro(traceback.format_exc())
            if self.estado == "gravando":
                try:
                    self.mic.parar()
                except Exception:
                    pass
            self.estado = "parado"
            messagebox.showerror("Erro", "Algo deu errado (detalhes em erros.log).")
        self.root.after(15, self._tick)

    def _tick_vu(self):
        nv = self.mic.pegar_nivel()
        db = 20 * math.log10(nv + 1e-6)
        frac = min(1.0, max(0.0, (db + 60) / 60))
        self.vu_val = max(frac, self.vu_val - 0.025)
        cor = VERDE if self.vu_val < 0.75 else (AMARELO if self.vu_val < 0.93 else CORAL)
        self.vu.coords(self.vu_rect, 0, 0, 150 * self.vu_val, 16)
        self.vu.itemconfigure(self.vu_rect, fill=cor)

    def _tratar_fila(self):
        while True:
            try:
                msg = self.fila.get_nowait()
            except queue.Empty:
                return
            tipo = msg[0]
            if tipo == "audio_orig":
                proj, caminho = msg[1], msg[2]
                if caminho is None:
                    proj.dados["sem_audio"] = True
                    proj.salvar()
                if proj is self.projeto:
                    self.orig_wav = caminho
            elif tipo == "exp_prog":
                self.pb_exp["value"] = msg[1]
                self.lbl_exp.configure(text=msg[2])
            elif tipo in ("exp_ok", "exp_erro"):
                self.estado = "parado"
                self.b_gravar.configure(state="normal")
                self.b_exportar.configure(state="normal")
                self._atualizar_info()
                if tipo == "exp_ok":
                    self.pb_exp["value"] = 100
                    self.lbl_exp.configure(text="Pronto! " + os.path.basename(msg[1]))
                    if messagebox.askyesno("Vídeo pronto! 🎉",
                                           f"O vídeo foi salvo em:\n{msg[1]}\n\n"
                                           "(a voz sozinha também foi salva, em .wav)\n\nAbrir a pasta agora?"):
                        abrir_no_sistema(OUT_DIR)
                else:
                    self.pb_exp["value"] = 0
                    self.lbl_exp.configure(text="Falhou — veja erros.log")
                    messagebox.showerror("Exportar", f"Não consegui exportar o vídeo:\n{msg[1]}")

    def _erro_tk(self, exc, val, tb):
        log_erro("".join(traceback.format_exception(exc, val, tb)))
        messagebox.showerror("Erro", f"Algo deu errado:\n{val}\n\n(detalhes em erros.log)")

    def _fechar(self):
        if self.estado == "exportando" and not messagebox.askyesno(
                "Sair", "O vídeo ainda está sendo exportado. Sair mesmo assim?"):
            return
        self._opcao_mudou()
        salvar_cfg(self.cfg)
        try:
            sd.stop()
        except Exception:
            pass
        self.mic.fechar()
        if self.video:
            self.video.fechar()
        self.root.destroy()


# --------------------------------------------------------------------------- #
#  Exportação (sem interface — também usada nos testes)
# --------------------------------------------------------------------------- #
def exportar_video(video, duracao, takes, orig, vol, duck, saida, voz_path, mixwav, progresso=None):
    def prog(p, txt):
        if progresso:
            progresso(p, txt)

    n_total = int(round(duracao * SR))
    bloco = 20 * SR
    feito = 0
    with sf.SoundFile(mixwav, "w", SR, 2, "PCM_16") as fm, sf.SoundFile(voz_path, "w", SR, 1, "PCM_16") as fv:
        while feito < n_total:
            n = min(bloco, n_total - feito)
            mix, voz = mixar(feito, n, takes, orig, vol, duck)
            fm.write(mix)
            fv.write(limitar(voz.copy(), 0.98))
            feito += n
            prog(feito / n_total * 70, f"Juntando as falas… {int(feito / n_total * 100)}%")
    prog(75, "Colocando o áudio no vídeo…")
    base = ["-i", video, "-i", mixwav, "-map", "0:v:0", "-map", "1:a:0"]
    code, err = rodar_ffmpeg(base + ["-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                                     "-movflags", "+faststart", saida])
    if code != 0:
        log_erro("cópia direta do vídeo falhou, recodificando:\n" + err[-3000:])
        prog(80, "Convertendo o vídeo (pode demorar um pouco)…")
        code, err = rodar_ffmpeg(base + ["-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
                                         "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
                                         "-movflags", "+faststart", saida])
        if code != 0:
            raise RuntimeError("o ffmpeg não conseguiu gerar o vídeo:\n" + err[-800:])
    try:
        os.remove(mixwav)
    except Exception:
        pass
    prog(100, "Pronto!")
    return saida


def main():
    try:
        if os.name == "nt":
            import ctypes
            ctypes.windll.shcore.SetProcessDpiAwareness(1)
    except Exception:
        pass
    root = tk.Tk()
    App(root)
    root.mainloop()


if __name__ == "__main__":
    try:
        main()
    except Exception:
        log_erro(traceback.format_exc())
        raise
