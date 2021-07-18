[TOC]

# Hadoop

## Yarn 简介

Yarn 是 Hadoop 集群的资源管理系统。在 Hadoop 2.0 中被提出来，其为了将原先 1.0 中的资源管理器和任务调度监控进行独立。同时拓展 Hadoop 功能，使其不但支持 MapReduce 计算，还支持管理 Hive、Hbase、Pig、Spark/Shark 等应用。各个应用之间可以互不干扰的运行在同一个 Hadoop 系统中，共享整个集群资源。Yarn 的设计目标就是允许我们的各种应用以共享、安全、多租户的形式使用整个集群。

**Container**是 Yarn 对计算机计算资源的抽象，它其实就是一组 CPU 和内存资源，所有的应用都会运行在 Container 中。ApplicationMaster 是对运行在 Yarn 中某个应用的抽象，它其实就是某个类型应用的实例，**ApplicationMaster** 是应用级别的，它的主要功能就是向**ResourceManager**（全局的）申请计算资源（Containers）并且和 NodeManager 交互来执行和监控具体的 task。**Scheduler**是 ResourceManager 专门进行资源管理的一个组件，负责分配 NodeManager 上的 Container 资源，**NodeManager**也会不断发送自己 Container 使用情况给 ResourceManager。

### Container

- 就是一组**CPU 和内存资源**，所有的应用都会运行在 Container 中
- 是具体执行应用 task（如 map task、reduce task）的基本单位
- 一个节点会运行多个 Container，但一个 Container 不会跨节点
- 任何一个 job 或 application 必须运行在一个或多个 Container 中

### Node Manager

- NodeManager 进程运行在集群中的节点上，每个节点都会有自己的 NodeManager
- NodeManager 是一个 slave 服务：它负责接收 ResourceManager 的资源分配请求，分配具体的 Container 给应用
- 它还负责监控并报告 Container 使用信息给 ResourceManager。通过和 ResourceManager 配合，NodeManager 负责整个 Hadoop 集群中的资源分配工作
- ResourceManager 是一个全局的进程，而 NodeManager 只是每个节点上的进程，管理这个节点上的资源分配和监控运行节点的健康状态
- NodeManager 只负责管理自身的 Container，它并不知道运行在它上面应用的信息。负责管理应用信息的组件是 ApplicationMaster

### ResourceManager

- 负责系统的资源管理
- ResourceManager 主要有两个组件：Scheduler 和 ApplicationManager
- ResourceManager 只负责告诉 ApplicationMaster 哪些 Containers 可以用，ApplicationMaster 还需要去找 NodeManager 请求分配具体的 Container

#### Scheduler

- Scheduler 的角色是一个纯调度器，它只负责调度 Containers，不会关心应用程序监控及其运行状态等信息
- Scheduler 是一个可插拔的插件，它可以调度集群中的各种队列、应用等

#### ApplicationManager

- ApplicationManager 主要负责接收 job 的提交请求
- 为应用分配第一个 Container 来运行 ApplicationMaster，还有就是负责监控 ApplicationMaster，在遇到失败时重启 ApplicationMaster 运行的 Container

### Application Master

- 主要作用是向 ResourceManager 申请资源并和 NodeManager 协同工作来运行应用的各个任务然后跟踪它们状态及监控各个任务的执行，遇到失败的任务还负责重启它。
- Yarn 允许我们自己开发 ApplicationMaster，我们可以为自己的应用开发自己的 ApplicationMaster。这样每一个类型的应用都会对应一个 ApplicationMaster，一个 ApplicationMaster 其实就是一个类库
- 每种类型的应用都会对应着一个 ApplicationMaster，**每个类型的应用都可以启动多个 ApplicationMaster 实例**。所以，在 yarn 中，**是每个 job 都会对应一个 ApplicationMaster 而不是每类**

