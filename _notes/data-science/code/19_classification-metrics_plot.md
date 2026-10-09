---
layout: "note"
title: "19_classification-metrics_plot.py"
display_title: "19_classification-metrics_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "19"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/classification-metrics/"
parent_title: "분류 평가 지표"
description: "데이터 과학 · 분류 평가 지표 그림 생성 코드"
permalink: "/studies/data-science/code/19_classification-metrics_plot/"
---
{% raw %}
[분류 평가 지표](/Hongs_Blog/studies/data-science/classification-metrics/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 분류 평가 지표 문서의 그림을 만든다: 19_classification-metrics_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 19_classification-metrics_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "19_classification-metrics"
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

def f1(p, r):
    return 2 * p * r / (p + r)


R = 0.8                                                 # 예시 모델의 재현율 8/10
P0 = 8 / 48                                             # 예시 모델의 정밀도

# 그림 1: 재현율을 0.8에 고정하고 정밀도를 바꿀 때 F1과 산술평균
p = np.linspace(0.005, 1, 400)
fig, ax = plt.subplots(figsize=(6, 3.5))
ax.plot(p, (p + R) / 2, color=INK, lw=1.6, ls="--", label="산술평균")
ax.plot(p, f1(p, R), color=C[0], lw=2, label="F1 (조화평균)")
ax.plot(p, p, color=C[1], lw=1, ls=":", label="정밀도 자신")
ax.plot([P0, P0], [f1(P0, R), (P0 + R) / 2], "o", color=C[0])
ax.annotate(f"예시 모델: F1 {f1(P0, R):.3f}", xy=(P0, f1(P0, R)), xytext=(0.25, 0.12), fontsize=10,
            arrowprops=dict(arrowstyle="->", color=INK, lw=1))
ax.annotate(f"산술평균 {(P0 + R) / 2:.3f}", xy=(P0, (P0 + R) / 2), xytext=(0.22, 0.6), fontsize=10,
            arrowprops=dict(arrowstyle="->", color=INK, lw=1))
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.set_xlabel("정밀도 (재현율은 0.8로 고정)")
ax.legend(loc="lower right", fontsize=10)
save(fig, 1)

if __name__ == "__main__":
    assert round(P0, 3) == 0.167 and round(f1(P0, R), 3) == 0.276 and round((P0 + R) / 2, 3) == 0.483
    assert all(min(a, R) <= f1(a, R) <= (a + R) / 2 + 1e-12 for a in p)
    print("ALL CHECKS PASSED")
```
{% endraw %}
