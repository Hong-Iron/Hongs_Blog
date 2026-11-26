---
layout: "note"
title: "63_quantization-noise-sqnr_plot.py"
display_title: "63_quantization-noise-sqnr_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "63"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/quantization-noise-sqnr/"
parent_title: "양자화 잡음과 SQNR"
description: "휴먼 인터페이스 미디어 · 양자화 잡음과 SQNR 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/63_quantization-noise-sqnr_plot/"
---
{% raw %}
[양자화 잡음과 SQNR](/Hongs_Blog/studies/human-interface-media/quantization-noise-sqnr/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 양자화 잡음과 SQNR 문서의 그림을 만든다: 63_quantization-noise-sqnr_fig1.svg, fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 63_quantization-noise-sqnr_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "63_quantization-noise-sqnr"
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


def quantize(x, n_bits):
    """-1 ~ 1 범위 균일 양자화(구역 가운데 값). 범위 밖은 끝 구역에 넣는다."""
    L = 2 ** n_bits
    d = 2 / L
    k = np.clip(np.floor((x + 1) / d), 0, L - 1)
    return -1 + (k + 0.5) * d


# 그림 1: 3비트로 양자화한 정현파(위), 오차(왼쪽 아래), 많은 표본의 오차 분포(오른쪽 아래)
N1 = 3
D1 = 2 / 2 ** N1
t = np.linspace(0, 1, 2000)
x = 0.97 * np.sin(2 * np.pi * t)
y = quantize(x, N1)
e = y - x
rng = np.random.default_rng(14)
xr = rng.uniform(-1, 1, 200_000)
er = quantize(xr, N1) - xr

fig = plt.figure(figsize=(7.4, 5.0))
gs = fig.add_gridspec(2, 3, height_ratios=[1.35, 1], hspace=0.55, wspace=0.45)
ax = fig.add_subplot(gs[0, :])
for k in range(2 ** N1 + 1):
    ax.axhline(-1 + k * D1, color=INK, lw=0.5, ls=":")
for k in range(2 ** N1):
    ax.text(1.015, -1 + (k + 0.5) * D1, format(k, "03b"), va="center", fontsize=9.5)
ax.plot(t, x, color=INK, lw=1.2, label="원래 신호")
ax.plot(t, y, color=C[0], lw=1.8, label="양자화 값 (구역 가운데)")
ax.set_xlim(0, 1)
ax.set_ylim(-1.05, 1.05)
ax.set_yticks([-1, -0.5, 0, 0.5, 1])
ax.set_xlabel("시간 (한 주기)")
ax.set_title("3비트: 8구역, 계단 폭 $\\Delta = 0.25$", fontsize=11)
ax.legend(loc="lower left", fontsize=9.5)

ax2 = fig.add_subplot(gs[1, :2])
ax2.plot(t, e, color=C[1], lw=1.2)
for v in (D1 / 2, -D1 / 2):
    ax2.axhline(v, color=INK, lw=0.8, ls="--")
ax2.text(1.01, D1 / 2, "$+\\Delta/2$", va="center", fontsize=9.5)
ax2.text(1.01, -D1 / 2, "$-\\Delta/2$", va="center", fontsize=9.5)
ax2.set_xlim(0, 1)
ax2.set_ylim(-0.2, 0.2)
ax2.set_yticks([-0.125, 0, 0.125])
ax2.set_yticklabels(["-0.125", "0", "0.125"])
ax2.set_xlabel("시간")
ax2.set_title("오차 = 양자화 값 - 원래 값", fontsize=10.5)

ax3 = fig.add_subplot(gs[1, 2])
ax3.hist(er, bins=25, range=(-D1 / 2, D1 / 2), density=True, color=C[1], alpha=0.75)
ax3.axhline(1 / D1, color=INK, lw=1, ls="--")
ax3.text(0, 1 / D1 * 1.08, "높이 $1/\\Delta$", ha="center", fontsize=9.5)
ax3.set_xlim(-0.17, 0.17)
ax3.set_ylim(0, 1 / D1 * 1.35)
ax3.set_xticks([-0.125, 0, 0.125])
ax3.set_xticklabels(["$-\\Delta/2$", "0", "$\\Delta/2$"])
ax3.set_yticks([])
ax3.set_title("오차 분포", fontsize=10.5)
save(fig, 1)


# 그림 2: 비트 수에 따른 측정 SQNR. 정현파와 고르게 퍼진 무작위 신호
def measured_sqnr(sig, n_bits):
    err = quantize(sig, n_bits) - sig
    return 10 * np.log10(np.mean(sig ** 2) / np.mean(err ** 2))


Ns = np.arange(2, 17)
sine = np.sin(2 * np.pi * 0.1234567891 * np.arange(200_000) + 0.3)
s_sine = np.array([measured_sqnr(sine, n) for n in Ns])
s_unif = np.array([measured_sqnr(xr, n) for n in Ns])
fig, (ax, axr) = plt.subplots(1, 2, figsize=(7.4, 3.4), gridspec_kw={"width_ratios": [1.15, 1], "wspace": 0.35})
nn = np.linspace(1.5, 16.5, 50)
ax.plot(nn, 6.0206 * nn, color=INK, lw=1)
ax.plot(Ns, s_sine, "o", color=C[0], ms=5)
ax.plot(Ns, s_unif, "s", color=C[1], ms=4)
ax.text(2.2, 88, "비트 하나에 약 6 dB씩 오른다", fontsize=9.5)
ax.set_xlabel("비트 수 $N$")
ax.set_ylabel("측정 SQNR (dB)")
ax.set_xticks([2, 4, 8, 12, 16])
ax.set_xlim(1.5, 16.5)
ax.set_ylim(0, 105)
ax.grid(color=INK, lw=0.3, alpha=0.5)
axr.axhline(10 * math.log10(1.5), color=C[0], lw=1)
axr.axhline(0, color=C[1], lw=1)
axr.plot(Ns, s_sine - 6.0206 * Ns, "o", color=C[0], ms=5)
axr.plot(Ns, s_unif - 6.0206 * Ns, "s", color=C[1], ms=4)
axr.text(16.5, 2.35, "● 꽉 찬 정현파: 약 1.76 dB 위", color=C[0], fontsize=9.5, ha="right")
axr.text(16.5, 0.35, "■ 고르게 퍼진 무작위 신호: 0 dB", color=C[1], fontsize=9.5, ha="right")
axr.set_xlabel("비트 수 $N$")
axr.set_ylabel("측정 SQNR $- 6.02N$ (dB)")
axr.set_xticks([2, 4, 8, 12, 16])
axr.set_xlim(1.5, 16.8)
axr.set_ylim(-1.5, 3.2)
axr.grid(color=INK, lw=0.3, alpha=0.5)
save(fig, 2)

if __name__ == "__main__":
    # 그림 1: 오차가 ±Δ/2 안에 있고, 분포가 고르다(구간마다 높이 1/Δ에서 5% 안)
    assert abs(D1 - 0.25) < 1e-12
    assert np.max(np.abs(e)) <= D1 / 2 + 1e-12
    hist, _ = np.histogram(er, bins=25, range=(-D1 / 2, D1 / 2), density=True)
    assert np.all(np.abs(hist * D1 - 1) < 0.05)
    assert abs(np.mean(er ** 2) / (D1 ** 2 / 12) - 1) < 0.02
    # 그림 2: 정현파는 6.02N + 1.76, 무작위 신호는 6.02N 근처
    for n, s1, s2 in zip(Ns, s_sine, s_unif):
        assert abs(s1 - (6.0206 * n + 1.7609)) < (0.5 if n >= 5 else 1.0), (n, s1)
        assert abs(s2 - 6.0206 * n) < 0.1, (n, s2)
    print("ALL CHECKS PASSED")
```
{% endraw %}
