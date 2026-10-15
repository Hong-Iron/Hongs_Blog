---
layout: "note"
title: "적재-사용 해저드와 스톨"
display_title: "적재-사용 해저드와 스톨 (Load-Use Hazard and Stall)"
kind: "concept"
kind_label: "기법"
num: "30"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Load-Use Hazard", "적재-사용 해저드", "로드-유즈 해저드", "Load-Use Data Hazard", "스톨", "Stall", "파이프라인 지연", "거품", "Bubble", "버블", "해저드 검출 유닛", "Hazard Detection Unit", "nop"]
description: "메모리에서 값을 읽어 오는 명령어 바로 뒤에서 그 값을 쓰려 하면, 지름길로 당겨 써도 한 박자가 모자란다. 창고에서 물건이 아직 나오지도 않았는데 조립대가 먼저 손을 내미는 꼴이다. 이때는 뒤 명령어를 한 사이클 세워 두고, 그 빈자리에 아무 일도 하지 않는 칸을 흘려보낸다. 결…"
prev_url: "/studies/computer-architecture/data-hazard-forwarding/"
prev_title: "데이터 해저드와 전방 전달"
next_url: "/studies/computer-architecture/control-hazard-branch-prediction/"
next_title: "제어 해저드와 분기 예측"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-architecture/load-use-stall/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

메모리에서 값을 읽어 오는 명령어 바로 뒤에서 그 값을 쓰려 하면, 지름길로 당겨 써도 한 박자가 모자란다. 창고에서 물건이 아직 나오지도 않았는데 조립대가 먼저 손을 내미는 꼴이다. 이때는 뒤 명령어를 한 사이클 세워 두고, 그 빈자리에 아무 일도 하지 않는 칸을 흘려보낸다. 결과는 늘 맞지만 그때마다 한 사이클을 잃고, 두 명령어 사이에 상관없는 명령어를 하나 끼우면 잃지 않는다.

</div>


## 예시로 보기

[전방 전달](/Hongs_Blog/studies/computer-architecture/data-hazard-forwarding/)은 "이미 나온 값"을 당겨 쓴다. `add`의 결과는 EX 단계가 끝나면 나오므로 바로 뒤 명령어의 EX에 맞출 수 있었다. `lw`는 다르다. 메모리에서 읽은 값은 MEM 단계가 끝나야 나온다.

`$gp` = 64, 메모리 64번지에 10, `$s1` = 4, `$s2` = 1이다.

```asm
lw  $t0, 0($gp)       # $t0 = 10
add $t1, $t0, $s1
sub $t2, $t0, $s2
or  $t3, $t1, $t2
```

쉬지 않고 흘리면 `lw`의 MEM과 `add`의 EX가 둘 다 4번째 사이클이다. `add`는 4번째 사이클이 시작할 때 값이 필요한데, 값은 4번째 사이클이 끝날 때 나온다. 같은 사이클 안에서 뒤에 나올 값을 앞에서 쓸 수는 없다[^1].

그래서 `add`를 한 사이클 세운다.

| 명령어 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| `lw  $t0, 0($gp)` | IF | ID | EX | MEM | WB | | | | |
| `add $t1, $t0, $s1` | | IF | ID | ID | EX | MEM | WB | | |
| `sub $t2, $t0, $s2` | | | IF | IF | ID | EX | MEM | WB | |
| `or  $t3, $t1, $t2` | | | | | IF | ID | EX | MEM | WB |

