---
layout: "note"
title: "58_selective-repeat_impl.py"
display_title: "58_selective-repeat_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "58"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/selective-repeat/"
parent_title: "Selective Repeat"
description: "컴퓨터 통신 · Selective Repeat 구현 코드"
sitemap: false
permalink: "/studies/computer-communication/code/58_selective-repeat_impl/"
---
{% raw %}
[Selective Repeat](/Hongs_Blog/studies/computer-communication/selective-repeat/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# Selective Repeat을 시험하고, 수신 쪽이 저장만 하는 Go-Back-N과 비교한다.
# 실행: python3 58_selective-repeat_impl.py  (표준 라이브러리만 씀)
# 순서 번호는 순환하지 않는 일련번호(0, 1, 2, …)로 센다. Selective Repeat의 ACK n은 "n번을 받았다"는 개별 ACK다.
# simulate()는 같은 문서의 그림 코드(58_selective-repeat_plot.py)와 같은 사건 시뮬레이터다.
import heapq


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


def random_faults(rng, n, p, max_try=5, max_ack=40):
    ff = {}
    for i in range(n):
        for k in range(1, max_try):
            if rng.random() < p:
                ff[(i, k)] = rng.choice(["lost", "corrupt"])
    af = {j: "lost" for j in range(max_ack) if rng.random() < p}
    return ff, af


def check_random(trials=3000, seed=11):
    """무작위 손실에서 Selective Repeat이 데이터를 순서대로 한 번씩 올리고,
    오류가 없으면 다시 보내는 프레임이 없는지 확인한다."""
    import random
    rng = random.Random(seed)
    for _ in range(trials):
        n = rng.randint(1, 10)
        w = rng.randint(1, 5)
        tf = rng.choice([0.5, 1.0, 2.0])
        tp = rng.choice([0.5, 1.0, 3.0])
        timeout = rng.choice([1.2, 1.5, 2.5]) * (tf + 2 * tp)
        ff, af = random_faults(rng, n, rng.choice([0.0, 0.2, 0.4]))
        r = simulate(n, w, w, tf, tp, timeout, proto="sr", frame_fault=ff, ack_fault=af)
        assert r["delivered"] == list(range(n))
        if not ff and not af:
            assert sum(1 for m in r["tx"] if m["kind"] == "F") == n
    return True


def resent(r):
    return [m["label"] for m in r["tx"] if m["kind"] == "F" and m["attempt"] > 1]


if __name__ == "__main__":
    loss = {(2, 1): "lost"}
    sr = simulate(6, 4, 4, 1.0, 3.0, 9.0, proto="sr", frame_fault=loss)
    gbn_store = simulate(6, 4, 4, 1.0, 3.0, 9.0, store=True, frame_fault=loss)
    # 오류 난 F2만 다시 보낸다
    assert resent(sr) == ["F2"] and sr["done"] == 18.0
    # 수신 쪽이 저장해도 누적 ACK만 보내면 송신 쪽은 F3~F5를 받았는지 모른다 → 다시 보낸다(Selective Repeat이 아님)
    assert resent(gbn_store) == ["F2", "F3", "F4", "F5"]
    acks_gbn = [m["label"] for m in gbn_store["tx"] if m["kind"] == "A"]
    acks_sr = [m["label"] for m in sr["tx"] if m["kind"] == "A"]
    assert acks_gbn[:2] == ["ACK 1", "ACK 2"] and acks_gbn[2:] == ["ACK 6"] * 4   # F3~F5가 와도 ACK가 없다
    assert acks_sr == ["ACK 0", "ACK 1", "ACK 3", "ACK 4", "ACK 5", "ACK 2"]        # F3~F5마다 개별 ACK
    # 수신 쪽 버퍼: F2가 올 때까지 F3, F4, F5를 저장해 둔다
    stored = max(len(s["store"]) for s in sr["states"] if s["who"] == "R")
    assert stored == 3
    # 개별 ACK가 사라져도 복구된다: ACK 3이 사라지면 F3도 타임아웃으로 다시 보내고, 수신 쪽은 버리고 ACK 3을 다시 보낸다
    r = simulate(6, 4, 4, 1.0, 3.0, 9.0, proto="sr", frame_fault=loss, ack_fault={2: "lost"})
    assert resent(r) == ["F2", "F3"] and r["delivered"] == list(range(6))
    # 카드 C1: 창 4, F0~F3, F1 분실 → ACK 0, 2, 3을 받고 F1만 다시, 그 뒤 ACK 1
    r = simulate(4, 4, 4, 1.0, 3.0, 9.0, proto="sr", frame_fault={(1, 1): "lost"})
    assert [m["label"] for m in r["tx"] if m["kind"] == "A"] == ["ACK 0", "ACK 2", "ACK 3", "ACK 1"]
    assert resent(r) == ["F1"] and r["delivered"] == [0, 1, 2, 3]
    # 비교 문서 카드 C1: 창 5, F0~F4, F1 오류, 받는 쪽이 저장 → Go-Back-N은 F1~F4, Selective Repeat은 F1만
    f1 = {(1, 1): "corrupt"}
    assert resent(simulate(5, 5, 5, 1.0, 3.0, 9.0, store=True, frame_fault=f1)) == ["F1", "F2", "F3", "F4"]
    assert resent(simulate(5, 5, 5, 1.0, 3.0, 9.0, proto="sr", frame_fault=f1)) == ["F1"]
    # 비교 문서 카드 C3: ACK 하나가 사라지면 Go-Back-N은 다음 누적 ACK가 메우고, Selective Repeat은 그 프레임을 다시 보낸다
    assert resent(simulate(6, 4, 4, 1.0, 3.0, 9.0, ack_fault={0: "lost"})) == []
    assert resent(simulate(6, 4, 4, 1.0, 3.0, 9.0, proto="sr", ack_fault={0: "lost"})) == ["F0"]
    assert check_random()
    print("random tests: 3000 cases, all delivered in order exactly once")
    print("ALL CHECKS PASSED")
```
{% endraw %}
