---
layout: "note"
title: "달팽이관과 장소설"
display_title: "달팽이관과 장소설 (Cochlea and Place Theory)"
kind: "concept"
kind_label: "모델"
num: "50"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
updated: "2026-11-26"
last_modified_at: "2026-11-26"
date: "2026-11-26"
status: "verified"
aliases: ["Cochlea", "Place Theory", "Place Theory of Hearing", "장소설", "장소 이론", "베케시", "Békésy", "Bekesy", "기저막", "basilar membrane", "개막", "tectorial membrane", "전정계", "scala vestibuli", "고실계", "scala tympani", "코르티 기관", "organ of Corti", "유모세포", "hair cell", "진행파", "traveling wave", "포락선", "envelope", "그린우드 함수", "Greenwood function", "주파수 지도", "tonotopic map", "특성 주파수", "characteristic frequency", "helicotrema", "인공와우", "cochlear implant"]
description: "소리가 귀에 들어오면, 달팽이관 속에 깔린 길이 3.5 cm쯤의 막 위로 물결이 입구에서 안쪽 끝으로 밀려간다. 높은 소리는 입구 근처에서, 낮은 소리는 안쪽 끝에서 가장 크게 출렁이고, 뇌는 어느 자리가 가장 세게 출렁였는지로 소리의 높이를 안다(장소설). 여러 높이가 섞인 소리…"
prev_url: "/studies/human-interface-media/ear-anatomy/"
prev_title: "귀의 구조"
next_url: "/studies/human-interface-media/equal-loudness-contours/"
next_title: "등청감 곡선"
math: true
mermaid: true
code_count: 2
code_files: [{"t": "50_cochlea-place-theory_plot.py", "u": "/studies/human-interface-media/code/50_cochlea-place-theory_plot/", "r": "그림 생성"}, {"t": "50_cochlea-place-theory_verify.py", "u": "/studies/human-interface-media/code/50_cochlea-place-theory_verify/", "r": "검증"}]
permalink: "/studies/human-interface-media/cochlea-place-theory/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

소리가 귀에 들어오면, 달팽이관 속에 깔린 길이 3.5 cm쯤의 막 위로 물결이 입구에서 안쪽 끝으로 밀려간다. 높은 소리는 입구 근처에서, 낮은 소리는 안쪽 끝에서 가장 크게 출렁이고, 뇌는 어느 자리가 가장 세게 출렁였는지로 소리의 높이를 안다(장소설). 여러 높이가 섞인 소리는 자리별로 나뉘어 출렁이므로, 달팽이관은 소리를 높이별 성분으로 나누는 장치다. 다만 출렁임은 넓게 퍼지고 아주 낮은 소리들은 안쪽 끝에 몰려서, 자리만으로는 낮은 소리의 높이를 정확히 가리지 못한다.

</div>


## 예시로 보기

귀에 들어오는 소리는 압력이 시간에 따라 오르내리는 파형 한 줄뿐이다. 그 안에 440 Hz, 880 Hz, 1,320 Hz가 섞여 있어도 파형만 봐서는 성분을 바로 읽을 수 없다. 귀가 음높이와 음색([음색](/Hongs_Blog/studies/human-interface-media/timbre/))을 들으려면 이 한 줄을 성분별로 나눠야 한다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/50_cochlea-place-theory_fig1.svg" alt="그림" width="679" height="468" loading="lazy">

그림의 위쪽은 세 성분을 같은 크기로 더한 소리의 파형이다. 약 2.27 ms(440 Hz의 한 주기)마다 같은 모양이 되풀이되지만, 성분이 셋이라는 것은 모양에서 바로 보이지 않는다. 그림의 아래쪽은 이 소리가 들어왔을 때 달팽이관 속 막(기저막)이 자리마다 얼마나 크게 흔들리는지를 나타낸다. 가로축 왼쪽 끝이 달팽이관 입구, 오른쪽 끝이 안쪽 끝이다. 왼쪽에서 오른쪽으로 보면 1,320 Hz는 입구에서 약 19 mm, 880 Hz는 약 22 mm, 440 Hz는 약 26 mm 자리에서 가장 크게 흔든다. 세 봉우리가 따로 서 있다. 시간 속에 섞여 있던 세 성분이 막 위의 세 자리로 펼쳐진 것이다[^s1].

