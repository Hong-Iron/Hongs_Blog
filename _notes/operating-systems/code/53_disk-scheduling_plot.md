---
layout: "note"
title: "53_disk-scheduling_plot.py"
display_title: "53_disk-scheduling_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "53"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/disk-scheduling/"
parent_title: "디스크 스케줄링"
description: "운영체제 · 디스크 스케줄링 코드 코드"
permalink: "/studies/operating-systems/code/53_disk-scheduling_plot/"
---
{% raw %}
[디스크 스케줄링](/Hongs_Blog/studies/operating-systems/disk-scheduling/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 디스크 스케줄링 문서의 그림을 만든다: 53_disk-scheduling_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 53_disk-scheduling_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "53_disk-scheduling"
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


REQ = [55, 58, 39, 18, 90, 160, 150, 38, 184]


def schedule(policy, reqs=REQ, head=100):
    # 53_disk-scheduling_impl.py와 같은 규칙. SCAN·C-SCAN은 마지막 요청에서 돌아선다
    pending, order, pos = list(reqs), [], head
    if policy == "FIFO":
        order = list(reqs)
    elif policy == "SSTF":
        while pending:
            nxt = min(pending, key=lambda r: (abs(r - pos), r)); pending.remove(nxt); order.append(nxt); pos = nxt
    elif policy == "SCAN":
        order = sorted(r for r in pending if r >= pos) + sorted((r for r in pending if r < pos), reverse=True)
    elif policy == "C-SCAN":
        order = sorted(r for r in pending if r >= pos) + sorted(r for r in pending if r < pos)
    moves, pos = [], head
    for r in order:
        moves.append(abs(r - pos)); pos = r
    return order, moves


# 그림 1: 네 정책에서 헤드가 지나간 길
fig, axes = plt.subplots(2, 2, figsize=(6.5, 4.6), sharex=True, sharey=True)
out = {}
for i, (ax, pol) in enumerate(zip(axes.flat, ["FIFO", "SSTF", "SCAN", "C-SCAN"])):
    order, moves = schedule(pol)
    out[pol] = (order, sum(moves))
    path = [100] + order
    steps = list(range(len(path)))
    if pol == "C-SCAN":
        k = order.index(18) + 1                         # 184 → 18은 처리 없이 돌아가는 구간
        ax.plot(path[:k], steps[:k], "-o", color=C[i], ms=4, lw=1.5)
        ax.plot(path[k - 1:k + 1], steps[k - 1:k + 1], ":", color=C[i], lw=1.3)
        ax.plot(path[k:], steps[k:], "-o", color=C[i], ms=4, lw=1.5)
    else:
        ax.plot(path, steps, "-o", color=C[i], ms=4, lw=1.5)
    ax.plot([100], [0], "s", color=INK, ms=6)
    ax.set_title(f"{pol}  이동 합 {sum(moves)}", fontsize=10, color=INK)
    ax.set_xlim(0, 199)
    ax.set_ylim(len(path) - 0.5, -0.5)
for ax in axes[1]:
    ax.set_xlabel("트랙 번호")
for ax in axes[:, 0]:
    ax.set_ylabel("처리 순서")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert out["FIFO"][1] == 498 and out["SSTF"][1] == 248      # 문서 표 (표 11.2)
    assert out["SCAN"][1] == 250 and out["C-SCAN"][1] == 322
    assert out["SSTF"][0] == [90, 58, 55, 39, 38, 18, 150, 160, 184]
    assert out["C-SCAN"][0] == [150, 160, 184, 18, 38, 39, 55, 58, 90]
    print("ALL CHECKS PASSED")
```
{% endraw %}
