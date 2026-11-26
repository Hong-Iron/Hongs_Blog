---
layout: "note"
title: "37_cie-xyz_plot.py"
display_title: "37_cie-xyz_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "37"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/cie-xyz/"
parent_title: "CIE XYZ"
description: "휴먼 인터페이스 미디어 · CIE XYZ 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/37_cie-xyz_plot/"
---
{% raw %}
[CIE XYZ](/Hongs_Blog/studies/human-interface-media/cie-xyz/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# CIE XYZ 문서의 그림을 만든다: 37_cie-xyz_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 37_cie-xyz_plot.py  (matplotlib, numpy 필요)
# 곡선: CIE 1931 x_bar, y_bar, z_bar의 Wyman-Sloan-Shirley(2013) 다중 가우스 근사
# 점: CIE 1924 명소시 V(lambda) 표 (10 nm 간격)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "37_cie-xyz"
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
    return x, y, z


V = {380: 0.000039, 390: 0.00012, 400: 0.000396, 410: 0.00121, 420: 0.004, 430: 0.0116,
     440: 0.023, 450: 0.038, 460: 0.06, 470: 0.09098, 480: 0.13902, 490: 0.20802,
     500: 0.323, 510: 0.503, 520: 0.71, 530: 0.862, 540: 0.954, 550: 0.99495, 555: 1.0,
     560: 0.995, 570: 0.952, 580: 0.87, 590: 0.757, 600: 0.631, 610: 0.503, 620: 0.381,
     630: 0.265, 640: 0.175, 650: 0.107, 660: 0.061, 670: 0.032, 680: 0.017, 690: 0.00821,
     700: 0.004102}

lam = np.linspace(380, 720, 1701)
xb, yb, zb = xyz_bar(lam)

# 그림 1: x_bar, y_bar, z_bar. 세 곡선 모두 0 위에 있고, y_bar는 V 표의 점을 지나며, 650 nm 위에서 z_bar = 0
fig, ax = plt.subplots(figsize=(7.0, 3.8))
ax.axvspan(650, 720, color=INK, alpha=0.10, lw=0)
ax.text(685, 1.55, "650 nm 위:\n$\\bar z$ = 0", ha="center", fontsize=10)
ax.plot(lam, zb, color=C[0], lw=2)
ax.plot(lam, yb, color=C[2], lw=2)
ax.plot(lam, xb, color=C[1], lw=2)
lv = np.array(sorted(V))
ax.plot(lv, [V[k] for k in lv], "o", color=INK, ms=3.2, mfc="none", mew=1)
ax.text(470, 1.62, r"$\bar z$", color=C[0], fontsize=12)
ax.text(520, 0.93, r"$\bar y$", color=C[2], fontsize=12)
ax.text(612, 1.08, r"$\bar x$", color=C[1], fontsize=12)
ax.text(446, 0.40, r"$\bar x$", color=C[1], fontsize=12)
ax.text(565, 1.25, "빈 점: V(λ) 표", fontsize=10)
ax.set_xlim(380, 720)
ax.set_ylim(0, 1.9)
ax.set_xlabel("파장 $\\lambda$ (nm)")
ax.set_ylabel("등색 함수 값")
save(fig, 1)

if __name__ == "__main__":
    assert min(xb.min(), yb.min(), zb.min()) >= 0
    assert max(abs(xyz_bar(np.array([float(k)]))[1][0] - v) for k, v in V.items()) < 0.008
    assert zb[lam >= 650].max() < 1e-6
    # z_bar 봉우리 약 1.78 (약 445 nm), x_bar 큰 봉우리 약 1.06 (약 600 nm)
    assert 1.75 < zb.max() < 1.80 and 440 < lam[np.argmax(zb)] < 450
    assert 1.04 < xb.max() < 1.08 and 595 < lam[np.argmax(xb)] < 605
    print("ALL CHECKS PASSED")
```
{% endraw %}
