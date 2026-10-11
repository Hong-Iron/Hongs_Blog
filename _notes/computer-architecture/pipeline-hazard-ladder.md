---
layout: "note"
title: "파이프라인 해저드 예제 사다리"
display_title: "파이프라인 해저드 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "31"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 데이터 해저드와 전방 전달의 조건, 적재-사용 해저드와 스톨, 제어 해저드와 분기 예측."
prev_url: "/studies/computer-architecture/datapath-tracing-ladder/"
prev_title: "데이터패스 추적 예제 사다리"
next_url: "/studies/computer-architecture/cache-tracing-ladder/"
next_title: "캐시 적중과 실패 추적 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-architecture/pipeline-hazard-ladder/"
---
{% raw %}
사용 개념: [데이터 해저드와 전방 전달](/Hongs_Blog/studies/computer-architecture/data-hazard-forwarding/)의 조건, [적재-사용 해저드와 스톨](/Hongs_Blog/studies/computer-architecture/load-use-stall/), [제어 해저드와 분기 예측](/Hongs_Blog/studies/computer-architecture/control-hazard-branch-prediction/).

"이 코드가 5단계 파이프라인에서 몇 사이클에 끝나는가, 어디서 값을 당겨 쓰는가"는 늘 같은 하위목표의 반복이다. ① 명령어마다 읽는 레지스터를 가장 최근에 고친 명령어가 몇 칸 앞인지 센다 ② 종류를 가른다(한 칸 앞 R형 → EX/MEM에서, 두 칸 앞 → MEM/WB에서, 한 칸 앞 `lw` → 한 사이클 쉼, 분기 → 판정 규칙) ③ 쉬는 칸과 버리는 칸을 넣어 사이클 표를 그린다 ④ 사이클 수 = 4 + 끝낸 명령어 수 + 쉰 사이클 + 버린 명령어 수를 센다.

네 문제 모두 같은 프로세서를 쓴다[^1].

- 전방 전달이 있다. 레지스터 파일은 사이클의 앞 절반에 쓰고 뒤 절반에 읽는다.
- `beq`는 ID 단계에서 판정한다. 늘 "안 간다"로 보고 다음 명령어를 가져오며, 가면 하나를 버린다.
- ID에서 견줄 값을 바로 앞 R형 명령어가 만들면 1사이클, 바로 앞 `lw`가 만들면 2사이클을 기다린다.

처음 상태는 `$gp` = 64, `$s0` = 6, `$s1` = 2, `$s2` = 8이다.

## 문제 1 · 완전한 풀이

메모리 64번지에 10이 들어 있다. 사이클 표를 그리고, 당겨 쓰는 곳과 총 사이클 수를 구하라.

```asm
lw  $t0, 0($gp)
add $t1, $t0, $s0
sub $t2, $t1, $t0
sw  $t2, 4($gp)
```

1. *누가 몇 칸 앞에서 고쳤나:* `add`의 `$t0` ← 한 칸 앞 `lw`. `sub`의 `$t1` ← 한 칸 앞 `add`, `$t0` ← 두 칸 앞 `lw`. `sw`의 `$t2` ← 한 칸 앞 `sub`.
2. *종류 가르기:* `add`는 적재-사용이라 한 사이클 쉬고 MEM/WB에서 당겨 쓴다(ForwardA = 01). `sub`의 `$t1`은 EX/MEM에서 당겨 쓴다(ForwardA = 10). `sub`의 `$t0`는 `add`가 쉬는 바람에 `lw`가 세 칸 앞이 되어, ID에서 레지스터 파일로 읽는다. `sw`의 `$t2`는 EX/MEM에서 당겨 쓴다(ForwardB = 10).
3. *표 그리기:*

| 명령어 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| `lw  $t0, 0($gp)` | IF | ID | EX | MEM | WB | | | | |
| `add $t1, $t0, $s0` | | IF | ID | ID | EX | MEM | WB | | |
| `sub $t2, $t1, $t0` | | | IF | IF | ID | EX | MEM | WB | |
| `sw  $t2, 4($gp)` | | | | | IF | ID | EX | MEM | WB |

{: start="4"}
4. *사이클 수:* $$4 + 4 + 1 + 0 = 9$$.

