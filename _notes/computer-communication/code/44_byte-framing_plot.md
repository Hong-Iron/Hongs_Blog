---
layout: "note"
title: "44_byte-framing_plot.py"
display_title: "44_byte-framing_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "44"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/byte-framing/"
parent_title: "바이트 중심 프레이밍"
description: "컴퓨터 통신 · 바이트 중심 프레이밍 그림 생성 코드"
sitemap: false
permalink: "/studies/computer-communication/code/44_byte-framing_plot/"
---
{% raw %}
[바이트 중심 프레이밍](/Hongs_Blog/studies/computer-communication/byte-framing/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 바이트 중심 프레이밍 문서의 그림을 만든다: 44_byte-framing_fig1.svg ~ fig4.svg
# 실행: ~/.venvs/vault-plots/bin/python 44_byte-framing_plot.py  (matplotlib, numpy 필요)
# 바이트는 정수 0~255. 그림의 바이트열은 모두 아래 규칙 함수로 계산해서 그린다.
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import FancyArrowPatch, Polygon, Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "44_byte-framing"
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


# ---------------------------------------------------------------- 규칙 (44_framing_impl.py와 같은 규칙)
SYN, SOH, STX, ETX, DLE = 0x16, 0x01, 0x02, 0x03, 0x10
NAME = {SYN: "SYN", SOH: "SOH", STX: "STX", ETX: "ETX", DLE: "DLE"}


def bisync_body(data):
    """슬라이드 방식: 본문의 ETX·DLE 앞에 DLE를 붙이고, 끝은 맨 ETX 하나.
    돌려주는 값: (보내는 바이트, 바이트마다 종류 'data'|'stuff'|'end', 본문 바이트 k가 놓인 자리)"""
    out, kind, pos = [], [], []
    for b in data:
        if b in (ETX, DLE):
            out.append(DLE); kind.append("stuff")
        pos.append(len(out)); out.append(b); kind.append("data")
    out.append(ETX); kind.append("end")
    return out, kind, pos


def bisync_read_trace(stream):
    """받는 쪽 규칙(순서도): DLE면 다음 바이트를 데이터로, DLE 없는 ETX면 끝. 단계마다 (읽은 자리들, 받은 본문)."""
    out, i, steps = [], 0, []
    while True:
        b = stream[i]
        if b == DLE:
            out.append(stream[i + 1]); steps.append(((i, i + 1), list(out))); i += 2
        elif b == ETX:
            steps.append(((i,), list(out))); return out, steps
        else:
            out.append(b); steps.append(((i,), list(out))); i += 1


def naive_read(stream):
    """채우기 없이 첫 ETX에서 끝을 찾는 받는 쪽."""
    k = stream.index(ETX)
    return stream[:k], k


def transparent_body(data):
    """필기의 방식(투명 모드): 본문의 DLE만 두 번 쓰고, 끝은 DLE ETX."""
    out, kind, pos = [], [], []
    for b in data:
        if b == DLE:
            out.append(DLE); kind.append("stuff")
        pos.append(len(out)); out.append(b); kind.append("data")
    out += [DLE, ETX]; kind += ["end", "end"]
    return out, kind, pos


def transparent_read(stream):
    out, i = [], 0
    while True:
        b = stream[i]
        if b == DLE:
            if stream[i + 1] == ETX:
                return out, i + 2
            out.append(DLE); i += 2
        else:
            out.append(b); i += 1


def crc16(data):
    """CRC-16/ARC (다항식 x^16 + x^15 + x^2 + 1, 비트 순서를 뒤집는 방식). 그림의 예시 값 계산용."""
    crc = 0
    for b in data:
        crc ^= b
        for _ in range(8):
            crc = (crc >> 1) ^ 0xA001 if crc & 1 else crc >> 1
    return crc


def label(b):
    return NAME.get(b, f"{b:02X}")


DATA = [0x41, ETX, 0x42, DLE, ETX, 0x43]                 # 본문 예시 (카드 C2의 DLE ETX 두 바이트와 다르다)
SENT, KIND, POS = bisync_body(DATA)
NAIVE_DATA = [0x41, 0x03, 0x42]
NAIVE_SENT = NAIVE_DATA + [ETX]
NAIVE_GOT, NAIVE_CUT = naive_read(NAIVE_SENT)
TSENT, TKIND, TPOS = transparent_body(DATA)

DD_BODY = [0x41, 0x42, 0x43, 0x44, 0x45]
DD_CRC = crc16(DD_BODY)
DD_BAD_COUNT = 3
DD_GOT = DD_BODY[:DD_BAD_COUNT]
DD_GOT_CRC = (DD_BODY[DD_BAD_COUNT] << 8) | DD_BODY[DD_BAD_COUNT + 1]   # CRC 자리로 읽힌 두 바이트
DD_RECALC = crc16(DD_GOT)


# ---------------------------------------------------------------- 그리기 도구
def box(ax, x, y, text, w=0.9, h=0.8, fc=None, alpha=0.0, ec=INK, color=INK, fs=10, lw=0.9, bold=False):
    if fc is not None:
        ax.add_patch(Rectangle((x - w / 2, y - h / 2), w, h, facecolor=fc, alpha=alpha, edgecolor="none"))
    ax.add_patch(Rectangle((x - w / 2, y - h / 2), w, h, facecolor="none", edgecolor=ec, lw=lw))
    ax.text(x, y, text, ha="center", va="center", fontsize=fs, color=color, fontweight="bold" if bold else "normal")


def bracket(ax, x0, x1, y, text, color=INK, up=True, fs=9, tick=0.15):
    d = tick if up else -tick
    ax.plot([x0, x0, x1, x1], [y - d, y, y, y - d], color=color, lw=0.9)
    ax.text((x0 + x1) / 2, y + (0.12 if up else -0.12), text, ha="center", va="bottom" if up else "top",
            fontsize=fs, color=color)


def arrow(ax, p, q, color=INK, rad=0.0, lw=0.9, style="-|>"):
    ax.add_patch(FancyArrowPatch(p, q, arrowstyle=style, mutation_scale=9, color=color, lw=lw,
                                 connectionstyle=f"arc3,rad={rad}", shrinkA=1, shrinkB=1))


def stuff_rows(ax, data, sent, kind, pos, y_top, y_bot, end_text):
    """본문 줄(끼운 자리는 비움)과 보내는 바이트 줄을 위아래로 맞춰 그린다."""
    for k, b in enumerate(data):
        x = pos[k]
        box(ax, x, y_top, label(b))
        arrow(ax, (x, y_top - 0.42), (x, y_bot + 0.42))
    for x, (b, t) in enumerate(zip(sent, kind)):
        if t == "stuff":
            box(ax, x, y_bot, label(b), fc=C[1], alpha=0.28, ec=C[1], color=C[1], bold=True)
            ax.text(x, y_top, "+DLE", ha="center", va="center", fontsize=9, color=C[1])
        elif t == "end":
            box(ax, x, y_bot, label(b), fc=C[2], alpha=0.28, ec=C[2], color=C[2], bold=True)
        else:
            box(ax, x, y_bot, label(b))
    ends = [x for x, t in enumerate(kind) if t == "end"]
    ax.text((ends[0] + ends[-1]) / 2, y_bot - 0.55, end_text, ha="center", va="top", fontsize=9, color=C[2])


# ---------------------------------------------------------------- 그림 1: 채우기 없이 잘리는 모습과 슬라이드 방식 채우기
fig, ax = plt.subplots(figsize=(6.8, 4.5))
LX = -1.0
# (가) 채우기 없이
ya = 4.95
ax.text(LX - 1.6, ya + 1.1, "(가) 채우기 없이 보냄: 본문 41 03 42", fontsize=10, ha="left", va="bottom")
ax.text(LX, ya, "보내는 바이트", ha="right", va="center", fontsize=9)
for x, b in enumerate(NAIVE_SENT):
    if x == NAIVE_CUT:
        box(ax, x, ya, f"{b:02X}", fc=C[1], alpha=0.28, ec=C[1], color=C[1], bold=True)
    elif x == len(NAIVE_SENT) - 1:
        box(ax, x, ya, "ETX", fc=C[2], alpha=0.28, ec=C[2], color=C[2], bold=True)
    else:
        box(ax, x, ya, f"{b:02X}")
bracket(ax, -0.4, len(NAIVE_DATA) - 0.6, ya + 0.6, "본문", fs=9)
ax.text(len(NAIVE_SENT) - 1, ya + 0.72, "끝 표시", ha="center", va="bottom", fontsize=9, color=C[2])
bracket(ax, -0.4, NAIVE_CUT - 0.6, ya - 0.6, "본문으로 받음", up=False, fs=9, color=C[0])
bracket(ax, NAIVE_CUT + 0.6, len(NAIVE_SENT) - 0.6, ya - 0.6, "잘려 나감", up=False, fs=9, color=C[1])
ax.text(len(NAIVE_SENT) + 0.1, ya, "주황 03은 ETX와 같은 값이라\n받는 쪽이 여기서 끝낸다", fontsize=9, color=C[1],
        va="center", ha="left")
# (나) 슬라이드 방식
yb_top, yb_bot = 2.25, 0.55
ax.text(LX - 1.6, yb_top + 0.75, "(나) 슬라이드 방식으로 채움: 본문 41 ETX 42 DLE ETX 43", fontsize=10, ha="left",
        va="bottom")
ax.text(LX, yb_top, "본문", ha="right", va="center", fontsize=9)
ax.text(LX, yb_bot, "보내는 바이트", ha="right", va="center", fontsize=9)
stuff_rows(ax, DATA, SENT, KIND, POS, yb_top, yb_bot, "진짜 끝")
ax.text(len(SENT) - 0.3, yb_top, "주황 = 끼운 DLE\n(다음 바이트는 데이터)", ha="left", va="center", fontsize=9, color=C[1])
ax.set_xlim(LX - 1.7, len(SENT) + 2.6)
ax.set_ylim(-0.4, 6.45)
ax.axis("off")
save(fig, 1)


# ---------------------------------------------------------------- 그림 2: BISYNC와 DDCMP 프레임 막대
def frame_bar(ax, y, fields, title, h=1.0):
    x = 0.0
    spans = {}
    ax.text(0, y + h + 1.15, title, ha="left", va="bottom", fontsize=10)
    for name, w, bits, style in fields:
        top = y + h
        if style == "body":
            g = 1.2                                                     # 끊김 표시 폭
            m = x + w / 2
            zig = [(m - 1.0, y), (m + 0.6, y + 0.45 * h), (m - 0.6, y + 0.55 * h), (m + 1.0, top)]
            left = [(x, y)] + zig + [(x, top)]
            right = [(px + g, py) for px, py in zig][::-1] + [(x + w, top), (x + w, y)]
            right = [(zig[0][0] + g, y)] + [(px + g, py) for px, py in zig] + [(x + w, top), (x + w, y)]
            for poly in (left, right):
                ax.add_patch(Polygon(poly, closed=True, facecolor=INK, alpha=0.18, edgecolor="none"))
                ax.add_patch(Polygon(poly, closed=True, facecolor="none", edgecolor=INK, lw=0.9))
            ax.text(x + w * 0.22, y + h / 2, name, ha="center", va="center", fontsize=10)
            ax.text(m + g / 2, top + 0.25, "길이가 정해지지 않음", ha="center", va="bottom", fontsize=8.5)
        else:
            fc = {"ctrl": C[0], "count": C[1], "crc": C[2]}.get(style)
            if fc:
                ax.add_patch(Rectangle((x, y), w, h, facecolor=fc, alpha=0.22, edgecolor="none"))
            ax.add_patch(Rectangle((x, y), w, h, facecolor="none", edgecolor=INK, lw=0.9))
            ax.text(x + w / 2, y + h / 2, name, ha="center", va="center", fontsize=8.5 if w <= 8 else 10)
            ax.text(x + w / 2, top + 0.25, bits, ha="center", va="bottom", fontsize=8.5 if not bits.isdigit() else 9.5)
        spans[name if name not in spans else name + "2"] = (x, x + w)
        x += w
    return spans


BIS = [("SYN", 8, "8", "ctrl"), ("SYN", 8, "8", "ctrl"), ("SOH", 8, "8", "ctrl"), ("Header", 26, "길이 안 적힘", "plain"),
       ("STX", 8, "8", "ctrl"), ("Body", 44, "", "body"), ("ETX", 8, "8", "ctrl"), ("CRC", 16, "16", "crc")]
DDC = [("SYN", 8, "8", "ctrl"), ("SYN", 8, "8", "ctrl"), ("Class", 8, "8", "plain"), ("Count", 14, "14", "count"),
       ("Header", 42, "42", "plain"), ("Body", 44, "", "body"), ("CRC", 16, "16", "crc")]
FIXED_BIS = [w for name, w, bits, st in BIS if bits.isdigit()]          # 비트 수가 적힌 칸
FIXED_DDC = [w for name, w, bits, st in DDC if bits.isdigit()]

fig, ax = plt.subplots(figsize=(6.8, 3.6))
yb, yd = 4.2, 0.0
sb = frame_bar(ax, yb, BIS, "BISYNC (보초 방법)")
sd = frame_bar(ax, yd, DDC, "DDCMP (바이트 수 방법)")
# ETX: 끝 표시
ex = sum(sb["ETX"]) / 2
ax.annotate("앞에 DLE가 없는 ETX = 본문 끝", (ex, yb - 0.05), xytext=(ex - 2, yb - 0.85), fontsize=9, color=C[0],
            ha="right", va="center", arrowprops=dict(arrowstyle="-|>", color=C[0], lw=0.8, mutation_scale=9))
# Count → 본문 끝
cx = sum(sd["Count"]) / 2
bx = sd["Body"][1]
arrow(ax, (cx, yd - 0.08), (bx - 0.3, yd - 0.08), color=C[1], rad=0.22)
ax.text((cx + bx) / 2, yd - 1.5, "Count가 본문이 몇 바이트인지 알려 준다", ha="center", va="top", fontsize=9, color=C[1])
ax.set_xlim(-1, 142)
ax.set_ylim(-2.0, yb + 2.4)
ax.axis("off")
save(fig, 2)


# ---------------------------------------------------------------- 그림 3: 필기의 방식(투명 모드)
fig, ax = plt.subplots(figsize=(6.8, 2.5))
yt, yb3 = 1.7, 0.0
ax.text(LX, yt, "본문", ha="right", va="center", fontsize=9)
ax.text(LX, yb3, "보내는 바이트", ha="right", va="center", fontsize=9)
stuff_rows(ax, DATA, TSENT, TKIND, TPOS, yt, yb3, "끝 표시 DLE ETX")
lone = [x for x, (b, t) in enumerate(zip(TSENT, TKIND)) if b == ETX and t == "data" and (x == 0 or TSENT[x - 1] != DLE)]
ax.annotate("앞에 DLE가 없는 ETX는\n그냥 데이터", (lone[0], yb3 - 0.42), xytext=(lone[0] + 0.6, yb3 - 1.25), fontsize=9,
            ha="left", va="center", color=C[0],
            arrowprops=dict(arrowstyle="-|>", color=C[0], lw=0.8, mutation_scale=9))
ax.text(len(TSENT) - 0.3, yt, "주황 = 끼운 DLE\n(DLE를 두 번 씀)", ha="left", va="center", fontsize=9, color=C[1])
ax.set_xlim(LX - 1.7, len(TSENT) + 2.6)
ax.set_ylim(-1.8, 2.3)
ax.axis("off")
save(fig, 3)


# ---------------------------------------------------------------- 그림 4: DDCMP Count가 5에서 3으로 깨질 때
crc_hi, crc_lo = DD_CRC >> 8, DD_CRC & 0xFF
cells = [("SYN", "ctrl"), ("SYN", "ctrl"), ("Class", None), ("COUNT", "count"), ("Header", None)]
cells += [(f"{b:02X}", None) for b in DD_BODY]
cells += [(f"{crc_hi:02X}", "crc"), (f"{crc_lo:02X}", "crc"), ("SYN", "next"), ("SYN", "next")]
X0 = 0.0
xs, ws = [], []
x = X0
for t, _ in cells:
    w = 1.5 if t == "Header" else 0.9
    xs.append(x + w / 2); ws.append(w); x += w + 0.1
body_i = list(range(5, 10))
crc_i = [10, 11]
next_i = [12, 13]

fig, ax = plt.subplots(figsize=(6.8, 3.9))
rows = [(2.6, len(DD_BODY), "보낸 프레임"), (0.0, DD_BAD_COUNT, "받은 프레임")]
for y, count, name in rows:
    ax.text(-0.3, y, name, ha="right", va="center", fontsize=9)
    for i, (t, st) in enumerate(cells):
        if t == "COUNT":
            bad = count != len(DD_BODY)
            col = C[1] if bad else INK
            box(ax, xs[i], y, str(count), w=ws[i], fc=C[1], alpha=0.28 if bad else 0.12, ec=col, color=col, bold=bad)
        elif st == "ctrl":
            box(ax, xs[i], y, t, w=ws[i], fc=C[0], alpha=0.2, fs=9)
        elif st == "next":
            box(ax, xs[i], y, t, w=ws[i], fc=C[0], alpha=0.2, fs=9)
        elif st == "crc":
            box(ax, xs[i], y, t, w=ws[i], fc=C[2], alpha=0.22)
        else:
            box(ax, xs[i], y, t, w=ws[i], fs=8 if t == "Class" else (9 if len(t) > 2 else 10))
ax.text(xs[3], 2.6 + 0.52, "Count", ha="center", va="bottom", fontsize=8.5)
L = lambda i: xs[i] - ws[i] / 2
R = lambda i: xs[i] + ws[i] / 2
# 위: 보낸 쪽의 뜻
bracket(ax, L(body_i[0]), R(body_i[-1]), 2.6 + 0.55, "본문 5바이트", color=C[0])
bracket(ax, L(crc_i[0]), R(crc_i[-1]), 2.6 + 0.55, "CRC", color=C[2])
bracket(ax, L(next_i[0]), R(next_i[-1]), 2.6 + 0.55, "다음 프레임", color=C[0])
# 아래: Count = 3으로 읽은 뜻
g = body_i[:DD_BAD_COUNT]
bracket(ax, L(g[0]), R(g[-1]), -0.55, "본문으로 읽음", up=False, color=C[0])
bracket(ax, L(body_i[DD_BAD_COUNT]), R(body_i[DD_BAD_COUNT + 1]), -0.55, "CRC로\n읽음", up=False, color=C[1])
bracket(ax, L(crc_i[0]), R(crc_i[-1]), -0.55, "다음 프레임\n시작으로 읽음", up=False, color=C[1])
ax.annotate("Count가 5에서 3으로 깨짐", (xs[3], 0.42), xytext=(xs[3] + 0.4, 1.3), fontsize=9, color=C[1], ha="left",
            va="center", arrowprops=dict(arrowstyle="-|>", color=C[1], lw=0.8, mutation_scale=9))
ax.text(xs[0] - 0.45, -2.05,
        f"받는 쪽이 41 42 43으로 다시 계산한 CRC = {DD_RECALC >> 8:02X} {DD_RECALC & 0xFF:02X}\n"
        f"CRC 자리에서 읽은 두 바이트 = {DD_GOT_CRC >> 8:02X} {DD_GOT_CRC & 0xFF:02X}  →  서로 다르므로 오류",
        ha="left", va="center", fontsize=9, color=C[1], linespacing=1.5)
ax.set_xlim(-2.6, R(next_i[-1]) + 0.2)
ax.set_ylim(-2.6, 3.75)
ax.axis("off")
save(fig, 4)


if __name__ == "__main__":
    # 그림 1과 문서 표: 41 ETX 42 DLE ETX 43 → 41 DLE ETX 42 DLE DLE DLE ETX 43 ETX, 끼운 DLE는 1·4·6번째 자리(0부터)
    assert SENT == [0x41, DLE, ETX, 0x42, DLE, DLE, DLE, ETX, 0x43, ETX]
    assert [i for i, t in enumerate(KIND) if t == "stuff"] == [1, 4, 6]
    # 채우기 없이 보내면 41까지만 본문
    assert NAIVE_GOT == [0x41] and NAIVE_CUT == 1
    # 받는 쪽 추적 표: 7단계, 받은 본문의 변화
    got, steps = bisync_read_trace(SENT + [0x99, 0x99])
    assert got == DATA and len(steps) == 7
    assert [s[0] for s in steps] == [(0,), (1, 2), (3,), (4, 5), (6, 7), (8,), (9,)]
    assert steps[3][1] == [0x41, ETX, 0x42, DLE]
    # 본문 42 DLE: DLE를 채우지 않으면 진짜 끝 ETX를 데이터로 삼킨다, 채우면 42 DLE DLE ETX
    assert bisync_body([0x42, DLE])[0] == [0x42, DLE, DLE, ETX]
    swallowed, _ = bisync_read_trace([0x42, DLE, ETX] + [0xAA, 0xBB] + [ETX])
    assert swallowed == [0x42, ETX, 0xAA, 0xBB]
    assert bisync_read_trace([0x42, DLE, DLE, ETX, 0xAA, 0xBB])[0] == [0x42, DLE]
    # 무작위 바이트의 평균 오버헤드: ETX·DLE일 확률 2/256 ≈ 0.8%
    import random
    random.seed(44)
    rnd = [random.randrange(256) for _ in range(200_000)]
    over = (len(bisync_body(rnd)[0]) - 1 - len(rnd)) / len(rnd)
    assert abs(over - 2 / 256) < 0.001, over
    # 최악: 본문이 DLE 10개면 21바이트
    assert len(bisync_body([DLE] * 10)[0]) == 21
    # 그림 3: 필기의 방식 41 ETX 42 DLE DLE ETX 43 DLE ETX, 되돌리면 원래 본문
    assert TSENT == [0x41, ETX, 0x42, DLE, DLE, ETX, 0x43, DLE, ETX]
    assert transparent_read(TSENT + [0x99])[0] == DATA
    # 오버헤드: 본문 6바이트가 슬라이드 방식으로 10바이트(4 늘어남), 필기 방식으로 9바이트(3 늘어남)
    assert len(SENT) - len(DATA) == 4 and len(TSENT) - len(DATA) == 3
    # 그림 2: 칸 비트 수(슬라이드 44)
    assert FIXED_BIS == [8, 8, 8, 8, 8, 16] and FIXED_DDC == [8, 8, 8, 14, 42, 16]
    assert sum(FIXED_DDC) == 96                          # DDCMP는 본문 밖에 96비트 = 12바이트
    assert 2 ** 14 - 1 == 16383                          # Count 14비트가 적을 수 있는 가장 큰 수
    # 그림 4: CRC-16 확인값, 보낸 CRC, 다시 계산한 CRC가 CRC 자리의 44 45와 다름
    assert crc16(b"123456789") == 0xBB3D
    assert DD_GOT == [0x41, 0x42, 0x43] and DD_GOT_CRC == 0x4445
    assert DD_RECALC != DD_GOT_CRC
    assert 5 ^ 3 == 0b110                                # 5 = 101, 3 = 011: 아래 두 비트가 뒤집힘
    print(f"CRC(41 42 43 44 45) = {DD_CRC:04X}, CRC(41 42 43) = {DD_RECALC:04X}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
