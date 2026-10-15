---
layout: "note"
title: "컴퓨터의 기본 구성 요소"
display_title: "컴퓨터의 기본 구성 요소 (Basic Elements of a Computer)"
kind: "concept"
kind_label: "모델"
num: "01"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["Basic Elements of a Computer", "프로세서", "주기억장치", "입출력 모듈", "시스템 버스", "Main Memory", "I/O Module", "System Bus"]
description: "컴퓨터는 네 부분으로 이루어진다. 일을 하는 일꾼(프로세서), 일감과 작업 지시서를 펼쳐 두는 책상(주기억장치), 바깥 세상과 물건을 주고받는 창구(입출력 모듈), 이 셋을 잇는 복도(시스템 버스)다. 운영체제는 이 하드웨어를 대신 관리하는 프로그램이라서, 하드웨어가 어떻게 생겼는…"
next_url: "/studies/operating-systems/processor-registers/"
next_title: "프로세서 레지스터"
math: false
mermaid: true
code_count: 0
permalink: "/studies/operating-systems/computer-basic-elements/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

컴퓨터는 네 부분으로 이루어진다. 일을 하는 일꾼(프로세서), 일감과 작업 지시서를 펼쳐 두는 책상(주기억장치), 바깥 세상과 물건을 주고받는 창구(입출력 모듈), 이 셋을 잇는 복도(시스템 버스)다. 운영체제는 이 하드웨어를 대신 관리하는 프로그램이라서, 하드웨어가 어떻게 생겼는지 알아야 운영체제가 왜 그렇게 일하는지 보인다. 책상은 전원이 꺼지면 깨끗이 비워진다는 점이 중요하다.

</div>


## 예시로 보기

"엑셀 파일을 열어 합계를 구한다"는 일을 네 부분으로 나눠 보면 이렇다.

| 하는 일 | 맡는 부분 |
|---|---|
| 디스크에 있던 파일 내용을 컴퓨터 안으로 들여온다 | 입출력 모듈 (디스크 쪽 창구) |
| 들여온 숫자와 엑셀 프로그램의 명령어를 펼쳐 둔다 | 주기억장치 |
| 명령어를 하나씩 읽어 덧셈을 한다 | 프로세서 |
| 위 세 부분 사이로 데이터와 명령을 나른다 | 시스템 버스 |

```mermaid
flowchart LR
  CPU[프로세서] --- BUS[(시스템 버스)]
  MEM[주기억장치] --- BUS
  IO[입출력 모듈] --- BUS
  IO --- DEV[디스크·네트워크 장비·터미널]
```

"책상" 비유는 주기억장치가 일하는 동안 펼쳐 두는 곳이라는 점까지만 맞다. 실제 주기억장치는 칸마다 번호(주소)가 붙어 있고, 프로세서는 그 번호로 칸을 하나씩 집어서 읽고 쓴다.

## 네 부분이 하는 일

- **프로세서.** 컴퓨터 전체의 동작을 지휘하고 계산을 한다. 하나뿐이면 중앙 처리 장치(CPU)라고 부른다. 주기억장치와 데이터를 주고받을 때는 안쪽의 작은 저장 칸 두 개를 쓴다. 하나는 다음에 읽거나 쓸 주소를 담는 칸(MAR)이고, 다른 하나는 쓸 데이터나 읽어 온 데이터를 담는 칸(MBR)이다.
- **주기억장치.** 데이터와 프로그램을 담는다. 전원이 꺼지면 내용이 사라진다(휘발성). 칸마다 0번부터 차례로 번호가 붙어 있다. 한 칸에 든 비트 묶음은 명령어로도, 데이터로도 읽힐 수 있다. 실제 메모리(real memory), 1차 메모리(primary memory)라고도 부른다.
- **입출력 모듈.** 컴퓨터와 바깥 장치(디스크 같은 저장 장치, 통신 장비, 터미널) 사이에서 데이터를 옮긴다. 안에 잠깐 데이터를 맡아 두는 공간(버퍼)이 있다. 어느 장치와 일할지는 입출력 주소 레지스터(I/OAR)가, 주고받을 데이터는 입출력 버퍼 레지스터(I/OBR)가 담는다.
- **시스템 버스.** 프로세서, 주기억장치, 입출력 모듈이 서로 데이터를 주고받는 길이다.

## 활용

- 운영체제가 관리하는 대상이 바로 이 네 부분이다. 프로세서 시간을 누구에게 줄지, 주기억장치의 어느 칸을 누구에게 줄지, 어떤 입출력 장치를 언제 쓰게 할지 정한다. 자세한 것은 [운영체제의 역할](/Hongs_Blog/studies/operating-systems/os-role/)에 있다.
- 주기억장치가 휘발성이라서 오래 남길 데이터는 디스크 같은 2차 기억장치에 둔다. 이 차이는 [메모리 계층](/Hongs_Blog/studies/operating-systems/memory-hierarchy/)에서 다시 나온다.