[Hadoop Yarn 详解](https://yq.aliyun.com/articles/5896)

## Yarn 执行流程

1. 应用程序提交
2. 启动应用的 ApplicationMaster 实例
3. ApplicationMaster 实例管理应用程序的执行

![image](http://aliyunzixunbucket.oss-cn-beijing.aliyuncs.com/csdn/27a9bedd-dbab-4981-9c81-9893fa9aafdd?x-oss-process=image/resize,p_100/auto-orient,1/quality,q_90/format,jpg/watermark,image_eXVuY2VzaGk=,t_100,g_se,x_0,y_0)

1. 客户端程序向 ResourceManager 提交应用并请求一个 ApplicationMaster 实例

2. ResourceManager 找到可以运行一个 Container 的 NodeManager，并在这个 Container 中启动 ApplicationMaster 实例

3. ApplicationMaster 向 ResourceManager 进行注册，注册之后客户端就可以查询 ResourceManager 获得自己 ApplicationMaster 的详细信息，以后就可以和自己的 ApplicationMaster 直接交互了

4. 在平常的操作过程中，ApplicationMaster 根据`resource-request`协议向 ResourceManager 发送 resource-request 请求

5. 当 Container 被成功分配之后，ApplicationMaster 通过向 NodeManager 发送`container-launch-specification`信息来启动 Container， `container-launch-specification`信息包含了能够让 Container 和 ApplicationMaster 交流所需要的资料

6. 应用程序的代码在启动的 Container 中运行，并把运行的进度、状态等信息通过`application-specific`协议发送给 ApplicationMaster

7. 在应用程序运行期间，提交应用的客户端主动和 ApplicationMaster 交流获得应用的运行状态、进度更新等信息，交流的协议也是`application-specific`协议

8. 一但应用程序执行完成并且所有相关工作也已经完成，ApplicationMaster 向 ResourceManager 取消注册然后关闭，用到所有的 Container 也归还给系统

## Hadoop 使用

注：[]中的**可替换**

### 查看文件列表

```
hadoop fs -ls [/user/admin/aaron]
```

### 创建文件目录

```
hadoop fs -mkdir [/user/admin/aaron/newDir]
```

### 删除文件

```
# 删除指定文件
hadoop fs -rm [/user/admin/aaron/needDelete]
# 删除所有文件
hadoop fs -rmr [/user/admin/aaron]
```

### 上传文件

```
hadoop fs –put [/home/admin/newFile] [/user/admin/aaron/]
```

### 下载文件

```
hadoop fs –get [/user/admin/aaron/newFile] [/home/admin/newFile]
```

### 查看文件

```
hadoop fs –cat [/home/admin/newFile]
```

### 文件权限

```
hadoop fs -chmod 777 [/hzzyz/dmp.gateway.source-dop.visit.collect_V2.txt]

hadoop fs -chmod [root:kylin]
```

### 提交 MAPREDUCE JOB

```
hadoop jar /home/admin/hadoop/[job.jar] [jobMainClass] [jobArgs]
```

### 杀死某个正在运行的 JOB

```
hadoop job -kill [job_201005310937_0053]
```

[hadoop_command_reference](https://www.tutorialspoint.com/hadoop/hadoop_command_reference.htm)

### 查看 HDFS 服务状态

使用 HDFS 用户进行操作

```
hdfs dfsadmin -report
```

## Yarn 任务日志

### 任务状态

```
yarn application -list -appStates ALL

yarn applicaiton -status application_1469094096026_26612
```

### 查看日志

```
# appOwner为用户名，默认是root
yarn logs -appOwner testdmp -applicationId application_1493700892407_0007
```

### 直接查看 hdfs 路径的 log

```
<property>
      <name>yarn.nodemanager.remote-app-log-dir</name>
      <value>/app-logs</value>
</property>
2）查看日志文件信息（注意日期和时间）
[hdfs@node1 root]$ hdfs dfs -ls /app-logs/hdfs/logs
Found 1 items
drwxrwx---   - hdfs hadoop          0 2017-05-02 04:18 /app-logs/hdfs/logs/application_1493700892407_0007

3）查看日志详情（注意查看节点重启前的几个敏感app）
yarn logs -applicationId application_1493700892407_0007（同2）
```
