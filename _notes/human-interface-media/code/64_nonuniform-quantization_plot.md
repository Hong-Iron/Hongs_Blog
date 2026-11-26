---
layout: "note"
title: "64_nonuniform-quantization_plot.py"
display_title: "64_nonuniform-quantization_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "64"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/nonuniform-quantization/"
parent_title: "비균일 양자화"
description: "휴먼 인터페이스 미디어 · 비균일 양자화 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/64_nonuniform-quantization_plot/"
---
{% raw %}
[비균일 양자화](/Hongs_Blog/studies/human-interface-media/nonuniform-quantization/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 비균일 양자화 문서의 그림을 만든다: 64_nonuniform-quantization_fig1.svg, fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 64_nonuniform-quantization_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "64_nonuniform-quantization"
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

MU = 255.0
A = 87.6


def save(fig, k):
    fig.savefig(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"), bbox_inches="tight", metadata={"Date": None})
    plt.close(fig)


def mu_c(x):
    return np.sign(x) * np.log1p(MU * np.abs(x)) / np.log1p(MU)


def mu_e(y):
    return np.sign(y) * ((1 + MU) ** np.abs(y) - 1) / MU


def a_c(x):
    a = np.abs(x)
    c = 1 + np.log(A)
    small = A * a / c
    big = (1 + np.log(np.maximum(A * a, 1e-300))) / c
    return np.sign(x) * np.where(a < 1 / A, small, big)


def a_e(y):
    b = np.abs(y)
    c = 1 + np.log(A)
    return np.sign(y) * np.where(b < 1 / c, b * c / A, np.exp(b * c - 1) / A)


def uq(x, n_bits):
    L = 2 ** n_bits
    d = 2 / L
    k = np.clip(np.floor((x + 1) / d), 0, L - 1)
    return -1 + (k + 0.5) * d


# 그림 1: (왼쪽) μ 법칙 압축 곡선과, 세로축의 같은 간격 계단이 가로축에서 얼마나 다른 폭이 되는지
#         (오른쪽) 4비트 양자화 오차: 균일 vs μ 법칙
N1 = 4
x = np.linspace(0, 1, 2000)
fig, (ax, ax2) = plt.subplots(1, 2, figsize=(7.4, 3.5), gridspec_kw={"width_ratios": [1, 1.25], "wspace": 0.32})
ax.plot(x, x, color=INK, lw=1, ls="--")
ax.plot(x, mu_c(x), color=C[0], lw=2)
ax.text(0.55, 0.42, "균일 (곧은 선)", fontsize=9.5)
ax.text(0.03, 0.96, "$\\mu$ 법칙, $\\mu = 255$", color=C[0], fontsize=9.5)
levels = np.arange(1, 2 ** (N1 - 1)) / 2 ** (N1 - 1)    # 양수 쪽 8칸의 경계(세로축)
for yl in levels:
    xb = mu_e(yl)
    ax.plot([0, xb], [yl, yl], color=C[1], lw=0.6, ls=":")
    ax.plot([xb, xb], [0, yl], color=C[1], lw=0.6, ls=":")
    ax.plot(xb, 0, "|", color=C[1], ms=9, mew=1.5)
ax.set_xlim(0, 1)
ax.set_ylim(0, 1.02)
ax.set_xlabel("입력 $x$ (꽉 찬 진폭 = 1)")
ax.set_ylabel("압축된 값 $y = F(x)$")
ax.set_title("압축 곡선과 계단 경계", fontsize=10.5)

xx = np.linspace(-1.15, 1.15, 4000)
ax2.plot(xx, uq(xx, N1) - xx, color=INK, lw=1, label="균일 4비트")
ax2.plot(xx, mu_e(uq(mu_c(np.clip(xx, -1, 1)), N1)) - xx, color=C[0], lw=1.3, label="$\\mu$ 법칙 4비트")
ax2.axvline(-1, color=INK, lw=0.5, ls=":")
ax2.axvline(1, color=INK, lw=0.5, ls=":")
ax2.text(1.03, 0.30, "범위 밖:\n잘림", fontsize=9.5)
ax2.set_xlim(-1.18, 1.38)
ax2.set_ylim(-0.48, 0.48)
ax2.set_xlabel("입력 $x$")
ax2.set_ylabel("오차 = 양자화 값 - $x$")
ax2.set_title("양자화 오차", fontsize=10.5)
ax2.legend(loc="upper left", fontsize=9.5)
save(fig, 1)


# 그림 2: 8비트 SQNR을 입력 크기(꽉 찬 진폭 기준 dB)에 따라: 균일, μ 법칙, A 법칙
base = np.sin(2 * np.pi * 0.1234567891 * np.arange(60_000) + 0.3)
lv = np.arange(-60, 0.1, 2.0)


def sq(level, q):
    s = 10 ** (level / 20) * base
    e = q(s) - s
    return 10 * np.log10(np.mean(s ** 2) / np.mean(e ** 2))


s_u = np.array([sq(v, lambda s: uq(s, 8)) for v in lv])
s_m = np.array([sq(v, lambda s: mu_e(uq(mu_c(s), 8))) for v in lv])
s_a = np.array([sq(v, lambda s: a_e(uq(a_c(s), 8))) for v in lv])
fig, ax = plt.subplots(figsize=(7.0, 3.6))
ax.plot(lv, s_u, color=INK, lw=1.8)
ax.plot(lv, s_m, color=C[0], lw=1.8)
ax.plot(lv, s_a, color=C[1], lw=1.2, ls="--")
ax.text(-3, 47, "균일 8비트", ha="right", fontsize=9.5)
ax.text(-34, 40.5, "$\\mu$ 법칙 8비트", color=C[0], fontsize=9.5)
ax.text(-59, 4, "A 법칙 8비트", color=C[1], fontsize=9.5)
ax.annotate("약 -12 dB에서 엇갈린다", xy=(-12, 37.5), xytext=(-30, 50), fontsize=9.5,
            arrowprops=dict(arrowstyle="->", color=INK))
ax.set_xlabel("입력 정현파의 크기 (꽉 찬 진폭 기준, dB)")
ax.set_ylabel("SQNR (dB)")
ax.set_xlim(-61, 1)
ax.set_ylim(-15, 55)
ax.grid(color=INK, lw=0.3, alpha=0.5)
save(fig, 2)

if __name__ == "__main__":
    # 그림 1: 경계가 0 쪽에서 좁고 끝에서 넓다. 첫 경계는 0.0078 근처, 마지막 칸은 0.5 이상 넓다
    xb = mu_e(levels)
    assert np.all(np.diff(np.concatenate([[0], xb, [1]])) > 0)
    w = np.diff(np.concatenate([[0], xb, [1]]))
    assert w[0] < 0.01 and w[-1] > 0.5
    # 그림 2: 꽉 찬 신호 균일 약 49.9, μ 법칙 약 37~38.5, -40 dB에서 균일 약 9, μ 법칙 약 34
    i0 = np.argmin(np.abs(lv - 0))
    i40 = np.argmin(np.abs(lv + 40))
    assert abs(s_u[i0] - 49.9) < 0.5 and 37 < s_m[i0] < 38.5
    assert abs(s_u[i40] - 9.3) < 1.2 and abs(s_m[i40] - 34.1) < 1.2
    cross = lv[s_m > s_u].max()                 # μ 법칙이 균일보다 나은 가장 큰 입력
    assert -14 <= cross <= -10, cross
    print("ALL CHECKS PASSED")
```
{% endraw %}
