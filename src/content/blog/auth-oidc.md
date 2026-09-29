---
title: 'OIDC'
description: '인증인가3'
pubDate: 2026-09-29
tags: ['기술','OIDC']
readingTime: '5분'
draft: false
---
### 시리즈
- [1 - 인증 인가 기본편](/blog/auth-wildcard/)
- [2 - OAuth편](/blog/auth-oauth/)

---
*이 글은 LLM을 통해 일부 작성된 글입니다. Codex의 나처럼 써줘(Write like me) 플러그인 테스트를 겸하고 있습니다.*

전편에 이야기한 OAuth는 `인가 - AuthZ`를 담당한다고 말씀드렸습니다. 그럼 인증은 어떻게 하면 좋을까요?

인증에는 OAuth 2.0에 `인증 - AuthN` 기능을 더한 OIDC(OpenID Connect)를 사용할 수 있습니다. 소셜 로그인이나 SSO(Single Sign-On)를 구현하는 데 사용되어 일상생활에서도 자주 만나게 되는 기술입니다.

이름은 조금 낯설지만, 구글 계정으로 다른 서비스에 로그인해 보셨다면 이미 사용해 보셨을 가능성이 높습니다. 전편에서 미뤄두었던 소셜 로그인 이야기를 조금 더 해보겠습니다.

---

OAuth로도 구글에서 사용자 정보를 가져올 수 있는데, 왜 OIDC라는 게 따로 필요한 걸까요?

OAuth는 리소스에 접근할 권한을 얻는 방법을 정해두었습니다. 하지만 '지금 로그인한 사람이 누구인지, 어떤 방식으로 그 결과를 전달할지'까지 표준으로 정해두지는 않았습니다. 서비스마다 다른 방식으로 사용자 정보를 받아 로그인에 활용할 수는 있겠지만, 공통된 약속이 부족했던 것이죠.

