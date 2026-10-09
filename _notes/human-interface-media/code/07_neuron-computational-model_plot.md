---
layout: "note"
title: "07_neuron-computational-model_plot.py"
display_title: "07_neuron-computational-model_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "07"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/neuron-computational-model/"
parent_title: "뉴런의 연산 모형"
description: "휴먼 인터페이스 미디어 · 뉴런의 연산 모형 코드 코드"
permalink: "/studies/human-interface-media/code/07_neuron-computational-model_plot/"
---
{% raw %}
[뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 뉴런의 연산 모형 문서의 그림을 만든다: 07_neuron-computational-model_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 07_neuron-computational-model_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "07_neuron-computational-model"
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

R_MAX = 1.0


def step(o):
    return np.where(o > 0, 1.0, 0.0)


def clip(o):
    return np.minimum(np.maximum(o, 0), R_MAX)


def relu(o):
    return np.maximum(0, o)


def sigmoid(o):
    return 1 / (1 + np.exp(-o))


# 그림 1: 활성 함수 네 가지의 모양. 모두 0 아래를 막거나 위를 누른다
o = np.linspace(-3, 3, 601)
funcs = [("계단 함수", step), ("자르기 ($r_{max}=1$)", clip), ("ReLU", relu), ("시그모이드", sigmoid)]
fig, axes = plt.subplots(1, 4, figsize=(6.5, 2.1), sharey=True)
for i, (ax, (name, f)) in enumerate(zip(axes, funcs)):
    y = f(o)
    if f is step:
        ax.plot(o[o <= 0], y[o <= 0], color=C[i], lw=2)
        ax.plot(o[o > 0], y[o > 0], color=C[i], lw=2)
    else:
        ax.plot(o, y, color=C[i], lw=2)
    ax.axhline(0, color=INK, lw=0.5)
    ax.axvline(0, color=INK, lw=0.5, ls=":")
    ax.set_title(name, fontsize=10)
    ax.set_xlabel("$o$")
    ax.set_ylim(-0.2, 2.2)
    ax.set_xticks([-2, 0, 2])
    ax.set_yticks([0, 1, 2])
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 출력 범위 확인: 계단 {0,1}, 자르기 [0,1], ReLU [0,∞), 시그모이드 (0,1), sigmoid(0) = 0.5
    assert set(step(o).tolist()) == {0.0, 1.0}
    assert clip(o).min() == 0 and clip(o).max() == R_MAX
    assert relu(o).min() == 0 and relu(np.array([3.0]))[0] == 3
    assert 0 < sigmoid(o).min() and sigmoid(o).max() < 1 and sigmoid(np.array([0.0]))[0] == 0.5
    print("ALL CHECKS PASSED")
```
{% endraw %}
