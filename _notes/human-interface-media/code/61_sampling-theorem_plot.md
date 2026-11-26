---
layout: "note"
title: "61_sampling-theorem_plot.py"
display_title: "61_sampling-theorem_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "61"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/sampling-theorem/"
parent_title: "표본화 정리"
description: "휴먼 인터페이스 미디어 · 표본화 정리 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/61_sampling-theorem_plot/"
---
{% raw %}
[표본화 정리](/Hongs_Blog/studies/human-interface-media/sampling-theorem/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 표본화 정리 문서의 그림을 만든다: 61_sampling-theorem_fig1.svg ~ fig3.svg
# 실행: ~/.venvs/vault-plots/bin/python 61_sampling-theorem_plot.py  (matplotlib, numpy 필요)
#   fig1: 시간 영역. x(t)에 임펄스열 p(t)를 곱하면 표본 x(nT)만 남는다
#   fig2: 주파수 영역. X(jω), P(jω), 복사본이 줄지은 X_p(jω), 저역 통과 필터 H(jω), 되살린 X_r(jω)
#   fig3: 되살리기를 시간에서 보기. 표본마다 sinc 하나씩을 세워 더하면 원래 곡선이 된다
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "61_sampling-theorem"
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


def arrows(ax, xs, hs, color, lw=1.6):
    """임펄스를 위(또는 아래)를 향한 화살표로 그린다."""
    for xv, h in zip(xs, hs):
        ax.annotate("", xy=(xv, h), xytext=(xv, 0),
                    arrowprops=dict(arrowstyle="-|>", color=color, lw=lw, mutation_scale=10, shrinkA=0, shrinkB=0))


def tri(w, c, half, height):
    return height * np.clip(1 - np.abs(w - c) / half, 0, None)


# ---------- 그림 1: 시간 영역 ----------
def xt(t):
    return 0.55 + 0.35 * np.sin(2 * np.pi * 0.18 * t + 0.4) + 0.2 * np.cos(2 * np.pi * 0.42 * t + 1.0)


T1 = 0.8
t = np.linspace(-5, 5, 1001)
n1 = np.arange(-6, 7)
tn = n1 * T1
fig, axs = plt.subplots(3, 1, figsize=(7, 5.2), sharex=True)
ax = axs[0]
ax.plot(t, xt(t), color=C[0], lw=2)
ax.text(4.2, xt(4.2) + 0.12, "x(t)", color=C[0], fontsize=11)
ax.set_ylim(0, 1.25)
ax = axs[1]
arrows(ax, tn, np.ones_like(tn), C[2])
ax.text(4.95, 0.9, "p(t)", color=C[2], fontsize=11)
ax.annotate("", xy=(0, 1.15), xytext=(T1, 1.15), arrowprops=dict(arrowstyle="<->", color=INK, lw=1))
ax.text(T1 / 2, 1.2, "T", ha="center", fontsize=11)
ax.text(-0.15, 1.02, "1", ha="right", fontsize=10)
ax.set_ylim(0, 1.4)
ax = axs[2]
ax.plot(t, xt(t), color=INK, lw=1, ls="--")
arrows(ax, tn, xt(tn), C[1])
ax.text(4.95, 0.75, r"$x_p(t)$", color=C[1], fontsize=11)
ax.annotate("x(0)", xy=(0, xt(0.0)), xytext=(0.5, 1.12), fontsize=10, color=C[1],
            arrowprops=dict(arrowstyle="-", color=C[1], lw=0.8))
ax.annotate("x(T)", xy=(T1, xt(T1)), xytext=(1.5, 1.12), fontsize=10, color=C[1],
            arrowprops=dict(arrowstyle="-", color=C[1], lw=0.8))
ax.set_ylim(0, 1.3)
ax.set_xlabel("시간 t")
for ax in axs:
    ax.set_yticks([])
    ax.axhline(0, color=INK, lw=0.8)
    ax.spines["left"].set_visible(False)
for ax in axs[:2]:
    ax.tick_params(axis="x", length=0)
axs[2].set_xticks([0, T1, 2 * T1])
axs[2].set_xticklabels(["0", "T", "2T"])
save(fig, 1)

# ---------- 그림 2: 주파수 영역 ----------
wM, ws, wc = 1.0, 3.2, 1.6
T2 = 2 * math.pi / ws
w = np.linspace(-7.6, 7.6, 3041)
fig, axs = plt.subplots(5, 1, figsize=(7, 8.0), sharex=True)
labels = [r"$X(j\omega)$", r"$P(j\omega)$", r"$X_p(j\omega)$", r"$H(j\omega)$", r"$X_r(j\omega)$"]
# (1) 원래 스펙트럼
ax = axs[0]
ax.plot(w, tri(w, 0, wM, 1.0), color=C[0], lw=2)
ax.text(0.08, 1.0, "1", fontsize=10)
ax.set_ylim(0, 1.35)
# (2) 임펄스열의 스펙트럼
ax = axs[1]
ks = np.arange(-2, 3)
arrows(ax, ks * ws, np.full(ks.shape, 1.0), C[2])
ax.text(0.1, 1.02, r"$2\pi/T$", fontsize=10)
ax.set_ylim(0, 1.5)
# (3) 표본화한 신호의 스펙트럼: 높이 1/T인 복사본이 ωs마다
ax = axs[2]
Xp = sum(tri(w, k * ws, wM, 1 / T2) for k in range(-3, 4))
ax.axvspan(-wc, wc, color=C[3], alpha=0.10, lw=0)
ax.plot(w, Xp, color=C[1], lw=2)
ax.text(0.08, 1 / T2, "1/T", fontsize=10)
ax.text(4.2, 0.66, r"$\omega_s > 2\omega_M$", fontsize=11, color=C[1])
ax.annotate(r"$\omega_s - \omega_M$", xy=(ws - wM, 0), xytext=(ws - wM, -0.16), ha="center", va="center", fontsize=10,
            arrowprops=dict(arrowstyle="-|>", color=INK, lw=0.8, mutation_scale=8))
ax.text(-wc - 0.15, 0.66, "필터가 통과시키는 곳", fontsize=10, ha="right", color=C[3])
ax.set_ylim(-0.22, 0.85)
# (4) 이상적 저역 통과 필터
ax = axs[3]
ax.plot([-7.6, -wc, -wc, wc, wc, 7.6], [0, 0, T2, T2, 0, 0], color=C[3], lw=2)
ax.text(-wc - 0.1, T2 * 0.92, "T", fontsize=10, ha="right")
ax.text(2.0, T2 * 0.55, r"$\omega_M < \omega_c < \omega_s - \omega_M$", fontsize=11, color=C[3])
ax.set_ylim(0, T2 * 1.3)
# (5) 되살린 스펙트럼 = 원래 스펙트럼
ax = axs[4]
Xr = np.where(np.abs(w) < wc, T2 * Xp, 0)
ax.plot(w, Xr, color=C[0], lw=2)
ax.text(0.08, 1.0, "1", fontsize=10)
ax.set_ylim(0, 1.35)
for ax, lab in zip(axs, labels):
    ax.set_yticks([])
    ax.axhline(0, color=INK, lw=0.8)
    ax.axvline(0, color=INK, lw=0.6)
    ax.spines["left"].set_visible(False)
    ax.text(-7.5, ax.get_ylim()[1] * 0.78, lab, fontsize=11)
for ax in axs[:4]:
    ax.tick_params(axis="x", length=0)
    ax.spines["bottom"].set_visible(False)
axs[4].set_xticks([-2 * ws, -ws, -wM, wM, ws, 2 * ws])
axs[4].set_xticklabels([r"$-2\omega_s$", r"$-\omega_s$", r"$-\omega_M$", r"$\omega_M$",
                        r"$\omega_s$", r"$2\omega_s$"], fontsize=10)
axs[4].set_xlabel(r"각주파수 $\omega$")
save(fig, 2)

# ---------- 그림 3: sinc를 더해 되살리기 ----------
B, fs3 = 0.8, 2.0                                       # x(t) = sinc²(Bt): 최고 주파수 B = 0.8 Hz, 표본화율 2 Hz
T3 = 1 / fs3
x3 = lambda tt: np.sinc(B * tt) ** 2                     # numpy의 sinc(u) = sin(πu)/(πu)
tt = np.linspace(-3, 3, 1201)
nn = np.arange(-400, 401)
rec = sum(x3(n * T3) * np.sinc((tt - n * T3) / T3) for n in nn)
fig, ax = plt.subplots(figsize=(7, 3.4))
ax.plot(tt, x3(tt), color=INK, lw=4, alpha=0.6, label="원래 신호 x(t)")
for n in range(-6, 7):
    ax.plot(tt, x3(n * T3) * np.sinc((tt - n * T3) / T3), color=C[0], lw=0.8, alpha=0.55)
ax.plot(tt, rec, color=C[1], lw=1.6, ls="--", label="sinc를 모두 더한 것")
ax.plot(np.arange(-6, 7) * T3, x3(np.arange(-6, 7) * T3), "o", color=C[1], ms=5, label="표본 x(nT)")
ax.text(0.62, 0.62, "표본 하나마다\nsinc 하나", fontsize=10, color=C[0])
ax.axhline(0, color=INK, lw=0.8)
ax.set_xlabel("시간 t (초), 표본 간격 T = 0.5초")
ax.set_ylim(-0.25, 1.15)
ax.legend(loc="upper right", fontsize=10)
save(fig, 3)

if __name__ == "__main__":
    # 그림 1: 표본화율 1/T = 1.25 Hz가 최고 주파수 0.42 Hz의 두 배보다 크다
    assert 1 / T1 > 2 * 0.42
    # 그림 2: 복사본이 겹치지 않고, 필터 차단 주파수가 허용 범위 안이며, 되살린 스펙트럼이 원래와 같다
    assert ws > 2 * wM and wM < wc < ws - wM
    assert np.max(np.abs(Xr - tri(w, 0, wM, 1.0))) < 1e-9
    assert abs(Xp[np.argmin(np.abs(w))] - 1 / T2) < 1e-9
    # 그림 3: 표본화율 2 Hz > 2 × 0.8 Hz, sinc를 더한 값이 원래 신호와 일치
    assert fs3 > 2 * B
    assert np.max(np.abs(rec - x3(tt))) < 1e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
