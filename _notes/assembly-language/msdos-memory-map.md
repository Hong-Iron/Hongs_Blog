---
layout: "note"
title: "MS-DOS 메모리 배치"
display_title: "MS-DOS 메모리 배치 (MS-DOS Memory Map)"
kind: "concept"
kind_label: "모델"
num: "49"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-15"
status: "verified"
aliases: ["MS-DOS Memory Map", "MS-DOS Memory Organization", "메모리 맵", "BIOS 데이터 영역", "BIOS Data Area", "VRAM", "640K", "Transient Program Area", "ROM BIOS"]
description: "MS-DOS가 도는 옛 PC의 메모리는 1메가바이트짜리 건물 한 채다. 맨 아래층에는 \"무슨 일이 생기면 어디로 가라\"는 안내판이 있고, 그 위로 운영체제, 내 프로그램, 화면에 쓸 자리, 맨 꼭대기에 지울 수 없는 기본 프로그램이 층층이 놓인다. 층마다 주소가 정해져 있어서 어느…"
prev_url: "/studies/assembly-language/fat-file-system/"
prev_title: "클러스터와 FAT"
next_url: "/studies/assembly-language/interrupt-vector-table/"
next_title: "INT 명령과 인터럽트 벡터 표"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "49_msdos-memory-map_verify.py", "u": "/studies/assembly-language/code/49_msdos-memory-map_verify/", "r": "검증"}]
permalink: "/studies/assembly-language/msdos-memory-map/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

MS-DOS가 도는 옛 PC의 메모리는 1메가바이트짜리 건물 한 채다. 맨 아래층에는 "무슨 일이 생기면 어디로 가라"는 안내판이 있고, 그 위로 운영체제, 내 프로그램, 화면에 쓸 자리, 맨 꼭대기에 지울 수 없는 기본 프로그램이 층층이 놓인다. 층마다 주소가 정해져 있어서 어느 프로그램이든 화면이나 키보드 상태를 주소만으로 바로 건드릴 수 있다. 그만큼 위험해서, 층 사이에 문이 없다 보니 프로그램 하나가 실수하면 운영체제의 자리까지 망가뜨린다.

</div>


## 예시로 보기

요즘 운영체제에서는 프로그램이 화면이나 키보드를 직접 건드릴 수 없다. 운영체제에 부탁해야 한다. 실주소 모드의 MS-DOS는 반대다. 한 번에 프로그램 하나만 돌고, 메모리 경계를 지키는 장치가 없다. 프로그램은 1MB 안의 어느 주소든 읽고 쓸 수 있다.

1MB는 $$2^{20}$$바이트이고, 주소로는 00000h부터 FFFFFh까지다. 이 안이 다음처럼 나뉜다.

```
 주소
FFFFFh +------------------------------------+
       | ROM BIOS                           |  64K
F0000h +------------------------------------+
       | 예약 (장치 제어기용)               |  192K
C0000h +------------------------------------+  -+
       | 비디오: 글자와 그래픽              |   |
B8000h +------------------------------------+   | VRAM (화면 메모리) 128K
       | 비디오: 그래픽                     |   |
A0000h +------------------------------------+  -+
       | (잠깐 올라오는 명령 처리기)        |   |
       | 응용 프로그램이 쓰는 자리          |   |
       |   Transient Program Area           |   |
       +------------------------------------+   |
       | 늘 올라와 있는 명령 처리기         |   | 640K RAM
       +------------------------------------+   |
       | DOS 커널, 장치 드라이버            |   |
       +------------------------------------+   |
       | 소프트웨어 BIOS                    |   |
       +------------------------------------+   |
       | BIOS·DOS 데이터                    |   |
00400h +------------------------------------+   |
       | 인터럽트 벡터 표                   |   |
00000h +------------------------------------+  -+
```

아래쪽 640K(00000h~9FFFFh)가 보통의 RAM이다. 그 위 128K는 화면에 보일 내용을 담는 메모리(VRAM)이고, 맨 위 64K에는 전원을 꺼도 남아 있는 BIOS 프로그램이 있다. 크기를 더하면 640 + 128 + 192 + 64 = 1,024K로 딱 1MB다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 경계 주소로 계산한 각 구역의 크기와 합 1,024K, 08F1:0100 → 09010h, 0040:0017 → 00417h, B800:0000 → B8000h, 카드 C2 — [49_msdos-memory-map_verify.py](/Hongs_Blog/studies/assembly-language/code/49_msdos-memory-map_verify/). 주소 계산만 확인했고 실제 DOS 메모리를 읽지는 않았다.</div>

</div>


## 구역별 내용

| 구역 | 들어 있는 것 |
|---|---|
| 인터럽트 벡터 표 (00000h~003FFh) | 인터럽트 번호마다 처리 코드의 주소 4바이트. 칸이 256개라 1,024바이트다: [INT 명령과 인터럽트 벡터 표](/Hongs_Blog/studies/assembly-language/interrupt-vector-table/) |
| BIOS·DOS 데이터 (00400h~) | 장치 상태를 적어 두는 자리. 아래 표 참고 |
| 소프트웨어 BIOS, DOS 커널 | 장치를 다루는 코드와 MS-DOS 본체 |
| 명령 처리기 | 사용자가 친 명령을 읽어 실행하는 프로그램. 늘 올라와 있는 부분과, 자리가 모자라면 응용 프로그램에 덮여도 되는 부분으로 나뉜다[^s2] |
| 응용 프로그램 자리 | 내가 만든 프로그램이 올라오는 곳 |
| 비디오 메모리 (A0000h~BFFFFh) | 화면에 보이는 글자와 점: [BIOS 비디오 INT 10h와 속성 바이트](/Hongs_Blog/studies/assembly-language/bios-video-int10h/) |
| ROM BIOS (F0000h~FFFFFh) | 지워지지 않는 기본 입출력 코드 |

