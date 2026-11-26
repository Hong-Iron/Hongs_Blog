---
layout: "note"
title: "53_critical-band-bark_plot.py"
display_title: "53_critical-band-bark_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "53"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/critical-band-bark/"
parent_title: "임계 대역과 바크 스케일"
description: "휴먼 인터페이스 미디어 · 임계 대역과 바크 스케일 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/53_critical-band-bark_plot/"
---
{% raw %}
[임계 대역과 바크 스케일](/Hongs_Blog/studies/human-interface-media/critical-band-bark/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 임계 대역과 바크 스케일 문서의 그림을 만든다: 53_critical-band-bark_fig1.svg, 53_critical-band-bark_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 53_critical-band-bark_plot.py  (matplotlib, numpy 필요)
# 51~55 문서 공통 식 (설명용 모형):
#   조용할 때의 문턱 Tq(f): Terhardt(1979) 근사식
#   바크 z(f) = 13 atan(0.00076 f) + 3.5 atan((f/7500)^2)  (Zwicker & Terhardt 1980)
#   임계 대역 폭 CB(f) = 25 + 75 (1 + 1.4 (f/1000)^2)^0.69 Hz  (Zwicker & Terhardt 1980)
#   퍼짐 함수 SF(dz) = 15.81 + 7.5(dz+0.474) - 17.5 sqrt(1+(dz+0.474)^2) dB  (Schroeder 1979)
#   순음 하나의 가림 문턱 = (가리는 소리 레벨) - 10 dB + SF(z(f) - z(fm))
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "53_critical-band-bark"
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


# 문서의 임계 대역 표: (대역 번호, 아래 경계, 가운데, 위 경계, 폭) Hz
TABLE = [(1, None, 50, 100, None), (2, 100, 150, 200, 100), (3, 200, 250, 300, 100), (4, 300, 350, 400, 100),
         (5, 400, 450, 510, 110), (6, 510, 570, 630, 120), (7, 630, 700, 770, 140), (8, 770, 840, 920, 150),
         (9, 920, 1000, 1080, 160), (10, 1080, 1170, 1270, 190), (11, 1270, 1370, 1480, 210),
         (12, 1480, 1600, 1720, 240), (13, 1720, 1850, 2000, 280), (14, 2000, 2150, 2320, 320),
         (15, 2320, 2500, 2700, 380), (16, 2700, 2900, 3150, 450), (17, 3150, 3400, 3700, 550),
         (18, 3700, 4000, 4400, 700), (19, 4400, 4800, 5300, 900), (20, 5300, 5800, 6400, 1100),
         (21, 6400, 7000, 7700, 1300), (22, 7700, 8500, 9500, 1800), (23, 9500, 10500, 12000, 2500),
         (24, 12000, 13500, 15500, 3500), (25, 15500, 18775, 22050, 6550)]

# ---- 51~55 공통 식 ----
OFFSET = 10.0


def tq(f):
    k = np.asarray(f, dtype=float) / 1000.0
    return 3.64 * k ** -0.8 - 6.5 * np.exp(-0.6 * (k - 3.3) ** 2) + 1e-3 * k ** 4


def bark(f):
    f = np.asarray(f, dtype=float)
    return 13.0 * np.arctan(0.00076 * f) + 3.5 * np.arctan((f / 7500.0) ** 2)


def cbw(f):
    f = np.asarray(f, dtype=float)
    return 25.0 + 75.0 * (1.0 + 1.4 * (f / 1000.0) ** 2) ** 0.69


def spread(dz):
    u = np.asarray(dz, dtype=float) + 0.474
    return 15.81 + 7.5 * u - 17.5 * np.sqrt(1.0 + u * u)


def mask(f, fm, Lm):
    return Lm - OFFSET + spread(bark(f) - bark(fm))


# 그림 1: 대역 폭과 가운데 주파수 (로그-로그). 점은 문서의 표, 선은 Zwicker-Terhardt 식
fig, ax = plt.subplots(figsize=(7, 4))
cen = np.array([r[2] for r in TABLE if r[4]])
wid = np.array([r[4] for r in TABLE if r[4]])
fx = np.logspace(np.log10(50), np.log10(20000), 400)
ax.plot(fx, cbw(fx), color=C[0], lw=1.8)
ax.plot(cen, wid, "o", color=C[1], ms=5)
ax.plot([50, 500], [100, 100], color=INK, lw=0.8, ls=":")
ax.plot([500, 20000], [0.2 * 500, 0.2 * 20000], color=INK, lw=0.8, ls=":")
ax.text(60, 74, "500 Hz 아래: 폭이 약 100 Hz로 거의 같다", fontsize=9.5)
ax.text(1500, 1500, "500 Hz 위: 주파수에\n거의 비례해 넓어진다", fontsize=9.5)
ax.text(3000, 160, "점: 임계 대역 표\n선: Zwicker-Terhardt 식", fontsize=9.5)
ax.annotate("25번: 22,050 Hz에서 잘림", xy=(18775, 6550), xytext=(2300, 9000), fontsize=9.5,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.set_xscale("log")
ax.set_yscale("log")
ax.set_xlim(50, 22000)
ax.set_ylim(60, 15000)
ax.set_xticks([100, 200, 500, 1000, 2000, 5000, 10000, 20000])
ax.set_xticklabels(["100", "200", "500", "1k", "2k", "5k", "10k", "20k"])
ax.set_yticks([100, 200, 500, 1000, 2000, 5000, 10000])
ax.set_yticklabels(["100", "200", "500", "1k", "2k", "5k", "10k"])
ax.set_xlabel("대역의 가운데 주파수 (Hz, 로그 눈금)")
ax.set_ylabel("임계 대역 폭 (Hz, 로그 눈금)")
save(fig, 1)

# 그림 2: 같은 60 dB 가리는 소리 여섯 개의 가림 문턱. 왼쪽 Hz 축, 오른쪽 바크 축
MASKERS = [250.0, 500.0, 1000.0, 2000.0, 4000.0, 8000.0]
fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.6, 3.6), sharey=True)
fz = np.logspace(np.log10(30), np.log10(15500), 4000)
for ax in (a1, a2):
    x = fz / 1000 if ax is a1 else bark(fz)
    ax.plot(x, tq(fz), color=INK, lw=1.3, ls="--")
    for i, fm in enumerate(MASKERS):
        m = mask(fz, fm, 60.0)
        ax.plot(x, np.where(m > tq(fz), m, np.nan), color=C[i % 5], lw=1.6)
