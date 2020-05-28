# Spring Boot 注解字典

### @Import

1. 允许使用@Configuration注解的类

这个比较简单，如果明确知道需要引入哪个配置类，直接引入就可以。

2. 允许是实现ImportSelector接口的类

如果并不确定引入哪个配置类，需要根据@Import注解所标识的类或者另一个注解(通常是注解)里的定义信息选择配置类的话，用这种方式。

场景：

spring 自动扫描的时候，通过路径配置扫描不到的java文件，可以通过 @Import 方式直接引用。

### @ConfigurationProperties

参数注入

```java
@ConfigurationProperties(prefix = "permission")
public class DataPermissionProperties {

    private String user;
    private String password;
}
```

