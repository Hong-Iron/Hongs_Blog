---
layout: "note"
title: "62_aliasing_plot.py"
display_title: "62_aliasing_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "62"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/aliasing/"
parent_title: "에일리어싱"
description: "휴먼 인터페이스 미디어 · 에일리어싱 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/62_aliasing_plot/"
---
{% raw %}
[에일리어싱](/Hongs_Blog/studies/human-interface-media/aliasing/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 에일리어싱 문서의 그림을 만든다: 62_aliasing_fig1.svg ~ fig3.svg
# 실행: ~/.venvs/vault-plots/bin/python 62_aliasing_plot.py  (matplotlib, numpy 필요)
#   fig1: 시간 영역. ω0 = 4ωs/6, 5ωs/6인 빠른 코사인의 표본이 느린 코사인 위에 놓인다
#   fig2: 접힘. 표본화율 8 kHz에서 입력 주파수 f와 보이는 주파수 f_a
#   fig3: 주파수 영역. ωs > 2ωM이면 복사본이 떨어져 있고, ωs < 2ωM이면 겹쳐 더해진다
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "62_aliasing"
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


def tri(w, c, half, height):
    return height * np.clip(1 - np.abs(w - c) / half, 0, None)


def alias(f, fs):
    return abs(f - round(f / fs) * fs)


# ---------- 그림 3: 주파수 영역 ----------
wM = 1.0
w = np.linspace(-5.2, 5.2, 2081)
fig, axs = plt.subplots(2, 1, figsize=(7, 4.4), sharex=True)
sums = {}
for ax, ws, title in ((axs[0], 3.2, r"$\omega_s > 2\omega_M$: 복사본이 떨어져 있다"),
                      (axs[1], 1.5, r"$\omega_s < 2\omega_M$: 복사본이 겹쳐 더해진다")):
    h = ws / (2 * math.pi)                               # 복사본의 높이 1/T
    parts = [tri(w, k * ws, wM, h) for k in range(-5, 6)]
    total = sum(parts)
    sums[ws] = (h, total)
    ax.axvspan(-ws / 2, ws / 2, color=C[3], alpha=0.10, lw=0)
    if ws < 2 * wM:
        for p in parts:
            ax.plot(w, np.where(p > 0, p, np.nan), color=C[1], lw=0.9, ls="--")
    ax.plot(w, total, color=C[1], lw=2)
    ax.axvline(0, color=INK, lw=0.6)
    ax.set_yticks([])
    ax.spines["left"].set_visible(False)
    ax.text(-5.1, h * 2.05, title, fontsize=11)
    ax.text(0.06, h * 1.04, "1/T", fontsize=10)
    ax.set_ylim(0, h * 2.4)
axs[1].text(ws / 2 + 0.08, sums[1.5][0] * 1.25, "필터 통과 대역\n안에 이웃 복사본이 섞인다", fontsize=10, color=C[3])
axs[0].tick_params(axis="x", length=0)
axs[1].set_xticks([-1, 0, 1])
axs[1].set_xticklabels([r"$-\omega_M$", "0", r"$\omega_M$"], fontsize=10)
axs[0].text(3.2, -0.03, r"$\omega_s$", ha="center", va="top", fontsize=10)
axs[0].text(-3.2, -0.03, r"$-\omega_s$", ha="center", va="top", fontsize=10)
axs[1].annotate(r"$\omega_s - \omega_M$", xy=(0.5, 0), xytext=(2.2, -0.075), fontsize=10, va="center",
                arrowprops=dict(arrowstyle="-|>", color=INK, lw=0.8, mutation_scale=8))
axs[1].set_xlabel(r"각주파수 $\omega$ (아래: $\omega_s = 1.5\,\omega_M$, 위: $\omega_s = 3.2\,\omega_M$)")
save(fig, 3)

# ---------- 그림 1: 시간 영역 ----------
fs2 = 6.0                                                # 1초에 6번 잰다: ωs = 2π·6
tt = np.linspace(0, 2, 2001)
n2 = np.arange(0, 13)
tn = n2 / fs2
fig, axs = plt.subplots(2, 1, figsize=(7, 4.6), sharex=True)
for ax, f0, lab in ((axs[0], 4.0, r"$\omega_0 = 4\omega_s/6$"), (axs[1], 5.0, r"$\omega_0 = 5\omega_s/6$")):
    fa = alias(f0, fs2)
    ax.plot(tt, np.cos(2 * np.pi * f0 * tt), color=INK, lw=1.0)
    ax.plot(tt, np.cos(2 * np.pi * fa * tt), color=C[0], lw=1.6, ls="--")
    ax.vlines(tn, 0, np.cos(2 * np.pi * f0 * tn), color=C[1], lw=1.6)
    ax.plot(tn, np.cos(2 * np.pi * f0 * tn), "o", color=C[1], ms=5)
    ax.axhline(0, color=INK, lw=0.8)
    ax.set_yticks([])
    ax.spines["left"].set_visible(False)
    ax.set_ylim(-1.25, 1.6)
    ax.text(0.0, 1.27, lab + "인 코사인(회색)의 표본", fontsize=11)
    ax.text(1.38, 1.27, f"보이는 것: $\\omega_s/{int(round(fs2 / fa))}$ (점선)", fontsize=11, color=C[0])
axs[0].tick_params(axis="x", length=0)
axs[1].set_xticks(tn[::3])
axs[1].set_xticklabels([str(k) for k in n2[::3]])
axs[1].set_xlabel("표본 번호 n")
save(fig, 1)

# ---------- 그림 2: 접힘 ----------
fs3 = 8.0
f = np.linspace(0, 20, 2001)
fa3 = np.abs(f - np.round(f / fs3) * fs3)
fig, ax = plt.subplots(figsize=(7, 3.2))
ax.plot(f, fa3, color=C[0], lw=2)
for k in range(1, 6):
    ax.axvline(k * fs3 / 2, color=INK, lw=0.7, ls=":")
ax.axhline(3, color=C[1], lw=0.9, ls="--")
same = [3, 5, 11, 13, 19]
ax.plot(same, [3] * len(same), "o", color=C[1], ms=6)
ax.annotate("5 kHz는 3 kHz로 보인다", xy=(5, 3), xytext=(6.2, 4.55), fontsize=10, color=C[1],
            arrowprops=dict(arrowstyle="-|>", color=C[1], lw=0.8, mutation_scale=8))
ax.set_xticks([0, 4, 8, 12, 16, 20])
ax.set_xticklabels(["0", "4\n($f_s/2$)", "8\n($f_s$)", "12", "16\n($2f_s$)", "20"], fontsize=10)
ax.set_yticks([0, 3, 4])
ax.set_xlabel("들어온 주파수 f (kHz), 표본화율 $f_s$ = 8 kHz")
ax.set_ylabel("보이는 주파수 $f_a$ (kHz)")
ax.set_ylim(0, 5.2)
save(fig, 2)

if __name__ == "__main__":
    # 그림 3: 겹치지 않을 때는 통과 대역 안이 원래 삼각형 하나, 겹칠 때는 0.5 ≤ ω ≤ 1에서 합이 평평한 0.5/T
    h0, tot0 = sums[3.2]
    inside = np.abs(w) < 3.2 / 2
    assert np.max(np.abs(tot0[inside] - tri(w, 0, wM, h0)[inside])) < 1e-9
    h1, tot1 = sums[1.5]
    flat = (w >= 0.5) & (w <= 1.0)
    assert np.max(np.abs(tot1[flat] - 0.5 * h1)) < 1e-9
    # 그림 1: 4ωs/6 → ωs/3(3표본마다), 5ωs/6 → ωs/6(6표본마다), 표본이 점선 위에 정확히 놓임
    assert alias(4.0, 6.0) == 2.0 and alias(5.0, 6.0) == 1.0
    for f0 in (4.0, 5.0):
        assert np.max(np.abs(np.cos(2 * np.pi * f0 * tn) - np.cos(2 * np.pi * alias(f0, 6.0) * tn))) < 1e-9
    # 그림 2: 3, 5, 11, 13, 19 kHz가 모두 3 kHz로 보이고, f_a는 0~4 kHz 안
    assert all(alias(v, 8.0) == 3.0 for v in same)
    assert fa3.min() >= 0 and fa3.max() <= 4.0 + 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
