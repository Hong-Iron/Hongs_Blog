---
layout: "note"
title: "08_perceptron_plot.py"
display_title: "08_perceptron_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "08"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/perceptron/"
parent_title: "퍼셉트론"
description: "휴먼 인터페이스 미디어 · 퍼셉트론 그림 생성 코드"
permalink: "/studies/human-interface-media/code/08_perceptron_plot/"
---
{% raw %}
[퍼셉트론](/Hongs_Blog/studies/human-interface-media/perceptron/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 퍼셉트론 문서의 그림을 만든다: 08_perceptron_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 08_perceptron_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "08_perceptron"
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



def predict(w, b, x):
    return 1 if w[0] * x[0] + w[1] * x[1] + b > 0 else 0


def two_layer(x):
    h1 = predict((1, 1), -0.5, x)    # OR
    h2 = predict((-1, -1), 1.5, x)   # NAND
    return predict((1, 1), -1.5, (h1, h2))  # AND


XOR = [((0, 0), 0), ((0, 1), 1), ((1, 0), 1), ((1, 1), 0)]

# 그림 1: 첫 층의 두 직선(OR, NAND)이 가운데 띠를 잘라 내고, 둘째 층의 AND가 띠 안만 1로 만든다
x = np.linspace(-0.4, 1.4, 10)
fig, ax = plt.subplots(figsize=(4.6, 3.8))
ax.fill_between(x, 0.5 - x, 1.5 - x, color=C[2], alpha=0.15)
ax.plot(x, 0.5 - x, color=C[0], lw=1.6)
ax.plot(x, 1.5 - x, color=C[1], lw=1.6)
ax.text(-0.35, -0.35, "$h_1$(OR) 경계\n$x_1 + x_2 = 0.5$", color=C[0], fontsize=9, va="bottom")
ax.text(1.38, 1.38, "$h_2$(NAND) 경계\n$x_1 + x_2 = 1.5$", color=C[1], fontsize=9, ha="right", va="top")
ax.text(0.5, 0.5, "출력 1", color=C[2], fontsize=10, ha="center", va="center")
ax.text(1.45, 0.5, "● XOR = 1\n○ XOR = 0", fontsize=9, va="center")
for (x1, x2), t in XOR:
    ax.plot(x1, x2, "o", ms=11, color=INK, mfc=INK if t else "none", mew=1.6)
ax.set_xlim(-0.4, 1.4)
ax.set_ylim(-0.4, 1.4)
ax.set_aspect("equal")
ax.set_xticks([0, 1])
ax.set_yticks([0, 1])
ax.set_xlabel("$x_1$")
ax.set_ylabel("$x_2$")
save(fig, 1)

if __name__ == "__main__":
    # 두 층 XOR이 네 점을 모두 맞히고, 1인 점이 정확히 두 직선 사이 띠 안에 있다
    for xx, t in XOR:
        assert two_layer(xx) == t
        assert (0.5 < xx[0] + xx[1] < 1.5) == bool(t)
    print("ALL CHECKS PASSED")
```
{% endraw %}
