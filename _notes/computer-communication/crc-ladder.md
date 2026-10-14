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
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
description: "사용 개념: CRC의 XOR 나눗셈."
prev_url: "/studies/computer-communication/line-coding-ladder/"
prev_title: "인코딩 예제 사다리"
math: true
mermaid: false
code_count: 2
permalink: "/studies/computer-communication/crc-ladder/"
---
{% raw %}
사용 개념: [CRC](/Hongs_Blog/studies/computer-communication/crc/)의 XOR 나눗셈.

"CRC 값을 구하라"는 문제는 같은 하위목표의 되풀이다. ① 0 붙이기: 젯수가 $$k + 1$$비트면 메시지 뒤에 0을 $$k$$개 붙인다 ② 맨 앞이 1인 $$k + 1$$비트를 젯수와 XOR한다(맨 앞이 0이면 건너뛴다) ③ 다음 비트를 내려 ②를 되풀이한다 ④ 마지막 $$k$$비트가 나머지 $$F$$다. 메시지 뒤에 붙여 보내고, 받는 쪽은 전체를 나눠 나머지가 0인지 본다[^s1].

하위목표마다 무엇을 보고 판단하는지는 다음과 같다[^s3].

- **① 0을 몇 개 붙이나.** 젯수의 비트 수에서 1을 뺀 $$k$$개다. $$1101$$이면 $$4 - 1 = 3$$개, $$10011$$이면 $$5 - 1 = 4$$개다. 나머지는 언제나 젯수보다 한 비트 짧은 $$k$$비트이고, 붙인 0 $$k$$개는 그 나머지가 들어갈 빈자리다. 0을 하나 더 붙이면 몫과 나머지가 모두 달라져 틀린다.
- **② XOR할지 건너뛸지.** 지금 보는 $$k + 1$$비트 묶음(창)의 맨 앞 비트 하나만 본다. 크기는 비교하지 않는다. 맨 앞이 1이면 젯수를 자리마다 XOR하고(같으면 0, 다르면 1) 몫에 1을 적는다. 맨 앞이 0이면 젯수 대신 0만으로 된 $$k + 1$$비트와 XOR한 셈이라 아무것도 바뀌지 않는다. 몫에 0을 적고 넘어간다. 어느 쪽이든 결과의 맨 앞은 0이 되고, 그 0은 버린다.
- **③ 다음 창 만들기.** 맨 앞 0을 버린 $$k$$비트 옆에, 아직 안 쓴 다음 비트를 하나 내려 새 창을 만든다. 내릴 비트가 떨어질 때까지 되풀이한다. 단계 수는 (0을 붙인 뒤의 전체 비트 수 − $$k$$)이고, 몫의 비트 수와 같다.
- **④ 나머지 읽기.** 마지막 결과에서 맨 앞 0만 버리고 남은 $$k$$비트가 $$F$$다. 자릿수를 꼭 $$k$$로 맞춘다. $$k = 3$$인데 마지막 결과가 $$0011$$이면 $$F$$는 앞의 0을 살린 $$011$$이지 $$11$$이 아니다. 받는 쪽은 0을 붙이지 않고 받은 비트 전체를 같은 젯수로 나눠, 나머지 $$k$$비트가 모두 0인지 본다.

## 문제 1 · 완전한 풀이

$$M = 10011010$$, $$C = 1101$$일 때 보낼 프레임을 구하라(슬라이드 p.54의 예).

