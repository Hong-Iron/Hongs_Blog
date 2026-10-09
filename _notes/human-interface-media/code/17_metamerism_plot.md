---
layout: "note"
title: "17_metamerism_plot.py"
display_title: "17_metamerism_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "17"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/metamerism/"
parent_title: "조건등색"
description: "휴먼 인터페이스 미디어 · 조건등색 코드 코드"
permalink: "/studies/human-interface-media/code/17_metamerism_plot/"
---
{% raw %}
[조건등색](/Hongs_Blog/studies/human-interface-media/metamerism/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 조건등색 문서의 그림을 만든다: 17_metamerism_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 17_metamerism_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "17_metamerism"
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


lams = np.array([400 + 10 * i for i in range(31)], dtype=float)
Cm = np.array([sens(k, lams) for k in "SML"])              # 3 x 31
# 검증 코드와 같은 영공간 벡터: 칸 10을 1로, 칸 5·15·25로 반응을 0으로 맞춘다
base, extra = [5, 15, 25], 10
y = np.linalg.solve(Cm[:, base], -Cm[:, extra])
v = np.zeros(31)
v[base] = y
v[extra] = 1.0
white = np.ones(31)
eps = min(1.0 / abs(x) for x in v if x < 0) * 0.9
other = white + eps * v

# 그림 1: 모양이 전혀 다른 두 스펙트럼이 세 추상체에는 같은 반응을 만든다
r_w, r_o = Cm @ white, Cm @ other
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.step(lams, other, where="mid", color=C[1], lw=2, label="다른 빛 (흰빛 + 영공간 방향)")
ax.step(lams, white, where="mid", color=C[0], lw=1.6, ls="--", label="흰빛 (모든 칸 1)")
txt = "세 반응 (S, M, L)\n흰빛: ({:.2f}, {:.2f}, {:.2f})\n다른 빛: ({:.2f}, {:.2f}, {:.2f})".format(*r_w, *r_o)
ax.text(0.98, 0.97, txt, transform=ax.transAxes, ha="right", va="top", fontsize=9)
ax.set_xlim(395, 705)
ax.set_ylim(0, max(other) * 1.45)
ax.set_xlabel("파장 (nm), 10 nm 칸 31개")
ax.set_ylabel("칸마다 세기")
ax.legend(loc="upper left", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 세 반응이 같고(오차 1e-9), 음수 칸이 없고, 칸마다 차이가 최대 약 2.02
    assert np.allclose(r_w, r_o, atol=1e-9)
    assert other.min() >= 0
    assert abs(np.abs(other - white).max() - 2.02) < 0.01, np.abs(other - white).max()
    print("ALL CHECKS PASSED")
```
{% endraw %}