## 정의

달팽이관을 곧게 펴면 길이 약 35 mm의 관이다. 관 안은 가운데 칸막이로 위층과 아래층 두 통로로 나뉘고, 통로는 액체(림프액)로 차 있다[^s2].

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- **전정계**(scala vestibuli): 위층 통로. 난원창에서 시작한다.
- **고실계**(scala tympani): 아래층 통로. 정원창에서 끝난다. 두 통로는 꼭대기의 작은 구멍으로 이어진다.
- **기저막**(basilar membrane): 칸막이의 아래쪽 막. 입구에서 안쪽 끝까지 이어진다.
- **코르티 기관**(organ of Corti): 기저막 위에 놓인 감각 장치. 털 달린 감각 세포(유모세포)가 줄지어 있다.
- **개막**(tectorial membrane): 유모세포의 털(섬모) 위를 덮은 막.
- **바닥**(base)과 **꼭대기**(apex): 등자뼈가 붙은 입구 쪽 끝이 바닥, 반대쪽 끝이 꼭대기다.

기저막이 위아래로 흔들리면 그 위의 개막은 옆으로 어긋나게 움직인다. 그 사이에 낀 섬모가 굽으면 유모세포가 신호를 내고, 그 자리에 이어진 청신경 섬유가 발화한다[^s2].

</div>


<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**장소설**(place theory): 소리의 주파수는 기저막을 따라 청신경 섬유가 가장 세게 발화하는 자리로 나타난다. 높은 주파수는 바닥 쪽, 낮은 주파수는 꼭대기 쪽이다. 베케시(Békésy)가 기저막의 흔들림을 직접 재어 뒷받침했다[^s4].

**기호로 쓰면.**
- $$x$$: 기저막 위의 자리를 꼭대기에서 잰 길이 비율($$0 \le x \le 1$$, 0이 꼭대기, 1이 바닥). 바닥에서 잰 거리로는 $$d = L(1 - x)$$이고, $$L \approx 35$$ mm다.
- $$A_f(x)$$: 주파수 $$f$$인 순음이 들어올 때 자리 $$x$$가 흔들리는 폭.
- $$F(x)$$: 자리 $$x$$를 가장 크게 흔드는 주파수(특성 주파수).

장소설은 순음마다 흔들림이 가장 큰 자리 $$x^*(f)$$가 하나 있고, 그 자리가 주파수를 알려 준다는 뜻이다.

$$ x^*(f) = \arg\max_{x} A_f(x), \qquad F\big(x^*(f)\big) = f $$

$$\arg\max_x$$는 "값을 가장 크게 만드는 $$x$$"라고 읽는다. $$F(x)$$는 $$x$$가 커질수록(바닥 쪽일수록) 커진다. 성분이 여럿인 소리 $$\sum_k a_k \sin(2\pi f_k t)$$가 들어오면 성분마다 자기 자리 $$x^*(f_k)$$에 봉우리가 선다.

</div>


신호가 흘러가는 길은 이렇다.

```mermaid
graph LR
  S["등자뼈가 난원창을 민다"] --> V["전정계 액체의 압력"] --> P["기저막이 위아래로 흔들린다<br/>바닥에서 꼭대기로 물결"] --> K["봉우리 자리의 섬모가<br/>개막에 밀려 굽는다"] --> N["그 자리의 청신경 섬유 발화"] --> B["뇌: 어느 섬유인가 → 높이"]
  P --> T["고실계 액체"] --> R["정원창이 부푼다"]
```

위쪽 줄이 주파수를 자리로 바꾸는 길이다. 아래쪽 갈래는 밀린 액체가 빠져나가는 길이다([귀의 구조](/Hongs_Blog/studies/human-interface-media/ear-anatomy/)).

사람의 $$F(x)$$는 아래 식으로 어림한다(Greenwood 함수)[^s3].

$$ F(x) = 165.4\,\big(10^{2.1x} - 0.88\big)\ \text{Hz} $$


