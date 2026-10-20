---
layout: "note"
title: "슈퍼스칼라와 비순차 실행"
display_title: "슈퍼스칼라와 비순차 실행 (Superscalar and Out-of-Order Execution)"
kind: "concept"
kind_label: "모델"
num: "34"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Superscalar and Out-of-Order Execution", "슈퍼스칼라", "Superscalar", "다중 내보내기", "Multiple Issue", "정적 다중 내보내기", "Static Multiple Issue", "동적 다중 내보내기", "Dynamic Multiple Issue", "비순차 실행", "Out-of-Order Execution", "동적 스케줄링", "Dynamic Scheduling", "추측 실행", "Speculation", "레지스터 이름 바꾸기", "Register Renaming", "IPC", "명령어 수준 병렬성", "Instruction-Level Parallelism", "ILP"]
description: "계산대를 두 줄로 늘리면 같은 시간에 손님을 두 배로 받을 수 있다. 거기에 더해, 앞 손님이 지갑을 찾느라 멈춰 있으면 준비된 뒤 손님부터 먼저 계산해 준다. 프로세서도 한 사이클에 명령어를 여러 개 시작하고 재료가 준비된 명령어부터 먼저 실행해서, 서로 기대지 않는 명령어가 많…"
prev_url: "/studies/computer-architecture/single-cycle-vs-pipeline/"
prev_title: "단일 사이클과 파이프라인 비교"
next_url: "/studies/computer-architecture/locality-principle/"
next_title: "지역성의 원리"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "34_superscalar-out-of-order_verify.py", "u": "/studies/computer-architecture/code/34_superscalar-out-of-order_verify/", "r": "검증"}]
permalink: "/studies/computer-architecture/superscalar-out-of-order/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

계산대를 두 줄로 늘리면 같은 시간에 손님을 두 배로 받을 수 있다. 거기에 더해, 앞 손님이 지갑을 찾느라 멈춰 있으면 준비된 뒤 손님부터 먼저 계산해 준다. 프로세서도 한 사이클에 명령어를 여러 개 시작하고 재료가 준비된 명령어부터 먼저 실행해서, 서로 기대지 않는 명령어가 많을수록 빨라진다. 다만 앞 명령어의 결과를 기다려야 하는 명령어는 줄이 아무리 많아도 기다려야 하고, 순서를 뒤섞어도 겉으로는 원래 순서대로 실행한 것처럼 보이게 하느라 회로가 크게 복잡해진다.

</div>


## 예시로 보기

[5단계 파이프라인](/Hongs_Blog/studies/computer-architecture/mips-pipeline/)은 아무리 잘 돌아도 사이클마다 명령어를 하나씩만 끝낸다. 그보다 빨라지려면 한 사이클에 둘 이상을 시작해야 한다.

명령어 여섯 개를 세 가지 프로세서에 넣어 본다. 단순하게 보려고 "실행을 시작하는 사이클"만 센다. `lw`는 2사이클, 나머지는 1사이클이 걸리고, 결과는 끝난 다음 사이클부터 쓸 수 있다고 놓는다[^s1].

```asm
1: lw  $t0, 0($s0)
2: add $t1, $t0, $s1     # 1을 기다린다
3: sub $t2, $t1, $s2     # 2를 기다린다
4: lw  $t3, 4($s0)
5: add $t4, $t3, $s1     # 4를 기다린다
6: or  $t5, $t4, $t2     # 5와 3을 기다린다
```

| 명령어 | 한 줄, 순서대로 | 두 줄, 순서대로 | 두 줄, 준비된 것부터 |
|---|---|---|---|
| 1 `lw` | 1 | 1 | 1 |
| 2 `add` | 3 | 3 | 3 |
| 3 `sub` | 4 | 4 | 4 |
| 4 `lw` | 5 | 4 | **1** |
| 5 `add` | 7 | 6 | **3** |
| 6 `or` | 8 | 7 | 5 |
| 모두 끝나는 사이클 | 8 | 7 | 5 |
| 사이클당 명령어 수 | 0.75 | 0.86 | 1.2 |

