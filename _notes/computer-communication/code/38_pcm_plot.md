---
layout: "note"
title: "38_pcm_plot.py"
display_title: "38_pcm_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "38"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/pcm/"
parent_title: "PCM"
description: "컴퓨터 통신 · PCM 코드 코드"
permalink: "/studies/computer-communication/code/38_pcm_plot/"
---
{% raw %}
[PCM](/Hongs_Blog/studies/computer-communication/pcm/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# PCM 문서의 그림을 만든다: 38_pcm_fig1.svg, 38_pcm_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 38_pcm_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "38_pcm"
INK = "#888888"                                         # 밝은 테마와 어두운 테마 모두에서 보이는 회색
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

SAMPLES = [3.0, 1.4, 6.2, 1.3, 2.8, 5.9, 4.1]   # 슬라이드 그림에서 읽은 높이
TS = np.arange(1, len(SAMPLES) + 1)              # 재는 시각 (T_s 단위)


def quantize(v, levels=8):
    return min(levels - 1, max(0, int(math.floor(v + 0.5))))


def smooth_curve(t):
    """표본 일곱 개를 모두 지나는 매끄러운 곡선 (자연 3차 스플라인, 그림용)"""
    x = np.concatenate([[0.0], TS, [len(SAMPLES) + 1.0]])
    y = np.concatenate([[3.5], SAMPLES, [3.5]])
    n = len(x)
    h = np.diff(x)
    A = np.zeros((n, n))
    rhs = np.zeros(n)
    A[0, 0] = A[-1, -1] = 1
    for i in range(1, n - 1):
        A[i, i - 1], A[i, i], A[i, i + 1] = h[i - 1], 2 * (h[i - 1] + h[i]), h[i]
        rhs[i] = 6 * ((y[i + 1] - y[i]) / h[i] - (y[i] - y[i - 1]) / h[i - 1])
    m = np.linalg.solve(A, rhs)
    k = np.clip(np.searchsorted(x, t) - 1, 0, n - 2)
    a = (x[k + 1] - t) / h[k]
    b = (t - x[k]) / h[k]
    return a * y[k] + b * y[k + 1] + ((a ** 3 - a) * m[k] + (b ** 3 - b) * m[k + 1]) * h[k] ** 2 / 6


Q = [quantize(v) for v in SAMPLES]
CODE = "".join(format(q, "03b") for q in Q)

# 그림 1: 파형 → 재기(점) → 반올림(막대) → 3비트 부호
t = np.linspace(0.3, 7.7, 500)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(t, smooth_curve(t), color=INK, lw=1.4)
ax.bar(TS, Q, width=0.35, color=C[0], alpha=0.75)
ax.plot(TS, SAMPLES, "o", color=C[1], ms=5, zorder=3)
for x, v, q in zip(TS, SAMPLES, Q):
    ax.text(x, -0.9, format(q, "03b"), ha="center", fontsize=9, color=C[0])
    ax.text(x + 0.22, v, f"{v}", fontsize=8, color=C[1], va="center")
for lv in range(8):
    ax.axhline(lv, color=INK, lw=0.4, ls=":")
ax.set_yticks(range(8))
ax.set_ylim(-1.3, 7.3)
ax.set_xticks(TS, [f"{k}$T_s$" for k in TS])
ax.set_xlim(0.3, 7.9)
ax.set_ylabel("단계")
ax.set_title("회색 선: 원래 파형 · 주황 점: 잰 값 · 파란 막대: 반올림한 단계", fontsize=9, loc="left", color=INK)
save(fig, 1)

# 그림 2: 4 kHz 사인파를 정확히 2배(8 kHz)로 재면 매번 0을 읽을 수 있고, 2.5배(10 kHz)로 재면 떨림이 보인다
F = 4000.0
tt = np.linspace(0, 1.5e-3, 1500)
fig, axes = plt.subplots(2, 1, figsize=(6, 3.8), sharex=True)
for ax, fs, title in [(axes[0], 2 * F, "1초에 8,000번 (정확히 2배): 잰 값이 모두 0"),
                      (axes[1], 2.5 * F, "1초에 10,000번 (2.5배): 오르내림이 남는다")]:
    ts = np.arange(0, 1.5e-3 + 1e-12, 1 / fs)
    ax.plot(tt * 1e3, np.sin(2 * np.pi * F * tt), color=INK, lw=1.0)
    ax.plot(ts * 1e3, np.sin(2 * np.pi * F * ts), "o-", color=C[1], ms=4, lw=1.2)
    ax.set_title(title, fontsize=10, loc="left", color=INK)
    ax.set_yticks([-1, 0, 1])
    ax.set_ylim(-1.3, 1.3)
axes[1].set_xlabel("시간 (ms)")
fig.subplots_adjust(hspace=0.5)
save(fig, 2)

if __name__ == "__main__":
    # 문서 표의 값: 3, 1, 6, 1, 3, 6, 4 → 011 001 110 001 011 110 100. 오차는 0.5 이하. 64 kbps
    assert Q == [3, 1, 6, 1, 3, 6, 4]
    assert CODE == "011001110001011110100" and len(CODE) == 21
    assert all(abs(v - q) <= 0.5 for v, q in zip(SAMPLES, Q))
    assert np.allclose(smooth_curve(TS.astype(float)), SAMPLES)
    assert 8000 * 8 == 64_000
    # 8 kHz로 잰 4 kHz 사인파는 모두 0, 10 kHz로 재면 0이 아닌 값이 있다
    assert np.allclose(np.sin(2 * np.pi * F * np.arange(12) / 8000), 0, atol=1e-9)
    assert np.max(np.abs(np.sin(2 * np.pi * F * np.arange(12) / 10000))) > 0.9
    print("ALL CHECKS PASSED")
```
{% endraw %}
