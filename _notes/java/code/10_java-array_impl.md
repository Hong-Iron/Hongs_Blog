---
layout: "note"
title: "10_java-array_impl.java"
display_title: "10_java-array_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "10"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/java-array/"
parent_title: "배열"
description: "자바 프로그래밍 · 배열 구현 코드"
sitemap: false
permalink: "/studies/java/code/10_java-array_impl/"
---
{% raw %}
[배열](/Hongs_Blog/studies/java/java-array/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 10_java-array_impl.java
// 배열 문서의 출력과 값을 확인한다.

import java.util.Arrays;

class ArrayImpl {
    static void check(boolean ok, String what) {
        if (!ok) throw new AssertionError(what);
    }

    // 슬라이드의 "java Sum 10 20": 실행할 때 준 글자들이 String[] args로 들어온다
    static int sumArgs(String[] args) {
        int sum = 0;
        for (String arg : args) {
            sum += Integer.parseInt(arg);
        }
        return sum;
    }

    public static void main(String[] args) {
        // 1. 선언하는 두 모양
        int[] numbers1;
        int numbers2[];
        numbers1 = null;                   // 가리킬 배열이 없으면 null
        check(numbers1 == null, "null로 둘 수 있다");

        // 2. 값 목록으로 만들기
        int[] score = {83, 90, 87, 93, 78};
        check(score.length == 5, "길이 5");
        check(score[0] == 83 && score[4] == 78, "첫 칸과 마지막 칸");
        check(score[score.length - 1] == 78, "마지막 칸은 length - 1");
        score[1] = 95;
        check(score[1] == 95, "칸에 값 넣기");
        // 선언과 따로 넣을 때는 new 타입[] 을 붙인다
        numbers2 = new int[] {1, 2, 3};
        check(numbers2.length == 3, "new int[]{...}");

        // 3. new로 만들면 기본값으로 채워진다
        check((new byte[1])[0] == 0 && (new short[1])[0] == 0 && (new int[1])[0] == 0 && (new long[1])[0] == 0L, "정수 0");
        check((new char[1])[0] == '\u0000', "char \\u0000");
        check((new float[1])[0] == 0.0f && (new double[1])[0] == 0.0, "실수 0.0");
        check((new boolean[1])[0] == false, "boolean false");
        check((new String[1])[0] == null, "참조 타입 null");
        int[] empty = new int[3];
        check(Arrays.toString(empty).equals("[0, 0, 0]"), "new int[3]");

        // 4. 범위를 벗어난 번호
        boolean threw = false;
        String msg = "";
        try {
            int v = score[5];
        } catch (ArrayIndexOutOfBoundsException e) {
            threw = true;
            msg = e.getMessage();
        }
        check(threw && msg.equals("Index 5 out of bounds for length 5"), "범위 밖: " + msg);

        // 5. 2차원 배열: 배열의 칸마다 배열의 주소가 들어 있다
        int[][] scores = {
            {80, 92, 96},
            {76, 88}
        };
        check(scores.length == 2, "반의 수 2");
        check(scores[0].length == 3 && scores[1].length == 2, "반마다 길이가 다를 수 있다");
        check(scores[0][2] == 96 && scores[1][0] == 76, "칸 읽기");
        int[][] grid = new int[2][3];
        check(Arrays.deepToString(grid).equals("[[0, 0, 0], [0, 0, 0]]"), "new int[2][3]");
        int[][] jag = new int[2][];
        check(jag[0] == null && jag[1] == null, "안쪽을 안 만들면 null");
        jag[0] = new int[3];
        jag[1] = new int[1];
        check(jag[0].length == 3 && jag[1].length == 1, "안쪽을 따로 만들기");
        int total = 0;
        for (int i = 0; i < scores.length; i++) {
            for (int j = 0; j < scores[i].length; j++) {
                total += scores[i][j];
            }
        }
        check(total == 432, "모든 점수의 합 432");

        // 6. 참조 타입 배열 (슬라이드 strArray)
        String[] strArray = new String[3];
        check(strArray[0] == null, "처음에는 null");
        strArray[0] = "Java";
        strArray[1] = "C++";
        strArray[2] = "C#";
        check(Arrays.toString(strArray).equals("[Java, C++, C#]"), "strArray");
        String[] langs = {"Java", "Java", new String("Java")};
        check(langs[0] == langs[1] && langs[0] != langs[2] && langs[0].equals(langs[2]), "칸에는 주소가 들어 있다");

        // 7. 복사: 대입은 주소만 복사한다
        int[] src = {1, 2, 3};
        int[] alias = src;
        alias[0] = 100;
        check(src[0] == 100, "대입은 같은 배열을 가리킨다");
        src[0] = 1;
        // (a) for로 한 칸씩
        int[] c1 = new int[5];
        for (int i = 0; i < src.length; i++) {
            c1[i] = src[i];
        }
        check(Arrays.toString(c1).equals("[1, 2, 3, 0, 0]"), "for 복사");
        // (b) System.arraycopy(원본, 원본 시작, 대상, 대상 시작, 개수)
        int[] c2 = new int[5];
        System.arraycopy(src, 0, c2, 1, 3);
        check(Arrays.toString(c2).equals("[0, 1, 2, 3, 0]"), "arraycopy");
        // (c) Arrays.copyOf(원본, 새 길이)
        int[] c3 = Arrays.copyOf(src, 5);
        check(Arrays.toString(c3).equals("[1, 2, 3, 0, 0]"), "copyOf");
        c3[0] = -1;
        check(src[0] == 1, "복사본을 고쳐도 원본은 그대로");
        // 참조 타입 배열과 2차원 배열은 주소만 복사된다
        int[][] m = {{1, 2}, {3, 4}};
        int[][] m2 = Arrays.copyOf(m, 2);
        m2[0][0] = 99;
        check(m[0][0] == 99 && m != m2 && m[0] == m2[0], "2차원 배열의 얕은 복사");

        // 8. 향상된 for
        int sum = 0;
        for (int s : score) {
            sum += s;
        }
        check(sum == 83 + 95 + 87 + 93 + 78, "향상된 for의 합 436");
        check(sum == 436, "436");
        int[] twice = {1, 2, 3};
        for (int v : twice) {
            v = v * 2;                     // v는 복사본이다. 배열은 바뀌지 않는다
        }
        check(Arrays.toString(twice).equals("[1, 2, 3]"), "향상된 for로는 칸을 못 고친다");
        for (int i = 0; i < twice.length; i++) {
            twice[i] = twice[i] * 2;
        }
        check(Arrays.toString(twice).equals("[2, 4, 6]"), "번호로 돌아야 고친다");
        int rowSum = 0;
        for (int[] row : scores) {
            for (int v : row) {
                rowSum += v;
            }
        }
        check(rowSum == 432, "2차원 향상된 for");

        // 9. main의 String[] args
        check(sumArgs(new String[] {"10", "20"}) == 30, "java Sum 10 20 -> 30");
        check(args.length == 0, "인자 없이 실행하면 길이 0 배열 (null이 아니다)");

        // 10. 카드
        int[] a = {3, 1, 4, 1, 5};
        int max = a[0];
        for (int i = 1; i < a.length; i++) {
            if (a[i] > max) max = a[i];
        }
        check(max == 5, "최댓값 5");
        int[][] t = new int[3][];
        t[0] = new int[] {1};
        t[1] = new int[] {1, 2};
        check(t.length == 3 && t[1].length == 2 && t[2] == null, "카드 추적");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
