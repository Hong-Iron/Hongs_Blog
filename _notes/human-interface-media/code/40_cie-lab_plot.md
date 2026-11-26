---
layout: "note"
title: "40_cie-lab_plot.py"
display_title: "40_cie-lab_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "40"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/cie-lab/"
parent_title: "CIE Lab"
description: "휴먼 인터페이스 미디어 · CIE Lab 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/40_cie-lab_plot/"
---
{% raw %}
[CIE Lab](/Hongs_Blog/studies/human-interface-media/cie-lab/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# CIE Lab 문서의 그림을 만든다: 40_cie-lab_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 40_cie-lab_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "40_cie-lab"
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


D = 6 / 29
T0 = D**3


def f(t):
    t = np.asarray(t, dtype=float)
    return np.where(t > T0, np.cbrt(t), t / (3 * D * D) + 4 / 29)


def Lstar(t):
    return 116 * f(t) - 16


fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.6, 3.6), gridspec_kw={"width_ratios": [1.25, 1]})

# 왼쪽: 휘도를 똑같이 0.1씩 올린 회색 10단계가 L*에서는 고르지 않게 놓인다
t = np.linspace(0, 1, 501)
ax1.plot(t, Lstar(t), color=C[0], lw=2)
steps = np.arange(1, 11) / 10
for s in steps:
    L = float(Lstar(s))
    ax1.plot([s, s], [0, L], color=INK, lw=0.6, ls=":")
    ax1.plot([0, s], [L, L], color=INK, lw=0.6, ls=":")
    ax1.plot(0, L, "_", color=C[1], ms=10, mew=2)
ax1.annotate("간격 14", (0.0, 44.8), xytext=(0.13, 30), fontsize=10, color=C[1],
             arrowprops=dict(arrowstyle="->", color=C[1], lw=0.8))
ax1.annotate("간격 4", (0.0, 98.0), xytext=(0.13, 104), fontsize=10, color=C[1],
             arrowprops=dict(arrowstyle="->", color=C[1], lw=0.8))
ax1.plot(0.18, float(Lstar(0.18)), "o", color=C[2], ms=5)
ax1.annotate("18% 회색 → 49.5", (0.18, float(Lstar(0.18))), xytext=(0.30, 42), fontsize=10, color=C[2])
ax1.set_xlim(0, 1.02)
ax1.set_ylim(0, 110)
ax1.set_xlabel("휘도 $Y/Y_n$ (0.1씩 같은 간격)")
ax1.set_ylabel("$L^*$")

# 오른쪽: 0 근처 확대. 세제곱근만 쓰면 검정이 -16으로 내려가고 기울기가 끝없이 커진다
tz = np.linspace(0, 0.03, 601)
ax2.plot(tz, 116 * np.cbrt(tz) - 16, color=C[1], lw=1.5, ls="--")
ax2.plot(tz, Lstar(tz), color=C[0], lw=2)
ax2.axvline(T0, color=INK, lw=0.8, ls=":")
ax2.text(T0 + 0.0006, -12, "$t_0 \\approx 0.0089$", fontsize=10)
ax2.text(0.0016, -9, "세제곱근만 쓰면", fontsize=10, color=C[1])
ax2.text(0.0115, 2.5, "실제 $L^*$ (0 근처는 직선)", fontsize=10, color=C[0])
ax2.axhline(0, color=INK, lw=0.6)
ax2.set_xlim(0, 0.03)
ax2.set_ylim(-17, 22)
ax2.set_xlabel("$Y/Y_n$ (0 근처 확대)")
ax2.set_ylabel("$L^*$")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    L = [float(Lstar(s)) for s in steps]
    assert abs((L[1] - L[0]) - 14.0) < 0.05 and abs((L[9] - L[8]) - 4.0) < 0.05
    assert abs(float(Lstar(0.18)) - 49.5) < 0.01
    assert abs(float(Lstar(0.0)) - 0.0) < 1e-12 and abs(116 * 0 - 16 + 16) < 1e-12
    assert abs(T0 - 0.008856) < 1e-6
    # 두 조각이 t0에서 이어진다
    assert abs(116 * T0 ** (1 / 3) - 16 - float(Lstar(T0 * (1 - 1e-12)))) < 1e-6
    print("ALL CHECKS PASSED")
```
{% endraw %}
