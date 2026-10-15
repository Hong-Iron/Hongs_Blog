---
layout: "note"
title: "16_array-vs-linked-list_impl.c"
display_title: "16_array-vs-linked-list_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "16"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/array-vs-linked-list/"
parent_title: "배열과 연결 리스트 비교"
description: "자료구조 · 배열과 연결 리스트 비교 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/16_array-vs-linked-list_impl/"
---
{% raw %}
[배열과 연결 리스트 비교](/Hongs_Blog/studies/data-structures/array-vs-linked-list/) 문서의 구현 코드다.

```c
/* 배열과 연결 리스트 비교: 같은 일을 두 구조로 하면서 옮긴 원소 수와 따라간 링크 수를 센다.
 *
 * 문서: 1-2학기/자료구조/3.개념집/16.배열과 연결 리스트 비교.md
 * 실행: cc -std=c11 -Wall -Wextra 16_array-vs-linked-list_impl.c -o versus && ./versus
 *
 * 확인하는 것 (n = 1,000)
 *   1. 맨 앞에 n번 끼우기: 배열은 원소를 0 + 1 + ... + (n - 1) = n(n - 1)/2 = 499,500번 옮긴다.
 *      연결 리스트는 한 번도 옮기지 않고 링크만 2n = 2,000번 쓴다. 두 결과는 같은 순서다.
 *   2. k번 원소를 0번부터 n - 1번까지 한 번씩 읽기: 배열은 주소 계산 n번,
 *      연결 리스트는 링크를 n(n - 1)/2 = 499,500번 따라간다.
 *   3. 가운데 자리(앞 노드의 주소를 쥐고 있을 때)에 하나 끼우기: 배열 500번 옮김, 연결 리스트 링크 2번.
 *   4. 배열의 k번 칸 주소 = 시작 주소 + k * (칸 크기).
 *   5. 원소가 char일 때 필요한 바이트: 배열 n, 연결 리스트 n * sizeof(listNode).
 *   6. 배열은 정한 칸 수(여기서는 n)를 넘으면 못 넣는다. 연결 리스트는 그 뒤로도 넣는다.
 */
#include <stdio.h>
#include <stdlib.h>

static int failures = 0;
static void check(int ok, const char *what)
{
    if (!ok) { printf("FAIL: %s\n", what); failures++; }
}

#define N 1000

typedef struct listNode *listPointer;
typedef struct listNode {
    char data;
    listPointer link;
} listNode;

static long moves = 0;        /* 배열에서 원소를 옮긴 횟수 */
static long link_writes = 0;  /* 링크 칸에 값을 쓴 횟수 */
static long hops = 0;         /* 링크를 따라간 횟수 */
static long liveNodes = 0;

/* 배열: k번 칸에 끼운다. 뒤의 원소를 모두 한 칸씩 민다. 칸이 없으면 0 */
static int array_insert(char *a, int *n, int capacity, int k, char x)
{
    if (*n == capacity) return 0;
    for (int i = *n; i > k; i--) { a[i] = a[i - 1]; moves++; }
    a[k] = x;
    (*n)++;
    return 1;
}

/* 연결 리스트: 맨 앞에 끼운다 */
static void list_insert_front(listPointer *first, char x)
{
    listPointer node = malloc(sizeof(*node));
    if (node == NULL) { fprintf(stderr, "Insufficient memory\n"); exit(EXIT_FAILURE); }
    liveNodes++;
    node->data = x;
    node->link = *first;  link_writes++;
    *first = node;        link_writes++;
}

/* 연결 리스트: before 바로 뒤에 끼운다 */
static void list_insert_after(listPointer before, char x)
{
    listPointer node = malloc(sizeof(*node));
    if (node == NULL) { fprintf(stderr, "Insufficient memory\n"); exit(EXIT_FAILURE); }
    liveNodes++;
    node->data = x;
    node->link = before->link;  link_writes++;
    before->link = node;        link_writes++;
}

static listPointer list_at(listPointer first, int k)
{
    listPointer p = first;
    while (k > 0) { p = p->link; hops++; k--; }
    return p;
}

int main(void)
{
    static char a[N + 1];
    int n = 0;
    listPointer first = NULL;

    /* 1. 맨 앞에 N번 끼우기 */
    for (int i = 0; i < N; i++) {
        char x = (char)('a' + i % 26);
        check(array_insert(a, &n, N, 0, x) == 1, "배열: 맨 앞에 끼우기");
        list_insert_front(&first, x);
    }
    check(moves == (long)N * (N - 1) / 2 && moves == 499500, "배열: n(n - 1)/2 = 499,500번 옮김");
    check(link_writes == 2L * N && liveNodes == N, "연결 리스트: 링크 쓰기 2n = 2,000번, 옮김 0번");
    int same = 1;
    listPointer p = first;
    for (int i = 0; i < N; i++, p = p->link) if (p == NULL || p->data != a[i]) { same = 0; break; }
    check(same && p == NULL, "두 구조에 든 순서가 같다");
    printf("  맨 앞에 %d번 끼우기: 배열은 원소 %ld번 옮김, 연결 리스트는 링크 %ld번 씀\n", N, moves, link_writes);

    /* 2. k번 원소를 모두 한 번씩 읽기 */
    long address_computations = 0;
    int reads_match = 1;
    for (int k = 0; k < N; k++) {
        char from_array = a[k];  address_computations++;      /* 시작 주소 + k: 계산 한 번 */
        char from_list = list_at(first, k)->data;
        if (from_array != from_list) reads_match = 0;
    }
    check(reads_match, "k번 읽기: 두 구조의 값이 같다");
    check(address_computations == N && hops == (long)N * (N - 1) / 2, "읽기: 배열 n번 계산, 연결 리스트 n(n - 1)/2번 따라감");
    printf("  k번 원소를 %d개 모두 읽기: 배열은 주소 계산 %ld번, 연결 리스트는 링크 %ld번 따라감\n", N, address_computations, hops);

    /* 4. 주소 계산 */
    int addr_ok = 1;
    for (int k = 0; k < N; k++)
        if ((char *)&a[k] != (char *)a + (size_t)k * sizeof(a[0])) addr_ok = 0;
    int ia[8];
    for (int k = 0; k < 8; k++)
        if ((char *)&ia[k] != (char *)ia + (size_t)k * sizeof(int)) addr_ok = 0;
    check(addr_ok, "배열: k번 칸 주소 = 시작 주소 + k * 칸 크기");

    /* 6. 배열은 정한 칸 수까지만 */
    check(array_insert(a, &n, N, 0, 'z') == 0 && n == N, "배열: 칸 수 n을 넘으면 못 넣는다");

    /* 3. 가운데에 하나 끼우기 (앞 노드의 주소를 이미 쥐고 있다) */
    static char b[N + 1];
    int bn = 0;
    for (int i = 0; i < N; i++) b[bn++] = a[i];
    listPointer middle = list_at(first, N / 2 - 1);      /* 499번 노드. 찾는 값은 세지 않는다 */
    moves = 0; link_writes = 0;
    check(array_insert(b, &bn, N + 1, N / 2, '!') == 1 && moves == N / 2, "가운데 끼우기: 배열은 500번 옮김");
    list_insert_after(middle, '!');
    check(link_writes == 2 && liveNodes == N + 1, "가운데 끼우기: 연결 리스트는 링크 2번(배열이 가득 찬 뒤에도 들어간다)");
    check(b[N / 2] == '!' && middle->link->data == '!' && middle->link->link->data == a[N / 2], "끼운 자리가 같다");
    printf("  가운데에 하나 끼우기: 배열은 원소 %ld번 옮김, 연결 리스트는 링크 %ld번 씀\n", moves, link_writes);

    /* 5. 메모리 */
    size_t array_bytes = (size_t)N * sizeof(char), list_bytes = (size_t)N * sizeof(listNode);
    check(sizeof(listNode) >= sizeof(char) + sizeof(listPointer), "노드 = 원소 + 링크(+ 맞춤 빈칸)");
    check(list_bytes > array_bytes, "같은 원소 수면 연결 리스트가 더 많이 쓴다");
    printf("  char %d개: 배열 %zu바이트, 연결 리스트 %zu바이트 (노드 하나 %zu바이트, 포인터 %zu바이트)\n",
           N, array_bytes, list_bytes, sizeof(listNode), sizeof(listPointer));
    if (sizeof(listPointer) == 8)
        check(sizeof(listNode) == 16 && list_bytes == 16000, "64비트: 노드 하나 16바이트, 1,000개면 16,000바이트");

    while (first != NULL) { listPointer d = first; first = first->link; free(d); liveNodes--; }
    check(liveNodes == 0, "malloc 횟수 = free 횟수");

    if (failures) { printf("%d개 실패\n", failures); return 1; }
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
