---
layout: "note"
title: "65_mpeg-audio_plot.py"
display_title: "65_mpeg-audio_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "65"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/mpeg-audio/"
parent_title: "MPEG 오디오 부호화"
description: "휴먼 인터페이스 미디어 · MPEG 오디오 부호화 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/65_mpeg-audio_plot/"
---
{% raw %}
[MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# MPEG 오디오 부호화 문서의 그림을 만든다: 65_mpeg-audio_fig1.svg, fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 65_mpeg-audio_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.patches import Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "65_mpeg-audio"
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
    "axes.spines.top": False, "axes.spines.right": False, "axes.spines.left": False,
})


def save(fig, k):
    fig.savefig(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"), bbox_inches="tight", metadata={"Date": None})
    plt.close(fig)


FS = 44_100
W = FS / 2 / 32                                       # 부분 대역 폭 689.0625 Hz
CB = [0, 100, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320,
      2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 22050]


def draw_bands(ax, xmax):
    """위 줄: 같은 폭 부분 대역 32개. 아래 줄: 임계 대역 25개."""
    for i in range(32):
        lo = i * W
        if lo >= xmax:
            break
        ax.add_patch(Rectangle((lo, 1.1), W, 0.8, facecolor=C[0] if i % 2 == 0 else "none",
                               edgecolor=C[0], alpha=0.55 if i % 2 == 0 else 1, lw=0.8))
    for i in range(25):
        lo, hi = CB[i], CB[i + 1]
        if lo >= xmax:
            break
        ax.add_patch(Rectangle((lo, 0.0), hi - lo, 0.8, facecolor=C[1] if i % 2 == 0 else "none",
                               edgecolor=C[1], alpha=0.55 if i % 2 == 0 else 1, lw=0.8))
    ax.set_xlim(0, xmax)
    ax.set_ylim(-0.1, 2.0)
    ax.set_yticks([0.4, 1.5])
    ax.set_yticklabels(["임계 대역\n25개", "부분 대역\n32개"])
    ax.tick_params(axis="y", length=0)


# 그림 1: 같은 폭 부분 대역 32개와 폭이 다른 임계 대역 25개 (위: 전체, 아래: 0 ~ 3 kHz 확대)
fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.4, 3.9), gridspec_kw={"hspace": 0.75})
draw_bands(a1, 22_050)
a1.set_xticks([0, 5000, 10000, 15000, 20000])
a1.set_xticklabels(["0", "5", "10", "15", "20"])
a1.set_xlabel("주파수 (kHz), 표본화율 44.1 kHz")
a1.set_title("전체 0 ~ 22.05 kHz", fontsize=10.5)
draw_bands(a2, 3000)
a2.set_xticks([0, 689, 1378, 2067, 2756])
a2.set_xticklabels(["0", "689", "1378", "2067", "2756"])
a2.set_xlabel("주파수 (Hz)")
a2.set_title("0 ~ 3 kHz 확대: 첫 부분 대역 하나에 임계 대역이 6개 넘게 들어간다", fontsize=10.5)
save(fig, 1)

# 그림 2: 비트 배분 장난감 예. 부분 대역 8개의 신호 크기(막대)와 가림 문턱(선), 막대 위 숫자는 배분한 비트
signal = [60, 75, 82, 70, 45, 30, 51, 20]
mask = [35, 55, 60, 62, 50, 35, 38, 28]
bits = [math.ceil((s - m) / 6.0206) if s > m else 0 for s, m in zip(signal, mask)]
fig, ax = plt.subplots(figsize=(7.0, 3.4))
plt.rcParams["axes.spines.left"] = True
ax.spines["left"].set_visible(True)
xs = np.arange(1, 9)
cols = [C[0] if b > 0 else "none" for b in bits]
ax.bar(xs, signal, width=0.6, color=cols, edgecolor=C[0], lw=1.2)
ax.step(np.concatenate([[0.5], xs + 0.5]), [mask[0]] + mask, where="pre", color=C[1], lw=1.8)
for x, s, m, b in zip(xs, signal, mask, bits):
    ax.text(x, max(s, m) + 2, f"{b}비트", ha="center", fontsize=9.5)
ax.text(7.0, 68, "주황 선: 가림 문턱", color=C[1], fontsize=9.5, ha="center")
ax.text(7.0, 80, "빈 막대: 문턱 아래라\n들리지 않음 → 0비트", fontsize=9.5, ha="center")
ax.set_xticks(xs)
ax.set_xlabel("부분 대역 번호")
ax.set_ylabel("크기 (dB)")
ax.set_ylim(0, 95)
ax.set_xlim(0.4, 8.6)
ax.grid(axis="y", color=INK, lw=0.3, alpha=0.5)
save(fig, 2)

if __name__ == "__main__":
    assert W == 689.0625
    assert [i + 1 for i in range(25) if CB[i + 1] <= W] == [1, 2, 3, 4, 5, 6]
    assert CB[6] < W < CB[7]
    assert bits == [5, 4, 4, 2, 0, 0, 3, 0] and sum(bits) == 18
    print("ALL CHECKS PASSED")
```
{% endraw %}
