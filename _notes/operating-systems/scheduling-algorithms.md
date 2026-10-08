---
layout: "note"
title: "스케줄링 알고리즘"
display_title: "스케줄링 알고리즘 (Scheduling Algorithms)"
kind: "concept"
kind_label: "알고리즘"
num: "44"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
updated: "2026-10-07"
status: "verified"
aliases: ["Scheduling Algorithms", "선입선출", "FCFS", "First-Come-First-Served", "라운드 로빈", "Round Robin", "RR", "최단 프로세스 우선", "SPN", "Shortest Process Next", "SJF", "최단 잔여 시간", "SRT", "Shortest Remaining Time", "최고 응답률 우선", "HRRN", "Highest Response Ratio Next", "피드백", "Feedback", "다단계 피드백 큐", "선점", "Preemptive", "비선점", "Nonpreemptive", "정규화 반환 시간", "Normalized Turnaround Time", "가상 라운드 로빈"]
description: "단기 스케줄러가 다음 프로세스를 고르는 규칙은 두 가지로 갈린다. 무엇을 보고 고르나(먼저 온 순서, 짧은 작업, 기다린 시간), 그리고 실행 중인 프로세스를 중간에 끊을 수 있나(선점)다. 은행 창구에서 번호표 순서대로만 받으면 공평하지만 짧은 용무의 손님이 오래 기다리고, 짧은…"
prev_url: "/studies/operating-systems/scheduling-types-criteria/"
prev_title: "스케줄링의 종류와 기준"
next_url: "/studies/operating-systems/burst-prediction/"
next_title: "실행 시간 예측"
math: true
mermaid: false
code_count: 1
permalink: "/studies/operating-systems/scheduling-algorithms/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

단기 스케줄러가 다음 프로세스를 고르는 규칙은 두 가지로 갈린다. 무엇을 보고 고르나(먼저 온 순서, 짧은 작업, 기다린 시간), 그리고 실행 중인 프로세스를 중간에 끊을 수 있나(선점)다. 은행 창구에서 번호표 순서대로만 받으면 공평하지만 짧은 용무의 손님이 오래 기다리고, 짧은 용무를 먼저 받으면 평균 대기는 줄지만 긴 용무의 손님이 계속 밀릴 수 있다. 모든 기준에서 이기는 알고리즘은 없다.

</div>


## 예시로 보기

슬라이드의 다섯 프로세스로 여섯 정책을 비교한다. 서비스 시간은 각 프로세스가 끝나는 데 필요한 총 실행 시간이다[^1].

| 프로세스 | A | B | C | D | E |
|---|---|---|---|---|---|
| 도착 시각 | 0 | 2 | 4 | 6 | 8 |
| 서비스 시간 | 3 | 6 | 4 | 5 | 2 |

시각 0부터 20까지 누가 실행되는지(한 글자 = 1 단위)와 결과는 다음과 같다.

| 정책 | 실행 순서 (0 → 20) | 끝나는 시각 A B C D E | 평균 반환 시간 | 평균 정규화 반환 시간 |
|---|---|---|---|---|
| FCFS | AAABBBBBBCCCCDDDDDEE | 3 9 13 18 20 | 8.60 | 2.56 |
| RR, q = 1 | AABABCBDCBEDCBEDCBDD | 4 18 17 20 15 | 10.80 | 2.71 |
| RR, q = 4 | AAABBBBCCCCDDDDBBEED | 3 17 11 20 19 | 10.00 | 2.71 |
| SPN | AAABBBBBBEECCCCDDDDD | 3 9 15 20 11 | 7.60 | 1.84 |
| SRT | AAABCCCCEEBBBBBDDDDD | 3 15 8 20 10 | 7.20 | 1.59 |
| HRRN | AAABBBBBBCCCCEEDDDDD | 3 9 13 20 15 | 8.00 | 2.14 |
| 피드백, q = 1 | AABACBDCEDEBCDBCDBDB | 4 20 16 19 11 | 10.00 | 2.29 |
| 피드백, q = 2ⁱ | AABACBBDECCDDEBBBCDD | 4 17 18 20 14 | 10.60 | 2.63 |

**반환 시간** $$T_r$$은 끝난 시각 − 도착 시각이다. **정규화 반환 시간** $$T_r / T_s$$는 반환 시간을 서비스 시간 $$T_s$$로 나눈 값으로, "일한 시간에 비해 얼마나 오래 시스템에 있었나"다. 1이면 기다리지 않은 것이다[^2]. 예: FCFS에서 E는 2만큼 일하려고 8에 도착해 20에 끝났다. $$T_r = 12$$, $$T_r/T_s = 6$$이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 실행 순서, 끝나는 시각, 평균값을 시뮬레이터로 재현해 Stallings 표 9.5와 모두 일치. 예제 사다리의 답 — [44_scheduling_impl.py](/Hongs_Blog/studies/operating-systems/code/44_scheduling_impl/)</div>

