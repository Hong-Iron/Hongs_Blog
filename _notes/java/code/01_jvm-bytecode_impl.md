---
layout: "note"
title: "01_jvm-bytecode_impl.java"
display_title: "01_jvm-bytecode_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "01"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/jvm-bytecode/"
parent_title: "JVM과 바이트코드"
description: "자바 프로그래밍 · JVM과 바이트코드 구현 코드"
sitemap: false
permalink: "/studies/java/code/01_jvm-bytecode_impl/"
---
{% raw %}
[JVM과 바이트코드](/Hongs_Blog/studies/java/jvm-bytecode/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 01_jvm-bytecode_impl.java
// JVM과 바이트코드 문서의 주장을 확인한다. public 클래스가 없어 파일 이름과 클래스 이름이 달라도 된다.

import java.io.InputStream;

class JvmBytecodeImpl {
    static void check(boolean ok, String what) {
        if (!ok) throw new AssertionError(what);
    }

    static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) throws Exception {
        // 1. 이 프로그램을 돌리는 것은 JVM이다. 버전과 이름을 물어볼 수 있다.
        String version = System.getProperty("java.version");
        String vmName = System.getProperty("java.vm.name");
        check(version.startsWith("21"), "JDK 21에서 실행한다: " + version);
        check(vmName != null && !vmName.isEmpty(), "JVM 이름이 있다");

        // 2. 소스는 먼저 바이트코드(.class 내용)로 바뀐다. 바이트코드 파일은 늘 CA FE BA BE 네 바이트로 시작한다.
        try (InputStream in = JvmBytecodeImpl.class.getResourceAsStream("JvmBytecodeImpl.class")) {
            check(in != null, "클래스의 바이트코드를 읽을 수 있다");
            byte[] head = in.readNBytes(4);
            String hex = String.format("%02X%02X%02X%02X", head[0], head[1], head[2], head[3]);
            check(hex.equals("CAFEBABE"), "바이트코드의 첫 네 바이트: " + hex);
        }

        // 3. 같은 바이트코드는 어느 운영체제의 JVM에서도 같은 답을 낸다. 운영체제 이름만 다르다.
        String os = System.getProperty("os.name");
        check(os != null, "운영체제 이름: " + os);
        check(add(5, 3) == 8, "5 + 3 = 8");

        // 4. 슬라이드의 Hello 프로그램이 찍는 글자
        String hello = "Hello, Java";
        check(hello.length() == 11, "Hello, Java는 11글자");

        System.out.println(hello);
        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
