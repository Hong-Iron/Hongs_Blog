---
layout: "note"
title: "가입자 선로"
display_title: "가입자 선로 (Last-Mile Links)"
kind: "concept"
kind_label: "모델"
num: "33"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
updated: "2026-10-06"
status: "verified"
aliases: ["Last-Mile Links", "가입자 회선", "라스트 마일", "DSL", "xDSL", "Digital Subscriber Line", "Digital Subscriber Loop", "ADSL", "VDSL", "DSLAM", "DSL access multiplexer", "스플리터", "splitter", "케이블 모뎀", "cable modem", "로컬 루프", "local loop"]
description: "가입자 선로는 집과 인터넷 회사 사이를 잇는 마지막 구간이다. 사용자가 직접 골라 쓰는 링크라서 중요하다. 예전에는 이미 깔린 전화선 하나에 음성은 낮은 주파수로, 데이터는 높은 주파수로 함께 실어 보냈다(DSL). 전화선은 길수록 잡음이 커서, 요즘은 집 앞이나 집 안까지 광케이…"
prev_url: "/studies/computer-communication/wired-links/"
prev_title: "유선 링크"
next_url: "/studies/computer-communication/wireless-links/"
next_title: "무선 링크"
math: false
mermaid: false
code_count: 0
permalink: "/studies/computer-communication/last-mile-links/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

가입자 선로는 집과 인터넷 회사 사이를 잇는 마지막 구간이다. 사용자가 직접 골라 쓰는 링크라서 중요하다. 예전에는 이미 깔린 전화선 하나에 음성은 낮은 주파수로, 데이터는 높은 주파수로 함께 실어 보냈다(DSL). 전화선은 길수록 잡음이 커서, 요즘은 집 앞이나 집 안까지 광케이블을 끌어오고 전화와 섞지 않은 전용 인터넷 선을 준다.

</div>


## 예시로 보기

슬라이드 그림에서 집 안의 전화기와 DSL 모뎀이 스플리터(신호를 나누고 합치는 장치)에서 만나 전화선 하나로 전화국까지 간다[^1]. 음성과 데이터는 이 전화국까지의 전용선 위에서 서로 다른 주파수로 실린다. 전화국의 DSLAM(여러 집의 DSL 선을 모아 받는 다중화 장치)이 둘을 갈라, 데이터는 인터넷 회사(ISP)로, 음성은 전화망으로 보낸다[^1].

```
집:  전화기 ─┐
             ├─ 스플리터 ═══ 기존 전화선 (음성: 저주파 | 데이터: 고주파) ═══ 전화국 DSLAM ─┬─→ 전화망
    DSL 모뎀 ─┘                                                                    └─→ ISP → 인터넷
```

다중화의 말로 읽으면 전화선 하나가 링크, 음성과 데이터가 입력 두 개, 주파수 대역이 DEMUX 키다. 그러니 [주파수 분할 다중화](/Hongs_Blog/studies/computer-communication/frequency-division-multiplexing/) 그대로다[^2]. 케이블 하나에 링크가 여럿 있을 수 있다는 예로 슬라이드가 ADSL을 드는 것도 이 때문이다[^3].

## 정의

가입자 선로는 집(사용자)과 인터넷 공급자 사이를 마지막으로 연결하는 링크다. 사용자가 선택해서 쓰는 링크이므로 중요하다. 과거에는 모뎀을 통한 음성 전화 링크였다[^2].

| 방식 | 구조 | 속도 (슬라이드) |
|---|---|---|
| xDSL | 음성과 데이터를 FDM 방식으로 동시에[^2] | |
| ADSL | 전화국 ↔ 가입자 사이의 로컬 루프. 내려받기와 올려 보내기의 속도가 다르다 | 내려받기 1.554~8.448 Mbps [확인필요], 올려 보내기 16~640 Kbps |
| VDSL | 전화국 —(광케이블, STS-N)— 동네 광 네트워크 장치(Neighborhood optical network unit) —(구리선 1,000~4,500 ft)— 가입자 | 12.96~55.2 Mbps |
| 케이블 모뎀 | 케이블 TV 선을 이웃과 함께 씀(대역 공유). 비대칭 | 6~100 M |