`add`가 ID에 두 사이클 머문다. 5번째 사이클에 `add`가 EX에 들어갈 때 `lw`의 값은 MEM/WB에 있고, 거기서 당겨 쓴다(ForwardA = 01). 명령어 넷에 $$4 + 4 + 1 = 9$$사이클이 든다. 결과는 `$t1` = 14, `$t2` = 9, `$t3` = 15다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표와 9사이클, 한 사이클 쉰 뒤 MEM/WB에서 당겨 씀, 전방 전달이 없으면 12사이클, 아래 순서 바꾸기의 13사이클과 11사이클, 카드의 값 — [27_mips-pipeline_impl.py](/Hongs_Blog/studies/computer-architecture/code/27_mips-pipeline_impl/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 알아채는 조건

뒤 명령어가 ID 단계에 있을 때 검사한다. 그때 `lw`는 EX 단계에 있으므로 ID/EX 레지스터를 보면 된다[^2].

```
if (ID/EX.MemRead
    and (ID/EX.RegisterRt = IF/ID.RegisterRs
         or ID/EX.RegisterRt = IF/ID.RegisterRt))
    한 사이클 세운다
```

- `ID/EX.MemRead`가 1이면 EX에 있는 명령어가 `lw`다. 메모리를 읽는 명령어는 `lw`뿐이다.
- `ID/EX.RegisterRt`는 그 `lw`가 값을 넣을 레지스터다(`lw`는 rt에 쓴다).
- `IF/ID.RegisterRs`, `IF/ID.RegisterRt`는 지금 해독 중인 명령어가 읽을 레지스터 번호다.

이 검사를 하는 회로를 해저드 검출 유닛이라 부른다.

## 세우는 법

세 가지를 한꺼번에 한다[^3].

1. **PC를 그대로 둔다.** 다음 사이클에 같은 주소의 명령어를 다시 가져온다.
2. **IF/ID 레지스터를 그대로 둔다.** 다음 사이클에 같은 명령어를 다시 해독한다.
3. **ID/EX로 넘어가는 제어 신호를 모두 0으로 바꾼다.** EX로 들어가는 것은 아무것도 고치지 않는 빈 칸이다. 이 빈 칸이 EX, MEM, WB를 차례로 지나간다.

세운다(stall)는 것은 1과 2이고, 3으로 생기는 빈 칸을 거품(bubble)이라 부른다. RegWrite와 MemWrite가 0이면 레지스터도 메모리도 바뀌지 않으므로 거품은 프로그램에 흔적을 남기지 않는다([파이프라인 레지스터와 제어](/Hongs_Blog/studies/computer-architecture/pipeline-registers/)).

위 표를 "단계마다 누가 있나"로 다시 그리면 거품이 보인다.

| 사이클 | IF | ID | EX | MEM | WB |
|---|---|---|---|---|---|
| 3 | `sub` | `add` | `lw` | | |
| 4 | `sub` (다시) | `add` (다시) | 거품 | `lw` | |
| 5 | `or` | `sub` | `add` | 거품 | `lw` |
| 6 | | `or` | `sub` | `add` | 거품 |

한 사이클이면 충분하다. 쉬고 나면 `lw`의 값이 MEM/WB에 실려 있으므로 당겨 쓸 수 있다. 전방 전달이 아예 없는 파이프라인이라면 `lw`가 WB를 지날 때까지 두 사이클을 쉬어야 한다.

## 순서를 바꿔 피하기

쉬는 사이클은 `lw`와 그 값을 쓰는 명령어가 붙어 있을 때만 생긴다. 둘 사이에 상관없는 명령어가 하나 끼면 사라진다. 컴파일러가 이렇게 명령어 순서를 바꿔 준다[^4].

"d = a − b; e = c − d"를 옮긴 코드다. a, b, c는 메모리 64, 68, 72번지에 9, 4, 20으로 들어 있다.

| 그대로 옮긴 순서 | 바꾼 순서 |
|---|---|
| `lw  $t1, 0($gp)` | `lw  $t1, 0($gp)` |
| `lw  $t2, 4($gp)` | `lw  $t2, 4($gp)` |
| `sub $t3, $t1, $t2` ← 쉼 | `lw  $t4, 8($gp)` |
| `sw  $t3, 12($gp)` | `sub $t3, $t1, $t2` |
| `lw  $t4, 8($gp)` | `sw  $t3, 12($gp)` |
| `sub $t5, $t4, $t3` ← 쉼 | `sub $t5, $t4, $t3` |
| `sw  $t5, 16($gp)` | `sw  $t5, 16($gp)` |
| 13사이클 | 11사이클 |

왼쪽은 `lw` 바로 뒤에 그 값을 쓰는 `sub`가 두 번 나와 두 번 쉰다($$4 + 7 + 2 = 13$$). 오른쪽은 셋째 `lw`를 위로 올려 두 `sub` 앞에 모두 한 칸씩 틈을 만들었다($$4 + 7 = 11$$). 두 순서 모두 메모리 76번지에 5, 80번지에 15가 들어간다.

## 활용

- [CPU 시간 식](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/)으로 보면 쉬는 사이클은 명령어당 사이클 수(CPI)를 1보다 크게 만든다. 명령어 $$n$$개 가운데 적재-사용이 $$s$$번이면 $$n + 4 + s$$사이클이다.
- 위 조건은 뒤 명령어의 rt 칸을 "읽는지 안 읽는지" 가리지 않고 견준다. 그래서 `lw $t0, 0($gp)` 바로 뒤에 `lw $t0, 4($gp)`처럼 rt에 쓰기만 하는 명령어가 와도 한 사이클을 쉰다. 결과는 맞고 사이클만 하나 잃는다[^s1].
- `lw` 바로 뒤의 `sw`가 그 값을 메모리에 저장할 때도 이 문서의 설계에서는 한 사이클을 쉰다. `sw`는 값이 MEM 단계에야 필요하므로 MEM 단계로 당겨 쓰는 길을 하나 더 놓으면 쉬지 않아도 된다[^s1].
- 흔한 실수: `lw` 뒤에는 무조건 쉰다고 세는 것. 뒤 명령어가 그 레지스터를 읽을 때만이다.
- 흔한 실수: 두 칸 뒤 명령어도 쉰다고 세는 것. 두 칸 뒤라면 MEM/WB에서 당겨 쓸 수 있다.
- 연습: [파이프라인 해저드 예제 사다리](/Hongs_Blog/studies/computer-architecture/pipeline-hazard-ladder/)

## 연결

- 선수: [데이터 해저드와 전방 전달](/Hongs_Blog/studies/computer-architecture/data-hazard-forwarding/), [파이프라인 레지스터와 제어](/Hongs_Blog/studies/computer-architecture/pipeline-registers/)
- 같은 "세우기와 거품"을 분기에 쓰는 경우: [제어 해저드와 분기 예측](/Hongs_Blog/studies/computer-architecture/control-hazard-branch-prediction/)
- 컴파일러가 식에서 `lw`와 연산 명령을 만들어 내는 과정: [단순 연산과 분기의 코드 생성](/Hongs_Blog/studies/compilers/codegen-simple-operations/). 그 문서의 명령어 표기는 수업용으로 단순하게 바꾼 것이라 여기의 실제 MIPS 표기와 다르다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 적재-사용 해저드를 알아채는 조건을 쓰고, 세울 때 하는 일 세 가지를 쓰라.</summary>

**답:** 조건: ID/EX.MemRead = 1이고, ID/EX.RegisterRt가 IF/ID.RegisterRs 또는 IF/ID.RegisterRt와 같다. 하는 일: PC를 그대로 둔다, IF/ID를 그대로 둔다, ID/EX로 넘기는 제어 신호를 모두 0으로 바꾼다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `add` 바로 뒤에서 그 결과를 쓰는 것은 전방 전달로 풀리는데, `lw` 바로 뒤는 왜 전방 전달만으로 안 풀리는가?</summary>

**답:** `add`의 결과는 EX가 끝날 때 나와서 다음 사이클(뒤 명령어의 EX)에 넘길 수 있다. `lw`의 값은 MEM이 끝날 때 나오는데, 바로 뒤 명령어의 EX는 `lw`의 MEM과 같은 사이클이다. 그 사이클이 끝날 때 나올 값을 그 사이클이 시작할 때 쓸 수는 없다. 한 사이클을 미루면 값이 MEM/WB에 있게 되어 당겨 쓸 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `lw $t0, 0($gp)` / `lw $t1, 4($gp)` / `add $t2, $t0, $t1` / `sw $t2, 8($gp)`를 전방 전달이 있는 파이프라인에서 실행한다. 몇 번 쉬고 모두 몇 사이클이 드는가? `add`는 몇 번째 사이클에 EX에 있는가?</summary>

**답:** 한 번 쉬고 9사이클. `add`는 6번째 사이클에 EX에 있다.<br>
**이유:** `add`가 읽는 `$t1`은 바로 앞 `lw`의 값이라 한 번 쉰다. `$t0`는 두 칸 앞 `lw`의 값이라 쉬지 않는다. `add`는 3번째 사이클에 IF, 4·5번째에 ID, 6번째에 EX다. $$4 + 4 + 1 = 9$$.

</details>


[^1]: 교재 출판사 강의 슬라이드 "Chapter 4 — The Processor" (Cooper Union 게시본), 슬라이드 10, 45 (Load-Use Data Hazard: 전방 전달로 늘 쉬는 것을 피할 수는 없다, 시간을 거슬러 넘길 수 없다, 한 사이클을 쉬어야 한다), https://ee.cooper.edu/~curro/comparch/pipeline/chapter4_pipelining_END_FA11.pdf. Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 4장 "The Processor"
[^2]: 같은 슬라이드, 46 (Load-Use Hazard Detection의 조건식)
[^3]: 같은 슬라이드, 47~50 (How to Stall the Pipeline, Stall/Bubble in the Pipeline, Datapath with Hazard Detection)
[^4]: 같은 슬라이드, 11, 51 (Code Scheduling to Avoid Stalls, Stalls and Performance: 컴파일러가 코드를 배치해 쉬는 사이클을 피할 수 있다).
[^s1]: MEM 단계로 당겨 쓰는 길을 놓는 설계가 있다는 것은 [확인필요].
{% endraw %}
