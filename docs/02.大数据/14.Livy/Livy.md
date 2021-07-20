---
title: Livy
date: 2021-07-18 21:55:02
permalink: /pages/e23cfe/
categories:
  - 大数据
  - Livy
tags:
  - 
---
# Livy

## 简介

### Livy 的三套接口

Livy 提供三套管理任务的接口分别是：

（1）使用 Using the Programmatic API，通过程序接口提交作业。

a) 需要继承 com.cloudera.livy.Job 接口编程，通过 LivyClient 提交

（2）使用 RestAPI 的 session 接口提交代码段方式运行

（3）使用 RestAPI 的 batch 接口提交 jar 包方式运行

### Livy 执行作业流程

Livy 的基本原理，客户端提交任务到 Livy server 后，Livy server 启动相应的 session，然后提交作业到 Yarn 集群，当 Yarn 拉起 ApplicationMaster 进程后启动 SparkContext，并连接到 Livy Server 进行通信。后续执行的代码会通过 Livy server 发送到 Application 进程执行。

**详细执行流程**

1. live-server 启动，启动 BatchSessionManager, InteractiveSessionManager。

2. 初始化 WebServer，通过 ServletContextListener 启动 InteractiveSessionServlet 和 BatchSessionServlet。

3. 通过 http 调用 SessionServlet 的 createSession 接口，创建 session 并注册到 sessionManager，InteractiveSession 和 BatchSession 会创建 SparkYarnApp，SparkYarnApp 负责启动 Spark 作业，并维护 yarnclient，获取作业信息、状态或 kill 作业。

4. BatchSession 是以 jar 包的方式提交作业，运行结束后 session 作业就结束（常驻内存任务，过一会儿时间就结束 session）。

5. InteractiveSession 会启动 com.cloudera.livy.repl.ReplDriver，ReplDriver 继承 RSCDriver，初始化期间会通过 RPC 连接到 livy-server，并启动 RpcServer；其次会初始化 Interpreter（支持 PythonInterpreter，SparkInterpreter，SparkRInterpreter）。接收来自 livy-server，并启动 RpcServer；其次会初始化 Interpreter（支持 PythonInterpreter，SparkInterpreter，SparkRInterpreter）。接收来自 livy-server 的信息（代码），然后通过 Interpreter 执行，livy-server 通过 RPC 请求作业结果。

## 使用

### API 方式调用

[Livy API Reference](https://github.com/cloudera/livy#prerequisites)

### 配置说明

`livy.server.access-control.enabled`

如果设置为 true ，需要与 `livy.server.access-control.users`连用，才能提交使用 REST 请求。

`livy.server.access-control.users`

用于授权可以使用 REST 请求的用户

`livy.superusers`

对于现有会话（已创建的会话），只有创建此会话的用户或 livy 超级用户（livy.superusers）才能访问此会话，包括提交语句，查询结果

`livy.impersonation.enabled`

开启用户代理，true 为开启代理。true 场景下 Kerberos 下会出现续租问题。

## 从架构方向思考

### Livy 存在的问题

1. 不支持提交 SQL

2. session，app 信息都维护在 livy-server，livy-server 挂掉信息丢失，需要 HA。

3. livy-server 的性能如何，能并行多少 session。

4. 多个 livy-server 如何管理？
