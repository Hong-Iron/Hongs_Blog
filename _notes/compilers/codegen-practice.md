---
layout: "note"
title: "코드 생성 연습"
display_title: "코드 생성 연습"
kind: "practice"
kind_label: "연습"
num: "53"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "3주소 코드를 코드 생성용 MIPS 명령어로 옮기는 문제 셋이다. 명령 표기는 그 문서의 것을 쓴다($r0, 빈칸으로 나눈 피연산자). 실행 결과는 파이썬 흉내기로 확인한 것이고 실제 MIPS 어셈블러로 돌린 것이 아니다."
prev_url: "/studies/compilers/global-dataflow-ladder/"
prev_title: "전역 분석 예제 사다리"
next_url: "/studies/compilers/register-allocation-ladder/"
next_title: "레지스터 할당 예제 사다리"
math: true
mermaid: false
code_count: 2
permalink: "/studies/compilers/codegen-practice/"
---
{% raw %}
3주소 코드를 [코드 생성용 MIPS 명령어](/Hongs_Blog/studies/compilers/mips-instructions/)로 옮기는 문제 셋이다. 명령 표기는 그 문서의 것을 쓴다(`$r0`, 빈칸으로 나눈 피연산자). 실행 결과는 파이썬 흉내기로 확인한 것이고 실제 MIPS 어셈블러로 돌린 것이 아니다.

## p1 · 반복문 옮기기

`t0`는 `$sp + 12`, x는 `$sp + 8`, y는 `$sp + 4`에 있다. 다음 3주소 코드를 옮기라.

```
L0:
t0 = x < y
ifnot t0 goto L1
x = x + 1
goto L0
L1:
```

사용 개념: [단순 연산과 분기의 코드 생성](/Hongs_Blog/studies/compilers/codegen-simple-operations/)

**풀이 전략.** 줄마다 따로 옮긴다. 앞뒤 줄을 보지 않는다. 계산하는 줄은 "꺼내기 → 계산 → 넣기", 조건으로 뛰는 줄은 "꺼내기 → 0인지 보고 뛰기"다. 이 틀이 떠오르는 까닭은 이 기계에서 메모리에 닿는 명령이 `lw`와 `sw`뿐이기 때문이다. 변수가 나오면 먼저 `lw`를 쓴다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *라벨:* `L0:`은 그대로 `L0:`.
2. *`t0 = x < y`:* 두 변수를 꺼낸다. `lw $r0 8($sp)`, `lw $r1 4($sp)`. 비교한다. `slt $r2 $r0 $r1`. 넣는다. `sw $r2 12($sp)`.
3. *`ifnot t0 goto L1`:* 꺼낸다. `lw $r0 12($sp)`. 거짓(0)이면 뛴다. `beqz $r0 L1`.
4. *`x = x + 1`:* 꺼낸다. `lw $r0 8($sp)`. 오른쪽이 상수라 즉시값 명령을 쓴다. `addi $r1 $r0 1`. 넣는다. `sw $r1 8($sp)`.
5. *`goto L0`:* `j L0`.
6. *라벨:* `L1:`.

```
L0:
lw   $r0 8($sp)
lw   $r1 4($sp)
slt  $r2 $r0 $r1
sw   $r2 12($sp)
lw   $r0 12($sp)
beqz $r0 L1
lw   $r0 8($sp)
addi $r1 $r0 1
sw   $r1 8($sp)
j    L0
L1:
```

**검증.** x = 0, y = 3으로 돌리면 세 바퀴 뒤 x = 3에서 나온다. x와 y를 −2~5의 모든 쌍으로 돌려도 3주소 코드를 직접 실행한 값과 같다.<br>
**변형.** 조건을 `x <= y`로 바꾸면 `slt`가 `sle`로 바뀌고 나머지는 그대로다. 그러면 x = 0, y = 3에서 네 바퀴를 돌아 x = 4에서 나온다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [52_codegen-simple-operations_impl.py](/Hongs_Blog/studies/compilers/code/52_codegen-simple-operations_impl/)</div>

</div>


## p2 · if-else 옮기기

`t0`는 `$sp + 12`, x는 `$sp + 8`, y는 `$sp + 4`에 있다. 다음 3주소 코드를 옮기라. "x가 0이면 y = 1, 아니면 y = 2"다[^s1].

```
t0 = x == 0
ifnot t0 goto L1
y = 1
goto L2
L1:
y = 2
L2:
```

사용 개념: [단순 연산과 분기의 코드 생성](/Hongs_Blog/studies/compilers/codegen-simple-operations/), [코드 생성용 MIPS 명령어](/Hongs_Blog/studies/compilers/mips-instructions/)

**풀이 전략.** p1과 같은 틀이다. 새로 나오는 것은 `y = 1`처럼 상수를 그대로 넣는 줄이다. 꺼낼 변수가 없으므로 `lw` 대신 `li`로 상수를 레지스터에 올린 뒤 `sw`로 넣는다. 함수 호출에서 인자 3을 넣을 때 쓴 `li $r0 3` / `sw $r0 0($sp)`와 같은 꼴이다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *`t0 = x == 0`:* `lw $r0 8($sp)` / `seqi $r1 $r0 0` / `sw $r1 12($sp)`. 오른쪽이 상수 0이라 즉시값 비교 `seqi`를 쓴다.
2. *`ifnot t0 goto L1`:* `lw $r0 12($sp)` / `beqz $r0 L1`.
3. *`y = 1`:* `li $r0 1` / `sw $r0 4($sp)`.
4. *`goto L2`:* `j L2`.
5. *`L1:` / `y = 2`:* `L1:` / `li $r0 2` / `sw $r0 4($sp)`.
6. *`L2:`:* `L2:`.

