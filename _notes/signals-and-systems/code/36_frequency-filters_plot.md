---
layout: "note"
title: "36_frequency-filters_plot.py"
display_title: "36_frequency-filters_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "36"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/frequency-filters/"
parent_title: "주파수 형성 필터와 주파수 선택 필터"
description: "신호 및 시스템 · 주파수 형성 필터와 주파수 선택 필터 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/36_frequency-filters_plot/"
---
{% raw %}
[주파수 형성 필터와 주파수 선택 필터](/Hongs_Blog/studies/signals-and-systems/frequency-filters/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 주파수 형성 필터와 주파수 선택 필터 문서의 그림을 만든다: 36_frequency-filters_fig1.svg, 36_frequency-filters_fig2.svg, 36_frequency-filters_fig3.svg
# 실행: ~/.venvs/vault-plots/bin/python 36_frequency-filters_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "36_frequency-filters"
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


RC = 0.5


def H_lp(w, rc=RC):
    return 1 / (1 + 1j * w * rc)


def G_hp(w, rc=RC):
    return 1j * w * rc / (1 + 1j * w * rc)


# 그림 2: RC 저역 통과 |H|, 고역 통과 |G| (RC = 0.5)와 이상적 저역 통과. 차단 주파수 1/RC = 2에서 1/√2
w = np.linspace(0, 20, 2000)
fig, ax = plt.subplots(figsize=(6, 3.2))
ax.plot(w, np.where(w <= 1 / RC, 1.0, 0.0), color=INK, lw=1.0, ls="--", label="이상적 저역 통과")
ax.plot(w, np.abs(H_lp(w)), color=C[0], lw=1.8, label=r"RC 저역 통과 $|H(j\omega)|$")
ax.plot(w, np.abs(G_hp(w)), color=C[1], lw=1.8, label=r"RC 고역 통과 $|G(j\omega)|$")
ax.axvline(1 / RC, color=INK, lw=0.5, ls=":")
ax.plot([1 / RC], [1 / math.sqrt(2)], "o", color=INK, ms=5)
ax.text(1 / RC + 0.4, 1 / math.sqrt(2) + 0.04, r"$\omega = 2$, $|H| = 1/\sqrt{2}$ (약 $-3$dB)", fontsize=9)
ax.set_xlabel(r"$\omega$ (rad/s)")
ax.set_ylim(0, 1.35)
ax.legend(loc="center right", fontsize=9, ncol=1)
save(fig, 2)

# 그림 3: 이산 시간 필터의 |H(e^{jω})|. ω = 0 근처가 저주파, ±π 근처가 고주파
w = np.linspace(-np.pi, np.pi, 1000)
fig, ax = plt.subplots(figsize=(6.5, 3.2))
ax.plot(w, np.abs(1 / (1 - 0.6 * np.exp(-1j * w))), color=C[0], lw=1.8, label="1차 재귀 $a = 0.6$")
ax.plot(w, np.abs(1 / (1 + 0.6 * np.exp(-1j * w))), color=C[1], lw=1.8, label="1차 재귀 $a = -0.6$")
ax.plot(w, np.abs((1 + 2 * np.cos(w)) / 3), color=C[2], lw=1.6, label="3점 평균")
ax.plot(w, np.abs(np.cos(w / 2)), color=C[3], lw=1.6, ls="--", label="2점 평균")
ax.set_xticks([-np.pi, -np.pi / 2, 0, np.pi / 2, np.pi])
ax.set_xticklabels([r"$-\pi$", r"$-\pi/2$", "0", r"$\pi/2$", r"$\pi$"])
ax.set_xlabel(r"$\omega$")
ax.set_ylim(0, 3.3)
ax.legend(loc="upper center", ncol=2, fontsize=9)
save(fig, 3)


# 그림 1: RC를 키우면 높은 주파수를 더 잘 거르지만(왼쪽), 계단 응답이 느려진다(오른쪽)
fig, axs = plt.subplots(1, 2, figsize=(6.8, 2.9))
w = np.linspace(0, 10, 1000)
t = np.linspace(0, 4, 1000)
for i, rc in enumerate([0.25, 1.0]):
    axs[0].plot(w, np.abs(H_lp(w, rc)), color=C[i], lw=1.8, label=f"$RC = {rc}$")
    axs[1].plot(t, 1 - np.exp(-t / rc), color=C[i], lw=1.8)
axs[0].set_xlabel(r"$\omega$ (rad/s)")
axs[0].set_title(r"$|H(j\omega)|$", fontsize=10)
axs[0].legend(loc="upper right", fontsize=9)
axs[1].set_xlabel("$t$ (초)")
axs[1].set_title("계단 응답 $s(t)$", fontsize=10)
for ax in axs:
    ax.set_ylim(0, 1.08)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # |H(j2)| = 1/√2, 위상 -45°, H + G = 1, ω = 10/RC에서 |H| ≈ 0.0995
    assert abs(abs(H_lp(2.0)) - 1 / math.sqrt(2)) < 1e-12 and abs(np.angle(H_lp(2.0)) + math.pi / 4) < 1e-12
    assert np.allclose(H_lp(w) + G_hp(w), 1)
    assert abs(abs(H_lp(10 / RC)) - 0.0995) < 1e-4
    # 1차 재귀: a = 0.6이면 ω = 0에서 2.5, π에서 0.625. 3점 평균은 2π/3에서 0, 2점 평균은 π에서 0
    assert abs(abs(1 / (1 - 0.6)) - 2.5) < 1e-12 and abs(abs(1 / (1 + 0.6)) - 0.625) < 1e-12
    assert abs((1 + 2 * np.cos(2 * np.pi / 3)) / 3) < 1e-12 and abs(np.cos(np.pi / 2)) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
