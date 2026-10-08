---
layout: "note"
title: "접근 제어"
display_title: "접근 제어 (Access Control)"
kind: "concept"
kind_label: "모델"
num: "62"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
updated: "2026-10-08"
status: "verified"
aliases: ["Access Control", "접근 행렬", "Access Matrix", "접근 제어 목록", "Access Control List", "ACL", "권한 목록", "Capability List", "임의적 접근 제어", "Discretionary Access Control", "DAC", "강제적 접근 제어", "Mandatory Access Control", "MAC", "역할 기반 접근 제어", "Role-Based Access Control", "RBAC", "최소 권한 원칙", "Principle of Least Privilege"]
description: "접근 제어는 누가(주체), 무엇에(객체), 어떤 일을(읽기, 쓰기, 실행) 할 수 있는지를 정하고 지키게 하는 것이다. 건물 출입 카드처럼, 로그인으로 누구인지 확인된 사용자에게 운영체제가 규칙표에 따라 문을 열어 주거나 막는다. 규칙을 파일 주인이 마음대로 주느냐, 시스템이 등급…"
prev_url: "/studies/operating-systems/unix-inode/"
prev_title: "UNIX 아이노드"
next_url: "/studies/operating-systems/security-goals-threats/"
next_title: "보안의 목표와 위협"
math: false
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/access-control/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

접근 제어는 누가(주체), 무엇에(객체), 어떤 일을(읽기, 쓰기, 실행) 할 수 있는지를 정하고 지키게 하는 것이다. 건물 출입 카드처럼, 로그인으로 누구인지 확인된 사용자에게 운영체제가 규칙표에 따라 문을 열어 주거나 막는다. 규칙을 파일 주인이 마음대로 주느냐, 시스템이 등급으로 강제하느냐, 직무(역할)에 묶어 주느냐로 방식이 갈린다. 규칙표가 커지면 저장과 관리가 부담이라, 표를 파일별이나 사용자별로 쪼개 저장한다.

</div>


## 예시로 보기

슬라이드의 접근 행렬이다. 행은 사용자, 열은 파일과 계좌다[^1].

| | 파일 1 | 파일 2 | 파일 3 | 파일 4 | 계좌 1 | 계좌 2 |
|---|---|---|---|---|---|---|
| A | 소유 R W | | 소유 R W | | 조회, 입금 | |
| B | R | 소유 R W | W | R | 조회, 출금 | 조회, 입금 |
| C | R W | R | | 소유 R W | | 조회, 출금 |

- **열로 자르면** 파일마다 "누가 무엇을" 목록이 된다. 파일 1의 접근 제어 목록(ACL)은 A: 소유 R W, B: R, C: R W다[^2].
- **행으로 자르면** 사용자마다 "무엇에 무엇을" 목록이 된다. 사용자 B의 권한 목록(capability list, 티켓)은 파일 1: R, 파일 2: 소유 R W, 파일 3: W, 파일 4: R, 계좌 1: 조회·출금, 계좌 2: 조회·입금이다[^3].

빈칸이 대부분인 행렬을 통째로 저장하면 낭비라, 실제로는 이렇게 쪼개 저장한다[^s1].

## 정확히 말하면

로그인에 성공하면 사용자가 누구인지 확인된다. 사용자마다 허락된 연산과 파일 접근을 정한 프로필이 있을 수 있고, 운영체제는 그 규칙을 강제한다[^4]. 접근 제어는 어떤 접근을, 어떤 상황에서, 누구에게 허락할지 정한다[^5].

| 방식 | 내용 |
|---|---|
| 임의적 (DAC) | 요청자의 신원과, 요청자가 무엇을 할 수 있는지 적은 규칙(권한)으로 정한다. 권한을 가진 사용자가 다른 사용자에게 마음대로 권한을 넘겨줄 수 있어 "임의적"이다 |
| 강제적 (MAC) | 보안 등급(레이블)과 사용자의 인가 등급을 비교해 정한다. 사용자가 마음대로 권한을 넘겨줄 수 없어 "강제적"이다 |
| 역할 기반 (RBAC) | 사용자가 시스템에서 맡은 역할과, 역할마다 허락된 접근 규칙으로 정한다 |