</div>


## 정확히 말하면

정책은 두 가지로 정한다[^3].

**선택 함수.** 준비 상태의 프로세스 중 누구를 고를지 정한다. 실행 특성으로 고른다면 다음 양을 쓴다.

- $$w$$: 지금까지 시스템에서 기다린 시간
- $$e$$: 지금까지 실행한 시간
- $$s$$: 필요한 총 서비스 시간($$e$$ 포함). 보통 추정해야 한다.

**결정 방식.** 선택 함수를 언제 적용하는가[^4].

| | 비선점 | 선점 |
|---|---|---|
| 뜻 | 실행 상태가 되면 끝나거나 입출력으로 스스로 막힐 때까지 계속 실행한다 | 운영체제가 실행 중인 프로세스를 끊고 준비 상태로 돌릴 수 있다 |
| 언제 끊나 | 끊지 않음 | 새 프로세스 도착, 인터럽트, 또는 주기적으로 |

### 여섯 정책

| 정책 | 선택 함수 | 결정 방식 | 핵심 |
|---|---|---|---|
| FCFS (선입선출) | $$\max[w]$$: 준비 큐에 가장 오래 있던 것 | 비선점 | 짧은 프로세스가 아주 오래 기다릴 수 있다. 프로세서 위주 프로세스에 유리하고 입출력 위주 프로세스에 불리하다[^5] |
| RR (라운드 로빈) | 큐 순서대로 | 선점, 시간 할당량 $$q$$마다 | 시계 인터럽트마다 실행 중인 프로세스를 준비 큐 뒤로 보낸다. 시간 조각(time slicing)이라고도 한다[^6] |
| SPN (최단 프로세스 우선) | $$\min[s]$$: 예상 처리 시간이 가장 짧은 것 | 비선점 | 짧은 프로세스가 긴 프로세스를 앞지른다. 긴 프로세스는 예측하기 어렵고 굶을 수 있다. 추정이 틀리면 운영체제가 작업을 중단할 수 있다[^7] |
| SRT (최단 잔여 시간) | $$\min[s - e]$$: 남은 시간이 가장 짧은 것 | 선점, 새 프로세스가 올 때 | SPN의 선점형. 처리 시간을 추정해야 한다[^8] |
| HRRN (최고 응답률 우선) | $$\max[(w + s)/s]$$ | 비선점 | 아래 설명[^9] |
| 피드백 | 아래 설명 | 선점, 시간 할당량마다 | 남은 시간을 모를 때 쓴다[^10] |

이 표는 슬라이드 표 9.3(그림)과 각 정책 슬라이드를 정리한 것이다[^11].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 28 "When the current process ceases to execute, the longest process in the Ready queue is selected" / 문제점: "longest process"는 "가장 긴(서비스 시간이 큰) 프로세스"로 읽힌다. FCFS는 준비 큐에 **가장 오래 있던** 프로세스를 고른다. 긴 프로세스를 고르는 것은 FCFS가 아니다 / 수정안: "the process that has been in the Ready queue the longest" / 근거: 선택 함수 $$\max[w]$$(표 9.3), 예제에서 FCFS가 도착 순서 A, B, C, D, E대로 실행함

</div>


**HRRN.** 응답률 $$R = (w + s)/s$$, 곧 (기다린 시간 + 예상 서비스 시간) ÷ 예상 서비스 시간이 가장 큰 프로세스를 고른다[^9]. 분모가 작을수록 비가 커져 짧은 작업이 유리하다. 하지만 기다리기만 해도 $$w$$가 커져 비가 오르므로, 긴 프로세스도 결국 짧은 작업들을 앞지른다[^12]. 예: 시각 9에 B가 끝났을 때 C는 $$(5 + 4)/4 = 2.25$$, D는 $$(3 + 5)/5 = 1.6$$, E는 $$(1 + 2)/2 = 1.5$$라서 C를 고른다.

**피드백.** 남은 시간을 모르면 SPN, SRT, HRRN을 쓸 수 없다. 대신 지금까지 오래 실행한 프로세스에게 벌점을 준다[^13].

1. 새 프로세스는 가장 높은 큐 RQ0에 들어간다.
2. 시간 할당량을 다 써서 선점될 때마다 한 단계 낮은 큐로 내려간다.
3. 스케줄러는 늘 가장 높은 비어 있지 않은 큐에서 고르고, 같은 큐 안에서는 FCFS로 고른다. 가장 낮은 큐에서는 라운드 로빈이다.

