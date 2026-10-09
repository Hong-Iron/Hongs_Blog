---
layout: "note"
title: "10_center-surround_plot.py"
display_title: "10_center-surround_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "10"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/center-surround/"
parent_title: "중심-주변 길항"
description: "휴먼 인터페이스 미디어 · 중심-주변 길항 그림 생성 코드"
permalink: "/studies/human-interface-media/code/10_center-surround_plot/"
---
{% raw %}
[중심-주변 길항](/Hongs_Blog/studies/human-interface-media/center-surround/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 중심-주변 길항 문서의 그림을 만든다: 10_center-surround_fig1.svg, 10_center-surround_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 10_center-surround_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "10_center-surround"
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

S0, G = 10.0, 10.0   # 자발 발화, 민감도 (검증 코드와 같은 값)


def disk_response(rho, k):
    rho = np.asarray(rho, dtype=float)
    center = np.pi * np.minimum(rho, 1.0) ** 2
    surround = np.where(rho > 1.0, np.pi * (np.minimum(rho, 2.0) ** 2 - 1.0), 0.0)
    return np.maximum(0.0, S0 + G * (center - k * surround))


def stripe_gain(u):
    u = np.asarray(u, dtype=float)
    return 2 * np.sin(2 * np.pi * u) * (1 - np.cos(2 * np.pi * u)) / (np.pi * u)


# 그림 1: 둥근 빛의 반지름 rho에 따른 반응. k가 얼마든 rho = 1에서 꼭대기
rho = np.linspace(0, 2, 401)
ks = [(0.2, "0.2"), (1 / 3, "1/3"), (0.5, "0.5"), (1.0, "1")]
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.axvspan(0, 1, color=C[0], alpha=0.07)
ax.axvspan(1, 2, color=C[1], alpha=0.07)
ax.text(0.5, 44, "가운데(흥분)", ha="center", fontsize=10)
ax.text(1.05, 44, "둘레(억제)", ha="left", fontsize=10)
for i, (k, lab) in enumerate(ks):
    ax.plot(rho, disk_response(rho, k), color=C[i], lw=1.8, label=f"$k$ = {lab}")
ax.axhline(S0, color=INK, lw=0.8, ls=":")
ax.text(0.35, S0 - 3, "자발 발화", fontsize=9)
ax.set_xlim(0, 2)
ax.set_ylim(0, 48)
ax.set_xlabel(r"빛의 반지름 $\rho$")
ax.set_ylabel("반응 $r$")
ax.legend(loc="upper left", bbox_to_anchor=(0, 0.92))
save(fig, 1)

# 그림 2: 줄무늬 반응 크기 |R(u)|. 고른 빛(u = 0)과 촘촘한 줄무늬는 거의 통과하지 못한다
u = np.linspace(1e-4, 4, 4000)
R = np.abs(stripe_gain(u))
i_max = int(np.argmax(R))
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.plot(u, R, color=C[0], lw=2)
ax.plot(u[i_max], R[i_max], "o", color=C[1])
ax.annotate(f"최대: $u \\approx$ {u[i_max]:.2f}", (u[i_max], R[i_max]), xytext=(12, -4),
            textcoords="offset points", fontsize=10, color=C[1])
ax.axhline(0.2 * R[i_max], color=INK, lw=0.8, ls="--")
ax.text(3.95, 0.2 * R[i_max] + 0.04, "최대의 20%", fontsize=9, ha="right")
ax.set_xlim(0, 4)
ax.set_ylim(0, R[i_max] * 1.15)
ax.set_xlabel("공간 주파수 $u$ (사이클/단위)")
ax.set_ylabel("반응 크기 $|R(u)|$")
save(fig, 2)

if __name__ == "__main__":
    # 그림 1: 네 k 모두 최대가 rho = 1
    for k, _ in ks:
        assert rho[int(np.argmax(disk_response(rho, k)))] == 1.0
    # k = 1이면 rho = sqrt(2 + 1/pi) ≈ 1.52에서 반응이 0에 닿는다
    zero = rho[np.argmax(disk_response(rho, 1.0) == 0)]
    assert abs(zero - math.sqrt(2 + 1 / math.pi)) < 0.01 and abs(zero - 1.52) < 0.01, zero
    # 그림 2: 최대 u ≈ 0.287, u >= 3에서 최대의 20% 미만, u -> 0에서 0
    assert abs(u[i_max] - 0.287) < 0.005, u[i_max]
    assert R[u >= 3].max() < 0.2 * R[i_max]
    assert R[0] < 1e-3
    assert all(abs(stripe_gain(z)) < 1e-12 for z in (0.5, 1.0, 1.5, 2.0))
    print("ALL CHECKS PASSED")
```
{% endraw %}
