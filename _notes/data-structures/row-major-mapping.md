---
layout: "note"
title: "행 우선 배치와 열 우선 배치"
display_title: "행 우선 배치와 열 우선 배치 (Row-Major and Column-Major Mapping)"
kind: "concept"
kind_label: "기법"
num: "09"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Row-Major Mapping", "Row-Major Order", "행 우선 순서", "Column-Major Mapping", "Column-Major Order", "열 우선 순서", "2차원 배열", "2D Array", "배열의 배열", "Array of Arrays", "Iliffe Vector", "공간 오버헤드", "Space Overhead"]
description: "표를 메모리에 놓는 방법은 크게 둘이다. 줄마다 따로 덩어리를 잡고 줄들의 주소를 모아 두는 방법과, 모든 줄을 한 덩어리로 이어 붙이는 방법이다. 이어 붙이면 몇째 줄 몇째 칸이 어디 있는지 곱셈과 덧셈 한 번으로 나오고 덤으로 드는 자리도 작지만, 표 전체가 들어갈 만큼 긴 빈…"
prev_url: "/studies/data-structures/array-doubling/"
prev_title: "배열 두 배 늘리기"
next_url: "/studies/data-structures/triangular-matrix-mapping/"
next_title: "특수 행렬을 1차원 배열에 담기"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "09_row-major-mapping_impl.c", "u": "/studies/data-structures/code/09_row-major-mapping_impl/", "r": "구현"}]
permalink: "/studies/data-structures/row-major-mapping/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

표를 메모리에 놓는 방법은 크게 둘이다. 줄마다 따로 덩어리를 잡고 줄들의 주소를 모아 두는 방법과, 모든 줄을 한 덩어리로 이어 붙이는 방법이다. 이어 붙이면 몇째 줄 몇째 칸이 어디 있는지 곱셈과 덧셈 한 번으로 나오고 덤으로 드는 자리도 작지만, 표 전체가 들어갈 만큼 긴 빈자리가 통째로 있어야 한다. 이어 붙일 때 가로줄부터 놓느냐 세로줄부터 놓느냐는 언어마다 달라서, 순서를 잘못 알면 엉뚱한 칸을 읽는다.

</div>


## 예시로 보기

메모리는 한 줄이다. 그런데 표는 가로와 세로가 있다. 3줄 4칸짜리 표를 한 줄짜리 메모리에 어떻게 놓고, `x[2][1]`이 어디 있는지 어떻게 찾을까.

가로줄을 행(row), 세로줄을 열(column)이라 부른다. `x[i][j]`는 `i`번 행의 `j`번 열에 있는 값이다. 번호는 0부터 센다.

```
          0열  1열  2열  3열
  0행      a    b    c    d
  1행      e    f    g    h
  2행      i    j    k    l
```

**방법 1. 배열의 배열.** 행마다 1차원 배열을 따로 만들고, 그 세 배열의 주소를 담은 배열 `x[]`를 하나 더 만든다.

```
  x[]
 [ * ] ----> [ a ][ b ][ c ][ d ]
 [ * ] ----> [ e ][ f ][ g ][ h ]
 [ * ] ----> [ i ][ j ][ k ][ l ]
```

`x[2][1]`을 읽으려면 `x[2]`에 적힌 주소로 가서 그 배열의 1번 칸을 읽는다.

**방법 2. 한 덩어리로 잇기.** 0행, 1행, 2행을 차례로 이어 붙여 1차원 배열 `y` 하나로 만든다. 행 안에서는 왼쪽부터, 행끼리는 위부터 모은다. 이것이 행 우선 배치(row-major mapping)다.

```
 y[]  [ a ][ b ][ c ][ d ][ e ][ f ][ g ][ h ][ i ][ j ][ k ][ l ]
        0    1    2    3    4    5    6    7    8    9   10   11
      |<----- 0행 ----->|<----- 1행 ----->|<----- 2행 ----->|
```

`x[2][1]`은 앞에 온전한 행이 둘(8칸) 있고, 같은 행 안에서 앞에 한 칸이 있다. 그래서 $$2 \times 4 + 1 = 9$$번 칸이고, 거기에 `j`가 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 행 수와 열 수가 1~6인 모든 표의 모든 칸 441개에서 아래 두 위치 식과 거꾸로 구하는 식을 실제 2차원 배열의 값·주소와 비교했다. 덩어리 수, 덤으로 드는 자리, 카드의 답도 함께 C로 컴파일해 실행(ASan·UBSan)해 확인했다 — [09_row-major-mapping_impl.c](/Hongs_Blog/studies/data-structures/code/09_row-major-mapping_impl/)</div>

</div>


## 위치 식

행이 $$r$$개, 열이 $$c$$개인 표 `x`를 행 우선으로 이어 붙였다고 하자. $$i$$는 행 번호($$0 \le i < r$$), $$j$$는 열 번호($$0 \le j < c$$)다.

