# Mybatis Plus 使用

## 场景

### NULL 值场景也更新

```java
    @TableField(updateStrategy = FieldStrategy.IGNORED)
    private String name;
```

