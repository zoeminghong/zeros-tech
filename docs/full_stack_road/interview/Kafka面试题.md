# Kafka面试题

Kafka 通过 zk 方式实现数据的一致性，当分区、副本、Broker、控制器、主题发生变更的时候，都会相应的反应到ZK上。

同时，一些操作行为也是通过修改ZK方式，异步触发broker数据。

### 为什么Kafka速度快？

- 使用 Partition，多分区进行数据的并行处理
- 通过拉取数据的方式，在消费端可以通过负载均衡器方式实现扩容
- 多个副本之间数据同步，是通过异步方式实现，只要 Leader 副本以及持久化成功，就认为消息成功
- 消费组，一个消费组下可以存在多个消费者
- 生产者支持无需确认方式发送数据
- 生产者数据以消息批次的方法发送，减少网络传输的资源损耗
- 分区 Leader 平衡策略

### Kafka 在存储空间上的优化？

- 采取 **稀疏索引存储** 方式，记录数据索引，但牺牲了查找效率
- 

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

### ProducerBatch 与 BufferPool 的关系？

当一条消息流入 RecordAccumulator 时，会先寻找与消息分区的所对应的双端对列，在这个双端队列的尾部获取一个 ProducerBatch，如果其空间还可以允许当前数据的大小，则将其写入该 ProducerBatch，如果不可以就新建一个 ProducerBatch ，再进行写入操作，ProducerBatch 大小根据 `batch.size` 来，如果当前这条数据大小已经超过 `batch.size` ，则按照实际大小创建 ProducerBatch 对象，如果是按照 `batch.size` 创建的 ProducerBatch ，这样在使用完这段内存区域之后，可以通过 BufferPool 的管理来进行复用，如果超过，则不会再被复用。

### Follower 副本同步？

Kafka 副本数据同步是副本自己去拉去 Leader 副本的数据。

### Kafka 的启动过程有哪些操作？

KafkaServer启动的工作时由KafkaServer.startup()来完成的，在此过程中将完成任务调度器、日志管理器、网络通信服务器、副本管理器、控制器、组协调器。动态配置管理器以及kafka健康状况检查等服务的初始化。

### 创建主题的流程？

- 在 `/brokers/topics` 目录下创建topic子节点
- 触发监听 `/brokers/topics` 目录的 TopicChangeListener 和监听 `/brokers/ids` 目录的 BrokerChangeListener 监听器
- 为该主题注册一个监听主题分区和副本变化的监听器
- 分区及副本的状态装换、分区 Leader 分配、分区存储日志文件的创建

### 删除主题的流程？

- 当客户端执行删除 Topic 操作时，在 ZK 的 `/admin/delete_topics` 路径下创建一个与待删除主题同名的节点，而实际的删除操作是异步交由 **控制器** 进行执行。

删除主题涉及 `/brokers/topics、/config/topics/ 和 /admin/delete_topics` 等节点数据的删除。

### 消息的构成？

| 关键字              | 解释说明                                                     |
| ------------------- | ------------------------------------------------------------ |
| 8 byte offset       | 在parition(分区)内的每条消息都有一个有序的id号，这个id号被称为偏移(offset),它可以唯一确定每条消息在parition(分区)内的位置。即offset表示partiion的第多少message |
| 4 byte message size | message大小                                                  |
| 4 byte CRC32        | 用crc32校验message                                           |
| 1 byte “magic”      | 表示本次发布Kafka服务程序协议版本号                          |
| 1 byte “attributes” | 表示为独立版本、或标识压缩类型、或编码类型                   |
| 4 byte key length   | 表示key的长度,当key为-1时，K byte key字段不填                |
| K byte key          | 可选                                                         |
| value bytes payload | 表示实际消息数据                                             |

### 分区自动平衡？

当存在分区所在节点发生宕机时，会进行分区自动平衡行为。

首先会根据当前分区所在的所有节点中，筛选出可以竞争 Leader 分区的候选节点（因为有些节点 Leader 分区率已经太高了，故不会考虑）

### 当分区副本分配不均衡的时候，可以怎么处理？

可以通过人工方式，指定分区副本分配方案。

### LogSegment 特点？

ActiveLogSegment 也就是活跃的日志分段拥有文件拥有写入权限，其余的 LogSegment 只有只读的权限。

### 索引文件记录的内容？

偏移量索引文件用于记录消息偏移量与物理地址之间的映射关系。时间戳索引文件则根据时间戳查找对应的偏移量。

### 触发切分SegmentLog文件条件？

1. 当前日志分段文件的大小超过了 broker 端参数 `log.segment.bytes` 配置的值。`log.segment.bytes` 参数的默认值为 1073741824，即 1GB。
2. 当前日志分段中消息的最大时间戳与当前系统的时间戳的差值大于 `log.roll.ms` 或 `log.roll.hours` 参数配置的值。如果同时配置了 `log.roll.ms` 和 `log.roll.hours` 参数，那么 `log.roll.ms` 的优先级高。默认情况下，只配置了 `log.roll.hours` 参数，其值为168，即 7 天。
3. 偏移量索引文件或时间戳索引文件的大小达到 broker 端参数 `log.index.size.max.bytes` 配置的值。`log.index.size.max.bytes` 的默认值为 10485760，即 10MB。
4. 追加的消息的偏移量与当前日志分段的偏移量之间的差值大于 `Integer.MAX_VALUE`，即要追加的消息的偏移量不能转变为相对偏移量。

### 索引文件切分过程

索引文件会根据 `log.index.size.max.bytes` 值进行预先分配空间，即文件创建的时候就是最大值，当真正的进行索引文件切分的时候，才会将其裁剪到实际数据大小的文件。这一点是跟日志文件有所区别的地方。其意义降低了代码逻辑的复杂性。

### 根据offset方式和timestamp方式查找数据？

### 日志清理策略？

Kafka 提供 `log.cleanup.policy` 参数进行相应配置，默认值：delete，还可以选择 compact。

基于时间的保留策略、基于日志大小的保留策略和基于日志其实偏移量的保留策略。这三个策略都配置的情况下，是根据谁先达到，就先执行。

### 是否支持针对具体的 Topic 进行配置？

答案是肯定的，主题级别的配置项是 `cleanup.policy` 。

### 根据时间日志删除的过程？

1. 日志对象中所维护日志分段的跳跃表中移除待删除的日志分段，保证没有线程对这些日志分段进行读取操作。
2. 这些日志分段所有文件添加 上 `.delete` 后缀。
3. 交由一个以 `"delete-file"` 命名的延迟任务来删除这些 `.delete` 为后缀的文件。延迟执行时间可以通过 `file.delete.delay.ms` 进行设置

**如果活跃的日志分段中也存在需要删除的数据时？**

Kafka 会先切分出一个新的日志分段作为活跃日志分段，然后执行删除操作。

### 根据文件大小删除过程

1. 计算需要被删除的日志总大小 (当前日志文件大小-retention值)。
2. 从日志文件第一个 LogSegment 开始查找可删除的日志分段的文件集合。
3. 执行删除。

### 基于时间戳的功能

1 根据时间戳来定位消息：之前的索引文件是根据offset信息的，从逻辑语义上并不方便使用，引入了时间戳之后，Kafka支持根据时间戳来查找定位消息

2 基于时间戳的日志切分策略

3 基于时间戳的日志清除策略