---
layout: "note"
title: "50_cochlea-place-theory_plot.py"
display_title: "50_cochlea-place-theory_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "50"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/cochlea-place-theory/"
parent_title: "달팽이관과 장소설"
description: "휴먼 인터페이스 미디어 · 달팽이관과 장소설 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/50_cochlea-place-theory_plot/"
---
{% raw %}
[달팽이관과 장소설](/Hongs_Blog/studies/human-interface-media/cochlea-place-theory/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 달팽이관과 장소설 문서의 그림을 만든다: 50_cochlea-place-theory_fig1.svg, fig2.svg, fig3.svg
# 실행: ~/.venvs/vault-plots/bin/python 50_cochlea-place-theory_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "50_cochlea-place-theory"
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


L_MM = 35.0                                        # 기저막 길이


def freq_at(d_mm):
    """바닥에서 d mm 떨어진 자리가 가장 크게 반응하는 주파수. Greenwood (1990), 사람."""
    x = 1 - np.asarray(d_mm, dtype=float) / L_MM   # 꼭대기에서 잰 길이 비율
    return 165.4 * (10 ** (2.1 * x) - 0.88)


def place_mm(f_hz):
    """주파수 f 를 맡는 자리 (바닥에서 mm)."""
    x = np.log10(np.asarray(f_hz, dtype=float) / 165.4 + 0.88) / 2.1
    return L_MM * (1 - x)


BEKESY = {1600: 17.2, 800: 20.4, 400: 24.4, 200: 29.2, 100: 31.5, 50: 32.6}   # 측정 그림에서 눈으로 읽은 봉우리 (mm)


def envelope(d, dc, w_base=6.0, w_apex=1.2):
    """진행파 포락선 모형: 바닥 쪽은 완만하게 커지고, 봉우리 dc 를 지나면 빨리 사라진다."""
    d = np.asarray(d, dtype=float)
    w = np.where(d < dc, w_base, w_apex)
    return np.exp(-((d - dc) / w) ** 2)


# 그림 2: 자리-주파수 지도
d = np.linspace(0, L_MM, 701)
fig, ax = plt.subplots(figsize=(7.2, 3.9))
ax.plot(d, freq_at(d), color=C[0], lw=2.2)
ax.plot(list(BEKESY.values()), list(BEKESY.keys()), "o", color=C[1], ms=6)
ax.text(6.0, 120, "주황 점: 베케시가 잰 봉우리 자리", color=C[1], fontsize=10)
ax.text(2.0, 7000, "Greenwood 함수", color=C[0], fontsize=10)
mid = L_MM / 2
ax.plot([mid, mid], [15, float(freq_at(mid))], color=INK, lw=0.8, ls=":")
ax.plot([0, mid], [float(freq_at(mid))] * 2, color=INK, lw=0.8, ls=":")
ax.text(mid + 0.5, float(freq_at(mid)) * 1.15, f"한가운데: 약 {float(freq_at(mid)) / 1000:.1f} kHz", fontsize=10)
ax.set_yscale("log")
ax.set_xlim(0, L_MM)
ax.set_ylim(15, 25000)
ax.set_yticks([20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000])
ax.set_yticklabels(["20", "50", "100", "200", "500", "1k", "2k", "5k", "10k", "20k"])
ax.set_xlabel("바닥(등자뼈 쪽)에서 잰 거리 (mm)")
ax.set_ylabel("가장 크게 흔드는 주파수 (Hz)")
ax.text(0.3, 18, "바닥", fontsize=10)
ax.text(34.7, 18, "꼭대기", fontsize=10, ha="right")
save(fig, 2)

# 그림 3: 1 kHz 순음의 진행파, 세 순간의 모습과 포락선 (모형)
F_ONE = 1000.0
dc1 = float(place_mm(F_ONE))
A1 = envelope(d, dc1)
phase = 2 * np.pi * 1.5 * (d / dc1) ** 2          # 꼭대기 쪽으로 갈수록 위상이 빨리 쌓인다(파장이 짧아진다)
TIMES = [0.0, np.pi / 2, np.pi]                    # 세 순간: 4분의 1 주기씩 차이


def crest_mm(wt):
    """같은 마루 하나를 따라간 자리: wt - phase(d) = -2 pi 가 되는 d."""
    return dc1 * math.sqrt((wt + 2 * math.pi) / (3 * math.pi))
fig, ax = plt.subplots(figsize=(7.2, 3.4))
ax.plot(d, A1, color=INK, lw=1.2, ls="--")
ax.plot(d, -A1, color=INK, lw=1.2, ls="--")
for i, (wt, c) in enumerate(zip(TIMES, C[:3])):
    u = A1 * np.cos(wt - phase)
    ax.plot(d, u, color=c, lw=1.8)
    dm = crest_mm(wt)                                           # 같은 마루가 그 순간 있는 자리
    ax.text(dm, float(envelope(dm, dc1)) + 0.06, str(i + 1), color=c, fontsize=11, ha="center")
ax.axhline(0, color=INK, lw=0.6)
ax.text(dc1 - 15, 0.82, "포락선(가장 크게 흔들리는 폭)", fontsize=10)
ax.annotate("", xy=(33.5, -0.55), xytext=(25.0, -0.55),
            arrowprops=dict(arrowstyle="->", color=INK, lw=1.2))
ax.text(25.0, -0.45, "물결이 가는 쪽(꼭대기)", fontsize=10)
ax.set_xlim(0, L_MM)
ax.set_ylim(-1.15, 1.15)
ax.set_yticks([])
ax.set_xlabel("바닥에서 잰 거리 (mm)")
ax.set_ylabel("기저막의 위아래 흔들림")
save(fig, 3)

# 그림 1: 440 + 880 + 1320 Hz 복합음. 위는 시간 파형, 아래는 기저막 위 세 봉우리 (모형)
COMP = [440.0, 880.0, 1320.0]
t = np.linspace(0, 0.005, 2001)
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(7.2, 5.0), gridspec_kw={"height_ratios": [1, 1.25]})
x = sum(np.sin(2 * np.pi * f * t) for f in COMP)
ax1.plot(t * 1000, x, color=INK, lw=1.6)
ax1.axhline(0, color=INK, lw=0.6)
ax1.set_xlim(0, 5)
ax1.set_yticks([])
ax1.set_xlabel("시간 (ms)")
ax1.set_ylabel("압력 변화")
ax1.text(0.05, 2.4, "귀에 들어오는 소리: 세 성분이 섞인 한 줄의 파형", fontsize=10)
ax1.set_ylim(-3, 3.1)
for f, c, ha, dx in zip(COMP, [C[0], C[2], C[1]], ["center", "left", "right"], [0.3, -0.2, 0.4]):
    dc = float(place_mm(f))
    ax2.plot(d, envelope(d, dc), color=c, lw=2)
    ax2.text(dc + dx, 1.04, f"{f:.0f} Hz", color=c, fontsize=10, ha=ha)