## 연결

- 다음: 프로세서 안의 저장 칸은 [프로세서 레지스터](/Hongs_Blog/studies/operating-systems/processor-registers/), 프로세서가 일하는 순서는 [명령어 사이클](/Hongs_Blog/studies/operating-systems/instruction-cycle/)
- 2-1학기 [어셈블리어](/Hongs_Blog/studies/assembly-language/)의 1~2장(x86 프로세서 구조)이 같은 내용을 x86 기준으로 다룬다.

## 과목별 관점

**어셈블리어 (2-1학기).** 같은 네 부분을 x86 마이크로컴퓨터의 그림으로 본다. 여기에 더해 프로세서 안의 부품 이름, 버스가 셋으로 나뉜다는 것, 실제 메인보드의 부품을 다룬다.

- **프로세서 안.** 레지스터, 산술 논리 장치(ALU), 제어 장치(CU), 클록이 있다. ALU는 산술 계산과 비트 연산을 한다. 제어 장치는 실행 단계의 순서를 맞춘다. 클록은 0과 1을 일정하게 오가는 신호로, 프로세서와 버스의 모든 동작이 이 박자에 맞춰 일어난다. 박자 한 번(기계 사이클)이 동작 하나에 드는 시간의 단위다.
- **버스 셋.** 시스템 버스가 데이터 버스, 제어 버스, 주소 버스로 나뉘어 프로세서, 메모리, 입출력 장치를 잇는다.
- **메모리의 종류.** ROM은 읽기만 하는 메모리, EPROM은 지우고 다시 써넣을 수 있는 ROM이다. 동적 RAM(DRAM)은 싸지만 내용을 계속 새로 써 주어야 한다. 정적 RAM(SRAM)은 비싸고 새로 써 줄 필요가 없으며 캐시에 쓴다. 비디오 RAM(VRAM)은 화면을 계속 다시 그리는 데 맞춘 것이고, CMOS RAM은 시스템 설정 정보를 담는다.
- **메인보드와 포트.** 메인보드에는 CPU 소켓, 주기억장치와 외부 캐시의 슬롯, BIOS 칩, 확장 카드를 꽂는 PCI 슬롯, 여러 장치의 커넥터가 있다. 바깥 장치는 USB, 병렬 포트, 직렬 포트(RS-232), SATA, 블루투스, 와이파이로 잇는다.

프로세서 안의 저장 칸을 x86 기준으로 하나씩 본 것이 [x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/)다. 클록의 박자를 아껴 쓰는 방법은 [파이프라인과 슈퍼스칼라](/Hongs_Blog/studies/assembly-language/instruction-pipeline/)에 있다.

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 컴퓨터의 네 가지 기본 구성 요소와 각각이 하는 일을 한 줄씩 쓰라.</summary>


**답:** 프로세서: 동작을 지휘하고 계산한다. 주기억장치: 데이터와 프로그램을 담는다(휘발성). 입출력 모듈: 컴퓨터와 바깥 장치 사이에서 데이터를 옮긴다. 시스템 버스: 앞의 셋이 서로 통신하는 길.<br>
**흔한 오답:** 디스크를 기본 구성 요소로 적는 것. 디스크는 입출력 모듈 너머의 바깥 장치다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> MAR과 MBR은 각각 무엇을 담는가? 프로세서가 주기억장치 500번지 값을 읽을 때 두 칸에는 각각 무엇이 들어가는가?</summary>


**답:** MAR에는 읽거나 쓸 주소, MBR에는 쓸 데이터나 읽어 온 데이터가 들어간다. 500번지를 읽으면 MAR에 500이 들어가고, 읽어 온 값이 MBR에 들어온다.<br>
**흔한 오답:** 둘을 거꾸로 적는 것. 이름의 A는 address(주소), B는 buffer(데이터를 잠깐 맡아 두는 곳)다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 동적 RAM(DRAM)과 정적 RAM(SRAM)은 값과 관리 방법이 어떻게 다른가? 주기억장치와 캐시에는 각각 어느 쪽을 쓰는가?</summary>


**답:** DRAM은 싸지만 내용을 계속 새로 써 주어야 한다. SRAM은 비싸고 새로 써 줄 필요가 없다. 용량이 큰 주기억장치에는 DRAM을, 작고 빨라야 하는 캐시에는 SRAM을 쓴다.<br>
**이유:** 캐시는 용량이 작아서 비싼 SRAM을 써도 감당이 된다. 주기억장치는 용량이 커서 싼 쪽을 쓴다.

</details>
{% endraw %}