10을 $$2.1x$$번 거듭제곱하므로, 바닥 쪽으로 같은 거리를 갈 때마다 주파수가 같은 배수로 커진다. $$-0.88$$은 꼭대기 근처의 낮은 주파수에서 이 규칙을 누그러뜨린다. 숫자를 넣으면 꼭대기($$x = 0$$)는 $$165.4 \times 0.12 \approx 20$$ Hz, 바닥($$x = 1$$)은 $$165.4 \times (125.9 - 0.88) \approx 20{,}700$$ Hz, 한가운데($$x = 0.5$$)는 약 1,710 Hz다. 양 끝이 [가청 대역](/Hongs_Blog/studies/human-interface-media/range-of-hearing/)의 20 Hz~20 kHz와 맞는다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/50_cochlea-place-theory_fig2.svg" alt="그림" width="621" height="357" loading="lazy">

가로축은 바닥에서 잰 거리, 세로축은 그 자리가 맡는 주파수다(10배마다 같은 간격). 왼쪽 바닥은 약 20 kHz에서 시작한다. 15 mm쯤까지는 곡선이 거의 직선이라, 같은 거리마다 주파수가 같은 배수로 줄어든다. 오른쪽 꼭대기 근처에서는 곡선이 아래로 꺾여 짧은 거리 안에 100 Hz에서 20 Hz까지가 몰린다. 점선은 막의 한가운데가 약 1.7 kHz를 맡는다는 것을 보여 준다. 길이의 절반이 1.7 kHz 아래의 소리에 쓰인다. 주황 점은 베케시가 잰 봉우리 자리로, 곡선과 2 mm 안쪽에서 맞는다[^s3].

달팽이관을 감긴 그대로 위에서 보면, 나선의 바깥쪽 고리(바닥)에 수천 Hz가, 나선의 한가운데(꼭대기)에 수십 Hz가 놓인다.

## 왜 자리마다 맡는 주파수가 다른가

기저막이 자리마다 폭과 뻣뻣함이 다르다는 사실 하나에서, 물결(진행파)과 봉우리 자리가 차례로 나온다[^s4].

<details markdown="1"><summary markdown="span">단계별로 펼치기</summary>


1. 등자뼈가 난원창을 밀면 전정계의 액체에 압력이 생긴다. (근거: 액체는 거의 압축되지 않고, 대신 정원창이 부푼다. [귀의 구조](/Hongs_Blog/studies/human-interface-media/ear-anatomy/))
2. 위층(전정계)이 아래층(고실계)보다 압력이 높아지고, 그 차이가 칸막이를 아래로 민다. 등자뼈가 당겨지면 반대로 위로 민다. (근거: 막 양쪽의 압력 차이가 막을 미는 힘이다.)
3. 기저막은 바닥 쪽이 좁고 뻣뻣하며, 꼭대기 쪽으로 갈수록 넓고 낭창하다. (근거: 기저막을 해부해 잰 결과)
4. 뻣뻣한 곳은 빠른 떨림을 잘 따라가고, 낭창한 곳은 느린 떨림을 잘 따라간다. (근거: 용수철에 매단 추가 저절로 떠는 주파수는 $$f = \frac{1}{2\pi}\sqrt{k/m}$$이다. $$k$$는 용수철의 뻣뻣함, $$m$$은 추의 질량이다. 뻣뻣할수록 높고 무거울수록 낮다.)
5. 흔들림은 바닥에서 시작해 꼭대기 쪽으로 물결처럼 옮겨 간다(진행파). 물결은 자기 주파수와 막의 성질이 맞는 자리까지 점점 커지다가, 그 자리를 지나면 막이 그 빠르기를 따라가지 못해 급히 사라진다. (근거: 4단계와 아래 그림 3)
6. 봉우리 자리에서 섬모가 가장 크게 굽고, 그 자리의 청신경 섬유가 가장 많이 발화한다. (근거: 섬모는 기저막과 개막이 어긋나는 만큼 굽는다.)
7. 뇌는 어떤 섬유가 가장 세게 발화하는지로 주파수를 읽는다. (근거: 장소설)

만약 기저막이 처음부터 끝까지 폭과 뻣뻣함이 같다면 4단계가 무너진다. 모든 주파수가 같은 꼴로 흔들려 자리로 주파수를 가를 수 없다.

</details>

