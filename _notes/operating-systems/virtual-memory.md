---
layout: "note"
title: "가상 메모리"
display_title: "가상 메모리 (Virtual Memory)"
kind: "concept"
kind_label: "모델"
num: "38"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-07"
status: "verified"
aliases: ["Virtual Memory", "가상 주소", "Virtual Address", "실제 주소", "Real Address", "메모리 관리 장치", "MMU", "상주 집합", "Resident Set", "페이지 부재", "Page Fault", "스래싱", "Thrashing", "페이지 크기", "Page Size", "페이징과 세그먼테이션 결합"]
description: "가상 메모리는 프로세스의 일부만 주기억장치에 올려 두고 나머지는 디스크에 둔 채 실행하는 방법이다. 두꺼운 요리책 전체를 조리대에 펼치지 않고 지금 만드는 요리의 몇 쪽만 펼쳐 두는 것과 같다. 그래서 주기억장치보다 큰 프로그램을 돌릴 수 있고, 더 많은 프로세스를 함께 올릴 수 …"
prev_url: "/studies/operating-systems/segmentation/"
prev_title: "세그먼테이션"
next_url: "/studies/operating-systems/page-table-structure/"
next_title: "페이지 표 구조"
math: true
mermaid: false
code_count: 1
permalink: "/studies/operating-systems/virtual-memory/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

가상 메모리는 프로세스의 일부만 주기억장치에 올려 두고 나머지는 디스크에 둔 채 실행하는 방법이다. 두꺼운 요리책 전체를 조리대에 펼치지 않고 지금 만드는 요리의 몇 쪽만 펼쳐 두는 것과 같다. 그래서 주기억장치보다 큰 프로그램을 돌릴 수 있고, 더 많은 프로세스를 함께 올릴 수 있다. 하지만 필요한 쪽이 조리대에 없으면 책장에서 가져오는 동안 멈춰야 하고, 너무 자주 그러면 시스템이 가져오기만 하다 아무 일도 못 하게 된다(스래싱).

</div>


## 예시로 보기

7장의 [페이징](/Hongs_Blog/studies/operating-systems/paging/)과 [세그먼테이션](/Hongs_Blog/studies/operating-systems/segmentation/)에는 두 성질이 있다[^1].

1. 메모리 참조는 논리 주소이고, 실행 중에 물리 주소로 바뀐다. 그래서 프로세스가 디스크로 나갔다가 다른 곳에 들어와도 된다.
2. 프로세스가 여러 조각으로 나뉘고, 조각들이 주기억장치에 붙어 있지 않아도 된다.

두 성질이 다 있으면, 실행 중에 프로세스의 모든 페이지(또는 세그먼트)가 주기억장치에 있을 필요가 없다. 다음 명령어와 다음 데이터가 있는 조각만 메모리에 있으면 당분간 실행할 수 있다. 이것이 메모리 관리의 돌파구다[^2].

실행은 이렇게 흘러간다[^3].

1. 운영체제가 프로그램의 조각 몇 개만 주기억장치에 올린다. 주기억장치에 있는 부분을 **상주 집합**(resident set)이라고 부른다.
2. 프로세스가 메모리에 없는 주소를 쓰려 하면 인터럽트(**페이지 부재**, page fault)가 생긴다. 운영체제는 그 프로세스를 대기 상태로 만든다.
3. 운영체제가 그 주소가 든 조각을 가져오려고 디스크 읽기를 요청한다.
4. 디스크가 읽는 동안 다른 프로세스를 실행한다.
5. 디스크 읽기가 끝나면 인터럽트가 오고, 운영체제는 그 프로세스를 준비 상태로 옮긴다.

## 정확히 말하면

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**실제 메모리**는 주기억장치, 곧 실제 RAM이다. **가상 메모리**는 디스크까지 포함해 프로그램이 쓰는 저장 공간이다. 가상 메모리는 다중 프로그래밍을 효과적으로 하게 하고, 사용자를 주기억장치 크기의 빡빡한 제약에서 풀어 준다[^4].

주기억장치와 디스크 사이를 오가는 조각의 단위가 페이지면 가상 주소는 (페이지 번호, 오프셋)이다. 프로세서와 메모리 사이의 주소 변환 하드웨어(메모리 관리 장치, MMU)가 가상 주소를 실제 주소로 바꾼다[^5].

</div>


이 방식으로 얻는 것은 둘이다[^6].

