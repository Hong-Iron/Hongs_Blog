---
layout: "note"
title: "가산기"
display_title: "가산기 (Adder)"
kind: "concept"
kind_label: "기법"
num: "07"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Adder", "덧셈기", "반가산기", "Half Adder", "전가산기", "Full Adder", "리플 캐리 가산기", "Ripple-Carry Adder", "올림", "Carry", "올림 예측 가산기", "캐리 예측 가산기", "Carry-Lookahead Adder", "생성과 전파", "Generate and Propagate", "넘침", "오버플로", "Overflow", "가감산기", "Adder/Subtractor"]
description: "2진수 두 개를 더하는 회로다. 손으로 세로셈을 하듯 한 자리를 더하는 작은 회로를 만들고, 자리 수만큼 줄지어 세워 아랫자리에서 생긴 올림을 윗자리로 넘긴다. 같은 회로에 선 몇 가닥만 보태면 뺄셈도 한다. 만들기는 쉽지만 맨 윗자리는 아래 모든 자리의 올림이 다 넘어올 때까지 …"
prev_url: "/studies/computer-architecture/mux-decoder/"
prev_title: "멀티플렉서와 디코더"
next_url: "/studies/computer-architecture/alu/"
next_title: "ALU"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/adder-circuit/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

2진수 두 개를 더하는 회로다. 손으로 세로셈을 하듯 한 자리를 더하는 작은 회로를 만들고, 자리 수만큼 줄지어 세워 아랫자리에서 생긴 올림을 윗자리로 넘긴다. 같은 회로에 선 몇 가닥만 보태면 뺄셈도 한다. 만들기는 쉽지만 맨 윗자리는 아래 모든 자리의 올림이 다 넘어올 때까지 기다려야 해서 자리가 많을수록 느려진다. 그리고 자리 수가 정해져 있어서 결과가 그 안에 안 들어가면 틀린 값이 나온다.

</div>


## 예시로 보기

프로세서는 덧셈 명령만이 아니라 메모리 주소를 구할 때도, 다음 명령의 위치를 구할 때도 덧셈을 한다. 32자리 덧셈을 표 하나로 적으면 줄이 $$2^{64}$$개라 표에서 회로를 만드는 방법은 쓸 수 없다. 그래서 한 자리짜리 회로를 만들어 줄지어 세운다.

8비트로 $$0110\,1101$$(109)과 $$0101\,0110$$(86)을 더한다. 맨 아랫자리부터 한 자리씩, 그 자리의 두 비트와 아래에서 올라온 올림을 더한다.

| 자리 | $$a_i$$ | $$b_i$$ | 받은 올림 | 합 $$s_i$$ | 넘기는 올림 |
|---|---|---|---|---|---|
| 0 | 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 1 | 0 |
| 2 | 1 | 1 | 0 | 0 | 1 |
| 3 | 1 | 0 | 1 | 0 | 1 |
| 4 | 0 | 1 | 1 | 0 | 1 |
| 5 | 1 | 0 | 1 | 0 | 1 |
| 6 | 1 | 1 | 1 | 1 | 1 |
| 7 | 0 | 0 | 1 | 1 | 0 |

합은 위에서부터 읽어 $$1100\,0011$$이다. 부호 없는 수로 읽으면 195로 맞다. 그런데 부호 있는 수(2의 보수)로 읽으면 맨 윗자리가 1이라 −61이다. 양수 둘을 더했는데 음수가 나왔다. 8비트 부호 있는 수는 127까지만 담을 수 있어서 195가 넘친 것이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 전가산기 8줄, 8비트 덧셈 전수 131,072가지(올림 입력 0과 1), 뺄셈 전수 65,536가지, 두 가지 넘침 판정, 올림 예측으로 구한 올림이 줄줄이 넘긴 올림과 늘 같음, 위 표, 예제, 카드 C2·C3 — [07_adder-circuit_verify.py](/Hongs_Blog/studies/computer-architecture/code/07_adder-circuit_verify/) (실제 하드웨어가 아니라 파이썬으로 게이트를 흉내 낸 것)</div>

</div>


## 정의

