---
layout: "note"
title: "26_resolution-spatial-frequency_verify.py"
display_title: "26_resolution-spatial-frequency_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "26"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/resolution-spatial-frequency/"
parent_title: "해상도와 공간 주파수"
description: "휴먼 인터페이스 미디어 · 해상도와 공간 주파수 검증 코드"
permalink: "/studies/human-interface-media/code/26_resolution-spatial-frequency_verify/"
---
{% raw %}
[해상도와 공간 주파수](/Hongs_Blog/studies/human-interface-media/resolution-spatial-frequency/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""해상도와 공간 주파수 검증.

문서: 26.해상도와 공간 주파수 (예시로 보기, 정의, 카드 C2·C3)
주장:
  1. 밝고 어두운 줄 한 쌍에는 픽셀이 적어도 2개 필요하다. 그래서 N픽셀에 담을 수 있는 최대 공간 주파수는
     N/2 주기(0.5 cycle/pixel)다. 8픽셀이면 4주기: 0,255,0,255,...
  2. 그보다 빠른 줄무늬는 더 느린 줄무늬로 둔갑한다. 0.6 cycle/pixel을 픽셀마다 재면
     0.4 cycle/pixel과 같은 값이 나온다(cos(2π·0.6n) = cos(2π·0.4n)).
  3. dpi: 같은 4인치 폭에 72 dpi면 288픽셀, 1250 dpi면 5000픽셀. 화면 크기가 같으면 dpi가 해상도를 정한다.
  4. 1024 → 512 → … → 32로 가로세로를 반씩 줄이면 픽셀 수는 매번 1/4. 1024에서 32까지 1/1024배.
  5. 데이터의 25%만 남기는 두 방법(슬라이드 p.10)을 1차원으로 재현:
     64개 표본의 매끈한 신호에서 앞 16개 픽셀만 남기면 나머지 48개를 모른다(복원 오차가 큼).
     낮은 주파수 계수 25%만 남기면 전체 모양이 거의 그대로 돌아온다(오차가 작음).
"""
import cmath
import math


def dft(x):
    n = len(x)
    return [sum(x[t] * cmath.exp(-2j * math.pi * k * t / n) for t in range(n)) for k in range(n)]


def idft(X):
    n = len(X)
    return [sum(X[k] * cmath.exp(2j * math.pi * k * t / n) for k in range(n)).real / n for t in range(n)]


def main() -> None:
    # 1. 최대 공간 주파수
    stripes = [255 * (n % 2) for n in range(8)]
    cycles = sum(1 for n in range(1, 8) if stripes[n - 1] == 0 and stripes[n] == 255)
    assert cycles == 4 and cycles == 8 // 2
    # 2. 둔갑(에일리어싱)
    for n in range(20):
        assert abs(math.cos(2 * math.pi * 0.6 * n) - math.cos(2 * math.pi * 0.4 * n)) < 1e-9
    # 3. dpi
    assert 4 * 72 == 288 and 4 * 1250 == 5000
    # 4. 반씩 줄이기
    sizes = [1024, 512, 256, 128, 64, 32]
    assert all(a == 2 * b for a, b in zip(sizes, sizes[1:]))
    assert (32 * 32) / (1024 * 1024) == 1 / 1024
    # 5. 25% 남기기 두 방법
    n = 64
    sig = [math.exp(-((t - 32) / 12) ** 2) + 0.3 * math.cos(2 * math.pi * 2 * t / n) for t in range(n)]
    keep = n // 4
    crop = sig[:keep] + [0.0] * (n - keep)                       # 픽셀 25%만 남김
    X = dft(sig)
    low = [X[k] if (k <= keep // 2 or k >= n - keep // 2 + 1) else 0 for k in range(n)]  # 낮은 주파수 16개
    assert sum(1 for v in low if v != 0) == keep
    rec = idft(low)
    rms = lambda a, b: math.sqrt(sum((p - q) ** 2 for p, q in zip(a, b)) / len(a))
    e_crop, e_low = rms(sig, crop), rms(sig, rec)
    assert e_low < 0.01 < 0.3 < e_crop
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
