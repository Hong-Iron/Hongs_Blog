---
layout: "note"
title: "인코딩 방식 비교"
display_title: "인코딩 방식 비교"
kind: "concept"
kind_label: "비교"
num: "43"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["NRZ vs NRZI vs Manchester vs 4B/5B", "선 부호화 비교", "Line Coding Comparison"]
description: "네 방식은 모두 0과 1을 높고 낮은 신호로 바꾼다. 서로 다른 것은 \"어떤 비트열에서 신호가 평평해지는가\"와 \"그 대가로 효율을 얼마나 내주는가\"다. 고르는 질문은 둘이다. 보낼 데이터에 같은 값이 길게 이어지는가? 선이 신호를 얼마나 빨리 바꿀 수 있는가?"
prev_url: "/studies/computer-communication/4b5b/"
prev_title: "4B/5B"
next_url: "/studies/computer-communication/byte-framing/"
next_title: "바이트 중심 프레이밍"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/contrast--line-coding/"
---
{% raw %}
네 방식은 모두 0과 1을 높고 낮은 신호로 바꾼다. 서로 다른 것은 "어떤 비트열에서 신호가 평평해지는가"와 "그 대가로 효율을 얼마나 내주는가"다. 고르는 질문은 둘이다. 보낼 데이터에 같은 값이 길게 이어지는가? 선이 신호를 얼마나 빨리 바꿀 수 있는가?

## 어느 쪽일까

상황마다 [NRZ](/Hongs_Blog/studies/computer-communication/nrz-clock-recovery/), [NRZI, 맨체스터](/Hongs_Blog/studies/computer-communication/nrzi-manchester/), [4B/5B + NRZI](/Hongs_Blog/studies/computer-communication/4b5b/) 중 무엇이 맞는지 고르고, 다른 것이 왜 아닌지 쓴다.

<details markdown="1"><summary markdown="span"><b>C1</b> (a) 보낼 데이터가 거의 1로만 이루어져 있다(빈 칸을 1로 채운 메모리 덤프). NRZ와 NRZI 중 무엇이 낫나? (b) 데이터가 거의 0으로만 이루어져 있다면?</summary>


**답:** (a) NRZI. 1마다 신호가 뒤집혀 박자 단서가 계속 생긴다. NRZ는 1이 이어지면 높은 채로 평평하다. (b) 둘 다 실패한다. 0이 이어지면 NRZ도 NRZI도 평평하다. 맨체스터나 4B/5B + NRZI를 써야 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> (c) 어떤 비트열이든 박자를 놓치면 안 되고, 회로는 단순해야 하며, 선은 데이터 속도의 두 배로 신호를 바꿀 여유가 있다. (d) 선이 신호를 바꾸는 속도가 비싸서 낭비를 줄이고 싶다. 맨체스터와 4B/5B + NRZI 중 각각 무엇을 고르나?</summary>


**답:** (c) 맨체스터. 비트마다 한가운데서 반드시 바뀌어 어떤 비트열에서도 박자를 잃지 않고, 표를 찾을 필요도 없다. 효율 50%는 선의 여유로 감당한다. (d) 4B/5B + NRZI. 효율이 80%라 같은 신호 속도로 맨체스터의 1.6배를 싣는다. 0이 3개까지 이어질 수는 있지만, 신호가 바뀌지 않는 구간은 4비트 폭을 넘지 않아 받는 쪽이 버틴다.<br>
**흔한 오답:** (c)에서 4B/5B를 고르는 것. 효율은 높지만 박자 단서가 최대 4비트 폭 동안 없고, 표가 필요해 회로가 더 복잡하다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 다음 신호(반 칸 단위, 처음 낮음)는 NRZ, NRZI, 맨체스터 중 무엇으로 그린 것인가? 비트열도 쓰라(칸 하나에 반 칸 두 개). `‾_ _‾ _‾ ‾_`</summary>


**답:** 맨체스터. 네 칸 모두 한가운데서 바뀐다. NRZ라면 칸 안에서 바뀌지 않는다. NRZI라면 한가운데서 바뀌는 칸은 모두 1이어야 하는데, 그러면 신호가 칸 경계에서는 바뀌지 않아야 한다. 그런데 2·3번째 칸 사이(`_‾ _‾`)에서 높음 → 낮음으로 경계에서 바뀌므로 NRZI가 아니다. 맨체스터로 읽으면 내려감, 올라감, 올라감, 내려감이니 `1001`이다.

</details>

## 결정적 차이