**한 자리 덧셈.** 그 자리의 두 비트 $$a_i$$, $$b_i$$와 아래에서 받은 올림 $$c_i$$를 더해 합 $$s_i$$와 위로 넘길 올림 $$c_{i+1}$$을 내는 회로를 전가산기라 부른다. 받는 올림이 없는 것은 반가산기다. 둘의 진리표와 게이트는 [불 대수와 논리 회로](/Hongs_Blog/studies/discrete-math/boolean-algebra/)에 있다.

합은 세 입력 가운데 1이 홀수 개일 때 1이고, 올림은 셋 가운데 둘 이상이 1일 때 1이다[^1].

$$s_i = a_i \oplus b_i \oplus c_i, \qquad c_{i+1} = a_i b_i + a_i c_i + b_i c_i$$


$$i$$는 자리 번호(맨 아래가 0), $$\oplus$$는 XOR다. 올림의 식은 [논리 게이트와 조합 회로](/Hongs_Blog/studies/computer-architecture/combinational-logic/)의 다수결 회로 그대로다.

**줄지어 세우기.** 전가산기 $$n$$개를 놓고 자리 $$i$$의 넘기는 올림을 자리 $$i + 1$$의 받는 올림에 잇는다. 맨 아래의 받는 올림 $$c_0$$에는 0을 넣는다. 올림이 물결처럼 한 칸씩 번져서 리플 캐리 가산기라 부른다[^1].

**뺄셈.** 2의 보수에서 $$-b$$는 $$b$$의 모든 비트를 뒤집고 1을 더한 값이다. 그래서 $$a - b = a + \bar b + 1$$이고, 가산기에 두 가지만 보태면 뺄셈이 된다[^1].

- $$b$$의 각 비트를 신호 SUB와 XOR해서 넣는다. SUB가 0이면 그대로, 1이면 뒤집힌다.
- 맨 아래의 받는 올림 $$c_0$$에 SUB를 잇는다. SUB가 1이면 더해야 할 1이 여기로 들어간다.

**넘침.** 결과가 $$n$$비트에 안 들어가는 일이다. 수를 어떻게 읽느냐에 따라 판정이 다르다.

| 수를 읽는 법 | 덧셈에서 넘쳤다는 신호 |
|---|---|
| 부호 없는 수 | 맨 윗자리에서 나온 올림 $$c_n$$이 1 |
| 부호 있는 수 (2의 보수) | 맨 윗자리로 들어간 올림 $$c_{n-1}$$과 나온 올림 $$c_n$$이 다르다. $$c_n \oplus c_{n-1} = 1$$[^1] |

위 예에서 $$c_7 = 1$$, $$c_8 = 0$$이다. 부호 없는 수로는 넘치지 않았고 부호 있는 수로는 넘쳤다.

## 예제

**뺄셈 추적.** 같은 두 수로 $$109 - 86$$을 한다.

1. *뒤집기:* SUB = 1이므로 $$b = 0101\,0110$$이 $$1010\,1001$$로 바뀐다.
2. *더하기:* $$0110\,1101 + 1010\,1001 + 1$$(받는 올림) $$= 1\,0001\,0111$$.
3. *읽기:* 아래 8비트 $$0001\,0111 = 23$$. 맞다.
4. *넘침 확인:* $$c_7 = 1$$, $$c_8 = 1$$로 같으므로 부호 있는 수로 넘치지 않았다. 맨 위에서 나온 올림 1은 버린다.

부호 없는 수의 뺄셈에서는 $$c_8 = 1$$이 "빌려 오지 않았다", 곧 $$a \ge b$$라는 뜻이다.

**가장 느린 경우.** $$1111\,1111 + 0000\,0001$$에서는 맨 아랫자리의 올림이 여덟 자리를 모두 지나가야 답 $$0000\,0000$$이 나온다. 올림이 1, 1, 1, 1, 1, 1, 1, 1로 끝까지 번진다.

## 올림을 기다리지 않기