<img class="note-fig" src="/Hongs_Blog/assets/notes/human-interface-media/50_cochlea-place-theory_fig3.svg" alt="그림" width="585" height="324" loading="lazy">

1 kHz 순음 하나가 만드는 물결을 모형으로 그렸다. 회색 점선은 흔들림이 도달하는 가장 큰 폭(포락선)이다. 파랑 1, 주황 2, 초록 3은 4분의 1 주기씩 뒤의 막 모습이다. 숫자가 붙은 같은 마루가 약 17 mm → 19 mm → 21 mm로 꼭대기 쪽으로 옮겨 가며 커진다. 21 mm(1 kHz를 맡는 자리)에서 가장 크고, 그 너머에서는 2~3 mm 안에 사라진다. 바닥 쪽 꼬리는 길고 꼭대기 쪽 꼬리는 짧다[^s5].

### 스스로 설명해 보기

1. "등자뼈가 난원창을 밀면 기저막이 아래로 밀린다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   액체가 압축되지 않으므로 정원창이 부푸는 동안 위층의 압력이 아래층보다 높아지고, 그 압력 차이가 칸막이를 아래층 쪽으로 민다.
   </details>
2. "높은 소리의 물결은 꼭대기까지 가지 못한다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   높은 소리는 바닥 근처의 뻣뻣한 자리에서 봉우리를 이룬다. 그보다 꼭대기 쪽의 낭창한 막은 그 빠른 떨림을 따라가지 못해 물결이 급히 사라진다.
   </details>
3. "낮은 소리도 바닥 쪽 유모세포를 조금 흔든다."
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   모든 물결은 바닥에서 출발해 자기 봉우리 자리까지 지나간다. 낮은 소리의 물결은 가는 길에 바닥 쪽을 작게 흔든다. 그래서 포락선은 바닥 쪽 꼬리가 길다.
   </details>
- 이 설명의 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  막의 성질이 자리마다 조금씩 바뀌면, 주파수의 차이가 자리의 차이로 바뀐다. 시간 속의 정보(주파수)를 공간 속의 정보(자리)로 옮긴다.
  </details>
- 같은 방법을 쓰는 다른 장치는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  길이가 다른 건반이 저마다 다른 높이에 울리는 실로폰, 빛을 파장마다 다른 각도로 펼치는 프리즘, 소리를 여러 주파수 구간으로 나누는 오디오 이퀄라이저와 필터 뱅크. 모두 "성질이 다른 부품을 나란히 두고, 어느 부품이 크게 반응했는지로 주파수를 안다".
  </details>

## 예제

**예제 1. 세 성분의 자리 구하기.** 440, 880, 1,320 Hz가 기저막 어디를 가장 크게 흔드는지 Greenwood 함수로 구한다($$L = 35$$ mm)[^s3].

- *식을 $$x$$에 대해 푼다.* $$F(x) = f$$에서 양변을 165.4로 나누고 0.88을 더하면 $$10^{2.1x} = f/165.4 + 0.88$$이다. 상용로그를 씌워 2.1로 나누면

$$ x = \frac{1}{2.1}\log_{10}\!\left(\frac{f}{165.4} + 0.88\right) $$

- *숫자를 넣는다(440 Hz).* $$440/165.4 = 2.660$$, 여기에 0.88을 더하면 3.540, $$\log_{10} 3.540 = 0.549$$, 2.1로 나누면 $$x = 0.261$$이다.
- *바닥에서 잰 거리로 바꾼다.* $$d = 35 \times (1 - 0.261) \approx 25.8$$ mm.

| 성분 | $$f/165.4 + 0.88$$ | $$x$$ | 바닥에서 $$d$$ |
|---|---|---|---|
| 440 Hz | 3.540 | 0.261 | 25.8 mm |
| 880 Hz | 6.200 | 0.377 | 21.8 mm |
| 1,320 Hz | 8.861 | 0.451 | 19.2 mm |

높은 성분일수록 바닥 쪽이다. 440 → 880 Hz(2배, 한 옥타브)는 4.0 mm, 880 → 1,320 Hz(1.5배)는 2.6 mm 떨어져 있다.

**예제 2. 측정과 비교하기.** 베케시가 잰 봉우리 자리(그림에서 눈으로 읽은 값)와 식을 비교하면 이렇다[^s3].

