---
layout: "note"
title: "캐시 쓰기 정책"
display_title: "캐시 쓰기 정책 (Cache Write Policy)"
kind: "concept"
kind_label: "기법"
num: "39"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Cache Write Policy", "즉시 쓰기", "Write-Through", "나중 쓰기", "Write-Back", "더티 비트", "Dirty Bit", "쓰기 버퍼", "Write Buffer", "Write-Allocate", "No-Write-Allocate", "쓰기 실패", "Write Miss"]
description: "프로그램이 값을 고치면 캐시에 있는 사본과 메모리에 있는 원본이 달라진다. 이 둘을 언제 맞출지 정하는 규칙이다. 고칠 때마다 원본도 바로 고치면 단순하고 원본이 늘 최신이지만, 느린 메모리에 매번 다녀와야 한다. 사본만 고쳐 두었다가 그 사본을 내보낼 때 한 번에 원본을 고치면 …"
prev_url: "/studies/computer-architecture/direct-vs-associative-cache/"
prev_title: "직접 사상과 집합 연관 비교"
next_url: "/studies/computer-architecture/cache-replacement/"
next_title: "캐시 교체 정책"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/cache-write-policy/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프로그램이 값을 고치면 캐시에 있는 사본과 메모리에 있는 원본이 달라진다. 이 둘을 언제 맞출지 정하는 규칙이다. 고칠 때마다 원본도 바로 고치면 단순하고 원본이 늘 최신이지만, 느린 메모리에 매번 다녀와야 한다. 사본만 고쳐 두었다가 그 사본을 내보낼 때 한 번에 원본을 고치면 메모리에 가는 횟수가 크게 줄지만, 그동안 원본에는 낡은 값이 남는다.

</div>


## 예시로 보기

읽기만 할 때는 캐시와 메모리가 늘 같다. 저장 명령(`sw`)이 캐시의 사본만 고치고 끝내면 둘이 달라진다. 그 블록이 나중에 쫓겨나면 고친 값이 사라진다.

배열 `a[0]`~`a[7]`에 0~7을 쓰고, 그때마다 `count`를 고치는 반복문이다. `$s0`에는 `a`의 주소 0x100, `$s1`에는 `count`의 주소 0x220이 들어 있다.

```asm
loop: sll  $t1, $t0, 2        # $t1 = i * 4
      add  $t1, $s0, $t1      # $t1 = a[i]의 주소
      sw   $t0, 0($t1)        # a[i] = i
      addi $t0, $t0, 1        # i = i + 1
      sw   $t0, 0($s1)        # count = i
      bne  $t0, $t2, loop     # i != 8이면 되풀이
```

`sw`가 16번 실행된다. 4줄짜리 직접 사상 캐시(블록 16바이트)에서 두 방식으로 돌린 결과다.

| | 고칠 때마다 메모리에도 쓴다 | 사본만 고치고 내보낼 때 쓴다 |
|---|---|---|
| 메모리에 쓴 횟수 (반복문이 끝났을 때) | 16 | 0 |
| 그때 메모리의 `count` | 8 | 0 (낡은 값) |
| 그때 캐시의 `count` | 8 | 8 |
| 고친 블록을 다 되쓴 뒤 메모리에 쓴 횟수 | 16 | 3 |

