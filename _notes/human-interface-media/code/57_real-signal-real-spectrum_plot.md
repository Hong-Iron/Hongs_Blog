---
layout: "note"
title: "57_real-signal-real-spectrum_plot.py"
display_title: "57_real-signal-real-spectrum_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "57"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/real-signal-real-spectrum/"
parent_title: "실수 신호와 실수 스펙트럼"
description: "휴먼 인터페이스 미디어 · 실수 신호와 실수 스펙트럼 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/57_real-signal-real-spectrum_plot/"
---
{% raw %}
[실수 신호와 실수 스펙트럼](/Hongs_Blog/studies/human-interface-media/real-signal-real-spectrum/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 실수 신호와 실수 스펙트럼 문서의 그림을 만든다: 57_real-signal-real-spectrum_fig1.svg, fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 57_real-signal-real-spectrum_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "57_real-signal-real-spectrum"
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


# 그림 1: 실수 신호 두 개(위: e^{-t}u(t), 아래: e^{-|t|})와 스펙트럼의 실수부·허수부
t = np.linspace(-3, 5, 1601)
w = np.linspace(-6, 6, 1201)
x1 = np.where(t >= 0, np.exp(-t), 0.0)
X1 = 1 / (1 + 1j * w)
x2 = np.exp(-np.abs(t))
X2 = 2 / (1 + w ** 2) + 0j

fig, axes = plt.subplots(2, 2, figsize=(7.4, 4.8), gridspec_kw={"width_ratios": [1, 1.35]})
for row, (x, X, name) in enumerate([(x1, X1, r"$x(t)=e^{-t}u(t)$"), (x2, X2, r"$x(t)=e^{-|t|}$")]):
    ax = axes[row, 0]
    ax.plot(t, x, color=C[0], lw=1.8)
    ax.axhline(0, color=INK, lw=0.6)
    ax.axvline(0, color=INK, lw=0.6, ls=":")
    ax.set_ylim(-0.15, 1.2)
    ax.set_title(name, fontsize=11)
    ax.set_xlabel("$t$")
    ax = axes[row, 1]
    ax.plot(w, X.real, color=C[0], lw=1.8)
    ax.plot(w, X.imag, color=C[1], lw=1.8)
    ax.axhline(0, color=INK, lw=0.6)
    ax.axvline(0, color=INK, lw=0.6, ls=":")
    ax.set_xlabel(r"$\omega$")
    if row == 0:
        ax.set_ylim(-0.65, 1.15)
        ax.text(2.2, 0.32, "실수부 (짝)", color=C[0], fontsize=10.5)
        ax.text(1.6, -0.62, "허수부 (홀)", color=C[1], fontsize=10.5)
        for ww in (-1, 1):
            v = 1 / (1 + 1j * ww)
            ax.plot([ww, ww], [v.real, v.imag], "o", color=INK, ms=4)
        ax.annotate(r"$\omega=\pm1$: $0.5 \mp 0.5j$", xy=(1, -0.5), xytext=(-5.8, -0.55), fontsize=10, color=INK,
                    arrowprops=dict(arrowstyle="-", color=INK, lw=0.6))
        ax.set_title("스펙트럼: 복소수", fontsize=11)
    else:
        ax.set_ylim(-0.4, 2.2)
        ax.text(1.1, 1.3, "실수부 (짝)", color=C[0], fontsize=10.5)
        ax.text(2.6, -0.33, "허수부 = 0", color=C[1], fontsize=10.5)
        ax.set_title("스펙트럼: 실수", fontsize=11)
fig.tight_layout()
save(fig, 1)

# 그림 2: 크기 스펙트럼 |a_k|가 같은 두 소리. 위상만 다르다.
amps = [1.0, 0.5, 1 / 3]
tt = np.linspace(-1, 1, 2001)
xs = sum(A * np.sin(2 * np.pi * (i + 1) * tt) for i, A in enumerate(amps))
xc = sum(A * np.cos(2 * np.pi * (i + 1) * tt) for i, A in enumerate(amps))
ks = np.arange(-4, 5)
mag = np.array([0 if (k == 0 or abs(k) > 3) else amps[abs(k) - 1] / 2 for k in ks])

fig, axes = plt.subplots(2, 2, figsize=(7.4, 4.6), gridspec_kw={"width_ratios": [1.5, 1]})
for row, (x, name, col) in enumerate([(xs, "사인 위상: 실수, 홀함수", C[1]), (xc, "코사인 위상(위상 0): 실수, 짝함수", C[0])]):
    ax = axes[row, 0]
    ax.plot(tt, x, color=col, lw=1.8)
    ax.axhline(0, color=INK, lw=0.6)
    ax.axvline(0, color=INK, lw=0.6, ls=":")
    ax.set_title(name, fontsize=11)
    ax.set_xlabel("$t$ (주기 1)")
    ax.set_ylim(-1.9, 1.9)
    ax = axes[row, 1]
    ml, sl, bl = ax.stem(ks, mag, basefmt=" ")
    plt.setp(sl, color=col, lw=1.8)
    plt.setp(ml, color=col, ms=5)
    ax.axhline(0, color=INK, lw=0.6)
    ax.set_xticks(ks)
    ax.set_ylim(0, 0.62)
    ax.set_title(r"크기 $|a_k|$", fontsize=11)
    ax.set_xlabel("$k$")
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    # 그림에 쓴 값 확인
    assert abs(X1[np.argmin(abs(w - 1))] - (0.5 - 0.5j)) < 1e-9
    assert abs(X1[np.argmin(abs(w + 1))] - (0.5 + 0.5j)) < 1e-9
    assert np.allclose(X1[::-1], np.conj(X1))                 # 켤레 대칭 (w 격자가 0에 대칭)
    assert np.allclose(X2.imag, 0) and np.allclose(X2[::-1], X2)
    assert np.allclose(xc[::-1], xc) and np.allclose(xs[::-1], -xs)
    # 두 소리의 |a_k|가 같은지 FFT로 확인 (한 주기 1000점)
    n = 1000
    tp = np.arange(n) / n
    ys = sum(A * np.sin(2 * np.pi * (i + 1) * tp) for i, A in enumerate(amps))
    yc = sum(A * np.cos(2 * np.pi * (i + 1) * tp) for i, A in enumerate(amps))
    assert np.allclose(np.abs(np.fft.fft(ys)) / n, np.abs(np.fft.fft(yc)) / n, atol=1e-12)
    assert np.allclose(np.abs(np.fft.fft(yc)[1:4]) / n, [0.5, 0.25, 1 / 6], atol=1e-12)
    print("ALL CHECKS PASSED")
```
{% endraw %}