| 주파수 | 측정 봉우리 (바닥에서) | Greenwood 식 | 차이 |
|---|---|---|---|
| 1,600 Hz | 약 17.2 mm | 17.9 mm | +0.7 |
| 800 Hz | 약 20.4 mm | 22.4 mm | +2.0 |
| 400 Hz | 약 24.4 mm | 26.4 mm | +2.0 |
| 200 Hz | 약 29.2 mm | 29.7 mm | +0.5 |
| 100 Hz | 약 31.5 mm | 32.1 mm | +0.6 |
| 50 Hz | 약 32.6 mm | 33.8 mm | +1.2 |
| 25 Hz | 꼭대기 끝(35 mm 근처)까지 계속 커짐 | 34.8 mm | — |

**예제 3. 낮은 쪽이 몰리는 정도.** 높은 주파수에서는 $$-0.88$$을 무시할 수 있어 $$x \approx \frac{1}{2.1}\log_{10}(f/165.4)$$이다. 주파수가 2배가 되면 $$x$$가 $$\frac{\log_{10}2}{2.1} \approx 0.143$$만큼, 거리로 $$35 \times 0.143 \approx 5.0$$ mm 옮겨 간다. 낮은 쪽은 다르다. 25 Hz에서 100 Hz까지(두 옥타브)가 2.6 mm 안에 몰리지만, 1 kHz에서 2 kHz까지(한 옥타브)는 4.5 mm를 쓴다. 꼭대기 근처에서는 주파수 차이가 자리 차이로 잘 펼쳐지지 않는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: Greenwood 함수의 양 끝 19.85 Hz와 20,677 Hz, 역함수로 되돌리기, 440/880/1,320 Hz의 자리 25.8·21.8·19.2 mm, 측정 봉우리 6개가 식과 2.5 mm 안에서 맞음, 높은 쪽 옥타브당 5.02 mm, 25~100 Hz 2.64 mm와 1~2 kHz 4.54 mm, 카드 C3·C4의 값 (계산으로 확인됨). 진행파 그림의 마루가 꼭대기 쪽으로 옮겨 가며 커지는 것은 모형 안에서 확인 — [50_cochlea-place-theory_verify.py](/Hongs_Blog/studies/human-interface-media/code/50_cochlea-place-theory_verify/), [50_cochlea-place-theory_plot.py](/Hongs_Blog/studies/human-interface-media/code/50_cochlea-place-theory_plot/)</div>

</div>


## 설명하는 것과 설명하지 못하는 것

| 장소설이 설명한다 | 장소설만으로는 설명하지 못한다 |
|---|---|
| 순음의 높이: 봉우리 자리가 주파수를 알려 준다 | 100 Hz 안팎보다 낮은 소리의 높이: 봉우리가 꼭대기 끝 몇 mm에 몰리고 넓게 퍼진다. 이 범위에서는 신경이 소리의 한 주기마다 맞춰 발화하는 시간 정보도 쓴다(시간 부호화)[^s6] |
| 복합음을 성분별로 나눠 듣기: 성분마다 봉우리가 따로 선다([음색](/Hongs_Blog/studies/human-interface-media/timbre/)) | 아주 작은 주파수 차이의 구별: 죽은 귀에서 잰 봉우리는 넓다. 살아 있는 귀에서는 바깥 유모세포가 봉우리 근처의 흔들림을 키워 봉우리를 뾰족하게 만든다[^s6] |
| 주파수가 가까운 소리가 서로를 가리는 현상: 기저막의 같은 자리를 흔든다([주파수 가림](/Hongs_Blog/studies/human-interface-media/frequency-masking/)) | 기본음 성분을 빼도 그 높이로 들리는 현상: 기본음의 자리는 흔들리지 않는데 그 높이가 들린다([소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/))[^s6] |
| 높은 소리부터 안 들리게 되는 난청: 바닥 쪽 유모세포가 상한다 | |

## 활용

