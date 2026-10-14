---
layout: "note"
title: "50_crc-ladder_plot.py"
display_title: "50_crc-ladder_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "50"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/crc-ladder/"
parent_title: "CRC 예제 사다리"
description: "컴퓨터 통신 · CRC 예제 사다리 그림 생성 코드"
permalink: "/studies/computer-communication/code/50_crc-ladder_plot/"
---
{% raw %}
[CRC 예제 사다리](/Hongs_Blog/studies/computer-communication/crc-ladder/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# CRC 예제 사다리의 그림을 만든다: 50_crc-ladder_fig1.svg (문제 2), fig2 (문제 3), fig3 (문제 4 (a) 받는 쪽 점검)
# 실행: ~/.venvs/vault-plots/bin/python 50_crc-ladder_plot.py  (matplotlib, numpy 필요)
# 나눗셈 그림 도우미는 3.개념집/50_crc_plot.py에서 복사했다(파일끼리 import하지 않는다).
# 그림에 쓰는 몫, 창, 나머지는 모두 아래 함수가 XOR 나눗셈 규칙으로 계산한다.
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.patches import FancyArrowPatch, Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "50_crc-ladder"
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


def figure(k, dividend, divisor, segments, rem_label, height, mark=None, mark_label=None):
    fig, ax = plt.subplots(figsize=(6.8, height))
    fig.subplots_adjust(left=0, right=1, bottom=0, top=1)
    out = draw_division(ax, dividend, divisor, segments, rem_label, mark, mark_label)
    save(fig, k)
    return out


# 그림 1: 문제 2, M = 110101, C = 1011
M2, C2 = "110101", "1011"
S2, Q2, R2 = figure(1, M2 + "000", C2,
                    [(0, 5, "메시지 M (6비트)", C[0], False), (6, 8, "붙인 0 (3개)", C[4], True)],
                    "나머지 F = " + division_steps(M2 + "000", C2)[2], 3.9)

# 그림 2: 문제 3, M = 101110, C = 10011
M3, C3 = "101110", "10011"
S3, Q3, R3 = figure(2, M3 + "0000", C3,
                    [(0, 5, "메시지 M (6비트)", C[0], False), (6, 9, "붙인 0 (4개)", C[4], True)],
                    "나머지 F = " + division_steps(M3 + "0000", C3)[2], 3.9)

# 그림 3: 문제 4 (a), 받은 프레임 10011010 111을 C = 1101로 나눈다
SENT, GOT, C4 = "10011010101", "10011010111", "1101"
FLIP = [i for i in range(len(SENT)) if SENT[i] != GOT[i]]
R4 = division_steps(GOT, C4)[2]
S4, Q4, _ = figure(3, GOT, C4,
                   [(0, 7, "받은 데이터 부분 (8비트)", C[0], False), (8, 10, "받은 CRC (3비트)", C[4], True)],
                   f"나머지 {R4}: 000이 아니다 → 오류", 4.6, mark=FLIP[0],
                   mark_label="보라 테두리: 보낸 프레임과 다른 비트")


if __name__ == "__main__":
    # 문제 2: 나머지 111, 창 순서, 5단계는 건너뜀, 프레임 110101 111
    assert R2 == "111" and M2 + R2 == "110101111"
    assert [s["win"] for s in S2] == ["1101", "1100", "1111", "1000", "0110", "1100"]
    assert [s["i"] + 1 for s in S2 if s["q"] == "0"] == [5]
    assert S2[-1]["res"] == "0111" and Q2 == "111101"
    assert division_steps(M2 + R2, C2)[2] == "000"
    # 문제 3: 나머지 1011, 창 순서, 2·4·5단계는 건너뜀, 받는 쪽 점검 0000
    assert R3 == "1011" and M3 + R3 == "1011101011"
    assert [s["win"] for s in S3] == ["10111", "01000", "10000", "00110", "01100", "11000"]
    assert [s["i"] + 1 for s in S3 if s["q"] == "0"] == [2, 4, 5]
    assert S3[0]["res"] == "00100" and S3[2]["res"] == "00011" and S3[-1]["res"] == "01011"
    assert division_steps(M3 + R3, C3)[2] == "0000" and Q3 == "101001"
    # 문제 4 (a): 바뀐 비트는 왼쪽에서 10번째(끝에서 둘째) 하나, 나머지 010
    assert FLIP == [9] and R4 == "010"
    assert [s["win"] for s in S4] == ["1001", "1001", "1000", "1011", "1100", "0011", "0111", "1111"]
    assert S4[-1]["res"] == "0010" and Q4 == "11111001"
    # 보낸 프레임이었다면 7단계 창 0110, 8단계 창 1101 → 나머지 000
    sent_steps, _, sent_rem = division_steps(SENT, C4)
    assert sent_rem == "000" and [s["win"] for s in sent_steps][6:] == ["0110", "1101"]
    assert [s["win"] for s in sent_steps][:6] == [s["win"] for s in S4][:6]      # 1~6단계 창은 같다
    assert FLIP[0] - (len(C4) - 1) + 1 == 7                                     # 바뀐 비트는 6단계 뒤에 내려와 7단계 창에 들어간다
    # 오류 모양 00000000010만 나눠도 같은 나머지 010
    assert division_steps("00000000010", C4)[2] == "010"
    print("ALL CHECKS PASSED")
```
{% endraw %}
