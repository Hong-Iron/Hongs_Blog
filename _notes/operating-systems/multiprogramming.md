---
layout: "note"
title: "다중 프로그래밍"
display_title: "다중 프로그래밍 (Multiprogramming)"
kind: "concept"
kind_label: "모델"
num: "11"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Multiprogramming", "멀티프로그래밍", "다중 작업", "Multitasking", "단일 프로그래밍", "Uniprogramming", "다중 프로그래밍 배치 시스템", "Multiprogrammed Batch System", "프로세서 사용률", "CPU Utilization"]
description: "다중 프로그래밍은 프로그램 여러 개를 메모리에 함께 올려 두고, 하나가 입출력을 기다리면 그사이 다른 하나를 실행하는 방식이다. 빨래가 돌아가는 동안 설거지를 하는 것과 같다. 입출력은 프로세서보다 훨씬 느려서, 프로그램 하나만 올리면 프로세서는 대부분의 시간을 기다리며 보낸다. …"
prev_url: "/studies/operating-systems/user-kernel-mode/"
prev_title: "사용자 모드와 커널 모드"
next_url: "/studies/operating-systems/time-sharing/"
next_title: "시분할"
math: true
mermaid: false
code_count: 2
permalink: "/studies/operating-systems/multiprogramming/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

다중 프로그래밍은 프로그램 여러 개를 메모리에 함께 올려 두고, 하나가 입출력을 기다리면 그사이 다른 하나를 실행하는 방식이다. 빨래가 돌아가는 동안 설거지를 하는 것과 같다. 입출력은 프로세서보다 훨씬 느려서, 프로그램 하나만 올리면 프로세서는 대부분의 시간을 기다리며 보낸다. 대신 메모리가 더 필요하고, 여러 프로그램이 서로의 메모리를 건드리지 못하게 막아야 하며, 다음에 누구를 실행할지 정해야 한다.

</div>


## 예시로 보기

파일에서 레코드를 하나씩 읽어 처리하고 다시 쓰는 프로그램이 있다. 레코드 하나당 명령어 100개를 실행한다[^1].

| 하는 일 | 걸리는 시간 |
|---|---|
| 레코드 하나 읽기 | 15 µs |
| 명령어 100개 실행 | 1 µs |
| 레코드 하나 쓰기 | 15 µs |
| 합계 | 31 µs |

프로세서가 실제로 일하는 시간은 31 µs 중 1 µs다. 사용률은 $$1/31 \approx 0.032$$, 즉 3.2%다. 100초 가운데 97초 가까이 입출력을 기다린다[^1].

이 낭비는 피할 수 있다. 메모리에 프로그램을 두 개 올려 두면, A가 입출력을 기다리는 동안 B를 실행한다. 세 개, 네 개로 늘리면 쉬는 시간이 더 줄어든다[^2].

| 시각 | 0~1 | 1~2 | 2~3 | 3~4 | 4~5 |
|---|---|---|---|---|---|
| A | **실행** | 대기 | 대기 | 대기 | **실행** |
| B | | **실행** | 대기 | 대기 | 대기 |
| C | | | **실행** | 대기 | 대기 |
| 프로세서 | A | B | C | 쉼 | A |

위 표처럼 A, B, C가 번갈아 실행되면 프로세서는 0~3 구간 내내 일한다. 프로그램이 하나뿐이었다면 A가 실행하는 0~1만 일하고 1~4는 놀았을 것이다[^s1].

## 정확히 말하면

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**단일 프로그래밍**(uniprogramming)은 메모리에 사용자 프로그램을 하나만 둔다. 프로세서는 그 프로그램이 입출력 명령어에 이르면 입출력이 끝날 때까지 기다린다[^3].<br>
**다중 프로그래밍**(multiprogramming, multitasking)은 운영체제와 함께 사용자 프로그램 여러 개를 메모리에 둔다. 한 작업이 입출력을 기다려야 하면 프로세서는 기다리지 않는 다른 작업으로 넘어간다[^2]. 현대 운영체제의 중심 주제다[^4].

</div>


### 슬라이드 예: 작업 세 개

사용 가능한 메모리 250 MB, 디스크, 터미널, 프린터가 있는 컴퓨터에 세 작업이 동시에 들어온다[^5].

