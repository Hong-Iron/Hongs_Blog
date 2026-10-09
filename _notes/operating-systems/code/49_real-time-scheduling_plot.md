---
layout: "note"
title: "49_real-time-scheduling_plot.py"
display_title: "49_real-time-scheduling_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "49"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/real-time-scheduling/"
parent_title: "실시간 스케줄링"
description: "운영체제 · 실시간 스케줄링 코드 코드"
permalink: "/studies/operating-systems/code/49_real-time-scheduling_plot/"
---
{% raw %}
[실시간 스케줄링](/Hongs_Blog/studies/operating-systems/real-time-scheduling/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 실시간 스케줄링 문서의 그림을 만든다: 49_real-time-scheduling_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 49_real-time-scheduling_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "49_real-time-scheduling"
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


def periodic(policy, horizon=100):
    """49_real-time-scheduling_impl.py와 같은 규칙. 시간 단위마다 실행한 작업 이름(A1, B2 …)을 돌려준다."""
    tasks = {"A": (20, 10), "B": (50, 25)}          # 이름: (주기, 실행 시간). 마감 = 다음 도착
    jobs, timeline, missed = [], [], []
    for t in range(horizon):
        for n, (T, Cx) in tasks.items():
            if t % T == 0:
                jobs.append({"n": n, "k": t // T + 1, "left": Cx, "dl": t + T, "rel": t})
        for j in [j for j in jobs if j["left"] > 0 and j["dl"] <= t]:
            missed.append((f'{j["n"]}{j["k"]}', j["dl"])); j["left"] = 0
        ready = [j for j in jobs if j["left"] > 0]
        if not ready:
            timeline.append(None); continue
        if policy == "EDF":
            cur = min(ready, key=lambda j: (j["dl"], j["rel"]))
        else:
            cur = min(ready, key=lambda j: (j["n"] != policy, j["dl"]))
        cur["left"] -= 1
        timeline.append(f'{cur["n"]}{cur["k"]}')
    for j in jobs:
        if j["left"] > 0 and j["dl"] <= horizon:
            missed.append((f'{j["n"]}{j["k"]}', j["dl"]))
    return timeline, sorted(set(missed))


ROWS = [("A 우선", "A"), ("B 우선", "B"), ("EDF", "EDF")]
COLOR = {"A": C[0], "B": C[1]}

# 그림 1: 주기 작업 A(20마다 10), B(50마다 25)의 세 정책 실행 막대와 놓친 마감
fig, ax = plt.subplots(figsize=(6.5, 2.9))
res = {}
for r, (label, pol) in enumerate(ROWS):
    tl, missed = periodic(pol)
    res[pol] = (tl, missed)
    y = len(ROWS) - 1 - r
    s = 0
    while s < len(tl):
        e = s
        while e < len(tl) and tl[e] == tl[s]:
            e += 1
        if tl[s] is not None:
            ax.broken_barh([(s, e - s)], (y - 0.32, 0.64), facecolors=COLOR[tl[s][0]], edgecolor="white", lw=0.8)
            if e - s >= 5:
                ax.text((s + e) / 2, y, tl[s], ha="center", va="center", color="white", fontsize=8)
        s = e
    for name, dl in missed:
        ax.plot([dl], [y + 0.42], marker="v", color=C[3], ms=7)
        ax.text(dl, y + 0.5, f"{name} 놓침", ha="center", va="bottom", fontsize=8, color=C[3])
for t in range(0, 101, 20):
    ax.axvline(t, color=C[0], lw=0.6, ls=":", zorder=0)
for t in (0, 50, 100):
    ax.axvline(t, color=C[1], lw=0.9, ls="--", zorder=0)
ax.set_yticks(range(len(ROWS)))
ax.set_yticklabels([lab for lab, _ in ROWS][::-1])
ax.set_xlim(0, 100)
ax.set_ylim(-0.5, len(ROWS) - 0.1)
ax.set_xticks(range(0, 101, 10))
ax.set_xlabel("시각 (ms)  ·  점선: A가 오는 때와 마감, 파선: B가 오는 때와 마감")
ax.spines["left"].set_visible(False)
ax.tick_params(axis="y", length=0)
save(fig, 1)

if __name__ == "__main__":
    assert [m for m, _ in res["A"][1]] == ["B1"]                # 문서 표의 놓친 마감
    assert [m for m, _ in res["B"][1]] == ["A1", "A4"]
    assert res["EDF"][1] == []
    tl = res["EDF"][0]
    assert tl[30:45] == ["B1"] * 15 and tl[55:60] == ["B2"] * 5 and tl[70:90] == ["B2"] * 20
    print("ALL CHECKS PASSED")
```
{% endraw %}
