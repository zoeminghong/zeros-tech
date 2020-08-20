# Spring Boot 参数校验

## 场景

### 多层级校验

List 对象中的类对象中的字段需要进行校验，如何生效呢？

使用 @Valid 注解方式，可以生效该功能。

```java
@Valid
private List<Demo> list;

public static class Demo{
	@NotBlank
	private String name;
}
```

### 列表长度校验

例如，图片地址信息，可能存在图片数量的限制。使用 @Size

```
@Size
private List<String> list;
```

