OAuth

https://my.oschina.net/merryyou/blog/1612112

[https://www.funtl.com/zh/spring-security-oauth2/%E5%9F%BA%E4%BA%8E-RBAC-%E7%9A%84%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AE%A4%E8%AF%81.html#%E9%80%9A%E8%BF%87%E6%8E%88%E6%9D%83%E7%A0%81%E5%90%91%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%94%B3%E8%AF%B7%E4%BB%A4%E7%89%8C](https://www.funtl.com/zh/spring-security-oauth2/基于-RBAC-的自定义认证.html#通过授权码向服务器申请令牌)

```java
  @GetMapping("/user")
    @PreAuthorize("hasAuthority('ROLE_NORMAL')")
    public Object getCurrentUser1(Authentication authentication, HttpServletRequest request) throws UnsupportedEncodingException {
        SecurityContextHolder.getContext().getAuthentication();
        String header = request.getHeader("Authorization");
        String token = header.substring("bearer ".length());

        Claims claims = Jwts.parser().setSigningKey("s^k%fx&QnE1k^of*".getBytes("UTF-8")).parseClaimsJws(token).getBody();
        String blog = (String) claims.get("blog");
        log.info("【SecurityOauth2Application】 getCurrentUser1 blog={}", blog);

        return authentication;
    }
```

