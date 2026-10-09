---
layout: "note"
title: "19_opponent-process_plot.py"
display_title: "19_opponent-process_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "19"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/opponent-process/"
parent_title: "반대색 과정"
description: "휴먼 인터페이스 미디어 · 반대색 과정 코드 코드"
permalink: "/studies/human-interface-media/code/19_opponent-process_plot/"
---
{% raw %}
[반대색 과정](/Hongs_Blog/studies/human-interface-media/opponent-process/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 반대색 과정 문서의 그림을 만든다: 19_opponent-process_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 19_opponent-process_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "19_opponent-process"
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

PEAK = {"S": 445.0, "M": 535.0, "L": 575.0}
WIDTH = {"S": 30.0, "M": 45.0, "L": 45.0}


def sens(cone, lam):
    return np.exp(-((np.asarray(lam, dtype=float) - PEAK[cone]) ** 2) / (2 * WIDTH[cone] ** 2))


def rg(lam):
    return sens("L", lam) - sens("M", lam)


def by(lam):
    return sens("S", lam) - 0.5 * (sens("M", lam) + sens("L", lam))


# 그림 1: 파장에 따른 두 차이 신호. 0을 지나는 곳에서 색의 "편"이 바뀐다
lam = np.linspace(400, 700, 601)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(lam, rg(lam), color=C[1], lw=2, label="RG $= r_L - r_M$")
ax.plot(lam, by(lam), color=C[0], lw=2, label=r"BY $= r_S - \frac{1}{2}(r_M + r_L)$")
ax.axhline(0, color=INK, lw=0.8)
for l, f, c in [(535, rg, C[1]), (575, rg, C[1]), (450, by, C[0]), (580, by, C[0])]:
    ax.plot(l, f(l), "o", color=c, ms=5)
    ax.annotate(f"{l}: {f(l):+.3f}", (l, f(l)), xytext=(6, -3 if f(l) > 0 else -12),
                textcoords="offset points", fontsize=8.5, color=c)
ax.set_xlim(400, 700)
ax.set_ylim(-1.0, 1.1)
ax.set_xlabel("단색광 파장 (nm)")
ax.set_ylabel("반대색 세포의 신호")
ax.legend(loc="upper right", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 문서의 값: L-M은 535 nm에서 -0.326, 575 nm에서 +0.326, BY는 450 nm +0.892, 580 nm -0.800
    assert abs(rg(535) + 0.326) < 0.001 and abs(rg(575) - 0.326) < 0.001
    assert abs(by(450) - 0.892) < 0.001 and abs(by(580) + 0.800) < 0.001
    # 0을 지나는 곳: RG는 555 nm(두 봉우리의 가운데), BY는 약 488 nm
    zr = lam[np.where(np.diff(np.sign(rg(lam))))[0]]
    zb = lam[np.where(np.diff(np.sign(by(lam))))[0]]
    assert len(zb) == 1 and abs(zb[0] - 488) < 1 and all(abs(z - 555) < 1 for z in zr), (zr, zb)
    print("ALL CHECKS PASSED")
```
{% endraw %}
