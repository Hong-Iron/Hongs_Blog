---
layout: "note"
title: "UNIX 아이노드"
display_title: "UNIX 아이노드 (Inode)"
kind: "concept"
kind_label: "자료구조"
num: "61"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-08"
status: "verified"
aliases: ["Inode", "Index Node", "아이노드", "i-node", "i-number", "직접 포인터", "Direct Pointer", "간접 포인터", "Indirect Pointer", "단일 간접", "이중 간접", "삼중 간접", "UNIX 파일 종류", "하드 링크", "심볼릭 링크", "UNIX 파일 권한", "rwx"]
description: "아이노드는 UNIX에서 파일 하나의 모든 관리 정보(종류, 주인, 권한, 시각, 크기, 데이터 블록 위치)를 담은 카드다. 파일 이름은 아이노드에 없고, 디렉터리가 \"이름 → 아이노드 번호\"를 따로 적는다. 블록 위치는 앞쪽 몇 블록만 직접 적고, 나머지는 \"블록 번호 목록이 든 …"
prev_url: "/studies/operating-systems/file-allocation/"
prev_title: "파일 할당"
next_url: "/studies/operating-systems/access-control/"
next_title: "접근 제어"
math: true
mermaid: false
code_count: 1
permalink: "/studies/operating-systems/unix-inode/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

아이노드는 UNIX에서 파일 하나의 모든 관리 정보(종류, 주인, 권한, 시각, 크기, 데이터 블록 위치)를 담은 카드다. 파일 이름은 아이노드에 없고, 디렉터리가 "이름 → 아이노드 번호"를 따로 적는다. 블록 위치는 앞쪽 몇 블록만 직접 적고, 나머지는 "블록 번호 목록이 든 블록"을 거쳐 한 단계, 두 단계, 세 단계로 가리킨다. 그래서 작은 파일은 빨리 찾고, 큰 파일도 수백 GB까지 담는다.

</div>


## 예시로 보기

FreeBSD에서 블록이 4 KB이고 블록 번호(포인터)가 8바이트라면, 포인터 블록 하나에 번호가 $$4096 / 8 = 512$$개 들어간다. 아이노드의 포인터로 닿을 수 있는 크기는 다음과 같다[^s1].

| 포인터 | 가리키는 데이터 블록 수 | 크기 |
|---|---|---|
| 직접 12개 | 12 | 48 KB |
| 단일 간접 | 512 | 2 MB |
| 이중 간접 | $$512^2$$ | 1 GB |
| 삼중 간접 | $$512^3$$ | 512 GB |

합치면 약 513 GB다. 파일 대부분은 작아서 직접 포인터만으로 끝나고, 디스크를 한 번 더 읽지 않아도 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표의 네 크기와 합, 카드 C2의 1 KB 블록 계산 — [61_inode_verify.py](/Hongs_Blog/studies/operating-systems/code/61_inode_verify/)</div>

</div>


## 정확히 말하면

**UNIX 파일의 여섯 종류.**[^1] 일반 파일, 디렉터리, 특수 파일(장치), 이름 있는 파이프, 링크, 심볼릭 링크.

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**아이노드**(index node)는 파일 하나의 핵심 정보를 담은 제어 구조다. 한 아이노드에 파일 이름이 여럿 이어질 수 있다. 하지만 활성 아이노드는 파일 하나에만 이어지고, 각 파일은 아이노드 하나만이 관리한다[^2].

</div>


FreeBSD 아이노드에는 다음이 있다[^3]. 파일 종류와 접근 모드, 주인과 그룹 식별자, 만든 시각·마지막 읽기·쓰기 시각, 파일 크기, 블록 포인터들, 블록 수와 디렉터리 항목 수(링크 수), 데이터 블록 크기, 커널·사용자가 정하는 플래그, 세대 번호, 확장 속성 크기와 블록.

**할당.** 블록 단위로, 필요할 때 동적으로 할당한다. 블록은 이어져 있지 않아도 된다. 색인 방식으로 추적하고, 색인 일부를 아이노드에 둔다. 모든 UNIX 구현에서 아이노드에는 직접 포인터 몇 개와 간접 포인터 셋(단일, 이중, 삼중)이 있다[^4].

```
아이노드
├─ 직접 포인터 × 12 ──────────────────────→ 데이터 블록
├─ 단일 간접 → [포인터 512개] ──────────────→ 데이터 블록
├─ 이중 간접 → [포인터] → [포인터] ─────────→ 데이터 블록
└─ 삼중 간접 → [포인터] → [포인터] → [포인터] → 데이터 블록
```

**기호로 쓰면.** 블록 $$B$$바이트, 포인터 $$p$$바이트, 직접 포인터 $$d$$개면, 포인터 블록 하나에 $$n = B/p$$개가 들어가고 최대 파일 크기는 다음과 같다.

$$(d + n + n^2 + n^3) \times B$$


**파일의 k번째 블록 찾기**(0부터, $$d = 12$$, $$n = 512$$)[^s1]:

| $$k$$의 범위 | 거치는 포인터 | 추가로 읽는 블록 수 |
|---|---|---|
| $$0 \le k < 12$$ | 직접 | 0 |
| $$12 \le k < 524$$ | 단일 간접 | 1 |
| $$524 \le k < 524 + 512^2$$ | 이중 간접 | 2 |
| 그 이상 | 삼중 간접 | 3 |