ax2.set_xlim(0, L_MM)
ax2.set_ylim(0, 1.2)
ax2.set_yticks([])
ax2.set_xlabel("바닥에서 잰 거리 (mm)")
ax2.set_ylabel("기저막이 흔들리는 폭")
ax2.text(0.3, 0.9, "바닥\n(높은 소리 쪽)", fontsize=10)
ax2.text(34.7, 0.9, "꼭대기\n(낮은 소리 쪽)", fontsize=10, ha="right")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert abs(float(freq_at(L_MM)) - 19.85) < 0.01 and abs(float(freq_at(0)) - 20677) < 1
    assert abs(float(freq_at(mid)) - 1710) < 1
    for f, mm in BEKESY.items():                                   # 측정과 식의 차이 2.5 mm 안
        assert abs(float(place_mm(f)) - mm) < 2.5
    pos = [float(place_mm(f)) for f in COMP]
    assert [round(p, 1) for p in pos] == [25.8, 21.8, 19.2], pos   # 높을수록 바닥 쪽
    assert abs(dc1 - 21.0) < 0.05
    # 진행파: 같은 마루가 시간이 지나며 꼭대기 쪽으로 옮겨 가고, 봉우리에 가까워질수록 커진다
    crest = [crest_mm(wt) for wt in TIMES]
    assert crest[0] < crest[1] < crest[2] and abs(crest[2] - dc1) < 1e-9, crest
    for wt, dm in zip(TIMES, crest):
        ph = 2 * np.pi * 1.5 * (dm / dc1) ** 2
        assert abs(math.cos(wt - ph) - 1) < 1e-9                   # 그 자리가 정말 마루다
    amps = [float(envelope(dm, dc1)) for dm in crest]
    assert amps[0] < amps[1] < amps[2] == 1.0, amps
    assert np.all(np.diff(phase) > 0)                              # 위상이 꼭대기 쪽으로 늘기만 한다
    print("ALL CHECKS PASSED")
```
{% endraw %}
