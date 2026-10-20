---
layout: "note"
title: "TEST와 CMP"
display_title: "TEST와 CMP"
kind: "concept"
kind_label: "정의"
num: "30"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["TEST 명령", "CMP 명령", "TEST Instruction", "CMP Instruction", "비교 명령", "Comparison Instructions", "비파괴 연산", "Nondestructive"]
description: "두 물건의 무게를 견주려고 저울에 올려도 물건은 그대로다. 눈금만 움직인다. 이 두 명령은 계산을 하되 답은 버리고, 계산 결과가 어땠는지 알려 주는 표시등만 남긴다. 하나는 빼기를 해서 두 값의 크고 작음을 알려 주고, 다른 하나는 비트끼리 견줘서 고른 비트가 켜져 있는지 알려 …"
prev_url: "/studies/assembly-language/bitwise-instructions/"
prev_title: "비트 논리 명령"
next_url: "/studies/assembly-language/conditional-jumps/"
next_title: "조건 점프"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "30_test-cmp_verify.py", "u": "/studies/assembly-language/code/30_test-cmp_verify/", "r": "검증"}]
permalink: "/studies/assembly-language/test-cmp/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 물건의 무게를 견주려고 저울에 올려도 물건은 그대로다. 눈금만 움직인다. 이 두 명령은 계산을 하되 답은 버리고, 계산 결과가 어땠는지 알려 주는 표시등만 남긴다. 하나는 빼기를 해서 두 값의 크고 작음을 알려 주고, 다른 하나는 비트끼리 견줘서 고른 비트가 켜져 있는지 알려 준다. 값이 망가지지 않으니 견준 뒤에도 그대로 쓸 수 있다. 단, 크고 작음을 읽을 때 봐야 할 표시등이 부호 없는 수와 부호 있는 수에서 서로 다르다.

</div>


## 예시로 보기

"AL이 5보다 작으면 저쪽으로 가라"를 하고 싶다. 지금까지 배운 것으로는 `sub al,5`를 하고 결과를 봐야 한다. 그런데 그러면 AL이 바뀐다. 견주기만 하고 AL은 그대로 쓰고 싶다. 플래그([산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/))만 얻는 뺄셈이 `CMP`다.

```asm
    mov al,4
    cmp al,5        ; 4 - 5를 해 보고 답은 버린다. AL은 4 그대로
```

4에서 5를 빼면 모자라서 윗자리에서 빌려 와야 한다. 그래서 올림 플래그 CF가 1이 된다. 부호 없는 수로 볼 때 "왼쪽이 오른쪽보다 작다"는 표시다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: CMP 예 다섯 개의 플래그, 8비트 두 수의 모든 쌍(65,536쌍)에서 아래 두 표가 맞는 것, TEST 예 두 개(256가지 전수), CMP·TEST가 피연산자를 안 바꾸는 것, 넘침 플래그 규칙(덧셈 8비트 전수), 카드 C2 — [30_test-cmp_verify.py](/Hongs_Blog/studies/assembly-language/code/30_test-cmp_verify/) (파이썬 흉내로 확인. 실제 MASM으로 돌린 것이 아니다)</div>

</div>


## 정의

**CMP.** `CMP 목적지, 원본`은 목적지에서 원본을 빼 보고 플래그만 매긴다. 목적지는 바뀌지 않는다. `SUB`와 다른 점은 결과를 넣지 않는다는 것 하나다.

**TEST.** `TEST 목적지, 원본`은 두 피연산자의 같은 자리 비트끼리 AND를 해 보고 플래그만 매긴다. 어느 피연산자도 바뀌지 않는다. `AND`와 다른 점은 결과를 넣지 않는다는 것 하나다.

| 값을 바꾸는 명령 | 플래그만 매기는 짝 | 해 보는 계산 |
|---|---|---|
| `SUB` | `CMP` | 목적지 − 원본 |
| `AND` | `TEST` | 목적지 AND 원본 |

**CMP 뒤의 플래그 읽기.** 왼쪽이 목적지, 오른쪽이 원본이다. 부호 없는 수로 볼 때는 ZF와 CF를 본다.

