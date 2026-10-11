---
layout: "note"
title: "데이터 해저드와 전방 전달"
display_title: "데이터 해저드와 전방 전달 (Data Hazards and Forwarding)"
kind: "concept"
kind_label: "기법"
num: "29"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Data Hazard", "데이터 해저드", "데이터 위험", "Forwarding", "전방 전달", "포워딩", "Bypassing", "바이패싱", "전방 전달 유닛", "Forwarding Unit", "ForwardA", "ForwardB", "EX 해저드", "MEM 해저드", "이중 데이터 해저드", "Double Data Hazard"]
description: "앞 명령어가 계산한 값을 바로 뒤 명령어가 쓰려는데, 그 값이 아직 레지스터에 적히지 않은 상황이다. 옆자리 동료가 계산을 막 끝냈는데 장부에 옮겨 적는 것은 이틀 뒤라면, 장부를 기다리지 말고 동료 책상에서 바로 받아 오면 된다. 프로세서도 계산이 끝난 값을 레지스터를 거치지 않…"
prev_url: "/studies/computer-architecture/pipeline-registers/"
prev_title: "파이프라인 레지스터와 제어"
next_url: "/studies/computer-architecture/load-use-stall/"
next_title: "적재-사용 해저드와 스톨"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-architecture/data-hazard-forwarding/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

앞 명령어가 계산한 값을 바로 뒤 명령어가 쓰려는데, 그 값이 아직 레지스터에 적히지 않은 상황이다. 옆자리 동료가 계산을 막 끝냈는데 장부에 옮겨 적는 것은 이틀 뒤라면, 장부를 기다리지 말고 동료 책상에서 바로 받아 오면 된다. 프로세서도 계산이 끝난 값을 레지스터를 거치지 않고 지름길로 당겨 써서, 대부분 쉬지 않고 이어 간다. 다만 메모리에서 막 읽어 오는 값처럼 아직 만들어지지도 않은 값은 당겨 쓸 수 없어서, 그때는 한 사이클을 쉬어야 한다.

</div>


## 예시로 보기

[5단계 파이프라인](/Hongs_Blog/studies/computer-architecture/mips-pipeline/)에서 명령어는 ID 단계에 레지스터를 읽고 WB 단계에 쓴다. 둘 사이가 세 사이클 떨어져 있다. 그 틈에 뒤 명령어가 같은 레지스터를 읽으면 옛 값을 읽는다.

`$s1` = 30, `$s2` = 10, `$s3` = 12, `$s4` = 3, `$t4` = 99에서 시작한다. `sub`가 `$t0`에 20을 만들고, 뒤의 넷이 모두 `$t0`를 읽는다.

```asm
sub $t0, $s1, $s2     # $t0 = 20
and $t1, $t0, $s3
or  $t2, $s4, $t0
add $t3, $t0, $t0
sw  $t4, 8($t0)
```

| 명령어 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| `sub $t0, $s1, $s2` | IF | ID | EX | MEM | WB | | | | |
| `and $t1, $t0, $s3` | | IF | ID | EX | MEM | WB | | | |
| `or  $t2, $s4, $t0` | | | IF | ID | EX | MEM | WB | | |
| `add $t3, $t0, $t0` | | | | IF | ID | EX | MEM | WB | |
| `sw  $t4, 8($t0)` | | | | | IF | ID | EX | MEM | WB |

`sub`는 5번째 사이클에 `$t0`를 쓴다. 뒤의 넷이 `$t0`를 읽는 때(ID)와 견준다.

| 명령어 | `$t0`를 읽는 사이클 | 읽은 값은 | 어떻게 푸나 |
|---|---|---|---|
| `and` | 3 | 옛 값 | 4번째 사이클(EX)에 EX/MEM에서 당겨 쓴다 |
| `or` | 4 | 옛 값 | 5번째 사이클(EX)에 MEM/WB에서 당겨 쓴다 |
| `add` | 5 | 새 값 | 레지스터 파일이 같은 사이클의 앞 절반에 쓰고 뒤 절반에 읽는다 |
| `sw` | 6 | 새 값 | 문제없다 |

