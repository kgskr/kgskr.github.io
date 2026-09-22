---
title: 'OAuth'
description: '인증인가2'
pubDate: 2026-09-21
tags: ['기술','OIDC']
readingTime: '3분'
draft: true
---
### 시리즈
- [1 - 인증 인가 기본편](/blog/auth-wildcard/)
- [2 - OAuth편](/blog/auth-oauth/)

---
*유사 기술 블로그를 가장하기 위한 글입니다. 틀린 내용이 있을 수 있으며 도움이 되지 않을 가능성이 높습니다.*

전편에 이야기 한 OAuth는 `인가 - AuthZ`만을 담당 한다고 말씀 드렸습니다. 그럼 인증은 어떻게 하면 좋을까요?

인증에는 OAuth2.0에 `인증- AuthN` 프로토콜을 더한 OIDC(OpenID Connect)를 사용 할 수 있습니다. 요즘 들어 다양한 곳에서 사용되고 있는 인증방식입니다.  
SSO(Single Sign On - 한곳에서 인증받은 것으로 다른 곳에서도 인증을 받을 수 있게 하는 기술) 를 구현하는데 사용되어 일상생활에서도 많이 볼 수 있고, 서버간의 통신에서 장기 신원인증 키 대신 OIDC 인증으로 자주 만료되는 단기 신원인증 키를 필요할때 마다 발급하여 사용하는 방식으로도 사용 되곤 합니다.

---

OAuth 2.0에서는 해주지 않는 `인증` 그리고 사용자 ID Claim의 표준화 요소를 보완합니다. OIDC는 OAuth 2.0의 위에서 인증까지 할 수 있게 만든 표준인 것입니다.

---





참고 문서
- OIDC란?   
https://www.microsoft.com/ko-kr/security/business/security-101/what-is-openid-connect-oidc
- OAuth(오픈 인증)란 무엇인가요?  
https://www.ibm.com/kr-ko/think/topics/oauth
