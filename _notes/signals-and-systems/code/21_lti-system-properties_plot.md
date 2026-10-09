---
layout: "note"
title: "21_lti-system-properties_plot.py"
display_title: "21_lti-system-properties_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "21"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/lti-system-properties/"
parent_title: "임펄스 응답으로 본 LTI 시스템의 성질"
description: "신호 및 시스템 · 임펄스 응답으로 본 LTI 시스템의 성질 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/21_lti-system-properties_plot/"
---
{% raw %}
[임펄스 응답으로 본 LTI 시스템의 성질](/Hongs_Blog/studies/signals-and-systems/lti-system-properties/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 임펄스 응답으로 본 LTI 시스템의 성질 문서의 그림을 만든다: 21_lti-system-properties_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 21_lti-system-properties_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "21_lti-system-properties"
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


def stem(ax, n, x, color, label=None, ms=5):
    # 이산 시간 신호는 막대 끝에 점을 찍은 줄기 그림으로 그린다
    ml, sl, bl = ax.stem(n, x, linefmt="-", markerfmt="o", basefmt=" ", label=label)
    plt.setp(sl, color=color, lw=1.4)
    plt.setp(ml, color=color, markersize=ms)
    ax.axhline(0, color=INK, lw=0.6)


# 그림 1: 둘 다 값이 1 이하인 임펄스 응답. 계단을 넣으면 u[n]은 끝없이 커지고 (1/2)^n u[n]은 2에 머문다
n = np.arange(-2, 16)
hA = (n >= 0).astype(float)
hB = np.where(n >= 0, 0.5 ** np.maximum(n, 0), 0.0)
fig, axs = plt.subplots(2, 2, figsize=(6.6, 3.8), sharex=True)
stem(axs[0, 0], n, hA, C[1], ms=4)
axs[0, 0].set_title(r"$h[n] = u[n]$  ($\sum|h| = \infty$)", fontsize=10)
stem(axs[0, 1], n, hB, C[0], ms=4)
axs[0, 1].set_title(r"$h[n] = (\frac{1}{2})^n u[n]$  ($\sum|h| = 2$)", fontsize=10)
stem(axs[1, 0], n, np.cumsum(hA), C[1], ms=4)
axs[1, 0].set_title("계단 입력의 출력", fontsize=10)
stem(axs[1, 1], n, np.cumsum(hB), C[0], ms=4)
axs[1, 1].axhline(2, color=INK, lw=0.6, ls=":")
axs[1, 1].set_title("계단 입력의 출력", fontsize=10)
for ax in axs[0]:
    ax.set_ylim(-0.1, 1.3)
for ax in axs[1]:
    ax.set_ylim(-0.3, 17)
    ax.set_xlabel("$n$")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # u * u = n + 1 (발산), (1/2)^n u * u = 2 - (1/2)^n < 2 = Σ|h| · 1
    assert np.allclose(np.cumsum(hA)[n >= 0], n[n >= 0] + 1)
    sB = np.cumsum(hB)
    assert np.allclose(sB[n >= 0], 2 - 0.5 ** n[n >= 0]) and sB.max() < 2
    print("ALL CHECKS PASSED")
```
{% endraw %}
