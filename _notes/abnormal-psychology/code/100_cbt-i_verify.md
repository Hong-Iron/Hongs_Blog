---
layout: "note"
title: "100_cbt-i_verify.py"
display_title: "100_cbt-i_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "100"
course: "이상 심리학"
course_slug: "abnormal-psychology"
course_url: "/studies/abnormal-psychology/"
track: "4-1학기"
parent_url: "/studies/abnormal-psychology/cbt-i/"
parent_title: "불면증 인지행동치료"
description: "이상 심리학 · 불면증 인지행동치료 검증 코드"
permalink: "/studies/abnormal-psychology/code/100_cbt-i_verify/"
---
{% raw %}
[불면증 인지행동치료](/Hongs_Blog/studies/abnormal-psychology/cbt-i/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""불면증 인지행동치료 문서와 연습 문제의 수면 효율·수면제한 계산을 검증한다.

수면 효율(%) = 실제 수면 시간 / 침대에 누워 있는 시간 x 100
수면제한: 침대 시간을 평균 실제 수면 시간으로 줄이고(최소 300분),
기상 시각을 고정한 채 취침 시각을 뒤로 민다.
한 주 평균 효율이 85% 이상이면 침대 시간을 15분 늘린다.
"""


def efficiency(total_sleep_min: int, time_in_bed_min: int) -> float:
    return total_sleep_min / time_in_bed_min * 100


def restricted_window(avg_sleep_min: int, minimum: int = 300) -> int:
    return max(avg_sleep_min, minimum)


def next_window(window_min: int, eff: float) -> int:
    return window_min + 15 if eff >= 85 else window_min


def clock(minutes_after_midnight: int) -> str:
    m = minutes_after_midnight % (24 * 60)
    return f"{m // 60:02d}:{m % 60:02d}"


if __name__ == "__main__":
    # 100 예시(GW): 23:00~07:00 침대(480분), 잠들기까지 90분, 중간에 깬 시간 30분
    tib = 8 * 60
    tst = tib - 90 - 30
    e = efficiency(tst, tib)
    assert tst == 360 and round(e, 1) == 75.0, (tst, e)
    w = restricted_window(tst)
    wake = 7 * 60
    assert w == 360 and clock(wake - w) == "01:00"
    print(f"GW: 수면 {tst}분 / 침대 {tib}분 = {e:.1f}% -> 침대 {w}분, 취침 {clock(wake - w)}")

    # 한 주 뒤: 침대 360분 가운데 330분 잠 -> 91.7% -> 15분 늘려 00:45 취침
    e2 = efficiency(330, 360)
    w2 = next_window(360, e2)
    assert round(e2, 1) == 91.7 and w2 == 375 and clock(wake - w2) == "00:45"
    print(f"GW 1주 뒤: {e2:.1f}% -> 침대 {w2}분, 취침 {clock(wake - w2)}")

    # 연습 문제(GV): 22:30~07:00(510분), 잠들기까지 60분, 깬 시간 45분
    tib_v = 8 * 60 + 30
    tst_v = tib_v - 60 - 45
    e_v = efficiency(tst_v, tib_v)
    assert tst_v == 405 and round(e_v, 1) == 79.4, (tst_v, e_v)
    w_v = restricted_window(tst_v)
    assert w_v == 405 and clock(wake - w_v) == "00:15"
    print(f"GV: 수면 {tst_v}분 / 침대 {tib_v}분 = {e_v:.1f}% -> 침대 {w_v}분, 취침 {clock(wake - w_v)}")

    # 연습 문제 변형(GV 1주 뒤): 침대 405분 가운데 370분 잠 -> 91.4% -> 420분, 00:00 취침
    e_v2 = efficiency(370, 405)
    w_v2 = next_window(405, e_v2)
    assert round(e_v2, 1) == 91.4 and w_v2 == 420 and clock(wake - w_v2) == "00:00"
    print(f"GV 1주 뒤: {e_v2:.1f}% -> 침대 {w_v2}분, 취침 {clock(wake - w_v2)}")

    # 경계: 평균 수면이 4시간(240분)이어도 침대 시간은 최소 300분
    assert restricted_window(240) == 300
    # 경계: 효율이 정확히 85%면 늘리고, 84.9%면 유지
    assert next_window(360, 85.0) == 375 and next_window(360, 84.9) == 360
    print("경계 3개 통과")
    print("ALL CHECKS PASSED")
```
{% endraw %}
