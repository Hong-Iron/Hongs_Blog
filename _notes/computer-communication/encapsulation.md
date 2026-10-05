---
layout: "note"
title: "캡슐화"
display_title: "캡슐화 (Encapsulation)"
kind: "concept"
kind_label: "모델"
num: "22"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-09-29"
status: "verified"
aliases: ["Encapsulation", "포장", "헤더", "header", "머리말", "바디", "body", "페이로드", "payload", "역캡슐화", "decapsulation"]
description: "편지를 봉투에 넣고, 그 봉투를 다시 택배 상자에 넣는 것처럼, 층마다 위에서 받은 데이터를 통째로 내용물로 삼고 앞에 자기 머리말(헤더)을 붙여 아래층에 넘긴다. 받는 쪽은 거꾸로 한 겹씩 벗긴다. 각 층은 내용물의 속을 들여다보지 않아도 되어서 층끼리 독립적이다. 대신 층마다 …"
prev_url: "/studies/computer-communication/protocol-graph/"
prev_title: "프로토콜 그래프"
next_url: "/studies/computer-communication/osi-reference-model/"
next_title: "OSI 참조 모델"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-communication/encapsulation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

편지를 봉투에 넣고, 그 봉투를 다시 택배 상자에 넣는 것처럼, 층마다 위에서 받은 데이터를 통째로 내용물로 삼고 앞에 자기 머리말(헤더)을 붙여 아래층에 넘긴다. 받는 쪽은 거꾸로 한 겹씩 벗긴다. 각 층은 내용물의 속을 들여다보지 않아도 되어서 층끼리 독립적이다. 대신 층마다 헤더만큼 보낼 비트가 늘어난다.

</div>


## 예시로 보기

슬라이드 그림에서 Host 1의 응용이 Data를 보낸다[^1].

```
Host 1                                   Host 2
응용   [Data]                            [Data]          ↑ 응용
RRP    [RRP|Data]          ─ ─ ─ ─ →      [RRP|Data]      ↑ RRP가 RRP 헤더를 뗌
HHP    [HHP|RRP|Data]      ─ ─ ─ ─ →      [HHP|RRP|Data]  ↑ HHP가 HHP 헤더를 뗌
            └────── 망에는 [HHP|RRP|Data]가 흐른다 ──────┘
```

