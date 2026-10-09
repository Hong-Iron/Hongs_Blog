---
layout: "note"
title: "29_modular-inverse-crt_plot.py"
display_title: "29_modular-inverse-crt_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "29"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/modular-inverse-crt/"
parent_title: "모듈러 역원과 중국인의 나머지 정리"
description: "이산수학 · 모듈러 역원과 중국인의 나머지 정리 코드 코드"
permalink: "/studies/discrete-math/code/29_modular-inverse-crt_plot/"
---
{% raw %}
[모듈러 역원과 중국인의 나머지 정리](/Hongs_Blog/studies/discrete-math/modular-inverse-crt/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 모듈러 역원과 중국인의 나머지 정리 문서의 그림을 만든다: 29_modular-inverse-crt_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 29_modular-inverse-crt_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "29_modular-inverse-crt"
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


def draw_grid(ax, m1, m2):
    # 0부터 m1*m2 - 1까지의 x를 (x mod m1, x mod m2) 칸에 적는다. 한 칸에 둘 이상이면 줄을 나눠 적는다
    cells = {}
    for x in range(m1 * m2):
        cells.setdefault((x % m1, x % m2), []).append(x)
    for i in range(m1):
        for j in range(m2):
            xs = cells.get((i, j), [])
            face = "none" if not xs else (C[0] if len(xs) == 1 else C[1])
            ax.add_patch(plt.Rectangle((j, m1 - 1 - i), 1, 1, facecolor=face, alpha=0.18 if xs else 1,
                                       edgecolor=INK, lw=0.8))
            ax.text(j + 0.5, m1 - 0.5 - i, ", ".join(map(str, xs)), ha="center", va="center", fontsize=9)
    ax.set_xlim(0, m2)
    ax.set_ylim(0, m1)
    ax.set_aspect("equal")
    ax.set_xticks(np.arange(m2) + 0.5, [str(j) for j in range(m2)])
    ax.set_yticks(np.arange(m1) + 0.5, [str(i) for i in reversed(range(m1))])
    ax.set_xlabel(f"$x \\,\\mathrm{{mod}}\\, {m2}$")
    ax.set_ylabel(f"$x \\,\\mathrm{{mod}}\\, {m1}$")
    ax.tick_params(length=0)
    for s in ax.spines.values():
        s.set_visible(False)
    return cells


# 그림 1: (왼쪽) 서로소인 3과 5: 0~14가 15칸을 하나씩 채운다. (오른쪽) 공약수 2를 가진 4와 6: 0~23이 12칸에 두 개씩 몰리고 12칸은 빈다
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(6.5, 3), gridspec_kw={"width_ratios": [5, 6]})
cells35 = draw_grid(ax1, 3, 5)
ax1.set_title("법 3, 5 (서로소)", fontsize=11, color=INK)
cells46 = draw_grid(ax2, 4, 6)
ax2.set_title("법 4, 6 (공약수 2)", fontsize=11, color=INK)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 3, 5: 15칸 모두 한 번씩. 4, 6: 24칸 중 12칸만, 각 2개. x ≡ 2 (mod 3), x ≡ 3 (mod 5)는 8 하나
    assert len(cells35) == 15 and all(len(v) == 1 for v in cells35.values())
    assert len(cells46) == 12 and all(len(v) == 2 for v in cells46.values())
    assert cells35[(2, 3)] == [8]
    assert (1, 0) not in cells46          # x ≡ 1 (mod 4), x ≡ 0 (mod 6)은 해가 없다
    print("ALL CHECKS PASSED")
```
{% endraw %}
