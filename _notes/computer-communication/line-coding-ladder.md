---
layout: "note"
title: "인코딩 예제 사다리"
display_title: "인코딩 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "43"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
description: "사용 개념: NRZ의 높이 규칙, NRZI와 맨체스터의 한가운데 전이 규칙, 4B/5B의 표."
prev_url: "/studies/computer-communication/timing-analysis-ladder/"
prev_title: "소요시간 분석 예제 사다리"
next_url: "/studies/computer-communication/crc-ladder/"
next_title: "CRC 예제 사다리"
math: true
mermaid: false
code_count: 2
permalink: "/studies/computer-communication/line-coding-ladder/"
---
{% raw %}
사용 개념: [NRZ](/Hongs_Blog/studies/computer-communication/nrz-clock-recovery/)의 높이 규칙, [NRZI와 맨체스터](/Hongs_Blog/studies/computer-communication/nrzi-manchester/)의 한가운데 전이 규칙, [4B/5B](/Hongs_Blog/studies/computer-communication/4b5b/)의 표.

"비트열을 신호로 그려라", "신호를 비트로 읽어라"라는 문제는 늘 같은 네 하위목표로 나뉜다. 칸을 반으로 나누고, 칸마다 규칙을 적용하고, 이어서 그리고, 거꾸로 읽어 확인한다[^s1].

1. *칸 나누기:* 비트 하나에 칸 하나를 잡고, 칸 하나를 다시 반 칸 두 개로 나눈다. NRZI와 맨체스터는 칸의 한가운데에서 바뀌므로, 반 칸 단위로 적어야 그 변화가 보인다. 비트가 $$n$$개면 반 칸은 $$2n$$개다. 예: 비트 4개면 반 칸 8개다.
2. *칸마다 규칙 적용:* 비트를 하나씩 규칙에 넣어 그 칸의 반 칸 두 개를 정한다. NRZ는 비트가 곧 높이다. 맨체스터는 비트마다 모양이 정해져 있다. NRZI는 앞 칸이 끝난 높이를 들고 와서, 1이면 한가운데서 뒤집고 0이면 그대로 둔다. NRZI만 앞 칸에 기대므로, NRZI는 반드시 왼쪽 칸부터 차례로 한다.
3. *이어서 그리기:* 칸들을 붙여 한 줄로 그린다. 붙인 곳(칸 경계)에서 앞 칸의 끝 높이와 뒤 칸의 시작 높이가 다르면 경계에서도 선이 바뀐다. NRZI는 경계에서 절대 바뀌지 않는다. 뒤 칸이 앞 칸의 끝 높이를 그대로 들고 오기 때문이다. 맨체스터는 같은 비트가 이어질 때 경계에서도 바뀐다. 이 두 사실로 그림을 한 번 점검할 수 있다.
4. *거꾸로 읽어 확인:* 받는 쪽이 되어 그린 신호를 다시 비트로 읽는다. NRZI는 칸 안에서 바뀌었으면 1, 아니면 0이다. 맨체스터는 앞 절반의 높이가 곧 비트다. 읽은 비트가 처음 비트열과 같으면 그림이 맞다.

적는 법은 다음과 같다. 칸 하나를 반 칸 두 글자로 적는다. 낮음은 `_`, 높음은 `‾`이다. 예를 들어 `_‾`는 앞 절반이 낮고 뒤 절반이 높은 칸, 즉 한가운데에서 올라가는 칸이다. 칸 사이에는 빈칸을 둔다. NRZI는 따로 말이 없으면 처음 높이가 낮음이다[^s1].

규칙은 이렇게 떠올린다. 맨체스터는 "클럭을 뒤집느냐"로 기억한다. 클럭은 칸마다 `_‾`(올라감)이다. 비트 0은 클럭을 그대로 두어 `_‾`, 비트 1은 클럭을 뒤집어 `‾_`(내려감)이다. NRZI는 이름 끝의 I(Inverted, 뒤집힌)를 떠올린다. 1이 오면 뒤집는다[^s3].

