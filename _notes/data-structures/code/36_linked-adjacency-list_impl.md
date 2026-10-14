---
layout: "note"
title: "36_linked-adjacency-list_impl.c"
display_title: "36_linked-adjacency-list_impl.c"
kind: "code"
kind_label: "코드 · 구현"
num: "36"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/linked-adjacency-list/"
parent_title: "연결 인접 리스트와 배열 인접 리스트"
description: "자료구조 · 연결 인접 리스트와 배열 인접 리스트 구현 코드"
sitemap: false
permalink: "/studies/data-structures/code/36_linked-adjacency-list_impl/"
---
{% raw %}
[연결 인접 리스트와 배열 인접 리스트](/Hongs_Blog/studies/data-structures/linked-adjacency-list/) 문서의 구현 코드다.

```c
/* 연결 인접 리스트와 배열 인접 리스트: 구현과 자체 테스트.
 *
 * 문서: 1-2학기/자료구조/3.개념집/36.연결 인접 리스트와 배열 인접 리스트.md
 * 출처: 자료구조 10주차 슬라이드 p.40~48. 슬라이드에는 그림과 개수만 있고 코드는 없다.
 *       아래 코드는 그 그림을 옮긴 것이다(에이전트 보충).
 * 실행: cc -std=c11 -Wall -Wextra 36_linked-adjacency-list_impl.c -o adj && ./adj
 * 정점 번호는 슬라이드처럼 1부터 n까지다. 배열의 0번 칸은 쓰지 않는다.
 *
 * 확인하는 것
 *   1. 슬라이드의 무방향 그래프(1-2, 1-4, 2-5, 3-5, 4-5): 체인이 (2,4) (1,5) (5) (5,1) (2,4,3),
 *      체인 노드 수 10 = 2 x 간선 5, 인접 행렬이 슬라이드 표와 같고 대칭이며 대각선이 0.
 *   2. 슬라이드의 방향 그래프(1->4, 2->1, 2->5, 4->5, 5->2, 5->3): 체인 노드 수 6 = 간선 수, 행렬이 표와 같다.
 *   3. 배열 인접 리스트: 원소 수가 체인 노드 수와 같고 순서도 같다.
 *   4. 행렬의 아래 삼각만 비트로 담기: n = 5이면 25비트 대신 10비트, 모든 (i, j)에서 행렬과 같은 답.
 *   5. 차수 구하기: 행렬은 한 줄 n칸을 다 보고, 리스트는 그 정점의 이웃 수만큼만 본다.
 *   6. 무작위 그래프 500개(n = 1 ~ 8, 무방향·방향): 행렬 -> 체인 -> 행렬, 행렬 -> 배열 리스트 -> 행렬이 제자리로 돌아오고,
 *      노드 수가 무방향 2e, 방향 e다. 차수의 합도 2e다.
 *   7. malloc 횟수와 free 횟수가 같다.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define CHECK(cond, msg) \
    do { if (!(cond)) { fprintf(stderr, "[FAIL] %s (line %d)\n", msg, __LINE__); exit(1); } } while (0)

#define MAXN 8

static long liveBlocks;   /* malloc 횟수 - free 횟수 */
static long cellsLooked;  /* 차수를 구하며 본 칸(또는 노드) 수 */

static void *xmalloc(size_t size)
{
    void *p = malloc(size ? size : 1);
    if (p == NULL) { fprintf(stderr, "메모리가 모자란다\n"); exit(1); }
    liveBlocks++;
    return p;
}

static void xfree(void *p) { free(p); liveBlocks--; }

/* ---- 연결 인접 리스트: 정점마다 체인 하나 ---- */

typedef struct node *nodePointer;
typedef struct node {
    int vertex;          /* 이웃 정점 번호 */
    nodePointer link;    /* 같은 체인의 다음 노드 */
} node;

typedef struct {
    int n;               /* 정점 수 */
    nodePointer *aList;  /* aList[1 .. n]: 정점 i의 체인 첫 노드 */
} linkedGraph;

linkedGraph *createLinkedGraph(int n)
{
    linkedGraph *g = xmalloc(sizeof(*g));
    g->n = n;
    g->aList = xmalloc((size_t)(n + 1) * sizeof(nodePointer));
    for (int i = 0; i <= n; i++) g->aList[i] = NULL;
    return g;
}

/* u의 체인 맨 앞에 v를 끼운다: 방향 간선 u -> v 하나에 노드 하나 */
void addArc(linkedGraph *g, int u, int v)
{
    nodePointer p = xmalloc(sizeof(*p));
    p->vertex = v;
    p->link = g->aList[u];
    g->aList[u] = p;
}

/* 무방향 간선 u - v: 양쪽 체인에 하나씩, 노드 둘 */
void addEdge(linkedGraph *g, int u, int v)
{
    addArc(g, u, v);
    addArc(g, v, u);
}

int listDegree(const linkedGraph *g, int u)
{
    int d = 0;
    for (nodePointer p = g->aList[u]; p; p = p->link) { d++; cellsLooked++; }
    return d;
}

long countChainNodes(const linkedGraph *g)
{
    long count = 0;
    for (int i = 1; i <= g->n; i++)
        for (nodePointer p = g->aList[i]; p; p = p->link) count++;
    return count;
}

void destroyLinkedGraph(linkedGraph *g)
{
    for (int i = 1; i <= g->n; i++) {
        nodePointer p = g->aList[i];
        while (p) { nodePointer next = p->link; xfree(p); p = next; }
    }
    xfree(g->aList);
    xfree(g);
}

/* ---- 배열 인접 리스트: 정점마다 길이를 아는 배열 하나 ---- */

typedef struct {
    int n;
    int *length;   /* length[i]: 정점 i의 이웃 수 */
    int **aList;   /* aList[i][0 .. length[i]-1]: 정점 i의 이웃 */
} arrayGraph;

/* 체인을 두 번 훑는다: 한 번은 길이를 세고, 한 번은 옮겨 적는다 */
arrayGraph *toArrayGraph(const linkedGraph *g)
{
    arrayGraph *a = xmalloc(sizeof(*a));
    a->n = g->n;
    a->length = xmalloc((size_t)(g->n + 1) * sizeof(int));
    a->aList = xmalloc((size_t)(g->n + 1) * sizeof(int *));
    a->length[0] = 0;
    a->aList[0] = NULL;
    for (int i = 1; i <= g->n; i++) {
        int len = 0;
        for (nodePointer p = g->aList[i]; p; p = p->link) len++;
        a->length[i] = len;
        a->aList[i] = xmalloc((size_t)len * sizeof(int));
        int k = 0;
        for (nodePointer p = g->aList[i]; p; p = p->link) a->aList[i][k++] = p->vertex;
    }
    return a;
}

void destroyArrayGraph(arrayGraph *a)
{
    for (int i = 1; i <= a->n; i++) xfree(a->aList[i]);
    xfree(a->aList);
    xfree(a->length);
    xfree(a);
}

/* ---- 인접 행렬과 아래 삼각 비트 ---- */

typedef unsigned char matrix[MAXN + 1][MAXN + 1];

int matrixDegree(matrix m, int n, int u)
{
    int d = 0;
    for (int j = 1; j <= n; j++) { d += m[u][j]; cellsLooked++; }
    return d;
}

/* 무방향 그래프의 행렬에서 i > j인 칸만 한 줄로 세운다: (i, j) -> (i-1)(i-2)/2 + (j-1)번 비트 */
static int triIndex(int i, int j) { return (i - 1) * (i - 2) / 2 + (j - 1); }

static int triBitCount(int n) { return n * (n - 1) / 2; }

unsigned char *packLowerTriangle(matrix m, int n)
{
    int bits = triBitCount(n);
    unsigned char *b = xmalloc((size_t)(bits + 7) / 8);
    memset(b, 0, (size_t)(bits + 7) / 8);
    for (int i = 2; i <= n; i++)
        for (int j = 1; j < i; j++)
            if (m[i][j]) b[triIndex(i, j) / 8] |= (unsigned char)(1u << (triIndex(i, j) % 8));
    return b;
}

int triGet(const unsigned char *b, int i, int j)
{
    if (i == j) return 0;                       /* 대각선은 늘 0이라 담지 않는다 */
    if (i < j) { int tmp = i; i = j; j = tmp; } /* 대칭이라 위쪽 칸은 아래쪽 칸과 같다 */
    return (b[triIndex(i, j) / 8] >> (triIndex(i, j) % 8)) & 1;
}

/* ---- 테스트용 도구 ---- */

static void linkedToMatrix(const linkedGraph *g, matrix m)
{
    memset(m, 0, sizeof(matrix));
    for (int i = 1; i <= g->n; i++)
        for (nodePointer p = g->aList[i]; p; p = p->link) m[i][p->vertex] = 1;
}

static void arrayToMatrix(const arrayGraph *a, matrix m)
{
    memset(m, 0, sizeof(matrix));
    for (int i = 1; i <= a->n; i++)
        for (int k = 0; k < a->length[i]; k++) m[i][a->aList[i][k]] = 1;
}

static int chainIs(const linkedGraph *g, int u, const int *want, int count)
{
    nodePointer p = g->aList[u];
    for (int k = 0; k < count; k++, p = p->link)
        if (p == NULL || p->vertex != want[k]) return 0;
    return p == NULL;
}

static int rowIs(matrix m, int i, const char *bits, int n)
{
    for (int j = 1; j <= n; j++) if (m[i][j] != (unsigned char)(bits[j - 1] - '0')) return 0;
    return 1;
}

static unsigned long long seed = 20261012ULL;
static unsigned rnd(void)
{
    seed = seed * 6364136223846793005ULL + 1442695040888963407ULL;
    return (unsigned)(seed >> 33);
}

int main(void)
{
    matrix m, back;

    /* 1. 슬라이드의 무방향 그래프 (p.41~42, 45~47) */
    linkedGraph *g = createLinkedGraph(5);
    addEdge(g, 1, 4); addEdge(g, 3, 5); addEdge(g, 4, 5); addEdge(g, 2, 5); addEdge(g, 1, 2);
    int c1[] = {2, 4}, c2[] = {1, 5}, c3[] = {5}, c4[] = {5, 1}, c5[] = {2, 4, 3};
    CHECK(chainIs(g, 1, c1, 2) && chainIs(g, 2, c2, 2) && chainIs(g, 3, c3, 1)
          && chainIs(g, 4, c4, 2) && chainIs(g, 5, c5, 3), "체인이 슬라이드 p.46과 같다");
    CHECK(countChainNodes(g) == 10, "체인 노드 수 = 2 x 5 = 10");
    linkedToMatrix(g, m);
    CHECK(rowIs(m, 1, "01010", 5) && rowIs(m, 2, "10001", 5) && rowIs(m, 3, "00001", 5)
          && rowIs(m, 4, "10001", 5) && rowIs(m, 5, "01110", 5), "행렬이 슬라이드 p.41과 같다");
    for (int i = 1; i <= 5; i++) {
        CHECK(m[i][i] == 0, "대각선은 0");
        for (int j = 1; j <= 5; j++) CHECK(m[i][j] == m[j][i], "무방향 그래프의 행렬은 대칭");
    }
    printf("[OK] 무방향 그래프: 체인 (2,4) (1,5) (5) (5,1) (2,4,3), 노드 10개 = 2 x 간선 5, 행렬은 대칭\n");

    /* 3. 배열 인접 리스트 */
    arrayGraph *a = toArrayGraph(g);
    int total = 0;
    for (int i = 1; i <= 5; i++) total += a->length[i];
    CHECK(total == 10, "배열 리스트의 원소 수 = 10");
    CHECK(a->length[5] == 3 && a->aList[5][0] == 2 && a->aList[5][1] == 4 && a->aList[5][2] == 3, "aList[5] = (2, 4, 3)");
    arrayToMatrix(a, back);
    CHECK(memcmp(m, back, sizeof(matrix)) == 0, "배열 리스트도 같은 그래프");
    printf("[OK] 배열 인접 리스트: 원소 10개, aList[5] = (2, 4, 3). 노드 하나 %zu바이트, 배열 원소 하나 %zu바이트\n",
           sizeof(node), sizeof(int));

    /* 4. 아래 삼각 비트 */
    unsigned char *tri = packLowerTriangle(m, 5);
    CHECK(5 * 5 == 25 && triBitCount(5) == 10, "n = 5: 25비트 대 10비트");
    for (int i = 1; i <= 5; i++)
        for (int j = 1; j <= 5; j++) CHECK(triGet(tri, i, j) == m[i][j], "삼각 비트 = 행렬");
    CHECK(triIndex(2, 1) == 0 && triIndex(3, 1) == 1 && triIndex(3, 2) == 2 && triIndex(5, 4) == 9, "비트 번호");
    xfree(tri);
    printf("[OK] 아래 삼각만 담기: 25비트 대신 10비트, (2,1) (3,1) (3,2) ... (5,4)가 0 ~ 9번 비트\n");

    /* 5. 차수 구하기 */
    cellsLooked = 0;
    CHECK(matrixDegree(m, 5, 5) == 3 && cellsLooked == 5, "행렬: 정점 5의 차수 3, 5칸을 본다");
    cellsLooked = 0;
    CHECK(listDegree(g, 5) == 3 && cellsLooked == 3, "리스트: 정점 5의 차수 3, 노드 3개를 본다");
    cellsLooked = 0;
    CHECK(matrixDegree(m, 5, 3) == 1 && cellsLooked == 5, "행렬: 정점 3의 차수 1, 그래도 5칸을 본다");
    cellsLooked = 0;
    CHECK(listDegree(g, 3) == 1 && cellsLooked == 1, "리스트: 정점 3의 차수 1, 노드 1개만 본다");
    destroyArrayGraph(a);
    destroyLinkedGraph(g);
    printf("[OK] 차수: 행렬은 늘 n = 5칸, 리스트는 이웃 수만큼(정점 5는 3개, 정점 3은 1개)\n");

    /* 2. 슬라이드의 방향 그래프 (p.43) */
    g = createLinkedGraph(5);
    addArc(g, 1, 4); addArc(g, 2, 1); addArc(g, 2, 5); addArc(g, 4, 5); addArc(g, 5, 2); addArc(g, 5, 3);
    CHECK(countChainNodes(g) == 6, "방향 그래프: 체인 노드 수 = 간선 수 6");
    linkedToMatrix(g, m);
    CHECK(rowIs(m, 1, "00010", 5) && rowIs(m, 2, "10001", 5) && rowIs(m, 3, "00000", 5)
          && rowIs(m, 4, "00001", 5) && rowIs(m, 5, "01100", 5), "행렬이 슬라이드 p.43과 같다");
    CHECK(m[1][4] == 1 && m[4][1] == 0, "방향 그래프의 행렬은 대칭이 아닐 수 있다");
    destroyLinkedGraph(g);
    printf("[OK] 방향 그래프: 체인 노드 6개 = 간선 6, 행렬은 대칭이 아니다\n");

    /* 6. 무작위 그래프 */
    for (int trial = 0; trial < 500; trial++) {
        int n = 1 + (int)(rnd() % MAXN);
        int directed = (int)(rnd() % 2);
        long e = 0;
        memset(m, 0, sizeof(matrix));
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++) {
                if (i == j) continue;
                if (!directed && j < i) continue;
                if (rnd() % 3 == 0) {
                    m[i][j] = 1; e++;
                    if (!directed) m[j][i] = 1;
                }
            }
        g = createLinkedGraph(n);
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++) {
                if (!m[i][j]) continue;
                if (directed) addArc(g, i, j);
                else if (i < j) addEdge(g, i, j);
            }
        CHECK(countChainNodes(g) == (directed ? e : 2 * e), "노드 수: 무방향 2e, 방향 e");
        linkedToMatrix(g, back);
        CHECK(memcmp(m, back, sizeof(matrix)) == 0, "행렬 -> 체인 -> 행렬");
        a = toArrayGraph(g);
        arrayToMatrix(a, back);
        CHECK(memcmp(m, back, sizeof(matrix)) == 0, "행렬 -> 배열 리스트 -> 행렬");
        long degreeSum = 0;
        for (int i = 1; i <= n; i++) {
            CHECK(listDegree(g, i) == matrixDegree(m, n, i) && a->length[i] == listDegree(g, i), "세 표현의 차수가 같다");
            degreeSum += a->length[i];
        }
        if (!directed) {
            CHECK(degreeSum == 2 * e, "무방향: 차수의 합 = 2e");
            tri = packLowerTriangle(m, n);
            for (int i = 1; i <= n; i++)
                for (int j = 1; j <= n; j++) CHECK(triGet(tri, i, j) == m[i][j], "삼각 비트 = 행렬");
            xfree(tri);
        }
        destroyArrayGraph(a);
        destroyLinkedGraph(g);
    }
    printf("[OK] 무작위 그래프 500개: 세 표현이 서로 오가고, 노드 수는 무방향 2e, 방향 e\n");

    /* 7. 누수 없음 */
    CHECK(liveBlocks == 0, "malloc 횟수 = free 횟수");
    printf("[OK] malloc 횟수와 free 횟수가 같다\n");
    printf("ALL CHECKS PASSED\n");
    return 0;
}
```
{% endraw %}