- **고장 났을 때.** 바닥 쪽 유모세포가 상하면 높은 소리부터 안 들린다. 나이가 들면 높은 쪽 끝이 내려오고([가청 대역](/Hongs_Blog/studies/human-interface-media/range-of-hearing/)), 큰 소음에 오래 노출되면 3~6 kHz 근처의 문턱이 먼저 오른다(소음성 난청). 유모세포는 한번 죽으면 다시 자라지 않는다[^s7].
- **인공와우.** 달팽이관이 상한 사람에게 전극 여러 개가 달린 가는 줄을 달팽이관 안에 바닥부터 밀어 넣는다. 마이크로 받은 소리를 주파수 구간으로 나눠, 높은 구간은 바닥 쪽 전극으로, 낮은 구간은 안쪽 전극으로 청신경을 직접 자극한다. 장소설을 그대로 기계로 옮긴 것이다[^s7].
- **소리 압축.** MPEG 오디오는 소리를 32개 주파수 구간으로 나눈 뒤, 구간마다 귀가 못 알아챌 만큼만 정밀하게 저장한다. 달팽이관이 소리를 자리별로 나누는 것과 같은 꼴이다([MPEG 오디오 부호화](/Hongs_Blog/studies/human-interface-media/mpeg-audio/))[^s7].
- **가림의 방향.** 낮은 소리의 물결은 바닥 쪽(높은 소리 자리)을 지나가며 흔든다. 높은 소리의 물결은 꼭대기 쪽까지 가지 않는다. 그래서 낮은 소리가 높은 소리를 가리는 쪽이 그 반대보다 강하다([주파수 가림](/Hongs_Blog/studies/human-interface-media/frequency-masking/))[^s8].

## 연결

- 선수: [귀의 구조](/Hongs_Blog/studies/human-interface-media/ear-anatomy/) (난원창, 정원창, 액체), [고조파와 복합음](/Hongs_Blog/studies/human-interface-media/harmonics-complex-tone/) (성분)
- 높이와 음색이 생기는 곳: [소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/), [음색](/Hongs_Blog/studies/human-interface-media/timbre/)
- 같은 자리끼리 생기는 일: [주파수 가림](/Hongs_Blog/studies/human-interface-media/frequency-masking/), [임계 대역과 바크 스케일](/Hongs_Blog/studies/human-interface-media/critical-band-bark/)
- 수학으로 펼친 같은 그림: [스펙트럼과 스펙트로그램](/Hongs_Blog/studies/human-interface-media/spectrum-spectrogram/). 스펙트럼은 소리를 주파수 축 위에 펼친다. 달팽이관은 같은 일을 기저막 위의 자리로 한다.
- 신호 및 시스템: 기저막의 한 자리는 자기 주파수 근처만 크게 통과시키는 대역 통과 필터처럼 동작하고, 달팽이관 전체는 이런 필터를 수천 개 나란히 둔 필터 뱅크다([주파수 형성 필터와 주파수 선택 필터](/Hongs_Blog/studies/signals-and-systems/frequency-filters/))[^s9].
- 눈과 비교: 망막에서는 세포의 자리가 빛이 온 방향을 알려 주지만, 기저막에서는 세포의 자리가 소리의 주파수를 알려 준다([눈의 구조](/Hongs_Blog/studies/human-interface-media/eye-anatomy/), [귀의 구조](/Hongs_Blog/studies/human-interface-media/ear-anatomy/)).

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"달팽이관은 안쪽으로 갈수록 가늘어지니, 기저막도 꼭대기가 좁고 높은 소리를 맡는다"</div>

틀렸다. 달팽이관이라는 관 자체는 꼭대기로 갈수록 가늘어지므로, 그 안의 막도 그럴 것이라고 생각하기 쉽다. 실제로 기저막은 거꾸로 바닥에서 좁고 뻣뻣하며 꼭대기로 갈수록 넓고 낭창하다. 좁고 뻣뻣한 바닥이 빠른 떨림, 곧 높은 소리를 맡는다. 확인 방법: 베케시의 측정에서 1,600 Hz의 봉우리는 등자뼈에서 약 17 mm, 25 Hz는 꼭대기 끝(약 35 mm)에 있다. 높은 주파수일수록 등자뼈에 가깝다[^s8].

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"기저막에는 피아노 줄처럼 주파수마다 따로 떨리는 줄이 있다"</div>

