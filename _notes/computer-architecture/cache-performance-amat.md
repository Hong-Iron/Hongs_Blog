---
layout: "note"
title: "캐시 성능과 평균 접근 시간"
display_title: "캐시 성능과 평균 접근 시간 (Average Memory Access Time)"
kind: "concept"
kind_label: "기법"
num: "41"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Average Memory Access Time", "AMAT", "평균 메모리 접근 시간", "실패율", "Miss Rate", "적중률", "Hit Rate", "적중 시간", "Hit Time", "실패 손실", "Miss Penalty", "3C", "강제 실패", "Compulsory Miss", "용량 실패", "Capacity Miss", "충돌 실패", "Conflict Miss"]
description: "메모리를 한 번 쓰는 데 평균 얼마나 걸리는지를 숫자 하나로 잰다. 캐시에서 바로 찾을 때 걸리는 시간에, 못 찾는 비율과 못 찾았을 때 더 드는 시간을 곱해 더한다. 캐시 설계 둘을 견줄 때 이 숫자 하나로 견줄 수 있어 편하다. 다만 못 찾았을 때 드는 시간이 워낙 커서, 못 …"
prev_url: "/studies/computer-architecture/cache-replacement/"
prev_title: "캐시 교체 정책"
next_url: "/studies/computer-architecture/multilevel-cache/"
next_title: "다단계 캐시"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "41_cache-performance-amat_verify.py", "u": "/studies/computer-architecture/code/41_cache-performance-amat_verify/", "r": "검증"}]
permalink: "/studies/computer-architecture/cache-performance-amat/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

메모리를 한 번 쓰는 데 평균 얼마나 걸리는지를 숫자 하나로 잰다. 캐시에서 바로 찾을 때 걸리는 시간에, 못 찾는 비율과 못 찾았을 때 더 드는 시간을 곱해 더한다. 캐시 설계 둘을 견줄 때 이 숫자 하나로 견줄 수 있어 편하다. 다만 못 찾았을 때 드는 시간이 워낙 커서, 못 찾는 비율이 1~2%만 달라도 결과가 크게 달라진다.

</div>


## 예시로 보기

캐시 A는 실패율이 5%이고 캐시 B는 3.5%다. B가 나아 보인다. 그런데 B는 한 번 찾는 데 시간이 더 걸린다. 어느 쪽이 빠른지는 실패율만 봐서는 모른다. 찾는 시간, 실패율, 실패했을 때의 값을 한 식에 넣어야 견줄 수 있다.

캐시에서 찾는 데 1사이클, 실패율 4%, 실패하면 메모리에 다녀오느라 80사이클이 더 든다고 하자. 접근 100번을 따라가 본다.

- 100번 모두 캐시를 먼저 본다: $$100 \times 1 = 100$$사이클.
- 그중 4번은 실패해서 메모리에 다녀온다: $$4 \times 80 = 320$$사이클.
- 합 420사이클. 한 번에 평균 4.2사이클이다.

