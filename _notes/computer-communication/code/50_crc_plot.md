---
layout: "note"
title: "50_crc_plot.py"
display_title: "50_crc_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "50"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/crc/"
parent_title: "CRC"
description: "컴퓨터 통신 · CRC 그림 생성 코드"
permalink: "/studies/computer-communication/code/50_crc_plot/"
---
{% raw %}
[CRC](/Hongs_Blog/studies/computer-communication/crc/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# CRC 문서의 그림을 만든다: 50_crc_fig1.svg (XOR 긴 나눗셈), fig2 (시프트 레지스터 회로), fig3 (박자별 레지스터 값)
# 실행: ~/.venvs/vault-plots/bin/python 50_crc_plot.py  (matplotlib, numpy 필요)
# 그림에 쓰는 값(몫, 창, 나머지, 레지스터 값)은 모두 아래 함수가 XOR 나눗셈 규칙으로 계산한다.
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.patches import Circle, FancyArrowPatch, Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "50_crc"
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


# ---------------------------------------------------------------- 계산

def xor_bits(a, b):
    return "".join("0" if x == y else "1" for x, y in zip(a, b))


def division_steps(dividend, divisor):
    """XOR 긴 나눗셈을 한 단계씩 기록한다.
    단계 i: 창 = 작업 문자열의 i..i+k 자리, 맨 앞이 1이면 젯수, 0이면 0…0과 XOR."""
    k = len(divisor) - 1
    r = dividend
    steps = []
    for i in range(len(dividend) - k):
        win = r[i:i + k + 1]
        use = divisor if win[0] == "1" else "0" * (k + 1)
        res = xor_bits(win, use)
        steps.append({"i": i, "win": win, "use": use, "res": res, "q": win[0]})
        r = r[:i] + res + r[i + k + 1:]
    quotient = "".join(s["q"] for s in steps)
    return steps, quotient, r[-k:]


def shift_register_trace(bits, divisor):
    """50_crc_impl.py의 shift_register와 같은 규칙. reg[0] = x0 칸.
    박자마다: fb = 직전 x2, x0 <- in XOR fb, x1 <- x0, x2 <- x1 XOR fb (C = 1101일 때)."""
    k = len(divisor) - 1
    taps = [int(divisor[::-1][i]) for i in range(k)]   # x^0..x^(k-1)의 계수
    reg = [0] * k
    rows = [{"t": 0, "b": None, "fb": None, "reg": reg[:]}]
    for t, b in enumerate(bits, start=1):
        fb = reg[-1]
        new = [0] * k
        new[0] = int(b) ^ (fb & taps[0])
        for i in range(1, k):
            new[i] = reg[i - 1] ^ (fb & taps[i])
        reg = new
        rows.append({"t": t, "b": b, "fb": fb, "reg": reg[:]})
    return rows


def read_reg(reg):
    """x2 x1 x0 순서(높은 차수부터)로 읽는다."""
    return "".join(str(v) for v in reversed(reg))


M, DIV = "10011010", "1101"
K = len(DIV) - 1
DIVIDEND = M + "0" * K
STEPS, QUOT, REM = division_steps(DIVIDEND, DIV)
TRACE = shift_register_trace(DIVIDEND, DIV)


# ---------------------------------------------------------------- 그림 도우미

BW, BH, RS = 0.84, 0.6, 0.78          # 상자 폭, 상자 높이, 줄 간격


def box(ax, x, y, bit, edge=INK, fill="none", alpha=0.0, text=INK, ls="-", lw=0.9, bold=False, fs=10):
    if fill != "none":
        ax.add_patch(Rectangle((x - BW / 2, y - BH / 2), BW, BH, facecolor=fill, alpha=alpha, edgecolor="none"))
    ax.add_patch(Rectangle((x - BW / 2, y - BH / 2), BW, BH, facecolor="none", edgecolor=edge, lw=lw, ls=ls))
    ax.text(x, y, bit, ha="center", va="center", fontsize=fs, color=text, fontweight="bold" if bold else "normal")


def bracket(ax, x0, x1, y, label, color):
    ax.plot([x0, x0, x1, x1], [y - 0.12, y, y, y - 0.12], color=color, lw=0.9)
    ax.text((x0 + x1) / 2, y + 0.1, label, ha="center", va="bottom", fontsize=9, color=color)


def draw_division(ax, dividend, divisor, segments, rem_label, mark=None, mark_label=None):
    """긴 나눗셈 그림. segments = [(시작 열, 끝 열, 라벨, 색, 칠할지)], mark = 따로 표시할 열."""
    k = len(divisor) - 1
    n = len(dividend)
    steps, quotient, rem = division_steps(dividend, divisor)
    y_q, y_d = RS, 0.0
    # 머리 괄호와 몫
    for s0, s1, lab, col, _ in segments:
        bracket(ax, s0 - 0.42, s1 + 0.42, y_q + 0.55, lab, col)
    ax.text(-1.0, y_q, "몫", ha="right", va="center", fontsize=9)
    for s in steps:
        ax.text(s["i"], y_q, s["q"], ha="center", va="center", fontsize=10, fontweight="bold")
    # 나눌 수
    shade = {}
    for s0, s1, lab, col, fill in segments:
        for c in range(s0, s1 + 1):
            shade[c] = (col, fill)
    for c, b in enumerate(dividend):
        col, fill = shade[c]
        box(ax, c, y_d, b, edge=col, fill=col if fill else "none", alpha=0.28 if fill else 0)
    green = "초록 점선: 그 자리 비트를 아래로 내린다"
    if mark is not None:
        ax.add_patch(Rectangle((mark - BW / 2 - 0.07, y_d - BH / 2 - 0.07), BW + 0.14, BH + 0.14,
                               facecolor="none", edgecolor=C[3], lw=1.6))
        ax.text(n + 0.3, y_d, mark_label, ha="left", va="center", fontsize=9, color=C[3])
        ax.text(n + 0.3, y_q, green, ha="left", va="center", fontsize=9, color=C[2])
    else:
        ax.text(n + 0.3, y_d, green, ha="left", va="center", fontsize=9, color=C[2])
    # 단계별 줄
    for s in steps:
        i = s["i"]
        y_c = y_d - (2 * i + 1) * RS
        y_r = y_d - (2 * i + 2) * RS
        skip = s["q"] == "0"
        for j, b in enumerate(s["use"]):
            if skip:
                box(ax, i + j, y_c, b, edge=INK, text=INK, ls=(0, (2, 2)), lw=0.7)
            else:
                box(ax, i + j, y_c, b, edge=C[1], text=C[1])
        ax.text(i - 0.62, y_c, r"$\oplus$", ha="right", va="center", fontsize=11, color=INK if skip else C[1])
        ax.plot([i - 0.5, i + k + 0.5], [y_c - BH / 2 - 0.05] * 2, color=INK, lw=0.8)
        if skip:
            note = f"{i + 1}단계: 맨 앞 0 → 건너뜀 ({'0' * (k + 1)}과 XOR), 몫 0"
        else:
            note = f"{i + 1}단계: 맨 앞 1 → {divisor}과 XOR, 몫 1"
        ax.text(n + 0.3, y_c, note, ha="left", va="center", fontsize=9, color=INK if skip else C[1])
        # 결과: 맨 앞 0은 떨어져 나가므로 옅게, 나머지 k비트는 상자로
        ax.text(i, y_r, s["res"][0], ha="center", va="center", fontsize=10, color=INK, alpha=0.35)
        last = i == len(steps) - 1
        for j in range(1, k + 1):
            if last:
                box(ax, i + j, y_r, s["res"][j], edge=C[3], fill=C[3], alpha=0.3, text=C[3], lw=1.6, bold=True)
            else:
                box(ax, i + j, y_r, s["res"][j])
        if i == 0:
            ax.text(n + 0.3, y_r, "옅은 0: XOR로 지워진 맨 앞자리", ha="left", va="center", fontsize=9, alpha=0.75)
        elif i == 1:
            ax.text(n + 0.3, y_r, "회색 칸 + 초록 칸 = 다음 단계의 창", ha="left", va="center", fontsize=9,
                    alpha=0.75)
        if not last:
            c = i + k + 1
            box(ax, c, y_r, dividend[c], edge=C[2], text=C[2])
            ax.add_patch(FancyArrowPatch((c, y_d - BH / 2 - 0.02), (c, y_r + BH / 2 + 0.02),
                                         arrowstyle="-|>", mutation_scale=8, color=C[2], lw=0.8, ls=(0, (3, 2))))
        else:
            ax.text(n + 0.3, y_r, rem_label, ha="left", va="center", fontsize=10, color=C[3], fontweight="bold")
    ax.set_xlim(-1.6, n + 9.6)
    ax.set_ylim(y_d - (2 * len(steps) + 0.7) * RS, y_q + 1.25)
    ax.set_aspect("equal")
    ax.axis("off")
    return steps, quotient, rem


# 그림 1: 10011010 000 ÷ 1101 의 XOR 긴 나눗셈
fig, ax = plt.subplots(figsize=(6.8, 4.6))
fig.subplots_adjust(left=0, right=1, bottom=0, top=1)
draw_division(ax, DIVIDEND, DIV,
              [(0, len(M) - 1, f"메시지 M ({len(M)}비트)", C[0], False),
               (len(M), len(DIVIDEND) - 1, f"붙인 0 ({K}개)", C[4], True)],
              f"나머지 F = {REM}")
save(fig, 1)


# 그림 2: C = 1101의 시프트 레지스터 회로 (슬라이드 56과 같은 배치)
def xor_gate(ax, x, y, r=0.27):
    ax.add_patch(Circle((x, y), r, facecolor="none", edgecolor=C[1], lw=1.4))
    ax.plot([x - r, x + r], [y, y], color=C[1], lw=1.2)
    ax.plot([x, x], [y - r, y + r], color=C[1], lw=1.2)


def arrow(ax, p, q, color=INK, lw=1.2):
    ax.add_patch(FancyArrowPatch(p, q, arrowstyle="-|>", mutation_scale=11, color=color, lw=lw,
                                 shrinkA=0, shrinkB=0))


fig, ax = plt.subplots(figsize=(6.8, 2.85))
fig.subplots_adjust(left=0, right=1, bottom=0, top=1)
XG0, XG2 = 1.0, 6.0                       # XOR 위치
BOX = {"x0": 2.5, "x1": 4.5, "x2": 7.5}   # 래치 칸 가운데
R, HB = 0.27, 0.42                         # XOR 반지름, 칸 반높이
YFB, YTX, NODE = -1.55, 1.55, 8.75         # 되먹임 선 높이, 전송 선 높이, 되먹임이 갈라지는 점
# 래치 칸
for name, x in BOX.items():
    ax.add_patch(Rectangle((x - 0.5, -HB), 1.0, 2 * HB, facecolor=C[0], alpha=0.12, edgecolor="none"))
    ax.add_patch(Rectangle((x - 0.5, -HB), 1.0, 2 * HB, facecolor="none", edgecolor=C[0], lw=1.4))
    ax.text(x, 0, name, ha="center", va="center", fontsize=11, color=C[0])
    ax.text(x, HB + 0.14, f"$x^{name[1]}$ 칸", ha="center", va="bottom", fontsize=9.5, color=C[0])
xor_gate(ax, XG0, 0)
xor_gate(ax, XG2, 0)
ax.text(XG0 - R - 0.12, 0.02, "XOR", ha="right", va="center", fontsize=9, color=C[1])
ax.text(XG2, R + 0.14, "XOR", ha="center", va="bottom", fontsize=9, color=C[1])
# 입력과 전송
ax.text(XG0, YTX + 0.55, "in (메시지 비트, 박자마다 하나)", ha="center", va="bottom", fontsize=9.5)
arrow(ax, (XG0, YTX + 0.5), (XG0, R))
ax.plot(XG0, YTX, "o", color=INK, ms=3.5)
arrow(ax, (XG0, YTX), (10.2, YTX))
ax.text(10.2, YTX + 0.12, "그대로 전송", ha="right", va="bottom", fontsize=9)
# 칸 사이의 선
arrow(ax, (XG0 + R, 0), (BOX["x0"] - 0.5, 0))
arrow(ax, (BOX["x0"] + 0.5, 0), (BOX["x1"] - 0.5, 0))
arrow(ax, (BOX["x1"] + 0.5, 0), (XG2 - R, 0))
arrow(ax, (XG2 + R, 0), (BOX["x2"] - 0.5, 0))
# 되먹임: x2의 출력이 아래 선을 타고 두 XOR로
ax.plot([BOX["x2"] + 0.5, NODE, NODE, XG0], [0, 0, YFB, YFB], color=C[1], lw=1.3)
ax.plot(NODE, 0, "o", color=C[1], ms=3.5)
ax.plot(XG2, YFB, "o", color=C[1], ms=3.5)
arrow(ax, (XG0, YFB), (XG0, -R), color=C[1], lw=1.3)
arrow(ax, (XG2, YFB), (XG2, -R), color=C[1], lw=1.3)
ax.text((XG0 + NODE) / 2, YFB - 0.12, "되먹임: 방금 전 x2 값 (C의 맨 앞 1, $x^3$ 자리)",
        ha="center", va="top", fontsize=9, color=C[1])
# C의 계수와 XOR 자리
ax.text(XG0 + 0.12, -0.72, "$x^0$ 계수 1", ha="left", va="center", fontsize=9, color=C[1])
ax.text((BOX["x0"] + BOX["x1"]) / 2, -0.72, "$x^1$ 계수 0: XOR 없음", ha="center", va="center", fontsize=9)
ax.text(XG2 + 0.12, -0.72, "$x^2$ 계수 1", ha="left", va="center", fontsize=9, color=C[1])
# 결과
ax.text(NODE + 0.25, -0.55, "11비트를 다 넣은 뒤\nx2 x1 x0을 읽은 값\n= CRC (나머지)", ha="left", va="center",
        fontsize=9, color=C[3], linespacing=1.4)
ax.set_xlim(-0.6, 11.2)
ax.set_ylim(YFB - 0.55, YTX + 1.0)
ax.set_aspect("equal")
ax.axis("off")
save(fig, 2)


# 그림 3: 11비트를 밀어 넣는 동안 박자마다 레지스터에 든 값
fig, ax = plt.subplots(figsize=(6.6, 6.0))
fig.subplots_adjust(left=0, right=1, bottom=0, top=1)
CW, CH = 1.0, 0.62
COLS = {"t": -0.9, "b": 1.25, "fb": 2.65, "x0": 4.05, "x1": 5.05, "x2": 6.05, "rd": 7.55, "st": 9.35}
HEAD = {"t": "박자", "b": "들어온\n비트", "fb": "되먹임\n(직전 x2)", "x0": "x0", "x1": "x1", "x2": "x2",
        "rd": "x2 x1 x0\n순서로 읽기", "st": "그림 1에서\n같은 값"}
y_head = 0.95
for key, x in COLS.items():
    ax.text(x, y_head, HEAD[key], ha="center", va="center", fontsize=9.5, linespacing=1.2,
            color=C[0] if key in ("x0", "x1", "x2") else INK)
for row in TRACE:
    t = row["t"]
    y = -t * CH * 1.12
    final = t == len(DIVIDEND)
    ax.text(COLS["t"], y, "처음" if t == 0 else str(t), ha="center", va="center", fontsize=9.5)
    if row["b"] is not None:
        zero_tail = t > len(M)
        col = C[4] if zero_tail else C[0]
        ax.add_patch(Rectangle((COLS["b"] - 0.36, y - CH / 2 + 0.04), 0.72, CH - 0.08,
                               facecolor=col if zero_tail else "none", alpha=0.28 if zero_tail else 1,
                               edgecolor="none"))
        ax.add_patch(Rectangle((COLS["b"] - 0.36, y - CH / 2 + 0.04), 0.72, CH - 0.08,
                               facecolor="none", edgecolor=col, lw=0.8))
        ax.text(COLS["b"], y, row["b"], ha="center", va="center", fontsize=10, color=col)
        fb = row["fb"]
        ax.add_patch(Rectangle((COLS["fb"] - 0.36, y - CH / 2 + 0.04), 0.72, CH - 0.08,
                               facecolor=C[1] if fb else "none", alpha=0.3 if fb else 0, edgecolor="none"))
        ax.add_patch(Rectangle((COLS["fb"] - 0.36, y - CH / 2 + 0.04), 0.72, CH - 0.08,
                               facecolor="none", edgecolor=C[1] if fb else INK, lw=0.8 if fb else 0.5))
        ax.text(COLS["fb"], y, str(fb), ha="center", va="center", fontsize=10, color=C[1] if fb else INK)
    for name, v in zip(("x0", "x1", "x2"), row["reg"]):
        x = COLS[name]
        ax.add_patch(Rectangle((x - CW / 2, y - CH / 2), CW, CH, facecolor=C[0] if v else "none",
                               alpha=0.45 if v else 0, edgecolor="none"))
        ax.add_patch(Rectangle((x - CW / 2, y - CH / 2), CW, CH, facecolor="none", edgecolor=INK, lw=0.6))
        ax.text(x, y, str(v), ha="center", va="center", fontsize=10.5, fontweight="bold" if v else "normal")
    ax.text(COLS["rd"], y, " ".join(read_reg(row["reg"])), ha="center", va="center", fontsize=10,
            color=C[3] if final else INK, fontweight="bold" if final else "normal")
    if 1 <= t <= K:
        ax.text(COLS["st"], y, "채우는 중", ha="center", va="center", fontsize=9)
    elif t > K:
        lab = f"{t - K}단계 결과" + (" = 나머지" if final else "")
        ax.text(COLS["st"], y, lab, ha="center", va="center", fontsize=9,
                color=C[3] if final else INK, fontweight="bold" if final else "normal")
    if final:
        ax.add_patch(Rectangle((COLS["x0"] - CW / 2 - 0.06, y - CH / 2 - 0.06), 3 * CW + 0.12, CH + 0.12,
                               facecolor="none", edgecolor=C[3], lw=1.8))
# 되먹임 열의 4~11박자 = 몫
ys = [-t * CH * 1.12 for t in (K + 1, len(DIVIDEND))]
xb = COLS["fb"] - 0.62
ax.plot([xb + 0.12, xb, xb, xb + 0.12], [ys[0] + 0.25, ys[0] + 0.25, ys[1] - 0.25, ys[1] - 0.25],
        color=C[1], lw=0.9)
fb_q = "".join(str(r["fb"]) for r in TRACE[K + 1:])
y_bot = ys[1] - CH / 2 - 0.25
ax.text(COLS["fb"], y_bot, f"4~11박자의 되먹임\n{' '.join(fb_q)}\n= 그림 1의 몫", ha="center", va="top", fontsize=9,
        color=C[1], linespacing=1.3)
# 붙인 0 표시
yz = [-t * CH * 1.12 for t in (len(M) + 1, len(DIVIDEND))]
xz = COLS["b"] - 0.5
ax.plot([xz + 0.1, xz, xz, xz + 0.1], [yz[0] + 0.25, yz[0] + 0.25, yz[1] - 0.25, yz[1] - 0.25], color=C[4], lw=0.9)
ax.text(xz - 0.08, (yz[0] + yz[1]) / 2, "붙인 0", ha="right", va="center", fontsize=8.5, color=C[4])
ax.set_xlim(-1.5, 10.6)
ax.set_ylim(y_bot - 1.35, y_head + 0.5)
ax.set_aspect("equal")
ax.axis("off")
save(fig, 3)


if __name__ == "__main__":
    # 그림 1과 문서의 나눗셈: 몫 11111001, 나머지 101, 창 순서, 건너뛰는 단계는 6·7단계
    assert (QUOT, REM) == ("11111001", "101")
    assert [s["win"] for s in STEPS] == ["1001", "1001", "1000", "1011", "1100", "0010", "0100", "1000"]
    assert [s["i"] + 1 for s in STEPS if s["q"] == "0"] == [6, 7]
    assert all(s["res"][0] == "0" for s in STEPS)                  # XOR 뒤 맨 앞은 늘 0
    assert STEPS[0]["res"] == "0100" and STEPS[4]["res"] == "0001" and STEPS[7]["res"] == "0101"
    # 보통 뺄셈과 XOR의 차이
    assert format(0b1000 - 0b0001, "04b") == "0111" and xor_bits("1000", "0001") == "1001"
    assert xor_bits("1011", "0110") == "1101" and xor_bits("1101", "0110") == "1011"
    # 다항식: 1101 → x^3 + x^2 + 1, M → x^7 + x^4 + x^3 + x, x^3 M → x^10 + x^7 + x^6 + x^4
    exps = lambda s: [len(s) - 1 - i for i, b in enumerate(s) if b == "1"]
    assert exps(DIV) == [3, 2, 0] and exps(M) == [7, 4, 3, 1] and exps(DIVIDEND) == [10, 7, 6, 4]
    # (x^3 + x^2 + 1) + (x^2 + x) = x^3 + x + 1
    assert exps(xor_bits("1101", "0110")) == [3, 1, 0]
    # 나머지를 붙인 프레임과 다시 나누기
    P = xor_bits(DIVIDEND, "0" * len(M) + REM)
    assert P == "10011010101" and P == M + REM
    steps2, q2, r2 = division_steps(P, DIV)
    assert r2 == "000" and q2 == QUOT and steps2[-1]["win"] == "1101"
    assert [s["win"][0] for s in steps2] == [s["win"][0] for s in STEPS]
    # 10진 비유
    assert 11 * 301 == 3311 and 331 % 11 == 1 and 3310 % 11 == 10
    assert [n % 11 for n in (3311, 3310, 2311, 2211)] == [0, 10, 1, 0]
    assert 2311 == 11 * 210 + 1 and 2211 == 11 * 201 and 3311 - 2211 == 1100 == 11 * 100
    assert 210 % 11 == 1                                             # 21을 보내려면 10을 붙여야 함
    assert 3310 % 10 == 0 and 2310 % 10 == 0                        # 젯수 10은 앞자리 오류를 못 잡음
    # 받는 쪽: 다섯째 비트가 바뀐 프레임 → 나머지 110, 오류 모양만 나눠도 110
    bad = P[:4] + ("1" if P[4] == "0" else "0") + P[5:]
    assert bad == "10010010101" and division_steps(bad, DIV)[2] == "110"
    assert division_steps("00001000000", DIV)[2] == "110"
    # 1비트 오류는 11자리 어디에 생겨도 나머지가 000이 아니다
    for i in range(len(P)):
        assert division_steps(P[:i] + ("1" if P[i] == "0" else "0") + P[i + 1:], DIV)[2] != "000"
    # 놓치는 오류: C를 옮긴 모양
    assert division_steps(xor_bits(P, "00000001101"), DIV)[2] == "000"
    # 그림 2·3: 시프트 레지스터 (50_crc_impl.py의 shift_register와 같은 규칙)
    final = TRACE[-1]["reg"]
    assert final == [1, 0, 1] and read_reg(final) == REM
    assert [read_reg(r["reg"]) for r in TRACE[1:]] == \
        ["001", "010", "100", "100", "100", "101", "110", "001", "010", "100", "101"]
    for t in range(1, len(DIVIDEND) + 1):                          # 레지스터 = 지금까지 넣은 비트의 나머지
        pre = DIVIDEND[:t]
        want = division_steps(pre, DIV)[2] if t > K else pre.rjust(K, "0")
        assert read_reg(TRACE[t]["reg"]) == want
    assert fb_q == QUOT                                              # 4~11박자의 되먹임이 몫
    assert TRACE[7]["reg"] == [0, 1, 1] and read_reg(TRACE[7]["reg"]) == "110" == STEPS[3]["res"][1:]
    assert STEPS[3]["res"] == "0110" and STEPS[2]["res"] == "0101"
    assert read_reg(TRACE[K]["reg"]) == "100"                       # 3박자 뒤 = 메시지 앞 세 비트
    assert read_reg(TRACE[len(M)]["reg"]) == division_steps(M, DIV)[2] == "001"   # 8박자에서 멈추면 M의 나머지
    assert TRACE[3]["reg"] == [0, 0, 1] and TRACE[4]["b"] == "1" and TRACE[4]["fb"] == 1 and TRACE[4]["reg"] == [0, 0, 1]
    assert [r["fb"] for r in TRACE[1:K + 1]] == [0, 0, 0] and TRACE[9]["fb"] == TRACE[10]["fb"] == 0
    for i, s in enumerate(STEPS):                                   # (i+4)박자 = 그림 1의 (i+1)단계 결과
        assert read_reg(TRACE[i + K + 1]["reg"]) == s["res"][1:]
    # CRC-16 젯수는 17비트, CRC-32를 1500바이트에 붙이면 0.3% 미만
    crc16 = sum(1 << e for e in (16, 15, 2, 0))
    assert format(crc16, "b") == "11000000000000101" and len(format(crc16, "b")) == 17
    assert 1500 * 8 == 12000 and 32 / 12000 < 0.003
    print("ALL CHECKS PASSED")
```
{% endraw %}
