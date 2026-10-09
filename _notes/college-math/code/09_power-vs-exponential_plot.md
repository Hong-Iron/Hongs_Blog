---
layout: "note"
title: "09_power-vs-exponential_plot.py"
display_title: "09_power-vs-exponential_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "09"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/power-vs-exponential/"
parent_title: "거듭제곱함수와 지수함수 비교"
description: "대학수학 · 거듭제곱함수와 지수함수 비교 그림 생성 코드"
permalink: "/studies/college-math/code/09_power-vs-exponential_plot/"
---
{% raw %}
[거듭제곱함수와 지수함수 비교](/Hongs_Blog/studies/college-math/power-vs-exponential/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 거듭제곱함수와 지수함수 비교 문서의 그림을 만든다: 09_power-vs-exponential_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 09_power-vs-exponential_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "09_power-vs-exponential"
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

# 그림 1: x³과 2^x를 로그-로그 눈금(왼쪽)과 반로그 눈금(오른쪽)에
x = np.linspace(1, 40, 400)
fig, axs = plt.subplots(1, 2, figsize=(6.5, 3))
for ax in axs:
    ax.plot(x, x ** 3, color=C[0], lw=2, label="$x^3$")
    ax.plot(x, 2.0 ** x, color=C[1], lw=2, label="$2^x$")
    ax.set_yscale("log")
    ax.set_xlabel("$x$")
axs[0].set_xscale("log")
axs[0].set_title("로그-로그: $x^3$이 직선", fontsize=11)
axs[1].set_title("반로그: $2^x$이 직선", fontsize=11)
axs[0].legend(loc="upper left", fontsize=10)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 로그-로그에서 x³의 기울기 3, 반로그에서 2^x의 기울기 log10(2) = 0.30103
    lx, ly = np.log10(x), np.log10(x ** 3)
    assert np.allclose(np.diff(ly) / np.diff(lx), 3)
    assert np.allclose(np.diff(np.log10(2.0 ** x)) / np.diff(x), math.log10(2))
    assert round(math.log10(2), 5) == 0.30103
    print("ALL CHECKS PASSED")
```
{% endraw %}
