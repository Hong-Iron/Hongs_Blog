---
layout: "note"
title: "05_rate-and-bandwidth_plot.py"
display_title: "05_rate-and-bandwidth_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "05"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/rate-and-bandwidth/"
parent_title: "전송 속도와 대역폭"
description: "컴퓨터 통신 · 전송 속도와 대역폭 코드 코드"
permalink: "/studies/computer-communication/code/05_rate-and-bandwidth_plot/"
---
{% raw %}
[전송 속도와 대역폭](/Hongs_Blog/studies/computer-communication/rate-and-bandwidth/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 전송 속도와 대역폭 문서의 그림을 만든다: 05_rate-and-bandwidth_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 05_rate-and-bandwidth_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "05_rate-and-bandwidth"
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

L = 12_000            # 1,500바이트 패킷 (비트)
X = 400e3             # 링크 길이 400 km (m)
V = 2e8               # 광케이블 신호 속도 (m/s)


def d_trans(r):
    return L / r


D_PROP = X / V

# 그림 1: 전송률을 바꿀 때 전송 지연, 전파 지연, 둘의 합 (양쪽 로그 눈금, 단위 ms)
r = np.logspace(6, 10, 300)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.loglog(r, d_trans(r) * 1e3, color=C[0], lw=1.6)
ax.loglog(r, np.full_like(r, D_PROP * 1e3), color=C[1], lw=1.6)
ax.loglog(r, (d_trans(r) + D_PROP) * 1e3, color=INK, lw=2.4)
ax.text(1.3e6, 9.0 * 1.6, "합", fontsize=10)
ax.text(1.5e9, 0.0016, "전송 지연 $L/R$", color=C[0], fontsize=10, ha="right")
ax.text(2e9, 2.6, "전파 지연 2 ms", color=C[1], fontsize=10)
for rr, lab in [(1e8, "100 Mbps"), (1e9, "1 Gbps")]:
    ax.plot([rr], [d_trans(rr) * 1e3], "o", color=C[0], ms=4)
    ax.annotate(f"{lab}\n{d_trans(rr) * 1e6:.0f} μs", (rr, d_trans(rr) * 1e3), textcoords="offset points",
                xytext=(-6, -6), ha="right", va="top", fontsize=9, color=C[0])
ax.set_xlabel("전송률 $R$ (bps)")
ax.set_ylabel("지연 (ms)")
ax.set_ylim(1e-3, 30)
ax.set_xticks([1e6, 1e7, 1e8, 1e9, 1e10], ["1M", "10M", "100M", "1G", "10G"])
ax.set_yticks([1e-3, 1e-2, 1e-1, 1, 10], ["0.001", "0.01", "0.1", "1", "10"])
ax.minorticks_off()
save(fig, 1)

if __name__ == "__main__":
    # 문서 표의 값: 100 Mbps에서 120 μs, 1 Gbps에서 12 μs, 전파 지연 2 ms. 1 Gbps에서 합 2.012 ms
    assert abs(d_trans(1e8) - 120e-6) < 1e-12 and abs(d_trans(1e9) - 12e-6) < 1e-12
    assert abs(D_PROP - 2e-3) < 1e-12
    assert abs(d_trans(1e9) + D_PROP - 2.012e-3) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
