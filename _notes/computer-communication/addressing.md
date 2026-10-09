---
layout: "note"
title: "주소 지정"
display_title: "주소 지정 (Addressing)"
kind: "concept"
kind_label: "정의"
num: "10"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
updated: "2026-10-06"
status: "verified"
aliases: ["Addressing", "주소", "address", "ID", "유니캐스트", "unicast", "브로드캐스트", "broadcast", "멀티캐스트", "multicast"]
description: "학교 방송에서 \"2학년 3반 김OO\", \"전교생 여러분\", \"방송부원들은\"으로 부르는 대상을 가리듯, 네트워크에서 통신할 상대를 이름표로 가리키는 일이다. 이름표가 있어야 여러 상대 중 누구에게 보낼지 정하고, 그다음에 가는 길을 찾을 수 있다. 받을 대상이 하나냐, 전부냐, 일부…"
prev_url: "/studies/computer-communication/contrast--circuit-switching--packet-switching/"
prev_title: "회선 스위칭과 패킷 스위칭 비교"
next_url: "/studies/computer-communication/routing/"
next_title: "라우팅"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/addressing/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

학교 방송에서 "2학년 3반 김OO", "전교생 여러분", "방송부원들은"으로 부르는 대상을 가리듯, 네트워크에서 통신할 상대를 이름표로 가리키는 일이다. 이름표가 있어야 여러 상대 중 누구에게 보낼지 정하고, 그다음에 가는 길을 찾을 수 있다. 받을 대상이 하나냐, 전부냐, 일부냐에 따라 이름표를 쓰는 방식이 달라진다.

</div>


## 예시로 보기

네트워크로 옮기면 학생 한 명 한 명이 노드, 이름·학년·부서가 주소다. 방송을 듣고 반응하는 학생들이 그 주소를 받는 쪽이고, 아래 기호로는 $$D(\alpha)$$라 쓴다.

| 방식 | 받는 노드 | 학교 방송 | 대응 |
|---|---|---|---|
| 유니캐스트 | 정확히 하나 | 한 명 호출 | 1:1 |
| 브로드캐스트 | 네트워크의 모든 노드 | 전교 방송 | 1:N |
| 멀티캐스트 | 네트워크의 일부 노드 | 방송부원 호출 | 1:N |

학교 방송은 모두에게 들리고, 부른 사람만 반응한다. 스위칭 네트워크의 유니캐스트는 대개 목적지 쪽으로만 전달되어, 다른 노드에는 닿지도 않는다[^s1].

## 정의

주소는 네트워크에서 노드 하나를 알아보게 해 주는 바이트열이다. 주소 지정은 주소로 통신 상대를 가리키는 일이다[^1].

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

주소 하나는 "이 주소로 보낸 데이터를 받을 노드들"을 가리킨다. 받을 노드가 몇 개냐에 따라 셋으로 나뉜다.
- **유니캐스트:** 받을 노드가 정확히 1개
- **브로드캐스트:** 네트워크의 모든 노드 (보내는 노드 자신은 빼기도 한다)
- **멀티캐스트:** 미리 정해 둔 그룹의 노드들. 보통 1개 이상이면서 전체보다는 적다

**기호로 쓰면.** 네트워크의 노드 집합을 $$V$$라 하자. 주소 $$\alpha$$는 받을 노드들의 집합 $$D(\alpha) \subseteq V$$를 가리킨다($$\subseteq$$는 "~의 일부이거나 전부", $$\vert \cdot\vert $$는 개수).
- 유니캐스트: $$\vert D(\alpha)\vert  = 1$$
- 브로드캐스트: $$D(\alpha) = V$$
- 멀티캐스트: 미리 정한 그룹 $$M \subseteq V$$에 대해 $$D(\alpha) = M$$. 보통 $$1 \le \vert M\vert  < \vert V\vert $$

</div>


그런데 "노드 하나를 알아보게 해 주는 바이트열"이라는 설명은 유니캐스트 주소에만 딱 맞는다. 브로드캐스트와 멀티캐스트 주소는 노드 여럿을 가리키기 때문이다. 그래서 위처럼 주소를 "받을 노드들을 가리키는 값"으로 보면 세 방식을 한 번에 설명할 수 있다[^s1].

