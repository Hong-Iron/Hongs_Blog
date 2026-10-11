---
layout: "note"
title: "27_throughput_plot.py"
display_title: "27_throughput_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "27"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/throughput/"
parent_title: "처리량"
description: "컴퓨터 통신 · 처리량 그림 생성 코드"
permalink: "/studies/computer-communication/code/27_throughput_plot/"
---
{% raw %}
[처리량](/Hongs_Blog/studies/computer-communication/throughput/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 처리량 문서의 그림을 만든다: 27_throughput_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 27_throughput_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "27_throughput"
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

CASES = [  # (소요시간 초, 대역폭 bps, 이름)
    (1e-3, 1e8, "소요시간 1 ms, 100 Mbps"),
    (1e-3, 1e6, "소요시간 1 ms, 1 Mbps"),
    (100e-3, 1e6, "소요시간 100 ms, 1 Mbps"),
]


def total_time(m_bits, lat, r):
    return lat + m_bits / r


def throughput(m_bits, lat, r):
    return m_bits / total_time(m_bits, lat, r)


# 그림 1: 메시지 크기에 따른 처리량. 점선은 각 대역폭(넘을 수 없는 천장)
m_bytes = np.logspace(0, 9.4, 400)
fig, ax = plt.subplots(figsize=(6, 3.6))
for i, (lat, r, name) in enumerate(CASES):
    ax.loglog(m_bytes, throughput(m_bytes * 8, lat, r), color=C[i], lw=1.7, label=name)
for r in (1e6, 1e8):
    ax.axhline(r, color=INK, lw=0.7, ls="--")
ax.text(1.5, 1.4e8, "대역폭 100 Mbps", fontsize=9)
ax.text(1.5, 1.4e6, "대역폭 1 Mbps", fontsize=9)
ax.axvline(25 * 2 ** 20, color=INK, lw=0.6, ls=":")
ax.text(25 * 2 ** 20 * 1.3, 1.5e2, "25 MB", fontsize=9)
ax.set_xticks([1, 2 ** 10, 2 ** 20, 2 ** 30], ["1 B", "1 KB", "1 MB", "1 GB"])
ax.set_yticks([1e2, 1e4, 1e6, 1e8], ["100 bps", "10 kbps", "1 Mbps", "100 Mbps"])
ax.minorticks_off()
ax.set_ylim(30, 5e8)
ax.set_xlabel("메시지 크기")
ax.set_ylabel("처리량")
ax.legend(loc="lower right", bbox_to_anchor=(0.74, 0.0), fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 문서 표의 값: 1바이트 1.008, 1.00008, 100.008 ms. 25 MB 약 209.7초, 2.1초, 209.8초
    one = 8
    assert [round(total_time(one, l, r) * 1e3, 5) for l, r, _ in CASES] == [1.00008, 1.008, 100.008]
    big = 25 * 2 ** 20 * 8
    assert [round(total_time(big, l, r), 1) for l, r, _ in CASES] == [2.1, 209.7, 209.8]
    # 처리량은 늘 대역폭보다 작고, 크기가 커질수록 대역폭에 다가간다
    for l, r, _ in CASES:
        t = throughput(m_bytes * 8, l, r)
        assert np.all(t < r) and np.all(np.diff(t) > 0)
    print("ALL CHECKS PASSED")
```
{% endraw %}
