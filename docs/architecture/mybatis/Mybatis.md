# Mybatis

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