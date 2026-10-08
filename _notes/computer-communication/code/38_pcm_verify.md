---
layout: "note"
title: "38_pcm_verify.py"
display_title: "38_pcm_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "38"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/pcm/"
parent_title: "PCM"
description: "컴퓨터 통신 · PCM 검증 코드"
permalink: "/studies/computer-communication/code/38_pcm_verify/"
---
{% raw %}
[PCM](/Hongs_Blog/studies/computer-communication/pcm/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""PCM(펄스 부호 변조) 계산 검증.

문서: 38.PCM (예시, 정의, 카드 C2·C3)
출처: 2장-1 슬라이드 25(PCM 그림), 26(음성 데이터의 디지털화)
주장:
  1. 슬라이드 25의 표본 3.0, 1.4, 6.2, 1.3, 2.8, 5.9, 4.1을 가장 가까운 정수로 반올림하면
     3, 1, 6, 1, 3, 6, 4이고, 3비트로 적으면 011001110001011110100이다.
  2. 4 kHz 음성 -> 표본 8,000개/초, 표본마다 8비트 -> 64 kbps.
  3. 표본마다 n비트면 단계는 2^n개. 3비트 8단계, 8비트 256단계.
  4. 표본을 촘촘히 하거나 비트를 늘리면 데이터 속도가 그만큼 는다.
"""

SAMPLES = [3.0, 1.4, 6.2, 1.3, 2.8, 5.9, 4.1]


def quantize(x, levels):
    q = int(x + 0.5)              # 가장 가까운 정수 (이 예에는 .5가 없다)
    return min(max(q, 0), levels - 1)


def pcm(samples, bits):
    codes = [quantize(x, 2 ** bits) for x in samples]
    return codes, "".join(format(c, f"0{bits}b") for c in codes)


def bit_rate(highest_hz, bits_per_sample):
    sampling_rate = 2 * highest_hz
    return sampling_rate, sampling_rate * bits_per_sample


def main():
    codes, stream = pcm(SAMPLES, 3)
    assert codes == [3, 1, 6, 1, 3, 6, 4]
    assert stream == "011001110001011110100"
    errors = [round(x - c, 1) for x, c in zip(SAMPLES, codes)]
    assert max(abs(e) for e in errors) <= 0.5
    print("[OK] 슬라이드 25: 표본", SAMPLES, "-> 단계", codes, "->", stream)
    print("     반올림 오차", errors, "(모두 0.5 이하)")

    fs, r = bit_rate(4_000, 8)
    assert (fs, r) == (8_000, 64_000)
    print("[OK] 슬라이드 26: 4 kHz -> 8,000 표본/초 x 8비트 = 64,000 비트/초")

    assert 2 ** 3 == 8 and 2 ** 8 == 256
    print("[OK] 3비트 8단계, 8비트 256단계")

    # 카드 C2: 표본 2.2, 5.7, 0.4, 7.0을 3비트로
    codes2, stream2 = pcm([2.2, 5.7, 0.4, 7.0], 3)
    assert codes2 == [2, 6, 0, 7] and stream2 == "010110000111"
    print("[OK] 카드 C2: 2.2, 5.7, 0.4, 7.0 -> 2, 6, 0, 7 -> 010 110 000 111")

    # 카드 C3: 최고 주파수 20 kHz(음악), 16비트 -> 40,000 표본/초 x 16 = 640 kbps (한 채널)
    assert bit_rate(20_000, 16) == (40_000, 640_000)
    # 표본 비트를 8 -> 16으로 늘리면 데이터 속도 2배
    assert bit_rate(4_000, 16)[1] == 2 * bit_rate(4_000, 8)[1]
    print("[OK] 카드 C3: 20 kHz, 16비트 -> 640 kbps. 비트 2배면 속도 2배")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
