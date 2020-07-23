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

### @EnableCaching @Cacheable

Spring 的缓存技术还具备相当的灵活性，不仅能够使用 SpEL（Spring Expression Language）来定义缓存的 key 和各种 condition，还提供开箱即用的缓存临时存储方案，也支持和主流的专业缓存例如 EHCache 集成。

```java

public class Book {
	/**
	 * value : 缓存的名字  ,key ： 缓存map中的key
	 * @param id
	 * @return
	 */
    @Cacheable(value = { "sampleCache" },key="#id")
    public String getBook(int id) {
        System.out.println("Method executed..");
        if (id == 1) {
            return "Book 1";
        } else {
            return "Book 2";
        }
    }
}
```

### @ConditionalOnClass

当存在这个 Class 才启用。尽量使用name，不要使用 class 引用方式，如果项目不存在指定的类时，会导致项目无法启动。

```
@ConditionalOnClass(name = "com.aliyun.odps.jdbc.OdpsDriver")
```

