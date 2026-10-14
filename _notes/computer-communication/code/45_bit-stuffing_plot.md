---
layout: "note"
title: "45_bit-stuffing_plot.py"
display_title: "45_bit-stuffing_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "45"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/bit-stuffing/"
parent_title: "비트 채우기"
description: "컴퓨터 통신 · 비트 채우기 그림 생성 코드"
permalink: "/studies/computer-communication/code/45_bit-stuffing_plot/"
---
{% raw %}
[비트 채우기](/Hongs_Blog/studies/computer-communication/bit-stuffing/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 비트 채우기 문서의 그림을 만든다: 45_bit-stuffing_fig1.svg, fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 45_bit-stuffing_plot.py  (matplotlib, numpy 필요)
# 비트는 '0'/'1' 문자열. 그림의 비트열은 모두 아래 규칙 함수로 계산해서 그린다.
import os
import random

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import FancyArrowPatch, Polygon, Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "45_bit-stuffing"
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


# ---------------------------------------------------------------- 규칙 (45_bit-stuffing_impl.py와 같은 규칙)
FLAG = "01111110"


def stuff_trace(bits):
    """보내는 쪽. 돌려주는 값: (채운 비트, 끼운 0의 자리들, 본문 비트 k가 놓인 자리, 본문 비트마다 카운터 값)."""
    out, ins, pos, runs, run = [], [], [], [], 0
    for b in bits:
        pos.append(len(out)); out.append(b)
        run = run + 1 if b == "1" else 0
        runs.append(run)
        if run == 5:
            ins.append(len(out)); out.append("0"); run = 0
    return "".join(out), ins, pos, runs


def stuff(bits):
    return stuff_trace(bits)[0]


def receive_trace(body):
    """받는 쪽. 첫 깃발 뒤의 비트열을 읽는다. 비트마다 표시: 카운터 값(int), 'del'(지운 0), 'end'(깃발의 마지막 두 비트)."""
    marks, out, run, i = [], [], 0, 0
    while True:
        b = body[i]
        out.append(b); run = run + 1 if b == "1" else 0
        marks.append(run)
        if run == 5:
            if body[i + 1] == "0":
                marks.append("del"); i += 2; run = 0; continue
            if body[i + 1:i + 3] == "10":
                marks += ["end", "end"]
                return "".join(out)[:-6], marks
            raise ValueError("오류")
        i += 1


MSG = "0111111111110"                                       # 1이 11개 이어진다 (카드 C2의 01111110과 다르다)
STUFFED, INS, POS, RUNS = stuff_trace(MSG)
FRAME = FLAG + STUFFED + FLAG
GOT, RMARKS = receive_trace(STUFFED + FLAG)


# ---------------------------------------------------------------- 그리기 도구
def cell(ax, x, y, t, fc=None, alpha=0.0, ec=INK, color=INK, bold=False, w=0.86, h=0.86, fs=10):
    if fc is not None:
        ax.add_patch(Rectangle((x - w / 2, y - h / 2), w, h, facecolor=fc, alpha=alpha, edgecolor="none"))
    ax.add_patch(Rectangle((x - w / 2, y - h / 2), w, h, facecolor="none", edgecolor=ec, lw=0.8))
    ax.text(x, y, t, ha="center", va="center", fontsize=fs, color=color, fontweight="bold" if bold else "normal")


def bracket(ax, x0, x1, y, text, color=INK, up=True, fs=9, tick=0.18):
    d = tick if up else -tick
    ax.plot([x0, x0, x1, x1], [y - d, y, y, y - d], color=color, lw=0.9)
    ax.text((x0 + x1) / 2, y + (0.12 if up else -0.12), text, ha="center", va="bottom" if up else "top",
            fontsize=fs, color=color)


# ---------------------------------------------------------------- 그림 1: HDLC 프레임 막대
FIELDS = [("깃발", 8, "8", "flag"), ("Header", 16, "16", "plain"), ("Body", 40, "", "body"),
          ("CRC", 16, "16", "crc"), ("깃발", 8, "8", "flag")]
fig, ax = plt.subplots(figsize=(6.6, 2.4))
h, y, x = 1.0, 0.0, 0.0
span = {}
for k, (name, w, bits, st) in enumerate(FIELDS):
    top = y + h
    if st == "body":
        m, g = x + w / 2, 1.2
        zig = [(m - 1.0, y), (m + 0.6, y + 0.45 * h), (m - 0.6, y + 0.55 * h), (m + 1.0, top)]
        left = [(x, y)] + zig + [(x, top)]
        right = [(zig[0][0] + g, y)] + [(px + g, py) for px, py in zig] + [(x + w, top), (x + w, y)]
        for poly in (left, right):
            ax.add_patch(Polygon(poly, closed=True, facecolor=INK, alpha=0.18, edgecolor="none"))
            ax.add_patch(Polygon(poly, closed=True, facecolor="none", edgecolor=INK, lw=0.9))
        ax.text(x + w * 0.24, y + h / 2, name, ha="center", va="center", fontsize=10)
        ax.text(m + g / 2, top + 0.22, "길이가 정해지지 않음", ha="center", va="bottom", fontsize=8.5)
    else:
        fc = {"flag": C[0], "crc": C[2]}.get(st)
        if fc:
            ax.add_patch(Rectangle((x, y), w, h, facecolor=fc, alpha=0.22, edgecolor="none"))
        ax.add_patch(Rectangle((x, y), w, h, facecolor="none", edgecolor=INK, lw=0.9))
        if st == "flag":
            ax.text(x + w / 2, y + h / 2, FLAG, ha="center", va="center", fontsize=8.5, color=C[0])
            ax.text(x + w / 2, y - 0.2, "깃발", ha="center", va="top", fontsize=9, color=C[0])
        else:
            ax.text(x + w / 2, y + h / 2, name, ha="center", va="center", fontsize=10)
        ax.text(x + w / 2, top + 0.22, bits, ha="center", va="bottom", fontsize=9.5)
    span[k] = (x, x + w)
    x += w
bracket(ax, span[1][0] + 0.3, span[3][1] - 0.3, y - 0.25, "깃발 사이의 비트 전부(Header, Body, CRC)에 비트 채우기를 한다",
        up=False, color=C[1])
ax.set_xlim(-1, x + 1)
ax.set_ylim(-1.3, 1.9)
ax.axis("off")
save(fig, 1)
FIXED = [w for _, w, bits, _ in FIELDS if bits]


# ---------------------------------------------------------------- 그림 2: 0111111111110 채우기와 받는 쪽 카운터
NF = len(FLAG)
fig, ax = plt.subplots(figsize=(7.0, 4.3))
LBL = -NF - 0.8
Y1, Y2, Y3, Y4, Y5 = 5.2, 4.25, 3.0, 1.4, 0.45
ax.text(LBL, Y1, "본문", ha="right", va="center", fontsize=9)
ax.text(LBL, Y2, "이어진 1의 수", ha="right", va="center", fontsize=9)
ax.text(LBL, Y3, "채운 비트", ha="right", va="center", fontsize=9)
ax.text(LBL, Y4, "보내는 비트", ha="right", va="center", fontsize=9)
ax.text(LBL, Y5, "받는 쪽 카운터", ha="right", va="center", fontsize=9)
# 1줄: 본문 비트(끼울 자리는 비움)
for k, b in enumerate(MSG):
    cell(ax, POS[k], Y1, b)
for j in INS:
    ax.text(j, Y1, "+0", ha="center", va="center", fontsize=8.5, color=C[1])
# 2줄: 보내는 쪽 카운터
for k, r in enumerate(RUNS):
    hot = r == 5
    ax.text(POS[k], Y2, str(r), ha="center", va="center", fontsize=9.5, color=C[1] if hot else INK,
            fontweight="bold" if hot else "normal")
# 3줄: 채운 비트
for j, b in enumerate(STUFFED):
    if j in INS:
        cell(ax, j, Y3, b, fc=C[1], alpha=0.3, ec=C[1], color=C[1], bold=True)
    else:
        cell(ax, j, Y3, b)
for j in INS:                                                # 카운터 5 → 바로 다음 칸에 0
    ax.add_patch(FancyArrowPatch((j - 1 + 0.15, Y2 - 0.25), (j - 0.05, Y3 + 0.47), arrowstyle="-|>", mutation_scale=8,
                                 color=C[1], lw=0.8, shrinkA=0, shrinkB=0))
# 4줄: 깃발 + 채운 비트 + 깃발
for j, b in enumerate(FRAME):
    x = j - NF
    if j < NF or j >= NF + len(STUFFED):
        cell(ax, x, Y4, b, fc=C[0], alpha=0.22, ec=C[0], color=C[0])
    elif (j - NF) in INS:
        cell(ax, x, Y4, b, fc=C[1], alpha=0.3, ec=C[1], color=C[1], bold=True)
    else:
        cell(ax, x, Y4, b)
bracket(ax, -NF - 0.43, -0.57, Y4 + 0.6, "깃발", color=C[0])
bracket(ax, len(STUFFED) - 0.43, len(STUFFED) + NF - 0.57, Y4 + 0.6, "깃발", color=C[0])
# 5줄: 받는 쪽 카운터 (첫 깃발 다음부터)
for j, mk in enumerate(RMARKS):
    if mk == "del":
        ax.text(j, Y5, "×", ha="center", va="center", fontsize=11, color=C[1], fontweight="bold")
    elif mk == "end":
        continue
    else:
        ax.text(j, Y5, str(mk), ha="center", va="center", fontsize=9.5, color=C[1] if mk == 5 else INK,
                fontweight="bold" if mk == 5 else "normal")
ends = [j for j, mk in enumerate(RMARKS) if mk == "end"]
bracket(ax, ends[0] - 0.43, ends[-1] + 0.43, Y5 - 0.1, "10 → 끝", color=C[2], up=False, fs=9)
ax.text(LBL - 4.6, Y5 - 0.85, "×: 카운터가 5일 때 다음에 온 0을 지운다.   마지막 깃발에서는 5 다음에 10이 와서 프레임이 끝난다.",
        ha="left", va="center", fontsize=8.5, color=C[1])
# 오른쪽 메모
ax.text(len(STUFFED) + 0.4, Y1, f"{len(MSG)}비트", ha="left", va="center", fontsize=9)
ax.text(len(STUFFED) + 0.4, Y3, f"{len(STUFFED)}비트 (0이 {len(INS)}개 늘었다)", ha="left", va="center", fontsize=9,
        color=C[1])
ax.set_xlim(LBL - 5.0, len(STUFFED) + NF + 0.6)
ax.set_ylim(Y5 - 1.2, Y1 + 0.6)
ax.axis("off")
save(fig, 2)


if __name__ == "__main__":
    # 그림 1: 칸 비트 수(슬라이드 45)
    assert FIXED == [8, 16, 16, 8] and FLAG == "01111110"
    # 그림 2와 본문 표: 0111111111110 → 011111011111010, 끼운 0은 6·12번째 자리(0부터)
    assert STUFFED == "011111011111010" and INS == [6, 12]
    assert RUNS == [0, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 0]
    assert FRAME == "01111110" + "011111011111010" + "01111110" and len(FRAME) == 31
    assert "111111" not in STUFFED and FLAG not in STUFFED
    # 받는 쪽: 끼운 0 두 개를 지우고, 마지막 깃발의 10에서 끝, 원래 본문으로 되돌림
    assert GOT == MSG and RMARKS.count("del") == 2 and RMARKS[-2:] == ["end", "end"]
    assert [j for j, m in enumerate(RMARKS) if m == "del"] == INS
    # 받는 쪽 세 갈래의 짧은 예
    s, _, _, _ = stuff_trace("0111111")                     # 1이 여섯 개 → 0111110 1
    assert s == "01111101" and receive_trace(s + FLAG)[0] == "0111111"
    try:
        receive_trace("01111111" + FLAG); raise RuntimeError   # 1이 일곱 개 → 오류
    except ValueError:
        pass
    # "무조건" 끼우는 이유: 111110 → 1111100 → 되돌리면 111110. 안 끼우고 보내면 받는 쪽은 11111만 받는다
    assert stuff("111110") == "1111100" and receive_trace("1111100" + FLAG)[0] == "111110"
    assert receive_trace("111110" + FLAG)[0] == "11111"
    # 끝 깃발: 받는 쪽은 깃발의 0과 1 다섯 개(6비트)를 덜어 낸다
    assert receive_trace("0" + FLAG)[0] == "0"
    # 문턱이 6이면 본문 0111111에서 깃발 모양이 생긴다
    def stuff_at(bits, k):
        out, run = [], 0
        for b in bits:
            out.append(b); run = run + 1 if b == "1" else 0
            if run == k:
                out.append("0"); run = 0
        return "".join(out)
    assert stuff_at("0111111", 6) == FLAG
    assert all("111111" not in stuff_at(m, 5) for m in ["1" * 30, "0111111", "1111101111110"])
    # 오버헤드: 1만 40개 → 8개 늘어 48비트(20%), 1만 100개 → 120비트
    assert len(stuff("1" * 40)) == 48 and len(stuff("1" * 100)) == 120
    # 무작위 비트의 평균 오버헤드: 0을 하나 끼우기까지 평균 62비트(1/62 ≈ 1.6%)
    random.seed(45)
    n = 400_000
    m = "".join(random.choice("01") for _ in range(n))
    extra = len(stuff(m)) - n
    assert abs(extra / n - 1 / 62) < 0.001, extra / n
    print(f"random overhead = {extra / n:.4%} (1/62 = {1 / 62:.4%})")
    print("ALL CHECKS PASSED")
```
{% endraw %}
