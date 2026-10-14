---
layout: "note"
title: "07_java-reference-types_impl.java"
display_title: "07_java-reference-types_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "07"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/java-reference-types/"
parent_title: "참조 타입과 메모리 영역"
description: "자바 프로그래밍 · 참조 타입과 메모리 영역 구현 코드"
sitemap: false
permalink: "/studies/java/code/07_java-reference-types_impl/"
---
{% raw %}
[참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 07_java-reference-types_impl.java
// 참조 타입과 메모리 영역 문서의 출력과 값을 확인한다.

class ReferenceTypesImpl {
    static int maxDepth = 0;

    static void check(boolean ok, String what) {
        if (!ok) throw new AssertionError(what);
    }

    // 슬라이드의 Calculator.add
    static int add(int a, int b) {
        int sum = a + b;
        return sum;
    }

    // 기본 타입 매개변수: 값이 복사되어 들어온다
    static void addTen(int n) {
        n += 10;
    }

    // 참조 타입 매개변수: 주소가 복사되어 들어온다. 같은 배열을 가리킨다
    static void addTenToFirst(int[] arr) {
        arr[0] += 10;
    }

    // 매개변수에 새 배열을 넣어도 부른 쪽 변수는 그대로다
    static void replace(int[] arr) {
        arr = new int[] {7, 7, 7};
        arr[0] = 100;
    }

    static void dive(int depth) {
        maxDepth = depth;
        dive(depth + 1);
    }

    static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        // 1. 기본 타입 변수는 값을 담는다. 대입하면 값이 복사된다
        int age = 20;
        int copy = age;
        copy = 30;
        check(age == 20 && copy == 30, "기본 타입은 서로 영향이 없다");

        // 2. 참조 타입 변수는 주소를 담는다. 대입하면 주소가 복사된다
        int[] p = {1, 2, 3};
        int[] q = p;
        q[0] = 99;
        check(p[0] == 99, "q로 고쳤는데 p로 봐도 99");
        check(p == q, "p와 q는 같은 배열을 가리킨다");
        q = new int[] {1, 2, 3};          // q만 새 배열을 가리키게 한다
        q[1] = -5;
        check(p[1] == 2 && p != q, "이제 p와 q는 다른 배열");

        // 3. 메서드를 부르면 스택에 프레임이 생기고, 끝나면 사라진다 (슬라이드 Calculator)
        int result = add(5, 3);
        check(("5 + 3 = " + result).equals("5 + 3 = 8"), "5 + 3 = 8");
        check(factorial(5) == 120, "재귀: 프레임 다섯 개가 쌓였다 풀린다");

        // 4. 메서드에 넘길 때도 같은 규칙이다
        int n = 5;
        addTen(n);
        check(n == 5, "기본 타입 인자는 바뀌지 않는다");
        int[] data = {5, 6};
        addTenToFirst(data);
        check(data[0] == 15, "배열 인자의 칸은 바뀐다");
        replace(data);
        check(data[0] == 15 && data.length == 2, "매개변수에 새 배열을 넣어도 원래 변수는 그대로");

        // 5. 스택은 끝이 있다. 끝없이 부르면 StackOverflowError
        boolean overflow = false;
        try {
            dive(1);
        } catch (StackOverflowError e) {
            overflow = true;
        }
        check(overflow && maxDepth > 500, "끝없는 재귀는 StackOverflowError (깊이 " + maxDepth + ")");

        // 6. 가리키는 변수가 없어진 객체는 쓰레기가 된다 (수거 시점은 JVM이 정한다)
        int[] big = new int[1000];
        big = null;                       // 이제 그 배열에 닿을 길이 없다
        check(big == null, "변수는 null");

        // 7. String도 참조 타입이다
        String name = "박은지";
        String same = name;
        check(same == name, "같은 String 객체를 가리킨다");

        // 8. 카드
        int[] a = {1, 2};
        int[] b = a;
        int[] c = {1, 2};
        b[1] = 9;
        c[0] = 7;
        check(a[0] == 1 && a[1] == 9, "카드: a = {1, 9}");
        int x = 3;
        int[] arr = {3};
        addTen(x);
        addTenToFirst(arr);
        check(x == 3 && arr[0] == 13, "카드: x = 3, arr[0] = 13");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
