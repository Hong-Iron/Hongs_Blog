---
layout: "note"
title: "43_line-coding-ladder_plot.py"
display_title: "43_line-coding-ladder_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "43"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/line-coding-ladder/"
parent_title: "인코딩 예제 사다리"
description: "컴퓨터 통신 · 인코딩 예제 사다리 그림 생성 코드"
sitemap: false
permalink: "/studies/computer-communication/code/43_line-coding-ladder_plot/"
---
{% raw %}
[인코딩 예제 사다리](/Hongs_Blog/studies/computer-communication/line-coding-ladder/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 인코딩 예제 사다리의 그림을 만든다: 43_line-coding-ladder_fig1.svg ~ fig6.svg
# 실행: ~/.venvs/vault-plots/bin/python 43_line-coding-ladder_plot.py  (matplotlib, numpy 필요)
#   fig1: 문제 1 (1100의 NRZ, NRZI, 맨체스터)       fig2: 문제 2 답 (0110을 그리고 거꾸로 읽기)
#   fig3: 문제 3 답 (101100, NRZI 처음 높음)          fig4: 문제 4 답 (0100 1101 -> 4B/5B -> NRZI)
#   fig5: 변형 문제 1 답 (0000 0000, NRZ와 4B/5B + NRZI) fig6: 변형 문제 2 답 (받은 신호 읽기)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.patches import Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "43_line-coding-ladder"
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


# ---- 파형 공통 도구 (40~43 인코딩 그림 코드에 같은 것을 복사해 쓴다) ----
H = 0.7          # 파형 높이 (낮음 = y0, 높음 = y0 + H)
LW = 1.8         # 파형 선 굵기
HL = C[1]        # 볼 곳(평평한 구간, 바뀌는 순간)을 칠하는 색


def draw_wave(ax, halves, y0, color, x0=0.0, unit=1.0):
    """반 칸 높이 목록(0 낮음, 1 높음)을 계단 파형으로. 칸 폭 unit, 반 칸 폭 unit/2."""
    xs = [x0 + i * unit / 2 for i in range(len(halves) + 1)]
    ys = [y0 + H * v for v in list(halves) + [halves[-1]]]
    ax.step(xs, ys, where="post", color=color, lw=LW, solid_joinstyle="miter")


def draw_grid(ax, n, y_lo, y_hi, x0=0.0, unit=1.0, mid=False, mid_hi=None):
    """칸 경계는 옅은 점선, mid=True면 칸 한가운데에 더 옅은 안내선(위끝 mid_hi, 비트 글자를 피한다)."""
    for k in range(n + 1):
        ax.plot([x0 + k * unit] * 2, [y_lo, y_hi], color=INK, lw=0.6, ls=(0, (1, 2)), zorder=0)
    if mid:
        top = y_hi if mid_hi is None else mid_hi
        for k in range(n):
            ax.plot([x0 + (k + 0.5) * unit] * 2, [y_lo, top], color=INK, lw=0.5, alpha=0.35, zorder=0)


def write_bits(ax, bits, y, color=INK, x0=0.0, unit=1.0, size=10, weight="normal"):
    for k, b in enumerate(bits):
        ax.text(x0 + (k + 0.5) * unit, y, b, ha="center", va="center", fontsize=size, color=color,
                fontweight=weight)


def row_label(ax, text, y, color=INK, x=-0.3, size=10):
    ax.text(x, y, text, ha="right", va="center", fontsize=size, color=color)


def shade(ax, xa, xb, y_lo, y_hi, color=HL, alpha=0.16):
    ax.add_patch(Rectangle((xa, y_lo), xb - xa, y_hi - y_lo, facecolor=color, edgecolor="none",
                           alpha=alpha, zorder=0.5))


def change_points(halves):
    """높이가 바뀌는 반 칸 번호 i (i번째 반 칸의 시작에서 바뀐다)."""
    return [i for i in range(1, len(halves)) if halves[i] != halves[i - 1]]


def flat_runs(halves):
    """(시작 반 칸, 길이) 목록. 높이가 그대로인 덩어리."""
    runs, start = [], 0
    for i in range(1, len(halves) + 1):
        if i == len(halves) or halves[i] != halves[i - 1]:
            runs.append((start, i - start))
            start = i
    return runs
# ---- 공통 도구 끝 ----


# ---- 인코딩 규칙 (2장-1 슬라이드 35·38·40) ----
TABLE = {
    "0000": "11110", "0001": "01001", "0010": "10100", "0011": "10101",
    "0100": "01010", "0101": "01011", "0110": "01110", "0111": "01111",
    "1000": "10010", "1001": "10011", "1010": "10110", "1011": "10111",
    "1100": "11010", "1101": "11011", "1110": "11100", "1111": "11101",
}


def nrz(bits):
    return [int(b) for b in bits for _ in range(2)]


def nrzi(bits, start=0):
    level, out = start, []
    for b in bits:
        out.append(level)
        if b == "1":
            level ^= 1
        out.append(level)
    return out


def manchester(bits):
    return [int(b) ^ c for b in bits for c in (0, 1)]


def encode(bits):
    return "".join(TABLE[bits[i:i + 4]] for i in range(0, len(bits), 4))


def decode_nrzi(levels):
    return "".join("1" if levels[i] != levels[i + 1] else "0" for i in range(0, len(levels), 2))


def decode_manchester(levels):
    return "".join(str(levels[i]) for i in range(0, len(levels), 2))


def draw(levels):
    return "".join("‾" if x else "_" for x in levels)


def parse(text):
    """'_‾ ‾_' 같은 반 칸 글자를 높이 목록으로."""
    return [1 if ch == "‾" else 0 for ch in text if ch in "_‾"]


def longest(halves):
    best = max(n for s, n in flat_runs(halves))
    return [(s, n) for s, n in flat_runs(halves) if n == best]


def mid_dots(ax, lv, y0, u=1.0):
    for i in change_points(lv):
        if i % 2 == 1:
            ax.plot([i * u / 2], [y0 + H / 2], "o", ms=6, color=HL, zorder=5)
        else:
            ax.plot([i * u / 2], [y0 + H / 2], "o", ms=6, mfc="none", mec=INK, mew=1.3, zorder=5)


def wave_rows(rows, bits, k, decode=None, front=False, width=None):
    """rows: (이름, 반 칸 높이, 색). bits가 있으면 위에 적는다.
    decode: 줄마다 읽은 비트(같은 순서). front=True면 맨체스터 줄의 앞 절반을 칠한다."""
    n = len(rows[0][1]) // 2
    G = 1.35 if decode else 1.15
    fig, ax = plt.subplots(figsize=(width or (1.6 + 0.85 * n), 0.75 + G * len(rows)))
    ax.axis("off")
    top = G * (len(rows) - 1) + H
    draw_grid(ax, n, -0.5 if decode else -0.15, top + (0.55 if bits else 0.2))
    if bits:
        write_bits(ax, bits, top + 0.38, size=11)
        row_label(ax, "비트", top + 0.38)
    for r, (name, lv, col) in enumerate(rows):
        y0 = G * (len(rows) - 1 - r)
        if front and name.startswith("맨체스터"):
            for c in range(n):
                shade(ax, c, c + 0.5, y0 - 0.1, y0 + H + 0.1, color=col, alpha=0.14)
        for c in range(n):                     # 칸 한가운데 안내선은 파형 높이에만 (읽은 비트 글자를 피한다)
            ax.plot([c + 0.5] * 2, [y0 - 0.1, y0 + H + 0.1], color=INK, lw=0.5, alpha=0.35, zorder=0)
        draw_wave(ax, lv, y0, col)
        row_label(ax, name, y0 + H / 2, color=col)
        if not name.startswith("NRZ") or name.startswith("NRZI"):
            mid_dots(ax, lv, y0)
        if decode:
            for c, b in enumerate(decode[r]):
                ax.text(c + 0.5, y0 - 0.32, b, ha="center", va="center", fontsize=11, color=HL,
                        fontweight="bold")
            row_label(ax, "읽은 비트", y0 - 0.32, color=HL, size=8.5)
    ax.set_xlim(-1.5, n + 0.1)
    ax.set_ylim(-0.6 if decode else -0.25, top + (0.6 if bits else 0.25))
    save(fig, k)
    return fig


# ---- 그림 1: 문제 1, 1100의 NRZ, NRZI, 맨체스터 ----
P1 = "1100"
wave_rows([("NRZ", nrz(P1), C[0]), ("NRZI", nrzi(P1), C[3]), ("맨체스터", manchester(P1), C[2])], P1, 1)

# ---- 그림 2: 문제 2, 0110을 그리고 거꾸로 읽기 ----
P2 = "0110"
wave_rows([("NRZI", nrzi(P2), C[3]), ("맨체스터", manchester(P2), C[2])], P2, 2,
          decode=[decode_nrzi(nrzi(P2)), decode_manchester(manchester(P2))], front=True)

# ---- 그림 3: 문제 3, 101100을 NRZI(처음 높음)와 맨체스터로 ----
P3 = "101100"
wave_rows([("NRZI\n(처음 높음)", nrzi(P3, start=1), C[3]), ("맨체스터", manchester(P3), C[2])], P3, 3)

# ---- 그림 4: 문제 4, 0100 1101 -> 01010 11011 -> NRZI ----
P4 = "01001101"
C4 = encode(P4)
L4 = nrzi(C4)
fig, ax = plt.subplots(figsize=(6.6, 2.7))
ax.axis("off")
draw_grid(ax, len(C4), -0.15, H + 0.55)
write_bits(ax, C4, H + 0.36, color=C[4], size=11)
row_label(ax, "부호 비트", H + 0.36, color=C[4])
for k in range(2):
    ax.plot([5 * k + 0.1, 5 * k + 4.9], [H + 0.75] * 2, color=INK, lw=0.8)
    ax.text(5 * k + 2.5, H + 0.98, f"데이터 {P4[4 * k:4 * k + 4]} → {C4[5 * k:5 * k + 5]}", ha="center",
            va="center", fontsize=9.5)
ax.plot([5, 5], [-0.15, H + 0.85], color=INK, lw=1.1)
draw_wave(ax, L4, 0.0, C[4])
row_label(ax, "NRZI\n(처음 낮음)", H / 2, color=C[4])
for i in change_points(L4):
    ax.plot([i / 2], [H / 2], "o", ms=5, color=HL, zorder=5)
runs4 = longest(L4)
for s, n in runs4:
    shade(ax, s / 2 + 0.03, (s + n) / 2 - 0.03, -0.12, H + 0.12)
    ax.text((s + n / 2) / 2, -0.35, f"{n / 2:g}비트 폭", ha="center", va="center", fontsize=9, color=HL)
ax.text(5, -0.72, f"칠한 곳: 신호가 바뀌지 않는 가장 긴 구간 (반 칸 {runs4[0][1]}개, {len(runs4)}곳)",
        ha="center", va="center", fontsize=9, color=HL)
ax.set_xlim(-1.6, 10.1)
ax.set_ylim(-0.9, H + 1.15)
save(fig, 4)

# ---- 그림 5: 변형 문제 1, 0000 0000을 NRZ로 그냥 보낼 때와 4B/5B + NRZI로 보낼 때 (같은 시간축) ----
V1 = "00000000"
CV1 = encode(V1)
U = len(V1) / len(CV1)
A, B = nrz(V1), nrzi(CV1)
fig, ax = plt.subplots(figsize=(6.8, 3.3))
ax.axis("off")
YA, YB = 1.95, 0.0
draw_grid(ax, 8, YA - 0.15, YA + H + 0.5)
write_bits(ax, V1, YA + H + 0.32, color=C[0])
row_label(ax, "데이터", YA + H + 0.32, color=C[0], size=9)
draw_wave(ax, A, YA, C[0])
row_label(ax, "NRZ로\n그냥", YA + H / 2, color=C[0])
draw_grid(ax, len(CV1), YB - 0.15, YB + H + 0.5, unit=U)
write_bits(ax, CV1, YB + H + 0.32, color=C[4], unit=U, size=9.5)
row_label(ax, "부호", YB + H + 0.32, color=C[4], size=9)
draw_wave(ax, B, YB, C[4], unit=U)
row_label(ax, "4B/5B\n+ NRZI", YB + H / 2, color=C[4])
for i in change_points(B):
    ax.plot([i * U / 2], [YB + H / 2], "o", ms=4.5, color=HL, zorder=5)
(sa, na), = longest(A)
shade(ax, sa / 2, (sa + na) / 2, YA - 0.12, YA + H + 0.12)
ax.text(4, YA - 0.36, f"8비트 내내 낮음: {na / 2:g}비트 폭 동안 신호가 한 번도 안 바뀐다", ha="center",
        va="center", fontsize=9, color=HL)
(sb, nb), = longest(B)
shade(ax, sb * U / 2, (sb + nb) * U / 2, YB - 0.12, YB + H + 0.12)
ax.text((sb + nb / 2) * U / 2, YB - 0.36, f"부호 비트 {nb / 2:g}개 폭 (데이터 시간 {nb / 2 * U:.1f}비트)",
        ha="center", va="center", fontsize=9, color=HL)
ax.set_xlim(-1.6, 8.1)
ax.set_ylim(YB - 0.55, YA + H + 0.55)
save(fig, 5)

# ---- 그림 6: 변형 문제 2, 받은 반 칸 열을 맨체스터와 NRZI로 읽기 ----
RM = parse("_‾ ‾_ ‾_ _‾ _‾")
RN = parse("__ _‾ ‾_ __ _‾")
wave_rows([("맨체스터로\n받은 신호", RM, C[2]), ("NRZI로\n받은 신호", RN, C[3])], None, 6,
          decode=[decode_manchester(RM), decode_nrzi(RN)], front=True, width=6.0)


if __name__ == "__main__":
    # 문제 1 (문서의 답과 같은 글자)
    assert draw(nrz(P1)) == "‾‾‾‾____" and draw(nrzi(P1)) == "_‾‾_____" and draw(manchester(P1)) == "‾_‾__‾_‾"
    assert decode_nrzi(nrzi(P1)) == P1 and decode_manchester(manchester(P1)) == P1
    # 문제 2
    assert draw(nrzi(P2)) == "".join("__ _‾ ‾_ __".split()) and draw(manchester(P2)) == "".join("_‾ ‾_ ‾_ _‾".split())
    assert decode_nrzi(nrzi(P2)) == P2 and decode_manchester(manchester(P2)) == P2
    # 문제 3 (NRZI 처음 높음)
    assert draw(nrzi(P3, start=1)) == "".join("‾_ __ _‾ ‾_ __ __".split())
    assert draw(manchester(P3)) == "".join("‾_ _‾ ‾_ ‾_ _‾ _‾".split())
    assert [c for c in range(6) if nrzi(P3, 1)[2 * c] != nrzi(P3, 1)[2 * c + 1]] == [0, 2, 3]
    # 문제 4
    assert C4 == "0101011011" and draw(L4) == "".join("__ _‾ ‾‾ ‾_ __ _‾ ‾_ __ _‾ ‾_".split())
    assert draw(L4) == "___‾‾‾‾____‾‾____‾‾_"
    assert runs4 == [(3, 4), (7, 4), (13, 4)]       # 반 칸 4개 = 2비트 폭, 세 곳. 첫 곳은 2번째 칸 뒤 절반~4번째 칸 앞 절반
    # 변형 문제 1
    assert CV1 == "1111011110" and (sa, na) == (0, 16) and (sb, nb) == (7, 4) and abs(nb / 2 * U - 1.6) < 1e-12
    # 변형 문제 2
    assert decode_manchester(RM) == "01100" and decode_nrzi(RN) == "01101"
    print("ALL CHECKS PASSED")
```
{% endraw %}
