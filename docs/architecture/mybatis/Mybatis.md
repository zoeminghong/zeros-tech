# Mybatis

[Mybatis-Spring-Boot 文档](http://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/)

## 规约

- 如果存在一个同名 XML 配置文件，MyBatis 会自动查找并加载它（在这个例子中，基于类路径和 BlogMapper.class 的类名，会加载 BlogMapper.xml）
- 必须指定命名空间

## 面试题

### Mybatis 有哪些写 SQL 的方式？

XML 定义，也可以通过注解定义

### 命名解析规则是怎样的？

- 全限定名（比如 “com.mypackage.MyMapper.selectAllThings）将被直接用于查找及使用。
- 短名称（比如 “selectAllThings”）如果全局唯一也可以作为一个单独的引用。 如果不唯一，有两个或两个以上的相同名称（比如 “com.foo.selectAllThings” 和 “com.bar.selectAllThings”），那么使用时就会产生“短名称不唯一”的错误，这种情况下就必须使用全限定名。

### SqlSessionFactoryBuilder、SqlSessionFactory、SqlSession 各种作用？

SqlSessionFactoryBuilder：根据 mybatis 配置信息生成 SqlSessionFactory 对象

SqlSessionFactory：一个工厂类，用于创建和管理 SqlSession 对象，推荐使用单例模式，没有必要重复创建

SqlSession ：用于执行 SQL 命令，非线程安全，每次请求都需要重新创建

### 一个属性在不只一个地方进行了配置，读取顺序和优先级？

- 首先读取在 properties 元素体内指定的属性。
- 然后根据 properties 元素中的 resource 属性读取类路径下属性文件，或根据 url 属性指定的路径读取属性文件，并覆盖之前读取过的同名属性。
- 最后读取作为方法参数传递的属性，并覆盖之前读取过的同名属性。

因此，通过方法参数传递的属性具有最高优先级，resource/url 属性中指定的配置文件次之，最低优先级的则是 properties 元素中指定的属性。

### Mybatis 自动映射字段策略有哪些？

NONE 表示关闭自动映射；PARTIAL 只会自动映射没有定义嵌套结果映射的字段。 FULL 会自动映射任何复杂的结果集（无论是否嵌套）。默认是 PARTIAL 。

### MyBatis 可以得知该类型处理器处理的 Java 类型方式有哪些？

- 类型处理器的泛型
- 在类型处理器的配置元素（typeHandler 元素）上增加一个 `javaType` 属性（比如：`javaType="String"`），优先级最高
- 在类型处理器的类上增加一个 `@MappedTypes` 注解指定与其关联的 Java 类型列表。 如果在 `javaType` 属性中也同时指定，则注解上的配置将被忽略。

### resultMap与resultType区别

### objectFactory 作用？

为结果对象创建实例对象，ObjectFactory 接口很简单，它包含两个创建实例用的方法，一个是处理默认无参构造方法的，另外一个是处理带参数的构造方法的。 另外，setProperties 方法可以被用来配置 ObjectFactory，在初始化你的 ObjectFactory 实例后， objectFactory 元素体中定义的属性会被传递给 setProperties 方法。

### 事务管理器策略有哪些？

- JDBC – 这个配置直接使用了 JDBC 的提交和回滚设施，它依赖从数据源获得的连接来管理事务作用域。
- MANAGED – 这个配置几乎没做什么。它从不提交或回滚一个连接，而是让容器来管理事务的整个生命周期（比如 JEE 应用服务器的上下文）。 

### dataSource 数据源有哪些？

**UNPOOLED**– 这个数据源的实现会每次请求时打开和关闭连接。虽然有点慢，但对那些数据库连接可用性要求不高的简单应用程序来说，是一个很好的选择。

**POOLED**– 这种数据源的实现利用“池”的概念将 JDBC 连接对象组织起来，避免了创建新的连接实例时所必需的初始化和认证时间。 这种处理方式很流行，能使并发 Web 应用快速响应请求

**JNDI** – 这个数据源实现是为了能在如 EJB 或应用服务器这类容器中使用，容器可以集中或在外部配置数据源，然后放置一个 JNDI 上下文的数据源引用。

### resultType 需要注意什么？

如果返回的是集合，那应该设置为集合包含的类型，而不是集合本身的类型

### useCache？

将其设置为 true 后，将会导致本条语句的结果被二级缓存缓存起来，默认值：对 select 元素为 true。

### 二级缓存？

缓存只作用于 cache 标签所在的映射文件中的语句。如果你混合使用 Java API 和 XML 映射文件，在共用接口中的语句将不会被默认缓存。你需要使用 @CacheNamespaceRef 注解指定缓存作用域。

缓存与命名空间绑定，相同的命名空间下的每条语句可以通过 `flushCache="false" useCache="true" ` 这些配置项进行自定义控制。

### Java 下如何实现动态SQL？

使用 `<script>` 标签进行包裹

statementType

resultSetType

FORWARD_ONLY，SCROLL_SENSITIVE, SCROLL_INSENSITIVE 或 DEFAULT（等价于 unset） 中的一个，默认值为 unset （依赖数据库驱动）。

```
XMLMapperBuilder
XMLStatementBuilder
XMLConfigBuilder
XPathParser
SqlSessionFactoryBean
```

MappedStatement：封装每个sql语句的配置信息

MapperBuilderAssistant：负责管理MappedStatement内容

MybatisMapperRegistry：负责mapper注册