칸의 수는 그 명령어가 실행을 시작하는 사이클이다.

- **두 줄, 순서대로.** 2가 1을 기다리는 동안 뒤의 4도 못 나간다. 앞이 막히면 뒤도 막힌다. 줄을 늘린 이득이 거의 없다.
- **두 줄, 준비된 것부터.** 4는 1과 상관없으므로 1번째 사이클에 함께 시작한다. 2가 기다리는 동안 4와 5가 먼저 간다.

줄을 100개로 늘려도 5사이클 밑으로는 내려가지 않는다. 1 → 2 → 3 → 6으로 이어지는 사슬이 $$2 + 1 + 1 + 1 = 5$$사이클이기 때문이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 줄 수를 늘려도 5사이클, 서로 기대지 않는 명령어 6개는 두 줄로 3사이클, 줄줄이 기대는 6개는 줄 수와 상관없이 6사이클 — [34_superscalar-out-of-order_verify.py](/Hongs_Blog/studies/computer-architecture/code/34_superscalar-out-of-order_verify/) (실제 하드웨어가 아니라 장난감 일정표)</div>

</div>


## 한 사이클에 여러 개 시작하기

한 사이클에 명령어를 둘 이상 시작하는 것을 다중 내보내기(multiple issue)라 부른다. 사이클당 끝내는 명령어 수(IPC)가 1을 넘을 수 있다. IPC는 [CPI](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/)의 역수다. 누가 "함께 시작해도 되는 묶음"을 정하느냐로 둘로 나뉜다[^1].

| | 정적 다중 내보내기 | 동적 다중 내보내기 (슈퍼스칼라) |
|---|---|---|
| 누가 묶나 | 컴파일러가 미리 | 프로세서가 실행하면서 |
| 묶는 법 | 한 사이클에 함께 시작할 명령어를 묶음으로 만들어 둔다. 자리가 남으면 `nop`으로 채운다 | 사이클마다 0개, 1개, 2개, …를 시작할지 정한다 |
| 해저드 | 컴파일러가 순서를 바꿔 없앤다 | 프로세서가 실행 중에 피한다 |

**슈퍼스칼라**는 둘째를 가리킨다. 컴파일러가 순서를 잘 잡아 주면 여전히 도움이 되지만, 프로그램이 맞게 돌아가는 것은 프로세서가 책임진다[^2].

어셈블리어 과목의 [파이프라인과 슈퍼스칼라](/Hongs_Blog/studies/assembly-language/instruction-pipeline/)는 느린 단계 하나만 두 줄로 놓은 그림으로 이 생각을 보여 준다.

## 준비된 것부터 실행하기

명령어를 프로그램에 적힌 순서가 아니라 재료가 준비된 순서로 실행하는 것을 비순차 실행(out-of-order execution)이라 부른다. 프로세서가 실행 순서를 그때그때 정하므로 동적 스케줄링이라고도 한다.

컴파일러에게 다 맡기지 않고 프로세서가 직접 하는 까닭은 세 가지다[^3].

- 쉬는 사이클을 미리 다 알 수 없다. 캐시에 값이 없어서 생기는 지연이 그렇다.
- 분기가 어디로 갈지는 실행해 봐야 안다. 분기를 넘어 순서를 잡기 어렵다.
- 같은 명령어 집합이라도 프로세서마다 걸리는 시간과 해저드가 다르다.

순서를 뒤섞어도 지켜야 할 것이 하나 있다. 레지스터와 메모리를 고치는 일(확정)은 원래 순서대로 한다. 그래야 [예외](/Hongs_Blog/studies/computer-architecture/processor-exceptions/)가 났을 때 "그 명령어 앞까지만 실행된 상태"를 만들 수 있고, 분기 예측이 틀렸을 때 잘못 실행한 것을 흔적 없이 버릴 수 있다.