| | JOB1 | JOB2 | JOB3 |
|---|---|---|---|
| 성격 | 계산 위주 | 입출력 위주 | 입출력 위주 |
| 걸리는 시간 | 5분 | 15분 | 10분 |
| 필요한 메모리 | 50 MB | 100 MB | 75 MB |
| 디스크 | 아니오 | 아니오 | 예 |
| 터미널 | 아니오 | 예 | 아니오 |
| 프린터 | 아니오 | 아니오 | 예 |

세 작업이 쓰는 자원이 겹치지 않는다. 메모리도 50 + 100 + 75 = 225 MB로 250 MB 안에 들어간다. 그래서 동시에 돌려도 서로 기다리게 하지 않는다고 가정한다[^5].

| | 단일 프로그래밍 | 다중 프로그래밍 |
|---|---|---|
| 끝나는 시각 | JOB1 5분, JOB2 20분, JOB3 30분 (차례로) | JOB1 5분, JOB3 10분, JOB2 15분 (동시에) |
| 전체 경과 시간 | 30분 | 15분 |
| 처리량 (시간당 작업 수) | $$3 / 30\text{분} = 6$$ | $$3 / 15\text{분} = 12$$ |
| 평균 응답 시간 | $$(5 + 20 + 30)/3 \approx 18.3$$분 | $$(5 + 15 + 10)/3 = 10$$분 |
| 디스크·프린터 사용률 | $$10/30 \approx 33\%$$ | $$10/15 \approx 67\%$$ |
| 메모리 사용률 | 약 33% | 약 67% |

메모리 사용률은 "몇 MB를 몇 분 동안 썼나"를 다 더해서 "250 MB × 전체 시간"으로 나눈 값이다. 계산하면 $$(50 \times 5 + 100 \times 15 + 75 \times 10) / (250 \times 30) = 2500/7500 = 1/3$$이다. 다중 프로그래밍에서는 분모의 시간만 15분으로 줄어 $$2/3$$이 된다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 3.2%, 경과 시간, 처리량, 평균 응답 시간, 메모리·디스크·프린터 사용률을 다시 계산 — [11_multiprogramming_verify.py](/Hongs_Blog/studies/operating-systems/code/11_multiprogramming_verify/)</div>

</div>


<details markdown="1"><summary markdown="span">프로그램 수를 늘리면 사용률은 얼마나 오르나</summary>


간단한 모형이 있다[^s3]. 프로그램마다 시간의 비율 $$p$$만큼 입출력을 기다리고, 프로그램들이 서로 독립으로 기다린다고 하자. 프로세서가 노는 때는 $$n$$개가 **모두** 동시에 기다릴 때뿐이고, 그 확률은 $$p^n$$이다. 그래서 프로세서 사용률은 다음과 같다.

$$\text{사용률} = 1 - p^n$$


$$p = 0.8$$(시간의 80%를 기다림)이면 1개일 때 20%, 3개일 때 $$1 - 0.512 = 48.8\%$$, 5개일 때 약 67%다. 늘릴수록 오르지만 오르는 폭은 점점 줄어든다. 프로그램들이 같은 장치를 두고 다투면 독립 가정이 깨져 이보다 낮아진다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/operating-systems/11_multiprogramming_fig1.svg" alt="그림" loading="lazy">

$$p$$가 클수록, 곧 프로그램마다 입출력을 오래 기다릴수록 같은 사용률을 얻는 데 프로그램이 더 많이 필요하다. 세 선 모두 처음 몇 개를 올릴 때 크게 오르고, 그 뒤로는 하나를 더 올려도 오르는 폭이 작다[^s4].

</details>

## 스스로 설명해 보기

1. 그림 2.4에서 사용률이 3.2%다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   프로세서가 일하는 시간은 명령어 실행 1 µs뿐이고, 읽기·쓰기 30 µs 동안은 단일 프로그래밍이라 할 일이 없다. 1 / (15 + 1 + 15) = 1/31.
   </details>