1. *0 붙이기:* $$C$$가 4비트라 $$k = 4 - 1 = 3$$. 메시지 뒤에 0을 3개 붙여 11비트 $$10011010\,000$$을 만든다.
2. *XOR:* 앞 4비트 $$1001$$이 첫 창이다. 맨 앞이 1이니 $$1101$$과 자리마다 XOR한다. $$1 \oplus 1 = 0$$, $$0 \oplus 1 = 1$$, $$0 \oplus 0 = 0$$, $$1 \oplus 1 = 0$$이라 $$1001 \oplus 1101 = 0100$$. 몫의 첫 비트는 1이다.
3. *되풀이:* 앞의 0을 버리고 다음 비트를 내리며 계속한다. 첫 결과 $$0100$$에서 0을 버린 $$100$$에 다음 비트 1을 내리면 둘째 창 $$1001$$이 된다. XOR하는 창은 차례로 $$1001, 1001, 1000, 1011, 1100, 1000$$이다. 다섯째 창 $$1100$$을 XOR한 결과 $$0001$$ 뒤로는, 창 $$0010$$과 $$0100$$이 맨 앞 0이라 두 번 건너뛴 다음 마지막 창 $$1000$$을 XOR한다. 여섯 번 XOR하고 두 번 건너뛰어 모두 8단계이고, 몫은 $$11111001$$이다.
4. *나머지:* 마지막 창 $$1000 \oplus 1101 = 0101$$에서 맨 앞 0을 버린 $$F = 101$$. 붙인 0 세 개 자리에 넣어 $$10011010\,101$$을 보낸다. 받는 쪽이 이 11비트를 $$1101$$로 나누면 나머지가 $$000$$이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/50_crc_fig1.svg" alt="그림" width="670" height="461" loading="lazy">

그림은 위 풀이의 여덟 단계를 한 장에 담았다. 맨 윗줄 노란 칸이 하위목표 ①의 붙인 0이다. 주황 줄은 하위목표 ②에서 $$C$$를 XOR한 단계, 점선 줄은 맨 앞이 0이라 건너뛴 6·7단계다. 초록 점선과 초록 칸은 하위목표 ③에서 내린 비트이고, 맨 아래 보라 칸이 하위목표 ④의 나머지 $$101$$이다. 그림을 읽는 법은 [CRC](/Hongs_Blog/studies/computer-communication/crc/) 문서의 '보내는 쪽 절차'에 줄마다 풀어 두었다[^s2].

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

마지막 XOR 결과 $$0111$$의 뒤 3비트, $$F = 111$$. 보내는 프레임은 $$110101\,111$$.<br>
$$C = 1011$$이 4비트라 $$k = 3$$이고, 나머지도 3비트다. 받는 쪽이 $$110101111$$을 $$1011$$로 나누면 나머지가 $$000$$이다.<br>
<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/50_crc-ladder_fig1.svg" alt="그림" width="653" height="394" loading="lazy"><br>
그림에서 1~4단계는 주황 줄(XOR)이고, 5단계 창 $$0110$$은 맨 앞이 0이라 점선 줄(건너뜀)이다. 6단계에서 마지막으로 내린 0이 들어간 창 $$1100$$을 XOR하면 보라 칸 $$111$$이 남는다. 몫은 $$111101$$이다[^s2].

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$M = 101110$$, $$C = 10011$$($$x^4 + x + 1$$)의 CRC를 구하고 받는 쪽 점검을 하라.

1. *0 붙이기:* ______
2. *XOR:* $$10111 \oplus 10011 = 00100$$.
3. *되풀이:* ______
4. *나머지:* $$F = 1011$$. 받는 쪽은 $$1011101011$$을 $$10011$$로 나눠 나머지 $$0000$$을 얻는다.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. $$C$$가 5비트라 $$k = 4$$. $$101110\,0000$$.
3. 1단계 결과 $$00100$$에서 맨 앞 0을 버린 $$0100$$에 다음 비트 0을 내리면 2단계 창 $$01000$$이다. 맨 앞이 0이라 건너뛴다. 다시 맨 앞 0을 버린 $$1000$$에 0을 내린 3단계 창 $$10000$$은 맨 앞이 1이라 $$10000 \oplus 10011 = 00011$$이다.<br>
4단계 창 $$00110$$과 5단계 창 $$01100$$은 맨 앞이 0이라 건너뛴다. 6단계 창 $$11000$$은 마지막으로 내린 0까지 들어간 창이다. $$11000 \oplus 10011 = 01011$$에서 맨 앞 0을 버린 4비트 $$1011$$이 나머지다. 1단계를 빼면 다섯 단계 중 셋을 건너뛰었다. 몫은 $$101001$$이다.<br>
<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/50_crc-ladder_fig2.svg" alt="그림" width="672" height="387" loading="lazy"><br>
그림의 점선 줄 세 개가 건너뛴 2·4·5단계다. 젯수가 5비트라 창과 XOR 줄도 5칸이고, 노란 칸(붙인 0)과 보라 칸(나머지)은 4칸이다[^s2].