끝난 뒤: `$t1` = 16, `$t2` = 6, 메모리 68번지 = 6.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 표, 당겨 쓰는 곳, 사이클 수, 끝난 뒤의 값이 단일 사이클 흉내기와 같음 — [27_mips-pipeline_impl.py](/Hongs_Blog/studies/computer-architecture/code/27_mips-pipeline_impl/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

메모리 72번지에 7이 들어 있다.

```asm
add $t0, $s2, $gp
lw  $t1, 0($t0)
and $t2, $t1, $t0
or  $t3, $t2, $t1
```

1. *누가 몇 칸 앞에서 고쳤나:* `lw`의 `$t0` ← 한 칸 앞 `add`. `and`의 `$t1` ← 한 칸 앞 `lw`, `$t0` ← 두 칸 앞 `add`. `or`의 `$t2` ← 한 칸 앞 `and`, `$t1` ← 두 칸 앞 `lw`.
2. *종류 가르기:* `lw`는 EX/MEM에서 당겨 쓴다(ForwardA = 10). `and`는 적재-사용이라 한 사이클 쉬고 `$t1`을 MEM/WB에서 당겨 쓴다(ForwardA = 01). 쉬는 동안 `add`가 WB를 지나므로 `$t0`는 레지스터 파일에서 읽는다. `or`의 `$t2`는 EX/MEM에서 당겨 쓰고(ForwardA = 10), `$t1`은 `lw`가 세 칸 앞이 되어 레지스터 파일에서 읽는다.
3. *표 그리기:*

| 명령어 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| `add $t0, $s2, $gp` | IF | ID | EX | MEM | WB | | | | |
| `lw  $t1, 0($t0)` | | IF | ID | EX | MEM | WB | | | |
| `and $t2, $t1, $t0` | | | IF | ID | ID | EX | MEM | WB | |
| `or  $t3, $t2, $t1` | | | | IF | IF | ID | EX | MEM | WB |

{: start="4"}
4. *사이클 수와 끝난 뒤의 값:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$4 + 4 + 1 + 0 = 9$$사이클. `$t0` = 72, `$t1` = 7, `$t2` = $$7 \mathbin{\&} 72 = 0$$, `$t3` = $$0 \mathbin{\vert } 7 = 7$$.<br>
흔한 오답: `lw`가 있으니 무조건 한 번 더 쉰다고 보고 10사이클로 세는 것. `lw` 앞의 `add`는 R형이라 쉬지 않고 당겨 쓴다. 쉬는 것은 `lw`의 값을 바로 뒤에서 읽는 `and` 한 번뿐이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

```asm
        add $t0, $s0, $s1
        beq $t0, $s2, L
        sub $t1, $s0, $s1
     L: or  $t2, $t0, $s0
```

1. *누가 몇 칸 앞에서 고쳤나:* `beq`의 `$t0` ← 한 칸 앞 `add`. `or`의 `$t0` ← `add`.
2. *종류 가르기:* ______
3. *표 그리기:* ______
4. *사이클 수:* 끝낸 명령어는 `add`, `beq`, `or` 셋이다. ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. `beq`는 ID에서 판정하는데 견줄 `$t0`를 바로 앞 R형이 만든다. 한 사이클 기다린 뒤 EX/MEM에서 비교기로 당겨 쓴다. `$t0` = $$6 + 2 = 8$$이고 `$s2` = 8이라 분기는 간다. "안 간다"로 보고 가져온 `sub`를 버린다.<br>
3.

| 명령어 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| `add $t0, $s0, $s1` | IF | ID | EX | MEM | WB | | | | |
| `beq $t0, $s2, L` | | IF | ID | ID | EX | MEM | WB | | |
| `sub $t1, $s0, $s1` | | | IF | IF | 버림 | | | | |
| `or  $t2, $t0, $s0` | | | | | IF | ID | EX | MEM | WB |

{: start="4"}
4. $$4 + 3 + 1 + 1 = 9$$. 끝난 뒤 `$t1`은 그대로 0이고 `$t2` = $$8 \mathbin{\vert } 6 = 14$$다.<br>
흔한 오답: 버린 `sub`를 끝낸 명령어로도 세어 $$4 + 4 + 1 + 1 = 10$$으로 쓰는 것.

</details>


## 문제 4 · 독립 문제

메모리 64번지에 10, 68번지에 5가 들어 있다. 사이클 표를 그리고 총 사이클 수와 끝난 뒤 메모리 72번지와 `$t3`의 값을 구하라. 이어서, 68번지의 값이 $$-10$$이었다면 무엇이 달라지는지도 답하라.

```asm
        lw  $t0, 0($gp)
        lw  $t1, 4($gp)
        add $t2, $t0, $t1
        beq $t2, $zero, done
        sw  $t2, 8($gp)
  done: sub $t3, $t2, $t0
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`add`의 `$t1`은 한 칸 앞 `lw`의 값이라 한 번 쉰다(`$t0`는 두 칸 앞이라 쉬지 않는다). `beq`의 `$t2`는 한 칸 앞 R형이 만들어 한 번 기다린다. 모두 두 번 쉰다.

| 명령어 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `lw  $t0, 0($gp)` | IF | ID | EX | MEM | WB | | | | | | | |
| `lw  $t1, 4($gp)` | | IF | ID | EX | MEM | WB | | | | | | |
| `add $t2, $t0, $t1` | | | IF | ID | ID | EX | MEM | WB | | | | |
| `beq $t2, $zero, done` | | | | IF | IF | ID | ID | EX | MEM | WB | | |
| `sw  $t2, 8($gp)` | | | | | | IF | IF | ID | EX | MEM | WB | |
| `sub $t3, $t2, $t0` | | | | | | | | IF | ID | EX | MEM | WB |

`$t2` = 15라 분기는 가지 않는다. 버리는 것이 없다. $$4 + 6 + 2 + 0 = 12$$사이클. 메모리 72번지 = 15, `$t3` = $$15 - 10 = 5$$.

68번지가 $$-10$$이면 `$t2` = 0이라 분기가 간다. `sw`를 버리고 `sub`를 8번째 사이클에 가져온다. 끝낸 명령어가 5개, 쉰 사이클 2, 버린 명령어 1이라 $$4 + 5 + 2 + 1 = 12$$사이클로 사이클 수는 같다. 메모리 72번지에는 아무것도 쓰지 않고 `$t3` = $$0 - 10 = -10$$이다.<br>
흔한 오답: `beq`가 `add` 바로 뒤라는 것을 놓쳐 한 번만 쉰다고 세는 것. ID에서 판정하는 분기는 바로 앞 R형의 결과도 기다려야 한다.

</details>


[^1]: 전방 전달·적재-사용·분기의 규칙은 교재 출판사 강의 슬라이드 "Chapter 4 — The Processor" (Cooper Union 게시본), 슬라이드 41~47, 53~58, https://ee.cooper.edu/~curro/comparch/pipeline/chapter4_pipelining_END_FA11.pdf. 네 문제의 코드와 수치는 이 문서에서 새로 만든 것이다.
{% endraw %}
