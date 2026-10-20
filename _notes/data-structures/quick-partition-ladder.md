---
layout: "note"
title: "퀵 정렬 분할 예제 사다리"
display_title: "퀵 정렬 분할 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "42"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 퀵 정렬의 제자리 분할과 덤 배열 분할, 가운데 값 규칙."
prev_url: "/studies/data-structures/shortest-path-ladder/"
prev_title: "최단 경로 표 채우기 예제 사다리"
next_url: "/studies/data-structures/sort-tracing-practice/"
next_title: "정렬 추적 연습"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "42_quick-partition-ladder_p4.c", "u": "/studies/data-structures/code/42_quick-partition-ladder_p4/", "r": "문제 4 풀이"}]
permalink: "/studies/data-structures/quick-partition-ladder/"
---
{% raw %}
사용 개념: [퀵 정렬](/Hongs_Blog/studies/data-structures/quick-sort/)의 제자리 분할과 덤 배열 분할, 가운데 값 규칙.

"이 배열을 한 번 분할하라"는 문제는 같은 하위목표의 되풀이다. ① 피벗 정하기: 맨 왼쪽 값 ② big 찾기: 왼쪽에서 오른쪽으로 가며 피벗 이상인 첫 값 ③ small 찾기: 오른쪽에서 왼쪽으로 가며 피벗 이하인 첫 값 ④ 맞바꾸기: big이 small보다 왼쪽이면 둘을 맞바꾸고 ②로 돌아간다 ⑤ 피벗 놓기: big이 small의 왼쪽이 아니면 피벗과 small을 맞바꾸고 끝낸다. 둘째 바퀴부터 ②와 ③은 직전에 멈춘 자리의 다음 칸에서 이어 간다.

## 문제 1 · 완전한 풀이

`[6, 2, 8, 5, 11, 10, 4, 1, 9, 7, 3]`을 제자리에서 분할하라.

1. *피벗 정하기:* 맨 왼쪽의 6.
2. *big 찾기:* 2는 6보다 작아 지나치고 8(2번 칸)에서 멈춘다. *small 찾기:* 맨 오른쪽 3(10번 칸)이 바로 6 이하다. *맞바꾸기:* 2번 칸이 10번 칸보다 왼쪽이므로 맞바꾼다. → `[6, 2, 3, 5, 11, 10, 4, 1, 9, 7, 8]`
3. *big 찾기:* 5를 지나쳐 11(4번 칸). *small 찾기:* 7, 9를 지나쳐 1(7번 칸). *맞바꾸기.* → `[6, 2, 3, 5, 1, 10, 4, 11, 9, 7, 8]`
4. *big 찾기:* 10(5번 칸). *small 찾기:* 4(6번 칸). *맞바꾸기.* → `[6, 2, 3, 5, 1, 4, 10, 11, 9, 7, 8]`
5. *big 찾기:* 10(6번 칸). *small 찾기:* 4(5번 칸). big이 small의 왼쪽이 아니다.
6. *피벗 놓기:* 피벗 6과 small 4를 맞바꾼다. → `[4, 2, 3, 5, 1, 6, 10, 11, 9, 7, 8]`. 피벗은 5번 칸이다.

