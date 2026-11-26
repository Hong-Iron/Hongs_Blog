---
layout: "note"
title: "56_spectrum-spectrogram_verify.py"
display_title: "56_spectrum-spectrogram_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "56"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/spectrum-spectrogram/"
parent_title: "스펙트럼과 스펙트로그램"
description: "휴먼 인터페이스 미디어 · 스펙트럼과 스펙트로그램 검증 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/56_spectrum-spectrogram_verify/"
---
{% raw %}
[스펙트럼과 스펙트로그램](/Hongs_Blog/studies/human-interface-media/spectrum-spectrogram/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 스펙트럼과 스펙트로그램 문서의 수치를 검증한다.
# 실행: python3 -I 56_spectrum-spectrogram_verify.py  (표준 라이브러리만)
# 1) 고조파 셋(440, 880, 1320 Hz, 진폭 1, 0.5, 0.3)의 푸리에 급수 계수를 한 주기 적분으로 구한다
# 2) 평균 전력 = 계수 크기의 제곱합 (파스발)
# 3) 2 ms 사각 펄스의 푸리에 변환 크기: 0 Hz에서 0.002, 500 Hz의 배수에서 0
# 4) 창 길이와 주파수 눈금: 간격 = 1 / 창 길이,  440 Hz와 460 Hz는 25 ms 창에서 한 봉우리, 200 ms 창에서 두 봉우리
import cmath
import math

F0 = 440.0
AMPS = {1: 1.0, 2: 0.5, 3: 0.3}


def tone(t):
    return sum(A * math.cos(2 * math.pi * k * F0 * t) for k, A in AMPS.items())


def fs_coef(k, n=4400):
    """a_k = (1/T) * (한 주기 적분) x(t) e^{-j k w0 t} dt, 사다리꼴 대신 균등 표본 합 (주기 함수라 정확)."""
    T = 1.0 / F0
    s = 0j
    for i in range(n):
        t = i * T / n
        s += tone(t) * cmath.exp(-2j * math.pi * k * F0 * t)
    return s / n


def pulse_ft(f, tau=0.002, n=4000):
    """높이 1, 길이 tau인 펄스의 푸리에 변환을 수치 적분 (중점 규칙)."""
    dt = tau / n
    return sum(cmath.exp(-2j * math.pi * f * (i + 0.5) * dt) for i in range(n)) * dt


def dft_mag_db(sig, fs, freqs):
    out = []
    for f in freqs:
        s = sum(x * cmath.exp(-2j * math.pi * f * i / fs) for i, x in enumerate(sig))
        out.append(20 * math.log10(abs(s) + 1e-300))
    return out


def count_peaks(vals):
    return sum(1 for i in range(1, len(vals) - 1) if vals[i] > vals[i - 1] and vals[i] > vals[i + 1])


if __name__ == "__main__":
    # 1) 계수: |a_{+-1}| = 0.5, |a_{+-2}| = 0.25, |a_{+-3}| = 0.15, 그 밖은 0
    for k in range(-5, 6):
        want = AMPS.get(abs(k), 0.0) / 2
        assert abs(abs(fs_coef(k)) - want) < 1e-9, (k, fs_coef(k))
    # 주기: 1/440 s = 2.27 ms. 880, 1320 Hz도 이 시간에 정수 번 돈다
    assert abs(1000 / F0 - 2.2727) < 1e-4
    # 2) 파스발: 한 주기 평균 x^2 = (1 + 0.25 + 0.09) / 2 = 0.67 = 계수 제곱합
    n = 4400
    p_time = sum(tone(i / (F0 * n)) ** 2 for i in range(n)) / n
    p_freq = sum(abs(fs_coef(k)) ** 2 for k in range(-4, 5))
    assert abs(p_time - 0.67) < 1e-9 and abs(p_freq - 0.67) < 1e-9
    # 3) 2 ms 펄스: |X(0)| = 0.002, 500 Hz 배수에서 0, 250 Hz에서 0.002 * sinc(0.5) = 0.001273
    assert abs(abs(pulse_ft(0)) - 0.002) < 1e-12
    for f in (500, 1000, 1500):
        assert abs(pulse_ft(f)) < 1e-9, f
    assert abs(abs(pulse_ft(250)) - 0.002 * math.sin(math.pi * 0.5) / (math.pi * 0.5)) < 1e-9
    # 이어진 스펙트럼: 440 Hz와 660 Hz 사이 어디서나 0이 아닌 값이 있다 (선 스펙트럼과 다르다)
    assert all(abs(pulse_ft(f)) > 1e-4 for f in range(440, 461, 5))
    # 4) 창 길이와 주파수 눈금: 25 ms -> 40 Hz, 표본 400개 (16 kHz 표본화)
    fs = 16000
    assert fs * 0.025 == 400 and fs / 400 == 40.0
    # 440 Hz + 460 Hz (20 Hz 차이): 25 ms 창은 한 봉우리, 200 ms 창은 두 봉우리
    def two_tones(N):
        return [math.cos(2 * math.pi * 440 * i / fs) + math.cos(2 * math.pi * 460 * i / fs) for i in range(N)]
    grid = [400 + 2 * j for j in range(41)]          # 400 ~ 480 Hz, 2 Hz 간격
    short = dft_mag_db(two_tones(400), fs, grid)
    long_ = dft_mag_db(two_tones(3200), fs, grid)
    assert count_peaks(short) == 1, count_peaks(short)
    assert count_peaks(long_) >= 2
    i440, i450, i460 = grid.index(440), grid.index(450), grid.index(460)
    assert long_[i450] < long_[i440] - 10 and long_[i450] < long_[i460] - 10
    # 카드 C2: 창 50 ms(= 1/20 Hz)에서 440, 460 Hz가 두 봉우리로 갈리기 시작한다 (봉우리 약 436, 464 Hz)
    grid1 = [425 + j for j in range(51)]                 # 425 ~ 475 Hz, 1 Hz 간격
    mid50 = dft_mag_db(two_tones(800), fs, grid1)
    pk = [grid1[i] for i in range(1, len(mid50) - 1) if mid50[i] > mid50[i - 1] and mid50[i] > mid50[i + 1]]
    assert len(pk) == 2 and abs(pk[0] - 440) <= 6 and abs(pk[1] - 460) <= 6, pk
    assert mid50[grid1.index(450)] < mid50[grid1.index(pk[0])] - 10
    mid25 = dft_mag_db(two_tones(400), fs, grid1)
    pk25 = [grid1[i] for i in range(1, len(mid25) - 1) if mid25[i] > mid25[i - 1] and mid25[i] > mid25[i + 1]]
    assert pk25 == [450], pk25
    # 카드 C1: 주기 5 ms -> 기본 주파수 200 Hz, 선은 200 Hz의 정수배에만. 1.1 kHz는 정수배가 아니다
    f0 = 1 / 0.005
    assert abs(f0 - 200) < 1e-9 and (1100 / f0) % 1 != 0 and (1200 / f0) % 1 == 0
    # 오해 상자: 소리를 거꾸로 틀어도 스펙트럼의 크기는 같다 (뚝 쳤다가 사라지는 소리 vs 서서히 커지다 뚝 끊기는 소리)
    N = 800
    pluck = [math.exp(-i / 120) * math.sin(2 * math.pi * 440 * i / fs) for i in range(N)]
    rev = pluck[::-1]
    fr = [k * fs / N for k in range(0, 60)]
    m1 = [10 ** (d / 20) for d in dft_mag_db(pluck, fs, fr)]
    m2 = [10 ** (d / 20) for d in dft_mag_db(rev, fs, fr)]
    assert max(abs(a - b) for a, b in zip(m1, m2)) < 1e-6 * max(m1)
    assert pluck[:5] != rev[:5]          # 파형(시간 순서)은 다르다
    print("ALL CHECKS PASSED")
```
{% endraw %}
