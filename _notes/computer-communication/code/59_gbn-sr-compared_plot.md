---
layout: "note"
title: "59_gbn-sr-compared_plot.py"
display_title: "59_gbn-sr-compared_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "59"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/gbn-sr-compared/"
parent_title: "Go-Back-N과 Selective Repeat 비교"
description: "컴퓨터 통신 · Go-Back-N과 Selective Repeat 비교 그림 생성 코드"
sitemap: false
permalink: "/studies/computer-communication/code/59_gbn-sr-compared_plot/"
---
{% raw %}
[Go-Back-N과 Selective Repeat 비교](/Hongs_Blog/studies/computer-communication/gbn-sr-compared/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# Go-Back-N과 Selective Repeat 비교 문서의 그림을 만든다: 59_gbn-sr-compared_fig1.svg
# 같은 상황(창 크기 4, 프레임 6개, F2가 처음 보낼 때 사라짐)을 Go-Back-N(수신 쪽은 순서 어긋난 프레임을
# 저장만 하고 ACK는 보내지 않음, 송신 쪽은 프레임마다 타이머)과 Selective Repeat으로 나란히 그린다.
# 실행: ~/.venvs/vault-plots/bin/python 59_gbn-sr-compared_plot.py  (matplotlib, numpy 필요)
import heapq
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.patches import FancyArrowPatch, Polygon, Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "59_gbn-sr-compared"
INK = "#888888"                                         # 밝은 테마와 어두운 테마 모두에서 보이는 회색
C = ["#3b82c4", "#d9622b", "#3a9a5b", "#9b59b6", "#c49a1b"]
BLUE, ORANGE, GREEN, PURPLE, GOLD = C
_fonts = {f.name for f in font_manager.fontManager.ttflist}
FONT = next((n for n in ["Apple SD Gothic Neo", "NanumGothic", "Noto Sans CJK KR"] if n in _fonts), "DejaVu Sans")
plt.rcParams.update({
    "font.family": FONT, "mathtext.fontset": "dejavusans",
    "font.size": 10, "axes.unicode_minus": False, "svg.fonttype": "path", "svg.hashsalt": PREFIX,
    "axes.edgecolor": INK, "axes.labelcolor": INK, "xtick.color": INK, "ytick.color": INK,
    "text.color": INK, "legend.frameon": False,
    "axes.facecolor": "none", "figure.facecolor": "none", "savefig.transparent": True,
    "axes.spines.top": False, "axes.spines.right": False,
})


def save(fig, k):
    fig.savefig(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"), bbox_inches="tight", metadata={"Date": None})
    if os.environ.get("PREVIEW_DIR"):                   # 눈으로 확인할 PNG (볼트 밖 폴더에만)
        fig.savefig(os.path.join(os.environ["PREVIEW_DIR"], f"{PREFIX}_fig{k}.png"), bbox_inches="tight", dpi=110,
                    facecolor="white")
    plt.close(fig)


def arrow(ax, p, q_, color=INK, lw=1.2, style="-|>", ls="-", ms=10):
    ax.add_patch(FancyArrowPatch(p, q_, arrowstyle=style, mutation_scale=ms, color=color, lw=lw, ls=ls,
                                 shrinkA=0, shrinkB=0))


# =====================================================================
# 슬라이딩 윈도우 사건 시뮬레이터
# 송신 쪽과 수신 쪽은 서로의 상태를 보지 못하고, 도착한 메시지와 자기 타이머만 보고 움직인다.
# =====================================================================

def simulate(n, sws, rws, tf, tp, timeout, proto="gbn", store=True, ack_ooo=False, resend="each",
             ack_old=True, frame_fault=None, ack_fault=None):
    """proto "gbn": 누적 ACK(값 = 다음에 기다리는 번호 NFE, 데이터 n을 받으면 ACK n+1)
             "sr" : 개별 ACK(값 = 받은 프레임 번호)
    store   (gbn) 수신 쪽이 창 안의 순서 어긋난 프레임을 저장하는가
    ack_ooo (gbn) 순서 어긋난 프레임에도 지금의 누적 ACK를 다시 보내는가(중복 ACK)
    resend  (gbn) "each": 타이머가 끝난 프레임만 다시, "all": 그 프레임부터 보낸 것을 모두 다시
    ack_old 이미 받은 번호가 오면 ACK를 다시 보내는가
    frame_fault {(i, k): "lost"|"corrupt"}: i번 프레임의 k번째 전송.  ack_fault {j: "lost"}: j번째(0부터) ACK
    tf 싣는 시간, tp 전파 시간. 프레임은 마지막 비트가 닿는 순간(시작 + tf + tp)에 도착하고,
    ACK는 짧아서 싣는 시간 없이 tp 뒤에 닿는다. 수신 쪽은 프레임을 받는 즉시 ACK를 보낸다."""
    frame_fault = frame_fault or {}
    ack_fault = ack_fault or {}
    q, tick = [], [0]
    tx, ev, timers, states = [], [], [], []
    S = dict(base=0, next=0, link_free=0.0, timer={}, tstart={}, attempt={}, acked=set(), done=None, nack=0, gen={})
    R = dict(NFE=0, store=set(), delivered=[])

    def snap(t, who):
        states.append(dict(t=t, who=who, base=S["base"], next=S["next"], acked=set(S["acked"]),
                           NFE=R["NFE"], store=set(R["store"]), delivered=list(R["delivered"])))

    def push(t, kind, data, pri=0):
        tick[0] += 1
        heapq.heappush(q, (t, pri, tick[0], kind, data))

    def send(i, t, why):
        start = max(t, S["link_free"])
        S["link_free"] = start + tf
        a = S["attempt"].get(i, 0) + 1
        S["attempt"][i] = a
        status = frame_fault.get((i, a), "ok")
        tx.append(dict(kind="F", label=f"F{i}", seq=i, t0=start, dur=tf, tp=tp, status=status, attempt=a))
        if i in S["timer"]:                             # 끝나서 다시 보내면 expired, 끝나기 전에 새로 걸면 restart
            kind_ = "expired" if abs(start - S["timer"][i]) < 1e-9 else "restart"
            timers.append((i, S["tstart"][i], start, kind_))
        S["timer"][i], S["tstart"][i] = start + timeout, start
        S["gen"][i] = S["gen"].get(i, 0) + 1
        push(start + timeout, "timeout", (i, S["gen"][i]), 1)
        if status != "lost":
            push(start + tf + tp, "frame", (i, status))
        ev.append(("S", start, why))

    def send_ack(t, val, why):
        j = S["nack"]
        S["nack"] += 1
        status = ack_fault.get(j, "ok")
        tx.append(dict(kind="A", label=f"ACK {val}", seq=val, t0=t, dur=0.0, tp=tp, status=status))
        if status == "ok":
            push(t + tp, "ack", val)
        ev.append(("R", t, why))

    def fill(t):
        sent = []
        while S["next"] < n and S["next"] < S["base"] + sws:
            i = S["next"]
            S["next"] += 1
            send(i, t, f"F{i} 보냄")
            sent.append(i)
        return sent

    def stop_timer(j, t):
        if j in S["timer"]:
            timers.append((j, S["tstart"][j], t, "stopped"))
            del S["timer"][j]

    def deliver_run():
        up = []
        while R["NFE"] in R["store"]:
            R["store"].discard(R["NFE"])
            up.append(R["NFE"])
            R["delivered"].append(R["NFE"])
            R["NFE"] += 1
        return "·".join(f"F{u}" for u in up)

    fill(0.0)
    snap(0.0, "S")
    while q:
        t, _, _, kind, data = heapq.heappop(q)
        if kind == "frame":
            i, status = data
            if status == "corrupt":
                ev.append(("R", t, f"F{i} 오류 → 버림"))
                snap(t, "R")
                continue
            lfa = R["NFE"] + rws - 1
            if i < R["NFE"]:
                val = R["NFE"] if proto == "gbn" else i
                if ack_old:
                    send_ack(t, val, f"F{i} 이미 받음 → 버림, ACK {val}")
                else:
                    ev.append(("R", t, f"F{i} 이미 받음 → 버림"))
            elif i > lfa:
                ev.append(("R", t, f"F{i} 창 밖 → 버림"))
            elif proto == "gbn" and i > R["NFE"]:
                if store:
                    R["store"].add(i)
                msg = f"F{i} 어긋남 → " + ("저장" if store else "버림")
                if ack_ooo:
                    send_ack(t, R["NFE"], msg + f", ACK {R['NFE']}")
                else:
                    ev.append(("R", t, msg))
            elif proto == "gbn":
                R["store"].add(i)
                names = deliver_run()
                send_ack(t, R["NFE"], f"F{i} → {names} 올림, ACK {R['NFE']}")
            else:
                R["store"].add(i)
                names = deliver_run()
                if names:
                    send_ack(t, i, f"F{i} → {names} 올림, ACK {i}")
                else:
                    send_ack(t, i, f"F{i} 어긋남 → 저장, ACK {i}")
            snap(t, "R")
        elif kind == "ack":
            val = data
            if proto == "gbn":
                if val > S["base"]:
                    for j in range(S["base"], val):
                        stop_timer(j, t)
                    S["base"] = val
                    moved = True
                else:
                    ev.append(("S", t, f"ACK {val} 무시(이미 받음)"))
                    snap(t, "S")
                    continue
            else:
                if val in S["acked"] or val < S["base"]:
                    ev.append(("S", t, f"ACK {val} 무시(이미 받음)"))
                    snap(t, "S")
                    continue
                S["acked"].add(val)
                stop_timer(val, t)
                moved = False
                while S["base"] in S["acked"]:
                    S["base"] += 1
                    moved = True
            if S["base"] == n:
                S["done"] = t
                ev.append(("S", t, f"ACK {val} → 모두 확인"))
            else:
                sent = fill(t) if moved else []
                msg = f"ACK {val}" + (" → 창이 열림" if moved else " → 기록")
                if sent:
                    del ev[-len(sent):]
                    msg = f"ACK {val} → " + "·".join(f"F{s}" for s in sent) + " 보냄"
                ev.append(("S", t, msg))
            snap(t, "S")
        elif kind == "timeout":
            i, g = data
            if i in S["timer"] and S["gen"][i] == g:
                if proto == "gbn" and resend == "all":
                    for j in range(i, S["next"]):
                        send(j, t, f"T{i} 끝 → F{i} 다시" if j == i else f"F{j} 다시")
                else:
                    send(i, t, f"T{i} 끝 → F{i} 다시")
                snap(t, "S")
    return dict(tx=tx, ev=ev, timers=timers, done=S["done"], delivered=R["delivered"], states=states)


# =====================================================================
# 시간 진행 그림: 송신 x=sx, 수신 x=rx, 시간은 아래로
# 프레임은 싣는 시간만큼 두께가 있는 띠(성능 분석용 그림), ACK는 선이다.
# =====================================================================

def timeline(ax, res, tmax, tick_step=5, unit="ms", ev_size=9.8, timers=True, events=True, title=None,
             sx=0.0, rx=1.0, xlim=(-1.5, 2.4), label_size=10, ack_label=0.3, hide=(), ack_only=None):
    ax.set_xlim(*xlim)
    ax.set_ylim(tmax + 1.5, -0.12 * tmax - 1)
    ax.set_axis_off()
    top = -0.04 * tmax
    for x, name in ((sx, "송신"), (rx, "수신")):
        ax.plot([x, x], [0, tmax], color=INK, lw=1.6)
        ax.text(x, top, name, ha="center", va="bottom", fontsize=11.5, weight="bold")
    for t in np.arange(0, tmax + 1e-9, tick_step):
        ax.plot([sx - 0.025, sx], [t, t], color=INK, lw=0.8)
        ax.text(sx - 0.035, t, f"{t:g}", ha="right", va="center", fontsize=8.5, color=INK, alpha=0.85)
    ax.text(sx - 0.035, tmax + 0.012 * tmax, f"({unit})", ha="right", va="top", fontsize=8.5, color=INK, alpha=0.85)

    def along(xa, ta, xb, tb, frac, text, color, size=9.2):
        pa = ax.transData.transform((xa, ta))
        pb = ax.transData.transform((xb, tb))
        ang = math.degrees(math.atan2(pb[1] - pa[1], pb[0] - pa[0]))
        if ang > 90:
            ang -= 180
        if ang < -90:
            ang += 180
        ax.text(xa + (xb - xa) * frac, ta + (tb - ta) * frac, text, ha="center", va="bottom", fontsize=size,
                color=color, rotation=ang, rotation_mode="anchor")

    for m in res["tx"]:
        if m["label"] in hide:
            continue
        t0, d, tp = m["t0"], m["dur"], m["tp"]
        if m["kind"] == "F":
            col = BLUE if m["status"] == "ok" else ORANGE
            if m["status"] == "lost":
                pts = [(sx, t0), (sx, t0 + d), ((sx + rx) / 2, t0 + d + tp / 2), ((sx + rx) / 2, t0 + tp / 2)]
                ax.add_patch(Polygon(pts, closed=True, fc=BLUE, alpha=0.18, ec=BLUE, lw=0.8))
                ax.plot([(sx + rx) / 2 + 0.03], [t0 + tp / 2 + d / 2], marker="x", ms=9, mew=2.4, color=ORANGE)
                lx, ly = (sx + rx) / 4, t0 + tp / 4 + d / 2
            else:
                pts = [(sx, t0), (sx, t0 + d), (rx, t0 + d + tp), (rx, t0 + tp)]
                ax.add_patch(Polygon(pts, closed=True, fc=col, alpha=0.18 if m["status"] == "ok" else 0.28, ec=col,
                                     lw=0.8, hatch=None if m["status"] == "ok" else "////"))
                lx, ly = (sx + rx) / 2, t0 + tp / 2 + d / 2
            again = " (재)" if m.get("attempt", 1) > 1 else ""
            ax.text(lx, ly, m["label"] + again + (" 오류" if m["status"] == "corrupt" else ""), ha="center",
                    va="center", fontsize=label_size, color=col, weight="bold")
        else:
            if m["status"] == "lost":
                ax.plot([rx, (sx + rx) / 2], [t0, t0 + tp / 2], color=GREEN, lw=1.3)
                ax.plot([(sx + rx) / 2 - 0.03], [t0 + tp / 2], marker="x", ms=9, mew=2.4, color=ORANGE)
            else:
                arrow(ax, (rx, t0), (sx, t0 + tp), color=GREEN, lw=1.3, ms=9)
            if ack_label is not None and (ack_only is None or m["label"] in ack_only):
                along(rx, t0, sx, t0 + tp, ack_label, m["label"], GREEN)
    lanes = {}
    if timers:
        for (i, a, b, kind) in sorted(res["timers"], key=lambda z: z[1]):
            lane = 0
            while any(not (b <= s0 or a >= s1) for (s0, s1) in lanes.get(lane, [])):
                lane += 1
            lanes.setdefault(lane, []).append((a, b))
            x = sx - 0.12 - 0.07 * lane
            col = PURPLE if kind == "expired" else INK
            ax.plot([x, x], [a, b], color=col, lw=1.5 if kind == "expired" else 0.9,
                    ls="-" if kind == "expired" else (0, (2, 2)))
            ax.plot([x, x + 0.035], [a, a], color=col, lw=1.0)
            if kind == "expired":
                ax.plot([x - 0.02, x + 0.035], [b, b], color=PURPLE, lw=1.6)
    if events:
        nl = 2 + max([len(lanes)] if timers and res["timers"] else [0])
        gap = (tmax * 1.15) * 0.0205 * ev_size / ax.figure.get_figheight()
        for want in ("S", "R"):
            last = -1e9
            for side, t, text in sorted([e for e in res["ev"] if e[0] == want], key=lambda e: e[1]):
                y = max(t, last + gap)
                last = y
                if side == "S":
                    x0 = sx - 0.12 - 0.07 * (nl - 2) - 0.13
                    ax.text(x0, y, text, ha="right", va="center", fontsize=ev_size, color=INK)
                else:
                    ax.text(rx + 0.06, y, text, ha="left", va="center", fontsize=ev_size, color=INK)
                    if y - t > 1e-9:
                        ax.plot([rx + 0.01, rx + 0.05], [t, y], color=INK, lw=0.5)
    if title:
        ax.text((sx + rx) / 2, -0.11 * tmax - 0.6, title, ha="center", va="bottom", fontsize=11)


# =====================================================================
# 번호 띠: 순서 번호 칸을 한 줄로 늘어놓고 칸마다 상태를 칠한다
# =====================================================================

def strip(ax, y, labels, fills, x0=0.0, w=0.5, h=0.5, marks=None, size=9, outline=None, label=None, lsize=9):
    """labels: 칸 글자, fills: 칸 색(None이면 빈칸), outline: (첫 칸, 끝 칸, 색) 굵은 테두리(창)
    marks: [(칸 번호, 글자, 위/아래)] 화살표 표시"""
    for k, (lab, f) in enumerate(zip(labels, fills)):
        x = x0 + k * w
        ax.add_patch(Rectangle((x, y - h / 2), w, h, fc=f if f else "none", ec=INK, lw=0.8,
                               alpha=1.0 if not f else 0.55))
        ax.text(x + w / 2, y, lab, ha="center", va="center", fontsize=size, color=INK if not f else "#ffffff",
                weight="bold" if f else "normal")
    if outline:
        a, b, col = outline
        ax.add_patch(Rectangle((x0 + a * w - 0.03, y - h / 2 - 0.06), (b - a + 1) * w + 0.06, h + 0.12, fc="none",
                               ec=col, lw=2.0))
    for (k, text, where) in (marks or []):
        x = x0 + k * w + w / 2
        if where == "below":
            arrow(ax, (x, y - h / 2 - 0.42), (x, y - h / 2 - 0.08), color=INK, lw=1.0, ms=7)
            ax.text(x, y - h / 2 - 0.46, text, ha="center", va="top", fontsize=9.5, color=INK)
        else:
            arrow(ax, (x, y + h / 2 + 0.42), (x, y + h / 2 + 0.08), color=INK, lw=1.0, ms=7)
            ax.text(x, y + h / 2 + 0.46, text, ha="center", va="bottom", fontsize=9.5, color=INK)
    if label:
        ax.text(x0 - 0.15, y, label, ha="right", va="center", fontsize=lsize, color=INK)


N, SWS, TF, TP, TO = 6, 4, 1.0, 3.0, 9.0
LOSS = {(2, 1): "lost"}
gbn = simulate(N, SWS, SWS, TF, TP, TO, store=True, ack_ooo=False, resend="each", frame_fault=LOSS)
sr = simulate(N, SWS, SWS, TF, TP, TO, proto="sr", frame_fault=LOSS)


def count(res):
    f = [m for m in res["tx"] if m["kind"] == "F"]
    return len(f), len(f) - N


fig, axes = plt.subplots(1, 2, figsize=(8.6, 7.2))
for ax, res, name in ((axes[0], gbn, "Go-Back-N (저장, 각자 타이머)"), (axes[1], sr, "Selective Repeat")):
    k, extra = count(res)
    timeline(ax, res, 24, tick_step=2, unit="ms", timers=False, events=False, xlim=(-0.3, 1.3), label_size=9.5,
             ack_label=0.78, title=f"{name}\n{k}번 전송(다시 {extra}번), {res['done']:g} ms에 끝")
    ax.plot([-0.06, 0.06], [res["done"], res["done"]], color=PURPLE, lw=2.4)
save(fig, 1)


if __name__ == "__main__":
    assert count(gbn) == (10, 4) and count(sr) == (7, 1)
    assert gbn["done"] == 18.0 and sr["done"] == 18.0
    g = [(m["label"], m["t0"]) for m in gbn["tx"] if m["kind"] == "F"][6:]
    assert g == [("F2", 11.0), ("F3", 12.0), ("F4", 16.0), ("F5", 17.0)], g
    ga = [m["label"] for m in gbn["tx"] if m["kind"] == "A"]
    assert ga == ["ACK 1", "ACK 2", "ACK 6", "ACK 6", "ACK 6", "ACK 6"], ga
    sa = [m["label"] for m in sr["tx"] if m["kind"] == "A"]
    assert sa == ["ACK 0", "ACK 1", "ACK 3", "ACK 4", "ACK 5", "ACK 2"], sa
    assert gbn["delivered"] == sr["delivered"] == list(range(N))
    print("ALL CHECKS PASSED")
```
{% endraw %}
