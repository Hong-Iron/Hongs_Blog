---
layout: "note"
title: "65_password-salt_verify.py"
display_title: "65_password-salt_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "65"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/user-authentication/"
parent_title: "사용자 인증"
description: "운영체제 · 사용자 인증 검증 코드"
permalink: "/studies/operating-systems/code/65_password-salt_verify/"
---
{% raw %}
[사용자 인증](/Hongs_Blog/studies/operating-systems/user-authentication/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""솔트를 쓴 비밀번호 저장 (Stallings 15.1절, 그림 15.1).
저장: (사용자 ID, 솔트, hash(솔트 + 비밀번호)). 확인: 저장된 솔트로 다시 해시해 비교한다.
느린 해시로 PBKDF2를 쓴다."""
import hashlib
import hmac
import os


def store(pw, salt=None, rounds=10_000):
    salt = salt if salt is not None else os.urandom(16)
    return salt, hashlib.pbkdf2_hmac("sha256", pw.encode(), salt, rounds)


def verify(pw, salt, h, rounds=10_000):
    return hmac.compare_digest(hashlib.pbkdf2_hmac("sha256", pw.encode(), salt, rounds), h)


if __name__ == "__main__":
    s1, h1 = store("hunter2")
    s2, h2 = store("hunter2")
    assert verify("hunter2", s1, h1) and not verify("hunter3", s1, h1)
    assert h1 != h2                                  # 같은 비밀번호도 솔트가 다르면 저장값이 다르다
    # 솔트 없이 해시하면 같은 비밀번호가 같은 값으로 드러난다
    assert hashlib.sha256(b"hunter2").digest() == hashlib.sha256(b"hunter2").digest()
    # 사전 공격 비용: 단어 W개, 솔트 b비트 -> 미리 만들 표는 W * 2^b개
    W, b = 10 ** 6, 12
    assert W * 2 ** b == 4_096_000_000
    print("ALL CHECKS PASSED")
```
{% endraw %}
