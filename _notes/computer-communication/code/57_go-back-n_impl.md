---
layout: "note"
title: "57_go-back-n_impl.py"
display_title: "57_go-back-n_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "57"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/go-back-n/"
parent_title: "Go-Back-N"
description: "컴퓨터 통신 · Go-Back-N 구현 코드"
sitemap: false
permalink: "/studies/computer-communication/code/57_go-back-n_impl/"
---
{% raw %}
[Go-Back-N](/Hongs_Blog/studies/computer-communication/go-back-n/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# Go-Back-N의 구현 옵션을 시험한다.
# 실행: python3 57_go-back-n_impl.py  (표준 라이브러리만 씀)
# 순서 번호는 순환하지 않는 일련번호(0, 1, 2, …)로 센다. 데이터 n을 받으면 ACK n+1(누적 ACK)이다.
# simulate()는 같은 문서의 그림 코드(57_go-back-n_plot.py)와 같은 사건 시뮬레이터다.
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
    """프레임마다 앞의 max_try-1번까지는 확률 p로 사라지거나 망가지고, ACK도 앞 max_ack개 중 확률 p로 사라진다.
    마지막 시도와 그 뒤의 ACK는 사라지지 않게 해서 언젠가는 끝나게 한다."""
    ff = {}
    for i in range(n):
        for k in range(1, max_try):
            if rng.random() < p:
                ff[(i, k)] = rng.choice(["lost", "corrupt"])
    af = {j: "lost" for j in range(max_ack) if rng.random() < p}
    return ff, af


OPTIONS = [(store, ack, rs) for store in (False, True) for ack in (False, True) for rs in ("each", "all")]


def check_options(trials=3000, seed=7):
    """주장: 수신 쪽 옵션(저장/버림 × 중복 ACK 보냄/안 보냄)과 송신 쪽 옵션(각자 타임아웃/한꺼번에)을
    어떻게 골라도 오류가 복구된다. 타임아웃을 왕복보다 짧게 잡아도 결과는 같다(늦어질 뿐)."""
    import random
    rng = random.Random(seed)
    for _ in range(trials):
        n = rng.randint(1, 10)
        sws = rng.randint(1, 5)
        rws = rng.randint(1, sws)
        tf = rng.choice([0.5, 1.0, 2.0])
        tp = rng.choice([0.5, 1.0, 3.0, 5.0])
        timeout = rng.choice([0.6, 1.0, 1.5, 2.5]) * (tf + 2 * tp)
        ff, af = random_faults(rng, n, rng.choice([0.0, 0.2, 0.4]))
        for store, ack, rs in OPTIONS:
            r = simulate(n, sws, rws, tf, tp, timeout, store=store, ack_ooo=ack, resend=rs, frame_fault=ff,
                         ack_fault=af)
            assert r["delivered"] == list(range(n)), (n, sws, rws, store, ack, rs, r["delivered"])
            assert r["done"] is not None
    return True


def table():
    """문서의 표: 창 4, 프레임 6개, F2 분실(싣기 1 ms, 전파 3 ms, 타임아웃 9 ms)."""
    rows = []
    for store, ack, rs in OPTIONS:
        r = simulate(6, 4, 4, 1.0, 3.0, 9.0, store=store, ack_ooo=ack, resend=rs, frame_fault={(2, 1): "lost"})
        sends = sum(1 for m in r["tx"] if m["kind"] == "F")
        acks = sum(1 for m in r["tx"] if m["kind"] == "A")
        rows.append((store, ack, rs, sends, acks, r["done"]))
    return rows


if __name__ == "__main__":
    rows = table()
    for row in rows:
        print(row)
    want = {(False, False, "each"): (10, 6, 24.0), (False, False, "all"): (10, 6, 21.0),
            (False, True, "each"): (10, 9, 24.0), (False, True, "all"): (10, 9, 21.0),
            (True, False, "each"): (10, 6, 18.0), (True, False, "all"): (10, 6, 18.0),
            (True, True, "each"): (10, 9, 18.0), (True, True, "all"): (10, 9, 18.0)}
    for store, ack, rs, sends, acks, done in rows:
        assert want[(store, ack, rs)] == (sends, acks, done), (store, ack, rs, sends, acks, done)
    # 오류가 없으면 15 ms에 끝난다
    assert simulate(6, 4, 4, 1.0, 3.0, 9.0)["done"] == 15.0
    # 창 크기 1이면 정지 대기와 같다: 한 번에 하나씩, 왕복마다 하나
    r = simulate(3, 1, 1, 1.0, 3.0, 20.0)
    assert [m["t0"] for m in r["tx"] if m["kind"] == "F"] == [0.0, 7.0, 14.0] and r["done"] == 21.0
    # 카드 C2: 창 4, F0~F3, F1 분실. 수신 쪽이 버리든 저장하든 송신 쪽은 F1부터 다시 보낸다
    for store in (False, True):
        r = simulate(4, 4, 4, 1.0, 3.0, 9.0, store=store, frame_fault={(1, 1): "lost"})
        again = [m["label"] for m in r["tx"] if m["kind"] == "F" and m["attempt"] > 1]
        assert again == ["F1", "F2", "F3"], again
        first_acks = [m["label"] for m in r["tx"] if m["kind"] == "A"][:1]
        assert first_acks == ["ACK 1"]
    assert check_options()
    print("random option tests: 3000 cases x 8 options, all delivered in order exactly once")
    print("ALL CHECKS PASSED")
```
{% endraw %}
