---
layout: "note"
title: "04_alphabet-string-language_verify.py"
display_title: "04_alphabet-string-language_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/alphabet-string-language/"
parent_title: "알파벳·문자열·언어"
description: "컴파일러 · 알파벳·문자열·언어 검증 코드"
permalink: "/studies/compilers/code/04_alphabet-string-language_verify/"
---
{% raw %}
[알파벳·문자열·언어](/Hongs_Blog/studies/compilers/alphabet-string-language/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 알파벳·문자열·언어: 슬라이드 L02 p.13~17의 예와 성질을 파이썬 문자열과 집합으로 확인한다
# 실행: python3 04_alphabet-string-language_verify.py   (표준 라이브러리만 쓴다)
import itertools


def concat(L1, L2):
    return {s1 + s2 for s1 in L1 for s2 in L2}


def power(L, i):
    out = {""}                      # L^0 = {ε}
    for _ in range(i):
        out = concat(out, L)        # L^i = L^(i-1) L
    return out


def star_upto(L, max_len):
    """L*에서 길이 max_len 이하인 문자열만 모은다."""
    out, frontier = {""}, {""}
    while frontier:
        frontier = {s for s in concat(frontier, L) if len(s) <= max_len} - out
        out |= frontier
    return out


def all_strings(alphabet, max_len):
    return {"".join(t) for k in range(max_len + 1) for t in itertools.product(alphabet, repeat=k)}


if __name__ == "__main__":
    # p.14: 길이와 이어 붙이기
    assert len("compiler") == 8
    assert "CSE" + "@" + "CAU" == "CSE@CAU"
    words = sorted(all_strings("ab", 4))
    assert all(len(s1 + s2) == len(s1) + len(s2) for s1 in words for s2 in words)
    # 원본 오류 의심: "s1 ≠ s2 이면 s1s2 ≠ s2s1" 의 반례
    assert "a" != "aa" and "a" + "aa" == "aa" + "a" == "aaa"
    assert "ab" + "abab" == "abab" + "ab"
    assert "ab" + "ba" != "ba" + "ab"                     # 보통은 순서를 바꾸면 달라진다
    commuting = [(s1, s2) for s1 in words for s2 in words if s1 != s2 and s1 + s2 == s2 + s1]
    assert ("a", "aa") in commuting and len(commuting) > 0
    # 길이 4 이하에서 순서를 바꿔도 같은 쌍은 모두 "같은 조각을 되풀이한 것"이다
    for s1, s2 in commuting:
        if s1 and s2:
            assert any(s1 == w * (len(s1) // len(w)) and s2 == w * (len(s2) // len(w))
                       for k in range(1, len(s1) + 1) for w in [s1[:k]] if len(s1) % k == 0 and len(s2) % k == 0)
    # p.15: 빈 문자열과 거듭 쓰기
    assert len("") == 0 and "" + "ab" == "ab" == "ab" + "" and "a" + "" + "b" == "ab"
    s = "ab"
    assert s * 0 == "" and s * 1 == s and s * 3 == "ababab" and s * 3 == s * 2 + s

    # p.13: 유한 언어와 무한 언어
    L1 = {"a", "ab", "ba", "aba"}
    assert L1 <= all_strings("ab", 3) and len(L1) == 4
    assert len(all_strings("ab", 3) - {""}) == 2 + 4 + 8            # 길이 3까지만 해도 14개, 길이를 늘리면 끝이 없다
    # p.16: 언어의 연산
    assert {"a", "ab"} | {"b", "aa"} == {"a", "b", "ab", "aa"}
    assert concat({"a", "ab"}, {"b", "aa"}) == {"ab", "aaa", "abb", "abaa"}
    L = {"a", "ab"}
    assert power(L, 0) == {""} and power(L, 1) == L and power(L, 2) == {"aa", "aab", "aba", "abab"}
    assert power(L, 3) == concat(power(L, 2), L)
    # 이어 붙이기는 순서를 바꾸면 다른 언어가 된다
    assert concat({"b", "aa"}, {"a", "ab"}) == {"ba", "bab", "aaa", "aaab"} != concat({"a", "ab"}, {"b", "aa"})
    # p.17: 클레이니 닫힘과 양의 닫힘
    Z = {"0"}
    assert star_upto(Z, 4) == {"", "0", "00", "000", "0000"}
    assert star_upto(Z, 4) - {""} == {"0", "00", "000", "0000"}     # L+ = L* - {ε}  (ε이 L에 없을 때)
    assert star_upto({"a", "b"}, 5) == all_strings("ab", 5)          # Σ* = 모든 문자열
    # L+ = L* - {ε} 는 ε ∈ L 이면 틀린다
    Le = {"", "a"}
    plus = set().union(*[power(Le, i) for i in range(1, 5)])
    assert "" in plus and "" not in (star_upto(Le, 4) - {""})
    # 카드 값
    assert concat({"a", "b"}, {"", "c"}) == {"a", "b", "ac", "bc"}
    assert power({"0", "11"}, 2) == {"00", "011", "110", "1111"}
    assert len(concat({"a", "aa"}, {"a", "aa"})) == 3                # {aa, aaa, aaaa}: 겹쳐서 4개가 안 된다
    assert power(set(), 0) == {""} and star_upto(set(), 3) == {""}  # 빈 언어의 닫힘은 {ε}
    print("ALL CHECKS PASSED")
```
{% endraw %}
