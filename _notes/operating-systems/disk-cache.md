---
layout: "note"
title: "디스크 캐시"
display_title: "디스크 캐시 (Disk Cache)"
kind: "concept"
kind_label: "모델"
num: "55"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-08"
status: "verified"
aliases: ["Disk Cache", "LRU", "LFU", "Least Frequently Used", "빈도 기반 교체", "Frequency-Based Replacement", "페이지 캐시", "Page Cache"]
description: "디스크 캐시는 디스크 섹터 일부를 주기억장치에 복사해 둔 버퍼다. 자주 펴는 책 몇 권을 책상 위에 두는 것처럼, 같은 섹터를 다시 찾으면 디스크까지 가지 않고 메모리에서 바로 준다. 지역성 덕분에 한 번 가져온 블록은 곧 또 쓰일 가능성이 크다. 문제는 캐시가 찼을 때 무엇을 내…"
prev_url: "/studies/operating-systems/raid/"
prev_title: "RAID"
next_url: "/studies/operating-systems/file-management-system/"
next_title: "파일과 파일 관리 시스템"
math: false
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/disk-cache/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

디스크 캐시는 디스크 섹터 일부를 주기억장치에 복사해 둔 버퍼다. 자주 펴는 책 몇 권을 책상 위에 두는 것처럼, 같은 섹터를 다시 찾으면 디스크까지 가지 않고 메모리에서 바로 준다. 지역성 덕분에 한 번 가져온 블록은 곧 또 쓰일 가능성이 크다. 문제는 캐시가 찼을 때 무엇을 내보낼지인데, 최근 사용과 사용 횟수 중 무엇을 볼지에 따라 결과가 크게 달라진다.

</div>


## 예시로 보기

같은 블록을 짧은 시간에 여러 번 읽는 일은 흔하다. 예를 들어 레코드 하나를 처리하면서 같은 블록을 열 번 읽는다고 하자. 사용 횟수만 보는 LFU라면 이 블록의 횟수는 10이 된다. 처리가 끝나 다시는 안 쓰여도, 횟수가 높아 캐시에서 오래 버틴다. 그동안 진짜로 계속 쓰이는 다른 블록이 횟수가 낮다는 이유로 쫓겨난다[^s1].

빈도 기반 교체는 이 문제를 고친 것이다. 방금 참조된 블록에서 되풀이되는 참조는 횟수로 치지 않는다.

## 정확히 말하면

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**디스크 캐시**는 디스크 섹터를 담는 주기억장치의 버퍼다. 일부 섹터의 복사본을 가진다. 어떤 섹터에 입출력 요청이 오면 먼저 그 섹터가 캐시에 있는지 본다. 있으면 캐시로 처리하고, 없으면 디스크에서 캐시로 읽어 온다[^1].

</div>


| 교체 방법 | 내보내는 블록 | 구현 |
|---|---|---|
| LRU | 캐시에 들어온 뒤 가장 오랫동안 참조되지 않은 블록 | 캐시를 가리키는 포인터 스택. 참조되거나 새로 들어온 블록을 스택 맨 위에 올린다. 맨 아래가 교체 대상이다[^2] |
| LFU | 참조 횟수가 가장 적은 블록 | 블록마다 계수기를 두고 참조마다 1 늘린다. 교체할 때 계수기가 가장 작은 블록을 고른다[^3] |
| 빈도 기반 교체 | 아래 설명 | LRU 스택을 구역으로 나눈다[^4] |

**빈도 기반 교체.** 블록들을 LRU 스택처럼 최근 사용 순으로 늘어놓고 구역을 나눈다[^4].

```
MRU ← [ 새 구역 | 중간 구역 | 옛 구역 ] → LRU
```

1. 블록이 참조되면 스택 맨 위(새 구역)로 옮긴다.
2. 이미 새 구역에 있던 블록이 다시 참조되면 계수기를 늘리지 않는다. 짧은 시간의 되풀이 참조를 횟수로 치지 않기 위해서다. 새 구역 밖에서 참조되면 계수기를 1 늘린다.
3. 교체할 때는 옛 구역의 블록 가운데 계수기가 가장 작은 것을 내보낸다. 동률이면 가장 오래된 것이다.

