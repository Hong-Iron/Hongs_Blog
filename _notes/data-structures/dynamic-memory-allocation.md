---
layout: "note"
title: "동적 메모리 할당"
display_title: "동적 메모리 할당 (Dynamic Memory Allocation)"
kind: "concept"
kind_label: "정의"
num: "06"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Dynamic Memory Allocation", "동적 할당", "정적 할당", "Static Allocation", "malloc", "calloc", "realloc", "free", "힙", "Heap", "메모리 누수", "Memory Leak", "Memory Leakage", "size_t", "해제 뒤 사용", "Use After Free", "이중 해제", "Double Free"]
description: "자리를 미리 정해 두지 않고, 필요할 때 필요한 만큼 빌리고 다 쓰면 돌려주는 방식이다. 몇 칸이 필요한지 프로그램을 돌려 봐야 아는 경우에 쓴다. 빌린 자리는 함수가 끝나도 저절로 돌아가지 않으므로 직접 돌려줘야 한다. 돌려주지 않으면 쓸 수 없는 자리가 쌓이고, 돌려준 자리를 …"
prev_url: "/studies/data-structures/array-pointer/"
prev_title: "배열과 포인터"
next_url: "/studies/data-structures/abstract-data-type/"
next_title: "추상 자료형"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "06_dynamic-memory-allocation_impl.c", "u": "/studies/data-structures/code/06_dynamic-memory-allocation_impl/", "r": "구현"}]
permalink: "/studies/data-structures/dynamic-memory-allocation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

자리를 미리 정해 두지 않고, 필요할 때 필요한 만큼 빌리고 다 쓰면 돌려주는 방식이다. 몇 칸이 필요한지 프로그램을 돌려 봐야 아는 경우에 쓴다. 빌린 자리는 함수가 끝나도 저절로 돌아가지 않으므로 직접 돌려줘야 한다. 돌려주지 않으면 쓸 수 없는 자리가 쌓이고, 돌려준 자리를 또 쓰거나 두 번 돌려주면 프로그램이 망가진다.

</div>


## 예시로 보기

사용자에게 수를 몇 개 넣을지 묻고, 그만큼 읽어서 평균과 분산을 구하는 프로그램을 짠다. 분산은 평균을 안 뒤에 모든 수를 다시 봐야 하므로 수를 배열에 담아 두어야 한다. 그런데 배열을 몇 칸으로 잡아야 할까.

`double nums[100];`처럼 크기를 코드에 적어 두면(정적 할당) 사용자가 101개를 넣는 순간 모자란다. 넉넉하게 백만 칸을 잡으면 대부분 낭비이고, 그래도 모자랄 수 있다.

