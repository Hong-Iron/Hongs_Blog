---
layout: "note"
title: "22_generating-functions_plot.py"
display_title: "22_generating-functions_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "22"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/generating-functions/"
parent_title: "생성함수"
description: "이산수학 · 생성함수 코드 코드"
permalink: "/studies/discrete-math/code/22_generating-functions_plot/"
---
{% raw %}
[생성함수](/Hongs_Blog/studies/discrete-math/generating-functions/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 생성함수 문서의 그림을 만든다: 22_generating-functions_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 22_generating-functions_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "22_generating-functions"
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


def dice_poly(m):
    # (x + x^2 + ... + x^6)^m 의 계수. 인덱스가 지수
    die = np.array([0, 1, 1, 1, 1, 1, 1])
    poly = np.array([1])
    for _ in range(m):
        poly = np.convolve(poly, die)
    return poly


# 그림 1: 주사위 m개의 눈의 합이 나오는 방법의 수를 6^m으로 나눈 값. 곱할수록 가운데가 불룩한 종 모양이 된다
fig, ax = plt.subplots(figsize=(6, 3.6))
for i, m in enumerate([1, 2, 3, 4]):
    poly = dice_poly(m)
    s = np.arange(len(poly))[m:]
    ax.plot(s, poly[m:] / 6 ** m, "o-", color=C[i], ms=3.5, lw=1.4, label=f"주사위 {m}개")
ax.set_xlabel("눈의 합")
ax.set_ylabel("확률 (계수 / $6^m$)")
ax.set_xticks(range(0, 25, 4))
ax.legend(loc="upper right")
save(fig, 1)

if __name__ == "__main__":
    # 두 개: x^7 계수 6, 계수 목록 1..6..1, 세 개: x^10과 x^11 계수 27, 계수 합 6^m
    p2 = dice_poly(2)
    assert list(p2[2:]) == [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]
    p3 = dice_poly(3)
    assert p3[10] == 27 and p3[11] == 27
    for m in [1, 2, 3, 4]:
        assert dice_poly(m).sum() == 6 ** m
    print("ALL CHECKS PASSED")
```
{% endraw %}