**추측 실행.** 분기가 어디로 갈지 [예측](/Hongs_Blog/studies/computer-architecture/control-hazard-branch-prediction/)하고 그 길의 명령어를 미리 실행해 둔다. 결과는 분기가 확인될 때까지 확정하지 않는다. 맞으면 확정하고, 틀리면 버린다[^4].

**레지스터 이름 바꾸기.** 아래 두 명령어는 값을 주고받지 않는데도 같은 `$t0`를 써서 순서를 바꿀 수 없어 보인다.

```asm
add $t0, $s1, $s2     # $t0를 쓴다
...                   # $t0를 읽는 명령어들
lw  $t0, 0($s3)       # $t0를 다시 쓴다 (앞의 값과 무관)
```

둘째의 `$t0`를 프로세서 안의 다른 빈 레지스터로 바꿔 주면 두 명령어는 완전히 남남이 되어 함께 실행할 수 있다. 이름만 같아서 생기는 묶임을 이렇게 푼다[^5].

## 얼마나 통하나

교재의 답은 "통하지만 바라는 만큼은 아니다"다[^6].

- 프로그램에는 정말로 앞의 결과를 기다려야 하는 명령어가 있다. 예시의 사슬처럼, 이것은 줄을 늘려도 줄지 않는다.
- 포인터 둘이 같은 곳을 가리키는지처럼, 없애기 어려운 묶임이 있다.
- 프로세서가 한 번에 들여다보는 명령어 범위에 한계가 있다.
- 메모리가 느려서 관을 늘 채워 두기 어렵다.

게다가 이 회로들은 전력을 많이 쓴다. 그래서 프로세서 하나를 더 복잡하게 만드는 대신 단순한 코어를 여러 개 넣는 쪽으로 방향이 바뀌었다[^7]. → [멀티코어와 병렬 처리](/Hongs_Blog/studies/computer-architecture/multicore-parallelism/)

인텔 프로세서 몇 개를 견주면 이 흐름이 보인다[^7].

| 프로세서 | 해 | 파이프라인 단계 | 한 사이클에 시작하는 수 | 비순차·추측 | 코어 |
|---|---|---|---|---|---|
| i486 | 1989 | 5 | 1 | 없음 | 1 |
| Pentium | 1993 | 5 | 2 | 없음 | 1 |
| Pentium Pro | 1997 | 10 | 3 | 있음 | 1 |
| Pentium 4 Prescott | 2004 | 31 | 3 | 있음 | 1 |
| Core | 2006 | 14 | 4 | 있음 | 2 |

## 활용

- 프로그램을 짜는 쪽에서는 "서로 기대지 않는 계산"이 많을수록 이 프로세서가 빨리 돌린다는 점이 중요하다. 합을 하나의 변수에 차례로 더하면 긴 사슬이 되고, 변수 둘에 번갈아 더하면 사슬이 둘로 갈라진다[^s1].
- 흔한 실수: 줄이 둘이면 두 배 빨라진다고 보는 것. 명령어끼리 기대는 정도가 상한을 정한다.
- 흔한 실수: 비순차 실행이면 결과가 레지스터에 적히는 순서도 뒤섞인다고 보는 것. 실행만 뒤섞고 확정은 원래 순서대로 한다.

## 연결