**디렉터리.** 디렉터리는 파일 이름과 아이노드를 가리키는 포인터(i-number) 목록을 담은 파일이다. 파일이나 디렉터리에 접근하면 i-number로 아이노드 표를 찾는다[^5]. 이름이 아이노드 밖에 있으므로, 서로 다른 디렉터리의 두 이름이 같은 아이노드를 가리킬 수 있다(하드 링크)[^s1].

### UNIX 파일 접근 제어

파일마다 사용자 ID(주인), 그룹 ID, 나머지 모두에 대한 권한이 있다. 셋 각각에 읽기(r), 쓰기(w), 실행(x) 비트가 있어 모두 9비트다[^6].

```
-rwxr-x---   주인: 읽기·쓰기·실행 / 그룹: 읽기·실행 / 나머지: 없음
```

확장 ACL을 지원하는 FreeBSD 등에서는 이름 붙은 사용자·그룹마다 3비트 권한을 더 둔다. 이때 9비트 중 그룹 칸은 마스크가 되어, 주인 외의 이름 붙은 사용자·그룹이 받을 수 있는 최대 권한을 정한다. 마스크에 없는 권한은 그 사용자의 칸에 있어도 허락되지 않는다[^7].

## 활용

- 리눅스 ext2/3/4도 아이노드와 직접·간접 블록 구조를 썼다(ext4는 큰 파일에 익스텐트를 더 쓴다)[^s1]. `ls -i`는 아이노드 번호를, `stat`은 아이노드의 정보를 보여 준다.
- 리눅스 VFS의 아이노드 객체는 특정 파일 하나를 나타낸다 → [파일과 파일 관리 시스템](/Hongs_Blog/studies/operating-systems/file-management-system/)
- 다단계 간접 포인터는 [다단계 페이지 표](/Hongs_Blog/studies/operating-systems/page-table-structure/)와 같은 생각이다. 작은 것은 빠르게, 큰 것은 단계를 늘려서 담는다.
- 계산 연습: [파일 할당과 아이노드 예제 사다리](/Hongs_Blog/studies/operating-systems/file-allocation-inode-ladder/)

## 연결

- 선수: [파일 할당](/Hongs_Blog/studies/operating-systems/file-allocation/) (색인 할당), [디렉터리와 파일 공유](/Hongs_Blog/studies/operating-systems/directories-file-sharing/)
- 권한 일반론: [접근 제어](/Hongs_Blog/studies/operating-systems/access-control/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 아이노드에 들어 있지 않은 것 하나와, 그것이 대신 어디에 있는지 쓰라.</summary>


**답:** 파일 이름. 디렉터리에 "이름 → 아이노드 번호(i-number)"로 적혀 있다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 블록 1 KB, 포인터 4바이트, 직접 포인터 10개, 단일·이중·삼중 간접이 하나씩이다. 각 포인터로 닿는 크기와 최대 파일 크기는?</summary>


**답:** 포인터 블록 하나에 256개. 직접 10 KB, 단일 256 KB, 이중 $$256^2$$ KB = 64 MB, 삼중 $$256^3$$ KB = 16 GB. 합 약 16.06 GB.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 블록 4 KB, 포인터 8바이트, 직접 12개. 파일의 5,000번째 블록(0부터)을 읽으려면 어느 포인터를 거치고, 아이노드 말고 디스크를 몇 번 더 읽는가?</summary>


**답:** 12 + 512 = 524 ≤ 5000 < 524 + 512²이므로 이중 간접. 1단계 포인터 블록, 2단계 포인터 블록을 읽고 데이터 블록을 읽으므로 포인터 블록 2번 + 데이터 1번.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 직접 포인터를 아이노드 안에 몇 개 두는 이유는? 모두 간접으로 하면 무엇이 나빠지는가?</summary>


**답:** 대부분의 파일은 작다. 직접 포인터로 처음 몇 블록을 바로 찾으면 작은 파일은 포인터 블록을 따로 읽지 않는다. 모두 간접이면 작은 파일도 매번 포인터 블록을 한 번 더 읽어야 해 느려진다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/12.Chapter12-new.pptx, 슬라이드 86
[^2]: 같은 자료, 슬라이드 87
[^3]: 같은 자료, 슬라이드 88~89 (그림 12.13)
[^4]: 같은 자료, 슬라이드 90과 슬라이드 86의 발표자 노트
[^5]: 같은 자료, 슬라이드 91 (그림 12.14)과 슬라이드 87의 발표자 노트
[^6]: 같은 자료, 슬라이드 92~93 (그림 12.15)
[^7]: 같은 자료, 슬라이드 89의 발표자 노트 (그림 12.15b 설명)
[^s1]: 에이전트 보충. 직접 포인터 12개, 64비트 포인터, 크기 표는 Stallings 6판 12.7절 본문(아이노드의 주소 정보가 64비트 주소 15개이고 앞 12개가 직접)과 표 12.4를 따랐다. 슬라이드 그림 12.13은 direct(0)~direct(12)로 그려져 13개로 읽힐 수 있다. k번째 블록 표, 하드 링크, ext4·명령어 연결, 확인 문제는 슬라이드에 없다.
{% endraw %}
