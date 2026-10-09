---
layout: "note"
title: "24_difference-equation-system_plot.py"
display_title: "24_difference-equation-system_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "24"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/difference-equation-system/"
parent_title: "차분방정식으로 표현한 LTI 시스템"
description: "신호 및 시스템 · 차분방정식으로 표현한 LTI 시스템 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/24_difference-equation-system_plot/"
---
{% raw %}
[차분방정식으로 표현한 LTI 시스템](/Hongs_Blog/studies/signals-and-systems/difference-equation-system/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 차분방정식으로 표현한 LTI 시스템 문서의 그림을 만든다: 24_difference-equation-system_fig1.svg, 24_difference-equation-system_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 24_difference-equation-system_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "24_difference-equation-system"
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


# 그림 1: FIR(3점 평균, 과거 출력을 안 씀)과 IIR(y[n] = x[n] + y[n-1]/2)의 임펄스 응답
n = np.arange(-2, 13)


def run(b, a, x):  # y[n] = Σ b_k x[n-k] - Σ a_k y[n-k] (a_0 = 1), 초기 휴지
    y = np.zeros(len(x))
    for i in range(len(x)):
        acc = sum(b[k] * x[i - k] for k in range(len(b)) if i - k >= 0)
        acc -= sum(a[k] * y[i - k] for k in range(1, len(a)) if i - k >= 0)
        y[i] = acc
    return y


imp = (n == 0).astype(float)
fir = run([1 / 3, 1 / 3, 1 / 3], [1], imp)
iir = run([1], [1, -0.5], imp)
fig, axs = plt.subplots(1, 2, figsize=(6.8, 2.8), sharey=True)
stem(axs[0], n, fir, C[0], ms=4)
axs[0].set_title(r"FIR: $y[n] = \frac{1}{3}(x[n] + x[n-1] + x[n-2])$", fontsize=9.5)
stem(axs[1], n, iir, C[1], ms=4)
axs[1].set_title(r"IIR: $y[n] = x[n] + \frac{1}{2}y[n-1]$", fontsize=9.5)
for ax in axs:
    ax.set_xlabel("$n$")
axs[0].set_ylabel("$h[n]$")
fig.tight_layout()
save(fig, 1)

# 그림 2: 같은 식 y[n] - 0.6y[n-1] = u[n]도 보조 조건이 다르면 출력이 다르다. 둘 다 2.5로 간다
m = np.arange(0, 16)
rest = np.zeros(len(m)); prev = 0.0
for i in range(len(m)):
    rest[i] = 1 + 0.6 * prev; prev = rest[i]
given = 0.3 * 0.6 ** m + 2.5
fig, ax = plt.subplots(figsize=(6, 3))
ax.plot(m, rest, "o-", color=C[0], ms=5, lw=0.8, label="$y[-1] = 0$ (초기 휴지)")
ax.plot(m, given, "s-", color=C[1], ms=5, lw=0.8, label="$y[1] = 2.68$")
ax.axhline(2.5, color=INK, lw=0.7, ls=":")
ax.text(15.4, 2.5, "2.5", va="center", fontsize=10)
ax.set_xlabel("$n$")
ax.set_ylim(0, 3.3)
ax.legend(loc="lower right", fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # FIR h = b_n/a_0, IIR h = (1/2)^n, 초기 휴지 해 = (1 - 0.6^{n+1}) / 0.4, 다른 보조 조건: y[0] = 2.8, y[1] = 2.68
    assert np.allclose(fir[n >= 0][:3], 1 / 3) and np.allclose(fir[n >= 3], 0)
    assert np.allclose(iir[n >= 0], 0.5 ** n[n >= 0])
    assert np.allclose(rest, (1 - 0.6 ** (m + 1)) / 0.4)
    assert abs(given[0] - 2.8) < 1e-12 and abs(given[1] - 2.68) < 1e-12
    assert np.allclose(given[1:], 0.6 * given[:-1] + 1)
    print("ALL CHECKS PASSED")
```
{% endraw %}
