---
layout: "note"
title: "18_null-invariant-measures_plot.py"
display_title: "18_null-invariant-measures_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "18"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/null-invariant-measures/"
parent_title: "널 불변 측정"
description: "데이터 과학 · 널 불변 측정 그림 생성 코드"
permalink: "/studies/data-science/code/18_null-invariant-measures_plot/"
---
{% raw %}
[널 불변 측정](/Hongs_Blog/studies/data-science/null-invariant-measures/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 널 불변 측정 문서의 그림을 만든다: 18_null-invariant-measures_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 18_null-invariant-measures_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "18_null-invariant-measures"
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

BC, NBC, BNC = 10000, 1000, 1000                        # 표 D1, D2의 BC, ¬BC, B¬C


def measures(null):
    n = BC + NBC + BNC + null
    sb, sc, sbc = (BC + BNC) / n, (BC + NBC) / n, BC / n
    lift = sbc / (sb * sc)
    kulc = 0.5 * (sbc / sb + sbc / sc)
    return lift, kulc


# 그림 1: 널 거래(둘 다 없는 거래) 수를 늘릴 때 리프트와 Kulc
nulls = np.logspace(1, 9, 200)
L = np.array([measures(v) for v in nulls])
fig, ax = plt.subplots(figsize=(6, 3.5))
ax.plot(nulls, L[:, 0], color=C[1], lw=2, label="리프트")
ax.plot(nulls, L[:, 1], color=C[0], lw=2, label="Kulc")
ax.axhline(1, color=INK, lw=0.7, ls=":")
for v, name in [(100, "D2"), (100000, "D1")]:
    lf, kc = measures(v)
    ax.plot([v], [lf], "o", color=C[1])
    ax.annotate(f"{name}: 리프트 {lf:.2f}", xy=(v, lf), xytext=(v * 2.5, lf * 0.45) if name == "D1" else (v * 0.5, 2.6), fontsize=10)
ax.text(3e6, 0.5, "Kulc 0.91 그대로", fontsize=10, color=C[0])
ax.set_xscale("log")
ax.set_yscale("log")
ax.set_xlabel("널 거래 수 (우유도 커피도 없는 거래)")
ax.set_ylabel("측정값 (로그 눈금)")
ax.legend(loc="upper left")
save(fig, 1)

if __name__ == "__main__":
    assert round(measures(100000)[0], 2) == 9.26 and round(measures(100)[0], 2) == 1.0
    assert all(abs(measures(v)[1] - 10000 / 11000) < 1e-12 for v in (10, 100, 1e5, 1e9))
    assert round(measures(1e5)[1], 2) == 0.91
    print("ALL CHECKS PASSED")
```
{% endraw %}
