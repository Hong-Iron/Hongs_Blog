---
layout: "note"
title: "41_page-replacement_plot.py"
display_title: "41_page-replacement_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "41"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/page-replacement/"
parent_title: "페이지 교체 알고리즘"
description: "운영체제 · 페이지 교체 알고리즘 코드 코드"
permalink: "/studies/operating-systems/code/41_page-replacement_plot/"
---
{% raw %}
[페이지 교체 알고리즘](/Hongs_Blog/studies/operating-systems/page-replacement/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 페이지 교체 알고리즘 문서의 그림을 만든다: 41_page-replacement_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 41_page-replacement_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "41_page-replacement"
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


def total_faults(refs, nframes, how):
    """처음 채우는 부재까지 포함한 페이지 부재 수 (41_page-replacement_impl.py와 같은 규칙)."""
    frames, order, last, faults = [], [], {}, 0
    for t, p in enumerate(refs):
        if p not in frames:
            faults += 1
            if len(frames) < nframes:
                frames.append(p)
            else:
                if how == "OPT":
                    def nxt(q):
                        try:
                            return refs.index(q, t + 1)
                        except ValueError:
                            return float("inf")
                    victim = max(frames, key=nxt)
                elif how == "LRU":
                    victim = min(frames, key=lambda q: last[q])
                else:                                   # FIFO
                    victim = order.pop(0)
                frames[frames.index(victim)] = p
            order.append(p)
        last[p] = t
    return faults


B = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]
K = list(range(1, 8))

# 그림 1: 벨레이디의 참조열에서 프레임 수에 따른 부재 수
fig, ax = plt.subplots(figsize=(6, 3.6))
res = {}
for i, (how, mk) in enumerate([("FIFO", "o"), ("LRU", "s"), ("OPT", "^")]):
    res[how] = [total_faults(B, k, how) for k in K]
    ax.plot(K, res[how], marker=mk, color=C[i], lw=1.6, label=how)
ax.annotate("프레임을 늘렸는데\n부재가 9 → 10", xy=(4, 10), xytext=(4.6, 11.2),
            fontsize=9, color=C[0], arrowprops=dict(arrowstyle="->", color=C[0]))
ax.set_xlabel("프레임 수")
ax.set_ylabel("페이지 부재 수")
ax.set_xticks(K)
ax.set_ylim(0, 13)
ax.legend(loc="lower left")
save(fig, 1)

if __name__ == "__main__":
    assert res["FIFO"][2:4] == [9, 10]                   # 문서: 3개 9번, 4개 10번
    assert res["LRU"][2:4] == [10, 8]                    # 41_page-replacement_impl.py와 같음
    for how in ("LRU", "OPT"):                           # LRU·OPT는 늘 줄거나 같다
        assert all(a >= b for a, b in zip(res[how], res[how][1:])), how
    assert all(r[-1] == 5 for r in res.values())         # 서로 다른 페이지 5개
    print("ALL CHECKS PASSED")
```
{% endraw %}
