---
layout: "note"
title: "44_lccde-frequency-response_plot.py"
display_title: "44_lccde-frequency-response_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "44"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/lccde-frequency-response/"
parent_title: "미분방정식 시스템의 주파수 응답"
description: "신호 및 시스템 · 미분방정식 시스템의 주파수 응답 코드 코드"
permalink: "/studies/signals-and-systems/code/44_lccde-frequency-response_plot/"
---
{% raw %}
[미분방정식 시스템의 주파수 응답](/Hongs_Blog/studies/signals-and-systems/lccde-frequency-response/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 미분방정식 시스템의 주파수 응답 문서의 그림을 만든다: 44_lccde-frequency-response_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 44_lccde-frequency-response_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "44_lccde-frequency-response"
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


def H(w):  # 예제 4.25
    jw = 1j * w
    return (jw + 2) / ((jw + 1) * (jw + 3))


t = np.linspace(0, 6, 1200)
p1 = 0.25 * np.exp(-t)
p2 = 0.5 * t * np.exp(-t)
p3 = -0.25 * np.exp(-3 * t)
y = p1 + p2 + p3

# 그림 1: 왼쪽은 예제 4.25의 |H(jω)| (ω = 0에서 2/3인 저역 통과 모양), 오른쪽은 예제 4.26의 출력과 세 조각
fig, axs = plt.subplots(1, 2, figsize=(6.9, 3))
w = np.linspace(-15, 15, 1000)
axs[0].plot(w, np.abs(H(w)), color=C[0], lw=1.8)
axs[0].plot([0], [2 / 3], "o", color=C[0], ms=5)
axs[0].text(0.6, 2 / 3 + 0.02, r"$\frac{2}{3}$", fontsize=11)
axs[0].set_title(r"$|H(j\omega)|$", fontsize=10)
axs[0].set_xlabel(r"$\omega$")
axs[0].set_ylim(0, 0.8)
axs[1].plot(t, p1, color=C[1], lw=1.1, ls="--", label=r"$\frac{1}{4}e^{-t}$")
axs[1].plot(t, p2, color=C[2], lw=1.1, ls="--", label=r"$\frac{1}{2}te^{-t}$")
axs[1].plot(t, p3, color=C[3], lw=1.1, ls="--", label=r"$-\frac{1}{4}e^{-3t}$")
axs[1].plot(t, y, color=C[0], lw=2.0, label="$y(t)$")
axs[1].axhline(0, color=INK, lw=0.6)
axs[1].set_title("예제 4.26의 출력", fontsize=10)
axs[1].set_xlabel("$t$")
axs[1].legend(loc="upper right", fontsize=8.5)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # H(0) = 2/3, y(0) = 0, y가 y'' + 4y' + 3y = x' + 2x (x = e^{-t}, t > 0)를 만족, 수치 컨벌루션 h * x와 일치
    assert abs(H(0.0) - 2 / 3) < 1e-12 and abs(y[0]) < 1e-12
    yf = lambda tv: 0.25 * math.exp(-tv) + 0.5 * tv * math.exp(-tv) - 0.25 * math.exp(-3 * tv)
    hh = 1e-4
    for tv in (0.5, 2.0):
        d1 = (yf(tv + hh) - yf(tv - hh)) / (2 * hh); d2 = (yf(tv + hh) - 2 * yf(tv) + yf(tv - hh)) / hh ** 2
        x, dx = math.exp(-tv), -math.exp(-tv)
        assert abs(d2 + 4 * d1 + 3 * yf(tv) - (dx + 2 * x)) < 1e-5
    dt = 1e-4; tt = np.arange(0, 6, dt)
    hn = 0.5 * np.exp(-tt) + 0.5 * np.exp(-3 * tt)
    yn = np.convolve(hn, np.exp(-tt))[:len(tt)] * dt
    assert abs(yn[int(1.0 / dt)] - yf(1.0)) < 1e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
