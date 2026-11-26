---
layout: "note"
title: "52_frequency-masking_plot.py"
display_title: "52_frequency-masking_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "52"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/frequency-masking/"
parent_title: "주파수 가림"
description: "휴먼 인터페이스 미디어 · 주파수 가림 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/52_frequency-masking_plot/"
---
{% raw %}
[주파수 가림](/Hongs_Blog/studies/human-interface-media/frequency-masking/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 주파수 가림 문서의 그림을 만든다: 52_frequency-masking_fig1.svg, 52_frequency-masking_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 52_frequency-masking_plot.py  (matplotlib, numpy 필요)
# 51~55 문서 공통 식 (설명용 모형):
#   조용할 때의 문턱 Tq(f): Terhardt(1979) 근사식
#   바크 z(f) = 13 atan(0.00076 f) + 3.5 atan((f/7500)^2)  (Zwicker & Terhardt 1980)
#   퍼짐 함수 SF(dz) = 15.81 + 7.5(dz+0.474) - 17.5 sqrt(1+(dz+0.474)^2) dB  (Schroeder 1979)
#   순음 하나의 가림 문턱 = (가리는 소리 레벨) - 10 dB + SF(z(f) - z(fm))   (10 dB 간격은 설명용 가정)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "52_frequency-masking"
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
OFFSET = 10.0


def tq(f):
    k = np.asarray(f, dtype=float) / 1000.0
    return 3.64 * k ** -0.8 - 6.5 * np.exp(-0.6 * (k - 3.3) ** 2) + 1e-3 * k ** 4


def bark(f):
    f = np.asarray(f, dtype=float)
    return 13.0 * np.arctan(0.00076 * f) + 3.5 * np.arctan((f / 7500.0) ** 2)


def spread(dz):
    u = np.asarray(dz, dtype=float) + 0.474
    return 15.81 + 7.5 * u - 17.5 * np.sqrt(1.0 + u * u)


def mask(f, fm, Lm):
    return Lm - OFFSET + spread(bark(f) - bark(fm))


def audible_line(f, fm, Lm):
    """들리기 시작하는 선: 조용할 때의 문턱과 가림 문턱 중 높은 쪽."""
    return np.maximum(tq(f), mask(f, fm, Lm))


def masked_range(fm, Lm, lo=100.0, hi=16000.0):
    f = np.logspace(np.log10(lo), np.log10(hi), 20000)
    m = f[mask(f, fm, Lm) > tq(f)]
    return m.min(), m.max()


# 그림 1: 1 kHz 순음이 40, 60, 80 dB일 때의 가림 문턱 (로그 주파수 축)
f = np.logspace(np.log10(100), np.log10(10000), 1500)
fig, ax = plt.subplots(figsize=(7, 4.2))
ax.plot(f, tq(f), color=C[0], lw=1.6, ls="--")
ax.text(130, 23, "조용할 때의 문턱", color=C[0], fontsize=10)
cols = {40: C[2], 60: C[1], 80: C[3]}
for Lm in (40, 60, 80):
    y = audible_line(f, 1000.0, Lm)
    ax.plot(f, y, color=cols[Lm], lw=2)
    lo, hi = masked_range(1000.0, Lm)
    yb = -6 - (Lm - 40) / 4
    ax.plot([lo, hi], [yb] * 2, color=cols[Lm], lw=3, solid_capstyle="butt")
    ax.text(lo * 0.95, yb, f"{Lm} dB: {round(lo, -1):.0f}~{round(hi, -1):.0f} Hz", color=cols[Lm], fontsize=9.5,
            va="center", ha="right")
    ax.plot([1000, 1000], [-20, Lm], color=cols[Lm], lw=1)
    ax.plot([1000], [Lm], marker="v", color=cols[Lm], ms=6)
ax.text(1080, 82, "가리는 소리 1 kHz", fontsize=9.5)
ax.annotate("아래쪽은 가파르다", xy=(700, 45), xytext=(160, 62), fontsize=9.5,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.annotate("위쪽은 완만하게\n멀리 퍼진다", xy=(2300, 40), xytext=(3300, 58), fontsize=9.5,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.set_xscale("log")
ax.set_xlim(100, 10000)
ax.set_ylim(-22, 90)
ax.set_xticks([100, 200, 500, 1000, 2000, 5000, 10000])
ax.set_xticklabels(["100", "200", "500", "1k", "2k", "5k", "10k"])
ax.set_xlabel("시험 음의 주파수 (Hz, 로그 눈금)")
ax.set_ylabel("들리기 시작하는 레벨 (dB SPL)")
save(fig, 1)

# 그림 2: 1 kHz 60 dB 순음과 2 dB짜리 시험 음 셋 (선형 주파수 축)
TESTS = [(2000.0, 2.0), (3100.0, 2.0), (9000.0, 2.0)]
f2 = np.linspace(50, 15000, 3000)
fig, ax = plt.subplots(figsize=(7, 3.8))
ax.plot(f2 / 1000, tq(f2), color=C[0], lw=1.6, ls="--")
ax.plot(f2 / 1000, np.where(mask(f2, 1000.0, 60) > tq(f2), mask(f2, 1000.0, 60), np.nan), color=C[1], lw=2)
ax.plot([1, 1], [0, 60], color=C[1], lw=1.2)
ax.text(1.15, 58, "가리는 소리 1 kHz, 60 dB", color=C[1], fontsize=9.5)
ax.text(7.6, 16, "조용할 때의 문턱", color=C[0], fontsize=9.5)
ax.axhline(0, color=INK, lw=0.6, ls=":")
for ft, Lt in TESTS:
    ok = Lt > max(tq(ft), mask(ft, 1000.0, 60))
    ax.plot([ft / 1000], [Lt], marker="o", ms=8, color=C[2] if ok else INK,
            markerfacecolor=C[2] if ok else "none", markeredgewidth=1.6)
    ax.text(ft / 1000, -11, f"{ft / 1000:g} kHz", fontsize=9.5, ha="center", va="center")
    ax.plot([ft / 1000] * 2, [-8.5, Lt - 1.5], color=INK, lw=0.6, ls=":")
ax.text(5.2, 40, "채운 점: 들린다\n빈 점: 안 들린다", fontsize=9.5)
ax.set_xlim(0, 15)
ax.set_ylim(-14, 65)
ax.set_xlabel("주파수 (kHz, 선형 눈금)")
ax.set_ylabel("dB SPL")
save(fig, 2)

if __name__ == "__main__":
    # 퍼짐 함수: 봉우리는 dz = 0에서 0 dB, 멀리서 아래쪽 +25 dB/Bark, 위쪽 -10 dB/Bark
    assert abs(float(spread(0.0))) < 0.01
    dz = np.linspace(-3, 3, 6001)
    assert abs(dz[np.argmax(spread(dz))]) < 0.002
    assert abs(float(spread(-10) - spread(-11)) - 24.9) < 0.1
    assert abs(float(spread(11) - spread(10)) + 9.9) < 0.1
    # 1 kHz 가리는 소리가 가리는 범위 (모형): 40 dB 729~1778, 60 dB 622~2624, 80 dB 526~3776 Hz
    want = {40: (729, 1778), 60: (622, 2624), 80: (526, 3776)}
    for Lm, (lo_w, hi_w) in want.items():
        lo, hi = masked_range(1000.0, Lm)
        assert abs(lo - lo_w) < 3 and abs(hi - hi_w) < 6, (Lm, lo, hi)
        # 위쪽으로 더 넓다 (바크로 비교)
        assert bark(hi) - bark(1000.0) > bark(1000.0) - bark(lo)
    # 시험 음 셋: 2 kHz는 가려지고, 3.1 kHz는 들리고, 9 kHz는 조용할 때의 문턱보다 작다
    (f_a, L_a), (f_b, L_b), (f_c, L_c) = TESTS
    assert tq(f_a) < L_a < mask(f_a, 1000.0, 60)
    assert L_b > max(tq(f_b), mask(f_b, 1000.0, 60))
    assert L_c < tq(f_c) and mask(f_c, 1000.0, 60) < tq(f_c)
    print("ALL CHECKS PASSED")
```
{% endraw %}