오른쪽 방식에서 3은 고친 블록의 수다. `a`가 블록 2개, `count`가 블록 1개를 차지한다. 같은 블록을 여덟 번 고쳐도 되쓰기는 한 번이다. 끝에 가서 메모리의 내용은 두 방식이 똑같다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 더티 블록이 쫓겨날 때 되써지는 것, 정책이 달라도 끝에 메모리 내용이 같은 것(무작위 읽기·쓰기 300회 × 50번), 쓰기 버퍼의 멈춤 사이클, 카드 C3 — [39_cache-write-policy_verify.py](/Hongs_Blog/studies/computer-architecture/code/39_cache-write-policy_verify/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 정의

**쓰기 적중일 때의 두 정책**[^1].

- **즉시 쓰기**(write-through): 캐시의 사본을 고치면서 메모리의 원본도 함께 고친다. 메모리가 늘 최신이다.
- **나중 쓰기**(write-back): 캐시의 사본만 고친다. 그 블록이 캐시에서 쫓겨날 때 메모리에 되쓴다.

나중 쓰기는 줄마다 비트를 하나 더 둔다. 이 줄을 고친 적이 있으면 1로 세우는 **더티 비트**(dirty bit)다. 쫓겨날 때 더티 비트가 1인 블록만 메모리에 되쓴다. 읽기만 한 블록은 메모리와 같으니 그냥 버린다[^1].

```
 나중 쓰기 캐시의 줄 하나
+-----+-------+--------+------------------+
| 유효 | 더티  | 태그    | 데이터            |
+-----+-------+--------+------------------+
          |
          +-- 1이면: 메모리의 원본보다 이 사본이 새롭다. 내보내기 전에 되써야 한다
```

| | 즉시 쓰기 | 나중 쓰기 |
|---|---|---|
| 메모리에 쓰는 때 | 저장할 때마다 | 고친 블록이 쫓겨날 때 |
| 메모리의 내용 | 늘 최신 | 낡았을 수 있다 |
| 메모리 쓰기 횟수 | 저장 명령 수만큼 | 고친 블록 수만큼. 보통 훨씬 적다 |
| 제어 회로 | 단순하다 | 복잡하다. 더티 비트가 필요하다 |
| 접근 한 번에 메모리에 가는 횟수 | 예측하기 쉽다 | 0번, 1번, 2번으로 들쭉날쭉하다 |
| 고장에 대한 안전 | 메모리에 늘 사본이 있다 | 캐시에만 있는 값이 생긴다 |

나중 쓰기에서 실패 한 번이 메모리에 두 번 가는 경우가 있다. 쫓겨나는 블록이 더티면 그것을 되쓰고(1번), 새 블록을 가져온다(2번)[^2].

**쓰기 버퍼**(write buffer). 즉시 쓰기를 그대로 하면 저장 명령마다 느린 메모리 쓰기가 끝나기를 기다려야 한다. 그래서 캐시와 메모리 사이에 작은 대기열을 둔다. 프로세서는 "주소와 값"을 대기열에 넣고 바로 다음 명령으로 간다. 메모리는 뒤에서 대기열을 하나씩 비운다[^3].

메모리 쓰기 한 번이 10사이클이라 하자. 저장 명령 4개가 2사이클 간격으로 몰려 오고, 한참 뒤 또 4개가 몰려 온다.

| 쓰기 버퍼 칸 수 | 0 (없음) | 1 | 2 | 4 |
|---|---|---|---|---|
| 프로세서가 멈춘 사이클 | 80 | 48 | 28 | 0 |

4칸이면 몰려 온 저장을 다 받아 두고 쉬는 동안 비운다. 그런데 저장이 쉬지 않고 5사이클마다 오면(메모리가 비우는 속도의 두 배) 이야기가 다르다. 40번 저장할 때 멈춘 사이클은 버퍼 0칸에서 400, 1칸에서 195, 4칸에서 165, 8칸에서 125다. 버퍼는 잠깐 몰리는 것을 받아 줄 뿐이다. 평균적으로 메모리가 비우는 것보다 빨리 쌓이면 결국 꽉 차서 프로세서가 멈춘다.

**쓰기 실패일 때.** 쓰려는 블록이 캐시에 없으면 두 가지 길이 있다[^4].

- 블록을 먼저 캐시로 가져온 뒤 고친다(write-allocate). 곧 그 근처를 또 쓰거나 읽을 것이라는 데 건다. 나중 쓰기와 짝을 이룬다.
- 캐시는 건드리지 않고 메모리에만 쓴다(no-write-allocate). 즉시 쓰기와 짝을 이루는 경우가 있다.

예시의 반복문을 둘째 방식으로 돌리면 `sw` 16번이 모두 실패로 세어지고(캐시에 블록을 올리지 않으니) 메모리 쓰기도 16번이다. 첫째 방식에서는 실패가 3번뿐이다.

## 활용

- MIT 6.004 강의는 요즘 시스템이 흔히 나중 쓰기를 쓴다고 적는다[^5].
- 즉시 쓰기는 아래층에 늘 최신 사본이 있어서, 프로세서가 여럿일 때 사본을 맞추는 규칙이 단순해진다[^4]. 프로세서가 여럿일 때의 문제는 [멀티코어와 병렬 처리](/Hongs_Blog/studies/computer-architecture/multicore-parallelism/)에서 다룬다.
- 운영체제 과목의 [캐시 메모리](/Hongs_Blog/studies/operating-systems/cache-memory/)는 같은 두 정책을 "입출력 장치가 메모리를 직접 읽을 때 낡은 값을 볼 수 있다"는 쪽에서 짚는다.
- 흔한 실수: 더티 비트와 유효 비트를 섞는다. 유효 비트는 "이 줄에 쓸 만한 내용이 있다", 더티 비트는 "이 줄이 메모리보다 새롭다"이다. 유효하면서 더티가 아닌 줄이 가장 흔하다.

## 연결

- 선수: [직접 사상 캐시](/Hongs_Blog/studies/computer-architecture/direct-mapped-cache/)
- 쫓아낼 블록을 고르는 일: [캐시 교체 정책](/Hongs_Blog/studies/computer-architecture/cache-replacement/)
- 쓰기 때문에 멈춘 사이클이 성능에 주는 값: [캐시 성능과 평균 접근 시간](/Hongs_Blog/studies/computer-architecture/cache-performance-amat/)
- 같은 생각이 운영체제에서: 고친 페이지만 디스크에 되쓰는 [페이지 교체 알고리즘](/Hongs_Blog/studies/operating-systems/page-replacement/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 같은 워드를 100번 고치는 반복문이 있다. 즉시 쓰기와 나중 쓰기에서 메모리에 쓰는 횟수는 각각 몇 번인가? 그 블록이 반복문 내내 캐시에 머문다고 하자.</summary>

**답:** 즉시 쓰기 100번. 나중 쓰기는 반복문 동안 0번이고, 그 블록이 쫓겨날 때 1번이다.<br>
**이유:** 나중 쓰기는 고친 횟수가 아니라 고친 블록의 수만큼 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 나중 쓰기 캐시에서 더티 비트가 없으면 어떻게 해야 하는가? 그러면 무엇이 낭비되는가?</summary>

**답:** 어느 블록을 고쳤는지 모르니 쫓겨나는 블록을 모두 메모리에 되써야 한다. 읽기만 한 블록까지 되쓰느라 메모리 쓰기가 실패 수만큼 는다. 더티 비트 1개가 그 낭비를 막는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 메모리 쓰기 한 번이 8사이클이다. 저장 명령 6개가 0, 3, 6, 9, 12, 15사이클에 온다. 쓰기 버퍼가 없을 때와 2칸일 때 프로세서가 멈추는 사이클을 각각 구하라. 버퍼가 꽉 차 있으면 한 칸이 빌 때까지 멈추고, 멈춘 만큼 뒤 명령이 밀린다.</summary>

**답:** 버퍼가 없으면 저장마다 8사이클을 기다려 $$6 \times 8 = 48$$사이클. 2칸이면 17사이클.<br>
**이유:** 2칸일 때 첫 쓰기는 8에, 둘째는 16에 끝난다. 셋째 저장(6)은 버퍼가 차 있어 8까지 2사이클 멈춘다. 그 뒤 저장들은 밀려서 11, 19, 27에 오고, 각각 앞 쓰기가 끝나는 16, 24, 32까지 5사이클씩 멈춘다. $$2 + 5 + 5 + 5 = 17$$. 저장이 3사이클마다 오는데 메모리는 8사이클마다 하나씩 비우니, 버퍼가 있어도 계속 멈춘다.

</details>


[^1]: ShanghaiTech CS 110 Computer Architecture (UC Berkeley CS61C 슬라이드 기반), 2022, "Caches Part II", 슬라이드 9, 11~13 (Write-Through, Write-Back, Dirty bit, 두 정책의 비교), https://robotics.shanghaitech.edu.cn/courses/ca/22s/lectures/2022-CA-L17_Caches_II.pdf. Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 5장 "Large and Fast: Exploiting Memory Hierarchy"
[^2]: MIT 6.004 Computation Structures, Fall 2023, L13 "Caches", 슬라이드 21 (쓰기 실패: 쫓겨나는 줄이 더티면 먼저 되쓰고, 새 줄을 가져와 고친 뒤 더티 비트를 세운다), https://shd.mit.edu/2024/lectures/readings/6191-fall2023/L13.pdf
[^3]: ShanghaiTech CS 110, 2022, "Caches Part II", 슬라이드 9~10 (Write Buffer: 프로세서가 멈추지 않게 하고, 칸이 여럿이면 몰려 오는 쓰기를 받아 준다)
[^4]: University of Utah CS 3810, Lecture 20 "Cache Hierarchies, Virtual Memory", 슬라이드 7~8 (write-allocate와 write-no-allocate, write-through와 write-back), https://users.cs.utah.edu/~rajeev/cs3810/slides/3810-20.pdf
[^5]: MIT 6.004, Fall 2023, L13, 슬라이드 18 (Write Policy: write-back은 "Commonly implemented in current systems")
{% endraw %}
