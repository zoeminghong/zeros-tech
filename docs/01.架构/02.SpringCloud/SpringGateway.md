

## Read First

https://www.cnblogs.com/crazymakercircle/p/11704077.html#autoid-h3-11-1-0

https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#configuration-properties

[网关配置](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/appendix.html)



## 跨域

```yaml
spring:
  cloud:
    gateway:
      filter:
        remove-hop-by-hop: # 在调用目标服务的时候，移除配置的 header 信息。
          headers:
            - access-control-allow-credentials
            - access-control-allow-headers
            - access-control-allow-methods
            - access-control-allow-origin
            - access-control-max-age
      globalcors: # 跨域问题解决
        add-to-simple-url-handler-mapping: true
        cors-configurations:
          '[/**]':
            allowCredentials: true
            allowedOriginPatterns: "*"
            allowedHeaders: "*"
            allowedMethods: "*"
            maxAge: 3628800
```

https://blog.csdn.net/kwame211/article/details/107514290

测试跨域方式

```
// 在谷歌浏览器的 console 窗口下
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://127.0.0.1:7757/test/app');
xhr.send(null);
xhr.onload = function(e) {
    var xhr = e.target;
    console.log(xhr.responseText);
}
```

## Route

优先级

使用 order 配置项，order代表的优先级是从小往大排序的，即数值越小，优先级越高。

```
RoutePredicateHandlerMapping
DiscoveryClientRouteDefinitionLocator
RouteDefinitionLocator # 获取具体路由信息
RoutePredicateHandlerMapping =》RouteLocator=》RouteDefinitionLocator

PathRoutePredicateFactory

AbstractErrorWebExceptionHandler 异常情况
```

[路由定义定位器 RouteDefinitionLocator](https://www.cnblogs.com/liukaifeng/p/10055869.html)

[路由定位器 RouteLocator](https://www.cnblogs.com/liukaifeng/p/10055868.html)

[路由谓词工厂 RoutePredicateFactory](https://www.cnblogs.com/liukaifeng/p/10055867.html)

[路由谓词工厂WeightRoutePredicateFactory](https://www.cnblogs.com/liukaifeng/p/10055866.html)

[网关过滤器 GatewayFilter](https://www.cnblogs.com/liukaifeng/p/10055864.html)

[网关过滤器工厂 GatewayFilterFactory](https://www.cnblogs.com/liukaifeng/p/10055863.html)

[全局过滤器GlobalFilter](https://www.cnblogs.com/liukaifeng/p/10055862.html)

## Filter

核心处理类

- FilteringWebHandler 为 Filter 执行处理类，关注 filter、loadFilters 和 handle 两个方法。

优先级

在配置filter时，网关根据排序进行优先级的，第一个order为1，第二个order为2，如此规律进行。

```
AnnotationAwareOrderComparator # 比较排序
```





