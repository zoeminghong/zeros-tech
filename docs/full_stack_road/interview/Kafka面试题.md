# Kafka

Kafka 通过 zk 方式实现数据的一致性，当分区、副本、Broker、控制器、主题发生变更的时候，都会相应的反应到ZK上。

### 为什么Kafka速度快？

- 使用 Partition，多分区进行数据的并行处理
- 通过拉取数据的方式，在消费端可以通过负载均衡器方式实现扩容
- 多个副本之间数据同步，是通过异步方式实现，只要 Leader 副本以及持久化成功，就认为消息成功
- 消费组，一个消费组下可以存在多个消费者
- 生产者支持无需确认方式发送数据

### 什么是 HW 和 LEO？

HW：它标示了一个特定的消息偏移量，消费者只能拉取到这个 offset **之前**的消息。

LEO：它标示当前日志文件中下一条待写入消息的 offset，LEO 的大小相当于当前日志分区中最后一条消息的 offset 值加 1。

### AR、ISR、OSR 之间的区别？

AR：所有副本（包括 Leader 副本）分区集合。

ISR：所有与 Leader 副本保持数据同步的副本（包括 Leader 副本）分区集合。

OSR：与 Leader 副本数据存在同步滞后的分区集合。

### 说说控制器？

Kafka在启动的时候，每个代理都会实例化一个 kafkaController，并将该代理的brokerId 注册到 Zookeeper 的相应节点当中。Kafka集群会选出一个代理作为 Leader，即 Leader 控制器。

- 负责主题的创建与删除
- 分区的管理
- 副本的管理
- 代理故障转移处理

### 如何知道leader控制器发生了变更？

- **controller_epoch:** 用于记录 `Leader Controller` 的变更次数，从 0 开始。每每变更一次，就加 1，若请求的中的 controller_epoch 值与服务端值不一致，就意味着 `Leader Controller` 发生了变更。该值在 ZK 中位于 `/controller_epoch` 目录。
- 监听器监听 zk的 `/controller` 路径下的变更，一旦有变更就会通过回调方法进行通知，从而进行相关处理。

### 优先副本？

在 AR 列表中位于第一个的副本成为优先副本。正常情况下，优先副本就是 Leader 副本。Kafka 要尽可能的保证优先副本在代理集群中均匀分布，保证服务的负载均衡。

### 控制器初始化时做了哪些事？

- 创建一个 ControllerContext 实例对象，该对象用于缓存控制器的各种对立操作所需要的数据结构。

- 实例化用于维护和管理**分区**状态的状态机 
- 实例化一个对**副本**状态管理的状态机 ReplicaStateMachine
- 创建用于将当前代理选举为**控制器**的 ZooKeeperLeaderElector 选举器对象。
- 声明一个对主题操作管理的 TopicDeletionManager 对象。
- 创建分区选举出 Leader 副本的分区选举器 PartitionLeaderSelector
- 实例化监听分区变化、副本变化的监听器

### Leader 控制器选举？

当代理获取 zk 的 `/controller` 节点获取 leader 信息，若得到的 leaderId 为-1，则表示 Leader 还未被选举产生，则代理封装自己的 brokerId 信息写入到 `/controller` ，如果在更新信息的时候，如果出现异常，就进行数据回滚。

### KafkaProducer 线程安全吗？

KafkaProducer 线程安全，支持多个线程共享同一个实例对象。

### ProducerRecord 包含哪些信息？

topic、partition、headers、key、value、timestamp

### ProducerRecord 中的时间戳有哪两种？

**它有 CreateTime 和 LogAppendTime 两种类型**，前者表示消息创建的时间，后者表示消息追加到日志文件的时间。