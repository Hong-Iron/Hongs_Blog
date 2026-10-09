---
layout: "note"
title: "37_edge-detection-smoothing_plot.py"
display_title: "37_edge-detection-smoothing_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "37"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/edge-detection-smoothing/"
parent_title: "영상의 경계 검출과 평활화"
description: "신호 및 시스템 · 영상의 경계 검출과 평활화 코드 코드"
permalink: "/studies/signals-and-systems/code/37_edge-detection-smoothing_plot/"
---
{% raw %}
[영상의 경계 검출과 평활화](/Hongs_Blog/studies/signals-and-systems/edge-detection-smoothing/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 영상의 경계 검출과 평활화 문서의 그림을 만든다: 37_edge-detection-smoothing_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 37_edge-detection-smoothing_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "37_edge-detection-smoothing"
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


rng = np.random.default_rng(7)
N, edge, sigma = 2000, 1000, 50
sig = (np.arange(N) >= edge).astype(float) + rng.normal(0, 0.3, N)
kk = np.arange(-200, 201)
g = np.exp(-kk ** 2 / (2 * sigma ** 2)); g /= g.sum()
raw = np.diff(sig)                                      # 그대로 차분
dg = np.convolve(g, [1, -1])                            # 가우시안을 먼저 미분한 커널
sigp = np.pad(sig, 200, mode="edge")                    # 양 끝은 끝값을 이어 붙여 가장자리 왜곡을 막는다
once = np.convolve(sigp, dg)[400:400 + N]               # f * dg/dx, 한 번만 컨벌루션
smooth_then_diff = np.diff(np.convolve(sig, g)[200:200 + N])

# 그림 1: 잡음(표준편차 0.3) 섞인 계단. 그대로 미분하면 경계가 묻히고, 가우시안 미분 커널을 쓰면 봉우리 하나가 선다
fig, axs = plt.subplots(3, 1, figsize=(6, 4.8), sharex=True)
axs[0].plot(sig, color=C[0], lw=0.6)
axs[0].set_title("잡음 섞인 계단 $f$", fontsize=10)
axs[1].plot(np.arange(1, N), raw, color=C[1], lw=0.6)
axs[1].set_title("그대로 차분 $f[x] - f[x-1]$", fontsize=10)
axs[2].plot(np.arange(N), once, color=C[2], lw=1.6)
axs[2].set_title(r"가우시안 미분 커널과 컨벌루션 $f * \frac{dg}{dx}$ ($\sigma = 50$)", fontsize=10)
for ax in axs:
    ax.axvline(edge, color=INK, lw=0.6, ls=":")
axs[2].set_xlabel("화소 위치")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 봉우리가 경계 ±15 안, 그대로 차분하면 잡음 봉우리가 경계의 값보다 큼, 두 방법이 같은 결과
    peak = int(np.argmax(once[250:N - 250])) + 250
    assert abs(peak - edge) <= 15
    assert np.max(np.abs(np.delete(raw, edge - 1))) > abs(raw[edge - 1])
    assert np.allclose(np.convolve(np.convolve(sig, g), [1, -1]), np.convolve(sig, dg), atol=1e-9)
    print("ALL CHECKS PASSED")
```
{% endraw %}