그림은 각 답 안에 있다. 그림에서 점선은 칸 경계, 옅은 실선은 칸 한가운데다. 주황 점은 칸 한가운데에서 신호가 바뀐 곳이고, 빈 점은 칸 경계에서 바뀐 곳이다. 주황 숫자는 받는 쪽이 거꾸로 읽은 비트다[^s2].

## 문제 1 · 완전한 풀이

비트열 `1100`을 NRZ, NRZI, 맨체스터로 그리라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

1. *칸 나누기:* 비트 4개 → 칸 4개, 반 칸 8개.
2. *칸마다 규칙 적용:*
    - NRZ: 1은 `‾‾`, 0은 `__`. 비트가 곧 높이라 칸 안에서 바뀌지 않는다.
    - NRZI: 처음 높이는 낮음이다. 1번째 비트 1은 낮음을 들고 와서 한가운데서 뒤집으니 `_‾`이고, 칸이 높게 끝난다. 2번째 비트 1은 높음을 들고 와서 뒤집으니 `‾_`이고, 칸이 낮게 끝난다. 3번째 비트 0은 낮음을 그대로 두니 `__`, 4번째 비트 0도 `__`다.
    - 맨체스터: 1은 클럭 `_‾`를 뒤집은 `‾_`, 0은 클럭 그대로 `_‾`다. 앞 칸과 상관없이 비트마다 정해진다.
3. *이어서 그리기:* NRZ `‾‾ ‾‾ __ __`, NRZI `_‾ ‾_ __ __`, 맨체스터 `‾_ ‾_ _‾ _‾`.<br>
    <img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/43_line-coding-ladder_fig1.svg" alt="그림" width="391" height="330" loading="lazy"><br>
    그림을 위에서부터 본다. NRZ는 두 칸 동안 높다가 2·3번째 칸 경계에서 한 번 내려가고, 그 뒤로 평평하다. NRZI는 1·2번째 칸의 한가운데(주황 점)에서 올라갔다가 내려가고, 0인 3·4번째 칸에서는 평평하다. 칸 경계에서는 한 번도 바뀌지 않는다. 맨체스터는 네 칸 모두 한가운데에서 바뀐다(주황 점). 같은 비트가 이어지는 1·2번째 칸 사이와 3·4번째 칸 사이에서는 경계에서도 바뀐다(빈 점). 1번째 칸이 낮게 끝났는데 2번째 칸(1)은 높게 시작해야 하기 때문이다.
4. *거꾸로 읽어 확인:* NRZI는 칸 안에서 바뀐 칸이 1이다. 1·2번째 칸이 바뀌었으니 `1100`. 맨체스터는 앞 절반이 데이터다. ‾, ‾, _, _ 이니 `1100`.

</details>


## 문제 2 · 마지막 하위목표만 빈칸

비트열 `0110`을 NRZI와 맨체스터로 그리라.

1. *칸 나누기:* 칸 4개, 반 칸 8개.
2. *칸마다 규칙 적용:* NRZI는 낮음에서 출발한다. 0 → 낮음 그대로 `__`, 1 → 낮음을 뒤집어 `_‾`, 1 → 높음을 뒤집어 `‾_`, 0 → 낮음 그대로 `__`. 맨체스터는 비트마다 `_‾`, `‾_`, `‾_`, `_‾`.
3. *이어서 그리기:* NRZI `__ _‾ ‾_ __`, 맨체스터 `_‾ ‾_ ‾_ _‾`. NRZI는 칸 경계에서 높이가 이어지는지, 맨체스터는 같은 비트(2·3번째의 1, 1) 사이 경계에서 바뀌는지 점검한다.
4. *거꾸로 읽어 확인:* ______

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