- 행마다 원소가 $$c$$개다.
- $$i$$번 행 앞에는 행이 $$i$$개 있다.
- 그래서 `x[i][0]` 앞에는 원소가 $$ic$$개 있다.
- `x[i][j]`는 거기서 $$j$$칸 더 간다.

$$\text{위치}(i, j) = ic + j$$


식에 행 수 $$r$$은 나오지 않는다. 곱하는 수는 "한 행에 몇 칸인가"다. 주소로 바꾸려면 [배열의 주소 식](/Hongs_Blog/studies/data-structures/array-pointer/)에 넣는다. 배열이 1000번지에서 시작하고 한 칸이 4바이트면 `x[2][1]`은 $$1000 + 9 \times 4 = 1036$$번지다[^s1].

거꾸로 위치 $$p$$에서 행과 열을 구할 수도 있다. $$p$$를 $$c$$로 나눈 몫이 행 번호, 나머지가 열 번호다. 9를 4로 나누면 몫 2, 나머지 1이라 `x[2][1]`이다[^s1].

**열 우선 배치(column-major mapping).** 열 단위로 모은다. 열 안에서는 위부터, 열끼리는 왼쪽부터다. 위 표는 `a e i b f j c g k d h l` 순서가 된다. 같은 논리로 $$j$$번 열 앞에는 열이 $$j$$개, 원소가 $$jr$$개 있다[^s1].

$$\text{위치}(i, j) = jr + i$$


`x[2][1]`은 $$1 \times 3 + 2 = 5$$번 칸이다. 위 순서에서 5번 칸은 `j`다.

## 덤으로 드는 자리

원소 말고 더 드는 메모리를 견준다. 주소 하나와 정수 하나를 각각 4바이트로 친다.

| | 배열의 배열 | 한 덩어리(행 우선) |
|---|---|---|
| 메모리 덩어리 | $$r + 1$$개. 길이 $$r$$짜리 하나와 길이 $$c$$짜리 $$r$$개 | 1개. 길이 $$rc$$ |
| 덤 | 행 주소를 담는 `x[]`: 행 수 × 4바이트 | 시작 주소 4바이트 + 열 수 $$c$$를 적는 4바이트 = 8바이트 |
| 3행 4열이면 | 덩어리 4개(길이 3, 4, 4, 4), 덤 12바이트 | 덩어리 1개(길이 12), 덤 8바이트 |
| `x[i][j]` 찾기 | 주소를 한 번 따라간 뒤 $$j$$번 칸 | $$ic + j$$를 계산해 한 번에 |
| 행마다 길이가 달라도 되는가 | 된다 | 안 된다 |
| 곤란한 점 | 덤이 행 수만큼 든다 | 길이 $$rc$$인 이어진 빈자리가 있어야 한다 |

한 덩어리는 표가 클 때 곤란하다. 그만큼 긴 빈자리가 통째로 있어야 한다. 배열의 배열은 짧은 덩어리 여럿으로 나뉘어 있어 그런 자리가 없어도 된다.

## C에서

`int arr[3][4];`라고 선언한 배열은 행 우선 한 덩어리다. 열두 칸이 0행, 1행, 2행 순서로 이어져 있고, 컴파일러가 `arr[i][j]`를 $$4i + j$$번 칸으로 바꿔 준다.

크기를 실행 중에 정하려면 [malloc](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/)으로 직접 만든다. 두 방법 모두 쓸 수 있다[^s2].

```c
/* 한 덩어리: r * c칸을 한 번에 빌리고 위치 식으로 찾는다 */
int *m = malloc((size_t)(r * c) * sizeof *m);
m[i * c + j] = 7;
free(m);

/* 배열의 배열: 행 주소 r개를 담을 배열과, 행마다 c칸 */
int **x = malloc((size_t)r * sizeof *x);
for (i = 0; i < r; i++)
    x[i] = malloc((size_t)c * sizeof **x);
x[2][1] = 7;
for (i = 0; i < r; i++)
    free(x[i]);        /* 행을 먼저 돌려주고 */
free(x);               /* 행 주소 배열을 돌려준다 */
```

배열의 배열은 `malloc`을 $$r + 1$$번 불렀으니 `free`도 $$r + 1$$번 부른다. 순서가 중요하다. `x`를 먼저 돌려주면 행들의 주소를 잃는다.


## 언어마다 다르다

여러 차원의 배열을 놓는 순서는 언어나 표준 라이브러리마다 정해져 있다.

| 놓는 법 | 언어 |
|---|---|
| 행 우선 한 덩어리 | C, C++, Objective-C(C 방식 배열), PL/I, Pascal |
| 열 우선 한 덩어리 | Fortran, MATLAB, R |
| 배열의 배열 | Java, C#, Scala, Swift |
| 리스트의 리스트 | Python |