RRP는 응용의 Data를 바디(body)로 삼아 앞에 RRP 헤더를 붙인다. HHP는 <code>[RRP&#124;Data]</code> 전체를 다시 바디로 삼는다. HHP에게는 RRP 헤더도 그냥 내용물이다. 봉투를 층으로, 봉투 겉면의 주소를 헤더로, 편지를 바디로 옮긴다. 비유와 달리 받는 쪽의 각 층은 헤더의 키를 보고 다음에 넘길 위층을 고른다([프로토콜 그래프](/Hongs_Blog/studies/computer-communication/protocol-graph/)의 demux key).

## 정의

동작을 일으킬 때는 이 동작이 무엇인지 밝히는 헤더가 필요하다. 층은 헤더를 붙여서 아래층에 보내고, 받은 아래층은 또 자기 헤더를 붙인다[^2].

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

층 $$\ell$$의 프로토콜이 위층에서 받은 메시지를 $$m_{\ell+1}$$이라 하자.
- **보낼 때(캡슐화):** $$m_\ell = h_\ell \,\Vert \, m_{\ell+1}$$. 헤더 $$h_\ell$$을 앞에 붙인다. $$m_{\ell+1}$$이 바디다.
- **받을 때(역캡슐화):** $$h_\ell$$을 읽고 떼어 낸 $$m_{\ell+1}$$을 $$h_\ell$$이 가리키는 위층에 넘긴다.
- 가장 위층의 데이터가 $$M$$비트이고 층 $$\ell$$의 헤더가 $$\vert h_\ell\vert $$비트이면, 선에 실리는 길이는 $$M + \sum_\ell \vert h_\ell\vert $$비트다.

</div>


모든 프로토콜의 동작 원칙은 같다. 헤더를 붙여 내려보내고, 떼어 올려보낸다. 그러나 실제 동작까지 같지는 않다. 붙이는 헤더의 내용과 그 뜻이 달라서, 헤더를 읽고 하는 일이 다르다. 그래서 TCP와 UDP는 서로 다른 프로토콜이다[^3][^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 헤더 오버헤드 비율 (카드 C2의 60%와 약 3.9%) — [22_encapsulation_verify.py](/Hongs_Blog/studies/computer-communication/code/22_encapsulation_verify/)</div>

</div>


## 활용

- 헤더는 주소, demux key, 순서 번호 같은 제어 정보를 싣는다. [통계적 다중화](/Hongs_Blog/studies/computer-communication/statistical-multiplexing/)에서 조각마다 붙이는 주소도 헤더의 일부다.
- 흔한 실수는 오버헤드를 메시지 크기와 상관없이 일정한 비율로 보는 것이다. 헤더는 크기가 거의 고정이라 작은 메시지일수록 비율이 커진다(카드 C2).

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"모든 프로토콜의 동작 원칙이 같으니, 실제 동작도 같다"</div>

틀렸다. 슬라이드도 이 질문을 던진다. 그림에서 RRP 자리에 AAA를 넣어도 헤더를 붙이고 떼는 모양은 똑같아서 그럴듯해 보인다. 실제로 프로토콜의 차이는 헤더에 무엇을 적고 그것을 어떻게 해석하느냐에 있다. 예를 들어 TCP 헤더에는 순서 번호와 확인 번호가 있어 잃어버린 데이터를 다시 보낸다. UDP 헤더에는 그런 칸이 없어서 다시 보내지 않는다[^s1]. 모양이 같다고 동작이 같은 것은 아니다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 슬라이드의 RRP·HHP 구조에서 (a) 망을 지나는 메시지 (b) Host 2의 HHP가 처리를 마치고 RRP에게 넘기는 것 (c) RRP가 응용에게 넘기는 것을 각각 쓰라.</summary>


**답:** (a) <code>[HHP&#124;RRP&#124;Data]</code> (b) <code>[RRP&#124;Data]</code> (c) `[Data]`  
**흔한 오답:** (b)를 `[Data]`라고 하는 것. HHP는 자기 헤더만 뗀다. RRP 헤더는 HHP에게 바디의 일부일 뿐이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 세 층이 각각 20바이트 헤더를 붙인다. 응용 데이터가 (a) 40바이트일 때와 (b) 1,460바이트일 때, 선에 실리는 메시지에서 헤더가 차지하는 비율은?</summary>


**답:** 헤더 합 60바이트. (a) $$60 / (40 + 60) = 60\%$$. (b) $$60 / (1{,}460 + 60) \approx 3.9\%$$.  
**이유:** 헤더 크기는 메시지 크기와 무관하게 고정이다. 그래서 작은 메시지일수록 오버헤드 비율이 크다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 필기의 "동작은 같다. 헤더는 다르다. 헤더가 달라서 동작이 다르다. 즉, 다른 프로토콜이다"를 모순 없이 풀어 쓰라.</summary>


**답:** 첫 "동작"은 동작 원칙(헤더를 붙여 내려보내고 떼어 올려보냄)이고, 모든 프로토콜에 공통이다. 뒤의 "동작"은 실제로 하는 일(재전송 여부, 순서 맞추기 등)이다. 실제로 하는 일은 헤더에 무엇을 적고 어떻게 해석하느냐로 정해진다. 그래서 헤더가 다르면 다른 프로토콜이다.

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260925030227.png — 슬라이드 "포장/캡슐화(Encapsulation) -- 헤더(header)/바디(body)"
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/02.2주차.md, 67~77행
[^3]: 4-1학기/pasted_images/Pasted image 20260925030712.png — 슬라이드 "모든 프로토콜의 동작 원칙이 같다! 실제 동작도 같다?". 오른쪽의 빨간 손글씨: TCP, UDP
[^s1]: 에이전트 보충. TCP 헤더의 순서 번호·확인 번호와 UDP의 재전송 없음은 원본에 없다. TCP는 RFC 9293(2022), UDP는 RFC 768(1980)에 정의되어 있다.
{% endraw %}