2. 다중 프로그래밍에서 JOB2가 끝나는 시각이 20분에서 15분으로 당겨진다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   단일 프로그래밍에서는 JOB1이 끝난 5분부터 시작했다. 다중 프로그래밍에서는 0분에 함께 시작하고, 쓰는 자원이 겹치지 않아 자기 시간 15분이면 끝난다.
   </details>
3. 다중 프로그래밍인데도 JOB1은 5분 그대로다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   JOB1은 처음부터 기다리는 일이 없었다. 다중 프로그래밍은 기다리는 시간을 남에게 나눠 주는 것이지, 각 작업의 일 자체를 빠르게 하지 않는다.
   </details>
- 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  느린 자원(입출력)을 기다리는 시간과 빠른 자원(프로세서)을 쓰는 시간을 서로 다른 작업끼리 겹친다.
  </details>
- 같은 생각을 쓰는 다른 곳은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  4장의 [스레드](/Hongs_Blog/studies/operating-systems/thread/): 한 프로그램 안에서 한 스레드가 입출력을 기다리는 동안 다른 스레드가 계산한다. 컴퓨터 통신의 패킷 스위칭: 한 사용자가 쉬는 동안 다른 사용자가 링크를 쓴다.
  </details>

## 활용

- 다중 프로그래밍이 가능하려면 [인터럽트](/Hongs_Blog/studies/operating-systems/interrupt/)와 [DMA](/Hongs_Blog/studies/operating-systems/io-techniques/)가 있어야 한다. 입출력이 진행되는 동안 프로세서가 풀려나야 다른 작업을 실행할 수 있다[^s1].
- 여러 작업이 메모리에 있으므로 메모리 관리(누구를 어디에 둘지, 서로 못 건드리게)와 스케줄링(다음에 누구를 실행할지)이 운영체제의 일이 된다. 이 둘이 7~9장의 주제다.
- 일상의 PC는 사용자 한 명이 여러 프로그램을 동시에 띄운다. Windows는 이렇게 사용자 하나를 위한 다중 작업 운영체제다[^6].

## 연결