| 관계 (부호 없는 수) | 플래그 | 예 |
|---|---|---|
| 목적지 = 원본 | ZF = 1 | `mov al,5` / `cmp al,5` |
| 목적지 < 원본 | CF = 1 | `mov al,4` / `cmp al,5` |
| 목적지 > 원본 | ZF = 0이고 CF = 0 | `mov al,6` / `cmp al,5` |

부호 있는 수로 볼 때는 ZF, SF, OF를 본다[^s1].

| 관계 (부호 있는 수) | 플래그 | 예 |
|---|---|---|
| 목적지 = 원본 | ZF = 1 | |
| 목적지 < 원본 | SF ≠ OF | `mov al,-1` / `cmp al,5` |
| 목적지 > 원본 | ZF = 0이고 SF = OF | `mov al,5` / `cmp al,-2` |

두 값이 같을 때도 SF = OF(둘 다 0)다. 그래서 "크다"만 가려내려면 SF = OF에 더해 ZF = 0을 함께 봐야 한다[^s1].

왜 SF와 OF를 함께 볼까? 뺀 결과가 음수면(SF = 1) 왼쪽이 작다. 그런데 뺄셈이 넘치면(OF = 1) 결과의 부호가 뒤집혀 나온다. 그래서 "SF가 1이고 안 넘쳤거나, SF가 0인데 넘쳤으면" 작은 것이다. 이것을 한마디로 쓴 것이 SF ≠ OF다. 증명은 [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/)에 있다.

**플래그 복습.** 상태 플래그 여섯을 다시 정리하면 이렇다.

| 플래그 | 1이 되는 때 |
|---|---|
| ZF (Zero) | 연산 결과가 0 |
| CF (Carry) | 결과가 목적지에 담기에 너무 크다(또는 너무 작다) |
| SF (Sign) | 목적지가 음수. 양수면 0 |
| OF (Overflow) | 부호 있는 수로 볼 때 결과가 틀렸다. 7번 비트로 들어온 올림과 7번 비트에서 나간 올림을 XOR 한 값이다(8비트일 때) |
| PF (Parity) | 목적지의 아래 바이트에 1이 짝수 개 |
| AC (Auxiliary Carry) | 3번 비트에서 4번 비트로 올림이 생겼다 |

## 예제

**CMP 예를 계산으로 따라가기.**[^s1]

| 코드 | 해 보는 뺄셈 | 결과 | ZF | CF | SF | OF | 읽기 |
|---|---|---|---|---|---|---|---|
| `mov al,5` / `cmp al,5` | 05h − 05h | 00h | 1 | 0 | 0 | 0 | 같다 |
| `mov al,4` / `cmp al,5` | 04h − 05h | FFh | 0 | 1 | 1 | 0 | 부호 없이 작다 |
| `mov al,6` / `cmp al,5` | 06h − 05h | 01h | 0 | 0 | 0 | 0 | 부호 없이 크다 |
| `mov al,5` / `cmp al,-2` | 05h − FEh | 07h | 0 | 1 | 0 | 0 | 부호 있게 크다 (SF = OF) |
| `mov al,-1` / `cmp al,5` | FFh − 05h | FAh | 0 | 0 | 1 | 0 | 부호 있게 작다 (SF ≠ OF) |

넷째 줄을 본다. 5와 −2를 견줬는데 CF가 1이다. 부호 없는 수로 읽으면 5와 254(FEh)라서 "작다"가 맞다. 같은 비트, 같은 뺄셈인데 어느 플래그를 읽느냐에 따라 답이 다르다. CPU는 피연산자가 부호 있는 수인지 모른다. 어느 플래그를 볼지는 프로그래머가 고른다([부호 있는 비교 점프와 부호 없는 비교 점프](/Hongs_Blog/studies/assembly-language/signed-vs-unsigned-jumps/)).

**넘치는 경우.** `mov al,-128` / `cmp al,1`은 80h − 01h = 7Fh다. 결과가 양수(SF = 0)지만 −128 − 1 = −129는 8비트에 안 들어가 넘친다(OF = 1). SF ≠ OF이므로 "작다"로 바르게 읽힌다[^s1].

**TEST로 비트 보기.** AL의 0번이나 1번 비트 중 하나라도 켜져 있으면 점프한다.

```asm
    test al,00000011b
    jnz  ValueFound         ; 결과가 0이 아니다 = 하나 이상 켜졌다
```

둘 다 꺼져 있으면 점프한다.

