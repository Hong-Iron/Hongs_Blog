---
layout: "note"
title: "58_dt-fourier-transform_plot.py"
display_title: "58_dt-fourier-transform_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "58"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/dt-fourier-transform/"
parent_title: "이산 시간 푸리에 변환"
description: "휴먼 인터페이스 미디어 · 이산 시간 푸리에 변환 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/58_dt-fourier-transform_plot/"
---
{% raw %}
[이산 시간 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-fourier-transform/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이산 시간 푸리에 변환 문서의 그림을 만든다: 58_dt-fourier-transform_fig1.svg, fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 58_dt-fourier-transform_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "58_dt-fourier-transform"
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

PI_TICKS = ([-2 * np.pi, -np.pi, 0, np.pi, 2 * np.pi], ["-2π", "-π", "0", "π", "2π"])


def save(fig, k):
    fig.savefig(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"), bbox_inches="tight", metadata={"Date": None})
    plt.close(fig)


def rect_dtft(w, N1=2):
    w = np.asarray(w, dtype=float)
    out = np.empty_like(w)
    small = np.abs(np.sin(w / 2)) < 1e-12
    out[~small] = np.sin(w[~small] * (N1 + 0.5)) / np.sin(w[~small] / 2)
    out[small] = 2 * N1 + 1
    return out


# 그림 1: 사각 펄스(n = -2..2)를 주기 N으로 늘였을 때 N a_k가 연속 곡선 X(e^{jw}) 위에 놓인다
w = np.linspace(-2 * np.pi, 2 * np.pi, 2001)
fig, axes = plt.subplots(3, 1, figsize=(7.2, 6.4), gridspec_kw={"height_ratios": [0.8, 1, 1]})
ax = axes[0]
n = np.arange(-12, 13)
xp = np.where(((n + 2) % 10) <= 4, 1.0, 0.0)
ml, sl, bl = ax.stem(n, xp, basefmt=" ")
plt.setp(sl, color=INK, lw=1.2)
plt.setp(ml, color=INK, ms=4)
one = (n >= -2) & (n <= 2)
ml, sl, bl = ax.stem(n[one], xp[one], basefmt=" ")
plt.setp(sl, color=C[0], lw=2)
plt.setp(ml, color=C[0], ms=5)
ax.axhline(0, color=INK, lw=0.6)
ax.set_ylim(-0.1, 1.35)
ax.set_xlabel("$n$")
ax.text(-2.4, 1.15, "원래 수열 (n = -2 … 2)", color=C[0], fontsize=10.5)
ax.text(5.5, 1.15, "N = 10으로 늘인 복사본", color=INK, fontsize=10.5)
for row, N in enumerate([10, 20], start=1):
    ax = axes[row]
    ax.axvspan(-np.pi, np.pi, color=INK, alpha=0.08, lw=0)
    ax.plot(w, rect_dtft(w), color=INK, lw=1.2, ls="--")
    k = np.arange(-N, N + 1)
    wk = 2 * np.pi * k / N
    ml, sl, bl = ax.stem(wk, rect_dtft(wk), basefmt=" ")
    plt.setp(sl, color=C[row - 1 if row == 1 else 1], lw=1.4)
    plt.setp(ml, color=C[row - 1 if row == 1 else 1], ms=4)
    ax.axhline(0, color=INK, lw=0.6)
    ax.set_xticks(*PI_TICKS)
    ax.set_ylim(-1.8, 7.0)
    ax.set_xlabel(r"$\omega$")
    ax.text(-2 * np.pi, 6.1, rf"$N = {N}$: 막대 $N a_k$ 간격 $2\pi/{N}$", color=C[row - 1 if row == 1 else 1], fontsize=10.5)
    if row == 1:
        ax.text(0.25 * np.pi, 3.6, r"점선: $X(e^{j\omega})$", color=INK, fontsize=10.5)
        ax.text(0.3 * np.pi, 6.1, "회색 칸: 한 주기 (-π ~ π)", color=INK, fontsize=10.5)
fig.tight_layout()
save(fig, 1)

# 그림 2: a^n u[n]의 수열과 크기 스펙트럼 (a = 0.5, a = -0.5)
fig, axes = plt.subplots(2, 2, figsize=(7.4, 4.8), gridspec_kw={"width_ratios": [1, 1.5]})
nn = np.arange(-3, 11)
for row, a in enumerate([0.5, -0.5]):
    col = C[row]
    ax = axes[row, 0]
    x = np.where(nn >= 0, a ** np.clip(nn, 0, None), 0.0)
    ml, sl, bl = ax.stem(nn, x, basefmt=" ")
    plt.setp(sl, color=col, lw=1.6)
    plt.setp(ml, color=col, ms=4)
    ax.axhline(0, color=INK, lw=0.6)
    ax.set_ylim(-0.65, 1.15)
    ax.set_title(rf"$x[n] = ({a})^n u[n]$", fontsize=11)
    ax.set_xlabel("$n$")
    ax = axes[row, 1]
    mag = np.abs(1 / (1 - a * np.exp(-1j * w)))
    ax.plot(w, mag, color=col, lw=1.8)
    ax.axhline(0, color=INK, lw=0.6)
    ax.set_xticks(*PI_TICKS)
    ax.set_ylim(0, 2.3)
    ax.set_title(r"크기 $|X(e^{j\omega})|$", fontsize=11)
    ax.set_xlabel(r"$\omega$")
    if a > 0:
        ax.text(0.15, 2.03, "2", color=col, fontsize=10.5)
        ax.text(np.pi + 0.15, 0.78, "2/3", color=col, fontsize=10.5)
    else:
        ax.text(0.15, 0.78, "2/3", color=col, fontsize=10.5)
        ax.text(np.pi + 0.15, 2.03, "2", color=col, fontsize=10.5)
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    # 그림에 쓴 값 확인
    assert abs(rect_dtft(np.array([0.0]))[0] - 5) < 1e-12
    assert abs(rect_dtft(np.array([np.pi / 2]))[0] + 1) < 1e-12
    for N in (10, 20):
        xper = np.zeros(N)
        for m in range(-2, 3):
            xper[m % N] += 1
        a_k = np.fft.fft(xper) / N
        wk = 2 * np.pi * np.arange(N) / N
        assert np.allclose(N * a_k, rect_dtft(wk))            # 막대 = 곡선 위의 점
    for a, v0, vpi in ((0.5, 2, 2 / 3), (-0.5, 2 / 3, 2)):
        assert abs(abs(1 / (1 - a)) - v0) < 1e-12 and abs(abs(1 / (1 + a)) - vpi) < 1e-12
    assert np.allclose(rect_dtft(w + 2 * np.pi), rect_dtft(w))  # 주기 2pi
    print("ALL CHECKS PASSED")
```
{% endraw %}