캐시에서 바로 찾으면 1사이클인데 평균은 4.2사이클이다. 100번 중 4번뿐인 실패가 전체 시간의 4분의 3을 차지한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 4.2사이클, 식이 "적중이면 적중 시간, 실패면 적중 시간 + 손실"의 평균과 같은 것, 흉내기로 잰 평균과 식의 값이 같은 것, CPI 5.1과 3.4배, 세 가지 실패 표, 카드 C2·C4 — [41_cache-performance-amat_verify.py](/Hongs_Blog/studies/computer-architecture/code/41_cache-performance-amat_verify/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 정의

먼저 세 가지 양에 이름을 붙인다.

- **적중 시간**(hit time): 캐시를 찾아보고 적중이면 데이터를 내주기까지 걸리는 시간. 적중이든 실패든 캐시는 먼저 찾아보므로 모든 접근이 이 시간을 쓴다.
- **실패율**(miss rate): 전체 접근 중 실패한 비율. 적중률은 1 − 실패율이다.
- **실패 손실**(miss penalty): 실패했을 때 아래층에서 블록을 가져오느라 **더** 드는 시간.

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

평균 접근 시간은 적중 시간에, 실패율과 실패 손실을 곱한 값을 더한 것이다[^1].

</div>


$$\text{AMAT} = \text{적중 시간} + \text{실패율} \times \text{실패 손실}$$


AMAT는 average memory access time의 머리글자다. 위 예시는 $$1 + 0.04 \times 80 = 4.2$$사이클이다. 시간 단위는 사이클이든 나노초든 세 양에 같은 것을 쓰면 된다.

### 유도

<details class="callout callout-note" markdown="1">
<summary class="callout-title" markdown="span">유도 과정</summary>

실패율을 $$m$$, 적중 시간을 $$T_h$$, 실패 손실을 $$T_p$$라 하자.
1. 적중한 접근은 $$T_h$$가 걸린다. 비율은 $$1 - m$$이다.
2. 실패한 접근은 캐시를 찾아본 시간 $$T_h$$에 가져오는 시간 $$T_p$$가 더 든다. 비율은 $$m$$이다.
3. 평균은 각 경우의 시간에 비율을 곱해 더한 것이다(기댓값).

$$(1 - m)\,T_h + m\,(T_h + T_p) = T_h - m T_h + m T_h + m T_p = T_h + m\,T_p$$

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 식에서 적중 시간에는 적중률을 곱하지 않는다.</summary>

실패한 접근도 캐시를 먼저 찾아봤다. 그래서 적중 시간은 모든 접근이 쓴다. 유도의 2단계에서 실패한 접근의 시간을 $$T_h + T_p$$로 잡은 것이 이 뜻이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 실패 손실은 "실패했을 때 걸리는 전체 시간"이 아니라 "더 드는 시간"이다.</summary>

실패한 접근의 전체 시간은 $$T_h + T_p$$다. 문제에서 "실패하면 모두 합쳐 100사이클"이라고 주면 손실은 $$100 - T_h$$로 잡아야 한다. 문제마다 어느 쪽 뜻인지 먼저 확인한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 유도의 3단계에서 평균을 "시간 × 비율의 합"으로 구해도 되는 까닭은?</summary>

접근 $$N$$번 중 $$(1-m)N$$번이 $$T_h$$, $$mN$$번이 $$T_h + T_p$$를 쓴다. 전체 시간을 $$N$$으로 나누면 $$N$$이 사라지고 비율만 남는다. 예시에서 100번을 직접 센 것과 같은 계산이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 식의 핵심 아이디어는?</summary>

드물지만 비싼 일의 값을 "비율 × 값"으로 평균에 얹는다. 실패율이 작아도 손실이 크면 곱이 적중 시간보다 커진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 곳은?</summary>

[TLB](/Hongs_Blog/studies/operating-systems/tlb/)의 유효 접근 시간(TLB 실패 때 페이지 표를 한 번 더 읽는다), 분기 예측이 틀렸을 때 버리는 사이클을 CPI에 얹는 계산([제어 해저드와 분기 예측](/Hongs_Blog/studies/computer-architecture/control-hazard-branch-prediction/)).

</details>


## 프로그램 전체 시간에 얹기

AMAT는 메모리 접근 한 번의 평균이다. 프로그램이 얼마나 느려지는지는 [CPU 시간 식](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/)의 CPI에 얹어서 본다. 실패하면 프로세서가 멈춰 기다리므로, 그 사이클이 명령어마다 평균 얼마씩 붙는지 센다[^2].

$$\text{실제 CPI} = \text{기본 CPI} + \underbrace{\text{명령어 캐시 실패율} \times \text{실패 손실}}_{\text{명령어를 가져올 때}} + \underbrace{\text{메모리 명령 비율} \times \text{데이터 캐시 실패율} \times \text{실패 손실}}_{\text{lw, sw가 데이터를 쓸 때}}$$


기본 CPI는 캐시가 한 번도 실패하지 않을 때의 CPI다. 모든 명령어는 가져올 때 메모리를 한 번 쓰고, `lw`·`sw`만 데이터 때문에 한 번 더 쓴다. 그래서 둘째 항에만 "메모리 명령 비율"이 곱해진다.

**대표 문제 1.** 기본 CPI 1.5, 명령어 캐시 실패율 1.5%, 데이터 캐시 실패율 5%, 명령어의 30%가 `lw`나 `sw`, 실패 손실 120사이클이다.

1. *명령어 쪽에서 멈추는 사이클:* $$0.015 \times 120 = 1.8$$.
2. *데이터 쪽에서 멈추는 사이클:* $$0.30 \times 0.05 \times 120 = 1.8$$.
3. *실제 CPI:* $$1.5 + 1.8 + 1.8 = 5.1$$.
4. *캐시가 완벽할 때와 견주기:* $$5.1 \div 1.5 = 3.4$$. 실패 때문에 3.4배 느리다.

여기서 프로세서만 두 배 빠르게 만들어 기본 CPI를 0.75로 낮추면 실제 CPI는 $$0.75 + 3.6 = 4.35$$다. 전체는 $$5.1 \div 4.35 \approx 1.17$$배밖에 안 빨라진다. 프로세서가 빨라질수록 메모리에서 기다리는 시간의 몫이 커진다. [암달의 법칙](/Hongs_Blog/studies/computer-architecture/amdahls-law/)이 말하는 그대로다.

**대표 문제 2.** 실패 손실이 20 ns인 자리에 넣을 캐시를 고른다. 직접 사상은 적중 시간 1.0 ns에 실패율 5%, 2-way는 적중 시간 1.2 ns에 실패율 3.5%다.

1. *직접 사상:* $$1.0 + 0.05 \times 20 = 2.0$$ ns.
2. *2-way:* $$1.2 + 0.035 \times 20 = 1.9$$ ns. 2-way가 빠르다.
3. *손실이 5 ns로 줄면:* 직접 사상 $$1.25$$ ns, 2-way $$1.375$$ ns. 순서가 뒤집힌다.

실패율이 낮은 쪽이 늘 이기는 것이 아니다. 실패 손실이 작으면 적중 시간이 짧은 쪽이 이긴다. 바로 뒤에 큰 캐시가 받쳐 주는 [다단계 캐시](/Hongs_Blog/studies/computer-architecture/multilevel-cache/)의 첫 단계가 이런 자리다.

**이 기법을 알아보는 신호.** 문제에 "실패율", "실패 손실", "적중 시간"이 수치로 나오고 평균 시간이나 CPI를 묻는다. 두 설계 중 어느 쪽이 빠른지 묻는다.

## 세 가지 실패

실패율을 낮추려면 실패가 왜 났는지 알아야 한다. 원인에 따라 고치는 손잡이가 다르다. 실패를 세 가지로 가른다[^3].

| 종류 | 왜 났나 | 줄이는 법 |
|---|---|---|
| 강제 실패 (compulsory) | 그 블록을 처음 건드렸다. 캐시가 아무리 커도 난다 | 블록을 키운다(이웃이 딸려 온다) |
| 용량 실패 (capacity) | 프로그램이 쓰는 블록이 캐시에 다 들어가지 않는다 | 캐시를 키운다 |
| 충돌 실패 (conflict) | 캐시에 빈 곳이 있는데도, 같은 줄(집합)을 쓰는 블록끼리 서로 쫓아냈다 | way 수를 늘린다. 캐시를 키운다 |

**흉내기로 가르는 법.** 같은 접근열을 캐시 셋에 넣고 실패 수를 뺀다[^4].

1. 아무것도 쫓아내지 않는 무한히 큰 캐시의 실패 수 = 강제 실패.
2. 크기가 같은 완전 연관 캐시의 실패 수 − 강제 실패 = 용량 실패.
3. 실제 캐시의 실패 수 − 같은 크기 완전 연관 캐시의 실패 수 = 충돌 실패.

[직접 사상 캐시](/Hongs_Blog/studies/computer-architecture/direct-mapped-cache/)의 예시(실패 7번)를 가르면 강제 4, 용량 0, 충돌 3이다. 처음 건드린 블록이 4개이고, 나머지 3번은 5번 줄 하나를 두고 서로 쫓아낸 것이다.

배열 하나를 차례로 읽으며 멀리 떨어진 변수 4개를 돌아가며 쓰는 접근 4,096번으로 구성을 바꿔 가며 갈랐다.

| 구성 | 강제 | 용량 | 충돌 | 합 |
|---|---|---|---|---|
| 직접 사상, 256바이트, 블록 32바이트 | 256 | 0 | 557 | 813 |
| 2-way, 256바이트, 블록 32바이트 | 256 | 0 | 0 | 256 |
| 직접 사상, 512바이트, 블록 32바이트 | 256 | 0 | 269 | 525 |
| 직접 사상, 256바이트, 블록 64바이트 | 128 | 1,988 | 506 | 2,622 |

- 첫 줄에서 둘째 줄: way를 늘리자 충돌 실패만 사라졌다.
- 첫 줄에서 셋째 줄: 캐시를 두 배로 키워도 충돌이 반쯤 남는다. 이 접근에는 way를 늘리는 쪽이 낫다.
- 첫 줄에서 넷째 줄: 블록을 키우자 강제 실패는 반으로 줄었지만, 줄이 4개로 줄어 용량 실패가 쏟아졌다.

**이 가르기의 한계.** 셋째 단계의 뺄셈은 음수가 될 수 있다. 8줄 캐시에 블록 9개를 차례로 되풀이해 180번 읽으면 직접 사상은 47번, 같은 크기 완전 연관(가장 오래 안 쓴 것을 내보냄)은 180번 실패한다. 식대로 하면 충돌 실패가 −133이다. 완전 연관 캐시가 "충돌이 없는 가장 좋은 캐시"라는 가정이 교체 규칙 때문에 깨진 것이다. 세 가지 실패는 원인을 짐작하는 도구이지 정확한 회계가 아니다.

## 활용

- 손으로 실패를 세는 연습: [캐시 적중과 실패 추적 예제 사다리](/Hongs_Blog/studies/computer-architecture/cache-tracing-ladder/). CPI 계산 연습은 [CPU 시간 계산 예제 사다리](/Hongs_Blog/studies/computer-architecture/cpu-time-ladder/)와 이어진다.
- 설계 손잡이와 AMAT의 세 항.

| 손잡이 | 적중 시간 | 실패율 | 실패 손실 |
|---|---|---|---|
| 캐시를 키운다 | 늘 수 있다 | 준다 | |
| way를 늘린다 | 늘 수 있다 | 준다(충돌) | |
| 블록을 키운다 | | 줄다가 다시 는다 | 는다 |
| 뒤에 캐시를 하나 더 둔다 | | | 준다 |

- 흔한 실수.
    - 적중 시간에 적중률을 곱한다.
    - 데이터 캐시 쪽 항에 메모리 명령 비율을 빼먹는다.
    - 실패율을 %인 채로 곱한다(4%는 0.04다).
    - 실패율과 적중률을 바꿔 넣는다.

## 연결

- 선수: [직접 사상 캐시](/Hongs_Blog/studies/computer-architecture/direct-mapped-cache/), [집합 연관 캐시](/Hongs_Blog/studies/computer-architecture/set-associative-cache/), [CPU 시간 식](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/)
- 실패 손실을 줄이는 법: [다단계 캐시](/Hongs_Blog/studies/computer-architecture/multilevel-cache/)
- 실패했을 때 파이프라인이 멈추는 방식: [적재-사용 해저드와 스톨](/Hongs_Blog/studies/computer-architecture/load-use-stall/)
- 같은 꼴의 식: [TLB](/Hongs_Blog/studies/operating-systems/tlb/)의 유효 접근 시간

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"적중률 99%와 97%는 거의 같다"</div>

틀렸다. 두 숫자가 2%포인트밖에 안 달라서 비슷해 보인다. 하지만 식에 들어가는 것은 적중률이 아니라 실패율이고, 실패율은 1%와 3%로 세 배 차이다. 적중 시간 1사이클, 실패 손실 100사이클이면 평균 접근 시간은 $$1 + 0.01 \times 100 = 2$$사이클과 $$1 + 0.03 \times 100 = 4$$사이클로 두 배다. 캐시 성능은 적중률이 아니라 실패율로 견준다. 확인하는 법: 두 실패율을 식에 넣어 본다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 평균 접근 시간의 식을 쓰고, 세 양의 뜻을 한 구절씩 쓰라.</summary>

**답:** AMAT = 적중 시간 + 실패율 × 실패 손실. 적중 시간: 캐시를 찾아보는 시간(모든 접근이 쓴다). 실패율: 접근 중 실패한 비율. 실패 손실: 실패했을 때 아래층에서 가져오느라 더 드는 시간.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 적중 시간 2사이클, 실패율 5%, 실패 손실 60사이클인 캐시의 평균 접근 시간은? 실패율을 반으로 줄이면 얼마가 되는가?</summary>

**답:** $$2 + 0.05 \times 60 = 5$$사이클. 실패율 2.5%면 $$2 + 0.025 \times 60 = 3.5$$사이클.<br>
**흔한 오답:** $$0.95 \times 2 + 0.05 \times 60 = 4.9$$. 실패한 접근도 캐시를 먼저 찾아봤으므로 적중 시간에는 적중률을 곱하지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 실패는 세 가지 중 무엇인가? (가) 프로그램이 시작하고 배열의 첫 원소를 읽었다. (나) 캐시의 절반이 비어 있는데, 같은 줄로 가는 두 배열을 번갈아 읽어 매번 실패한다. (다) 캐시보다 네 배 큰 배열을 처음부터 끝까지 두 번 읽는데, 두 번째 바퀴에서도 실패한다.</summary>

**답:** (가) 강제 실패. (나) 충돌 실패. (다) 용량 실패.<br>
**이유:** (가)는 처음 건드린 블록이라 캐시가 아무리 커도 난다. (나)는 자리가 남는데도 났으니 자리의 수가 아니라 자리를 고르는 방식의 문제다. way를 늘리면 없어진다. (다)는 완전 연관이어도 다 못 담으니 캐시를 키워야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 기본 CPI 2, 명령어 캐시 실패율 2%, 데이터 캐시 실패율 4%, 명령어의 25%가 메모리를 읽거나 쓰고, 실패 손실은 100사이클이다. 실제 CPI는?</summary>

**답:** $$2 + 0.02 \times 100 + 0.25 \times 0.04 \times 100 = 2 + 2 + 1 = 5$$.<br>
**흔한 오답:** 데이터 쪽을 $$0.04 \times 100 = 4$$로 계산해 8이라고 답하는 것. 데이터 캐시는 메모리 명령일 때만 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 실패율이 더 낮은 캐시가 평균 접근 시간에서 질 수 있는 까닭을 식의 항으로 설명하라.</summary>

**답:** 식에는 항이 둘이다. 실패율을 낮추려고 캐시를 키우거나 way를 늘리면 적중 시간이 는다. 실패율 × 실패 손실이 줄어든 양보다 적중 시간이 늘어난 양이 크면 합이 커진다. 실패 손실이 작을수록 이런 일이 생기기 쉽다.

</details>


[^1]: MIT 6.004 Computation Structures, Fall 2023, L13 "Caches", 슬라이드 6, 22 (AMAT = HitTime + MissRatio × MissPenalty), https://shd.mit.edu/2024/lectures/readings/6191-fall2023/L13.pdf
[^2]: Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 5장 "Large and Fast: Exploiting Memory Hierarchy" (캐시 실패로 멈춘 사이클을 CPU 시간에 더하는 계산). 수치는 새로 만들었다.
[^3]: ShanghaiTech CS 110 Computer Architecture (UC Berkeley CS61C 슬라이드 기반), 2022, "Caches Part II", 슬라이드 27 (Understanding Cache Misses: The 3Cs), https://robotics.shanghaitech.edu.cn/courses/ca/22s/lectures/2022-CA-L17_Caches_II.pdf
[^4]: 같은 자료, 슬라이드 29 (How to Calculate 3C's using Cache Simulator). University of Utah CS 3810, Lecture 20, 슬라이드 9 (Types of Cache Misses: 무한 캐시의 실패, 완전 연관 캐시의 실패, 완전 연관에서 직접 사상으로 갈 때 생기는 실패), https://users.cs.utah.edu/~rajeev/cs3810/slides/3810-20.pdf
{% endraw %}