- 선수: [운영체제의 발전](/Hongs_Blog/studies/operating-systems/os-evolution/), [인터럽트](/Hongs_Blog/studies/operating-systems/interrupt/), [입출력 기법](/Hongs_Blog/studies/operating-systems/io-techniques/)
- 다음: 대화형 사용자를 위한 [시분할](/Hongs_Blog/studies/operating-systems/time-sharing/), 실행 중인 프로그램을 가리키는 [프로세스](/Hongs_Blog/studies/operating-systems/process/)
- 헷갈리는 개념: 프로세서가 여러 개인 다중 처리 → [대칭형 다중 처리](/Hongs_Blog/studies/operating-systems/smp/)
- 계산 연습: [다중 프로그래밍 예제 사다리](/Hongs_Blog/studies/operating-systems/multiprogramming-ladder/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"다중 프로그래밍이면 여러 프로그램이 정말 동시에 실행된다"</div>

틀렸다. 이름의 "다중"과 여러 창이 함께 움직이는 화면 때문에 그렇게 보인다. 프로세서가 하나면 어느 한 순간에 실행되는 프로그램은 하나뿐이다. 나머지는 기다린다. 번갈아 실행하는 것(interleaving)이지 겹쳐 실행하는 것(overlapping)이 아니다. 정말 동시에 실행하려면 프로세서가 여럿 있어야 하고, 그것은 다중 처리(multiprocessing)다[^7].

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"다중 프로그래밍을 하면 각 작업이 빨리 끝난다"</div>

반만 맞다. 전체 경과 시간과 평균 응답 시간은 줄어든다. 하지만 작업 하나가 일하는 데 드는 시간은 줄지 않는다. 슬라이드 예에서 JOB1은 단일이든 다중이든 5분이다. 자원 다툼이 있으면 오히려 한 작업은 더 늦어질 수 있다. 줄어드는 것은 남의 차례를 기다리던 시간이다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 레코드 하나를 읽는 데 20 µs, 처리에 4 µs, 쓰는 데 16 µs가 걸린다. 단일 프로그래밍에서 프로세서 사용률은?</summary>


**답:** $$4 / (20 + 4 + 16) = 4/40 = 10\%$$.<br>
**흔한 오답:** $$4/36$$. 처리 시간을 분모에서 빠뜨리면 이렇게 된다. 분모는 한 번 도는 전체 시간이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 슬라이드 예에서 다중 프로그래밍의 이득이 이렇게 큰 데는 어떤 가정이 결정적인가? 그 가정이 깨지면 무엇이 달라지는가?</summary>


**답:** 세 작업이 쓰는 자원(터미널, 디스크·프린터, 프로세서)이 겹치지 않고 메모리도 함께 들어간다는 가정. 예를 들어 JOB2와 JOB3이 같은 디스크를 쓴다면 한쪽이 디스크를 기다려야 해서 15분 안에 다 끝나지 않는다. 메모리가 모자라면 셋을 함께 올릴 수조차 없다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 프로세서 하나에서 프로그램 A, B, C를 돌린다. "A와 B가 동시에 실행 중이다"라는 말은 다중 프로그래밍에서 맞는가? 프로세서가 둘이면?</summary>


**답:** 프로세서 하나: 틀리다. 어느 순간이든 실행 중인 것은 하나이고, A와 B는 번갈아 실행된다. 프로세서 둘: 맞을 수 있다. A와 B가 각각 다른 프로세서에서 같은 순간에 실행될 수 있다. 이것이 다중 처리다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 슬라이드 예의 다중 프로그래밍 열에서 평균 응답 시간 10분을 구하는 식을 쓰라. 단일 프로그래밍에서 JOB 순서를 JOB1, JOB3, JOB2로 바꾸면 평균 응답 시간은?</summary>


**답:** 다중: $$(5 + 15 + 10)/3 = 10$$분. 단일, 순서 JOB1 → JOB3 → JOB2: 끝나는 시각 5, 15, 30이므로 $$(5 + 15 + 30)/3 \approx 16.7$$분.<br>
**이유:** 짧은 작업을 먼저 하면 뒤 작업들이 기다리는 시간이 줄어 평균 응답 시간이 짧아진다. 9장 스케줄링에서 다시 나온다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/02.Chapter02-new.pptx, 슬라이드 20 (그림 2.4)과 슬라이드 19의 발표자 노트
[^2]: 같은 자료, 슬라이드 22 (그림 2.5b)와 슬라이드 21의 발표자 노트
[^3]: 같은 자료, 슬라이드 21 (그림 2.5a)과 슬라이드 20의 발표자 노트
[^4]: 같은 자료, 슬라이드 23 (그림 2.5c)과 슬라이드 22의 발표자 노트
[^5]: 같은 자료, 슬라이드 24 (표 2.1), 슬라이드 25 (그림 2.6)와 슬라이드 23~24의 발표자 노트
[^6]: 같은 자료, 슬라이드 57
[^7]: 같은 자료, 슬라이드 53 (그림 2.12)과 슬라이드 52의 발표자 노트
[^s1]: 에이전트 보충. 위 표의 시각은 원본 그림 2.5c의 모양을 단위 시간으로 옮긴 것이다. 다중 프로그래밍이 인터럽트·DMA를 필요로 한다는 문장은 원본 1장과 2장을 이은 해석이다.
[^s2]: 에이전트 보충. 원본 슬라이드에는 결과 표(표 2.2)가 없고 사용률 막대그래프(그림 2.6)만 있다. 경과 시간, 처리량, 평균 응답 시간, 메모리·디스크·프린터 사용률은 표 2.1과 그림 2.6으로 직접 계산했다. 프로세서 사용률은 그림에서 정확한 값을 읽을 수 없어 넣지 않았다. 확인 문제 C1, C4는 원본 범위 밖의 변형 문제다.
[^s3]: 에이전트 보충. $$1 - p^n$$ 모형은 원본에 없다. 출처: Tanenbaum & Bos, *Modern Operating Systems*, 2장 "다중 프로그래밍 모델링".
[^s4]: 에이전트 보충. 그림 1장은 원본에 없다. [11_multiprogramming_plot.py](/Hongs_Blog/studies/operating-systems/code/11_multiprogramming_plot/)로 그렸고, $$p = 0.8$$일 때의 사용률 20%, 48.8%, 약 67%를 같은 코드로 확인했다.
{% endraw %}