- 프로세스마다 일부만 올리므로 더 많은 프로세스를 주기억장치에 둘 수 있다. 프로세스가 많으면 어느 순간에든 준비 상태인 프로세스가 있을 가능성이 크다.
- 프로세스가 주기억장치 전체보다 커도 된다.

### 왜 통하는가: 지역성

프로세스의 프로그램 참조와 데이터 참조는 한데 모이는 경향이 있다. 짧은 시간 동안에는 프로세스의 몇 조각만 쓰인다. 그래서 앞으로 어느 조각이 필요할지 똑똑하게 짐작할 수 있다[^7]. 프로세스의 일생 동안 참조가 페이지의 일부 집합에 몰려 있다는 것이 실제 측정에서도 보인다(그림 8.1)[^8].

이것이 [캐시 메모리](/Hongs_Blog/studies/operating-systems/cache-memory/)가 통하는 이유와 같은 지역성이다[^s1].

### 스래싱

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**스래싱**(thrashing)은 시스템이 명령어를 실행하기보다 조각을 들이고 내보내는 데 대부분의 시간을 쓰는 상태다[^9].

</div>


곧 쓸 조각을 내보내면 바로 다시 가져와야 한다. 이것이 되풀이되면 스래싱이 된다. 운영체제는 최근 기록을 바탕으로, 가까운 미래에 가장 덜 쓰일 조각을 짐작해 내보낸다[^9]. 그 방법이 [페이지 교체 알고리즘](/Hongs_Blog/studies/operating-systems/page-replacement/)이다. 메모리에 프로세스를 너무 많이 올려도 스래싱이 생긴다 → [상주 집합 관리와 적재 제어](/Hongs_Blog/studies/operating-systems/resident-set-load-control/)

가상 메모리를 쓰려면 하드웨어가 페이징이나 세그먼테이션을 지원하고, 운영체제가 페이지·세그먼트를 2차 기억장치와 주기억장치 사이에서 옮길 수 있어야 한다[^10].

### 페이지 크기

| 페이지를 작게 하면 | 페이지를 크게 하면 |
|---|---|
| 내부 단편화가 줄어든다 | 디스크는 큰 블록을 한 번에 옮기는 데 효율적이라 유리하다 |
| 프로세스마다 페이지가 많아져 페이지 표가 커지고, 페이지 표의 많은 부분이 가상 메모리(디스크)에 놓인다 | 페이지가 최근 참조에서 먼 곳까지 담아, 쓸데없는 내용이 메모리를 차지한다 |

이 표는 슬라이드 내용을 정리한 것이다[^11]. 페이지 크기와 페이지 부재율의 관계는 단순하지 않다. 페이지가 아주 작으면 많은 페이지가 메모리에 있고, 시간이 지나면 메모리의 페이지들이 모두 최근 참조 근처를 담아 부재가 적다. 페이지를 키우면 각 페이지가 최근 참조에서 먼 곳까지 담아 부재가 늘어난다. 더 키워 프로세스 전체에 가까워지면 다시 부재가 줄어든다[^12]. 실제 컴퓨터의 페이지 크기는 512바이트(VAX)부터 4 KB(IBM 370, IBM POWER), 4 KB~256 MB(Itanium)까지 다양하다[^13].

### 세그먼테이션과 결합

세그먼테이션은 프로그래머가 메모리를 여러 주소 공간(세그먼트)으로 보게 한다. 크기가 다르고 바뀔 수 있어서, 자라는 자료 구조를 다루기 쉽고, 프로그램을 따로 고쳐 컴파일할 수 있으며, 공유와 보호에 잘 맞는다[^14]. 가상 메모리에서 세그먼트 표 항목에는 시작 주소와 길이 외에, 세그먼트가 주기억장치에 있는지(P 비트)와 올라온 뒤 바뀌었는지(M 비트)를 나타내는 비트가 필요하다[^15].

두 방식을 합치면 각 세그먼트를 고정 크기 페이지로 나눈다. 페이징은 프로그래머에게 보이지 않고, 세그먼테이션은 보인다. 주소는 (세그먼트 번호, 페이지 번호, 오프셋)이 된다[^16]. 세그먼트 표 항목에 시작 주소와 길이가 있으므로, 잘못된 메모리 접근을 막고 여러 프로세스가 같은 세그먼트를 가리켜 공유할 수 있다[^17].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 카드 C1의 주소 계산 — [38_virtual-memory_verify.py](/Hongs_Blog/studies/operating-systems/code/38_virtual-memory_verify/)</div>

