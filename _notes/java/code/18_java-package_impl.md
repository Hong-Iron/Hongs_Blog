---
layout: "note"
title: "18_java-package_impl.java"
display_title: "18_java-package_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "18"
course: "자바"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
parent_url: "/studies/java/java-package/"
parent_title: "패키지"
description: "자바 · 패키지 구현 코드"
permalink: "/studies/java/code/18_java-package_impl/"
---
{% raw %}
[패키지](/Hongs_Blog/studies/java/java-package/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 18_java-package_impl.java
// (JDK 21. 파일 이름이 숫자로 시작해 public 클래스를 두지 않는다. 맨 위 클래스의 main이 돈다.)
// 문서 「패키지」에서 파일 하나로 확인할 수 있는 것만 확인한다.
// 패키지를 여러 개 만드는 실험(com.mycompany.Car, com.yourcompany.Car)은 파일이 여럿 필요해
// 문서에 명령과 결과를 적었다.

import java.util.Arrays;

class PackageCheck {
    // 클래스의 전체 이름 = 패키지 이름 + 클래스 이름
    static void fullNames() {
        System.out.println(String.class.getName());
        System.out.println(Arrays.class.getName());
        System.out.println(Arrays.class.getPackageName());
        System.out.println(Arrays.class.getSimpleName());
    }

    // 이름이 같은 클래스 둘을 패키지가 가른다
    static void sameSimpleName() {
        Class<?> a = java.util.Date.class;
        Class<?> b = java.sql.Date.class;
        System.out.println(a.getSimpleName().equals(b.getSimpleName()));
        System.out.println(a.getName());
        System.out.println(b.getName());
        System.out.println(a == b);
    }

    // import한 이름과 전체 이름은 같은 클래스다
    static void importOrFullName() {
        int[] grades = {90, 85, 88};
        System.out.println(Arrays.toString(grades));
        System.out.println(java.util.Arrays.toString(grades));
    }

    // package 선언이 없는 클래스는 이름 없는 패키지에 들어간다
    static void unnamed() {
        System.out.println("[" + PackageCheck.class.getPackageName() + "]");
    }

    public static void main(String[] args) {
        check("full names", capture(PackageCheck::fullNames),
              "java.lang.String\njava.util.Arrays\njava.util\nArrays\n");
        check("same simple name", capture(PackageCheck::sameSimpleName),
              "true\njava.util.Date\njava.sql.Date\nfalse\n");
        check("import or full name", capture(PackageCheck::importOrFullName),
              "[90, 85, 88]\n[90, 85, 88]\n");
        check("unnamed package", capture(PackageCheck::unnamed), "[]\n");
        System.out.println("ALL CHECKS PASSED");
    }

    static String capture(Runnable r) {
        java.io.PrintStream old = System.out;
        java.io.ByteArrayOutputStream buf = new java.io.ByteArrayOutputStream();
        System.setOut(new java.io.PrintStream(buf));
        try { r.run(); } finally { System.setOut(old); }
        return buf.toString();
    }

    static void check(String name, String got, String want) {
        if (!got.equals(want)) throw new AssertionError(name + "\n--- got ---\n" + got + "--- want ---\n" + want);
        System.out.print("[" + name + "]\n" + got);
    }
}
```
{% endraw %}
