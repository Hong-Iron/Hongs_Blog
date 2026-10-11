---
layout: "note"
title: "06_java-control-flow_impl.java"
display_title: "06_java-control-flow_impl.java"
kind: "code"
kind_label: "코드 · 구현"
num: "06"
course: "자바 프로그래밍"
course_slug: "java"
course_url: "/studies/java/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/java/java-control-flow/"
parent_title: "제어문"
description: "자바 프로그래밍 · 제어문 구현 코드"
permalink: "/studies/java/code/06_java-control-flow_impl/"
---
{% raw %}
[제어문](/Hongs_Blog/studies/java/java-control-flow/) 문서의 구현 코드다.

```java
// 실행: docker run --rm -v "$PWD":/w -w /w eclipse-temurin:21-jdk java 06_java-control-flow_impl.java
// 제어문 문서의 출력과 실행 추적을 확인한다.

class ControlFlowImpl {
    static void check(boolean ok, String what) {
        if (!ok) throw new AssertionError(what);
    }

    static String grade(int score) {
        if (score >= 90) {
            return "A";
        } else if (score >= 80) {
            return "B";
        } else {
            return "C";
        }
    }

    // break를 다 넣은 switch
    static String withBreak(int n) {
        String out = "";
        switch (n) {
            case 1:
                out += "one ";
                break;
            case 2:
                out += "two ";
                break;
            default:
                out += "other ";
        }
        return out.trim();
    }

    // break를 뺀 switch: 맞는 case부터 아래로 계속 내려간다
    static String noBreak(int n) {
        String out = "";
        switch (n) {
            case 1:
                out += "one ";
            case 2:
                out += "two ";
            default:
                out += "other ";
        }
        return out.trim();
    }

    public static void main(String[] args) {
        // 1. if - else if - else
        check(grade(95).equals("A") && grade(85).equals("B") && grade(70).equals("C"), "등급");
        check(grade(90).equals("A") && grade(80).equals("B") && grade(79).equals("C"), "경계 점수");
        // 중괄호가 없으면 if는 바로 다음 한 문장만 잡는다
        int t = 0;
        if (false)
            t += 1;
            t += 10;                    // 들여쓰기와 상관없이 늘 실행된다
        check(t == 10, "중괄호 없는 if");

        // 2. switch
        check(withBreak(1).equals("one") && withBreak(2).equals("two") && withBreak(9).equals("other"), "break 있는 switch");
        check(noBreak(1).equals("one two other"), "break 없는 switch, 1: " + noBreak(1));
        check(noBreak(2).equals("two other"), "break 없는 switch, 2");
        check(noBreak(9).equals("other"), "break 없는 switch, 9");
        String day = "토";
        String kind;
        switch (day) {                   // 문자열도 쓸 수 있다
            case "토":
            case "일":
                kind = "주말";
                break;
            default:
                kind = "평일";
        }
        check(kind.equals("주말"), "case를 겹쳐 쓰기");

        // 3. for: 순서는 초기화 -> 조건 -> 실행 -> 증감 -> 조건 ...
        StringBuilder log = new StringBuilder();
        int sum = 0;
        int i;
        for (i = 1; i <= 3; i++) {
            sum += i;
            log.append("i=").append(i).append(",sum=").append(sum).append(" ");
        }
        check(log.toString().trim().equals("i=1,sum=1 i=2,sum=3 i=3,sum=6"), "for 추적: " + log);
        check(i == 4, "끝난 뒤 i는 4");
        int total = 0;
        for (int j = 1; j <= 100; j++) {
            total += j;
        }
        check(total == 5050, "1부터 100까지 합");
        int never = 0;
        for (int j = 5; j < 5; j++) {
            never++;
        }
        check(never == 0, "처음부터 조건이 거짓이면 한 번도 돌지 않는다");

        // 4. float로 세면 횟수가 어긋난다
        int countF = 0;
        for (float x = 0.1f; x <= 1.0f; x += 0.1f) {
            countF++;
        }
        check(countF == 9, "float 0.1f씩 1.0f까지: " + countF + "번");
        float acc = 0.1f;
        for (int j = 0; j < 9; j++) {
            acc += 0.1f;
        }
        check(String.valueOf(acc).equals("1.0000001"), "0.1f를 열 번 더한 값: " + acc);
        int countI = 0;
        for (int j = 1; j <= 10; j++) {
            countI++;
        }
        check(countI == 10, "정수로 세면 10번");

        // 5. while, do-while
        int n = 0, loops = 0;
        while (n < 3) {
            n++;
            loops++;
        }
        check(loops == 3, "while 3번");
        int doCount = 0;
        do {
            doCount++;
        } while (false);
        check(doCount == 1, "do-while은 조건이 거짓이어도 한 번은 돈다");

        // 6. break: 가장 안쪽 반복문 하나만 끝낸다
        int found = -1;
        for (int j = 1; j <= 100; j++) {
            if (j * j > 50) {
                found = j;
                break;
            }
        }
        check(found == 8, "제곱이 50을 넘는 첫 수는 8");
        String pairs = "";
        for (int a = 1; a <= 3; a++) {
            for (int b = 1; b <= 3; b++) {
                if (b == 2) break;       // 안쪽 for만 끝난다
                pairs += a + "" + b + " ";
            }
        }
        check(pairs.trim().equals("11 21 31"), "안쪽 break: " + pairs);

        // 7. continue: 이번 바퀴의 남은 문장을 건너뛰고 증감식으로 간다
        String odds = "";
        for (int j = 1; j <= 7; j++) {
            if (j % 2 == 0) continue;
            odds += j + " ";
        }
        check(odds.trim().equals("1 3 5 7"), "홀수만: " + odds);
        // while에서 continue 앞에 증가를 빼먹으면 무한 반복이 된다. 올바른 모양:
        int w = 0;
        String wOut = "";
        while (w < 5) {
            w++;
            if (w == 3) continue;
            wOut += w;
        }
        check(wOut.equals("1245"), "while + continue");

        // 8. 카드
        String c = "";
        for (int j = 0; j < 6; j++) {
            if (j == 1) continue;
            if (j == 4) break;
            c += j;
        }
        check(c.equals("023"), "카드 추적: " + c);
        int s2 = 0;
        for (int j = 10; j > 0; j -= 3) {
            s2 += j;
        }
        check(s2 == 22, "10 + 7 + 4 + 1 = 22");

        System.out.println("ALL CHECKS PASSED");
    }
}
```
{% endraw %}
