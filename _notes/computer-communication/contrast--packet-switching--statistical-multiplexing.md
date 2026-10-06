---
layout: "note"
title: "패킷 스위칭과 통계적 다중화 비교"
display_title: "패킷 스위칭과 통계적 다중화 비교"
kind: "concept"
kind_label: "비교"
num: "17"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-10-06"
status: "verified"
aliases: ["패킷 스위칭 vs 통계적 다중화", "packet switching vs statistical multiplexing"]
description: "둘은 거의 늘 함께 나온다. 슬라이드도 한 장에 묶어 다룬다. 그래서 같은 것으로 착각하기 쉽다. 가르는 질문은 \"무엇에 대한 답인가\"다. 통계적 다중화는 링크 하나를 어떻게 나눠 쓰는지에 대한 답이다. 패킷 스위칭은 노드가 데이터를 목적지 쪽으로 어떻게 넘기는지에 대한 답이다."
prev_url: "/studies/computer-communication/contrast--tdm--statistical-multiplexing/"
prev_title: "시분할 다중화와 통계적 다중화 비교"
next_url: "/studies/computer-communication/process-to-process-channel/"
next_title: "프로세스 간 채널"
math: false
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/contrast--packet-switching--statistical-multiplexing/"
---
{% raw %}
둘은 거의 늘 함께 나온다. 슬라이드도 한 장에 묶어 다룬다[^1]. 그래서 같은 것으로 착각하기 쉽다. 가르는 질문은 "무엇에 대한 답인가"다. 통계적 다중화는 링크 하나를 어떻게 나눠 쓰는지에 대한 답이다. 패킷 스위칭은 노드가 데이터를 목적지 쪽으로 어떻게 넘기는지에 대한 답이다[^1][^2].

## 어느 쪽일까

설명마다 [패킷 스위칭](/Hongs_Blog/studies/computer-communication/packet-switching/)과 [통계적 다중화](/Hongs_Blog/studies/computer-communication/statistical-multiplexing/) 중 무엇을 말하는지 고르고, 다른 쪽이 왜 아닌지 쓴다.

<details markdown="1"><summary markdown="span"><b>C1</b> (a) 스위치가 들어온 패킷을 끝까지 받아 버퍼에 저장한 뒤, 목적지 쪽 링크로 내보낸다 (b) 링크 하나를 여러 입력이 나눠 쓰되, 보낼 것이 있는 입력에만 링크를 주고 조각마다 주소를 붙인다</summary>


**답:** (a) 패킷 스위칭. 노드가 데이터를 다음 노드로 넘기는 방법이다. 링크를 어떻게 나누는지는 말하지 않는다. (b) 통계적 다중화. 링크를 나눠 쓰는 방법이다. 노드가 무엇을 하는지는 말하지 않는다.<br>
**흔한 오답:** (a)를 통계적 다중화라고 하는 것. "버퍼에 쌓았다가 순서대로 보낸다"가 링크 공유처럼 들리지만, 저장 후 전달은 노드의 동작이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> (c) 스위치 없이 선 하나로 이은 두 호스트가, 여러 응용의 데이터를 생길 때마다 주소를 붙여 섞어 보낸다 (d) 스위치가 패킷마다 저장 후 전달하지만, 출력 링크는 입력 포트마다 정해 둔 시간 칸으로만 보낸다(칸이 비어도 남에게 주지 않는다). 각각 패킷 스위칭과 통계적 다중화 중 무엇이 있고 무엇이 없는가?</summary>


**답:** (c) 통계적 다중화는 있고 패킷 스위칭은 없다. 중간 노드가 없어서 넘겨 줄 일이 없다. (d) 패킷 스위칭은 있고 통계적 다중화는 없다. 출력 링크를 고정 칸으로 나누므로 동기식 시분할 다중화다. 그래서 "패킷 스위칭의 결과는 거의 통계적 다중화"라는 말에 "거의"가 붙는다[^1][^s1].

</details>

## 결정적 차이

| 기준 | 패킷 스위칭 | 통계적 다중화 |
|---|---|---|
| 답하는 질문 | 노드가 데이터를 목적지 쪽으로 어떻게 넘기나[^1] | 링크 하나를 여러 흐름이 어떻게 나눠 쓰나[^1] |
| 일어나는 곳 | 노드(스위치) | 링크 |
| 핵심 동작 | 패킷 단위로 링크 사용을 그때그때 다시 정한다(재스케줄링). 저장 후 전달[^1] | 보낼 것이 있는 입력에만 링크를 준다. 조각마다 주소 |
| 반대편 짝 | [회선 스위칭](/Hongs_Blog/studies/computer-communication/circuit-switching/) | [동기식 시분할 다중화](/Hongs_Blog/studies/computer-communication/time-division-multiplexing/) |

둘의 관계는 방향마다 따로 따져야 한다. 노드가 패킷 스위칭을 하면 그 결과로 링크는 (거의) 통계적으로 다중화된다. 반대로 스위칭 네트워크의 링크에서 통계적 다중화를 하려면 노드는 패킷 스위칭을 해야 한다[^1]. 회선 스위칭은 링크 용량을 연결마다 미리 떼어 주므로 링크가 통계적으로 나뉠 수 없다.

노드의 방식과 링크의 방식을 두 축으로 놓으면 네 조합이 나온다[^s1].

| 노드 \ 링크 | 고정 분할 (시분할·주파수 분할) | 통계적 다중화 |
|---|---|---|
| 회선 스위칭 | 전화망. 회선이 시간 칸 하나를 잡는다 | 없다. 미리 잡은 몫을 남에게 줄 수 없다 |
| 패킷 스위칭 | 드물다. 카드 C2의 (d) | 인터넷 |

## 둘 다 아닐 때

<details markdown="1"><summary markdown="span"><b>C3</b> 패킷 스위칭도 통계적 다중화도 쓰지 않는 망의 예를 들고, 그 망의 노드와 링크가 각각 무엇을 하는지 쓰라.</summary>


**답:** 옛 전화망. 노드(교환기)는 [회선 스위칭](/Hongs_Blog/studies/computer-communication/circuit-switching/)으로 통화 전에 경로를 잡는다. 링크는 [동기식 시분할 다중화](/Hongs_Blog/studies/computer-communication/time-division-multiplexing/)로 나뉘고, 회선 하나가 시간 칸 하나를 통화 내내 쓴다. 트래픽이 일정한 음성에는 잘 맞고, 버스티한 컴퓨터 통신에는 쉬는 칸이 낭비된다.

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260925012109.png — 슬라이드 "통계적 다중화와 패킷스위칭"
[^2]: 4-1학기/컴퓨터 통신/2.필기노트/02.2주차.md, 4~8행
[^s1]: 에이전트 보충. 네 조합 표와 카드 C2의 (d) 설정은 원본에 없다. 슬라이드의 "(거의)"와 필기의 "절대적이지는 않다"가 가리키는 경우를 구체화한 예다. 입력 포트마다 고정 칸을 주고 비어도 넘기지 않는 스케줄링은 동기식 시분할 다중화와 같은 구조다.
{% endraw %}
