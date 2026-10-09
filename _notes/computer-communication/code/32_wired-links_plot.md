---
layout: "note"
title: "32_wired-links_plot.py"
display_title: "32_wired-links_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "32"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/wired-links/"
parent_title: "유선 링크"
description: "컴퓨터 통신 · 유선 링크 그림 생성 코드"
permalink: "/studies/computer-communication/code/32_wired-links_plot/"
---
{% raw %}
[유선 링크](/Hongs_Blog/studies/computer-communication/wired-links/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 유선 링크 문서의 그림을 만든다: 32_wired-links_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 32_wired-links_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "32_wired-links"
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


N_CORE, N_CLAD = 1.50, 1.48                              # 문서의 원본 오류 의심 상자에 쓴 예
THETA_C = math.degrees(math.asin(N_CLAD / N_CORE))       # 임계각 (경계의 수직선에서 잰 각) ≈ 80.6°
MAX_TILT = 90.0 - THETA_C                                # 축에서 잰 기울기가 이보다 작아야 전반사 ≈ 9.4°
LENGTH = 40.0                                            # 그림 속 광케이블 길이 (가로 비율은 보기 좋게)
MULTI_CORE = 1.0                                         # 멀티모드 코어 반지름 (그림 단위)
SINGLE_CORE = 0.18                                       # 싱글모드 코어 반지름 (그림 단위)
CLAD = 0.45                                              # 클래딩 두께 (그림 단위)
TILTS = [0.0, 4.0, 8.0]                                  # 멀티모드에 그린 빛의 기울기 (도)


def zigzag(x, tilt_deg, a):
    """코어 반지름 a 안에서 경계에 닿을 때마다 반사되는 빛의 높이. 펼친 직선을 [-a, a]로 접는다"""
    u = np.tan(np.radians(tilt_deg)) * x + a              # 0..2a 범위로 옮겨 접기
    u = np.mod(u, 4 * a)
    return np.where(u <= 2 * a, u, 4 * a - u) - a


def path_ratio(tilt_deg):
    """기울어진 빛이 지나는 길이 ÷ 축을 따라 곧장 가는 길이"""
    return 1.0 / math.cos(math.radians(tilt_deg))


def draw_fiber(ax, a, title):
    ax.fill_between([0, LENGTH], a, a + CLAD, color=INK, alpha=0.18, lw=0)
    ax.fill_between([0, LENGTH], -a - CLAD, -a, color=INK, alpha=0.18, lw=0)
    ax.plot([0, LENGTH], [a, a], color=INK, lw=0.8)
    ax.plot([0, LENGTH], [-a, -a], color=INK, lw=0.8)
    ax.text(LENGTH + 0.6, a + CLAD / 2, "클래딩", va="center", fontsize=9)
    ax.text(LENGTH + 0.6, 0, "코어", va="center", fontsize=9)
    ax.text(LENGTH + 0.6, -a - CLAD / 2, "클래딩", va="center", fontsize=9)
    ax.set_title(title, fontsize=10, loc="left", color=INK)
    ax.set_xlim(-1.5, LENGTH + 4)
    ax.set_yticks([])
    ax.set_xticks([])
    for side in ("left", "bottom"):
        ax.spines[side].set_visible(False)


x = np.linspace(0, LENGTH, 4000)
fig, axes = plt.subplots(2, 1, figsize=(6.5, 4.0), gridspec_kw={"height_ratios": [1.0, 0.55]})

ax = axes[0]
draw_fiber(ax, MULTI_CORE, "멀티모드: 코어가 굵어 빛이 여러 각도의 길로 튕기며 간다")
for k, tilt in enumerate(TILTS):
    ax.plot(x, zigzag(x, tilt, MULTI_CORE), color=C[k], lw=1.4)
ax.annotate("", xy=(0, 0), xytext=(-1.4, 0), arrowprops=dict(arrowstyle="->", color=INK, lw=1.0))
ax.text(LENGTH * 0.52, -MULTI_CORE - CLAD - 0.35, "축에서 0°, 4°, 8° 기울어진 빛: 기울수록 길이 길다",
        ha="center", va="top", fontsize=9)
ax.set_ylim(-MULTI_CORE - CLAD - 0.9, MULTI_CORE + CLAD + 0.1)

ax = axes[1]
draw_fiber(ax, SINGLE_CORE, "싱글모드: 코어가 가늘어 빛이 거의 곧은 길 하나로 간다")
ax.plot(x, np.zeros_like(x), color=C[0], lw=1.4)
ax.annotate("", xy=(0, 0), xytext=(-1.4, 0), arrowprops=dict(arrowstyle="->", color=INK, lw=1.0))
ax.set_ylim(-SINGLE_CORE - CLAD - 0.1, SINGLE_CORE + CLAD + 0.1)

fig.subplots_adjust(hspace=0.55)
save(fig, 1)

if __name__ == "__main__":
    # 임계각: n_core = 1.50, n_clad = 1.48이면 약 80.6° (문서의 값)
    assert abs(THETA_C - 80.6) < 0.05
    # 그린 빛은 모두 축에서 9.4° 안쪽이라 경계에서 전반사된다 (경계의 수직선에서 잰 각이 임계각보다 크다)
    assert all(t < MAX_TILT for t in TILTS)
    assert all(90.0 - t > THETA_C for t in TILTS)
    # 접은 빛은 코어 밖으로 나가지 않는다
    for t in TILTS:
        assert np.all(np.abs(zigzag(x, t, MULTI_CORE)) <= MULTI_CORE + 1e-9)
    # 8° 기울어진 빛의 길은 곧은 길보다 약 1% 길다 (모드마다 도착 시간이 달라지는 이유)
    assert abs(path_ratio(8.0) - 1.0098) < 1e-4
    assert path_ratio(0.0) == 1.0 and path_ratio(4.0) < path_ratio(8.0)
    print(f"임계각 {THETA_C:.1f}°, 허용 기울기 {MAX_TILT:.1f}°, 8° 길이 비 {path_ratio(8.0):.4f}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
