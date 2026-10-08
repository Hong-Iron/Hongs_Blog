---
layout: "note"
title: "우선순위 역전"
display_title: "우선순위 역전 (Priority Inversion)"
kind: "concept"
kind_label: "모델"
num: "50"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
updated: "2026-10-08"
status: "verified"
aliases: ["Priority Inversion", "무한 우선순위 역전", "Unbounded Priority Inversion", "우선순위 상속", "Priority Inheritance", "우선순위 상한", "Priority Ceiling"]
description: "우선순위 역전은 우선순위가 높은 작업이 낮은 작업을 기다리게 되는 상황이다. 급한 손님이 화장실 앞에서 기다리는데, 안에 있는 사람이 느긋한 사람이라서가 아니라 중간에 끼어든 다른 일들 때문에 나오지 못하는 것과 같다. 공유 자원의 잠금을 낮은 작업이 쥐고 있으면 생긴다. 잠금을 …"
prev_url: "/studies/operating-systems/real-time-scheduling/"
prev_title: "실시간 스케줄링"
next_url: "/studies/operating-systems/io-devices-design/"
next_title: "입출력 장치와 입출력 설계"
math: false
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/priority-inversion/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

우선순위 역전은 우선순위가 높은 작업이 낮은 작업을 기다리게 되는 상황이다. 급한 손님이 화장실 앞에서 기다리는데, 안에 있는 사람이 느긋한 사람이라서가 아니라 중간에 끼어든 다른 일들 때문에 나오지 못하는 것과 같다. 공유 자원의 잠금을 낮은 작업이 쥐고 있으면 생긴다. 잠금을 쥔 동안 낮은 작업의 우선순위를 잠시 올려 주면(우선순위 상속) 기다림이 짧게 묶인다.

</div>


## 예시로 보기

우선순위 T1 > T2 > T3인 작업 셋이 있고, T1과 T3가 세마포어 s로 보호한 자원을 함께 쓴다[^1].

| 시각 | 일어난 일 |
|---|---|
| t1 | T3 시작 |
| t2 | T3가 s를 잠그고 임계 구역에 들어감 |
| t3 | T1이 준비되어 T3를 선점함 |
| t4 | T1이 임계 구역에 들어가려다 s가 잠겨 막힘. T3가 다시 실행됨 |
| t5 | **T2가 준비되어 T3를 선점함** (T2 > T3) |
| … | T2가 도는 동안 T3는 s를 풀지 못하고, T1은 계속 기다림 |

T1은 자기보다 낮은 T2가 끝날 때까지 기다린다. T2 같은 작업이 여럿이면 기다림이 끝없이 늘어난다. 이것이 **무한 우선순위 역전**이다. 역전 시간이 공유 자원을 쓰는 시간뿐 아니라, 상관없는 다른 작업들의 예측할 수 없는 행동에 달려 있다[^2].

1997년 화성 탐사선 Mars Pathfinder가 이 문제로 시스템이 거듭 재시작되는 일을 겪었다[^s1].

## 정확히 말하면

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**우선순위 역전**은 우선순위 기반 선점 스케줄링에서, 시스템 사정 때문에 높은 우선순위 작업이 낮은 우선순위 작업을 기다리게 되는 상황이다[^3].

</div>


단순한 역전은 피할 수 없고 큰 문제도 아니다. 낮은 작업이 자원을 쥐고 있으면 높은 작업은 막혀야 한다. 낮은 작업이 곧 자원을 풀면 높은 작업은 금방 이어 가고, 실시간 제약을 어기지 않을 수 있다[^3]. 문제는 기다림의 길이가 묶이지 않을 때다.

**우선순위 상속.** 낮은 작업이 높은 작업과 함께 쓰는 자원을 쥐고 있으면, 그 자원을 기다리는 높은 작업의 우선순위를 물려받는다. 높은 작업이 그 자원에서 막히는 순간 바뀌고, 낮은 작업이 자원을 풀면 끝난다[^4].