a1.set_xlim(0, 15)
a1.set_xlabel("주파수 (kHz)")
a1.set_ylabel("dB SPL")
a1.set_title("Hz 축: 높을수록 넓어 보인다", fontsize=10, color=INK)
a2.set_xlim(0, 25)
a2.set_xlabel("바크 (Bark)")
a2.set_title("바크 축: 모양이 모두 같다", fontsize=10, color=INK)
for i, fm in enumerate(MASKERS):
    lab = f"{fm / 1000:g}k" if fm >= 1000 else f"{fm:.0f}"
    a2.text(float(bark(fm)), 53, lab, color=C[i % 5], fontsize=9.5, ha="center")
a1.set_ylim(-10, 60)
save(fig, 2)

if __name__ == "__main__":
    # 표: 폭 = 위 경계 - 아래 경계, 대역은 빈틈없이 이어진다
    for i, (b, lo, c, hi, w) in enumerate(TABLE):
        assert b == i + 1
        if lo is not None:
            assert hi - lo == w and lo == TABLE[i - 1][3]
    # 바크 식: 대역 k의 위 경계에서 z는 k에 가깝다 (1~24번, 0.2 Bark 안)
    for b, lo, c, hi, w in TABLE[:24]:
        assert abs(float(bark(hi)) - b) < 0.2, b
    # 25번 대역은 0.74 Bark밖에 안 된다 (22,050 Hz에서 잘림)
    assert abs(float(bark(22050) - bark(15500)) - 0.73) < 0.01
    # 폭 식과 표: 2~24번에서 10 % 안
    for b, lo, c, hi, w in TABLE[1:24]:
        assert abs(float(cbw(c)) - w) / w < 0.10, b
    # 바크 축에서는 가림 곡선의 모양이 같다: 봉우리에서 10 dB 내려가는 폭(Bark)이 여섯 소리 모두 같다
    widths = []
    for fm in MASKERS:
        zz = np.linspace(float(bark(fm)) - 4, float(bark(fm)) + 6, 20001)
        y = 60 - OFFSET + spread(zz - float(bark(fm)))
        above = zz[y > 60 - OFFSET - 10]
        widths.append(above.max() - above.min())
    assert max(widths) - min(widths) < 1e-9, widths
    print("ALL CHECKS PASSED")
```
{% endraw %}