</div>


## 스스로 설명해 보기

1. 두 성질(실행 중 주소 변환, 불연속 조각)이 모두 있어야 일부만 올려 실행할 수 있다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   주소를 실행 중에 바꾸지 못하면 조각을 올릴 때마다 위치가 정해져야 한다. 조각이 연속이어야 하면 빠진 조각 자리를 비워 둬야 한다. 둘 다 있어야 필요한 조각만, 빈 아무 곳에나 올릴 수 있다.
   </details>
2. 페이지 부재가 나면 그 프로세스는 대기 상태가 된다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   디스크 읽기는 밀리초 단위로 오래 걸린다. 그동안 프로세서를 놀리지 않으려고 다른 프로세스를 실행한다. [프로세스 상태](/Hongs_Blog/studies/operating-systems/process-states/)의 사건 대기와 같다.
   </details>
3. 프로세스가 많을수록 준비 상태인 프로세스가 있을 가능성이 크다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   각 프로세스는 입출력이나 페이지 부재로 자주 기다린다. 프로세스가 많으면 모두가 동시에 기다릴 확률이 줄어든다. [다중 프로그래밍](/Hongs_Blog/studies/operating-systems/multiprogramming/)의 1 − pⁿ과 같은 생각이다.
   </details>
- 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  지역성 덕분에 지금 쓰는 일부만 빠른 메모리에 두면 된다. 나머지는 느리지만 큰 디스크에 두고, 필요할 때만 가져온다.
  </details>
- 같은 생각을 쓰는 다른 곳은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  [캐시 메모리](/Hongs_Blog/studies/operating-systems/cache-memory/)(주기억장치 ↔ 캐시), 웹 브라우저 캐시(서버 ↔ 내 디스크). 모두 메모리 계층의 위아래 층 사이에서 지역성을 쓴다.
  </details>

## 활용

- 지금의 모든 범용 운영체제가 페이징 기반 가상 메모리를 쓴다. 리눅스는 3단계 페이지 표(페이지 디렉터리, 페이지 중간 디렉터리, 페이지 표)를 쓰고, 각 표는 한 페이지 크기다[^18].
- 32비트 Windows에서 각 사용자 프로세스는 4 GB 주소 공간을 가진다. 그중 2 GB는 사용자, 2 GB는 모든 프로세스가 함께 쓰는 운영체제 영역이다[^19].
- 초기 UNIX와 Mac OS는 페이징 하드웨어가 없는 프로세서에서 돌아서 페이징을 쓰지 않았다. 나중에 페이징을 쓰도록 바뀌었다[^20].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 8장 슬라이드 107 "Typically each user process has 32G of available virtual address space" / 문제점: 32비트 주소 공간은 4 GB이고, 같은 슬라이드도 "4G per process", 이어서 "2G system space"라고 한다 / 수정안: "2G" / 근거: 슬라이드 108 그림 8.26 "2-Gbyte user address space"

</div>


## 연결