자리 하나의 올림은 AND 한 겹과 OR 한 겹, 게이트 두 겹을 지난다. 줄지어 세운 가산기에서 맨 위 올림은 아래 올림을 차례로 기다리므로 $$n$$비트면 $$2n$$겹이다. 8비트에 16겹, 32비트에 64겹이다. 게이트 한 겹의 지연을 같게 치고 센 것이다[^s1].

기다리지 않으려면 올림을 $$a$$, $$b$$, $$c_0$$만으로 바로 구해야 한다. 자리마다 두 가지를 본다[^2].

- 그 자리가 혼자서 올림을 만드는가(생성): $$g_i = a_i b_i$$. 둘 다 1이면 아래에서 뭐가 오든 올림이 생긴다.
- 아래에서 온 올림을 위로 넘겨 주는가(전파): $$p_i = a_i + b_i$$. 하나라도 1이면 받은 올림이 그대로 위로 간다.

올림은 "이 자리가 만들었거나, 받은 것을 넘겼거나"다[^2].

$$c_{i+1} = g_i + p_i c_i$$


이 식에 $$c_i$$를 다시 넣어 풀면 아래 올림이 식에서 사라진다.

$$c_2 = g_1 + p_1 g_0 + p_1 p_0 c_0, \qquad c_3 = g_2 + p_2 g_1 + p_2 p_1 g_0 + p_2 p_1 p_0 c_0$$


"어느 아랫자리가 올림을 만들었고, 그 위의 자리들이 모두 넘겨 줬다"를 자리마다 적은 것이다. 책은 도미노에 빗댄다. 멀리 있는 도미노 하나를 밀어도 사이에 빈 곳이 없으면 끝 도미노가 넘어진다[^2].

4비트 $$0110 + 0111$$로 넣어 본다. 아랫자리부터 $$g = 0, 1, 1, 0$$이고 $$p = 1, 1, 1, 0$$이다. $$c_1 = g_0 + p_0 c_0 = 0$$, $$c_2 = g_1 + \cdots = 1$$, $$c_3 = g_2 + \cdots = 1$$, $$c_4 = g_3 + p_3 g_2 = 0$$이다. 줄지어 넘긴 올림과 같고 합은 $$1101$$(13)이다.

이렇게 하면 모든 올림이 $$g$$와 $$p$$를 만드는 한 겹, AND 한 겹, OR 한 겹이면 나온다. 대신 윗자리로 갈수록 식이 길어져 입력이 많은 게이트가 필요하다. 그래서 실제로는 4비트씩 묶어 묶음 안에서 올림을 미리 구하고, 묶음끼리 다시 같은 방법을 쓴다[^2].

## 활용

- [ALU](/Hongs_Blog/studies/computer-architecture/alu/)의 덧셈·뺄셈·비교가 모두 이 회로 하나를 쓴다. 같은지 비교할 때는 빼서 0인지 본다.
- x86은 덧셈 뒤에 두 가지 넘침을 따로 적어 둔다. 부호 없는 수의 넘침이 올림 플래그, 부호 있는 수의 넘침이 오버플로 플래그다: [산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/).
- 곱셈은 이 가산기로 여러 번 더해서 한다: [곱셈 회로](/Hongs_Blog/studies/computer-architecture/multiplier-circuit/).
- **흔한 실수.** 맨 위에서 올림이 나왔다고 부호 있는 덧셈이 넘쳤다고 하는 것. $$-1 + (-1)$$은 올림이 나오지만 답 $$-2$$는 맞다. 부호 있는 수는 맨 위로 들어간 올림과 나온 올림을 견줘야 한다.

## 연결

