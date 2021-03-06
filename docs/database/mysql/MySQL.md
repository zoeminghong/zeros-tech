# MySQL

### 最左前缀匹配原则

非常重要的原则，`mysql`会一直向右匹配直到遇到范围查询(`>、<、between、like`)就停止匹配，比如`a ="1" and b="2" and c > "3" and d = "4"` 如果建立`(a,b,c,d)`顺序的索引，`d`是用不到索引的，因为`c`字段进行了范围查询，联合索引失效。如果建立`(a,b,d,c)`的索引则都可以用到，`a,b,d`的顺序可以任意调整。

## 使用与优化建议

❓以 In 主键方式性能如何？

- In 主键方式性能还是不错的，推荐使用 MySQL 5.5版本之后的，5.5 对 In 在性能上做了优化。

- 如果 In 的数据集合很大，可以通过拆分列表的方式实现。

- In 会根据最左前缀匹配原则执行。

  

## 索引

InnoDB 存储引擎在绝大多数情况下使用 B+ 树建立索引，这是关系型数据库中查找最为常用和有效的索引，但是 B+ 树索引并不能找到一个给定键对应的具体值，它只能**找到数据行对应的页**，数据库把整个页读入到内存中，并在内存中查找具体的数据行。

B+ 树是平衡树，它查找任意节点所耗费的时间都是完全相同的，比较的次数就是 B+ 树的高度。

## 常见问题

#### 更换默认 Port

```shell
# 命令行执行
semanage port -a -t mysqld_port_t -p tcp 3308

# /etc/my.cnf
vim /etc/my.cnf
port=3308
```

#### 保存表情报错

mysql中规定utf8字符的最大字节数是3，但是某些unicode字符转成utf8编码之后有4个字节，导致出错。

```bash
1.建表的时候添加如下限制：ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
2.在my.cnf上修改如下：
------------------my.cnf------------------------------------------------------
# For advice on how to change settings please see
# http://dev.mysql.com/doc/refman/5.6/en/server-configuration-defaults.html
[client]
default-character-set=utf8mb4
[mysql]
default-character-set = utf8mb4
 
sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
log-error=/var/log/mysqld.log
long_query_time=3
 
[mysqld]
character-set-client-handshake = FALSE
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
init_connect='SET NAMES utf8mb4'
 
#log-slow-queries= /usr/local/mysql/log/slowquery.log
```