프로그램이 도는 중에, 변수에 든 값만큼 자리를 빌리면 된다. 사용자가 몇 개인지 말한 뒤에 딱 그만큼을 빌린다.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int n, i;
    double *nums, sum = 0.0, sq = 0.0, mean;

    if (scanf("%d", &n) != 1 || n <= 0)     /* 몇 개인지는 실행 중에 안다 */
        return 1;
    nums = calloc((size_t)n, sizeof *nums); /* double n칸을 빌린다 */
    if (nums == NULL)                       /* 자리가 모자라면 NULL이 온다 */
        return 1;

    for (i = 0; i < n; i++)
        if (scanf("%lf", &nums[i]) != 1)
            nums[i] = 0.0;
    for (i = 0; i < n; i++)
        sum += nums[i];
    mean = sum / n;                         /* 평균: 모든 수를 한 번 본다 */
    for (i = 0; i < n; i++)
        sq += (nums[i] - mean) * (nums[i] - mean);
    printf("평균 %g, 분산 %g\n", mean, sq / n);

    free(nums);                             /* 다 썼으면 돌려준다 */
    return 0;
}
```

`8 2 4 4 4 5 5 7 9`를 넣으면 여덟 칸을 빌려 `평균 5, 분산 4`를 찍는다[^s1].

빌린 자리는 힙(heap)이라는 영역에서 나온다. 함수의 변수가 놓이는 곳과는 다른 영역이다. `nums`라는 포인터 변수는 `main` 안에 있고, 그것이 가리키는 여덟 칸은 힙에 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 평균 5와 분산 4, `calloc`이 준 자리가 n = 1~200에서 모두 0인 것, `realloc` 뒤 앞부분이 그대로인 것, 누수 예에서 받기 4번에 돌려주기 1번인 것을 C로 컴파일해 실행(ASan·UBSan)해 확인했다. 이 기계의 ASan은 누수 검사를 지원하지 않아, 받은 횟수와 돌려준 횟수를 세는 감싸개로 212번씩 같은 것을 확인했다 — [06_dynamic-memory-allocation_impl.c](/Hongs_Blog/studies/data-structures/code/06_dynamic-memory-allocation_impl/)</div>

</div>


## 네 함수

사용자가 얼마만큼의 메모리를 달라고 하고, 받아서 쓰고, 다 쓰면 돌려준다. 이 세 가지를 하는 함수가 넷 있다.

| 함수 | 원형 | 하는 일 |
|---|---|---|
| `calloc` | `void *calloc(size_t num, size_t esize)` | 크기가 `esize`인 원소 `num`개짜리 배열을 빌린다 |
| `malloc` | `void *malloc(size_t esize)` | `esize`바이트 한 덩어리를 빌린다 |
| `realloc` | `void *realloc(void *ptr, size_t esize)` | 전에 빌린 덩어리의 크기를 `esize`바이트로 바꾼다 |
| `free` | `void free(void *ptr)` | 빌린 덩어리를 돌려준다 |

### 빌리기: calloc과 malloc

`calloc(num, esize)`는 `num * esize`바이트를 힙에서 잡고 그 첫 바이트의 주소를 돌려준다.

- `size_t`는 크기를 적는 데 쓰는 타입이다. 음수가 없는 정수다.
- `esize`에는 원소 하나의 크기를 넣는다. 직접 세지 않고 `sizeof`로 구한다.
- 돌려받는 주소의 타입은 `void *`다. 무엇을 가리키는지 정해지지 않은 주소라는 뜻이다. 쓸 타입의 포인터에 넣어서 쓴다.
- 메모리가 모자라면 `NULL`을 돌려준다. 그래서 받은 직후에 `NULL`인지 본다.

`malloc(esize)`는 인자가 하나다. 주어진 크기의 덩어리 하나를 힙에서 잡는다. 모자라면 `NULL`을 돌려주고, 다 쓰면 `free`로 돌려줘야 하는 것은 같다.

둘의 차이는 처음 내용이다. `calloc`은 빌려주는 자리의 모든 바이트를 0으로 채운다. `malloc`은 채우지 않는다. 그 자리에 전에 있던 값이 그대로 남아 있을 수 있다[^s2]. 그래서 `malloc(N * sizeof(float))`과 `calloc(N, sizeof(float))`은 빌리는 크기만 같고 같은 일은 아니다. `malloc`으로 받은 자리는 읽기 전에 직접 값을 넣어야 한다. 돌려 보면 0이 들어 있을 때도 있지만 우연이라 믿을 수 없다[^s2].


### 돌려주기: free

`free(ptr)`는 `ptr`이 가리키는 덩어리를 돌려준다. 돌려준 자리는 나중에 다른 요청에 다시 쓰인다.

- 프로그램은 빌려준 덩어리를 시작 주소로 기억한다. 그래서 `free`에는 빌릴 때 받은 주소를 그대로 준다.
- `calloc`으로 받은 배열을 `free`하면 배열 전체가 한꺼번에 돌아간다. 칸마다 따로 돌려주지 않는다.
- 빌린 적 없는 주소나 이미 돌려준 주소를 `free`에 주면 문제가 생긴다.

### 크기 바꾸기: realloc

`realloc(ptr, esize)`는 전에 빌린 덩어리 `ptr`의 크기를 `esize`바이트로 바꾼다. 일하는 순서는 이렇다. 크기가 `esize`인 자리를 새로 잡는다. 옛 덩어리의 내용을 새 자리의 앞부분에 옮긴다. 옛 덩어리를 돌려준다.

```
전:   p ----> [10][20][30][40]

      p = realloc(p, 8 * sizeof *p);

