---
layout: "note"
title: "65_mpeg-audio_verify.py"
display_title: "65_mpeg-audio_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "65"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/mpeg-audio/"
parent_title: "MPEG 오디오 부호화"
description: "휴먼 인터페이스 미디어 · MPEG 오디오 부호화 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/65_mpeg-audio_verify/"
---
{% raw %}
[MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# MPEG 오디오 부호화 문서의 계산과 주장을 확인한다.
# 실행: python3 -I 65_mpeg-audio_verify.py  (표준 라이브러리만 쓴다)
import heapq
import math
from fractions import Fraction

# 1. CD 오디오 비트율: 2 채널 x 44.1 kHz x 16 비트
cd = 2 * 44_100 * 16
assert cd == 1_411_200                         # 1.4112 Mb/s, 어림해 1.41 Mb/s
assert round(cd / 1e6, 2) == 1.41
# 1분 저장량
per_min_bits = cd * 60
assert per_min_bits == 84_672_000
assert per_min_bits / 8 == 10_584_000           # 10.58 MB (10^6 바이트 기준)
assert abs(per_min_bits / 8 / 2 ** 20 - 10.09) < 0.01

# 2. CD 채널 비트율: 프레임 하나 = 스테레오 표본 6쌍(오디오 24바이트) = 채널 비트 588
#    24 오디오 + 8 오류 정정(CIRC) + 1 부호 정보(subcode) = 33바이트, 바이트마다 EFM 14비트 + 이음 3비트 = 17비트,
#    동기 패턴 24비트 + 이음 3비트 = 27비트
frame_bits = 33 * 17 + 27
assert frame_bits == 588
frames_per_s = Fraction(44_100, 6)
assert frames_per_s == 7350
channel = frames_per_s * frame_bits
assert channel == 4_321_800                     # 4.3218 Mb/s, 어림해 4.32 Mb/s
assert Fraction(frame_bits, 6 * 2 * 16) == Fraction(49, 16)   # 오디오 비트 1개당 채널 비트 3.0625개
assert channel == cd * Fraction(49, 16)
assert round(4_321_800 / 1e6, 2) == 4.32

# 3. MP3 압축비
ratios = {r: cd / (r * 1000) for r in (128, 192, 320)}
assert abs(ratios[128] - 11.025) < 1e-9          # 약 11 : 1
assert abs(ratios[192] - 7.35) < 1e-9
assert abs(ratios[320] - 4.41) < 1e-9
assert cd / 10 == 141_120                        # 10 : 1이 되려면 141.12 kb/s

# 4. 같은 폭 부분 대역 32개: 0 ~ fs/2를 32로 나눈다
for fs, w in ((44_100, 689.0625), (48_000, 750.0), (32_000, 500.0)):
    assert fs / 2 / 32 == w

# 5. 임계 대역 25개 (경계, Hz). 첫 대역의 아래 경계는 0으로 둔다
cb = [0, 100, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320,
      2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 22050]
assert len(cb) - 1 == 25
widths = [cb[i + 1] - cb[i] for i in range(25)]
assert widths[1:4] == [100, 100, 100] and widths[24] == 6550
W = 22_050 / 32


def subbands_touched(lo, hi):
    """임계 대역 [lo, hi)가 걸치는 부분 대역 번호(1부터)."""
    first = math.floor(lo / W) + 1
    last = math.ceil(hi / W)
    return list(range(first, last + 1))


# 첫 부분 대역(0 ~ 689 Hz)에 완전히 들어가는 임계 대역: 1 ~ 6, 7번(630 ~ 770)은 걸친다
inside_first = [i + 1 for i in range(25) if cb[i + 1] <= W]
assert inside_first == [1, 2, 3, 4, 5, 6]
assert cb[6] < W < cb[7]
# 마지막 임계 대역(15500 ~ 22050)은 부분 대역 23 ~ 32, 10개에 걸친다
assert subbands_touched(15_500, 22_050) == list(range(23, 33))
# 1 kHz 아래 임계 대역 수 vs 부분 대역 수
assert sum(1 for i in range(25) if cb[i + 1] <= 1080) == 9
assert math.ceil(1080 / W) == 2

# 6. 비트 배분 장난감 예: 신호 대 가림 비(SMR) = 신호 - 가림 문턱, 비트 = SMR / 6.02를 올림 (SMR <= 0이면 0)
signal = [60, 75, 82, 70, 45, 30, 51, 20]
mask = [35, 55, 60, 62, 50, 35, 38, 28]
smr = [s - m for s, m in zip(signal, mask)]
assert smr == [25, 20, 22, 8, -5, -5, 13, -8]
bits = [math.ceil(v / 6.0206) if v > 0 else 0 for v in smr]
assert bits == [5, 4, 4, 2, 0, 0, 3, 0]
assert sum(bits) == 18 and 16 * 8 == 128
# 고른 비트로 잡음이 문턱 아래인지: 잡음 크기 = 신호 - 6.02 * 비트 <= 가림 문턱
for s, m, b in zip(signal, mask, bits):
    if b:
        assert s - 6.0206 * b <= m
        assert s - 6.0206 * (b - 1) > m            # 하나 적으면 문턱을 넘는다

# 카드 C3: 65 vs 50 dB -> SMR 15 -> 3비트(18.06 dB), 2비트면 12.04 dB로 약 3 dB 모자람. 40 vs 45 -> 0비트
assert math.ceil(15 / 6.0206) == 3 and 6.0206 * 3 >= 15 and abs((15 - 6.0206 * 2) - 2.96) < 0.01
assert (40 - 45) <= 0
# 1번 대역: 4비트면 24.08 dB로 약 1 dB 모자람
assert abs((25 - 6.0206 * 4) - 0.92) < 0.01
# 4분짜리 노래: CD 42.336 MB, 128 kb/s MP3 3.84 MB
assert cd * 240 / 8 == 42_336_000 and 128_000 * 240 / 8 == 3_840_000

# 7. 허프만 부호: 양자화 뒤 값 0, +1, -1, +2, -2의 확률 0.5, 0.2, 0.2, 0.05, 0.05
probs = {"0": 0.5, "+1": 0.2, "-1": 0.2, "+2": 0.05, "-2": 0.05}


def huffman_lengths(p):
    heap = [(v, i, [k]) for i, (k, v) in enumerate(sorted(p.items()))]
    heapq.heapify(heap)
    length = {k: 0 for k in p}
    counter = len(heap)
    while len(heap) > 1:
        a = heapq.heappop(heap)
        b = heapq.heappop(heap)
        for k in a[2] + b[2]:
            length[k] += 1
        heapq.heappush(heap, (a[0] + b[0], counter, a[2] + b[2]))
        counter += 1
    return length


lens = huffman_lengths(probs)
avg = sum(probs[k] * lens[k] for k in probs)
assert abs(avg - 1.9) < 1e-12
assert lens["0"] == 1 and lens["+2"] == 4 and lens["-2"] == 4
assert sorted(lens.values()) == [1, 2, 3, 4, 4]
H = -sum(v * math.log2(v) for v in probs.values())
assert abs(H - 1.861) < 1e-3
fixed = math.ceil(math.log2(len(probs)))
assert fixed == 3
assert H <= avg < H + 1
assert abs(1 - avg / fixed - 0.3667) < 1e-3          # 고정 3비트보다 약 37% 짧다
# 크래프트 부등식: 접두어 부호가 될 수 있다
assert abs(sum(2 ** -l for l in lens.values()) - 1) < 1e-12

# 8. 프레임 길이: Layer I 384 = 32 x 12, Layer II/III 1152 = 32 x 36. 44.1 kHz에서 1152 표본은 약 26.1 ms
assert 32 * 12 == 384 and 32 * 36 == 1152
assert abs(1152 / 44_100 * 1000 - 26.12) < 0.01

if __name__ == "__main__":
    print(f"CD {cd} b/s, 채널 {int(channel)} b/s, 1분 {per_min_bits / 8 / 1e6:.3f} MB")
    print(f"MP3 압축비 {ratios}")
    print(f"비트 배분 {bits} 합 {sum(bits)}, 허프만 평균 {avg:.2f} 비트, 엔트로피 {H:.3f} 비트")
    print("ALL CHECKS PASSED")
```
{% endraw %}