짧은 프로세스는 높은 큐에서 금방 끝나고, 긴 프로세스는 점점 내려간다. $$q = 1$$로 하면 라운드 로빈과 비슷해지고 긴 프로세스의 반환 시간이 크게 늘어난다. 새 작업이 자주 들어오면 기아도 생긴다. 그래서 낮은 큐일수록 할당량을 늘린다. RQ$$i$$의 할당량을 $$2^i$$로 하는 식이다[^14].

### 라운드 로빈의 시간 할당량

할당량이 아주 짧으면 짧은 프로세스가 빨리 지나가지만, 인터럽트 처리와 디스패치 부담이 커진다. 할당량은 전형적인 상호작용 하나에 필요한 시간보다 약간 크게 잡는 것이 좋다. 그보다 작으면 대부분의 프로세스가 할당량 두 번이 필요하다[^15]. 할당량이 너무 크면 라운드 로빈은 FCFS가 된다[^s1].

RR은 프로세서 위주 프로세스에게 유리하다. 입출력 위주 프로세스는 할당량을 다 쓰기 전에 입출력으로 막혀 손해를 본다. **가상 라운드 로빈**은 입출력에서 풀려난 프로세스를 보조 큐에 넣고, 보조 큐를 준비 큐보다 먼저 고른다. 보조 큐에서 고른 프로세스는 할당량에서 지난번에 쓴 시간을 뺀 만큼만 실행한다[^16].

## 스스로 설명해 보기

1. SPN에서 시각 9에 E가 C보다 먼저 실행된다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   B가 끝난 시각 9에 준비 큐에는 C(4), D(5), E(2)가 있다. SPN은 서비스 시간이 가장 짧은 E를 고른다. C가 먼저 도착했지만 상관없다.
   </details>
2. SRT에서 B는 시각 4에 C에게 밀린다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   B는 시각 3에 시작해 시각 4에 남은 시간이 5다. 도착한 C의 남은 시간 4가 더 짧으므로 B를 선점한다.
   </details>
3. HRRN은 기아가 없다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   기다리는 동안 $$w$$가 계속 커지므로 $$(w + s)/s$$도 끝없이 커진다. 새로 온 짧은 작업의 비는 $$(0 + s)/s = 1$$에서 시작하므로, 오래 기다린 프로세스가 언젠가는 반드시 가장 큰 비를 갖는다.
   </details>
- 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  짧은 작업을 먼저 하면 평균 반환 시간이 준다. 하지만 짧은지 알려면 추정이 필요하고, 짧은 작업만 우대하면 긴 작업이 굶는다. 각 정책은 이 둘(짧은 작업 우대, 공평성)과 정보(서비스 시간을 아는가)의 균형점이 다르다.
  </details>
- 같은 생각을 쓰는 다른 곳은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  디스크 스케줄링(11장)의 SSTF는 SPN처럼 가까운 요청을 먼저 처리하고, 같은 기아 문제를 겪는다. 네트워크 라우터의 큐 관리도 공평성과 처리량을 맞바꾼다.
  </details>

## 활용

- 실제 운영체제는 우선순위 큐 여러 개와 피드백을 섞는다. 전통 UNIX는 우선순위 큐마다 라운드 로빈을 쓰는 다단계 피드백이다 → [공정 분배와 UNIX 스케줄링](/Hongs_Blog/studies/operating-systems/fair-share-unix-scheduling/)
- FCFS는 단일 프로세서에서 혼자 쓰기에는 좋지 않지만, 우선순위 큐마다 FCFS로 고르는 식으로 우선순위와 섞으면 효과적이다[^5].
- SPN, SRT, HRRN에 필요한 서비스 시간은 과거 실행 시간으로 추정한다 → [실행 시간 예측](/Hongs_Blog/studies/operating-systems/burst-prediction/)
- 서비스 시간과 상관없이 다음 프로세스를 고르는 정책은 모두 같은 큐잉 관계식을 따른다. 정책 사이에 차이가 생기는 것은 서비스 시간으로 우선순위를 나눌 때다(그림 9.11~9.14)[^17].
- 계산 연습: [스케줄링 예제 사다리](/Hongs_Blog/studies/operating-systems/scheduling-ladder/)

## 연결

