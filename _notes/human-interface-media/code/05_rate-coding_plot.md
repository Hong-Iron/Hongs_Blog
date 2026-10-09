---
layout: "note"
title: "05_rate-coding_plot.py"
display_title: "05_rate-coding_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "05"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/rate-coding/"
parent_title: "발화율 부호화"
description: "휴먼 인터페이스 미디어 · 발화율 부호화 코드 코드"
permalink: "/studies/human-interface-media/code/05_rate-coding_plot/"
---
{% raw %}
[발화율 부호화](/Hongs_Blog/studies/human-interface-media/rate-coding/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 발화율 부호화 문서의 그림을 만든다: 05_rate-coding_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 05_rate-coding_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "05_rate-coding"
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

T_REF = 1.0   # 불응기 1 ms
THETA = 1.0   # 문턱


def rate(s):
    """불응기가 있는 적분-발화 모형의 발화율(회/초). s는 세기(문턱 단위/ms)."""
    return 1000.0 / (T_REF + THETA / s)


# 그림 1: 세기가 커지면 발화율은 늘지만 1,000회/초에 붙어 포화한다
s = np.logspace(-1.3, 2, 400)
pts = [0.25, 0.5, 1, 2, 4]
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.axhspan(500, 800, color=C[4], alpha=0.12)
ax.text(0.06, 650, "슬라이드의 최대 발화율 500~800", fontsize=10, va="center")
ax.axhline(1000, color=C[1], lw=1.2, ls="--")
ax.text(0.06, 1030, "상한 $1/t_{ref}$ = 1,000회/초", fontsize=10, color=C[1], va="bottom")
ax.plot(s, rate(s), color=C[0], lw=2)
ax.plot(pts, [rate(p) for p in pts], "o", color=C[0], ms=5)
for p in pts:
    ax.annotate(f"{rate(p):.0f}", (p, rate(p)), textcoords="offset points", xytext=(6, -12), fontsize=9)
ax.set_xscale("log")
ax.set_xlim(0.05, 100)
ax.set_xticks([0.1, 1, 10, 100])
ax.set_xticklabels(["0.1", "1", "10", "100"])
ax.minorticks_off()
ax.set_ylim(0, 1150)
ax.set_xlabel("자극 세기 $s$ (로그 눈금)")
ax.set_ylabel("발화율 $r$ (회/초)")
save(fig, 1)

if __name__ == "__main__":
    # 문서의 값: s = 0.25, 0.5, 1, 2, 4 -> 200, 333, 500, 667, 800회/초, 상한 1,000 미만
    for p, want in zip(pts, [200, 333, 500, 667, 800]):
        assert abs(rate(p) - want) < 0.5, (p, rate(p))
    assert rate(100) < 1000 and 1000 - rate(1000) < 1
    print("ALL CHECKS PASSED")
```
{% endraw %}