| 기준 | NRZ | NRZI | 맨체스터 | 4B/5B + NRZI |
|---|---|---|---|---|
| 1을 나타내는 법 | 높음 | 한가운데서 뒤집기 | 내려감 | 표로 5비트를 고른 뒤 NRZI |
| 신호가 평평해지는 비트열 | 1이 이어질 때, 0이 이어질 때 | 0이 이어질 때 | 없음 | 0은 3개까지만 이어짐 |
| 신호가 바뀌지 않는 최대 길이 | 끝없음 | 끝없음 | 1비트 폭 | 4비트 폭 (0 세 개와 양옆 반 칸씩) |
| 효율 | 100% | 100% | 50% | 80% |
| 받는 쪽이 보는 것 | 높이 | 칸 안의 변화 여부 | 변화의 방향 | 변화 여부 → 표로 4비트 |
| 출처 | 슬라이드 35[^1] | 슬라이드 38[^2] | 슬라이드 38·39[^2] | 슬라이드 40[^3] |

표의 줄을 하나씩 아래 그림에 맞춰 읽을 수 있다. 그림은 데이터 열두 비트 `1000 0011 1110`을 네 방식으로 같은 시간축에 그린 것이다. 이 데이터에는 0이 다섯 개 이어진 곳(2~6번째 비트)과 1이 다섯 개 이어진 곳(7~11번째 비트)이 둘 다 있다[^s2].

<img class="note-fig" src="/Hongs_Blog/assets/notes/computer-communication/43_contrast--line-coding_fig1.svg" alt="그림" width="644" height="389" loading="lazy">

맨 위 줄이 데이터 비트이고, 그 아래로 NRZ, NRZI(처음 낮음), 맨체스터 순서다. 맨 아래 줄은 데이터를 4비트씩 부호로 바꾼 `10010 10101 11100` 15비트를 NRZI로 보낸 것이다. 부호 비트 5개가 데이터 비트 4개와 같은 시간 안에 들어가야 하므로, 부호 칸 하나는 데이터 칸의 0.8배 폭이다. 노란 세로선 두 개가 부호 경계다. 줄마다 칠한 곳이 신호가 바뀌지 않는 가장 긴 구간이고, 오른쪽에 그 길이를 적었다.

**1을 나타내는 법.** NRZ 줄은 1인 칸(1번째, 7~11번째)에서 높다. NRZI 줄은 1인 칸의 한가운데에서 뒤집힌다. 1번째 칸에서 올라가고, 7~11번째 칸에서는 칸마다 내려가고 올라가기를 되풀이한다. 맨체스터 줄은 1인 칸의 한가운데에서 내려간다. 4B/5B 줄은 데이터의 1이 아니라 부호 비트의 1에서 뒤집힌다. 데이터 1000이 부호 10010이 되었으니, 데이터만 보고는 어디서 뒤집힐지 알 수 없고 표를 거쳐야 한다.

**신호가 평평해지는 비트열.** NRZ 줄은 0 다섯 개 동안 낮고 1 다섯 개 동안 높아서, 칠한 곳이 두 군데다. NRZI 줄은 1 다섯 개 동안에는 칸마다 바뀌지만 0 다섯 개 동안에는 평평해서, 칠한 곳이 0 쪽 하나다. 맨체스터 줄은 어디서도 길게 평평하지 않다. 4B/5B 줄은 데이터에 0이 다섯 개 있었는데도, 부호에서는 0이 많아야 두 개(10010의 가운데)만 이어진다.

**신호가 바뀌지 않는 최대 길이.** 이 데이터에서 NRZ는 5비트 폭이다. NRZI는 6비트 폭으로 더 길다. 1번째 칸(1)이 한가운데에서 올라간 뒤의 반 칸과, 7번째 칸(1)이 뒤집히기 전의 반 칸이 0 다섯 칸 양옆에 붙기 때문이다($$\tfrac12 + 5 + \tfrac12 = 6$$). 데이터의 0이나 1이 더 길게 이어지면 이 길이도 한없이 늘어난다. 그래서 표에 "끝없음"이라 적었다.

맨체스터는 1비트 폭이 세 곳이다. 모두 서로 다른 비트가 이어지는 자리(1→0, 0→1, 1→0)다. 예를 들어 1번째 칸(1)은 뒤 절반이 낮고 2번째 칸(0)은 앞 절반이 낮아서, 반 칸 두 개가 붙어 1비트 폭이 된다. 어떤 비트열에서도 이보다 길어지지 않는다. 맨체스터는 칸 한가운데에서 반드시 바뀌니, 평평한 조각은 한가운데에서 다음 칸 한가운데까지를 넘을 수 없다.