- 선수: [논리 게이트와 조합 회로](/Hongs_Blog/studies/computer-architecture/combinational-logic/), [정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/)(뒤집고 1 더하기)
- 반가산기와 전가산기의 진리표, 4비트 덧셈 추적: [불 대수와 논리 회로](/Hongs_Blog/studies/discrete-math/boolean-algebra/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 전가산기의 합과 올림을 식으로 쓰고, 가산기로 뺄셈을 하려면 무엇을 보태는지 말하라.</summary>

**답:** $$s_i = a_i \oplus b_i \oplus c_i$$, $$c_{i+1} = a_i b_i + a_i c_i + b_i c_i$$. 뺄셈은 $$b$$의 비트마다 SUB와 XOR해 뒤집고, 맨 아래 받는 올림에 SUB(1)를 넣는다.<br>
**이유:** $$a - b = a + \bar b + 1$$이기 때문이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 8비트 가산기로 $$1001\,0110 + 0111\,0101$$을 한다. 합, 맨 위에서 나온 올림 $$c_8$$, 맨 위로 들어간 올림 $$c_7$$을 구하고, 부호 없는 수와 부호 있는 수로 각각 넘쳤는지 말하라.</summary>

**답:** 합 $$0000\,1011$$, $$c_8 = 1$$, $$c_7 = 1$$. 부호 없는 수로는 넘쳤다($$150 + 117 = 267 > 255$$). 부호 있는 수로는 넘치지 않았다($$-106 + 117 = 11$$, $$c_8 \oplus c_7 = 0$$).<br>
**흔한 오답:** 올림이 나왔으니 둘 다 넘쳤다고 하는 것.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 8비트 가산기로 $$80 - 120$$을 한다. 가산기에 실제로 들어가는 세 값을 쓰고 결과를 부호 있는 수로 읽어라.</summary>

**답:** $$0101\,0000 + 1000\,0111 + 1$$. 결과 $$1101\,1000$$, 부호 있는 수로 −40. 맨 위 올림은 0이다.<br>
**이유:** 120은 $$0111\,1000$$이고 뒤집으면 $$1000\,0111$$이다. 맨 위 올림이 0인 것은 부호 없는 수로 볼 때 $$80 < 120$$이라 빌려 왔다는 뜻이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 줄지어 세운 가산기는 왜 자리 수에 비례해 느려지고, 생성 $$g_i$$와 전파 $$p_i$$를 쓰면 왜 기다리지 않아도 되는가?</summary>

**답:** 자리 $$i$$의 올림이 자리 $$i - 1$$의 올림을 입력으로 받기 때문에 맨 위 올림은 아래 올림이 차례로 정해질 때까지 기다린다. $$g_i$$와 $$p_i$$는 그 자리의 $$a_i$$, $$b_i$$만으로 정해지므로 모든 자리에서 동시에 나온다. $$c_{i+1} = g_i + p_i c_i$$를 풀어 쓰면 모든 올림이 $$g$$, $$p$$, $$c_0$$만의 식이 되어 아래 올림을 기다릴 필요가 없다.<br>
**이유:** 대가는 윗자리로 갈수록 길어지는 식, 곧 더 많은 게이트다.

</details>


[^1]: UC Berkeley CS61C 강의 노트 "Adder/Subtractor" (한 자리의 합은 세 입력의 XOR이고 올림은 다수결 $$a_i b_i + a_i c_i + b_i c_i$$라는 것, 전가산기를 이어 붙이고 $$c_0$$을 0으로 두는 것, 부호 있는 수의 넘침 $$c_n \oplus c_{n-1}$$, SUB를 $$c_0$$에 잇고 $$b$$의 비트마다 XOR하는 가감산기), https://notes.cs61c.org/content/sds-blocks/adder-subtractor. 부호 없는 수의 넘침이 맨 위 올림이라는 줄과 표의 수치는 검증 코드로 확인했다.
[^2]: Patterson & Hennessy, *Computer Organization and Design*, 부록 "The Basics of Logic Design"의 B.6절 "Faster Addition: Carry Lookahead" ($$g_i = a_i b_i$$, $$p_i = a_i + b_i$$, $$c_{i+1} = g_i + p_i c_i$$, 도미노 비유, 4비트 묶음과 그 위의 둘째 단계). 절 번호는 공개된 PDF 기준이고 판에 따라 부록 문자가 다를 수 있다. https://www.doc.ic.ac.uk/~wl/teachlocal/arch/HP05/HP_AppB.pdf
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 게이트 겹 수(자리마다 두 겹, 올림 예측은 세 겹)는 올림 식을 AND-OR 두 겹으로 만든다고 치고 직접 센 것이다. 실제 지연은 게이트 종류와 입력 수에 따라 다르다.
{% endraw %}
