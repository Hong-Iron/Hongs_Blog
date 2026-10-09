---
layout: "note"
title: "44_scheduling-algorithms_plot.py"
display_title: "44_scheduling-algorithms_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "44"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/scheduling-algorithms/"
parent_title: "스케줄링 알고리즘"
description: "운영체제 · 스케줄링 알고리즘 그림 생성 코드"
permalink: "/studies/operating-systems/code/44_scheduling-algorithms_plot/"
---
{% raw %}
[스케줄링 알고리즘](/Hongs_Blog/studies/operating-systems/scheduling-algorithms/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 스케줄링 알고리즘 문서의 그림을 만든다: 44_scheduling-algorithms_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 44_scheduling-algorithms_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "44_scheduling-algorithms"
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


from fractions import Fraction as F

PROCS = [("A", 0, 3), ("B", 2, 6), ("C", 4, 4), ("D", 6, 5), ("E", 8, 2)]


def run(policy, procs=PROCS, q=1):
    # 44_scheduling_impl.py의 시뮬레이터를 그대로 옮겼다
    arrive = {n: a for n, a, _ in procs}
    service = {n: s for n, _, s in procs}
    left = dict(service)
    finish, ready, t, cur, slice_used = {}, [], 0, None, 0
    level = {n: 0 for n in service}
    timeline = []
    while len(finish) < len(procs):
        for n, a, _ in procs:
            if a == t:
                ready.append(n)
        if cur is not None:
            if policy in ("RR", "FB", "FB2") and slice_used >= (q if policy == "RR" else (1 if policy == "FB" else 2 ** level[cur])):
                if ready:
                    if policy != "RR":
                        level[cur] += 1
                    ready.append(cur); cur = None
                else:
                    slice_used = 0
            elif policy == "SRT" and ready and min(left[r] for r in ready) < left[cur]:
                ready.append(cur); cur = None
        if cur is None and ready:
            if policy in ("FCFS", "RR"):
                cur = ready.pop(0)
            elif policy == "SPN":
                cur = min(ready, key=lambda n: (service[n], arrive[n])); ready.remove(cur)
            elif policy == "SRT":
                cur = min(ready, key=lambda n: (left[n], arrive[n])); ready.remove(cur)
            elif policy == "HRRN":
                cur = max(ready, key=lambda n: (F(t - arrive[n] + service[n], service[n]), -arrive[n])); ready.remove(cur)
            elif policy in ("FB", "FB2"):
                lv = min(level[n] for n in ready)
                cur = next(n for n in ready if level[n] == lv); ready.remove(cur)
            slice_used = 0
        timeline.append(cur or "-")
        if cur is not None:
            left[cur] -= 1; slice_used += 1
            if left[cur] == 0:
                finish[cur] = t + 1; cur = None
        t += 1
    tr = {n: finish[n] - arrive[n] for n in service}
    return finish, tr, "".join(timeline)


ROWS = [("FCFS", "FCFS", 1), ("RR, q = 1", "RR", 1), ("RR, q = 4", "RR", 4), ("SPN", "SPN", 1),
        ("SRT", "SRT", 1), ("HRRN", "HRRN", 1), ("피드백, q = 1", "FB", 1), ("피드백, q = $2^i$", "FB2", 1)]
COLOR = dict(zip("ABCDE", C))

# 그림 1: 여덟 정책의 실행 순서를 시간축 막대로
fig, ax = plt.subplots(figsize=(6.5, 3.9))
results = {}
for r, (label, pol, q) in enumerate(ROWS):
    fin, tr, tl = run(pol, q=q)
    results[label] = (fin, tr, tl)
    y = len(ROWS) - 1 - r
    s = 0
    while s < len(tl):
        e = s
        while e < len(tl) and tl[e] == tl[s]:
            e += 1
        ax.broken_barh([(s, e - s)], (y - 0.38, 0.76), facecolors=COLOR[tl[s]], edgecolor="white", lw=0.8)
        ax.text((s + e) / 2, y, tl[s], ha="center", va="center", color="white", fontsize=9)
        s = e
    avg = sum(tr.values()) / 5
    ax.text(20.4, y, f"{avg:.2f}", va="center", fontsize=9)
ax.text(20.4, len(ROWS) - 0.35, "평균 반환", fontsize=9, va="bottom")
for n, a, _ in PROCS:
    ax.annotate("", xy=(a, len(ROWS) - 0.5), xytext=(a, len(ROWS) + 0.05),
                arrowprops=dict(arrowstyle="->", color=COLOR[n], lw=1.3))
    ax.text(a, len(ROWS) + 0.1, f"{n} 도착", ha="center", va="bottom", fontsize=8, color=COLOR[n])
ax.set_yticks(range(len(ROWS)))
ax.set_yticklabels([lab for lab, _, _ in ROWS][::-1])
ax.set_xlim(0, 20)
ax.set_ylim(-0.6, len(ROWS) + 0.6)
ax.set_xticks(range(0, 21, 2))
ax.set_xlabel("시각")
ax.spines["left"].set_visible(False)
ax.tick_params(axis="y", length=0)
save(fig, 1)

if __name__ == "__main__":
    # 문서 표의 실행 순서와 평균 반환 시간
    expect = {"FCFS": ("AAABBBBBBCCCCDDDDDEE", 8.6), "RR, q = 1": ("AABABCBDCBEDCBEDCBDD", 10.8),
              "RR, q = 4": ("AAABBBBCCCCDDDDBBEED", 10.0), "SPN": ("AAABBBBBBEECCCCDDDDD", 7.6),
              "SRT": ("AAABCCCCEEBBBBBDDDDD", 7.2), "HRRN": ("AAABBBBBBCCCCEEDDDDD", 8.0),
              "피드백, q = 1": ("AABACBDCEDEBCDBCDBDB", 10.0), "피드백, q = $2^i$": ("AABACBBDECCDDEBBBCDD", 10.6)}
    for label, (tl, avg) in expect.items():
        fin, tr, got = results[label]
        assert got == tl, (label, got)
        assert abs(sum(tr.values()) / 5 - avg) < 1e-9, label
    print("ALL CHECKS PASSED")
```
{% endraw %}