`sub`의 결과 20은 3번째 사이클 끝에 이미 ALU에서 나왔다. 레지스터에 적히는 것이 5번째 사이클일 뿐이다. 그 사이 값은 4번째 사이클에는 EX/MEM 레지스터에, 5번째 사이클에는 MEM/WB 레지스터에 실려 있다. `and`와 `or`가 ALU에 값을 넣을 때 거기서 꺼내 오면 쉬지 않고 9사이클에 끝난다. 결과는 `$t1` = 4, `$t2` = 23, `$t3` = 40이고 메모리 28번지에 99가 들어간다.

당겨 쓰는 길이 없으면 `and`가 ID에서 두 사이클을 기다려야 한다.

| 명령어 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `sub $t0, $s1, $s2` | IF | ID | EX | MEM | WB | | | | | | |
| `and $t1, $t0, $s3` | | IF | ID | ID | ID | EX | MEM | WB | | | |
| `or  $t2, $s4, $t0` | | | IF | IF | IF | ID | EX | MEM | WB | | |
| `add $t3, $t0, $t0` | | | | | | IF | ID | EX | MEM | WB | |
| `sw  $t4, 8($t0)` | | | | | | | IF | ID | EX | MEM | WB |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 두 표(9사이클과 11사이클), 당겨 쓴 길(`and`는 ForwardA = 10, `or`는 ForwardB = 01), 결과 값, 조건을 일부러 틀리게 만든 두 경우가 틀린 답을 냄, 무작위 프로그램 4,000개에서 단일 사이클 흉내기와 같음 — [27_mips-pipeline_impl.py](/Hongs_Blog/studies/computer-architecture/code/27_mips-pipeline_impl/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 전방 전달의 조건

ALU의 두 입력 앞에 멀티플렉서를 하나씩 놓는다. 세 값 가운데 하나를 고른다[^1].

| 고르는 신호 | 값 | 고르는 것 |
|---|---|---|
| ForwardA, ForwardB = 00 | ID/EX에 실려 온 값 | ID에서 레지스터 파일로 읽은 값 (당겨 쓰지 않음) |
| = 10 | EX/MEM의 ALU 결과 | 바로 앞 명령어가 방금 계산한 값 |
| = 01 | MEM/WB의 값(WB가 쓰려는 값) | 두 칸 앞 명령어의 결과 |

ForwardA는 ALU의 첫째 입력(rs 쪽), ForwardB는 둘째 입력(rt 쪽)을 고른다.

고르는 일은 전방 전달 유닛이라는 작은 회로가 한다. 파이프라인 레지스터에 실린 레지스터 번호를 견준다. 표기 `EX/MEM.RegisterRd`는 "EX/MEM 레지스터에 실린, 그 명령어가 쓸 레지스터 번호"다[^2].

**EX 해저드 (바로 앞 명령어의 결과).** 바로 앞 명령어가 레지스터에 쓰는 명령어이고, 쓸 곳이 `$zero`가 아니고, 쓸 곳이 내가 읽는 rs와 같으면 EX/MEM에서 당겨 쓴다.

```
if (EX/MEM.RegWrite and EX/MEM.RegisterRd ≠ 0
    and EX/MEM.RegisterRd = ID/EX.RegisterRs)   ForwardA = 10
if (EX/MEM.RegWrite and EX/MEM.RegisterRd ≠ 0
    and EX/MEM.RegisterRd = ID/EX.RegisterRt)   ForwardB = 10
```

**MEM 해저드 (두 칸 앞 명령어의 결과).** 두 칸 앞 명령어가 같은 조건에 맞고, 위의 EX 해저드가 아닐 때만 MEM/WB에서 당겨 쓴다[^3].

```
if (MEM/WB.RegWrite and MEM/WB.RegisterRd ≠ 0
    and not (EX/MEM.RegWrite and EX/MEM.RegisterRd ≠ 0
             and EX/MEM.RegisterRd = ID/EX.RegisterRs)
    and MEM/WB.RegisterRd = ID/EX.RegisterRs)   ForwardA = 01
```

ForwardB는 Rs를 Rt로 바꾼 같은 식이다.

조건의 세 조각에는 각각 이유가 있다.

- **RegWrite를 본다.** `sw`와 `beq`는 레지스터에 쓰지 않는다. 그 명령어의 rt·rd 자리 비트가 우연히 내 rs와 같아도 당겨 쓸 값이 없다.
- **`$zero`를 뺀다.** `$zero`에 쓰는 명령어(`add $zero, $s1, $s2`)의 ALU 결과는 0이 아닐 수 있다. 하지만 `$zero`는 늘 0이어야 한다. 이 조건이 없으면 뒤 명령어가 0 대신 그 ALU 결과를 받는다.
- **EX 해저드가 먼저다.** 같은 레지스터를 잇달아 고치면 EX/MEM과 MEM/WB 양쪽에 그 레지스터의 값이 있다. 더 최근 것은 EX/MEM 쪽이다.

마지막 경우의 예다. `$t0` = 1, `$s1` = 10, `$s2` = 100, `$s3` = 1000에서:

```asm
add $t0, $t0, $s1     # 11
add $t0, $t0, $s2     # 111
add $t0, $t0, $s3     # 1111
```

셋째 `add`가 EX에 있을 때 EX/MEM에는 111이, MEM/WB에는 11이 있다. 111을 골라야 1111이 나온다. 순서를 뒤집어 MEM/WB를 먼저 고르면 $$11 + 1000 = 1011$$이 되어 틀린다.

### 왜 이 조건이면 충분한가

**주장.** 앞 명령어가 R형일 때, 위 조건으로 고른 값은 "명령어를 하나씩 차례로 실행했을 때 그 레지스터에 들어 있을 값"과 같다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">이유 펼치기</summary>

EX 단계의 명령어 $$I$$가 레지스터 $$r$$을 읽는다고 하자. $$I$$보다 앞선 명령어 가운데 $$r$$에 쓰는 가장 최근 명령어를 $$P$$라 한다. 차례로 실행했다면 $$I$$가 읽을 값은 $$P$$의 결과다.

1. **$$P$$가 바로 앞(한 칸 앞)이다.** $$I$$가 EX에 있을 때 $$P$$는 MEM에 있고 그 결과는 EX/MEM에 있다. EX 해저드 조건이 참이 되어 그 값을 고른다. — 단계 배치
2. **$$P$$가 두 칸 앞이고 한 칸 앞 명령어는 $$r$$에 쓰지 않는다.** $$P$$는 WB에 있고 결과는 MEM/WB에 있다. EX 해저드 조건은 거짓, MEM 해저드 조건은 참이라 그 값을 고른다.
3. **$$P$$가 세 칸 앞이다.** $$I$$가 ID에 있던 사이클에 $$P$$가 WB에 있었다. 레지스터 파일이 앞 절반에 쓰고 뒤 절반에 읽으므로 $$I$$는 ID에서 이미 새 값을 읽었다. 두 조건 모두 거짓이고 그 값을 그대로 쓴다. — 레지스터 파일의 약속
4. **$$P$$가 네 칸 이상 앞이다.** $$I$$가 ID에 닿기 전에 $$P$$의 WB가 끝났다. 읽은 값이 옳다.
5. **$$r$$ = `$zero`다.** 어떤 명령어도 `$zero`를 바꾸지 못하므로 읽은 값 0이 옳다. 조건의 "≠ 0"이 당겨 쓰기를 막는다.
6. 한 칸 앞과 두 칸 앞이 둘 다 $$r$$에 쓰면 $$P$$는 한 칸 앞이다. "EX 해저드가 아닐 때만"이 1을 고르게 한다. ∎

$$P$$가 `lw`이면 1이 깨진다. `lw`의 값은 MEM 단계가 끝나야 나오는데 EX/MEM에 있는 것은 주소다. 이 경우는 [적재-사용 해저드와 스톨](/Hongs_Blog/studies/computer-architecture/load-use-stall/)에서 따로 막는다.

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 3에서 레지스터 파일이 "앞 절반에 쓰고 뒤 절반에 읽는다"는 약속이 없으면 무엇을 더해야 하나?</summary>

세 칸 앞 명령어의 결과를 당겨 쓰는 길이 하나 더 필요하다. WB가 쓰는 값을 ID가 읽은 값 대신 넣어 주는 멀티플렉서다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 1에서 EX/MEM에 있는 값이 왜 "$$P$$의 결과"인가?</summary>

$$P$$가 R형이면 결과는 ALU에서 나오고, ALU 결과는 EX가 끝날 때 EX/MEM에 실린다. 그 값이 두 사이클 뒤 레지스터에 쓰일 바로 그 값이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. `sw $t4, 8($t0)`에서 `$t4`가 바로 앞 명령어의 결과라면 ForwardB는 무엇이 되고, 당겨 온 값은 어디로 가는가?</summary>

ForwardB = 10이다. `sw`에서 ALU의 둘째 입력은 상수 8이므로 당겨 온 값은 ALU로 가지 않는다. EX/MEM의 "메모리에 쓸 값" 칸으로 간다. 그래서 전방 전달 멀티플렉서는 "상수와 레지스터 값 가운데 고르는 멀티플렉서"보다 앞에 놓는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 논증의 핵심 아이디어는?</summary>

"값은 레지스터에 적히기 전에 이미 어딘가에 있다." 만든 명령어가 몇 칸 앞인지에 따라 그 값이 어느 파이프라인 레지스터에 실려 있는지가 정해지고, 조건은 그 자리를 찾아가는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

분기를 ID에서 판정하는 설계에서는 비교기 앞에도 같은 지름길을 놓는다([제어 해저드와 분기 예측](/Hongs_Blog/studies/computer-architecture/control-hazard-branch-prediction/)). 저장소에 아직 반영되지 않은 최신 값을 중간 버퍼에서 먼저 찾아 쓰는 구조(예: 쓰기 버퍼가 있는 캐시)도 같은 생각이다.

</details>


## 활용

- 당겨 쓰는 길이 있으면 R형 명령어끼리는 쉬는 사이클이 없다. 예시에서 11사이클이 9사이클로 준다.
- 문제를 풀 때는 명령어마다 "읽는 레지스터를 가장 최근에 고친 명령어가 몇 칸 앞인가"를 센다. 한 칸 앞 → EX/MEM(10), 두 칸 앞 → MEM/WB(01), 세 칸 이상 → 당겨 쓰지 않음.
- 흔한 실수: 세 칸 앞 명령어의 결과도 당겨 써야 한다고 표시하는 것. 레지스터 파일이 해결한다.
- 흔한 실수: 값이 "뒤로" 흐른다고 그리는 것. 값은 늘 이미 계산이 끝난 단계에서 지금 계산하려는 단계로 간다. 시간을 거스르지 않는다.
- 연습: [파이프라인 해저드 예제 사다리](/Hongs_Blog/studies/computer-architecture/pipeline-hazard-ladder/)

## 연결

- 선수: [5단계 파이프라인](/Hongs_Blog/studies/computer-architecture/mips-pipeline/), [파이프라인 레지스터와 제어](/Hongs_Blog/studies/computer-architecture/pipeline-registers/)
- 당겨 쓸 수 없는 경우: [적재-사용 해저드와 스톨](/Hongs_Blog/studies/computer-architecture/load-use-stall/)
- 세 값 가운데 하나를 고르는 부품: [멀티플렉서와 디코더](/Hongs_Blog/studies/computer-architecture/mux-decoder/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"전방 전달은 아직 계산되지 않은 값을 미리 가져오는 기술이다"</div>

틀렸다. 당겨 쓰는 값은 이미 계산이 끝난 값이다. 표에서 값이 "아직 WB를 지나지 않은 명령어"에서 오기 때문에 미래에서 가져오는 것처럼 보여서 그럴듯하다. 실제로는 ALU가 3번째 사이클 끝에 값을 냈고, 4번째 사이클의 `and`가 그것을 받는다. 레지스터에 적히는 일만 5번째 사이클로 늦을 뿐이다. 확인하는 법: 값이 아직 만들어지지 않은 경우를 보면 된다. `lw` 바로 뒤 명령어는 `lw`의 값이 4번째 사이클 끝에야 나오므로 4번째 사이클의 EX에서 받을 수 없고, 한 사이클을 쉬어야 한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** ForwardA = 10이 되는 조건을 세 조각으로 쓰고, 그때 ALU 첫째 입력에 들어가는 값이 무엇인지 답하라.</summary>

**답:** ① EX/MEM.RegWrite = 1 ② EX/MEM.RegisterRd ≠ 0 ③ EX/MEM.RegisterRd = ID/EX.RegisterRs. 들어가는 값은 EX/MEM에 실린 ALU 결과(바로 앞 명령어의 결과)다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `$s0` = 6, `$s1` = 3, `$s2` = 4에서 아래 세 명령어를 실행한다. `sub`와 `and`의 ForwardA·ForwardB 값과 `$t2`의 최종 값은?</summary>

```asm
add $t0, $s0, $s1
sub $t1, $t0, $s2
and $t2, $t0, $t1
```
**답:** `sub`: ForwardA = 10, ForwardB = 00. `and`: ForwardA = 01, ForwardB = 10. `$t2` = 1.<br>
**이유:** `sub`의 rs(`$t0`)는 한 칸 앞 `add`의 결과 → EX/MEM. `and`의 rs(`$t0`)는 두 칸 앞 → MEM/WB, rt(`$t1`)는 한 칸 앞 `sub`의 결과 → EX/MEM. `$t0` = 9, `$t1` = 5, $$9 \mathbin{\&} 5 = 1$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 조건에 "RegisterRd ≠ 0"이 없으면 틀리는 프로그램을 하나 들고, 맞는 답과 틀린 답을 쓰라. `$s1` = 10, `$s2` = 100이다.</summary>

**답:** `add $zero, $s1, $s2` 다음에 `add $t1, $zero, $zero`. 맞는 답은 `$t1` = 0이다. 조건이 없으면 앞 명령어의 ALU 결과 110이 양쪽 입력으로 당겨져 `$t1` = 220이 된다.<br>
**이유:** `$zero`에 쓰는 명령어도 ALU는 계산을 하고 그 결과가 EX/MEM에 실린다. 레지스터 파일은 그 쓰기를 무시하지만, 전방 전달 유닛은 따로 막아야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** MEM 해저드 조건에 "EX 해저드가 아닐 때만"이 붙는 이유를, 같은 레지스터를 세 번 잇달아 고치는 예로 설명하라.</summary>

**답:** `add $t0, $t0, $s1`을 세 번 잇달아 쓰면, 셋째가 EX에 있을 때 EX/MEM에는 둘째의 결과가, MEM/WB에는 첫째의 결과가 있고 둘 다 쓸 곳이 `$t0`다. 차례로 실행했다면 셋째가 읽을 값은 둘째의 결과다. 그래서 더 최근인 EX/MEM을 먼저 본다. 이 조각이 없으면 두 조건이 모두 참이 되어 어느 쪽을 고를지 정해지지 않거나 옛 값을 고른다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 아래에서 `or`가 `$t0`를 얻는 길은 (가) EX/MEM에서 당겨 쓰기 (나) MEM/WB에서 당겨 쓰기 (다) 레지스터 파일에서 읽은 값 그대로 가운데 무엇인가?</summary>

```asm
sub $t0, $s1, $s2
add $t5, $s3, $s4
and $t6, $s3, $s4
or  $t2, $t0, $s4
```
**답:** (다).<br>
**이유:** `sub`는 `or`보다 세 칸 앞이다. `or`가 ID에 있는 사이클에 `sub`가 WB에 있고, 레지스터 파일이 앞 절반에 쓰고 뒤 절반에 읽으므로 `or`는 ID에서 새 값을 읽는다.

</details>


[^1]: 교재 출판사 강의 슬라이드 "Chapter 4 — The Processor" (Cooper Union 게시본), 슬라이드 9, 40~41 (Forwarding (aka Bypassing): 계산되자마자 쓴다, Forwarding Paths, Forwarding Conditions의 ForwardA·ForwardB = 10, 01), https://ee.cooper.edu/~curro/comparch/pipeline/chapter4_pipelining_END_FA11.pdf. Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 4장 "The Processor"의 "Data Hazards: Forwarding versus Stalling" 절(절 제목은 같은 슬라이드 36에서 확인)
[^2]: 같은 슬라이드, 38~39, 41 (Detecting the Need to Forward: 레지스터 번호를 파이프라인을 따라 실어 보낸다, RegWrite와 Rd ≠ 0 조건, EX hazard 식)
[^3]: 같은 슬라이드, 42~43 (Double Data Hazard, Revised Forwarding Condition)
{% endraw %}
