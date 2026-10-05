---
layout: "note"
title: "12_multiplexing_verify.py"
display_title: "12_multiplexing_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
parent_url: "/studies/computer-communication/multiplexing/"
parent_title: "다중화"
description: "컴퓨터 통신 · 다중화 검증 코드"
permalink: "/studies/computer-communication/code/12_multiplexing_verify/"
---
{% raw %}
[다중화](/Hongs_Blog/studies/computer-communication/multiplexing/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""다중화의 DEMUX 키와 다채널 분할 검증.

문서: 12.다중화 (방식별 비교표, 원본 오류 의심 상자, 오해, 카드 C4)
주장 1: TDM은 칸 위치가 키다. 스트림에 주소를 싣지 않아도 DEMUX가 입력을 되살린다.
주장 2: FDM은 주파수가 키다. 섞인 신호에 이름표가 없어도 주파수로 걸러 입력을 되살린다.
주장 3: 통계적 다중화는 쉬는 입력의 칸을 건너뛰므로 위치로는 주인을 알 수 없다.
        조각마다 주소를 붙여야 되살린다.
주장 4: 다채널 분할에서 채널마다 지연이 다르면 도착 순서가 뒤바뀐다. 순서 번호로 되살린다.
"""
import math


# ---------- 주장 1: TDM (위치가 키) ----------
def tdm_mux(inputs):
    """inputs[i] = 입력 i의 조각 목록 (길이가 같다고 가정). 스트림에는 데이터만 싣는다."""
    return [inputs[i][c] for c in range(len(inputs[0])) for i in range(len(inputs))]


def tdm_demux(stream, n):
    return [stream[i::n] for i in range(n)]


# ---------- 주장 2: FDM (주파수가 키) ----------
def fdm_mux(amplitudes, freqs, T):
    """입력 i의 값을 주파수 freqs[i]의 진폭으로 싣고 모두 더한다. 이름표 없음."""
    return [sum(a * math.cos(2 * math.pi * f * t / T) for a, f in zip(amplitudes, freqs)) for t in range(T)]


def fdm_demux(signal, freqs, T):
    """주파수 f 성분만 걸러 낸다 (한 주기에서 서로 다른 정수 주파수의 코사인은 직교)."""
    return [2 / T * sum(y * math.cos(2 * math.pi * f * t / T) for t, y in enumerate(signal)) for f in freqs]


# ---------- 주장 3: 통계적 다중화 (주소가 키) ----------
def stat_mux(activity, inputs):
    """activity[c] = 주기 c에 데이터가 있는 입력 집합. 데이터가 있는 조각만 (주소, 데이터)로 싣는다."""
    return [(x, f"{x}{c + 1}") for c, act in enumerate(activity) for x in inputs if x in act]


def stat_demux(stream, inputs):
    return {x: [d for addr, d in stream if addr == x] for x in inputs}


# ---------- 주장 4: 다채널 분할 ----------
def split_send(chunks, delays):
    """조각 k를 채널 k mod N으로 보낸다. 반환: 도착 순서대로 (도착 시각, 순서 번호, 조각)."""
    n = len(delays)
    arrivals = [(k // n + delays[k % n], k, c) for k, c in enumerate(chunks)]
    return sorted(arrivals)


def main() -> None:
    inputs = [["a1", "a2", "a3"], ["b1", "b2", "b3"], ["c1", "c2", "c3"]]
    stream = tdm_mux(inputs)
    assert stream == ["a1", "b1", "c1", "a2", "b2", "c2", "a3", "b3", "c3"]
    assert tdm_demux(stream, 3) == inputs
    print("[OK] TDM: 주소 없이 위치만으로 3개 입력을 되살림")

    T, freqs, amps = 64, [4, 8, 12], [0.5, -1.0, 2.0]
    got = fdm_demux(fdm_mux(amps, freqs, T), freqs, T)
    assert all(abs(g - a) < 1e-9 for g, a in zip(got, amps))
    print("[OK] FDM: 이름표 없이 주파수로 걸러 진폭", [round(g, 6) for g in got], "을 되살림")

    act = [{"A", "B"}, {"B", "C"}]  # 슬라이드 그림의 두 주기
    stream = stat_mux(act, "ABCD")
    assert [d for _, d in stream] == ["A1", "B1", "B2", "C2"]
    assert stat_demux(stream, "ABCD") == {"A": ["A1"], "B": ["B1", "B2"], "C": ["C2"], "D": []}
    # 주소를 떼고 위치로 나누면 틀린다
    by_position = tdm_demux([d for _, d in stream], 4)
    assert by_position != [["A1"], ["B1", "B2"], ["C2"], []]
    print("[OK] 통계적 다중화: 주소로는 되살리고, 위치로 나누면", by_position, "로 틀림")

    chunks = [f"c{k}" for k in range(9)]
    arr = split_send(chunks, delays=[5, 1, 3])
    arrival_order = [c for _, _, c in arr]
    assert arrival_order != chunks
    assert [c for _, _, c in sorted(arr, key=lambda x: x[1])] == chunks
    print("[OK] 분할: 도착 순서", arrival_order, "-> 순서 번호로 정렬하면 원래 순서")

    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
