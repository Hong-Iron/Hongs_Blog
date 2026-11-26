---
layout: "note"
title: "56_spectrum-spectrogram_plot.py"
display_title: "56_spectrum-spectrogram_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "56"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/spectrum-spectrogram/"
parent_title: "스펙트럼과 스펙트로그램"
description: "휴먼 인터페이스 미디어 · 스펙트럼과 스펙트로그램 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/56_spectrum-spectrogram_plot/"
---
{% raw %}
[스펙트럼과 스펙트로그램](/Hongs_Blog/studies/human-interface-media/spectrum-spectrogram/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 스펙트럼과 스펙트로그램 문서의 그림을 만든다: 56_spectrum-spectrogram_fig1.svg, 56_spectrum-spectrogram_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 56_spectrum-spectrogram_plot.py  (matplotlib, numpy 필요)
# 그림 1: 주기 소리(440, 880, 1320 Hz 고조파 셋)와 비주기 소리(2 ms짜리 딸깍 한 번)의 파형과 스펙트럼
# 그림 2: 합성한 소리(고조파 셋 -> 딸깍 -> 300 Hz에서 3000 Hz로 오르는 처프)의 스펙트로그램, 창 4 ms와 64 ms
#   고조파 셋과 처프는 앞뒤 10 ms를 부드럽게 키우고 줄여(페이드) 켜고 끌 때 생기는 넓은 띠를 줄인다
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "56_spectrum-spectrogram"
INK = "#888888"
C = ["#3b82c4", "#d9622b", "#3a9a5b", "#9b59b6", "#c49a1b"]
_fonts = {f.name for f in font_manager.fontManager.ttflist}
FONT = next((n for n in ["Apple SD Gothic Neo", "NanumGothic", "Noto Sans CJK KR"] if n in _fonts), "DejaVu Sans")
plt.rcParams.update({
    "font.family": FONT, "mathtext.fontset": "dejavusans",
    "font.size": 11, "axes.unicode_minus": False, "svg.fonttype": "path", "svg.hashsalt": PREFIX,
    "axes.edgecolor": INK, "axes.labelcolor": INK, "xtick.color": INK, "ytick.color": INK,
    "text.color": INK, "legend.frameon": False,
    "axes.facecolor": "none", "figure.facecolor": "none", "savefig.transparent": True,
    "axes.spines.top": False, "axes.spines.right": False,
})


def save(fig, k):
    fig.savefig(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"), bbox_inches="tight", metadata={"Date": None})
    plt.close(fig)


F0 = 440.0
AMPS = {1: 1.0, 2: 0.5, 3: 0.3}          # 고조파 k의 진폭 (설명용 가정)
TAU = 0.002                               # 딸깍 소리의 길이 2 ms


def tone(t):
    return sum(A * np.cos(2 * np.pi * k * F0 * t) for k, A in AMPS.items())


def pulse_spectrum(f):
    """길이 TAU, 높이 1인 사각 펄스의 푸리에 변환 크기 |X(f)| = TAU |sinc(f TAU)|."""
    return TAU * np.abs(np.sinc(f * TAU))


# ---- 그림 1 ----
fig, ax = plt.subplots(2, 2, figsize=(7.4, 5.2))
t = np.linspace(0, 0.010, 2001)
ax[0, 0].plot(t * 1000, tone(t), color=C[0], lw=1.4)
ax[0, 0].set_title("주기 소리: 440 + 880 + 1320 Hz", fontsize=10, color=INK)
ax[0, 0].set_xlabel("시간 (ms)")
ax[0, 0].axvspan(0, 1000 / F0, color=C[0], alpha=0.10)
ax[0, 0].text(1000 / F0 / 2, 1.9, "한 주기\n2.27 ms", fontsize=9.5, ha="center", va="top")
ax[0, 0].set_ylim(-1.6, 2.0)
ks = np.arange(-4, 5)
mag = np.array([AMPS.get(abs(k), 0.0) / 2 for k in ks])
for k, m in zip(ks, mag):
    if m > 0:
        ax[0, 1].plot([k * F0, k * F0], [0, m], color=C[1], lw=2.2)
        ax[0, 1].plot([k * F0], [m], "o", color=C[1], ms=5)
ax[0, 1].axhline(0, color=INK, lw=0.8)
ax[0, 1].set_title("선 스펙트럼 $|a_k|$", fontsize=10, color=INK)
ax[0, 1].set_xlabel("주파수 (Hz)")
ax[0, 1].set_xticks([-1320, -880, -440, 0, 440, 880, 1320])
ax[0, 1].set_xticklabels(["-1320", "", "-440", "0", "440", "", "1320"])
ax[0, 1].set_xlim(-1700, 1700)
ax[0, 1].set_ylim(0, 0.6)
tp = np.linspace(-0.002, 0.008, 2001)
ax[1, 0].plot(tp * 1000, ((tp >= 0) & (tp < TAU)).astype(float), color=C[0], lw=1.4)
ax[1, 0].set_title("비주기 소리: 2 ms 딸깍 한 번", fontsize=10, color=INK)
ax[1, 0].set_xlabel("시간 (ms)")
ax[1, 0].set_ylim(-0.2, 1.3)
fq = np.linspace(-3000, 3000, 3001)
ax[1, 1].plot(fq, pulse_spectrum(fq) * 1000, color=C[1], lw=1.6)
ax[1, 1].fill_between(fq, 0, pulse_spectrum(fq) * 1000, color=C[1], alpha=0.12)
ax[1, 1].set_title("이어진 스펙트럼 $|X(f)|$", fontsize=10, color=INK)
ax[1, 1].set_xlabel("주파수 (Hz)")
ax[1, 1].set_ylabel("단위: ms", fontsize=9.5)
ax[1, 1].set_xticks([-2000, -1000, -500, 0, 500, 1000, 2000])
ax[1, 1].set_xticklabels(["-2000", "-1000", "", "0", "", "1000", "2000"])
fig.tight_layout()
save(fig, 1)

# ---- 그림 2 ----
FS = 16000
T_TOTAL = 1.2
n = np.arange(int(FS * T_TOTAL))
tt = n / FS
x = np.zeros_like(tt)
seg1 = tt < 0.5
x[seg1] = tone(tt[seg1]) / 1.8
click = (tt >= 0.56) & (tt < 0.56 + TAU)
x[click] = 1.0
seg3 = tt >= 0.65
tc = tt[seg3] - 0.65
F_START, F_END, T_CH = 300.0, 3000.0, 0.55
x[seg3] = 0.8 * np.cos(2 * np.pi * (F_START * tc + (F_END - F_START) / (2 * T_CH) * tc ** 2))


def fade(seg_mask, ms=10.0):
    idx = np.flatnonzero(seg_mask)
    m = int(FS * ms / 1000)
    ramp = 0.5 - 0.5 * np.cos(np.pi * np.arange(m) / m)
    x[idx[:m]] *= ramp
    x[idx[-m:]] *= ramp[::-1]


fade(seg1)
fade(seg3)


def stft_db(sig, win_ms, hop_ms=2.0):
    N = int(FS * win_ms / 1000)
    hop = int(FS * hop_ms / 1000)
    w = np.hanning(N)
    nfft = max(1024, 1 << (N - 1).bit_length())
    frames = [sig[i:i + N] * w for i in range(0, len(sig) - N, hop)]
    S = np.abs(np.fft.rfft(np.array(frames), n=nfft, axis=1)) ** 2
    S_db = 10 * np.log10(S / S.max() + 1e-12)
    times = (np.arange(len(frames)) * hop + N / 2) / FS
    freqs = np.fft.rfftfreq(nfft, 1 / FS)
    return times, freqs, S_db


fig, axs = plt.subplots(1, 2, figsize=(7.6, 3.6), sharey=True)
for ax, win in zip(axs, (4, 64)):
    times, freqs, S_db = stft_db(x, win)
    ax.pcolormesh(times, freqs, S_db.T, shading="auto", cmap="magma", vmin=-50, vmax=0, rasterized=True)
    ax.set_ylim(0, 3500)
    ax.set_xlim(0, T_TOTAL)
    ax.set_xlabel("시간 (s)")
    ax.set_title(f"창 {win} ms (주파수 눈금 약 {1000 / win:.0f} Hz)", fontsize=10, color=INK)
axs[0].set_ylabel("주파수 (Hz)")
axs[0].text(0.25, 3300, "고조파 셋", fontsize=9.5, ha="center", color="white")
axs[0].text(0.56, 3300, "딸깍", fontsize=9.5, ha="center", color="white")
axs[0].text(0.93, 3300, "처프", fontsize=9.5, ha="center", color="white")
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    # 선 스펙트럼: |a_{+-1}| = 0.5, |a_{+-2}| = 0.25, |a_{+-3}| = 0.15, 나머지 0 (FFT로 확인)
    fs_chk, Tn = 44000, 1.0
    tn = np.arange(int(fs_chk * Tn)) / fs_chk
    X = np.fft.fft(tone(tn)) / len(tn)
    fr = np.fft.fftfreq(len(tn), 1 / fs_chk)
    for k, want in {1: 0.5, 2: 0.25, 3: 0.15}.items():
        for s in (1, -1):
            idx = int(np.argmin(np.abs(fr - s * k * F0)))
            assert abs(abs(X[idx]) - want) < 1e-9
    other = np.abs(X)[np.all([np.abs(np.abs(fr) - k * F0) > 0.5 for k in (1, 2, 3)], axis=0)]
    assert other.max() < 1e-9
    # 이어진 스펙트럼: 0 Hz에서 TAU, 500 Hz의 배수에서 0
    assert abs(pulse_spectrum(np.array([0.0]))[0] - TAU) < 1e-15
    assert np.all(pulse_spectrum(np.array([500.0, 1000.0, 1500.0])) < 1e-15)
    # 스펙트로그램: 창 64 ms에서는 0.25 s 부근에 440, 880, 1320 Hz 세 봉우리가 갈린다
    times, freqs, S_db = stft_db(x, 64)
    col = S_db[int(np.argmin(np.abs(times - 0.25)))]
    for k in (1, 2, 3):
        i = int(np.argmin(np.abs(freqs - k * F0)))
        assert col[i] > col[int(np.argmin(np.abs(freqs - (k + 0.5) * F0)))] + 20
    # 창 4 ms에서는 440과 880 사이(660 Hz)가 440 Hz보다 6 dB도 낮지 않다 (번져서 못 가른다)
    times8, freqs8, S8 = stft_db(x, 4)
    col8 = S8[int(np.argmin(np.abs(times8 - 0.25)))]
    i440 = int(np.argmin(np.abs(freqs8 - 440)))
    i660 = int(np.argmin(np.abs(freqs8 - 660)))
    assert col8[i440] - col8[i660] < 6, col8[i440] - col8[i660]
    print("ALL CHECKS PASSED")
```
{% endraw %}
