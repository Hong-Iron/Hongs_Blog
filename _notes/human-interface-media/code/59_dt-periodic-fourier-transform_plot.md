---
layout: "note"
title: "59_dt-periodic-fourier-transform_plot.py"
display_title: "59_dt-periodic-fourier-transform_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "59"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/dt-periodic-fourier-transform/"
parent_title: "이산 주기 신호의 푸리에 변환"
description: "휴먼 인터페이스 미디어 · 이산 주기 신호의 푸리에 변환 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/59_dt-periodic-fourier-transform_plot/"
---
{% raw %}
[이산 주기 신호의 푸리에 변환](/Hongs_Blog/studies/human-interface-media/dt-periodic-fourier-transform/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이산 주기 신호의 푸리에 변환 문서의 그림을 만든다: 59_dt-periodic-fourier-transform_fig1.svg, fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 59_dt-periodic-fourier-transform_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "59_dt-periodic-fourier-transform"
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


def dirichlet(w, M):
    w = np.asarray(w, dtype=float)
    s = np.sin(w / 2)
    out = np.full_like(w, 2 * M + 1.0)
    ok = np.abs(s) > 1e-12
    out[ok] = np.sin(w[ok] * (M + 0.5)) / s[ok]
    return out


def arrows(ax, ws, areas, col, scale=1.0):
    for w, A in zip(ws, areas):
        ax.annotate("", xy=(w, A * scale), xytext=(w, 0),
                    arrowprops=dict(arrowstyle="-|>", color=col, lw=1.8, mutation_scale=12))


# 그림 1: 1이 2M+1개인 수열의 변환. M이 커지면 봉우리가 높고 좁아지지만 한 주기 넓이는 2pi로 같다
w = np.linspace(-np.pi, np.pi, 4001)
fig, axes = plt.subplots(1, 3, figsize=(7.4, 2.7), sharex=True)
for ax, M, col in zip(axes, [2, 5, 20], C):
    ax.plot(w, dirichlet(w, M), color=col, lw=1.5)
    ax.axhline(0, color=INK, lw=0.6)
    ax.set_title(f"M = {M}: 봉우리 {2 * M + 1}", fontsize=10.5)
    ax.set_xticks([-np.pi, 0, np.pi], ["-π", "0", "π"])
    ax.set_xlabel(r"$\omega$")
    ax.text(0.98, 0.9, "넓이 2π", transform=ax.transAxes, ha="right", color=col, fontsize=10.5)
fig.tight_layout()
save(fig, 1)

# 그림 2: cos(2pi n/5)와 주기 4 임펄스 열의 시간 모양(왼쪽)과 스펙트럼 임펄스(오른쪽)
fig, axes = plt.subplots(2, 2, figsize=(7.4, 4.9), gridspec_kw={"width_ratios": [1, 1.45]})
n = np.arange(-10, 11)
ax = axes[0, 0]
ml, sl, bl = ax.stem(n, np.cos(2 * np.pi * n / 5), basefmt=" ")
plt.setp(sl, color=C[0], lw=1.5)
plt.setp(ml, color=C[0], ms=4)
ax.axhline(0, color=INK, lw=0.6)
ax.set_title(r"$x[n] = \cos(2\pi n/5)$", fontsize=11)
ax.set_xlabel("$n$")
ax = axes[0, 1]
w0 = 2 * np.pi / 5
ws = [s * w0 + 2 * np.pi * l for l in (-1, 0, 1) for s in (-1, 1)]
arrows(ax, ws, [np.pi] * len(ws), C[0])
ax.axvspan(-np.pi, np.pi, color=INK, alpha=0.08, lw=0)
ax.axhline(0, color=INK, lw=0.6)
ax.set_xlim(-2.8 * np.pi, 2.8 * np.pi)
ax.set_ylim(0, 4.3)
ax.set_xticks([-2 * np.pi, -w0, w0, 2 * np.pi], ["-2π", "-2π/5", "2π/5", "2π"])
ax.set_yticks([0, np.pi], ["0", "π"])
ax.set_xlabel(r"$\omega$")
ax.set_title("넓이 π인 임펄스, 2π마다 되풀이", fontsize=11)

ax = axes[1, 0]
xt = np.where(n % 4 == 0, 1.0, 0.0)
ml, sl, bl = ax.stem(n, xt, basefmt=" ")
plt.setp(sl, color=C[1], lw=1.5)
plt.setp(ml, color=C[1], ms=4)
ax.axhline(0, color=INK, lw=0.6)
ax.set_ylim(-0.1, 1.3)
ax.set_title(r"주기 $N = 4$ 임펄스 열", fontsize=11)
ax.set_xlabel("$n$")
ax = axes[1, 1]
ws = np.pi / 2 * np.arange(-5, 6)
arrows(ax, ws, [np.pi / 2] * len(ws), C[1])
ax.axvspan(-np.pi, np.pi, color=INK, alpha=0.08, lw=0)
ax.axhline(0, color=INK, lw=0.6)
ax.set_xlim(-2.8 * np.pi, 2.8 * np.pi)
ax.set_ylim(0, 2.4)
ax.set_xticks([-2 * np.pi, -np.pi, 0, np.pi, 2 * np.pi], ["-2π", "-π", "0", "π", "2π"])
ax.set_yticks([0, np.pi / 2], ["0", "π/2"])
ax.set_xlabel(r"$\omega$")
ax.set_title("넓이 π/2, 간격 π/2", fontsize=11)
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    # 그림에 쓴 값 확인: 봉우리, 한 주기 넓이 2pi, 계수로 만든 임펄스 넓이
    for M in (2, 5, 20):
        assert abs(dirichlet(np.array([0.0]), M)[0] - (2 * M + 1)) < 1e-12
        ww = np.linspace(-np.pi, np.pi, 400001)
        area = np.trapezoid(dirichlet(ww, M), ww)
        assert abs(area - 2 * np.pi) < 1e-6
    a_cos = np.fft.fft(np.cos(2 * np.pi * np.arange(5) / 5)) / 5
    assert np.allclose(2 * np.pi * a_cos, [0, np.pi, 0, 0, np.pi], atol=1e-12)
    a_tr = np.fft.fft([1.0, 0, 0, 0]) / 4
    assert np.allclose(2 * np.pi * a_tr, np.pi / 2)
    print("ALL CHECKS PASSED")
```
{% endraw %}
