---
layout: "note"
title: "26_resolution-spatial-frequency_plot.py"
display_title: "26_resolution-spatial-frequency_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "26"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/resolution-spatial-frequency/"
parent_title: "해상도와 공간 주파수"
description: "휴먼 인터페이스 미디어 · 해상도와 공간 주파수 그림 생성 코드"
permalink: "/studies/human-interface-media/code/26_resolution-spatial-frequency_plot/"
---
{% raw %}
[해상도와 공간 주파수](/Hongs_Blog/studies/human-interface-media/resolution-spatial-frequency/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 해상도와 공간 주파수 문서의 그림을 만든다: 26_resolution-spatial-frequency_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 26_resolution-spatial-frequency_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "26_resolution-spatial-frequency"
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


# 그림 1: 데이터 25%만 남기는 두 방법(앞쪽 표본 25% / 낮은 주파수 25%)
n = 64
t = np.arange(n)
sig = np.exp(-((t - 32) / 12) ** 2) + 0.3 * np.cos(2 * np.pi * 2 * t / n)
keep = n // 4
crop = np.where(t < keep, sig, np.nan)
X = np.fft.fft(sig)
mask = np.zeros(n, bool)
mask[: keep // 2 + 1] = True
mask[n - keep // 2 + 1:] = True
rec = np.fft.ifft(np.where(mask, X, 0)).real
fig, ax = plt.subplots(figsize=(6.5, 3.0))
ax.plot(t, sig, color=INK, lw=3, label="원래 신호")
ax.plot(t, rec, color=C[0], lw=1.5, label="낮은 주파수 25%")
ax.plot(t, crop, color=C[1], lw=1.5, marker="o", ms=3, label="앞쪽 표본 25%")
ax.axvspan(keep - 0.5, n - 0.5, color=C[1], alpha=0.06)
ax.text(40, -0.32, "앞쪽 25%만 남기면 이 구간은 모른다", fontsize=9, ha="center", color=C[1])
ax.set_xlabel("표본 번호")
ax.set_ylim(-0.45, 1.45)
ax.legend(loc="upper right", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    assert mask.sum() == keep
    assert np.sqrt(np.mean((sig - rec) ** 2)) < 0.01
    print("ALL CHECKS PASSED")
```
{% endraw %}