OIDC는 이 부분을 보완합니다. 인증 결과를 `ID Token`이라는 정해진 형식으로 전달하고, 사용자 정보를 표현하는 이름과 의미도 정해둡니다. [OIDC 표준](https://openid.net/specs/openid-connect-core-1_0.html#Introduction)에서 OAuth 2.0 위에 인증 계층을 더했다고 설명하는 이유입니다.

전편의 캘린더 서비스를 다시 떠올려 보면 아래처럼 나눌 수 있습니다.

- Access Token - 구글 캘린더 API에 일정을 요청할 때 사용하는 토큰
- ID Token - 캘린더 서비스가 로그인한 사용자를 확인할 때 사용하는 토큰

둘 다 토큰이지만 용도가 다릅니다. ID Token을 구글 캘린더에 보내면 일정을 꺼내주는 것은 아닙니다.

---

그럼 실제로 로그인할 때는 어떤 일이 일어날까요?

이번에는 서버가 있는 캘린더 서비스에서 구글 계정으로 로그인하는 상황을 가정하겠습니다. [구글의 OIDC 문서](https://developers.google.com/identity/openid-connect/openid-connect#server-flow)에 나온 권한 부여 코드 방식으로 간략하게 설명하면 아래와 같습니다.

1. 사용자가 캘린더 서비스에서 '구글로 로그인'을 누릅니다.
2. 캘린더 서비스는 사용자를 구글의 인증 화면으로 보냅니다. 이때 요청하는 범위인 `scope`에 `openid`를 포함합니다.
3. 구글은 사용자를 인증하고, 필요한 정보 제공 동의를 받습니다.
4. 구글은 사용자의 브라우저를 캘린더 서비스로 돌려보내며 권한 부여 코드를 전달합니다.
5. 캘린더 서비스의 서버는 이 코드를 구글에 보내 ID Token과 Access Token을 받습니다.
6. ID Token을 검증하고, 확인된 사용자를 서비스의 회원 정보와 연결해 로그인을 처리합니다.

구글 비밀번호는 구글에 입력하고, 캘린더 서비스는 구글이라는 IdP가 준 인증 인가 결과를 받는 것입니다. 

---

그럼 ID Token 안에는 뭐가 들어 있을까요?

ID Token은 JWT(JSON Web Token) 형식이며, 안에 담긴 각각의 정보를 `Claim`이라고 부릅니다. 이름은 거창하지만 '누가 발급했는지', '누구에 관한 토큰인지' 같은 항목들입니다.

대표적인 항목은 아래와 같습니다.

- `iss` - 토큰을 발급한 곳
- `sub` - 발급한 곳에서 사용자를 구분하는 식별자
- `aud` - 이 토큰을 받을 대상으로 지정된 클라이언트
- `exp` - 토큰의 만료 시각
- `iat` - 토큰의 발급 시각

사용자를 구분할 때는 이메일만 믿기보다 `iss`와 `sub`의 조합을 사용합니다. 이메일은 바뀔 수 있고, 서로 다른 발급자가 같은 `sub` 값을 사용할 수도 있기 때문입니다. 각 항목의 의미는 [ID Token 규격](https://openid.net/specs/openid-connect-core-1_0.html#IDToken)에 정의되어 있습니다.

물론 토큰 안에 사용자 이름이 적혀 있다고 곧바로 믿으면 안 됩니다. 발급자의 서명, 기대한 발급자가 맞는지, 우리 서비스에 발급한 것인지, 만료되지 않았는지 등을 검증해야 합니다. 요청에 `nonce`라는 일회성 값을 보냈다면 응답에도 같은 값이 들어 있는지 확인해야 합니다. JWT의 [검증 절차](https://developers.google.com/identity/openid-connect/openid-connect#validatinganidtoken)도 빠트리면 안 됩니다.

---

처음에 이야기한 SSO와는 어떤 관계일까요?

SSO는 한 번, 한곳에서 인증한 것으로 다른 곳에서도 인증할 수 있게 하는 것입니다. OIDC는 SSO라는 인증방식을 구현할 때 사용할 수 있는 프로토콜 중 하나입니다. SAML이라는 방식이 대표적인 다른 SSO 구현 방식인데, 기회가 되면 관련한 글을 적어보도록 하겠습니다. 

구글 로그인으로 다른곳에서도 인증을 받아 해당 서비스를 가입한 것처럼 사용할 수 있는게 SSO 인데, 그걸 구현하는 방식 중 하나다~ 라는 것이지요.   

---

일반적으로는 SSO 방식이 가장 많이 접하게 되는 사용 사례이겠지만, 사람이 로그인할 때만 사용하는 것은 아닙니다.

이전에 [장송](/blog/frieren/) 글에서 잠깐 이야기한 WIF(Workload Identity Federation)에서도 OIDC를 활용할 수 있습니다. 여기서는 사람 대신 실행 중인 작업의 신원을 확인합니다.

[GitHub Actions에서 클라우드에 접근하는 경우](https://docs.github.com/en/actions/concepts/security/openid-connect)를 예로 들면 아래와 같습니다.

1. 클라우드에 GitHub를 신뢰할 발급자로 등록하고, 어떤 저장소나 브랜치 등의 조건(sub)을 허용할지 정합니다.
2. 실행 중인 작업이 GitHub에 자신의 신원을 나타내는 OIDC 토큰을 요청합니다.
3. 작업은 이 토큰을 클라우드에 제출합니다.
4. 클라우드는 토큰과 허용 조건을 검증한 뒤, 해당 작업에 단기 자격 증명을 발급합니다.

이후 실제 클라우드 API를 호출할 때는 발급받은 단기 자격 증명을 사용합니다.

AWS의 공식 Github Actions 인증 Action은 AK,SK같은 장기 자격증명이 아닌 이 방식을 통한 권한 획득을 추천하고 있습니다.  

초기 설정이 기존 키방식 인증보다는 약간 불편 할 수 있으나 이후 관리를 생각하면 충분히 상쇄 될 수 있는 부분이라 생각하고, 빈번히 일어나곤 하는 키 유출등의 사태에서도 어느정도 자유로워 사용하실 수 있다면 사용하시는게 좋지 않을까 생각합니다.

당연한 이야기지만 인가되는 권한에 관련된 문제는 별개이기 때문에 잊으시면 안됩니다.

---

요즘 많은 곳에서 사용되고 있는 OIDC에 대해 정리해 보았습니다. 뭔지도 모르고 사용했었던 시절도 있었고, 대충 알고 있던 시절도 있었습니다. 여전히 잘 아는건 아니지만 많은 곳에서 사용되고, 사용 될 기술이니 만큼 다시한번 정리 할 수 있는 시간을 가질 필요가 있던 것 같습니다.

---

참고 문서

- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [Google OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect)
- [Microsoft - OIDC란?](https://www.microsoft.com/ko-kr/security/business/security-101/what-is-openid-connect-oidc)
- [GitHub Actions - OpenID Connect](https://docs.github.com/en/actions/concepts/security/openid-connect)
