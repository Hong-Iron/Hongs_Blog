---
layout: "note"
title: "28_lti-eigenfunction_plot.py"
display_title: "28_lti-eigenfunction_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "28"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/lti-eigenfunction/"
parent_title: "LTI 시스템의 고유함수"
description: "신호 및 시스템 · LTI 시스템의 고유함수 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/28_lti-eigenfunction_plot/"
---
{% raw %}
[LTI 시스템의 고유함수](/Hongs_Blog/studies/signals-and-systems/lti-eigenfunction/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# LTI 시스템의 고유함수 문서의 그림을 만든다: 28_lti-eigenfunction_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 28_lti-eigenfunction_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "28_lti-eigenfunction"
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


def stem(ax, n, x, color, label=None, ms=5):
    # 이산 시간 신호는 막대 끝에 점을 찍은 줄기 그림으로 그린다
    ml, sl, bl = ax.stem(n, x, linefmt="-", markerfmt="o", basefmt=" ", label=label)
    plt.setp(sl, color=color, lw=1.4)
    plt.setp(ml, color=color, markersize=ms)
    ax.axhline(0, color=INK, lw=0.6)


# h(t) = e^{-t}u(t), H(jω) = 1/(1 + jω). 입력 cos 2t (모든 시간에 계속됨)
w = 2.0
H = 1 / (1 + 1j * w)
t = np.linspace(0, 8, 1000)
x = np.cos(w * t)
y = np.abs(H) * np.cos(w * t + np.angle(H))

# 그림 1: 출력은 같은 주파수의 코사인이고, 크기는 1/√5배, 위상은 tan⁻¹2만큼 늦다
fig, ax = plt.subplots(figsize=(6.5, 3))
ax.plot(t, x, color=C[0], lw=1.6, label=r"입력 $\cos 2t$")
ax.plot(t, y, color=C[1], lw=1.8, label=r"출력 $\frac{1}{\sqrt{5}}\cos(2t - \tan^{-1}2)$")
pk_in = 2 * np.pi / w
pk_out = pk_in - np.angle(H) / w
ax.annotate("", xy=(pk_out, 1.08), xytext=(pk_in, 1.08), arrowprops=dict(arrowstyle="->", color=INK))
ax.plot([pk_in, pk_in], [0, 1.08], color=INK, lw=0.5, ls=":")
ax.plot([pk_out, pk_out], [0, 1.08], color=INK, lw=0.5, ls=":")
ax.axhline(0, color=INK, lw=0.6)
ax.set_xlabel("$t$")
ax.set_ylim(-1.2, 1.7)
ax.legend(loc="upper center", ncol=2, fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 수치 컨벌루션 ∫_0^∞ e^{-τ} cos(2(t - τ)) dτ가 그림의 출력과 같다. 크기 1/√5 = 0.447, 위상 -1.107
    tau = np.linspace(0, 40, 400001)
    d = tau[1] - tau[0]
    for tv in (0.0, 1.3, 5.0):
        num = np.sum(np.exp(-tau) * np.cos(w * (tv - tau))) * d
        assert abs(num - np.abs(H) * np.cos(w * tv + np.angle(H))) < 1e-3
    assert abs(np.abs(H) - 1 / math.sqrt(5)) < 1e-12 and abs(np.angle(H) + math.atan(2)) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
