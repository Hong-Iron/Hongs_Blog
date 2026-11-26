---
layout: "note"
title: "66_dtft-vs-dft_plot.py"
display_title: "66_dtft-vs-dft_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "66"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/dtft-vs-dft/"
parent_title: "이산 시간 푸리에 변환과 이산 푸리에 변환 비교"
description: "휴먼 인터페이스 미디어 · 이산 시간 푸리에 변환과 이산 푸리에 변환 비교 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/66_dtft-vs-dft_plot/"
---
{% raw %}
[이산 시간 푸리에 변환과 이산 푸리에 변환 비교](/Hongs_Blog/studies/human-interface-media/dtft-vs-dft/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이산 시간 푸리에 변환과 이산 푸리에 변환 비교 문서의 그림을 만든다: 66_dtft-vs-dft_fig1.svg, fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 66_dtft-vs-dft_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "66_dtft-vs-dft"
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


def dtft(x, w):
    n = np.arange(len(x))
    return np.exp(-1j * np.outer(w, n)) @ np.asarray(x, dtype=complex)


# 그림 1: x = (1, 2, 3, 4)의 DTFT 크기(곡선)와 DFT 4점, 0을 채운 DFT 16점
x = [1, 2, 3, 4]
w = np.linspace(0, 2 * np.pi, 1201)
curve = np.abs(dtft(x, w))
X4 = np.fft.fft(x, 4)
X16 = np.fft.fft(x, 16)
fig, ax = plt.subplots(figsize=(7.2, 3.6))
ax.plot(w, curve, color=INK, lw=1.6)
k16 = 2 * np.pi * np.arange(16) / 16
ax.plot(k16, np.abs(X16), "o", color=C[0], ms=5)
k4 = 2 * np.pi * np.arange(4) / 4
ax.plot(k4, np.abs(X4), "s", color=C[1], ms=9, mfc="none", mew=2)
ax.set_xticks([0, np.pi / 2, np.pi, 3 * np.pi / 2, 2 * np.pi], ["0", "π/2", "π", "3π/2", "2π"])
ax.set_xlabel("주파수 $\\omega$ (rad/샘플)")
ax.set_ylabel("크기")
ax.set_ylim(0, 11.5)
ax.text(0.15, 10.4, "DTFT 곡선 $|X(e^{j\\omega})|$", color=INK, fontsize=10.5)
ax.text(3.75, 9.2, "DFT 4점 (네모)", color=C[1], fontsize=10.5)
ax.text(3.75, 8.0, "0을 채운 DFT 16점 (동그라미)", color=C[0], fontsize=10.5)
save(fig, 1)

# 그림 2: 0.20, 0.22 사이클/샘플의 두 코사인. 24샘플은 곡선 전체를 봐도 봉우리 하나, 128샘플은 둘
f = np.linspace(0.12, 0.30, 1801)
fig, axes = plt.subplots(2, 1, figsize=(7.2, 5.0), sharex=True)
for ax, L, col in ((axes[0], 24, C[1]), (axes[1], 128, C[0])):
    n = np.arange(L)
    s = np.cos(2 * np.pi * 0.20 * n) + np.cos(2 * np.pi * 0.22 * n)
    mag = np.abs(dtft(s, 2 * np.pi * f))
    ax.plot(f, mag / mag.max(), color=col, lw=1.8)
    for f0 in (0.20, 0.22):
        ax.axvline(f0, color=INK, lw=0.8, ls="--")
    ax.set_ylim(0, 1.25)
    ax.set_ylabel("크기 (최댓값 1)")
    ax.text(0.125, 1.08, f"{L}샘플 (0을 채워 곡선 전체를 그림)", color=col, fontsize=10.5)
axes[1].set_xlabel("주파수 (사이클/샘플)")
axes[0].text(0.201, 0.12, "0.20", color=INK, fontsize=10)
axes[0].text(0.221, 0.12, "0.22", color=INK, fontsize=10)
save(fig, 2)


if __name__ == "__main__":
    # 그림 1: DFT 점이 곡선 위에 정확히 놓인다
    assert np.allclose(np.abs(X4), np.abs(dtft(x, k4)))
    assert np.allclose(np.abs(X16), np.abs(dtft(x, k16)))
    assert np.allclose(X4, [10, -2 + 2j, -2, -2 - 2j])
    # 그림 2: 봉우리 개수 (0.15~0.27 구간, 최댓값의 절반 위)
    def peaks(L):
        n = np.arange(L)
        s = np.cos(2 * np.pi * 0.20 * n) + np.cos(2 * np.pi * 0.22 * n)
        ff = np.linspace(0.15, 0.27, 4001)
        m = np.abs(dtft(s, 2 * np.pi * ff))
        idx = [i for i in range(1, len(m) - 1) if m[i] > m[i - 1] and m[i] > m[i + 1] and m[i] > 0.5 * m.max()]
        return ff[idx]
    p24, p128 = peaks(24), peaks(128)
    assert len(p24) == 1 and 0.205 < p24[0] < 0.215, p24
    assert len(p128) == 2 and abs(p128[0] - 0.20) < 0.002 and abs(p128[1] - 0.22) < 0.002, p128
    print("ALL CHECKS PASSED")
```
{% endraw %}