| 시각 | 우선순위 상속이 있을 때 |
|---|---|
| t4 | T1이 s에서 막힘. **T3가 즉시 T1의 우선순위를 물려받아** 임계 구역을 이어 실행 |
| t5 | T2가 준비되지만, T3의 우선순위가 이제 더 높아 선점하지 못함 |
| t6 | T3가 임계 구역을 나와 s를 풀고 원래 우선순위로 돌아감. T1이 T3를 선점해 s를 잠그고 임계 구역에 들어감 |
| t7 | T1이 T2와 무관한 이유로 멈추면 그제야 T2가 실행됨 |

T1의 기다림은 T3가 임계 구역을 끝내는 시간으로 묶인다.

**우선순위 상한.** 자원마다 그 자원을 쓸 수 있는 작업 중 가장 높은 우선순위보다 하나 높은 상한을 정해 둔다. 작업이 자원을 잠그면 곧바로 그 상한 우선순위로 올라간다. 높은 작업이 막힐 때까지 기다리지 않고 미리 올린다[^s1].

## 활용

- POSIX 뮤텍스는 우선순위 상속(`PTHREAD_PRIO_INHERIT`)과 상한(`PTHREAD_PRIO_PROTECT`)을 고를 수 있다[^s1].
- Windows는 굶는 낮은 우선순위 스레드의 우선순위를 잠시 15까지 올려 준다. 우선순위 역전을 막는 장치이기도 하다[^5].

## 연결

- 선수: [실시간 스케줄링](/Hongs_Blog/studies/operating-systems/real-time-scheduling/), [세마포어](/Hongs_Blog/studies/operating-systems/semaphore/)
- 헷갈리는 개념: [교착상태](/Hongs_Blog/studies/operating-systems/deadlock/). 우선순위 역전은 언젠가 풀리지만(T2가 끝나면) 늦어서 문제이고, 교착상태는 영원히 풀리지 않는다.

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 우선순위 상속이 없을 때, 위 예에서 t5에 T2가 준비된 직후 T1, T2, T3는 각각 어떤 상태인가?</summary>


**답:** T1: s를 기다리며 대기. T2: 실행. T3: s를 쥔 채 준비(선점됨).

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 우선순위 상속이 무한 역전을 막는 원리를 T2의 입장에서 설명하라.</summary>


**답:** T1이 막히는 순간 T3가 T1의 우선순위를 받는다. 그러면 T2는 T3보다 낮아져 T3를 선점할 수 없다. T3는 끼어드는 작업 없이 임계 구역을 끝내고 s를 푼다. T1의 기다림은 T3의 임계 구역 길이로 묶인다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 우선순위 역전과 교착상태의 차이를 "언젠가 풀리는가"로 설명하라.</summary>


**답:** 우선순위 역전은 중간 우선순위 작업들이 끝나면 결국 풀린다. 다만 그 시간이 예측할 수 없이 길어 마감을 놓친다. 교착상태는 서로 기다리는 원이 생겨 바깥에서 끊지 않으면 영원히 풀리지 않는다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/10.Chapter10-new.pptx, 슬라이드 57 (그림 10.10a). 시각별 사건은 슬라이드 58 발표자 노트의 순서를 상속이 없는 경우로 옮긴 것이다.
[^2]: 같은 자료, 슬라이드 57과 발표자 노트
[^3]: 같은 자료, 슬라이드 56과 발표자 노트
[^4]: 같은 자료, 슬라이드 58 (그림 10.10b)과 발표자 노트
[^5]: 같은 자료, 슬라이드 75
[^s1]: 에이전트 보충. Mars Pathfinder 사례 설명, 우선순위 상한 프로토콜, POSIX 설정은 Stallings 6판 10.2절 "Priority Inversion"을 따랐다. 화장실 비유와 확인 문제는 슬라이드에 없다.
{% endraw %}
