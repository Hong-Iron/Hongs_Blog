---
layout: "note"
title: "46_fair-share-unix-scheduling_plot.py"
display_title: "46_fair-share-unix-scheduling_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "46"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/fair-share-unix-scheduling/"
parent_title: "공정 분배와 UNIX 스케줄링"
description: "운영체제 · 공정 분배와 UNIX 스케줄링 코드 코드"
permalink: "/studies/operating-systems/code/46_fair-share-unix-scheduling_plot/"
---
{% raw %}
[공정 분배와 UNIX 스케줄링](/Hongs_Blog/studies/operating-systems/fair-share-unix-scheduling/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 공정 분배와 UNIX 스케줄링 문서의 그림을 만든다: 46_fair-share-unix-scheduling_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 46_fair-share-unix-scheduling_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "46_fair-share-unix-scheduling"
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


def unix(seconds, base=60):
    # 46_unix-fair-share_verify.py와 같은 규칙: 매초 CPU를 반으로, 우선순위 = 기본 + CPU/2
    cpu = {p: 0 for p in "ABC"}
    prio = {p: base for p in "ABC"}
    runs = []
    for _ in range(seconds):
        run = min("ABC", key=lambda p: (prio[p], "ABC".index(p)))
        runs.append(run)
        cpu[run] += 60
        for p in "ABC":
            cpu[p] //= 2
            prio[p] = base + cpu[p] // 2
    return runs


def fair(seconds, base=60, W=0.5):
    group = {"A": 1, "B": 2, "C": 2}
    cpu = {p: 0 for p in "ABC"}; gcpu = {1: 0, 2: 0}
    prio = {p: base for p in "ABC"}
    runs = []
    for _ in range(seconds):
        run = min("ABC", key=lambda p: (prio[p], "ABC".index(p)))
        runs.append(run)
        cpu[run] += 60; gcpu[group[run]] += 60
        for p in "ABC":
            cpu[p] //= 2
        for g in gcpu:
            gcpu[g] //= 2
        for p in "ABC":
            prio[p] = base + int(cpu[p] / 2) + int(gcpu[group[p]] / (4 * W))
    return runs


SEC = 30
RUNS = {"전통 UNIX": unix(SEC), "공정 분배 (A: 그룹 1, B·C: 그룹 2)": fair(SEC)}

# 그림 1: 30초 동안 각 프로세스가 받은 프로세서 시간의 누적
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3.2), sharey=True)
for ax, (title, runs) in zip(axes, RUNS.items()):
    t = np.arange(0, SEC + 1)
    finals = []
    for i, p in enumerate("ABC"):
        cum = np.concatenate([[0], np.cumsum([r == p for r in runs])])
        ax.step(t, cum, where="post", color=C[i], lw=1.6)
        finals.append(int(cum[-1]))
    if len(set(finals)) == 1:
        ax.text(SEC + 0.5, finals[0], f"A·B·C\n각 {finals[0]}초", va="center", fontsize=9)
    else:
        for i, p in enumerate("ABC"):
            ax.text(SEC + 0.5, finals[i], f"{p} {finals[i]}초", va="center", fontsize=9, color=C[i])
    ax.set_yticks(range(0, 16, 5))
    ax.set_title(title, fontsize=10, color=INK)
    ax.set_xlabel("시각 (초)")
    ax.set_xlim(0, SEC + 6)
axes[0].set_ylabel("받은 프로세서 시간 (초)")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    u, f = RUNS["전통 UNIX"], RUNS["공정 분배 (A: 그룹 1, B·C: 그룹 2)"]
    assert u[:5] == list("ABCAB") and f[:5] == list("ABACA")      # 문서의 두 표
    assert [u.count(p) for p in "ABC"] == [10, 10, 10]
    assert [f.count(p) for p in "ABC"] == [15, 8, 7]                # 그룹 1이 절반
    print("ALL CHECKS PASSED")
```
{% endraw %}
