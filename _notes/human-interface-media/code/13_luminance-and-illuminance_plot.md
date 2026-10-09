---
layout: "note"
title: "13_luminance-and-illuminance_plot.py"
display_title: "13_luminance-and-illuminance_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "13"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/luminance-and-illuminance/"
parent_title: "휘도와 조도"
description: "휴먼 인터페이스 미디어 · 휘도와 조도 코드 코드"
permalink: "/studies/human-interface-media/code/13_luminance-and-illuminance_plot/"
---
{% raw %}
[휘도와 조도](/Hongs_Blog/studies/human-interface-media/luminance-and-illuminance/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 휘도와 조도 문서의 그림을 만든다: 13_luminance-and-illuminance_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 13_luminance-and-illuminance_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "13_luminance-and-illuminance"
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

RHO_W, RHO_B = 0.80, 0.05


def lum(rho, E):
    return rho * E / math.pi


# 그림 1: 조도를 1,000배 바꿔도 두 선의 간격(비 16배)은 그대로다
E = np.logspace(math.log10(50), math.log10(50_000), 200)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.loglog(E, lum(RHO_W, E), color=C[0], lw=2)
ax.loglog(E, lum(RHO_B, E), color=C[1], lw=2)
ax.text(70_000, lum(RHO_W, 50_000), "흰 종이\n(반사율 80%)", color=C[0], fontsize=10, va="center")
ax.text(70_000, lum(RHO_B, 50_000), "검은 종이\n(반사율 5%)", color=C[1], fontsize=10, va="center")
for e in (50, 500, 50_000):
    w, b = lum(RHO_W, e), lum(RHO_B, e)
    ax.plot([e, e], [b, w], color=INK, lw=0.9, ls=":")
    ax.plot([e, e], [b, w], "o", color=INK, ms=3)
ax.annotate("500 lx: 127 대 8 cd/m²\n(16배)", (500, lum(RHO_W, 500)), xytext=(60, 1500),
            fontsize=9, arrowprops=dict(arrowstyle="-", color=INK, lw=0.6))
ax.set_xlabel("조도 $E$ (lx, 로그 눈금)")
ax.set_ylabel("휘도 $L$ (cd/m², 로그 눈금)")
save(fig, 1)

if __name__ == "__main__":
    # 500 lx에서 127.3과 7.96 cd/m², 모든 조도에서 비 16, 마이컬슨 대비 0.882
    assert abs(lum(RHO_W, 500) - 127.3) < 0.05 and abs(lum(RHO_B, 500) - 7.96) < 0.01
    ratio = lum(RHO_W, E) / lum(RHO_B, E)
    cm = (lum(RHO_W, E) - lum(RHO_B, E)) / (lum(RHO_W, E) + lum(RHO_B, E))
    assert np.allclose(ratio, 16) and np.allclose(cm, 0.75 / 0.85) and abs(cm[0] - 0.882) < 0.001
    print("ALL CHECKS PASSED")
```
{% endraw %}