후:   p ----> [10][20][30][40][ ? ][ ? ][ ? ][ ? ]
```

새 자리는 옛 자리와 다른 곳일 수 있다. 그래서 돌려받은 주소를 꼭 받아서 쓰고, 옛 주소는 더 쓰지 않는다. 새로 생긴 칸의 내용은 정해져 있지 않다[^s2].

더 작은 크기를 줘도 `realloc`은 일을 한다. 앞부분만 남긴 덩어리를 돌려주고, 새 크기 뒤의 칸은 더는 내 자리가 아니다. 이때도 돌려받은 주소를 써야 한다. 8칸을 2칸으로 줄이면 `p[0]`과 `p[1]`만 남고, `p[5]`를 읽으면 남의 자리를 읽는 것이다[^s2].


## 누수

빌린 메모리는 함수가 끝나도 없어지지 않는다. 반드시 직접 돌려줘야 한다.

```c
void problem(int N)
{
    float *nums = calloc((size_t)N, sizeof(float));
    nums[0] = 1.0f;
    /* free(nums); 가 없다 */
}
```

`problem`을 부르면 `N`칸짜리 배열이 잡힌다. 함수가 끝나면 변수 `nums`는 사라진다. 그런데 `nums`가 가리키던 `N`칸은 힙에 놓여 있어 사라지지 않는다. 게다가 그 자리가 어디인지 알아낼 방법도 없다. 이것을 메모리 누수(memory leak)라 부른다.

```
함수 안:   nums [ 주소 ] ----> 힙 [ N칸 ]
함수 뒤:   (nums는 사라졌다)    힙 [ N칸 ]    <- 주소를 아는 변수가 없다
```

`problem(100)`을 세 번 부르면 400바이트짜리 덩어리 셋, 1,200바이트가 돌려줄 수 없는 채로 남는다[^s3]. 오래 도는 프로그램에서 이런 함수를 계속 부르면 쓸 수 있는 메모리가 줄어든다.

빌린 메모리로 하는 실수는 넷이다[^s3].

| 실수 | 생기는 일 |
|---|---|
| 돌려주지 않는다 | 쓸 수 없는 자리가 쌓인다(누수) |
| 돌려준 뒤에 또 읽거나 쓴다 | 그 자리는 이미 다른 데 쓰이고 있을 수 있다 |
| 같은 덩어리를 두 번 돌려준다 | 메모리를 관리하는 장부가 망가진다 |
| 빌린 적 없는 주소를 돌려준다 | 위와 같다 |

## 활용

- 크기를 실행 중에 아는 배열, 실행 중에 하나씩 늘어나는 노드를 만들 때 쓴다: [배열 두 배 늘리기](/Hongs_Blog/studies/data-structures/array-doubling/), [단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/)
- 함수가 끝난 뒤에도 남아야 하는 자리가 필요할 때 쓴다. 함수 안 변수의 주소는 함수가 끝나면 못 쓴다([포인터 인자와 값 전달](/Hongs_Blog/studies/data-structures/pointer-parameters/)).
- **흔한 실수.** `p = realloc(p, 새 크기);`라고 바로 덮어쓴다. `realloc`이 실패해 `NULL`을 돌려주면 옛 덩어리의 주소를 잃어 누수가 된다. 다른 변수에 받아 `NULL`이 아닌지 본 뒤에 옮긴다[^s2].

## 연결

- 선수: [포인터](/Hongs_Blog/studies/data-structures/c-pointer/), [배열과 포인터](/Hongs_Blog/studies/data-structures/array-pointer/)
- 자바는 `new`로 만든 것을 아무도 가리키지 않게 되면 실행 환경이 알아서 치운다. C에는 이것이 없어 `free`를 직접 부른다: [참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)
- 힙과 스택이 메모리의 어디에 놓이는가: [실행 시 메모리 배치](/Hongs_Blog/studies/compilers/runtime-memory-layout/)
- 크기가 제각각인 덩어리를 빌려주고 돌려받다 보면 빈자리가 잘게 흩어진다. 운영체제가 프로그램들에 메모리를 나눠 줄 때도 같은 일이 생긴다: [메모리 분할](/Hongs_Blog/studies/operating-systems/memory-partitioning/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `calloc`, `malloc`, `realloc`, `free`가 하는 일을 한 줄씩 쓰라. 메모리가 모자랄 때 빌리는 함수는 무엇을 돌려주는가?</summary>

**답:** `calloc`은 원소 여러 개짜리 배열을 빌리고 0으로 채운다. `malloc`은 주어진 바이트 수의 덩어리 하나를 빌리고 채우지 않는다. `realloc`은 전에 빌린 덩어리의 크기를 바꾼다. `free`는 빌린 덩어리를 돌려준다. 모자라면 `NULL`을 돌려준다.<br>
**흔한 오답:** "`malloc`과 `calloc`은 인자 개수만 다르다." 처음 내용이 0인지 아닌지가 다르다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 함수가 끝나면 함수 안의 변수는 저절로 사라진다. 그런데 함수 안에서 `calloc`으로 빌린 배열은 왜 남는가? 그래서 어떤 문제가 생기는가?</summary>

**답:** 함수 안의 변수는 포인터 `nums` 하나뿐이고, 배열은 힙이라는 다른 영역에 있다. 함수가 끝날 때 없어지는 것은 `nums`다. 힙의 배열은 `free`를 불러야만 돌아간다. `free` 없이 함수가 끝나면 배열의 주소를 아는 변수가 없어져 다시는 돌려줄 수 없다(누수).<br>
**이유:** 포인터 변수와 그것이 가리키는 자리는 서로 다른 칸이다. 하나가 사라진다고 다른 하나가 사라지지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `int *p = malloc(4 * sizeof *p);`로 빌린 네 칸에 10, 20, 30, 40을 넣고 `int *q = p;`로 주소를 베껴 둔다. 그다음 `p = realloc(p, 8 * sizeof *p);`를 한다. (가) `p[0]`~`p[3]`의 값은? (나) `p[4]`의 값은? (다) `q[0]`을 읽어도 되는가?</summary>

**답:** (가) 10, 20, 30, 40. (나) 정해져 있지 않다. (다) 안 된다.<br>
**이유:** `realloc`은 옛 내용을 새 자리 앞부분에 옮기므로 앞의 네 칸은 그대로다. 새로 생긴 칸은 채워 주지 않는다. `realloc`은 옛 덩어리를 돌려주므로, 새 자리가 다른 곳에 잡혔다면 `q`는 이미 돌려준 자리를 가리킨다.

</details>


[^s1]: 따로 컴파일해 `평균 5, 분산 4`가 찍히는 것을 봤고, 같은 계산을 구현 코드에서 확인했다. 분산은 개수 $$n$$으로 나눈 값이다.
[^s2]: C11 표준 7.22.3절을 따랐다. 이 기계에서 `size_t`는 8바이트다. 구현 코드에서 256바이트씩 받아 보니 `calloc` 쪽은 늘 모두 0이었다. `malloc` 쪽은 ASan을 켜고 돌리면 0이 아닌 바이트가 있었고, 끄고 돌리면 모두 0이었다. 구현 코드에서 8칸을 2칸으로 줄이면 앞의 두 칸이 그대로였고, 줄인 뒤 5번 칸을 따로 읽어 보니 ASan이 heap-buffer-overflow로 멈췄다(C11 표준 7.22.3.5절).
[^s3]: 누수는 구현 코드의 감싸개로 세었고, 돌려준 뒤 읽기와 두 번 돌려주기는 따로 돌려 ASan이 각각 heap-use-after-free, double-free로 멈추는 것을 봤다.
{% endraw %}
