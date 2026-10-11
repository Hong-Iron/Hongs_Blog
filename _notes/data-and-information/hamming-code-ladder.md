---
layout: "note"
title: "해밍 부호 예제 사다리"
display_title: "해밍 부호 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "07"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
updated: "2026-10-11"
status: "verified"
description: "사용 개념: 해밍 부호의 검사 칸 자리, 부호 생성, 오류 검사와 정정."
next_url: "/studies/data-and-information/edit-distance-ladder/"
next_title: "편집 거리 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/data-and-information/hamming-code-ladder/"
---
{% raw %}
사용 개념: [해밍 부호](/Hongs_Blog/studies/data-and-information/hamming-code/)의 검사 칸 자리, 부호 생성, 오류 검사와 정정.

해밍 부호 문제는 같은 하위목표의 되풀이다. ① 칸 배치: 1, 2, 4, 8번에 검사 칸을 두고 나머지에 내용을 차례로 넣는다 ② 검사 칸 계산: $$P_1, P_2, P_4, P_8$$이 맡은 칸을 XOR한다 ③ 검사: 받은 열에서 검사 칸까지 넣어 다시 XOR한다 ④ 신드롬 읽기: 결과를 $$P_8 P_4 P_2 P_1$$ 순서의 2진수로 읽는다 ⑤ 정정과 꺼내기: 그 번호의 칸을 뒤집고 내용 칸만 읽는다[^s1].

맡은 칸은 번호의 2진 자리로 정해진다. 7칸이면 $$P_1$$은 1, 3, 5, 7번, $$P_2$$는 2, 3, 6, 7번, $$P_4$$는 4, 5, 6, 7번이다. 12칸이면 $$P_1$$은 1, 3, 5, 7, 9, 11번, $$P_2$$는 2, 3, 6, 7, 10, 11번, $$P_4$$는 4, 5, 6, 7, 12번, $$P_8$$은 8, 9, 10, 11, 12번이다.

## 문제 1 · 완전한 풀이

내용 4비트 `1101`을 해밍 부호로 만들어 보낸다. 받은 쪽에 `1010111`이 왔다. 보낸 부호어, 오류의 자리, 내용을 구하라.