NRZI에서 칸 안에서 바뀐 칸은 2·3번째 → `0110`. 맨체스터 앞 절반은 _, ‾, ‾, _ → `0110`. 둘 다 원래 비트열과 같다.<br>
<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/43_line-coding-ladder_fig2.svg" alt="그림" width="391" height="274" loading="lazy"><br>
그림의 주황 숫자가 거꾸로 읽은 비트다. NRZI 줄은 주황 점(한가운데 전이)이 있는 2·3번째 칸만 1로 읽고, 평평한 1·4번째 칸은 0으로 읽는다. 맨체스터 줄은 칠한 앞 절반의 높이만 읽는다. 2·3번째 칸 경계의 빈 점은 칸 경계에서 바뀐 것이라 데이터와 상관없고, 읽지 않는다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

비트열 `101100`을 NRZI(처음 높이가 **높음**)와 맨체스터로 그리라.

1. *칸 나누기:* 칸 6개, 반 칸 12개.
2. *칸마다 규칙 적용:* ______
3. *이어서 그리기:* ______
4. *거꾸로 읽어 확인:* NRZI는 칸 안에서 바뀐 칸(1·3·4번째)이 1이므로 `101100`. 맨체스터 앞 절반 ‾, _, ‾, ‾, _, _ → `101100`.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

{: start="2"}
2. NRZI는 높음에서 출발한다. 1 → `‾_`(낮음이 됨), 0 → `__`, 1 → `_‾`(높음), 1 → `‾_`(낮음), 0 → `__`, 0 → `__`. 맨체스터는 1 `‾_`, 0 `_‾`, 1 `‾_`, 1 `‾_`, 0 `_‾`, 0 `_‾`.
3. NRZI `‾_ __ _‾ ‾_ __ __`, 맨체스터 `‾_ _‾ ‾_ ‾_ _‾ _‾`.<br>
처음 높이를 높음으로 바꿔도 NRZI를 읽는 법(칸 안에서 바뀌었는가)은 같다.<br>
<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/43_line-coding-ladder_fig3.svg" alt="그림" width="518" height="245" loading="lazy"><br>
그림의 NRZI 줄은 높게 시작한다. 1번째 칸(1)의 한가운데에서 내려가고, 2번째 칸(0)은 낮은 채로 있다. 3번째 칸(1)에서 올라가고 4번째 칸(1)에서 내려간 뒤, 5·6번째 칸(0, 0)은 평평하다. 주황 점이 1·3·4번째 칸에 있으니 거꾸로 읽으면 `101100`이다. 맨체스터는 처음 높이를 쓰지 않으므로 다른 문제와 같은 규칙으로 그린다. 빈 점 두 개는 같은 비트가 이어지는 3·4번째, 5·6번째 칸 경계다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1~3의 그림과 되읽기 — [41_nrzi-manchester_impl.py](/Hongs_Blog/studies/computer-communication/code/41_nrzi-manchester_impl/)</div>

</div>


## 문제 4 · 독립 문제

데이터 `0100 1101`을 4B/5B로 바꾼 뒤 NRZI(처음 낮음)로 보낸다. (a) 보내는 5비트 열, (b) NRZI 신호, (c) 신호가 바뀌지 않고 가장 오래 이어지는 길이(비트 폭 단위)를 구하라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(a) 0100 → 01010, 1101 → 11011. 이어서 `0101011011`.<br>
(b) `__ _‾ ‾‾ ‾_ __ _‾ ‾_ __ _‾ ‾_`. 붙여 쓰면 `___‾‾‾‾____‾‾____‾‾_`.<br>
(c) 반 칸 4개, 즉 2비트 폭. 예: 2번째 칸의 뒤 절반부터 4번째 칸의 앞 절반까지 높음.<br>
<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/43_line-coding-ladder_fig4.svg" alt="그림" width="514" height="219" loading="lazy"><br>
그림 위쪽 괄호가 데이터 4비트와 그 부호이고, 굵은 세로선이 부호 경계다. 주황 점은 부호 비트 1의 한가운데에서 신호가 뒤집힌 곳이다. 칠한 세 곳이 모두 반 칸 4개(2비트 폭)로 가장 길다. 이 부호열에서는 1과 1 사이에 0이 많아야 하나씩만 끼어 있다. 0이 $$z$$개 끼면 평평한 길이가 $$z + 1$$비트 폭이니, $$z = 1$$일 때 2비트 폭이 최대다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 4와 변형 문제 — [43_line-coding-ladder_p4.py](/Hongs_Blog/studies/computer-communication/code/43_line-coding-ladder_p4/)</div>

