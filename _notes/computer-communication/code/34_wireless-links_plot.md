---
layout: "note"
title: "34_wireless-links_plot.py"
display_title: "34_wireless-links_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "34"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/wireless-links/"
parent_title: "무선 링크"
description: "컴퓨터 통신 · 무선 링크 그림 생성 코드"
permalink: "/studies/computer-communication/code/34_wireless-links_plot/"
---
{% raw %}
[무선 링크](/Hongs_Blog/studies/computer-communication/wireless-links/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 무선 링크 문서의 그림을 만든다: 34_wireless-links_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 34_wireless-links_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "34_wireless-links"
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

EXTRA = 300.0          # 반사파가 더 도는 거리 (m)
V = 3.0e8              # 공기 중 신호 속도 (m/s)
DELAY = EXTRA / V      # 반사파가 늦는 시간 = 1 μs
ECHO = 0.6             # 반사파의 세기 (곧장 온 신호의 60%로 가정)
BITS = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1]


def nrz(bits, t, width):
    """t 시각의 신호 높이 (+1 / -1). 첫 비트가 오기 전과 다 지난 뒤는 0"""
    idx = np.floor(t / width).astype(int)
    out = np.zeros_like(t)
    ok = (idx >= 0) & (idx < len(bits))
    out[ok] = np.where(np.array(bits)[idx[ok]] == 1, 1.0, -1.0)
    return out


def overlap_bits(rate):
    """반사파 지연이 비트 몇 개 폭인가"""
    return DELAY * rate


# 그림 1: 같은 1 μs 반사가 0.1 Mbps와 10 Mbps에서 받은 신호를 어떻게 바꾸는가 (가로축: 비트 칸)
fig, axes = plt.subplots(2, 1, figsize=(6.5, 4.2), sharex=True)
for ax, rate, title in [(axes[0], 1e5, "0.1 Mbps: 비트 폭 10 μs, 반사파 지연 = 0.1비트"),
                        (axes[1], 1e7, "10 Mbps: 비트 폭 0.1 μs, 반사파 지연 = 10비트")]:
    width = 1.0 / rate
    cells = np.linspace(0, 20, 4000)
    t = cells * width
    direct = nrz(BITS, t, width)
    received = direct + ECHO * nrz(BITS, t - DELAY, width)
    ax.plot(cells, direct, color=C[0], lw=1.0, label="곧장 온 신호")
    ax.plot(cells, received, color=C[1], lw=1.6, label="받은 신호 (곧장 + 반사)")
    ax.axhline(0, color=INK, lw=0.5, ls=":")
    ax.set_title(title, fontsize=10, loc="left", color=INK)
    ax.set_yticks([-1.6, 0, 1.6], ["", "0", ""])
    ax.set_ylim(-1.9, 1.9)
axes[0].legend(loc="upper right", fontsize=9, ncol=2, bbox_to_anchor=(1.0, 1.45))
axes[1].set_xlabel("시간 (비트 칸 단위)")
axes[1].set_xticks(range(0, 21, 2))
fig.subplots_adjust(hspace=0.45)
save(fig, 1)

if __name__ == "__main__":
    # 문서의 값: 반사파 1 μs 지연. 0.1, 1, 10 Mbps에서 비트 0.1개, 1개, 10개만큼 겹침
    assert abs(DELAY - 1e-6) < 1e-15
    assert [round(overlap_bits(r), 9) for r in (1e5, 1e6, 1e7)] == [0.1, 1.0, 10.0]
    # 0.1 Mbps에서는 받은 신호의 부호가 비트 칸 가운데에서 늘 보낸 비트와 같다
    w = 1e-5
    mid = (np.arange(20) + 0.5) * w
    rx = nrz(BITS, mid, w) + ECHO * nrz(BITS, mid - DELAY, w)
    assert np.all(np.sign(rx) == np.where(np.array(BITS[:20]) == 1, 1, -1))
    print("ALL CHECKS PASSED")
```
{% endraw %}
