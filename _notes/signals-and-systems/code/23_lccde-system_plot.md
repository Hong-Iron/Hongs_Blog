---
layout: "note"
title: "23_lccde-system_plot.py"
display_title: "23_lccde-system_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "23"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/lccde-system/"
parent_title: "미분방정식으로 표현한 LTI 시스템"
description: "신호 및 시스템 · 미분방정식으로 표현한 LTI 시스템 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/23_lccde-system_plot/"
---
{% raw %}
[미분방정식으로 표현한 LTI 시스템](/Hongs_Blog/studies/signals-and-systems/lccde-system/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 미분방정식으로 표현한 LTI 시스템 문서의 그림을 만든다: 23_lccde-system_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 23_lccde-system_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "23_lccde-system"
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


# dy/dt + 2y = x, 초기 휴지, x = u(t): 강제 응답 1/2, 자연 응답 -1/2 e^{-2t}
t = np.linspace(-0.5, 3, 800)
forced = np.where(t >= 0, 0.5, 0.0)
natural = np.where(t >= 0, -0.5 * np.exp(-2 * t), 0.0)
total = forced + natural

# 그림 1: 계단 응답 = 강제 응답 + 자연 응답
fig, ax = plt.subplots(figsize=(6, 3.2))
ax.plot(t, forced, color=C[0], lw=1.4, ls="--", label=r"강제 응답 $\frac{1}{2}$")
ax.plot(t, natural, color=C[1], lw=1.4, ls="--", label=r"자연 응답 $-\frac{1}{2}e^{-2t}$")
ax.plot(t, total, color=C[2], lw=2.2, label="전체 $y(t)$")
ax.axhline(0, color=INK, lw=0.6)
ax.set_xlabel("$t$")
ax.set_ylim(-0.6, 0.85)
ax.legend(loc="upper center", ncol=3, fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # y(0) = 0 (초기 휴지), y가 식을 만족하고 1/2로 수렴, 오일러 방법과 일치
    y = lambda tv: 0.5 * (1 - math.exp(-2 * tv))
    assert abs(y(0.0)) < 1e-12
    for tv in (0.3, 1.0):
        d = (y(tv + 1e-6) - y(tv - 1e-6)) / 2e-6
        assert abs(d + 2 * y(tv) - 1) < 1e-6
    dt, v = 1e-4, 0.0
    for _ in range(int(1 / dt)):
        v += dt * (1 - 2 * v)
    assert abs(v - y(1.0)) < 1e-4
    print("ALL CHECKS PASSED")
```
{% endraw %}