틀렸다. 자리마다 맡은 주파수가 있다는 말에서 서로 떨어진 줄을 떠올리기 쉽다. 실제로 기저막은 한 장으로 이어진 막이라, 한 자리가 흔들리면 이웃도 끌려 움직인다. 그래서 흔들림은 바닥에서 꼭대기로 옮겨 가는 물결(진행파)이 되고, 봉우리도 한 점이 아니라 수 mm 너비로 퍼진다. 확인 방법: 그림 3의 포락선은 봉우리 앞쪽(바닥 쪽)으로 10 mm 넘게 꼬리를 끈다. 따로 떨어진 줄이라면 그 자리만 흔들려야 한다[^s8].

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 베케시의 장소설을 한 문장으로 쓰고, 기저막의 바닥(등자뼈 쪽)과 꼭대기가 각각 높은 소리와 낮은 소리 가운데 무엇을 맡는지 쓰라.</summary>


**답:** 소리의 주파수는 기저막을 따라 청신경 섬유가 가장 세게 발화하는(기저막이 가장 크게 흔들리는) 자리로 나타난다. 바닥은 높은 소리, 꼭대기는 낮은 소리를 맡는다.<br>
**흔한 오답:** 바닥과 꼭대기를 거꾸로 쓰는 것. 관이 안쪽으로 가늘어진다는 것과 기저막의 폭을 헷갈려서 생긴다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 기저막의 바닥이 높은 소리에 가장 크게 흔들리는 이유를 막의 폭과 뻣뻣함으로 설명하라.</summary>


**답:** 기저막은 바닥이 좁고 뻣뻣하며 꼭대기로 갈수록 넓고 낭창하다. 용수철이 뻣뻣할수록 빨리 떨듯이, 뻣뻣한 바닥은 빠른 떨림(높은 주파수)을 잘 따라가고 낭창한 꼭대기는 느린 떨림(낮은 주파수)을 잘 따라간다. 바닥에서 출발한 물결은 자기 주파수와 막의 성질이 맞는 자리에서 가장 커지므로, 높은 소리는 바닥 근처에서 봉우리를 이룬다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 사람의 Greenwood 함수 $$F(x) = 165.4\,(10^{2.1x} - 0.88)$$ Hz($$x$$는 꼭대기에서 잰 길이 비율)로 4 kHz를 맡는 자리 $$x$$를 구하고, 기저막 길이를 35 mm로 두어 바닥에서의 거리를 구하라.</summary>


**답:** $$10^{2.1x} = 4000/165.4 + 0.88 = 24.18 + 0.88 = 25.06$$. $$\log_{10} 25.06 = 1.399$$이므로 $$x = 1.399 / 2.1 \approx 0.666$$. 바닥에서 $$35 \times (1 - 0.666) \approx 11.7$$ mm.<br>
**흔한 오답:** $$x$$를 바닥에서 잰 비율로 읽어 $$35 \times 0.666 \approx 23.3$$ mm라고 쓰는 것. 이 식의 $$x$$는 꼭대기에서 잰다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 500 Hz, 1,000 Hz, 2,000 Hz를 섞은 소리가 들어온다. 기저막에 봉우리가 몇 개, 바닥부터 어떤 순서로 생기는지 쓰고, 각 봉우리가 바닥에서 대략 몇 mm에 서는지 C3의 식으로 구하라(길이 35 mm).</summary>


**답:** 봉우리 3개. 바닥부터 2,000 Hz(약 16.4 mm), 1,000 Hz(약 21.0 mm), 500 Hz(약 25.1 mm) 순이다. 시간 파형 한 줄이 기저막 위의 세 자리로 펼쳐진다.<br>
**흔한 오답:** 성분을 합친 파형의 되풀이 주파수(500 Hz) 자리에 봉우리 하나만 선다고 쓰는 것. 기저막은 합친 파형이 아니라 성분마다 반응한다.

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> 장소설만으로 설명하기 어려운 현상을 하나 들고, 왜 어려운지 쓰라.</summary>


**답:** 예 1: 100 Hz 안팎보다 낮은 소리의 높이. 낮은 주파수의 봉우리는 꼭대기 끝 몇 mm에 몰리고(25~100 Hz가 약 2.6 mm 안) 넓게 퍼져서 자리 차이가 작다. 이 범위에서는 신경이 소리의 주기에 맞춰 발화하는 시간 정보도 함께 쓴다. 예 2: 기본음 성분을 뺀 복합음도 기본음의 높이로 들린다. 기본음의 자리는 흔들리지 않으므로 "가장 크게 흔들린 자리 = 높이"로는 설명되지 않는다.