```
lw   $r0 8($sp)
seqi $r1 $r0 0
sw   $r1 12($sp)
lw   $r0 12($sp)
beqz $r0 L1
li   $r0 1
sw   $r0 4($sp)
j    L2
L1:
li   $r0 2
sw   $r0 4($sp)
L2:
```

**검증.** x를 −3~3으로 돌리면 x = 0일 때만 y = 1이고 나머지는 y = 2다. 어느 길로 가든 메모리 읽기 2번, 쓰기 2번이다.<br>
**흔한 실수.** `j L2`를 빼먹는다. 그러면 x = 0일 때 `y = 1`을 한 뒤 그대로 아래로 흘러 `y = 2`까지 실행해서 y가 2가 된다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [53_codegen-practice_p2.py](/Hongs_Blog/studies/compilers/code/53_codegen-practice_p2/)</div>

</div>


## p3 · 인자가 둘인 함수 호출

`main`이 `c = call add2, 2`로 `add2(5, 7)`을 부른다. `add2`는 인자 x, y를 받아 `t0 = x + y` / `return t0`를 한다. `main`의 c는 부르기 전 `$sp + 4`에 있다. 인자는 첫 인자부터 차례로 스택에 넣는다고 하자[^s2].

(가) 부를 때 쌓는 명령을 쓰라. (나) `add2` 안에서 t0, 돌아갈 주소, 제어 링크, y, x, 반환값 칸의 오프셋을 쓰라. (다) `add2`의 몸통과 걷는 명령, 돌아온 뒤 `main`이 하는 명령을 쓰라.

사용 개념: [함수 호출의 코드 생성](/Hongs_Blog/studies/compilers/codegen-function-call/), [활성 레코드](/Hongs_Blog/studies/compilers/activation-record/)

**풀이 전략.** [함수 호출의 코드 생성](/Hongs_Blog/studies/compilers/codegen-function-call/)의 `foo`는 인자가 하나였다. 인자가 하나 늘면 달라지는 곳을 찾는다. 레코드의 칸이 하나 늘어나므로 ① 인자를 넣는 묶음이 한 번 더 나오고 ② 제어 링크를 계산할 때 더하는 수가 4 커지고 ③ 불린 함수 안에서 인자와 반환값 칸의 오프셋이 달라진다. 스택 그림을 먼저 그리고 `$sp`에서 칸 수를 세면 틀리지 않는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

**스택 그림.** 부르기 전 `$sp`가 1000이라 하자(c는 1004번지).

```
 1004 |  c               | <--+
 1000 |  반환값 칸        |    |
  996 |  x = 5           |    |
  992 |  y = 7           |    |
  988 |  제어 링크 = 1004-+----+
  984 |  돌아갈 주소      |
  980 |  t0              |
  976 |  (빈칸)          | <-- $sp (add2가 도는 동안)
```

**(가) 쌓기.**
1. *반환값 칸:* `subi $sp $sp 4`
2. *인자 x:* `li $r0 5` / `sw $r0 0($sp)` / `subi $sp $sp 4`
3. *인자 y:* `li $r0 7` / `sw $r0 0($sp)` / `subi $sp $sp 4`
4. *제어 링크:* `addi $r0 $sp 16` / `sw $r0 0($sp)` / `subi $sp $sp 4`. 이때 `$sp`는 988이고 c는 1004이므로 네 칸 위, 16이다.
5. *돌아갈 주소:* `sw $ra 0($sp)` / `subi $sp $sp 4`
6. *지역 변수 칸:* `subi $sp $sp 4`

**(나) 오프셋.** `$sp` = 976에서 세면 t0 `4($sp)`, 돌아갈 주소 `8($sp)`, 제어 링크 `12($sp)`, y `16($sp)`, x `20($sp)`, 반환값 칸 `24($sp)`.

**(다) 몸통, 걷기, 돌아온 뒤.**
```
lw  $r0 20($sp)      # x
lw  $r1 16($sp)      # y
add $r2 $r0 $r1
sw  $r2 4($sp)       # t0 = 12
lw  $r0 4($sp)
sw  $r0 24($sp)      # 반환값 칸 = 12

lw   $ra 8($sp)      # 돌아갈 주소 되찾기
lw   $r0 12($sp)     # 제어 링크 (1004)
subi $sp $r0 4       # $sp = 1000
jr   $ra

lw  $r0 0($sp)       # main: 반환값 12
sw  $r0 4($sp)       # c = 12
```

**검증.** 흉내기로 돌리면 c = 12이고 `$sp`가 1000으로 돌아온다. 스택은 가장 낮을 때 976까지, 곧 24바이트(여섯 칸) 자란다.<br>
**흔한 실수.** 제어 링크에 더하는 수를 인자 하나짜리 때처럼 12로 둔다. 그러면 제어 링크에 1000이 들어가고 걷은 뒤 `$sp`가 996이 된다. `main`은 `0($sp)`에서 반환값 대신 x의 값 5를 읽고, c에는 12가 들어가지 않는다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [53_codegen-practice_p3.py](/Hongs_Blog/studies/compilers/code/53_codegen-practice_p3/)</div>

</div>


[^s1]: 답은 문제 코드의 흉내기로 확인했다.
[^s2]: 답은 문제 코드로 확인했다.
{% endraw %}
