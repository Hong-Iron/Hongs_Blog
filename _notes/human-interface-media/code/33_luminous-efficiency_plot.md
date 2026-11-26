---
layout: "note"
title: "33_luminous-efficiency_plot.py"
display_title: "33_luminous-efficiency_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "33"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/luminous-efficiency/"
parent_title: "비시감 효율 곡선"
description: "휴먼 인터페이스 미디어 · 비시감 효율 곡선 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/33_luminous-efficiency_plot/"
---
{% raw %}
[비시감 효율 곡선](/Hongs_Blog/studies/human-interface-media/luminous-efficiency/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 비시감 효율 곡선 문서의 그림을 만든다: 33_luminous-efficiency_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 33_luminous-efficiency_plot.py  (matplotlib, numpy 필요)
# 값: CIE 1924 명소시 V와 CIE 1951 암소시 V'의 10 nm 표 (검증 코드와 같은 표)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "33_luminous-efficiency"
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


V = {380: 0.000039, 390: 0.00012, 400: 0.000396, 410: 0.00121, 420: 0.004, 430: 0.0116,
     440: 0.023, 450: 0.038, 460: 0.06, 470: 0.09098, 480: 0.13902, 490: 0.20802,
     500: 0.323, 510: 0.503, 520: 0.71, 530: 0.862, 540: 0.954, 550: 0.99495, 555: 1.0,
     560: 0.995, 570: 0.952, 580: 0.87, 590: 0.757, 600: 0.631, 610: 0.503, 620: 0.381,
     630: 0.265, 640: 0.175, 650: 0.107, 660: 0.061, 670: 0.032, 680: 0.017, 690: 0.00821,
     700: 0.004102}
VS = {380: 0.000589, 390: 0.002209, 400: 0.00929, 410: 0.03484, 420: 0.0966, 430: 0.1998,
      440: 0.3281, 450: 0.455, 460: 0.567, 470: 0.676, 480: 0.793, 490: 0.904, 500: 0.982,
      510: 0.997, 520: 0.935, 530: 0.811, 540: 0.65, 550: 0.481, 560: 0.3288, 570: 0.2076,
      580: 0.1212, 590: 0.0655, 600: 0.03315, 610: 0.01593, 620: 0.00737, 630: 0.003335,
      640: 0.001497, 650: 0.000677, 660: 0.0003129, 670: 0.000148, 680: 0.0000715,
      690: 0.00003533, 700: 0.0000178}

lv, vv = np.array(sorted(V)), np.array([V[k] for k in sorted(V)])
ls, vs = np.array(sorted(VS)), np.array([VS[k] for k in sorted(VS)])

# 그림 1: 밝을 때(V)와 어두울 때(V') 곡선. 봉우리가 555 nm에서 507 nm로 옮겨 간다
fig, ax = plt.subplots(figsize=(6.6, 3.6))
ax.plot(ls, vs, color=C[0], lw=2, marker="o", ms=3)
ax.plot(lv, vv, color=C[1], lw=2, marker="o", ms=3)
ax.axvline(507, color=C[0], lw=0.9, ls=":")
ax.axvline(555, color=C[1], lw=0.9, ls=":")
ax.text(500, 1.06, "507", color=C[0], ha="right", fontsize=10)
ax.text(562, 1.06, "555", color=C[1], ha="left", fontsize=10)
ax.text(425, 0.62, "어두울 때 V'\n(간상체)", color=C[0], ha="center", fontsize=10)
ax.text(645, 0.62, "밝을 때 V\n(추상체)", color=C[1], ha="center", fontsize=10)
ax.annotate("", xy=(512, 0.88), xytext=(551, 0.88),
            arrowprops=dict(arrowstyle="->", color=INK, lw=1.2))
ax.set_xlim(380, 700)
ax.set_ylim(0, 1.15)
ax.set_xlabel("파장 (nm)")
ax.set_ylabel("상대 감도 (봉우리 = 1)")
save(fig, 1)

if __name__ == "__main__":
    assert lv[np.argmax(vv)] == 555 and vv.max() == 1.0
    assert ls[np.argmax(vs)] == 510 and abs(vs.max() - 0.997) < 1e-9
    # 어두울 때 곡선은 짧은 파장 쪽(왼쪽)으로 옮겨 가 있다: 반값 구간의 가운데가 약 50 nm 왼쪽
    def mid_half(l, v):
        f = np.linspace(380, 700, 3201)
        y = np.interp(f, l, v)
        on = f[y >= 0.5]
        return (on.min() + on.max()) / 2
    shift = mid_half(lv, vv) - mid_half(ls, vs)
    assert 50 < shift < 62, shift
    print("ALL CHECKS PASSED")
```
{% endraw %}