세 방식은 서로 배타적이지 않아 함께 쓸 수 있다[^6]. 각 방식의 상세 설명은 교재를 따른 것이다[^s1].

**역할 기반 접근 제어.** 최소 권한 원칙을 효과적으로 구현한다. 역할마다 그 역할에 필요한 최소한의 접근 권한만 담고, 사용자를 역할에 배정해 그 역할을 하는 동안에만 필요한 일을 하게 한다[^7]. 접근 행렬로는 두 개로 나타낸다. 하나는 사용자 × 역할(누가 어떤 역할인가), 다른 하나는 역할 × 객체(역할이 무엇을 할 수 있는가)다[^8].

예: 병원에서 의사, 간호사, 원무과 역할을 두면, 직원이 부서를 옮길 때 역할만 바꾸면 된다. 수백 개 파일의 권한을 하나하나 고칠 필요가 없다[^s1].

## 활용

- UNIX의 rwx 9비트는 ACL을 주인·그룹·나머지 세 칸으로 줄인 것이고, 확장 ACL은 이름 붙은 사용자·그룹을 더한다 → [UNIX 아이노드](/Hongs_Blog/studies/operating-systems/unix-inode/)
- Windows는 프로세스마다 권한을 나타내는 접근 토큰을 두고, 객체마다 보안 기술자의 ACL과 접근 마스크로 접근을 판단한다[^9].
- 접근 제어는 사용자를 먼저 확인해야 의미가 있다 → [사용자 인증](/Hongs_Blog/studies/operating-systems/user-authentication/)

## 연결

- 선수: [디렉터리와 파일 공유](/Hongs_Blog/studies/operating-systems/directories-file-sharing/) (접근 권한과 사용자 부류)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 위 접근 행렬에서 파일 3의 ACL과 사용자 C의 권한 목록을 쓰라.</summary>


**답:** 파일 3의 ACL: A: 소유 R W, B: W. 사용자 C의 권한 목록: 파일 1: R W, 파일 2: R, 파일 4: 소유 R W, 계좌 2: 조회·출금.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 다음은 DAC, MAC, RBAC 중 무엇인가? ① 문서 작성자가 동료에게 읽기 권한을 직접 준다 ② "기밀" 등급 문서는 "기밀" 이상 인가를 받은 사람만 읽고, 작성자도 이를 바꿀 수 없다 ③ 회계팀 직원은 누구든 결산 파일을 고칠 수 있다</summary>


**답:** ① DAC ② MAC ③ RBAC.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> "파일 F에 접근할 수 있는 사람을 모두 찾기"와 "사용자 U가 접근할 수 있는 파일을 모두 찾기"는 각각 ACL과 권한 목록 중 어느 쪽이 쉬운가?</summary>


**답:** 앞의 것은 ACL. 파일 F의 목록만 보면 된다. 뒤의 것은 권한 목록. 사용자 U의 목록만 보면 된다. 반대쪽으로 찾으려면 모든 파일(또는 모든 사용자)의 목록을 뒤져야 한다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/12.Chapter12-new.pptx, 슬라이드 82 (그림 12.16a)
[^2]: 같은 자료, 슬라이드 83 (그림 12.16b)
[^3]: 같은 자료, 슬라이드 84 (그림 12.16c)
[^4]: 같은 자료, 슬라이드 81과 슬라이드 77의 발표자 노트
[^5]: 3-1학기/운영체제/1.수업자료/15.Chapter15-new.pptx, 슬라이드 18
[^6]: 같은 자료, 슬라이드 19 (그림 15.3)
[^7]: 같은 자료, 슬라이드 22
[^8]: 같은 자료, 슬라이드 23~25 (그림 15.6, 15.7)
[^9]: 같은 자료, 슬라이드 47~48
[^s1]: 에이전트 보충. 행렬을 쪼개 저장하는 이유, DAC·MAC·RBAC 각각의 정의 문장, 병원 예시, 확인 문제는 Stallings 6판 15.2절을 바탕으로 보탰다. 슬라이드는 세 방식의 이름과 RBAC 설명만 있다.
{% endraw %}
