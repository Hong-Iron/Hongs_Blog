---
layout: "note"
title: "09_java-string_impl.java"
display_title: "09_java-string_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "09"
course: "소프트웨어 프로젝트"
course_slug: "software-project"
course_url: "/studies/software-project/"
track: "컴퓨터 과학"
parent_url: "/studies/software-project/java-string/"
parent_title: "String"
description: "소프트웨어 프로젝트 · String 구현 코드"
permalink: "/studies/software-project/code/09_java-string_impl/"
---
{% raw %}
[String](/Hongs_Blog/studies/software-project/java-string/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 09_java-string_impl.java
// String 문서의 출력과 값을 확인한다.

import java.util.Arrays;
import java.util.Scanner;

class StringImpl {
    static void check(boolean ok, String what) {
        if (!ok) throw new AssertionError(what);
    }

    public static void main(String[] args) {
        // 1. 리터럴이 같으면 String 객체 하나를 같이 쓴다 (슬라이드 왼쪽 코드)
        String car1 = "Hyundai";
        String car2 = "KIA";
        String car3 = "KIA";
        check(car2 == car3, "같은 리터럴은 같은 객체");
        check(car1 != car2, "다른 리터럴은 다른 객체");

        // 2. new는 늘 새 객체를 만든다 (슬라이드 오른쪽 코드)
        String n1 = new String("Hyundai");
        String n2 = new String("KIA");
        String n3 = new String("KIA");
        check(n2 != n3, "new로 만들면 내용이 같아도 다른 객체");
        check(n2 != car2, "new로 만든 것은 리터럴 객체와도 다르다");
        check(n2.equals(n3) && n2.equals(car2), "equals는 글자를 비교한다");
        check(!n1.equals(n2), "글자가 다르면 equals는 false");
        check(n2.intern() == car2, "intern()은 리터럴 쪽 객체를 돌려준다");

        // 3. 실행 중에 만든 문자열은 리터럴과 글자가 같아도 다른 객체다
        String k = "K";
        String joined = k + "IA";
        check(joined.equals("KIA") && joined != car2, "변수로 이어 붙인 문자열");
        String constant = "K" + "IA";      // 리터럴끼리는 컴파일할 때 미리 붙인다
        check(constant == car2, "리터럴끼리 붙인 것은 같은 객체");
        Scanner scanner = new Scanner("KIA\n");
        String typed = scanner.nextLine();
        scanner.close();
        check(typed != car2 && typed.equals(car2), "입력받은 문자열은 == 로 비교하면 틀린다");
        check(!"kia".equals("KIA") && "kia".equalsIgnoreCase("KIA"), "대소문자");

        // 4. 주요 메서드 (슬라이드: "자바 프로그래밍")
        String subject = "자바 프로그래밍";
        check(subject.length() == 8, "길이 8 (빈칸 포함)");
        check(subject.charAt(0) == '자' && subject.charAt(2) == ' ' && subject.charAt(3) == '프', "charAt");
        check(subject.charAt(subject.length() - 1) == '밍', "마지막 글자");
        check(subject.indexOf("프로그래밍") == 3, "indexOf = 3");
        check(subject.indexOf("파이썬") == -1, "없으면 -1");
        check(subject.contains("자바") && !subject.contains("파이썬"), "contains");
        check(subject.substring(3).equals("프로그래밍"), "substring(3)");
        check(subject.substring(0, 2).equals("자바"), "substring(0, 2)");
        check(subject.substring(3, 5).equals("프로"), "substring(3, 5): 끝 번호는 빼고");
        check(subject.substring(8).equals(""), "substring(길이)는 빈 문자열");

        // 5. replace는 새 문자열을 돌려주고 원래 문자열은 그대로다
        String replaced = subject.replace("자바", "Java");
        check(replaced.equals("Java 프로그래밍"), "replace 결과");
        check(subject.equals("자바 프로그래밍"), "원래 문자열은 그대로");
        check(replaced != subject, "다른 객체");
        String up = "java";
        up.toUpperCase();                  // 결과를 받지 않으면 아무 일도 없다
        check(up.equals("java"), "결과를 받지 않은 toUpperCase");
        up = up.toUpperCase();
        check(up.equals("JAVA"), "결과를 다시 넣어야 한다");

        // 6. split
        String board = "번호,제목,내용,글쓴이";
        String[] arr = board.split(",");
        check(arr.length == 4, "네 조각");
        check(Arrays.equals(arr, new String[] {"번호", "제목", "내용", "글쓴이"}), "조각 내용");
        check(arr[3].equals("글쓴이") && !arr[3].equals("성명"), "arr[3]은 글쓴이");

        // 7. 범위를 벗어난 번호
        boolean threw = false;
        try {
            subject.charAt(8);
        } catch (StringIndexOutOfBoundsException e) {
            threw = true;
        }
        check(threw, "charAt(8)은 예외");

        // 8. 카드
        String a = "java";
        String b = "java";
        String c = new String("java");
        String d = c;
        check((a == b) && !(a == c) && a.equals(c) && (c == d), "카드 추적");
        String s = "hello world";
        check(s.substring(s.indexOf("w")).equals("world"), "world 잘라내기");
        check(s.substring(0, s.indexOf(" ")).equals("hello"), "hello 잘라내기");
        check(s.replace("l", "L").equals("heLLo worLd") && s.length() == 11, "replace는 모두 바꾼다");
        check("2026-10-11".split("-")[1].equals("10"), "날짜에서 달 꺼내기");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
