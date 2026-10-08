---
layout: "note"
title: "CRC 예제 사다리"
display_title: "CRC 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "50"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
description: "사용 개념: CRC의 XOR 나눗셈."
prev_url: "/studies/computer-communication/line-coding-ladder/"
prev_title: "인코딩 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/crc-ladder/"
---
{% raw %}
사용 개념: [CRC](/Hongs_Blog/studies/computer-communication/crc/)의 XOR 나눗셈.

"CRC 값을 구하라"는 문제는 같은 하위목표의 되풀이다. ① 0 붙이기: 젯수가 $$k + 1$$비트면 메시지 뒤에 0을 $$k$$개 붙인다 ② 맨 앞이 1인 $$k + 1$$비트를 젯수와 XOR한다(맨 앞이 0이면 건너뛴다) ③ 다음 비트를 내려 ②를 되풀이한다 ④ 마지막 $$k$$비트가 나머지 $$F$$다. 메시지 뒤에 붙여 보내고, 받는 쪽은 전체를 나눠 나머지가 0인지 본다[^s1].

## 문제 1 · 완전한 풀이

$$M = 10011010$$, $$C = 1101$$일 때 보낼 프레임을 구하라(슬라이드 p.54의 예).

1. *0 붙이기:* $$C$$가 4비트라 $$k = 3$$. $$10011010\,000$$.
2. *XOR:* 앞 4비트 $$1001 \oplus 1101 = 0100$$.
3. *되풀이:* 앞의 0을 버리고 다음 비트를 내리며 계속한다. XOR하는 창은 차례로 $$1001, 1001, 1000, 1011, 1100, 1000$$이다. 몫은 $$11111001$$이다.
4. *나머지:* $$F = 101$$. 보내는 프레임은 $$10011010\,101$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [50_crc-ladder_p4.py](/Hongs_Blog/studies/computer-communication/code/50_crc-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

$$M = 110101$$, $$C = 1011$$의 CRC를 구하라.

1. *0 붙이기:* $$110101\,000$$.
2. *XOR:* $$1101 \oplus 1011 = 0110$$.
3. *되풀이:* 창 $$1100 \to 0111$$, $$1111 \to 0100$$, $$1000 \to 0011$$. 다음 창은 $$0110$$이라 맨 앞이 0이라 건너뛰고, 한 비트 더 내린 $$1100 \oplus 1011 = 0111$$.
4. *나머지:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

마지막 XOR 결과 $$0111$$의 뒤 3비트, $$F = 111$$. 보내는 프레임은 $$110101\,111$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$M = 101110$$, $$C = 10011$$($$x^4 + x + 1$$)의 CRC를 구하고 받는 쪽 점검을 하라.

1. *0 붙이기:* ______
2. *XOR:* $$10111 \oplus 10011 = 00100$$.
3. *되풀이:* ______
4. *나머지:* $$F = 1011$$. 받는 쪽은 $$1011101011$$을 $$10011$$로 나눠 나머지 $$0000$$을 얻는다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. $$C$$가 5비트라 $$k = 4$$. $$101110\,0000$$.
3. 앞의 0 둘을 버리고 내리면 창 $$10000 \oplus 10011 = 00011$$. 맨 앞이 0인 창 두 개를 건너뛰고 $$11000 \oplus 10011 = 01011$$. 마지막 4비트 $$1011$$이 나머지다.

</details>


## 문제 4 · 독립 문제

$$C = 1101$$이다. (a) 받은 프레임 $$10011010\,111$$에 오류가 있는가? (b) 보낸 프레임 $$10011010101$$에 오류 패턴 $$00001101000$$이 더해지면 받는 쪽이 알아채는가? 이유는?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(a) 나눠 보면 나머지가 $$010$$으로 0이 아니라 오류다(보낸 것은 $$\cdots101$$, 마지막에서 둘째 비트가 바뀜).<br>
(b) 알아채지 못한다. 오류 패턴 $$1101000$$은 $$C$$를 세 칸 옮긴 것, 곧 $$C(x)\,x^3$$이다. 프레임과 오류 모두 $$C$$로 나누어떨어지니 합(XOR)도 나누어떨어진다. CRC가 놓치는 오류는 오류 패턴이 $$C(x)$$의 배수일 때뿐이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [50_crc-ladder_p4.py](/Hongs_Blog/studies/computer-communication/code/50_crc-ladder_p4/)</div>

</div>


[^s1]: 에이전트 보충. 문제 1은 슬라이드 p.54의 예이고, 문제 2~4와 수치는 원본에 없다. 필기의 "CRC 이해가 필요"에 맞춰 같은 계산을 단계별로 연습하도록 만들었고, 답은 문제 코드로 확인했다.
{% endraw %}
