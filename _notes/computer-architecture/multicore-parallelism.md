---
layout: "note"
title: "멀티코어와 병렬 처리"
display_title: "멀티코어와 병렬 처리 (Multicore and Parallel Processing)"
kind: "concept"
kind_label: "정의"
num: "44"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Multicore", "다중 코어", "병렬 프로세서", "Parallel Processor", "멀티프로세서", "Multiprocessor", "플린 분류", "Flynn's Taxonomy", "SISD", "SIMD", "MISD", "MIMD", "공유 메모리 멀티프로세서", "Shared Memory Multiprocessor", "SMP", "캐시 일관성", "Cache Coherence", "거짓 공유", "False Sharing"]
description: "프로세서 하나를 더 빠르게 만들기 어려워지자, 칩 하나에 프로세서를 여러 개 넣고 일을 나눠 시키게 되었다. 계산대를 하나 더 빠르게 만드는 대신 계산대를 여러 개 여는 것과 같다. 나눌 수 있는 일은 프로세서 수만큼 빨라진다. 하지만 나눌 수 없는 부분은 그대로 남아서, 그 부분…"
prev_url: "/studies/computer-architecture/cache-tlb-interaction/"
prev_title: "캐시와 TLB와 페이지 테이블의 상호작용"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "44_multicore-parallelism_verify.py", "u": "/studies/computer-architecture/code/44_multicore-parallelism_verify/", "r": "검증"}]
permalink: "/studies/computer-architecture/multicore-parallelism/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프로세서 하나를 더 빠르게 만들기 어려워지자, 칩 하나에 프로세서를 여러 개 넣고 일을 나눠 시키게 되었다. 계산대를 하나 더 빠르게 만드는 대신 계산대를 여러 개 여는 것과 같다. 나눌 수 있는 일은 프로세서 수만큼 빨라진다. 하지만 나눌 수 없는 부분은 그대로 남아서, 그 부분이 전체 속도의 천장을 정한다. 여럿이 같은 메모리를 함께 쓰느라 서로의 사본을 맞추는 값도 따로 든다.

</div>


## 예시로 보기

[파이프라인](/Hongs_Blog/studies/computer-architecture/mips-pipeline/)과 [슈퍼스칼라](/Hongs_Blog/studies/computer-architecture/superscalar-out-of-order/)는 프로그램을 고치지 않아도 명령어 여러 개를 겹쳐 실행해 준다. 그 길로 더 얻을 것이 줄자, 프로세서를 여러 개 두는 길로 갔다. 이 길은 공짜가 아니다. 프로그램이 일을 나눠 주어야 하고, 나눌 수 없는 부분이 발목을 잡는다.

어떤 프로그램의 90%는 여러 프로세서에 나눠 돌릴 수 있고, 10%는 차례로 해야 한다. 프로세서 하나로 100초가 걸린다면

| 프로세서 수 | 나눠 도는 부분 | 차례로 하는 부분 | 합 | 몇 배 빨라졌나 |
|---|---|---|---|---|
| 1 | 90초 | 10초 | 100초 | 1 |
| 8 | 11.25초 | 10초 | 21.25초 | 4.71 |
| 64 | 약 1.41초 | 10초 | 약 11.41초 | 8.77 |
| 아주 많이 | 0에 가깝다 | 10초 | 10초에 가깝다 | 10 미만 |

프로세서를 8개 써도 8배가 아니라 4.71배다. 64개를 써도 9배가 안 된다. 아무리 늘려도 10배를 넘지 못한다. 차례로 해야 하는 10초가 남기 때문이다. [암달의 법칙](/Hongs_Blog/studies/computer-architecture/amdahls-law/)을 프로세서 수에 적용한 것이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 4.71, 8.77, 10 미만, 32개로 16배를 얻는 데 필요한 96.8%, 거짓 공유 흉내의 200번과 2번, 카드 C2 — [44_multicore-parallelism_verify.py](/Hongs_Blog/studies/computer-architecture/code/44_multicore-parallelism_verify/) (거짓 공유는 규칙 하나만 옮긴 파이썬 흉내)</div>

</div>


## 정의

**멀티코어.** 칩 하나에 들어 있는 프로세서 하나하나를 코어라 부른다. 코어가 둘 이상인 칩이 멀티코어 프로세서다. 코어마다 PC와 레지스터가 따로 있어서 서로 다른 명령어 흐름을 동시에 실행한다.