- 선수: [5단계 파이프라인](/Hongs_Blog/studies/computer-architecture/mips-pipeline/), [제어 해저드와 분기 예측](/Hongs_Blog/studies/computer-architecture/control-hazard-branch-prediction/)
- 느린 단계를 두 줄로 놓는 그림과 사이클 수 식: [파이프라인과 슈퍼스칼라](/Hongs_Blog/studies/assembly-language/instruction-pipeline/)
- 컴파일러가 순서를 바꿔 쉬는 사이클을 없애는 작은 예: [적재-사용 해저드와 스톨](/Hongs_Blog/studies/computer-architecture/load-use-stall/)
- 코어를 여러 개 두는 길: [멀티코어와 병렬 처리](/Hongs_Blog/studies/computer-architecture/multicore-parallelism/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 정적 다중 내보내기와 슈퍼스칼라(동적 다중 내보내기)는 "함께 시작할 명령어를 누가 언제 정하는가"에서 어떻게 다른가?</summary>

**답:** 정적은 컴파일러가 프로그램을 만들 때 미리 묶어 둔다. 슈퍼스칼라는 프로세서가 실행하면서 사이클마다 몇 개를 시작할지 정한다.<br>
**이유:** 그래서 정적 쪽은 컴파일러가 그 프로세서의 구조를 알아야 하고, 슈퍼스칼라는 같은 프로그램을 구조가 다른 프로세서에서도 맞게 돌린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 본문의 가정(`lw` 2사이클, 나머지 1사이클, 결과는 끝난 다음 사이클부터)에서, 줄줄이 기대는 `add` 여섯 개(각 명령어가 바로 앞 명령어의 결과를 읽는다)를 네 줄짜리 비순차 프로세서에 넣으면 몇 사이클에 끝나는가? 서로 기대지 않는 `add` 여섯 개를 두 줄짜리에 넣으면?</summary>

**답:** 6사이클과 3사이클.<br>
**이유:** 줄줄이 기대면 한 사이클에 하나씩만 시작할 수 있어서 줄 수가 소용없다. 서로 기대지 않으면 사이클마다 둘씩 시작해 $$6 \div 2 = 3$$사이클이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 비순차 실행 프로세서가 실행은 뒤섞으면서도 결과를 확정하는 일은 원래 순서대로 하는 이유를 두 가지 대라.</summary>

**답:** ① 예외가 났을 때 "그 명령어 앞까지만 실행된 상태"를 만들어야 처리기가 고치고 돌아올 수 있다. 뒤 명령어가 먼저 확정되어 있으면 그 상태를 만들 수 없다. ② 분기 예측이 틀렸을 때 잘못된 길에서 미리 실행한 명령어를 흔적 없이 버려야 한다. 분기보다 뒤의 명령어가 먼저 확정되면 되돌릴 수 없다.

</details>


[^1]: 교재 출판사 강의 슬라이드 "Chapter 4 — The Processor" (Cooper Union 게시본), 슬라이드 69~71, 77 (Static Multiple Issue: 컴파일러가 묶음을 만든다, nop으로 채운다. Dynamic Multiple Issue: "슈퍼스칼라" 프로세서, CPU가 사이클마다 몇 개를 내보낼지 정한다), https://ee.cooper.edu/~curro/comparch/pipeline/chapter4_pipelining_END_FA11.pdf. Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 4장 "The Processor"
[^2]: 같은 슬라이드, 77 (컴파일러의 순서 잡기가 필요 없어지지만 여전히 도움이 될 수 있다, 코드의 뜻은 CPU가 지킨다)
[^3]: 같은 슬라이드, 79 (Why Do Dynamic Scheduling?)
[^4]: 같은 슬라이드, 67, 78 (Speculation: 분기 결과를 추측하고 틀리면 되돌린다, 분기 결과가 정해질 때까지 확정하지 않는다)
[^5]: 같은 슬라이드, 75 (Loop Unrolling: 레지스터 이름 바꾸기, 이름만 같아서 생기는 의존). 프로세서가 실행 중에 같은 일을 한다는 것과 위 예는 [확인필요].
[^6]: 같은 슬라이드, 80 (Does Multiple Issue Work?)
[^7]: 같은 슬라이드, 81 (Power Efficiency: 여러 개의 단순한 코어가 나을 수 있다, 프로세서별 표)
[^s1]: 예와 수치는 장난감 일정표 코드로 계산했다. 실제 프로세서의 가져오기·해독·확정 단계는 넣지 않은 단순한 모형이다.
{% endraw %}