```asm
    test al,00000011b
    jz   ValueNotFound      ; 결과가 0이다 = 둘 다 꺼졌다
```

`and al,00000011b`로도 같은 플래그가 나오지만 AL에는 아래 두 비트만 남는다. `test`를 쓰면 AL이 그대로다.

## 활용

- `CMP`나 `TEST` 바로 다음 줄에는 거의 늘 [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/)가 온다. 견주고 갈라 가는 두 줄이 고급 언어의 `if` 한 줄이다([조건 구조를 점프로 옮기기](/Hongs_Blog/studies/assembly-language/conditional-structures/)).
- `TEST`의 결과는 보통 ZF로 읽는다. 하지만 `AND`와 같은 계산이라 SF와 PF도 매겨지고 CF와 OF는 0이 된다[^s1].
- 흔한 실수: `CMP`와 점프 사이에 플래그를 바꾸는 명령(`ADD`, `INC` 등)을 끼운다. 점프는 맨 마지막 연산의 플래그를 본다. `MOV`는 플래그를 안 바꾸므로 끼워도 된다.
- 흔한 실수: 피연산자 순서를 뒤집는다. `cmp al,5`는 "AL을 5와 견준다"이고 `AL − 5`를 한다. "작다"는 왼쪽이 작다는 뜻이다.

## 연결

- 선수: [산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/), [비트 논리 명령](/Hongs_Blog/studies/assembly-language/bitwise-instructions/)
- CF와 OF가 각각 무엇을 알리는지: [올림 플래그와 넘침 플래그 비교](/Hongs_Blog/studies/assembly-language/carry-vs-overflow-flag/)
- 플래그를 읽어 갈라 가기: [조건 점프](/Hongs_Blog/studies/assembly-language/conditional-jumps/)
- −2가 FEh인 까닭: [정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)
- 컴파일러가 비교식을 기계어로 옮기는 자리: [단순 연산과 분기의 코드 생성](/Hongs_Blog/studies/compilers/codegen-simple-operations/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) EAX가 100 이상인지 알고 싶다. EAX는 뒤에서 또 쓴다. (b) EAX에서 100을 빼서 그 값을 쓰려 한다. (c) EAX의 맨 아래 비트가 켜졌는지 알고 싶다. EAX는 뒤에서 또 쓴다. 각각 `SUB`, `CMP`, `AND`, `TEST` 중 무엇을 쓰는가?</summary>

**답:** (a) `cmp eax,100` (b) `sub eax,100` (c) `test eax,1`.<br>
**이유:** 값을 지켜야 하면 플래그만 매기는 `CMP`·`TEST`를 쓴다. 크고 작음은 뺄셈(`CMP`), 특정 비트는 AND(`TEST`)로 본다. (c)에 `and eax,1`을 쓰면 EAX가 0이나 1로 바뀐다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `mov al,0F0h` / `cmp al,10h` 뒤의 ZF, CF, SF, OF를 쓰고, 부호 없는 수로 볼 때와 부호 있는 수로 볼 때 AL과 10h의 크고 작음을 각각 읽어라.</summary>

**답:** F0h − 10h = E0h. ZF = 0, CF = 0, SF = 1, OF = 0. 부호 없는 수: ZF = 0이고 CF = 0이라 AL이 크다(240 > 16). 부호 있는 수: SF ≠ OF라 AL이 작다(−16 < 16).<br>
**이유:** 같은 뺄셈 하나에서 두 답이 다 나온다. 어느 플래그를 읽느냐가 수를 어떻게 보느냐를 정한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 부호 있는 수의 "작다"를 SF = 1만으로 판정하면 왜 틀리는가? 틀리는 예를 하나 들라.</summary>

**답:** 뺄셈이 넘치면 결과의 부호가 뒤집혀 나온다. `mov al,-128` / `cmp al,1`은 80h − 01h = 7Fh라 SF = 0이지만 −128은 1보다 작다. 이때 OF = 1이라 SF ≠ OF로 보면 바르게 "작다"가 나온다.

</details>


[^s1]: 플래그 값은 검증 코드의 파이썬 흉내로 구했고, 두 표의 조건은 8비트 두 수의 모든 쌍에서 실제 크고 작음과 맞는지 전수 검사했다.
{% endraw %}
