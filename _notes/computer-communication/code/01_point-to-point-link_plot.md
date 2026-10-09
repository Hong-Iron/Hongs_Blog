---
layout: "note"
title: "01_point-to-point-link_plot.py"
display_title: "01_point-to-point-link_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "01"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/point-to-point-link/"
parent_title: "점대점 링크"
description: "컴퓨터 통신 · 점대점 링크 코드 코드"
permalink: "/studies/computer-communication/code/01_point-to-point-link_plot/"
---
{% raw %}
[점대점 링크](/Hongs_Blog/studies/computer-communication/point-to-point-link/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 점대점 링크 문서의 그림을 만든다: 01_point-to-point-link_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 01_point-to-point-link_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "01_point-to-point-link"
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


def mesh_links(n):
    return n * (n - 1) // 2


# 그림 1: 완전 연결의 링크 수 n(n-1)/2와 그 위아래 경계 n²/4, n²/2, 그리고 노드 수 n
n = np.arange(2, 31)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.fill_between(n, n ** 2 / 4, n ** 2 / 2, color=C[0], alpha=0.12, lw=0)
ax.plot(n, [mesh_links(k) for k in n], "o-", color=C[0], ms=3, lw=1.6)
ax.plot(n, n, color=C[1], lw=1.6)
ax.text(30.5, mesh_links(30), "완전 연결 $n(n-1)/2$", color=C[0], va="center", fontsize=10)
ax.text(30.5, 30, "노드 수 $n$", color=C[1], va="center", fontsize=10)
ax.annotate("$n^2/2$", xy=(22, 22 ** 2 / 2), xytext=(13, 330), fontsize=9,
            arrowprops=dict(arrowstyle="-", color=INK, lw=0.6))
ax.annotate("$n^2/4$", xy=(26, 26 ** 2 / 4), xytext=(26, 80), fontsize=9, ha="center",
            arrowprops=dict(arrowstyle="-", color=INK, lw=0.6))
for k in (10, 20, 30):
    ax.annotate(f"{mesh_links(k)}", (k, mesh_links(k)), textcoords="offset points", xytext=(-4, 7),
                ha="right", fontsize=9, color=C[0])
ax.set_xlabel("노드 수 $n$")
ax.set_ylabel("링크 수")
ax.set_xlim(0, 30)
ax.set_ylim(0, 470)
save(fig, 1)

if __name__ == "__main__":
    # 그림에 쓴 값: n = 10, 20, 30에서 45, 190, 435. 모든 n에서 n²/4 ≤ m ≤ n²/2. 노드 수 10배면 링크 약 100배
    assert [mesh_links(k) for k in (10, 20, 30, 100)] == [45, 190, 435, 4950]
    assert all(k * k / 4 <= mesh_links(k) <= k * k / 2 for k in range(2, 31))
    assert abs(mesh_links(100) / mesh_links(10) - 110) < 1e-9
    print("ALL CHECKS PASSED")
```
{% endraw %}
