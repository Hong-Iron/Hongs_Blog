---
layout: "note"
title: "26_timing-analysis_plot.py"
display_title: "26_timing-analysis_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "26"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/timing-analysis/"
parent_title: "소요시간 분석"
description: "컴퓨터 통신 · 소요시간 분석 코드 코드"
permalink: "/studies/computer-communication/code/26_timing-analysis_plot/"
---
{% raw %}
[소요시간 분석](/Hongs_Blog/studies/computer-communication/timing-analysis/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 소요시간 분석 문서의 그림을 만든다: 26_timing-analysis_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 26_timing-analysis_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "26_timing-analysis"
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

from matplotlib.patches import Polygon

TAU, DELTA, RHO = 2.0, 1.0, 0.5   # 싣기 2 ms, 전파 1 ms, 처리 0.5 ms
H, P = 3, 3                        # 링크 3개, 패킷 3개
NAMES = ["Host 1", "Node 1", "Node 2", "Host 2"]


def schedule():
    """send[k][i] = 패킷 k가 링크 i에 실리기 시작하는 시각, done = 다 실린 시각 (점화식 그대로)."""
    start = [[0.0] * H for _ in range(P)]
    proc_end = [[-math.inf] * H for _ in range(P)]
    for k in range(P):
        for i in range(H):
            if i == 0:
                ready = k * TAU
            else:
                arrive = start[k][i - 1] + TAU + DELTA
                prev_proc = proc_end[k - 1][i] if k else -math.inf
                proc_end[k][i] = max(arrive, prev_proc) + RHO
                ready = proc_end[k][i]
            prev_link = start[k - 1][i] + TAU if k else -math.inf
            start[k][i] = max(ready, prev_link)
    return start, proc_end


START, PROC_END = schedule()
ARRIVAL = [START[k][H - 1] + TAU + DELTA for k in range(P)]

# 그림 1: 시간 흐름 그림. 가로는 노드, 세로는 시간(아래로 흐름). 띠 하나가 패킷 하나가 링크 하나를 건너는 모습
fig, ax = plt.subplots(figsize=(6, 4.2))
for x in range(H + 1):
    ax.axvline(x, color=INK, lw=0.8)
for k in range(P):
    for i in range(H):
        s = START[k][i]
        e = s + TAU
        poly = Polygon([(i, s), (i, e), (i + 1, e + DELTA), (i + 1, s + DELTA)], closed=True,
                       facecolor=C[k], alpha=0.55, edgecolor=C[k], lw=0.8)
        ax.add_patch(poly)
        if i > 0:
            ax.plot([i, i], [PROC_END[k][i] - RHO, PROC_END[k][i]], color=C[k], lw=4, solid_capstyle="butt")
    ax.annotate(f"패킷 {k + 1} 도착 {ARRIVAL[k]:g} ms", (H, ARRIVAL[k]), textcoords="offset points",
                xytext=(6, 0), va="center", fontsize=9, color=C[k])
ax.annotate("싣기 2 ms", (0, 1), textcoords="offset points", xytext=(-8, 0), ha="right", va="center", fontsize=9)
ax.annotate("처리 0.5 ms", (1, PROC_END[0][1] - RHO / 2), textcoords="offset points", xytext=(-8, 0),
            ha="right", va="center", fontsize=9)
ax.set_xlim(-0.1, H + 0.1)
ax.set_ylim(15, 0)
ax.set_xticks(range(H + 1), NAMES)
ax.xaxis.tick_top()
ax.spines["top"].set_visible(True)
ax.spines["bottom"].set_visible(False)
ax.spines["left"].set_visible(False)
ax.set_ylabel("시간 (ms)")
save(fig, 1)

if __name__ == "__main__":
    # 문서 표의 값: 도착 10, 12, 14 ms. Node 1에서 패킷 1을 싣기 시작 3.5 ms, Node 2에서 7 ms
    assert ARRIVAL == [10.0, 12.0, 14.0]
    assert START[0][1] == 3.5 and START[0][2] == 7.0 and START[2][2] == 11.0
    # 정리의 식 (H + P - 1)τ + Hδ + (H - 1)ρ
    assert ARRIVAL[-1] == (H + P - 1) * TAU + H * DELTA + (H - 1) * RHO
    print("ALL CHECKS PASSED")
```
{% endraw %}
