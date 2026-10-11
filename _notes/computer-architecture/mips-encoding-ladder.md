---
layout: "note"
title: "명령어 인코딩 예제 사다리"
display_title: "명령어 인코딩 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "16"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: MIPS 명령어 형식의 세 형식과 opcode·funct 표, MIPS 레지스터와 메모리 피연산자의 레지스터 번호 표."
prev_url: "/studies/computer-architecture/cpu-time-ladder/"
prev_title: "CPU 시간 계산 예제 사다리"
next_url: "/studies/computer-architecture/datapath-tracing-ladder/"
next_title: "데이터패스 추적 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/mips-encoding-ladder/"
---
{% raw %}
사용 개념: [MIPS 명령어 형식](/Hongs_Blog/studies/computer-architecture/mips-instruction-formats/)의 세 형식과 opcode·funct 표, [MIPS 레지스터와 메모리 피연산자](/Hongs_Blog/studies/computer-architecture/mips-operands/)의 레지스터 번호 표.

"어셈블리어 한 줄을 16진수 기계어로 옮겨라"는 문제는 늘 같은 하위목표 넷을 밟는다. ① 형식과 op(R형식이면 funct까지)를 찾는다. ② 레지스터 이름을 번호로 바꿔 알맞은 칸(rs, rt, rd)에 놓는다. ③ 남은 칸(shamt 또는 immediate)을 채운다. ④ 칸들을 2진수로 이어 붙이고 4비트씩 끊어 16진수로 읽는다. 거꾸로 푸는 문제는 ④ → ① → ② → ③ 순서다.

이 방법을 떠올리는 실마리는 명령의 모양이다. 재료가 모두 레지스터면 R형식, 상수나 `숫자(레지스터)` 꼴이 보이면 I형식이다. 틀리기 쉬운 곳은 ②다. 어셈블리어에 적는 순서와 칸의 순서가 다르다[^1].

필요한 값은 아래와 같다[^2].

| 명령 | op / funct (16진수) | 레지스터 | 번호 |
|---|---|---|---|
| `sub` | 0 / 22 | `$a0` | 4 |
| `srl` | 0 / 02 | `$t0`~`$t3` | 8~11 |
| `addi` | 08 | `$s1`~`$s5` | 17~21 |
| `slti` | 0A | | |
| `sw` | 2B | | |

## 문제 1 · 완전한 풀이

`sub $t2, $s3, $s4`를 기계어로 옮겨라[^s1].

1. *형식과 op 찾기:* 재료가 모두 레지스터라 R형식이다. op = 0 = `000000`, funct = `0x22` = `100010`.
2. *레지스터를 칸에 놓기:* `sub rd, rs, rt` 순서로 적는다. 첫째로 적은 `$t2` = 10이 rd, 둘째 `$s3` = 19가 rs, 셋째 `$s4` = 20이 rt다. rs = `10011`, rt = `10100`, rd = `01010`.
3. *남은 칸 채우기:* 밀기 명령이 아니므로 shamt = `00000`.
4. *이어 붙여 16진수로:* `000000 10011 10100 01010 00000 100010` → `0000 0010 0111 0100 0101 0000 0010 0010` → `0x02745022`.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [16_mips-encoding-ladder_p4.py](/Hongs_Blog/studies/computer-architecture/code/16_mips-encoding-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

`addi $t0, $s5, -12`를 기계어로 옮겨라[^s1].

1. *형식과 op 찾기:* 상수가 있어 I형식이다. op = `0x08` = `001000`.
2. *레지스터를 칸에 놓기:* `addi rt, rs, imm` 순서로 적는다. 첫째로 적은 `$t0` = 8이 rt, 둘째 `$s5` = 21이 rs다. rs = `10101`, rt = `01000`.
3. *남은 칸 채우기:* −12를 16비트 2의 보수로 적는다. 12 = `0x000C`, 뒤집으면 `0xFFF3`, 1을 더하면 `0xFFF4` = `1111 1111 1111 0100`.
4. *이어 붙여 16진수로:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`001000 10101 01000 1111111111110100` → `0010 0010 1010 1000 1111 1111 1111 0100` → `0x22A8FFF4`.<br>
4비트씩 끊을 때 칸의 경계(6, 5, 5, 16)와 4비트의 경계가 어긋난다. 32비트를 먼저 한 줄로 이어 쓴 뒤 왼쪽부터 네 개씩 끊는다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

`sw $t3, 48($s2)`를 기계어로 옮겨라[^s1].

1. *형식과 op 찾기:* `숫자(레지스터)` 꼴이라 I형식이다. op = `0x2B` = `101011`.
2. *레지스터를 칸에 놓기:* ______
3. *남은 칸 채우기:* 오프셋 48 = `0x0030` = `0000 0000 0011 0000`.
4. *이어 붙여 16진수로:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. `sw rt, imm(rs)` 순서로 적는다. 괄호 안의 `$s2` = 18이 rs, 앞에 적은 `$t3` = 11이 rt다. rs = `10010`, rt = `01011`. 흔한 오답은 앞에 적은 `$t3`을 rs에 넣는 것이다.
4. `101011 10010 01011 0000000000110000` → `1010 1110 0100 1011 0000 0000 0011 0000` → `0xAE4B0030`.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [16_mips-encoding-ladder_p4.py](/Hongs_Blog/studies/computer-architecture/code/16_mips-encoding-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

(a) `slti $t0, $a0, 1`을 16진수 기계어로 옮겨라. (b) 기계어 `0x001140C2`를 어셈블리어로 되돌려라[^s1].

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) I형식, op = `0x0A` = `001010`. rs = `$a0` = 4 = `00100`, rt = `$t0` = 8 = `01000`. immediate = 1. `001010 00100 01000 0000000000000001` → `0010 1000 1000 1000 0000 0000 0000 0001` → `0x28880001`.<br>
(b) 2진수 `0000 0000 0001 0001 0100 0000 1100 0010`. 앞 6비트가 0이라 R형식이다. `000000 00000 10001 01000 00011 000010`으로 자르면 rs = 0, rt = 17(`$s1`), rd = 8(`$t0`), shamt = 3, funct = `0x02`(`srl`). 밀기 명령은 `srl rd, rt, shamt` 순서로 적으므로 `srl $t0, $s1, 3`이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 답을 인코더로 만들고 디코더로 되돌려 확인 — [16_mips-encoding-ladder_p4.py](/Hongs_Blog/studies/computer-architecture/code/16_mips-encoding-ladder_p4/). 실제 어셈블러가 아니라 파이썬으로 짠 인코더·디코더다.</div>

</div>


[^1]: Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 2장 "Instructions: Language of the Computer"
[^2]: MIPS Reference Data(Green Sheet), NUS CS2100 공개본 https://www.comp.nus.edu.sg/~cs2100/lect/MIPS_Reference_Data_page1.pdf (OPCODE / FUNCT 열과 레지스터 번호 표)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 네 문제와 풀이는 새로 만든 것이다. 답은 문제 코드로 확인했다.
{% endraw %}
