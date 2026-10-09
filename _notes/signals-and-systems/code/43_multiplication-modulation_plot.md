---
layout: "note"
title: "43_multiplication-modulation_plot.py"
display_title: "43_multiplication-modulation_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "43"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/multiplication-modulation/"
parent_title: "곱셈 성질과 진폭 변조"
description: "신호 및 시스템 · 곱셈 성질과 진폭 변조 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/43_multiplication-modulation_plot/"
---
{% raw %}
[곱셈 성질과 진폭 변조](/Hongs_Blog/studies/signals-and-systems/multiplication-modulation/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 곱셈 성질과 진폭 변조 문서의 그림을 만든다: 43_multiplication-modulation_fig1.svg, 43_multiplication-modulation_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 43_multiplication-modulation_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "43_multiplication-modulation"
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


w1, w0 = 1.0, 5.0


def S(w):  # 메시지 스펙트럼: |ω| < ω1에서만 있는 삼각형 (높이 1)
    return np.clip(1 - np.abs(w) / w1, 0, None)


w = np.linspace(-12, 12, 4000)
R = 0.5 * S(w - w0) + 0.5 * S(w + w0)
G = 0.25 * S(w - 2 * w0) + 0.5 * S(w) + 0.25 * S(w + 2 * w0)

# 그림 2: 진폭 변조와 복조의 스펙트럼. 반송파를 곱하면 ±ω0로 옮겨지고, 다시 곱하면 0과 ±2ω0로 간다
fig, axs = plt.subplots(3, 1, figsize=(6.2, 4.8), sharex=True)
for i, (ax, Y, lab) in enumerate(zip(axs, [S(w), R, G], [r"$S(j\omega)$", r"$R(j\omega)$", r"$G(j\omega)$"])):
    ax.plot(w, Y, color=C[i], lw=1.6)
    ax.fill_between(w, 0, Y, color=C[i], alpha=0.15)
    ax.set_ylim(0, 1.15)
    ax.set_yticks([0, 0.5, 1])
    ax.text(12.5, 0.5, lab, fontsize=10, va="center")
axs[2].plot([-w1, -w1, w1, w1], [0, 0.75, 0.75, 0], color=INK, lw=1.0, ls="--")
axs[2].text(w1 + 0.2, 0.78, "저역 통과 필터", fontsize=9)
axs[2].set_xticks([-2 * w0, -w0, 0, w0, 2 * w0])
axs[2].set_xticklabels([r"$-2\omega_0$", r"$-\omega_0$", "0", r"$\omega_0$", r"$2\omega_0$"])
axs[2].set_xlabel(r"$\omega$")
fig.tight_layout()
save(fig, 2)

# 그림 1: 시간 영역. 메시지 s(t)에 cos ω0t를 곱한 r(t)는 s(t)를 포락선으로 진동한다
t = np.linspace(-12, 12, 4000)
s = (np.sinc(w1 * t / (2 * np.pi))) ** 2          # 스펙트럼이 삼각형인 메시지 (S의 역변환에 비례)
fig, ax = plt.subplots(figsize=(6.5, 2.9))
ax.plot(t, s * np.cos(w0 * t), color=C[1], lw=1.0, label=r"$r(t) = s(t)\cos\omega_0 t$")
ax.plot(t, s, color=C[0], lw=1.8, label="$s(t)$")
ax.plot(t, -s, color=C[0], lw=0.8, ls="--")
ax.axhline(0, color=INK, lw=0.6)
ax.set_xlabel("$t$")
ax.set_ylim(-1.1, 1.5)
ax.legend(loc="upper right", fontsize=9, ncol=2)
save(fig, 1)

if __name__ == "__main__":
    # ω0 > ω1이라 R의 두 덩어리가 겹치지 않고, G의 가운데는 S/2. s(t)의 변환이 삼각형 꼴임을 수치 적분으로 확인
    assert np.all(S(w - w0) * S(w + w0) == 0)
    m = np.abs(w) < w1
    assert np.allclose(G[m], 0.5 * S(w[m]))
    tt = np.linspace(-400, 400, 800001); d = tt[1] - tt[0]
    st = np.sinc(w1 * tt / (2 * np.pi)) ** 2
    F0 = np.sum(st) * d
    for wv in (0.0, 0.5, 1.5):
        Fw = np.sum(st * np.cos(wv * tt)) * d
        assert abs(Fw / F0 - S(np.array(wv))) < 2e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
