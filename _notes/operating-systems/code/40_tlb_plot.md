---
layout: "note"
title: "40_tlb_plot.py"
display_title: "40_tlb_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "40"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/tlb/"
parent_title: "TLB"
description: "운영체제 · TLB 코드 코드"
permalink: "/studies/operating-systems/code/40_tlb_plot/"
---
{% raw %}
[TLB](/Hongs_Blog/studies/operating-systems/tlb/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# TLB 문서의 그림을 만든다: 40_tlb_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 40_tlb_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "40_tlb"
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


def eat(hit, tlb=20, mem=100):
    return hit * (tlb + mem) + (1 - hit) * (tlb + 2 * mem)


h = np.linspace(0, 1, 201)

# 그림 1: TLB 적중률에 따른 평균 접근 시간 (TLB 20 ns, 메모리 100 ns)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(100 * h, eat(h), color=C[0], lw=2, label="TLB 있음")
ax.axhline(200, color=C[1], lw=1.4, ls="--", label="TLB 없음 (200 ns)")
ax.axhline(100, color=INK, lw=0.8, ls=":")
ax.text(1, 103, "데이터 한 번 읽는 시간 (100 ns)", fontsize=9, va="bottom")
ax.plot([98], [eat(0.98)], "o", color=C[0])
ax.annotate("98% → 122 ns", xy=(98, 122), xytext=(74, 104), fontsize=9, color=C[0],
            arrowprops=dict(arrowstyle="->", color=C[0]))
ax.plot([20], [200], "o", color=C[1])
ax.annotate("20%에서 같아짐", xy=(20, 200), xytext=(26, 210), fontsize=9, color=C[1],
            arrowprops=dict(arrowstyle="->", color=C[1]))
ax.set_xlabel("TLB 적중률 $h$ (%)")
ax.set_ylabel("평균 접근 시간 (ns)")
ax.set_xlim(0, 100)
ax.set_ylim(80, 230)
ax.legend(loc="upper right", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    assert abs(eat(0.98) - 122) < 1e-9          # 문서 예
    assert abs(eat(0.0) - 220) < 1e-9 and abs(eat(1.0) - 120) < 1e-9
    assert abs(eat(0.2) - 200) < 1e-9           # 적중률 20%에서 TLB 없을 때와 같다
    print("ALL CHECKS PASSED")
```
{% endraw %}
