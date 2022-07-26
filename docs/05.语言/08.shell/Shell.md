---
title: Shell
date: 2021-07-18 21:55:02
permalink: /pages/fa2412/
categories: 
  - 语言
  - shell
tags: 
  - null
comment: true
---
## 文件格式

以`.sh`结尾

```
#!/bin/bash
```

## 语法

### 变量

```
username="${1}"
username=${1}

```

### 获取上一个执行结果

使用反引号`` (数字键 1 左边的键，tab 键上面，英文方式输入)

```shell
# 即将命令 echo "hello world"的输出赋给变量a
a=`echo "hello world"`
# 可以使用 $(()) 也是一样的
a=$(echo "hello world")
```

> 不过某些 unix 系统不支持\$()这种写法。但是``在任何 unix 或 linux 系统下都可以使用。

#### 获取执行成功与否

```
$?
```

`$?` 上一条语句的执行结果，成功返回 0，若为 1-255，则失败

### 退出 shell

```
exit
```

### 字符串通配符

```
*"吃啥"*
```

### 运算符

与或运算：&&，||, !

### 命令内部执行命令

比如：hbase shell 内部执行命令，应该怎办呢

```
printf "%b" "create_namespace ceshi" | hbase shell
```

### if 语句

```
if [ $? == 0 ]
then
echo '===generate keytab successed==='
else
echo '===generate keytab failure==='
exit
fi

if [ $a == $b ]
then
   echo "a is equal to b"
elif [ $a -gt $b ]
then
   echo "a is greater than b"
elif [ $a -lt $b ]
then
   echo "a is less than b"
else
   echo "None of the condition met"
fi
```

> 不能进行语句嵌套，且[ ... ]注意空格，推荐使用[[ ... ]]

### 列表

```shell
hosts_name=(
dev-dmp1.fengdai.org
dev-dmp2.fengdai.org
dev-dmp3.fengdai.org
dev-dmp4.fengdai.org
dev-dmp5.fengdai.org
dev-dmp6.fengdai.org
dev-dmp7.fengdai.org
dev-dmp8.fengdai.org
dev-dmp9.fengdai.org
dev-dmp10.fengdai.org
dev-dmp11.fengdai.org
)
```

### shell 命令返回结果赋值变量

```
a = `命令内容`
```

## 语法糖

### 创建用户

```
$(ssh root@dev-dmp1.fengdai.org 'useradd' ${username})
```

### 服务器间发送文件

```
scp ${fileName}  root@dev-dmp1.fengdai.org:/home/
```

### 查看指定端口服务

```shell
netstat -tupln | grep 2181
```

### 将 java 语句执行结果赋值给变量

参考：IFS

```shell
IFS=' ' read -r -a mvnEnv <<< `mvn -q -Dexec.executable='echo' -Dexec.args='${project.groupId} ${project.artifactId} ${maven.deploy.skip}' --non-recursive exec:exec`

```
