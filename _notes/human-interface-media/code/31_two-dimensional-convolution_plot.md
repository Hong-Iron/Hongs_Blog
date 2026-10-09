---
layout: "note"
title: "31_two-dimensional-convolution_plot.py"
display_title: "31_two-dimensional-convolution_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "31"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/two-dimensional-convolution/"
parent_title: "2차원 합성곱"
description: "휴먼 인터페이스 미디어 · 2차원 합성곱 그림 생성 코드"
permalink: "/studies/human-interface-media/code/31_two-dimensional-convolution_plot/"
---
{% raw %}
[2차원 합성곱](/Hongs_Blog/studies/human-interface-media/two-dimensional-convolution/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 2차원 합성곱 문서의 그림을 만든다: 31_two-dimensional-convolution_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 31_two-dimensional-convolution_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "31_two-dimensional-convolution"
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


# 그림 1: 주기 4, 8, 16픽셀 줄무늬를 폭 1(원본), 3, 5, 9, 17 상자 평균으로 흐리기
seg = 48
x = np.arange(3 * seg)
period = np.where(x < seg, 4, np.where(x < 2 * seg, 8, 16))
stripes = np.cos(2 * np.pi * x / period)
widths = [1, 3, 5, 9, 17]
fig, axs = plt.subplots(len(widths), 1, figsize=(6.5, 5.0), sharex=True)
for ax, w in zip(axs, widths):
    k = np.ones(w) / w
    y = np.convolve(stripes, k, mode="same")
    ax.plot(x, y, color=C[0] if w > 1 else INK, lw=1.2)
    ax.set_ylim(-1.2, 1.2)
    ax.set_yticks([])
    ax.set_ylabel("원본" if w == 1 else f"폭 {w}", rotation=0, ha="right", va="center")
    for b in (seg, 2 * seg):
        ax.axvline(b - 0.5, color=INK, lw=0.5, ls=":")
axs[0].text(seg / 2, 1.35, "주기 4", ha="center", fontsize=9)
axs[0].text(1.5 * seg, 1.35, "주기 8", ha="center", fontsize=9)
axs[0].text(2.5 * seg, 1.35, "주기 16", ha="center", fontsize=9)
axs[-1].set_xlabel("픽셀")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    gain = lambda u, w: math.sin(math.pi * u * w) / (w * math.sin(math.pi * u))
    assert abs(gain(0.25, 3) - 1 / 3) < 1e-12 and abs(gain(0.25, 5) + 1 / 5) < 1e-12
    y5 = np.convolve(stripes, np.ones(5) / 5, mode="same")
    mid = slice(10, seg - 10)
    assert np.allclose(y5[mid], -0.2 * stripes[mid], atol=1e-9)
    print("ALL CHECKS PASSED")
```
{% endraw %}
