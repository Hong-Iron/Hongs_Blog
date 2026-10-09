---
layout: "note"
title: "12_image-function_plot.py"
display_title: "12_image-function_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "12"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/image-function/"
parent_title: "이미지 함수"
description: "휴먼 인터페이스 미디어 · 이미지 함수 그림 생성 코드"
permalink: "/studies/human-interface-media/code/12_image-function_plot/"
---
{% raw %}
[이미지 함수](/Hongs_Blog/studies/human-interface-media/image-function/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이미지 함수 문서의 그림을 만든다: 12_image-function_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 12_image-function_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "12_image-function"
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

M, A, U = 128.0, 100.0, 500.0   # 평균 밝기, 진폭, 공간 주파수 500 cycle/m
STEP_MM = 0.25                  # 표본 간격 0.25 mm (한 주기 2 mm에 8개)
LEVELS = 8                      # 양자화: 0~255를 8단계(간격 32)로


def stripe(x_mm):
    return M + A * np.sin(2 * np.pi * U * x_mm / 1000)


def quantize(v):
    step = 256 / LEVELS
    return np.floor(v / step) * step + step / 2


x = np.linspace(0, 10, 2001)              # 1 cm
xs = np.arange(0, 10 + 1e-9, STEP_MM)
fig, axes = plt.subplots(2, 1, figsize=(6.5, 3.8), sharex=True)
ax = axes[0]
ax.plot(x, stripe(x), color=INK, lw=1.2)
ax.plot(xs, stripe(xs), "o", color=C[0], ms=3.5)
ax.vlines(xs, 0, stripe(xs), color=C[0], lw=0.6, alpha=0.5)
ax.set_title("표본화: 0.25 mm마다 잰다", fontsize=10, loc="left")
ax = axes[1]
ax.plot(x, stripe(x), color=INK, lw=1.0, alpha=0.6)
ax.step(xs, quantize(stripe(xs)), where="mid", color=C[1], lw=1.6)
for lv in np.arange(0, 257, 256 / LEVELS):
    ax.axhline(lv, color=INK, lw=0.3, alpha=0.5)
ax.set_title("양자화: 값을 8단계 중 하나로 반올림한다", fontsize=10, loc="left")
ax.set_xlabel("위치 $x$ (mm)")
for ax in axes:
    ax.set_ylim(0, 256)
    ax.set_yticks([0, 128, 256])
    ax.set_ylabel("밝기")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 500 cycle/m 줄무늬는 한 주기가 2 mm라 1 cm에 5주기
    assert abs(1000 / U - 2.0) < 1e-12 and abs(10 / (1000 / U) - 5) < 1e-12
    assert np.allclose(stripe(x[x <= 8] + 2.0), stripe(x[x <= 8]))
    q = quantize(stripe(xs))
    assert len(set(q.tolist())) <= LEVELS and np.all(np.abs(q - stripe(xs)) <= 16 + 1e-9)
    print("ALL CHECKS PASSED")
```
{% endraw %}