같은 배열을 덤 배열로 분할하면 6 이하인 2, 5, 4, 1, 3을 왼쪽 끝부터, 6보다 큰 8, 11, 10, 9, 7을 오른쪽 끝부터 채워 `[2, 5, 4, 1, 3, 6, 7, 9, 10, 11, 8]`이 된다. 두 방법 모두 피벗은 5번 칸에 오고, 조각 안의 순서만 다르다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1~4의 맞바꾼 쌍, 끝 상태, 피벗 자리를 컴파일해 실행(ASan·UBSan) — [42_quick-partition-ladder_p4.c](/Hongs_Blog/studies/data-structures/code/42_quick-partition-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

`[7, 3, 9, 1, 12, 5, 8]`을 제자리에서 분할하라.

1. *피벗 정하기:* 7.
2. *big 찾기:* 3을 지나쳐 9(2번 칸). *small 찾기:* 8을 지나쳐 5(5번 칸). *맞바꾸기.* → `[7, 3, 5, 1, 12, 9, 8]`
3. *big 찾기:* 1을 지나쳐 12(4번 칸). *small 찾기:* 12를 지나쳐 1(3번 칸). big이 small의 왼쪽이 아니다.
4. *피벗 놓기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

피벗 7과 small 1을 맞바꾼다. → `[1, 3, 5, 7, 12, 9, 8]`. 피벗은 3번 칸이다. 왼쪽 조각 1, 3, 5는 모두 7 이하이고 오른쪽 조각 12, 9, 8은 모두 7 이상이다.<br>
흔한 오답은 피벗을 big(12)과 맞바꾸는 것이다. 그러면 12가 맨 왼쪽으로 가서 왼쪽 조각에 피벗보다 큰 값이 생긴다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

같은 값이 섞인 `[5, 8, 5, 2, 9, 5, 1, 7]`을 제자리에서 분할하라. big은 피벗 **이상**, small은 피벗 **이하**인 값에서 멈춘다는 점에 주의한다.

1. *피벗 정하기:* 5.
2. *big 찾기와 small 찾기:* ______ *맞바꾸기.* → `[5, 1, 5, 2, 9, 5, 8, 7]`
3. *big 찾기:* 5(2번 칸). 피벗과 같아도 멈춘다. *small 찾기:* ______ *맞바꾸기.* → 배열은 그대로다.
4. *big 찾기:* 2를 지나쳐 9(4번 칸). *small 찾기:* ______
5. *피벗 놓기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. big은 8(1번 칸), small은 7을 지나쳐 1(6번 칸).
3. small은 5(5번 칸). 피벗과 같아서 멈춘다. 5와 5를 맞바꾸니 배열은 그대로다.
4. small은 9를 지나쳐 2(3번 칸). big(4번 칸)이 small(3번 칸)의 왼쪽이 아니다.
5. 피벗 5와 small 2를 맞바꾼다. → `[2, 1, 5, 5, 9, 5, 8, 7]`. 피벗은 3번 칸이다.

왼쪽 조각 2, 1, 5에도 오른쪽 조각 9, 5, 8, 7에도 5가 있다. 왼쪽은 "피벗 이하", 오른쪽은 "피벗 이상"이면 되므로 틀린 것이 아니다.

</details>


## 문제 4 · 독립 문제

`[9, 4, 7, 2, 6, 1, 8, 3, 5]`를 가운데 값 규칙으로 피벗을 골라 분할하라. (a) 피벗은 무엇이고 분할 전에 무엇을 하는가? (b) 제자리 분할의 결과와 피벗의 자리는? (c) 같은 준비를 한 뒤 덤 배열로 분할한 결과는? (d) 맨 왼쪽 값 9를 그대로 피벗으로 썼다면 조각의 크기는 어떻게 되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) 맨 왼쪽 9, 가운데(4번 칸) 6, 맨 오른쪽 5 가운데 크기가 중간인 값은 6이다. 6을 맨 왼쪽 값과 맞바꾼다. → `[6, 4, 7, 2, 9, 1, 8, 3, 5]`<br>
(b) big 7(2번 칸)과 small 5(8번 칸)를 맞바꾸고, big 9(4번 칸)와 small 3(7번 칸)을 맞바꾼다. 다음에 big은 8(6번 칸), small은 1(5번 칸)이라 멈추고, 피벗 6과 1을 맞바꾼다. → `[1, 4, 5, 2, 3, 6, 8, 9, 7]`. 피벗은 5번 칸이다.<br>
(c) 6 이하인 4, 2, 1, 3, 5를 왼쪽 끝부터, 큰 7, 9, 8을 오른쪽 끝부터 채운다. → `[4, 2, 1, 3, 5, 6, 8, 9, 7]`<br>
(d) 9는 가장 큰 값이라 나머지 여덟 개가 모두 왼쪽 조각으로 간다. 조각은 8개와 0개다. 가운데 값 규칙을 쓰면 5개와 3개로 갈린다.

</details>
{% endraw %}