</details>

[^s1]: 세 성분의 자리는 Greenwood 함수(길이 35 mm)로 계산했고, 봉우리의 모양(바닥 쪽은 완만, 꼭대기 쪽은 가파름)은 설명용 모형이다. 그림은 [50_cochlea-place-theory_plot.py](/Hongs_Blog/studies/human-interface-media/code/50_cochlea-place-theory_plot/)로 그렸다.
[^s2]: 관 길이 약 35 mm, 액체(림프액), 두 통로가 꼭대기의 작은 구멍(helicotrema)으로 이어진다는 것, 섬모가 기저막과 개막의 어긋남으로 굽는다는 설명은 표준 청각 교재의 내용이다(예: Goldstein, *Sensation and Perception*의 청각 장; Moore, *An Introduction to the Psychology of Hearing*).
[^s3]: 사람의 자리-주파수 식은 Greenwood(1990, *Journal of the Acoustical Society of America* 87, 2592–2605)의 근사식이다. 길이 35 mm는 흔히 쓰는 어림값이다. Greenwood의 사람 식은 베케시의 측정을 포함한 자료에 맞춘 식이라, 두 값이 가까운 것은 독립된 확인이라기보다 같은 자료를 다시 본 것에 가깝다.
[^s4]: 기저막의 폭과 뻣뻣함이 바닥에서 꼭대기로 바뀐다는 것, 진행파의 모양은 베케시의 측정(von Békésy, *Experiments in Hearing*, 1960)에서 온 표준 내용이고, 베케시는 이 연구로 1961년 노벨 생리의학상을 받았다. 용수철의 고유 진동수 식은 이유를 보이기 위한 단순한 모형이다. 실제 기저막은 이웃끼리 이어져 있어 자리마다 따로 떨지 않는다.
[^s5]: 포락선은 바닥 쪽 폭 6 mm, 꼭대기 쪽 폭 1.2 mm의 가우스 꼴 두 개를 이었고, 위상은 꼭대기 쪽으로 갈수록 빨리 쌓이게($$3\pi (d/d_c)^2$$) 두었다. 같은 마루가 약 17.1 → 19.2 → 21.0 mm로 옮겨 가며 커지는 것은 plot.py 안의 검사로 확인했다.
[^s6]: 낮은 주파수에서 신경 발화가 소리의 주기에 맞춰지는 시간 부호화, 살아 있는 달팽이관에서 바깥 유모세포가 흔들림을 키워 봉우리를 날카롭게 만든다는 것, 기본음이 빠진 소리의 높이가 장소설만으로 설명되지 않는다는 것은 청각 교재의 표준 내용이다(예: Moore, *An Introduction to the Psychology of Hearing*). 시간 부호화가 넘겨받는 정확한 경계는 교재마다 다르다. 베케시는 죽은 사람의 달팽이관에서 흔들림을 쟀고, 그래서 봉우리가 살아 있는 귀보다 넓게 나왔다.
[^s7]: 소음성 난청이 3~6 kHz 근처에서 먼저 나타난다는 것, 사람의 유모세포가 다시 자라지 않는다는 것, 인공와우가 주파수 구간별 전극으로 청신경을 자극한다는 것, MPEG-1 오디오의 32개 부분 대역 필터 뱅크는 청각학과 오디오 부호화의 표준 내용이다.
[^s8]: 관은 가늘어지지만 기저막은 꼭대기에서 넓다는 것, 베케시 이전의 공명설(헬름홀츠: 자리마다 따로 떨리는 줄)과 진행파의 차이, 낮은 소리가 높은 소리를 더 잘 가리는 이유는 청각 교재의 표준 설명이다.
[^s9]: 달팽이관을 대역 통과 필터를 나란히 둔 필터 뱅크로 보는 것은 청각 모델링의 표준 관점이다. 안쪽 유모세포는 수천 개(교재에서는 흔히 약 3,500개)로 알려져 있다.
{% endraw %}