낮은 주소부터 차례로 적으면 인터럽트 벡터 표, BIOS·DOS 데이터, 소프트웨어 BIOS, MS-DOS 커널, 상주 명령 처리기, 잠깐 올라오는 프로그램, 비디오, 예약, ROM BIOS 순서다.

### BIOS 데이터 영역

주소 00400h부터는 BIOS와 MS-DOS가 장치의 상태를 적어 두는 자리다. 위치가 고정이라 어느 프로그램이든 같은 주소에서 같은 정보를 읽는다. 세그먼트 0040h로 잡으면 오프셋이 표의 값 그대로다.

| 오프셋(16진) | 내용 |
|---|---|
| 0000~0007 | 직렬 포트 COM1~COM4의 주소 |
| 0008~000F | 병렬 포트 LPT1~LPT4의 주소 |
| 0010~0011 | 달려 있는 하드웨어 목록 |
| 0013~0014 | 메모리 크기(킬로바이트) |
| 0017~0018 | 키보드 상태 플래그 |
| 001A~001B, 001C~001D | 키보드 버퍼의 머리 포인터와 꼬리 포인터 |
| 001E~003D | 미리 입력한 키를 쌓아 두는 버퍼 |
| 0049 | 지금 비디오 모드 |
| 004A~004B | 화면의 칸 수 |
| 0050~005F | 비디오 페이지 1~8의 커서 위치 |
| 0062 | 지금 보이는 비디오 페이지 번호 |
| 006C~0070 | 타이머 자료 |

예: 키보드 상태 플래그는 0040:0017에 있다. 세그먼트에 16을 곱해 오프셋을 더하면 $$0040\text{h} \times 16 + 0017\text{h} = 00417\text{h}$$다: [실주소 모드의 세그먼트 주소](/Hongs_Blog/studies/assembly-language/real-mode-segment-address/).

이 영역은 Windows 98과 Windows Me에서는 읽을 수 있지만 Windows NT, 2000, XP에서는 읽을 수 없다.

## 활용

- [INT 21h](/Hongs_Blog/studies/assembly-language/int21h-io-functions/), [INT 16h](/Hongs_Blog/studies/assembly-language/bios-keyboard-int16h/), [INT 10h](/Hongs_Blog/studies/assembly-language/bios-video-int10h/), [인터럽트 처리기 바꾸기](/Hongs_Blog/studies/assembly-language/custom-interrupt-handler/)는 모두 이 배치를 전제로 한다. 16비트 실주소 모드에서만 돈다.
- 흔한 실수: 640K를 "메모리 전체"로 읽는 것. 주소 공간은 1MB이고, 640K는 그 가운데 프로그램과 운영체제가 쓰는 RAM이다.

## 연결

- 주소를 세그먼트와 오프셋으로 쓰는 법: [실주소 모드의 세그먼트 주소](/Hongs_Blog/studies/assembly-language/real-mode-segment-address/)
- 실주소 모드와 보호 모드의 차이: [x86 동작 모드](/Hongs_Blog/studies/assembly-language/x86-operating-modes/)
- 프로그램이 운영체제 자리를 못 건드리게 막는 장치: [사용자 모드와 커널 모드](/Hongs_Blog/studies/operating-systems/user-kernel-mode/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** MS-DOS 메모리 맵에서 00000h, 00400h, A0000h, F0000h에서 시작하는 구역은 각각 무엇인가?</summary>

**답:** 00000h 인터럽트 벡터 표, 00400h BIOS·DOS 데이터, A0000h 비디오 메모리(VRAM), F0000h ROM BIOS.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 키보드 버퍼는 0040:001E에서 시작한다. 선형 주소는? 글자 화면 메모리의 B800:00A0은?</summary>

**답:** 0041Eh, B80A0h.<br>
**이유:** 세그먼트 뒤에 16진수 0을 하나 붙이고(× 16) 오프셋을 더한다. 00400h + 001Eh = 0041Eh, B8000h + 00A0h = B80A0h.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 실주소 모드의 프로그램은 왜 BIOS 데이터 영역을 주소만으로 바로 읽을 수 있는가? Windows NT 이후에는 왜 안 되는가?</summary>

**답:** 실주소 모드에는 메모리 경계를 지키는 장치가 없어서 프로그램이 1MB 안의 어느 주소든 읽고 쓴다. 그리고 그 영역의 위치가 00400h로 고정이다. Windows NT 이후의 운영체제는 응용 프로그램이 이 영역에 직접 가는 것을 막는다.<br>
**이유:** 직접 갈 수 있다는 것은 실수로 망가뜨릴 수도 있다는 뜻이다. 보호 장치가 생기면서 길이 닫혔다.

</details>


[^s1]: 그림에는 경계 주소와 "640K RAM", "VRAM"만 적혀 있다. 구역별 크기(64K, 192K, 128K)와 합은 경계 주소를 빼서 계산했고 검증 코드로 확인했다. 인터럽트 벡터 표의 끝 003FFh와 칸 256개도 같은 계산이다.
[^s2]: 둘의 차이 설명은 Irvine, *Assembly Language for x86 Processors* 7판 14.1절의 설명을 따랐다. [확인필요]
{% endraw %}