ADSL이 비대칭인 이유는 사용자 대부분이 올려 보내기보다 내려받기를 훨씬 많이 하기 때문이다. 그래서 두 방향의 비율을 조정한다[^4]. VDSL은 구리선이 길면 잡음 때문에 느려지고 짧으면 빠르다는 점을 이용한다. 전화국에서 동네까지는 광케이블로 가고, 동네 장치에서 집까지의 짧은 구간만 기존 구리선을 쓴다[^4].

ISP 가입자 선로는 두 방향으로 발전하고 있다[^5].
1. 전화와 다중화하지 않고, 별도의 디지털 인터넷 링크를 추가로 제공한다.
2. 광케이블을 쓴다. 거리가 멀어도 안정적인 속도를 얻고, 집 앞이나 집 안까지 광케이블을 끌어온다.

## 연결

- 선수: [유선 링크](/Hongs_Blog/studies/computer-communication/wired-links/), [주파수 분할 다중화](/Hongs_Blog/studies/computer-communication/frequency-division-multiplexing/)
- DSL은 집마다 전화국까지 전용선([점대점 링크](/Hongs_Blog/studies/computer-communication/point-to-point-link/))이고, 케이블 모뎀은 이웃이 선을 나눠 쓴다([다중 접근 링크](/Hongs_Blog/studies/computer-communication/multiple-access-link/)).

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> DSL에서 전화 통화와 인터넷이 전화선 하나를 동시에 쓸 수 있는 원리를 한두 문장으로 설명하라. 스플리터와 DSLAM은 각각 무엇을 하는가?</summary>


**답:** 음성은 낮은 주파수 대역에, 데이터는 높은 주파수 대역에 실어 한 선을 주파수 분할 다중화로 나눠 쓴다. 스플리터는 집에서 두 대역을 전화기와 DSL 모뎀으로 가르고, DSLAM은 전화국에서 데이터를 인터넷(ISP)으로, 음성을 전화망으로 보낸다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> ADSL이 내려받기와 올려 보내기의 속도를 다르게 둔 이유는 무엇인가?</summary>


**답:** 사용자 대부분이 올려 보내기보다 내려받기를 훨씬 많이 한다. 전화선이 실을 수 있는 대역은 정해져 있으므로, 더 많이 쓰는 내려받기 쪽에 대역을 더 준다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> DSL과 케이블 모뎀을 "선을 누구와 나눠 쓰는가"로 비교하라. 저녁에 동네 사람들이 한꺼번에 영상을 볼 때 속도가 더 흔들리기 쉬운 쪽은?</summary>


**답:** DSL은 집마다 전화국까지 따로 깔린 선(전용선)을 쓴다. 케이블 모뎀은 동네의 케이블을 여러 집이 함께 쓴다(shared bandwidth). 한꺼번에 몰리면 나눠 쓰는 케이블 모뎀 쪽이 더 흔들리기 쉽다. 단, DSL도 전화국 너머의 망에서는 다른 사용자와 나눠 쓴다[^s1].

</details>

[^1]: 4-1학기/pasted_images/Pasted image 20260926030258.png — 슬라이드 "Digital subscriber line (DSL)". 원문의 빨간 글씨: existing, dedicated. 그림 없이 첫 줄만 있는 같은 슬라이드는 4-1학기/pasted_images/Pasted image 20260926030237.png
[^2]: 4-1학기/pasted_images/Pasted image 20260926030111.png — 슬라이드 "가입자 선로 (Last-Mile Links)". 원문의 빨간 글씨: "음성과 data를 FDM 방식으로 동시에". ADSL 내려받기 하한은 슬라이드에 1.554로 적혀 있다. T1 속도 1.544 Mbps와 한 자리가 다르다
[^3]: 4-1학기/pasted_images/Pasted image 20260926022517.png — 슬라이드 "링크 (Link)", "하나의 케이블에 여러 링크: 예) ADSL"
[^4]: 4-1학기/컴퓨터 통신/2.필기노트/04.4주차.md, 36~45행
[^5]: 4-1학기/pasted_images/Pasted image 20260927201727.png — 슬라이드 "ISP (인터넷망) 가입자 선로의 발전 추세". 필기 04.4주차.md 48~49행
[^s1]: 에이전트 보충. 저녁 시간의 예와 "전화국 너머에서는 DSL도 나눠 쓴다"는 원본에 없다. 슬라이드의 dedicated(DSL)와 shared bandwidth(케이블 모뎀)의 대비에서 나오는 결론이다.
{% endraw %}