구역을 둘(새, 옛)만 두면, 새 구역을 막 벗어난 블록은 계수기를 늘릴 기회가 없어 바로 쫓겨날 수 있다. 그래서 가운데에 중간 구역을 두어, 옛 구역에 닿기 전에 횟수를 쌓을 시간을 준다[^s1].

**성능 비교의 함정.** 슬라이드 그림 11.10(LRU, VAX의 UNIX 등 여러 연구)과 그림 11.11(빈도 기반 교체 시뮬레이션)을 나란히 보면 LRU가 나아 보인다. 하지만 같은 참조 패턴과 같은 캐시 구조로 비교하면 빈도 기반 교체가 낫다. 참조 패턴의 정확한 순서와 캐시 크기 같은 설계 조건이 결과를 크게 좌우한다[^5].

## 활용

- 리눅스 2.4 이후에는 디스크와 주기억장치 사이의 모든 데이터를 하나의 통합 페이지 캐시로 다룬다. 바뀐(dirty) 페이지를 모아 효율적으로 쓰고, 시간 지역성 때문에 다시 참조될 페이지를 붙잡아 둔다[^6].
- Windows의 캐시 관리자가 모든 파일 캐싱을 맡는다[^7].
- [페이지 교체](/Hongs_Blog/studies/operating-systems/page-replacement/), [캐시 메모리](/Hongs_Blog/studies/operating-systems/cache-memory/)와 같은 고민(LRU냐 LFU냐)을 디스크와 주기억장치 사이에서 한다.

## 연결

- 선수: [입출력 버퍼링](/Hongs_Blog/studies/operating-systems/io-buffering/), [페이지 교체 알고리즘](/Hongs_Blog/studies/operating-systems/page-replacement/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 순수 LFU를 디스크 캐시에 쓰면 생기는 문제를 예로 설명하라.</summary>


**답:** 짧은 시간에 몰아서 여러 번 참조된 블록은 계수기가 커져, 그 뒤로 다시 안 쓰여도 오래 남는다. 그동안 꾸준히 쓰이지만 횟수가 아직 낮은 블록이 쫓겨난다. 횟수가 "최근에 쓰이는가"를 반영하지 못하기 때문이다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 빈도 기반 교체에서 "새 구역에서의 참조는 세지 않는다"는 규칙이 하는 일을 한 문장으로 쓰라.</summary>


**답:** 방금 가져온 블록을 연달아 읽는 짧은 되풀이 참조가 계수기를 부풀리지 못하게 해서, 계수기가 오랜 기간에 걸친 진짜 인기를 나타내게 한다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> LRU 스택(위가 최근)이 위에서부터 [B, D, A, C]이고 캐시 칸은 4개다. 참조 A, 그다음 새 블록 E가 들어오면 스택은?</summary>


**답:** A 참조 뒤 [A, B, D, C]. E가 들어오면 맨 아래 C를 내보내고 E를 맨 위에 올려 [E, A, B, D].

</details>

[^1]: 3-1학기/운영체제/1.수업자료/11.Chapter11-new.pptx, 슬라이드 67과 슬라이드 65의 발표자 노트
[^2]: 같은 자료, 슬라이드 68
[^3]: 같은 자료, 슬라이드 69
[^4]: 같은 자료, 슬라이드 70 (그림 11.9)
[^5]: 같은 자료, 슬라이드 71 (그림 11.10, 11.11)과 슬라이드 69의 발표자 노트
[^6]: 같은 자료, 슬라이드 84
[^7]: 같은 자료, 슬라이드 87
[^s1]: 에이전트 보충. LFU 문제의 예시, 빈도 기반 교체의 단계별 규칙(계수기를 늘리는 조건, 옛 구역에서 고르기), 중간 구역이 필요한 이유, 확인 문제는 Stallings 6판 11.7절을 따랐다. 슬라이드는 그림만 있다.
{% endraw %}