- 선수: [스케줄링의 종류와 기준](/Hongs_Blog/studies/operating-systems/scheduling-types-criteria/)
- 시간 할당과 타이머 인터럽트: [시분할](/Hongs_Blog/studies/operating-systems/time-sharing/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"라운드 로빈은 할당량이 작을수록 좋다"</div>

틀렸다. 자주 바꿀수록 모두가 공평하게 빨리 차례를 받는 것처럼 보인다. 하지만 바꿀 때마다 인터럽트 처리와 디스패치에 시간이 들고, 상호작용 하나를 끝내는 데 할당량이 여러 번 필요해져 오히려 응답이 느려진다. 표에서도 q = 1의 평균 반환 시간 10.80이 q = 4의 10.00보다 크다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"SPN은 짧은 작업을 먼저 하니 늘 가장 좋다"</div>

틀렸다. 평균 반환 시간이 FCFS보다 크게 줄어드는 것은 맞다(8.60 → 7.60). 하지만 실제 서비스 시간을 미리 알 수 없어 추정해야 하고, 짧은 작업이 계속 들어오면 긴 작업은 굶는다. 비선점이라 막 도착한 짧은 작업도 기다려야 해서, 선점형인 SRT(7.20)보다 못하다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> FCFS, RR, SPN, SRT, HRRN의 선택 함수와 선점 여부를 쓰라.</summary>


**답:** FCFS: 가장 오래 기다린 것, 비선점. RR: 큐 순서, 할당량마다 선점. SPN: 서비스 시간이 가장 짧은 것, 비선점. SRT: 남은 시간이 가장 짧은 것, 새 도착 때 선점. HRRN: $$(w + s)/s$$가 가장 큰 것, 비선점.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 예시의 다섯 프로세스로 RR(q = 4)을 따라가라. 시각 7에 C가 시작한다. 그 시각에 준비 큐에는 누가 어떤 순서로 있는가?</summary>


**답:** D, B 순서. B는 시각 3에 시작해 시각 7에 할당량 4를 다 써서 큐 뒤로 간다. 같은 시각 6에 도착한 D가 이미 큐에 있으므로 D가 앞이다. C는 시각 4에 도착해 B가 끝나기를 기다리던 맨 앞이었다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 시각 13에 HRRN이 다음 프로세스를 고른다. 대기 중인 D(도착 6, 서비스 5)와 E(도착 8, 서비스 2)의 응답률은? 누구를 고르는가?</summary>


**답:** D: $$(7 + 5)/5 = 2.4$$. E: $$(5 + 2)/2 = 3.5$$. E를 고른다. 표의 HRRN 순서에서 C 다음에 E가 오는 것과 같다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 피드백 정책이 서비스 시간을 몰라도 짧은 작업을 우대할 수 있는 이유는?</summary>


**답:** 지금까지 실행한 시간을 기준으로 삼기 때문이다. 짧은 작업은 높은 큐에서 할당량 몇 번 안에 끝난다. 오래 실행한 작업은 선점될 때마다 낮은 큐로 내려가 뒤로 밀린다. "많이 실행했다"를 "길다"의 신호로 쓴다.

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> 대화형 사용자가 많은 시분할 시스템에서 FCFS와 RR 중 무엇이 맞는가? 왜?</summary>


**답:** RR. 대화형 시스템의 목표는 응답 시간이다. FCFS는 긴 작업 하나가 프로세서를 쥐면 그동안 모든 사용자가 응답을 받지 못한다. RR은 할당량마다 차례를 돌려 누구나 짧은 시간 안에 프로세서를 받는다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/09.Chapter09-new.pptx, 슬라이드 27 (표 9.4)
[^2]: 같은 자료, 슬라이드 51 (그림 9.14). 실행 순서와 결과값은 표 9.4의 프로세스로 그림 9.5·표 9.5와 같은 방식으로 계산했다.
[^3]: 같은 자료, 슬라이드 24
[^4]: 같은 자료, 슬라이드 25~26
[^5]: 같은 자료, 슬라이드 28~29와 슬라이드 28의 발표자 노트
[^6]: 같은 자료, 슬라이드 30~31
[^7]: 같은 자료, 슬라이드 35~36과 슬라이드 34~35의 발표자 노트
[^8]: 같은 자료, 슬라이드 42
[^9]: 같은 자료, 슬라이드 43 (식)
[^10]: 같은 자료, 슬라이드 44
[^11]: 같은 자료, 슬라이드 23 (표 9.3)
[^12]: 같은 자료, 슬라이드 42의 발표자 노트
[^13]: 같은 자료, 슬라이드 43의 발표자 노트와 슬라이드 44 (그림 9.10)
[^14]: 같은 자료, 슬라이드 44의 발표자 노트와 슬라이드 45
[^15]: 같은 자료, 슬라이드 32~33 (그림 9.6)과 슬라이드 32의 발표자 노트
[^16]: 같은 자료, 슬라이드 34 (그림 9.7)와 슬라이드 33의 발표자 노트
[^17]: 같은 자료, 슬라이드 46~51과 슬라이드 45~46의 발표자 노트
[^s1]: 에이전트 보충. 은행 창구 비유, HRRN 시각 9 계산, "할당량이 너무 크면 FCFS", 스스로 설명해 보기의 근거, 디스크 스케줄링 연결, 확인 문제 C2~C5는 슬라이드에 없다. 실행 순서는 Stallings 6판 그림 9.5와 같은 규칙(같은 시각에는 새로 도착한 프로세스가 선점된 프로세스보다 먼저 큐에 섬)으로 계산했다.
{% endraw %}