**플린 분류**(Flynn's taxonomy). 컴퓨터를 "명령어 흐름이 몇 개인가"와 "데이터 흐름이 몇 개인가"로 넷으로 나눈다[^1].

| | 데이터 흐름 하나 | 데이터 흐름 여럿 |
|---|---|---|
| 명령어 흐름 하나 | SISD: 한 번에 명령어 하나가 데이터 하나를 다룬다. 프로세서 하나짜리 옛 컴퓨터 | SIMD: 명령어 하나가 데이터 여러 개에 같은 연산을 한꺼번에 한다. 배열 네 쌍을 한 번에 더하는 명령 |
| 명령어 흐름 여럿 | MISD: 여러 명령어 흐름이 데이터 하나를 다룬다. 거의 쓰이지 않는다 | MIMD: 프로세서 여럿이 서로 다른 명령어를 서로 다른 데이터에 실행한다. 멀티코어 |

이름은 Single/Multiple Instruction, Single/Multiple Data의 머리글자다. 요즘 컴퓨터는 SIMD와 MIMD를 함께 쓴다[^1].

**공유 메모리 멀티프로세서**(shared memory multiprocessor). 모든 프로세서가 하나의 메모리 주소 공간을 함께 쓰는 구조다. 어느 코어가 `sw`로 쓴 값을 다른 코어가 같은 주소에서 `lw`로 읽는다. 일을 나누는 단위는 [스레드](/Hongs_Blog/studies/operating-systems/thread/)다. 스레드마다 PC, 레지스터, 스택은 따로 갖고, 전역 변수와 힙은 함께 쓴다[^2].

```
   코어 0        코어 1        코어 2        코어 3
  [캐시]        [캐시]        [캐시]        [캐시]      <- 코어마다 따로
     |             |             |             |
     +-------------+------+------+-------------+
                          |
                   [함께 쓰는 캐시]                     <- 있을 수도 있다
                          |
                     [ 메모리 ]                        <- 주소 공간 하나
```

**암달의 법칙 다시.** 프로그램에서 나눠 돌릴 수 있는 부분의 비율을 $$F$$, 프로세서 수를 $$N$$이라 하면 전체가 빨라지는 배수는

$$\text{속도 향상} = \frac{1}{(1 - F) + \dfrac{F}{N}}, \qquad N \to \infty \text{일 때 } \frac{1}{1 - F}$$


분모의 $$(1 - F)$$는 차례로 해야 해서 그대로 남는 부분, $$F/N$$은 $$N$$개가 나눠 해서 줄어든 부분이다. $$F = 0.9$$, $$N = 8$$이면 $$1 \div (0.1 + 0.1125) \approx 4.71$$이다. 거꾸로, 프로세서 32개로 16배를 얻으려면 $$F$$가 약 96.8%는 되어야 한다.

이 식은 나눠 맡은 일이 서로 기다리지 않고, 일을 나누고 모으는 값이 0이라고 가정한다. 실제로는 그보다 덜 빨라진다.

## 코어마다 캐시가 따로 있어서 생기는 일

코어마다 캐시가 있으면 같은 블록의 사본이 여러 캐시에 생긴다. 코어 0이 자기 사본을 고치면 코어 1의 사본은 낡은 값이 된다. 그대로 두면 코어 1이 틀린 값을 읽는다. 그래서 하드웨어가 규칙을 둔다. 어느 코어가 블록에 쓰려면, 먼저 다른 코어들이 가진 그 블록의 사본을 못 쓰게 만든다. 이렇게 사본들을 맞추는 일을 캐시 일관성(cache coherence) 유지라 부른다.

이 규칙이 새 종류의 실패를 만든다. 다른 코어가 쓰는 바람에 내 사본이 못 쓰게 되어 나는 실패다. 캐시를 키워도 줄지 않는다.

**거짓 공유**(false sharing). 두 코어가 서로 다른 변수를 쓰는데, 그 두 변수가 우연히 같은 블록에 들어 있는 경우다. 실제로 함께 쓰는 데이터는 없다. 그런데 캐시는 블록 단위로 사본을 관리하므로, 한 코어가 쓸 때마다 다른 코어의 블록이 통째로 못 쓰게 된다.

코어 0은 변수 `x`만, 코어 1은 변수 `y`만 번갈아 100번씩 쓴다.

| `x`와 `y`의 자리 | 실패 (200번 중) |
|---|---|
| 같은 블록 안 | 200 |
| 서로 다른 블록 | 2 |

같은 일을 하는데 변수를 어디에 두었느냐로 실패가 100배 차이 난다. 블록이 클수록 서로 무관한 변수가 한 블록에 들어갈 가능성이 커진다. [직접 사상 캐시](/Hongs_Blog/studies/computer-architecture/direct-mapped-cache/)에서 본 블록 크기의 값이 여기 하나 더 붙는다.

## 활용

- 나눠 돌리기 좋은 일: 큰 격자를 구역별로 계산하는 과학 계산, 요청마다 따로 처리하는 서버, 그림·영상의 조각을 따로 압축하는 일. 어느 경우든 소프트웨어가 일을 나누도록 짜여 있어야 한다.
- 여러 스레드가 같은 변수를 고칠 때 순서를 지키게 하는 문제(동기화)는 운영체제 과목에서 다룬다: [스레드](/Hongs_Blog/studies/operating-systems/thread/).
- [캐시 쓰기 정책](/Hongs_Blog/studies/computer-architecture/cache-write-policy/)에서 본 "사본과 원본이 다르다"는 문제가, 코어가 여럿이면 "사본과 사본이 다르다"로 넓어진다.
- 흔한 실수: 코어가 $$N$$개면 $$N$$배 빨라진다고 본다. 나눌 수 없는 부분, 일을 나누고 모으는 값, 사본을 맞추는 값이 모두 그 아래로 끌어내린다.

## 연결

- 선수: [암달의 법칙](/Hongs_Blog/studies/computer-architecture/amdahls-law/)
- 코어 하나 안에서 명령어를 겹쳐 실행하는 길: [5단계 파이프라인](/Hongs_Blog/studies/computer-architecture/mips-pipeline/), [슈퍼스칼라와 비순차 실행](/Hongs_Blog/studies/computer-architecture/superscalar-out-of-order/)
- 코어마다 캐시를 두고 뒤쪽 캐시를 함께 쓰는 구성: [다단계 캐시](/Hongs_Blog/studies/computer-architecture/multilevel-cache/)
- 스레드와 프로세스: [스레드](/Hongs_Blog/studies/operating-systems/thread/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 플린 분류의 네 가지 이름을 쓰고, 멀티코어 프로세서와 "배열 네 쌍을 한 명령으로 더하기"가 각각 어디에 들어가는지 쓰라.</summary>

**답:** SISD, SIMD, MISD, MIMD. 멀티코어는 MIMD(코어마다 다른 명령어 흐름과 다른 데이터), 한 명령으로 여러 데이터를 더하는 것은 SIMD(명령어 흐름 하나, 데이터 여럿)다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 프로그램의 80%를 나눠 돌릴 수 있다. 코어 4개로 몇 배 빨라지는가? 코어를 아무리 늘려도 넘지 못하는 배수는?</summary>

**답:** $$1 \div (0.2 + 0.8 \div 4) = 1 \div 0.4 = 2.5$$배. 천장은 $$1 \div 0.2 = 5$$배.<br>
**흔한 오답:** $$0.8 \times 4 = 3.2$$배. 남는 20%의 시간을 더하지 않았다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 두 스레드가 서로 다른 변수만 쓰는데도, 변수 둘을 메모리에서 멀리 떼어 놓았더니 프로그램이 빨라졌다. 왜인가?</summary>

**답:** 두 변수가 같은 캐시 블록에 있었다(거짓 공유). 캐시는 블록 단위로 사본을 맞추므로, 한 코어가 자기 변수를 쓸 때마다 다른 코어가 가진 그 블록이 못 쓰게 되어 다시 가져와야 했다. 변수를 다른 블록으로 떼어 놓으면 서로의 사본을 건드리지 않는다.

</details>


[^1]: ShanghaiTech CS 110 Computer Architecture (UC Berkeley CS61C 슬라이드 기반), 2017, "Amdahl's Law, Data-level Parallelism", 슬라이드 4~8 (SISD, SIMD, MIMD, MISD, Flynn Taxonomy), https://robotics.shanghaitech.edu.cn/courses/ca/17s/lecture/2017-CA-L19_DLP.pdf. Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 6장 "Parallel Processors from Client to Cloud"
[^2]: University of Pennsylvania CIS 501 Computer Architecture (Milo Martin), Unit 10 "Multicore", 슬라이드 18~19 (스레드마다 PC·레지스터·스택, 전역 변수와 힙은 함께 쓴다, 모든 load와 store가 하나의 공유 메모리 공간으로 간다), https://acg.cis.upenn.edu/milom/cis501-Fall12/lectures/10_multicore.pdf
{% endraw %}
