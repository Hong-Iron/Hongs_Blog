---
layout: "note"
title: "51_equal-loudness-contours_plot.py"
display_title: "51_equal-loudness-contours_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "51"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/equal-loudness-contours/"
parent_title: "등청감 곡선"
description: "휴먼 인터페이스 미디어 · 등청감 곡선 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/51_equal-loudness-contours_plot/"
---
{% raw %}
[등청감 곡선](/Hongs_Blog/studies/human-interface-media/equal-loudness-contours/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 등청감 곡선 문서의 그림을 만든다: 51_equal-loudness-contours_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 51_equal-loudness-contours_plot.py  (matplotlib, numpy 필요)
# 조용할 때의 문턱은 Terhardt 근사식이다. 51~55 문서의 그림은 모두 같은 식을 쓴다.
# 등청감 곡선은 ISO 226 측정값이 아니라 모양만 보이는 모식도다:
#   P phon 곡선 = P + w(P) * (Tq(f) - Tq(1 kHz)),  w(P) = 1 / (1 + P/80)
#   (1 kHz에서 P dB, 작은 phon에서는 문턱 모양, 큰 phon일수록 평평해진다)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "51_equal-loudness-contours"
INK = "#888888"
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


# ---- 51~55 공통 식 ----
def tq(f):
    """조용할 때 들리기 시작하는 문턱 (Terhardt 1979 근사, dB SPL). f는 Hz."""
    k = np.asarray(f, dtype=float) / 1000.0
    return 3.64 * k ** -0.8 - 6.5 * np.exp(-0.6 * (k - 3.3) ** 2) + 1e-3 * k ** 4


def contour(P, f):
    """P phon 등청감 곡선의 모식도 (측정값 아님)."""
    w = 1.0 / (1.0 + P / 80.0)
    return P + w * (tq(f) - tq(1000.0))


f = np.logspace(np.log10(20), np.log10(16000), 600)
fig, ax = plt.subplots(figsize=(7, 4.2))
ax.plot(f, tq(f), color=C[0], lw=2.2)
ax.text(32, -10, "조용할 때의 문턱 (Terhardt 근사식)", color=C[0], fontsize=10)
for i, P in enumerate([20, 40, 60, 80, 100]):
    ax.plot(f, contour(P, f), color=C[1], lw=1.4, ls="--")
    ax.text(16500, contour(P, 16000.0), f"{P} phon", color=C[1], fontsize=9.5, va="center")
ax.text(150, 128, "점선: 등청감 곡선 (모양만 그린 모식도)", color=C[1], fontsize=9.5)
ax.axvline(1000, color=INK, lw=0.8, ls=":")
ax.text(1050, -12, "1 kHz: 곡선 높이 = phon 값", fontsize=9.5)
ax.axvspan(3000, 4000, color=C[2], alpha=0.12)
ax.text(3450, 136, "3~4 kHz\n가장 예민", color=C[2], fontsize=9.5, ha="center", va="top")
ax.set_xscale("log")
ax.set_xlim(20, 16000)
ax.set_ylim(-15, 140)
ax.set_xticks([20, 50, 100, 200, 500, 1000, 2000, 5000, 10000])
ax.set_xticklabels(["20", "50", "100", "200", "500", "1k", "2k", "5k", "10k"])
ax.set_xlabel("주파수 (Hz, 로그 눈금)")
ax.set_ylabel("음압 레벨 (dB SPL)")
save(fig, 1)

if __name__ == "__main__":
    # 1 kHz에서 각 곡선의 높이는 phon 값과 같다
    for P in (20, 40, 60, 80, 100):
        assert abs(contour(P, 1000.0) - P) < 1e-9
    # 문턱의 가장 낮은 곳은 3~4 kHz (약 3.3 kHz, 약 -5 dB)
    fmin = f[np.argmin(tq(f))]
    assert 3000 < fmin < 4000 and abs(tq(fmin) + 4.98) < 0.05, (fmin, tq(fmin))
    # 문턱 값: 100 Hz 약 23 dB, 1 kHz 약 3.4 dB, 15 kHz 약 51 dB
    assert abs(tq(100.0) - 22.95) < 0.01 and abs(tq(1000.0) - 3.37) < 0.01 and abs(tq(15000.0) - 51.04) < 0.01
    # 큰 phon일수록 곡선이 평평하다: 100 Hz와 1 kHz의 차이가 20 phon > 100 phon
    d20 = contour(20, 100.0) - 20
    d100 = contour(100, 100.0) - 100
    assert d20 > d100 > 0, (d20, d100)
    # 모식도의 모든 곡선은 문턱보다 위에 있다 (문턱 아래 소리는 크기가 없다)
    for P in (20, 40, 60, 80, 100):
        assert np.all(contour(P, f) > tq(f)), P
    print("ALL CHECKS PASSED")
```
{% endraw %}
