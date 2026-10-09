---
layout: "note"
title: "003_statistical-deviation--normal-distribution_plot.py"
display_title: "003_statistical-deviation--normal-distribution_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "003"
course: "이상 심리학"
course_slug: "abnormal-psychology"
course_url: "/studies/abnormal-psychology/"
track: "심리학"
parent_url: "/studies/abnormal-psychology/statistical-deviation--normal-distribution/"
parent_title: "통계적 일탈 기준 ↔ 정규분포"
description: "이상 심리학 · 통계적 일탈 기준 ↔ 정규분포 코드 코드"
permalink: "/studies/abnormal-psychology/code/003_statistical-deviation--normal-distribution_plot/"
---
{% raw %}
[통계적 일탈 기준 ↔ 정규분포](/Hongs_Blog/studies/abnormal-psychology/statistical-deviation--normal-distribution/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 통계적 일탈 기준 ↔ 정규분포 문서의 그림을 만든다: 003_statistical-deviation--normal-distribution_fig1.svg, _fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 003_statistical-deviation--normal-distribution_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "003_statistical-deviation--normal-distribution"
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

MU, SD = 100.0, 15.0   # 지능지수의 평균과 표준편차


def phi(z):
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))


def npdf(z):
    return np.exp(-np.asarray(z, dtype=float) ** 2 / 2) / math.sqrt(2 * math.pi)


# 그림 2: 절단점을 어디에 두느냐에 따라 "이상"으로 분류되는 왼쪽 꼬리의 넓이가 바뀐다
z = np.linspace(-3.6, 3.6, 721)
cuts = [(-1.5, C[4]), (-2.0, C[1]), (-2.5, C[3])]
fig, ax = plt.subplots(figsize=(6.5, 3.4))
ax.plot(z, npdf(z), color=INK, lw=1.8)
for zc, c in cuts:
    m = z <= zc
    ax.fill_between(z[m], 0, npdf(z[m]), color=c, alpha=0.45, lw=0)
    ax.axvline(zc, color=c, lw=0.9, ls="--", ymax=0.75)
for (zc, c), yt in zip(cuts, [0.30, 0.24, 0.18]):
    ax.text(zc + 0.06, yt, f"{MU + zc * SD:g} 미만\n{phi(zc):.1%}", color=c, fontsize=9, va="center")
ax.set_xticks([-3, -2.5, -2, -1.5, -1, 0, 1, 2, 3])
ax.set_xticklabels([f"{MU + t * SD:g}\n({t:+g})" if t else f"{MU:g}\n(0)" for t in [-3, -2.5, -2, -1.5, -1, 0, 1, 2, 3]], fontsize=8.5)
ax.set_yticks([])
ax.set_xlim(-3.6, 3.6)
ax.set_ylim(0, 0.43)
ax.set_xlabel("지능지수 (괄호 안은 $z$, 평균에서 표준편차 몇 개)")
save(fig, 2)

# 그림 1: 평균 0, 표준편차 1로 맞춘 정규분포와 지수분포. "평균 + 2σ" 위의 넓이가 두 배 넘게 다르다
x = np.linspace(-3.5, 5, 851)
xe = x[x >= -1]
expo = np.exp(-(xe + 1))            # 지수분포(모수 1)를 평균 0, 표준편차 1로 옮긴 밀도
fig, ax = plt.subplots(figsize=(6.5, 3.2))
ax.plot(x, npdf(x), color=C[0], lw=1.8, label="정규분포")
ax.plot(xe, expo, color=C[1], lw=1.8, label="지수분포 (오른쪽으로 치우침)")
mn, me = x >= 2, xe >= 2
ax.fill_between(x[mn], 0, npdf(x[mn]), color=C[0], alpha=0.35, lw=0)
ax.fill_between(xe[me], 0, expo[me], color=C[1], alpha=0.25, lw=0)
ax.axvline(2, color=INK, lw=0.9, ls="--", ymax=0.6)
ax.text(2.1, 0.30, f"평균 + 2σ 위\n정규 {1 - phi(2):.1%}\n지수 {math.exp(-3):.1%}", fontsize=9.5)
ax.set_xticks([-3, -2, -1, 0, 1, 2, 3, 4, 5])
ax.set_xlabel("평균에서 표준편차 몇 개 ($z$)")
ax.set_yticks([])
ax.set_ylim(0, 1.05)
ax.legend(loc="upper right")
save(fig, 1)

if __name__ == "__main__":
    # 문서의 값: -1.5σ 6.7%, -2σ 2.3%(0.02275), -2.5σ 0.6%, 평균 + 2σ 위 정규 2.3%·지수 5.0%
    assert abs(phi(-1.5) - 0.0668) < 5e-4 and abs(phi(-2) - 0.02275) < 1e-5 and abs(phi(-2.5) - 0.0062) < 5e-4
    assert abs(math.exp(-3) - 0.0498) < 5e-4
    # 옮긴 지수분포가 정말 평균 0, 표준편차 1이고, 2 위의 넓이가 e^-3인지 수치 적분으로 확인
    t = np.linspace(-1, 40, 400_001)
    f = np.exp(-(t + 1))
    dt = t[1] - t[0]
    mean = np.sum(t * f) * dt
    var = np.sum((t - mean) ** 2 * f) * dt
    tail = np.sum(f[t >= 2]) * dt
    assert abs(mean) < 1e-3 and abs(var - 1) < 1e-3 and abs(tail - math.exp(-3)) < 1e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
