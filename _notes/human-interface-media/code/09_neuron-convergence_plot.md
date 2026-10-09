---
layout: "note"
title: "09_neuron-convergence_plot.py"
display_title: "09_neuron-convergence_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "09"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/neuron-convergence/"
parent_title: "뉴런의 수렴"
description: "휴먼 인터페이스 미디어 · 뉴런의 수렴 그림 생성 코드"
permalink: "/studies/human-interface-media/code/09_neuron-convergence_plot/"
---
{% raw %}
[뉴런의 수렴](/Hongs_Blog/studies/human-interface-media/neuron-convergence/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 뉴런의 수렴 문서의 그림을 만든다: 09_neuron-convergence_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 09_neuron-convergence_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "09_neuron-convergence"
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

N = 7
TRIALS = 20_000
rng = np.random.default_rng(1)
single = 1 + rng.normal(0, 1, TRIALS)                      # 신호 1 + 수용기 하나의 잡음
pooled = 1 + rng.normal(0, 1, (TRIALS, N)).mean(axis=1)    # 신호 1 + 7개 잡음의 평균

# 그림 1: 같은 신호에 독립 잡음이 섞일 때, 7개를 평균하면 값이 신호 근처로 좁게 모인다
bins = np.linspace(-3, 5, 81)
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.hist(single, bins=bins, density=True, color=C[1], alpha=0.45, label="수용기 하나")
ax.hist(pooled, bins=bins, density=True, color=C[0], alpha=0.6, label=f"수용기 {N}개 평균")
ax.axvline(1, color=INK, lw=1, ls="--")
ax.text(-2.9, 0.9, "점선: 참 신호 1", fontsize=10)
ax.set_xlabel("뉴런이 받는 값 (신호 + 잡음)")
ax.set_ylabel("빈도 (밀도)")
ax.set_yticks([])
ax.legend(loc="upper right")
save(fig, 1)

if __name__ == "__main__":
    # 잡음 감소 비율이 sqrt(7) = 2.65에 가깝다 (문서: 2.61배, 이론값 2.65)
    ratio = single.std() / pooled.std()
    assert abs(ratio - math.sqrt(N)) < 0.1, ratio
    assert abs(single.mean() - 1) < 0.05 and abs(pooled.mean() - 1) < 0.05
    print(f"noise ratio {ratio:.2f}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