4B/5B 줄의 가장 긴 평평은 부호 비트 3개 폭이다. 데이터 시간으로는 $$3 \times 0.8 = 2.4$$비트다. 표의 "4비트 폭"은 부호 비트로 잰 최악의 경우(0 세 개가 부호 경계에 걸칠 때)이고, 이 데이터에서는 그보다 짧다.

**효율.** 네 줄의 가로 길이는 모두 데이터 12비트의 시간으로 같다. NRZ와 NRZI는 비트 하나에 신호 칸 하나라 100%다. 맨체스터는 칸 12개를 모두 반으로 쪼개 반 칸 24개를 쓴다. 가장 짧은 조각이 반 비트 폭이라 선이 두 배 빠르게 바뀔 수 있어야 하므로 50%다. 4B/5B는 데이터 12비트를 부호 15비트로 보내므로 $$12/15 = 80\%$$다.

**받는 쪽이 보는 것.** NRZ를 받는 쪽은 칸 한가운데의 높이만 본다. NRZI는 칸 안에서 바뀌었는지를 본다. 맨체스터는 한가운데에서 바뀌는 방향(올라가면 0, 내려가면 1)을 본다. 4B/5B는 NRZI처럼 바뀌었는지를 읽어 부호 비트를 얻고, 5개씩 모아 표를 거꾸로 찾아 4비트로 되돌린다[^s3].

선택을 바꾸는 것은 "평평해지는 비트열"과 "효율" 두 줄이다. 데이터에 무엇이 이어질지 모르면 NRZ와 NRZI는 빠진다. 남은 둘 중에서는 선의 여유가 고른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 방식의 평평한 구간과 효율 — [41_nrzi-manchester_impl.py](/Hongs_Blog/studies/computer-communication/code/41_nrzi-manchester_impl/), [42_4b5b_verify.py](/Hongs_Blog/studies/computer-communication/code/42_4b5b_verify/), 그림의 값 — [43_contrast--line-coding_plot.py](/Hongs_Blog/studies/computer-communication/code/43_contrast--line-coding_plot/)</div>

</div>


## 둘 다 아닐 때

<details markdown="1"><summary markdown="span"><b>C4</b> 네 방식 모두 맞지 않는 상황 두 가지와 그때의 선택지를 쓰라.</summary>


**답:** ① 공기 중으로 보내는 무선 링크. 높고 낮은 두 값의 신호는 멀리 퍼지지 않으므로, 반송파의 진폭·주파수·위상을 바꾸는 [진폭·주파수·위상 변조](/Hongs_Blog/studies/computer-communication/digital-modulation/)를 쓴다. ② 칩 사이처럼 짧은 연결에서 선을 하나 더 쓸 수 있을 때. 클럭을 별도의 선으로 함께 보내면 데이터는 NRZ 그대로 보내도 된다[^s1].

</details>

[^1]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 35 "Non-Return to Zero(NRZ)"
[^2]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 38 "NRZI and Manchester", 슬라이드 39 "Mid-transition의 의미"
[^3]: 컴퓨터 통신 4회 강의 자료 「2장-1」, 슬라이드 40 "4B/5B"
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 상황 문제(C1~C4), "신호가 바뀌지 않는 최대 길이"와 "받는 쪽이 보는 것" 줄, 무선과 별도 클럭 선의 경우는 원본에 없다. 각 방식의 규칙에서 나오며 구현·검증 코드로 확인했다. 슬라이드 33은 무선에서 쓰는 변조(Data ⇒ A-Signal)와 주로 유선에서 쓰는 인코딩(Data ⇒ D-Signal)을 나눈다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 한 장은 원본에 없다. [43_contrast--line-coding_plot.py](/Hongs_Blog/studies/computer-communication/code/43_contrast--line-coding_plot/)로 그렸고, 부호 `100101010111100`, 줄마다 가장 긴 평평한 구간(NRZ 5비트 폭 두 곳, NRZI 6비트 폭, 맨체스터 1비트 폭 세 곳, 4B/5B + NRZI 부호 비트 3개 폭 = 데이터 2.4비트 시간), 맨체스터의 최대 평평이 어떤 8비트 열에서도 1비트 폭이라는 것, 4B/5B 두 부호를 이은 NRZI의 최대 평평이 4비트 폭이라는 것을 같은 코드로 확인했다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 표의 각 줄을 그림 1에 맞춰 풀어 쓴 설명은 원본에 없다. 슬라이드 35·38·40의 규칙에서 나온다.
{% endraw %}