</div>


## 변형 문제

- 데이터 `0000 0000`을 (a) NRZ로 그냥 보낼 때와 (b) 4B/5B + NRZI로 보낼 때, 신호가 바뀌지 않는 가장 긴 구간을 각각 구하라.

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

(a) 8비트 폭 내내 낮음. (b) 4B/5B 부호는 `11110 11110`이고, NRZI 신호에서 가장 긴 평평한 구간은 가운데 0 근처의 2비트 폭(부호 비트 2개 폭)이다. 0 연속을 4B/5B가 끊어 준 효과다.<br>
<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/43_line-coding-ladder_fig5.svg" alt="그림" width="525" height="263" loading="lazy"><br>
두 줄을 같은 시간축에 그렸다. 아래 줄은 부호 비트 10개를 데이터 8비트와 같은 시간에 보내므로, 칸 하나가 데이터 칸의 0.8배 폭이다. 위 줄(NRZ)은 8비트 내내 한 번도 바뀌지 않는다. 아래 줄은 부호의 1마다 뒤집혀 주황 점이 여덟 개다. 칠한 곳은 첫 부호의 끝 0이 뒤집힘 없이 지나가는 구간으로, 4번째 부호 비트의 한가운데부터 6번째 부호 비트의 한가운데까지다. 부호 비트 2개 폭이고, 같은 시간축에서 재면 데이터 1.6비트 시간이다.

</details>


- 받은 맨체스터 신호가 `_‾ ‾_ ‾_ _‾ _‾`이다. 데이터는? 또 다른 반 칸 열 `__ _‾ ‾_ __ _‾`을 NRZI로 받았다면 데이터는?

<details class="answer-fold" markdown="1"><summary markdown="span">답</summary>

맨체스터: 앞 절반 _, ‾, ‾, _, _ → `01100`. NRZI: 칸 안에서 바뀐 칸은 2·3·5번째 → `01101`.<br>
<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/43_line-coding-ladder_fig6.svg" alt="그림" width="466" height="274" loading="lazy"><br>
위 줄은 맨체스터로 받은 신호다. 칠한 앞 절반의 높이를 그대로 읽어 0, 1, 1, 0, 0이다. 빈 점 두 개(2·3번째, 4·5번째 칸 경계)는 같은 비트가 이어져 경계에서 바뀐 것이라 읽지 않는다. 아래 줄은 NRZI로 받은 신호다. 주황 점이 있는 2·3·5번째 칸이 1이고, 평평한 1·4번째 칸이 0이다. 맨체스터 신호라면 모든 칸에 주황 점이 있어야 한다. 아래 줄처럼 한가운데에서 바뀌지 않는 칸이 하나라도 있으면 맨체스터일 수 없다.

</details>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 비트열은 원본에 없다. 슬라이드 38(NRZI와 맨체스터 규칙)과 40(4B/5B 표)을 연습하도록 만들었고, 답은 구현·검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 여섯 장은 원본에 없다. [43_line-coding-ladder_plot.py](/Hongs_Blog/studies/computer-communication/code/43_line-coding-ladder_plot/)로 그렸고, 문제 1~4와 변형 문제의 답 글자(반 칸 열), 거꾸로 읽은 비트, 문제 4의 가장 긴 평평 세 곳(반 칸 4개), 변형 문제 1의 NRZ 8비트 폭과 4B/5B + NRZI 부호 비트 2개 폭(데이터 1.6비트 시간)을 같은 코드로 확인했다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 네 하위목표 각각의 이유, 그림 점검 요령(NRZI는 경계에서 안 바뀜, 맨체스터는 같은 비트 사이 경계에서 바뀜), 규칙을 떠올리는 방법, 답 안의 그림 설명은 원본에 없다. 슬라이드 38·39의 규칙에서 나온다.
{% endraw %}