배열의 배열을 일리프 벡터(Iliffe vector)라고도 부른다. 한 행의 원소는 이어서 놓지만 행끼리는 이어 놓지 않는다.

## 활용

- **이 기법을 쓸 자리.** 줄과 칸 두 번호를 번호 하나로 바꿔야 할 때다. 크기를 실행 중에 아는 표를 한 덩어리로 잡을 때, 격자의 칸에 일련번호를 붙일 때 쓴다.
- **훑는 순서.** 행 우선으로 놓인 표는 바깥 반복을 행, 안쪽 반복을 열로 돌려야 메모리를 앞에서부터 차례로 읽는다. 반대로 돌리면 $$c$$칸씩 건너뛰며 읽는다. 차례로 읽는 쪽이 유리한 까닭은 [지역성의 원리](/Hongs_Blog/studies/computer-architecture/locality-principle/)에 있다[^s2].
- **흔한 실수.** $$ic + j$$의 $$c$$ 자리에 행 수를 넣는다. 곱하는 수는 건너뛸 줄 하나의 길이다. 행 우선이면 열 수, 열 우선이면 행 수다. 한 덩어리를 빌리면서 한 행 분량만 빌리는 것도 흔하다. 3행 4열 표에 `malloc(sizeof(int) * 4)`를 쓰면 16바이트만 받는다. 12칸, 48바이트가 필요하니 `malloc(sizeof(int) * 3 * 4)`로 빌린다[^s2].
- 0이 많은 표는 다 담지 않는다: [특수 행렬을 1차원 배열에 담기](/Hongs_Blog/studies/data-structures/triangular-matrix-mapping/), [희소 행렬의 3원소 표현](/Hongs_Blog/studies/data-structures/sparse-matrix-triples/)
- 연습: [배열 위치 공식 예제 사다리](/Hongs_Blog/studies/data-structures/array-mapping-ladder/)

## 연결

- 선수: [배열과 포인터](/Hongs_Blog/studies/data-structures/array-pointer/), [동적 메모리 할당](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/)
- 자바의 2차원 배열을 그림으로 본 것: [배열](/Hongs_Blog/studies/java/java-array/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 5행 7열인 표에서 `x[3][4]`는 행 우선으로 이어 붙인 1차원 배열의 몇 번 칸인가? 열 우선이면 몇 번 칸인가?</summary>

**답:** 행 우선은 $$3 \times 7 + 4 = 25$$번 칸, 열 우선은 $$4 \times 5 + 3 = 23$$번 칸.<br>
**이유:** 행 우선은 앞에 있는 행 3개의 원소 수(행마다 7개)에 같은 행 안의 앞 칸 수 4를 더한다. 열 우선은 앞에 있는 열 4개의 원소 수(열마다 5개)에 같은 열 안의 위 칸 수 3을 더한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 3행 4열인 표를 배열의 배열로 놓을 때와 행 우선 한 덩어리로 놓을 때, 메모리 덩어리는 각각 몇 개이고 덤으로 드는 자리는 몇 바이트인가? 주소 하나와 정수 하나는 4바이트로 센다. 행마다 길이가 다른 표를 놓을 수 있는 쪽은 어디인가?</summary>

**답:** 배열의 배열: 덩어리 4개, 덤 12바이트. 한 덩어리: 덩어리 1개, 덤 8바이트. 행마다 길이가 달라도 되는 쪽은 배열의 배열이다.<br>
**이유:** 배열의 배열은 행 주소를 담는 길이 3짜리 배열이 덤이다($$3 \times 4$$). 한 덩어리는 시작 주소와 열 수만 적어 두면 된다($$4 + 4$$). 한 덩어리의 위치 식 $$ic + j$$는 모든 행이 같은 길이 $$c$$일 때만 맞는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 5행 7열인 표를 한 덩어리로 놓았다. 19번 칸은 행 우선이면 어느 `x[i][j]`인가? 열 우선이면 어느 것인가?</summary>

**답:** 행 우선이면 `x[2][5]`, 열 우선이면 `x[4][3]`.<br>
**이유:** 행 우선은 $$19 \div 7$$의 몫 2가 행, 나머지 5가 열이다. 열 우선은 $$19 \div 5$$의 몫 3이 열, 나머지 4가 행이다. 같은 번호라도 놓는 순서에 따라 다른 칸이다.

</details>


[^s1]: 구현 코드에서 모든 칸으로 확인했다.
[^s2]: 구현 코드에 같은 코드가 있고, 받은 덩어리 208개를 모두 돌려준 것을 세어 확인했다. 이 기계에서는 주소 하나가 8바이트라 3행짜리 배열의 배열의 덤은 24바이트다.
{% endraw %}