</details>


## 문제 4 · 독립 문제

$$C = 1101$$이다. (a) 받은 프레임 $$10011010\,111$$에 오류가 있는가? (b) 보낸 프레임 $$10011010101$$에 오류 패턴 $$00001101000$$이 더해지면 받는 쪽이 알아채는가? 이유는?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(a) 나눠 보면 나머지가 $$010$$으로 0이 아니라 오류다(보낸 것은 $$\cdots101$$, 마지막에서 둘째 비트가 바뀜).<br>
받는 쪽은 0을 붙이지 않고 받은 11비트를 그대로 $$1101$$로 나눈다. 1~6단계의 창은 보낸 프레임을 나눌 때와 같다. 바뀐 비트(왼쪽에서 10번째)가 내려오는 7단계부터 달라진다. 7단계 창은 보낸 프레임이면 $$0110$$이지만 받은 프레임에서는 $$0111$$이고, 둘 다 맨 앞이 0이라 건너뛴다. 8단계 창은 $$1101$$ 대신 $$1111$$이 되어 $$1111 \oplus 1101 = 0010$$, 나머지 $$010$$이 남는다.<br>
<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/50_crc-ladder_fig3.svg" alt="그림" width="670" height="461" loading="lazy"><br>
그림의 보라 테두리 칸이 보낸 프레임과 다른 비트다. 그 비트가 초록 점선을 타고 7단계 창에 들어가고, 마지막 보라 칸에 $$000$$이 아닌 $$010$$이 남는다[^s2].<br>
(b) 알아채지 못한다. 오류 패턴 $$1101000$$은 $$C$$를 세 칸 옮긴 것, 곧 $$C(x)\,x^3$$이다. 프레임과 오류 모두 $$C$$로 나누어떨어지니 합(XOR)도 나누어떨어진다. CRC가 놓치는 오류는 오류 패턴이 $$C(x)$$의 배수일 때뿐이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [50_crc-ladder_p4.py](/Hongs_Blog/studies/computer-communication/code/50_crc-ladder_p4/), 그림과 답의 단계별 창 — [50_crc-ladder_plot.py](/Hongs_Blog/studies/computer-communication/code/50_crc-ladder_plot/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 문제 1은 슬라이드 p.54의 예이고, 문제 2~4와 수치는 원본에 없다. 필기의 "CRC 이해가 필요"에 맞춰 같은 계산을 단계별로 연습하도록 만들었고, 답은 문제 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 문제 1의 그림은 [CRC](/Hongs_Blog/studies/computer-communication/crc/) 문서의 그림 1을 그대로 넣었다. 문제 2, 3, 4 (a)의 그림 3장은 원본에 없다. [50_crc-ladder_plot.py](/Hongs_Blog/studies/computer-communication/code/50_crc-ladder_plot/)로 그렸고, 나머지 111·1011·010, 단계별 창, 건너뛰는 단계(문제 2의 5단계, 문제 3의 2·4·5단계), 몫 111101·101001, 문제 4 (a)의 바뀐 비트 자리를 같은 코드로 확인했다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 하위목표마다 판단 기준(0을 $$k$$개 붙이는 까닭, 건너뛸 때를 아는 법, 나머지 자릿수 맞추기)과 문제 1~4 답의 단계별 풀이는 원본에 없다. [CRC](/Hongs_Blog/studies/computer-communication/crc/) 문서의 설명을 따랐고, 값은 문제 코드와 그림 코드로 확인했다.
{% endraw %}