- 선수: [페이징](/Hongs_Blog/studies/operating-systems/paging/), [세그먼테이션](/Hongs_Blog/studies/operating-systems/segmentation/) (7장의 페이징은 모든 페이지가 주기억장치에 있어야 한다), [프로세스 상태](/Hongs_Blog/studies/operating-systems/process-states/)
- 프로그래머가 하던 오버레이를 운영체제가 대신 한다: [메모리 관리의 요구 사항](/Hongs_Blog/studies/operating-systems/memory-management-requirements/)
- 하드웨어 쪽: [페이지 표 구조](/Hongs_Blog/studies/operating-systems/page-table-structure/), [TLB](/Hongs_Blog/studies/operating-systems/tlb/)
- 운영체제 쪽: [페이지 교체 알고리즘](/Hongs_Blog/studies/operating-systems/page-replacement/), [상주 집합 관리와 적재 제어](/Hongs_Blog/studies/operating-systems/resident-set-load-control/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"가상 메모리 = 디스크를 메모리처럼 쓰는 것이니 늘 느리다"</div>

틀렸다. 디스크가 끼어 있어 느릴 것 같지만, 지역성 덕분에 대부분의 참조는 이미 주기억장치에 있는 페이지에서 끝난다. 디스크까지 가는 것은 페이지 부재 때뿐이다. 느려지는 것은 부재가 잦을 때, 곧 스래싱일 때다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"페이지를 작게 할수록 페이지 부재가 줄어든다"</div>

늘 그렇지는 않다. 작게 하면 메모리에 담는 내용이 최근 참조 근처로 더 정확해지지만, 페이지 표가 커지고 디스크 전송 효율이 떨어진다. 부재율과 페이지 크기의 관계는 슬라이드 그림 8.11처럼 오르다 내리는 모양이다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 페이지 크기가 512워드다. 가상 주소 1,300은 몇 번 페이지의 몇 번째 워드인가? 그 페이지가 실제 메모리 4번 칸에 있다면 실제 주소는?</summary>


**답:** $$1300 = 2 \times 512 + 276$$이므로 2번 페이지의 276번째 워드. 실제 주소는 $$4 \times 512 + 276 = 2324$$.<br>
**흔한 오답:** 페이지 번호를 1부터 세어 3번 페이지라고 하는 것. 페이지와 오프셋은 0부터 센다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 프로그램이 낸 주소의 페이지가 실제 메모리에 없을 때, 그 프로세스가 멈춰야 하는 이유는?</summary>


**답:** 필요한 데이터나 명령어를 디스크에서 가져와야 다음 명령어를 실행할 수 있기 때문이다. 디스크 입출력은 아주 느리므로 그동안 운영체제는 다른 프로세스를 실행한다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 프로세스 P가 메모리에 없는 페이지를 참조했다. 그 순간부터 P가 다시 실행되기까지 P의 상태와 운영체제가 하는 일을 순서대로 쓰라.</summary>


**답:** ① 주소 변환 중 페이지 부재 인터럽트 ② 운영체제가 P를 대기 상태로 ③ 그 페이지를 읽으라고 디스크 요청 ④ 다른 프로세스를 실행 ⑤ 디스크 완료 인터럽트 → P를 준비 상태로 ⑥ 스케줄러가 P를 고르면 실행 상태로, 부재를 일으킨 명령어를 다시 실행.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 가상 메모리가 지역성 없이도 잘 돌아갈 수 있을까? 참조가 모든 페이지에 고르게 흩어지는 프로그램을 생각해 설명하라.</summary>


**답:** 아니다[^s1]. 참조가 고르게 흩어지면 다음 참조가 지금 메모리에 있는 페이지일 확률이 상주 집합 크기 ÷ 전체 페이지 수 정도밖에 안 된다. 대부분의 참조가 페이지 부재가 되어 디스크를 오가느라 스래싱에 빠진다. 지역성이 있어야 "최근에 쓴 것을 곧 또 쓴다"는 짐작이 맞는다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/08.Chapter08-new.pptx, 슬라이드 4
[^2]: 같은 자료, 슬라이드 5
[^3]: 같은 자료, 슬라이드 6~7
[^4]: 같은 자료, 슬라이드 9
[^5]: 3-1학기/운영체제/1.수업자료/02.Chapter02-new.pptx, 슬라이드 39~41 (그림 2.10)과 발표자 노트
[^6]: 3-1학기/운영체제/1.수업자료/08.Chapter08-new.pptx, 슬라이드 8
[^7]: 같은 자료, 슬라이드 11
[^8]: 같은 자료, 슬라이드 12 (그림 8.1)
[^9]: 같은 자료, 슬라이드 10
[^10]: 같은 자료, 슬라이드 13
[^11]: 같은 자료, 슬라이드 32~33
[^12]: 같은 자료, 슬라이드 34~35 (그림 8.11)
[^13]: 같은 자료, 슬라이드 36 (표 8.3)
[^14]: 같은 자료, 슬라이드 37
[^15]: 같은 자료, 슬라이드 38~40 (그림 8.12)
[^16]: 같은 자료, 슬라이드 41~43 (그림 8.13)
[^17]: 같은 자료, 슬라이드 44~45
[^18]: 같은 자료, 슬라이드 101~103
[^19]: 같은 자료, 슬라이드 107~108 (그림 8.26)
[^20]: 3-1학기/운영체제/1.수업자료/02.Chapter02-new.pptx, 슬라이드 10의 발표자 노트
[^s1]: 에이전트 보충. 캐시와의 연결, 스스로 설명해 보기의 근거, 확인 문제 C1·C3·C4는 원본에 없다. C1의 계산은 2장 슬라이드의 "가상 주소 = 페이지 번호 + 오프셋"을 숫자로 옮긴 것이고, C3·C4는 8장 슬라이드 6~7, 11을 바탕으로 만들었다.
{% endraw %}