1. *칸 배치:* 내용을 3, 5, 6, 7번에 넣는다. `_ _ 1 _ 1 0 1`.
2. *검사 칸 계산:* $$P_1 = D_3 \oplus D_5 \oplus D_7 = 1 \oplus 1 \oplus 1 = 1$$. $$P_2 = D_3 \oplus D_6 \oplus D_7 = 1 \oplus 0 \oplus 1 = 0$$. $$P_4 = D_5 \oplus D_6 \oplus D_7 = 1 \oplus 0 \oplus 1 = 0$$. 보낸 부호어는 `1010101`.
3. *검사:* 받은 `1010111`에서 $$P_1$$(1, 3, 5, 7번) $$= 1 \oplus 1 \oplus 1 \oplus 1 = 0$$. $$P_2$$(2, 3, 6, 7번) $$= 0 \oplus 1 \oplus 1 \oplus 1 = 1$$. $$P_4$$(4, 5, 6, 7번) $$= 0 \oplus 1 \oplus 1 \oplus 1 = 1$$.
4. *신드롬 읽기:* $$P_4 P_2 P_1 = 110_2 = 6$$.
5. *정정과 꺼내기:* 6번 칸을 뒤집어 `1010101`. 3, 5, 6, 7번을 읽어 `1101`.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [07_hamming-code_impl.py](/Hongs_Blog/studies/data-and-information/code/07_hamming-code_impl/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

7칸 해밍 부호로 `1100010`을 받았다.

1. *검사:* $$P_1$$(1, 3, 5, 7번) $$= 1 \oplus 0 \oplus 0 \oplus 0 = 1$$. $$P_2$$(2, 3, 6, 7번) $$= 1 \oplus 0 \oplus 1 \oplus 0 = 0$$. $$P_4$$(4, 5, 6, 7번) $$= 0 \oplus 0 \oplus 1 \oplus 0 = 1$$.
2. *신드롬 읽기:* $$P_4 P_2 P_1 = 101_2 = 5$$.
3. *정정과 꺼내기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

5번 칸을 0에서 1로 뒤집어 `1100110`. 내용은 3, 5, 6, 7번 칸의 `0110`.<br>
확인: `0110`을 부호화하면 $$P_1 = 0 \oplus 1 \oplus 0 = 1$$, $$P_2 = 0 \oplus 1 \oplus 0 = 1$$, $$P_4 = 1 \oplus 1 \oplus 0 = 0$$이라 `1100110`이 맞다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

내용 8비트 `10011010`을 12칸 해밍 부호로 만든다. 전송 중 한 칸이 바뀌어 `011100101110`이 왔다.

1. *칸 배치:* 내용을 3, 5, 6, 7, 9, 10, 11, 12번에 넣는다. `_ _ 1 _ 0 0 1 _ 1 0 1 0`.
2. *검사 칸 계산:* ______
3. *보낸 부호어:* `011100101010`.
4. *검사:* ______
5. *신드롬 읽기:* $$P_8 P_4 P_2 P_1 = 1010_2 = 10$$.
6. *정정과 꺼내기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. $$P_1 = D_3 \oplus D_5 \oplus D_7 \oplus D_9 \oplus D_{11} = 1 \oplus 0 \oplus 1 \oplus 1 \oplus 1 = 0$$. $$P_2 = D_3 \oplus D_6 \oplus D_7 \oplus D_{10} \oplus D_{11} = 1 \oplus 0 \oplus 1 \oplus 0 \oplus 1 = 1$$. $$P_4 = D_5 \oplus D_6 \oplus D_7 \oplus D_{12} = 0 \oplus 0 \oplus 1 \oplus 0 = 1$$. $$P_8 = D_9 \oplus D_{10} \oplus D_{11} \oplus D_{12} = 1 \oplus 0 \oplus 1 \oplus 0 = 0$$.
4. 받은 `011100101110`에서 $$P_1$$(1, 3, 5, 7, 9, 11번) $$= 0 \oplus 1 \oplus 0 \oplus 1 \oplus 1 \oplus 1 = 0$$. $$P_2$$(2, 3, 6, 7, 10, 11번) $$= 1 \oplus 1 \oplus 0 \oplus 1 \oplus 1 \oplus 1 = 1$$. $$P_4$$(4, 5, 6, 7, 12번) $$= 1 \oplus 0 \oplus 0 \oplus 1 \oplus 0 = 0$$. $$P_8$$(8, 9, 10, 11, 12번) $$= 0 \oplus 1 \oplus 1 \oplus 1 \oplus 0 = 1$$.
6. 10번 칸을 1에서 0으로 뒤집어 `011100101010`. 내용은 `10011010`.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [07_hamming-code_impl.py](/Hongs_Blog/studies/data-and-information/code/07_hamming-code_impl/)</div>

</div>


## 문제 4 · 독립 문제

(a) 12칸 해밍 부호로 `001111001010`을 받았다. 한 칸만 바뀌었다고 보고 보낸 부호어와 내용 8비트를 구하라.
(b) 내용이 20비트라면 검사 칸이 몇 개 필요하고, 전체는 몇 칸인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) $$P_1$$(1, 3, 5, 7, 9, 11번) $$= 0 \oplus 1 \oplus 1 \oplus 0 \oplus 1 \oplus 1 = 0$$. $$P_2$$(2, 3, 6, 7, 10, 11번) $$= 0 \oplus 1 \oplus 1 \oplus 0 \oplus 0 \oplus 1 = 1$$. $$P_4$$(4, 5, 6, 7, 12번) $$= 1 \oplus 1 \oplus 1 \oplus 0 \oplus 0 = 1$$. $$P_8$$(8, 9, 10, 11, 12번) $$= 0 \oplus 1 \oplus 0 \oplus 1 \oplus 0 = 0$$. 신드롬 $$0110_2 = 6$$. 6번 칸을 뒤집어 `001110001010`. 내용은 3, 5, 6, 7, 9, 10, 11, 12번의 `11001010`.<br>
(b) $$2^p \ge 20 + p + 1$$. $$p = 4$$면 $$16 < 25$$, $$p = 5$$면 $$32 \ge 26$$. 검사 칸 5개, 전체 25칸. 범위식으로도 $$12 \le 20 \le 26$$이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [07_hamming-code_impl.py](/Hongs_Blog/studies/data-and-information/code/07_hamming-code_impl/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 수치는 원본에 없다. 슬라이드(강의03-2-부호2) p.11~15의 코드 생성·오류 검사·오류 정정 과정을 연습하도록 만들었고, 답은 구현 코드로 확인했다.
{% endraw %}
