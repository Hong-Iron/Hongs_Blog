---
layout: "note"
title: "35_fourier-series-lti_plot.py"
display_title: "35_fourier-series-lti_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "35"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/fourier-series-lti/"
parent_title: "푸리에 급수와 LTI 시스템"
description: "신호 및 시스템 · 푸리에 급수와 LTI 시스템 코드 코드"
permalink: "/studies/signals-and-systems/code/35_fourier-series-lti_plot/"
---
{% raw %}
[푸리에 급수와 LTI 시스템](/Hongs_Blog/studies/signals-and-systems/fourier-series-lti/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 푸리에 급수와 LTI 시스템 문서의 그림을 만든다: 35_fourier-series-lti_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 35_fourier-series-lti_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "35_fourier-series-lti"
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


w0 = 2 * np.pi
a = {0: 1.0, 1: 0.25, -1: 0.25, 2: 0.5, -2: 0.5, 3: 1 / 3, -3: 1 / 3}


def H(w):
    return 1 / (1 + 1j * w)


b = {k: v * H(k * w0) for k, v in a.items()}


def synth(coef, t):
    return sum(c * np.exp(1j * k * w0 * t) for k, c in coef.items()).real


# 그림 1: 예제 3.16. 왼쪽은 입력 계수 |a_k|, 출력 계수 |b_k|와 |H(jω)|. 오른쪽은 입력과 출력 신호
fig, axs = plt.subplots(1, 2, figsize=(7, 3), gridspec_kw={"width_ratios": [1, 1.1]})
ww = np.linspace(-7 * np.pi, 7 * np.pi, 1000)
axs[0].plot(ww, np.abs(H(ww)), color=INK, lw=1.2, label=r"$|H(j\omega)|$")
ks = np.array(sorted(a))
stem(axs[0], ks * w0 - 0.5, np.array([a[k] for k in ks]), C[0], ms=4, label="$|a_k|$")
stem(axs[0], ks * w0 + 0.5, np.abs(np.array([b[k] for k in ks])), C[1], ms=4, label="$|b_k|$")
axs[0].set_xticks([-6 * np.pi, -4 * np.pi, -2 * np.pi, 0, 2 * np.pi, 4 * np.pi, 6 * np.pi])
axs[0].set_xticklabels([r"$-6\pi$", "", r"$-2\pi$", "0", r"$2\pi$", "", r"$6\pi$"])
axs[0].set_xlabel(r"$\omega$")
axs[0].legend(loc="upper right", fontsize=8.5)
axs[0].set_ylim(0, 1.25)
t = np.linspace(-1, 1, 1000)
axs[1].plot(t, synth(a, t), color=C[0], lw=1.6, label="입력 $x(t)$")
axs[1].plot(t, synth(b, t), color=C[1], lw=1.8, label="출력 $y(t)$")
axs[1].axhline(0, color=INK, lw=0.6)
axs[1].set_xlabel("$t$")
axs[1].legend(loc="upper center", ncol=2, fontsize=9)
axs[1].set_ylim(-0.5, 4.3)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # b0 = 1, |b1| = 1/(4√(1 + 4π²)), y(t)가 h = e^{-t}u(t)와의 수치 컨벌루션과 같다
    assert abs(b[0] - 1) < 1e-12 and abs(abs(b[1]) - 1 / (4 * math.sqrt(1 + 4 * math.pi ** 2))) < 1e-12
    tau = np.linspace(0, 30, 300001); d = tau[1] - tau[0]
    for tv in (0.0, 0.3):
        num = np.sum(np.exp(-tau) * synth(a, tv - tau)) * d
        assert abs(num - synth(b, np.array(tv))) < 1e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
