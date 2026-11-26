---
layout: "note"
title: "36_cie-rgb_plot.py"
display_title: "36_cie-rgb_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "36"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/cie-rgb/"
parent_title: "CIE RGB 등색 함수"
description: "휴먼 인터페이스 미디어 · CIE RGB 등색 함수 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/36_cie-rgb_plot/"
---
{% raw %}
[CIE RGB 등색 함수](/Hongs_Blog/studies/human-interface-media/cie-rgb/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# CIE RGB 등색 함수 문서의 그림을 만든다: 36_cie-rgb_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 36_cie-rgb_plot.py  (matplotlib, numpy 필요)
# 곡선: CIE 1931 x_bar, y_bar, z_bar의 Wyman-Sloan-Shirley(2013) 다중 가우스 근사에
#       RGB -> XYZ 행렬의 역행렬을 곱해 얻은 r_bar, g_bar, b_bar (근사)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "36_cie-rgb"
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


def g(x, mu, s1, s2):
    s = np.where(x < mu, s1, s2)
    return np.exp(-0.5 * ((x - mu) / s) ** 2)


def xyz_bar(lam):
    x = 1.056 * g(lam, 599.8, 37.9, 31.0) + 0.362 * g(lam, 442.0, 16.0, 26.7) - 0.065 * g(lam, 501.1, 20.4, 26.2)
    y = 0.821 * g(lam, 568.8, 46.9, 40.5) + 0.286 * g(lam, 530.9, 16.3, 31.1)
    z = 1.217 * g(lam, 437.0, 11.8, 36.0) + 0.681 * g(lam, 459.0, 26.0, 13.8)
    return np.vstack([x, y, z])


M = np.array([[0.49, 0.31, 0.20], [0.17697, 0.81240, 0.01063], [0.0, 0.01, 0.99]])
lam = np.linspace(380, 720, 1701)
rgb = 0.17697 * np.linalg.inv(M) @ xyz_bar(lam)
rb, gb, bb = rgb

# 그림 1: r_bar, g_bar, b_bar. 회색 띠는 빨강 원색이 음수인 구간
fig, ax = plt.subplots(figsize=(7.0, 3.8))
neg = rb < 0
ax.fill_between(lam, rb, 0, where=(neg & (lam > 440) & (lam < 547)), color=C[1], alpha=0.18, lw=0)
ax.axhline(0, color=INK, lw=0.8)
ax.plot(lam, bb, color=C[0], lw=2)
ax.plot(lam, gb, color=C[2], lw=2)
ax.plot(lam, rb, color=C[1], lw=2)
for x0, c, name in ((435.8, C[0], "B 435.8"), (546.1, C[2], "G 546.1"), (700.0, C[1], "R 700")):
    ax.axvline(x0, color=c, lw=0.9, ls=":")
    ax.text(x0, 0.375, name, color=c, ha="center", fontsize=10)
ax.text(466, 0.29, r"$\bar b$", color=C[0], fontsize=12)
ax.text(560, 0.20, r"$\bar g$", color=C[2], fontsize=12)
ax.text(625, 0.30, r"$\bar r$", color=C[1], fontsize=12)
ax.annotate("빨강이 음수인 구간\n(목표 쪽에 빨강을 더함)", xy=(505, -0.06), xytext=(560, -0.11), color=C[1], fontsize=10,
            arrowprops=dict(arrowstyle="->", color=C[1], lw=1))
ax.set_xlim(380, 720)
ax.set_ylim(-0.12, 0.41)
ax.set_xlabel("맞출 단색광의 파장 $\\lambda$ (nm)")
ax.set_ylabel("필요한 원색의 양")
save(fig, 1)

if __name__ == "__main__":
    i = np.argmin(np.abs(lam - 546.1))
    assert abs(rb[i]) < 0.002 and abs(bb[i]) < 0.002
    i = np.argmin(np.abs(lam - 435.8))
    assert abs(rb[i]) < 0.002 and abs(gb[i]) < 0.002
    k = np.argmin(rb)
    assert -0.095 < rb[k] < -0.085 and 512 < lam[k] < 524
    print("ALL CHECKS PASSED")
```
{% endraw %}