## 예제

- 주소인 것: 이더넷 MAC 주소(48비트, 네트워크 카드 하나를 가리키는 유니캐스트 주소), 이더넷 브로드캐스트 주소 `FF:FF:FF:FF:FF:FF`(같은 네트워크의 모든 기기), IPv4 멀티캐스트 범위 `224.0.0.0/4`(그룹에 가입한 기기들)[^s2]
- 주소가 아닌 것: `www.example.com` 같은 호스트 이름(사람이 읽는 이름이며 전달에 쓰기 전에 주소로 바꾼다), 포트 번호(한 기기 안의 응용을 가리킨다)[^s2]

## 활용

- 주소로 상대를 지정한 다음에야 그 상대까지 가는 경로를 찾을 수 있다 → [라우팅](/Hongs_Blog/studies/computer-communication/routing/)[^1]
- [다중 접근 링크](/Hongs_Blog/studies/computer-communication/multiple-access-link/)에서 받을 기기를 가릴 때, [스위칭 네트워크](/Hongs_Blog/studies/computer-communication/switched-network/)에서 스위치가 어느 쪽으로 넘길지 정할 때, [통계적 다중화](/Hongs_Blog/studies/computer-communication/statistical-multiplexing/)에서 조각의 주인을 밝힐 때 쓴다.

## 연결

- 선수: [스위칭 네트워크](/Hongs_Blog/studies/computer-communication/switched-network/)
- 이어지는 개념: [라우팅](/Hongs_Blog/studies/computer-communication/routing/)
- 통계적 다중화에서 조각마다 붙는 주소는 DEMUX 키 역할을 한다 → [다중화](/Hongs_Blog/studies/computer-communication/multiplexing/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 주소와 주소 지정을 정의하고, 받는 대상의 수에 따른 세 방식을 쓰라.</summary>


**답:** 주소는 노드를 식별하는 바이트열이고, 주소 지정은 주소로 통신 상대를 지정하는 일이다. 유니캐스트(하나, 1:1), 브로드캐스트(네트워크의 모든 노드, 1:N), 멀티캐스트(일부 노드, 1:N).

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 다음은 유니캐스트·브로드캐스트·멀티캐스트 중 무엇인가? (a) 한 웹 서버에 페이지를 요청한다 (b) 같은 네트워크의 모든 기기에게 "이 IP 주소를 가진 기기가 누구냐"고 묻는다 (c) 수강 신청한 기기들에게만 강의 영상을 보낸다</summary>


**답:** (a) 유니캐스트. 받는 쪽이 하나다. (b) 브로드캐스트. 누구인지 모르니 모두에게 묻는다(이더넷의 ARP 요청이 실제로 이렇게 동작한다)[^s2]. (c) 멀티캐스트. 그룹에 속한 일부만 받는다.<br>
**흔한 오답:** (c)를 브로드캐스트라고 하는 것. 모두가 아니라 가입한 일부만 받는다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 점대점 링크 하나로 된 연결에서는 주소가 필요 없다. 다중 접근 링크나 스위칭 네트워크에서는 왜 필요한가?</summary>


**답:** 점대점 링크는 받는 쪽이 하나로 정해져 있다. 다중 접근 링크는 전송이 붙은 모든 노드에 닿으므로 누가 받을지 가려야 한다. 스위칭 네트워크는 스위치가 여러 출력 중 어디로 넘길지 정해야 하므로 목적지를 알려 주는 주소가 필요하다.

</details>

[^1]: 컴퓨터 통신 1회 필기 「1주차」, 42~52행
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 학교 방송 비유의 한계와 세 방식을 수신 집합으로 묶는 정의는 원본에 없다. "노드를 식별하는 바이트열"이라는 표현은 Peterson & Davie, *Computer Networks: A Systems Approach*, 1.2절과 같다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> MAC·IPv4 주소 예, 호스트 이름과 포트 번호, ARP는 원본에 없는 실제 사례다.
{% endraw %}
