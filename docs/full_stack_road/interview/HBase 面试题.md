# HBase 面试题

### 为什么 HBase 不适合做批量扫描数据？

HBase是LSM-Tree架构的数据库，这导致了HBase读取数据路径比较长，从内存到磁盘，可能还需要读多个HFile文件做版本合并。

### 如何解决热点问题？

- 使用 UUID
- 时间戳倒序

### HBase 查数据

客户端根据某个 RowKey 查找时，其会到 **Zookeeper 里面找到 HBase 的 meta 信息表存储的 RegionServer**。然后到这个 RegionServer 里面查找对应表的某个 RowKey 是由哪个 RegionServer 管理的。最后到这个 RegionServer 找到相应的数据。

### HBase 写入的过程

在默认情况下，当客户端发出插入或更新操作，这些请求被立即发送到对应的 RegionServer。但是为了提高吞吐量，一般我们会将**数据缓存（通过关闭 autoflush 选项）在客户端**，然后再以批处理的形式提交到 HBase。当 autoflush 被关闭，我们可以通过调用 flush 来提交更新请求，或者通过 **`hbase.client.write.buffer` 参数配置缓存的大小**，当缓存满了也会触发程序提交更新请求。

### HBase 如何保障写的速度快

- 数据客户端进行缓冲，批量提交
- 客户端缓存 Meta 元数据信息，不用每次HBase操作都查询一遍
- 每次 memStore 刷写数据，都会**新创建一个文件**
- 不在原有数据上进行修改

### HBase 是什么时候进行数据的排序的

### HBase 的删除操作

**delete 数据并不是把原有的数据立即删除**，而仅仅是做一个标记操作，真实的数据会在后面的 `Major Compaction` 过程中删除的。

### HBase 如何防止存在小文件？

数据不直接存储到 HFile ，而是先存储到 memStore 中，数据量达到一定数量级之后，刷写到一个新的 HFile 中。

### MemStore 的特点

- 一个列族一个 MemStore
- 纯内存
- **同一个 Region 里面可能会包含多个 MemStore**。
- 会对数据进行排序，再刷写到 HFile 中
- 当一个 MemStore flush 发生时，**属于同一个 region 的 memStore 会一起 flush** 。
- 在持久化写入之前，在内存中对 Rows/Cells 可以做某些优化。比如，当数据的 version 被设为1的时候，对于某些 CF 的一些数据，Memstore 缓存了数个对该 Cell 的更新，在写入 HFile 的时候，仅需要保存一个最新的版本就好了，其他的都可以直接抛弃。

### MemStore Flush 触发情况

- MemStore 的大小达到单个 MemStore 阀值
- RegionServer 中所有 MemStore 使用率超过 RegionServer 中 MemStore 上限值，**该 Server 上所有 MemStore 会执行 flush** ，从资源占用最大的 MemStore 开始 flush，直到完成或者小于 RegionServer 中 MemStore 安全值
- RegionServer 中WAL 超过 WAL 阀值

#### 频繁 Flush 导致的小文件问题如何解决？

HBase 有专门的 HFile 合并处理 (HFile Compaction Process)。HBase 会周期性的合并数个小HFile为一个大的 HFile。

> 这里的HFile 合并处理与 Region合并是两个不同的操作。

### HBase 如何防止 MemStore 异常导致数据丢失？

HBase 中加入了 WAL，在追加数据到 MemStore 前，数据线存储到 WAL 中，WAL 是直接写入磁盘中。

### 关于 WAL？

- WAL 文件里面包含一系列的修改，包含当前修改是对应哪个 Region 的
- 数据是按照修改时间进行追加
- 当 WAL 文件越来越大，这个文件最终是会被关闭的，然后再创建一个新的 active WAL 文件用于存储后面的更新
- 一个 RegionServer 里面的 Regions 共用一个 WAL 日志
- **只有一个 WAL 文件处于 active 状态**
- WAL 进行 Rolled 时，会触发当前 RegionServer 中的 MemStore Flush 

### 什么时候会触发 WAL 的 Rolled操作？

- WAL 文件的大小达到了 HDFS 块大小的 50%（HBase 2.0.0 之前是 95%，详见 [HBASE-19148](https://www.iteblog.com/redirect.php?url=aHR0cHM6Ly9pc3N1ZXMuYXBhY2hlLm9yZy9qaXJhL2Jyb3dzZS9IQkFTRS0xOTE0OA==&article=true)）
- HBase 也会定时去 Rolling WAL 文件，默认是一小时。

### WAL 对恢复数据的影响？

 HBase 在使用 WAL 文件恢复数据的时候，对应的 Region 是无法提供服务的，所以**尽量保持少一些的 WAL 文件**。

### Region 的特点？

可以理解为一张表的有序数据切片。

- 一个 Region 只能属于 HBase 一张表
- 一个 Region 可以包含多列族（HStore ）

### 每个 region 有三个主要要素:

- 它所属于哪张表
- 它所包含的的第一行(第一个 region 没有首行，StartKey)
- 它所包含的最后一行(末一个 region 没有末行，EndKey)

### HStore 的特点？

- 一个 HStore 一个列族
- 

### HFile 的特点？

- 数据有序
- 底层就是 HDFS
- 不支持修改

### Region 分裂？

- 分裂操作由 RegionServer 单独执行，Master 并不参与 
- HBase 支持手动触发分裂操作

### Region 合并？

有时候存在乐观预估，为表提前创建多个空 Region（预分区）以避免 Region 分裂的性能开销。减少 Region 可以节约资源，空 Region 也是消耗资源的。**支持跨 RegionServer。**

### Region Balance？

- HMaster 要花大量的时间来分配和移动 Region
- 过多 Region 会增加 ZooKeeper的负担
- 每个 Region 会对应一个 MapReduce 任务，过多 Region 会产生太多任务

当 region 分裂之后，RegionServer 之间的region数量差距变大时，HMaster 便会执行负载均衡来调整部分 region 的位置，使得每个 RegionServer 的 region 数量保持在合理范围之内，负载均衡会引起 region 的重新定位，使得涉及的 region 不具备数据本地性，即 HFile 和 region 不在同一个 DataNode。这种情况会在 major compaction 之后得到解决。

### Region Balance 会导致什么问题？

使得涉及的 region 不具备数据本地性，即 HFile 和 region 不在同一个 DataNode。这种情况会在 major compaction 之后得到解决。

### 如何解决 region 不具备数据本地性？

HFile 在每一个 DataNode 上都有副本。

### HBase 在提升查询效率方面的优化？

- Region 分裂，不同的 Region 分配到不同的 RegionServer 上，分别查询，在将结果聚合

### 当 一台RegionServer 发生宕机时，为什么不会出现数据丢失？

- 客户端存在重试机制
- WAL 的数据也是存储在 HDFS 上，一般都会做备份

### 在什么时候知道当前put数据落到那个RegionServer中？

在写入 WAL 之前就确定了。

### WAL 数据同步方式？

**Pipeline 和 n-Way Writes**，也就是串行和并行，只有最后一个节点同步完成，才算同步结束。Pipeline 串行相应的时间上比较慢，n-Way Writes 通过并行度提高的效率，但需要更多的资源消耗，在实际生产中，根据实际情况选择一种方案。

如果被设置每次不同步，则写操作会被 RegionServer 缓存，并启动一个 LogSyncer 线程来定时同步日志，定时时间默认是1秒，也可由 `hbase.regionserver.optionallogflushinterval` 设置。

### Log Split？

一个 RegionServer 中只有一个 HLog，该 RegionServer 中的所有 Region 数据都会往该 HLog 进行 Append 操作，导致数据是不连续的。当 RegionServer 宕机之后，对 Region 数据进行还原，需要使用 HLog，因此需要**把 HLog 中的更新按照 region 分组**，这一把 HLog 中更新日志分组的过程就称为 log split。

log split 由 Master 分配不同的任务给不同的 RegionServer 处理，提升速度，相应的操作信息通过 zk 进行记录和分发。

分布式日志分割可以通过配置项 `hbase.master.distributed.log.splitting` 来控制，默认为 true, 即默认情况下分布式日志分割是打开的。

### WAL滚动

WAL是一个环状的滚动日志结构，这样可以保证写入效果最高并且保证空间不会持续变大。 触发滚动的条件：

- WAL的检查间隔：`hbase.regionserver.logroll.period` 。默认一小时，上面说了，通过 sequenceid，把当前WAL的操作和 HDFS 对比，看哪些操作已经被持久化了。就被移动到oldWAL目录中。
- 当 WAL 文件所在的块 block 快要满了
- 当 WAL 所占的空间大于或者等于某个阈值（hbase.regionserver.hlog.blocksize乘hbase.regionserver.logroll.multiplier）blocksize是存储系统的块大小，如果你是基于HDFS只要设定为HDFS的块大小即可，multiplier是一个百分比，默认0.95，即WAL所占的空间大于或者等于95%的块大小，就被归到oldWAL文件中。

### oldWAL 什么时候被彻底删除呢？

Master会定期的去清理这个文件，如果当这个WAL不需要作为用来恢复数据的备份，那么就可以删除

### 一个 Region下 相同列族会有多个 store 吗？

不会，同一个 Region 下一个列族对应有且只有一个 Store。

### HFile 合并触发条件

**1.Memstore Flush:**

应该说compaction操作的源头就来自flush操作，memstore flush会产生HFile文件，文件越来越多就需要compact。因此在每次执行完Flush操作之后，都会对当前Store中的文件数进行判断，一旦文件数大于配置，就会触发compaction。需要说明的是，compaction都是以Store为单位进行的，而在Flush触发条件下，整个Region的所有Store都会执行compact，所以会在短时间内执行多次compaction。

**2.后台线程周期性检查：**

后台线程定期触发检查是否需要执行compaction，检查周期可配置。线程先检查文件数是否大于配置，一旦大于就会触发compaction。如果不满足，它会接着检查是否满足major compaction条件，简单来说，如果当前store中hfile的最早更新时间早于某个值mcTime，就会触发major compaction（默认7天触发一次，可配置手动触发），HBase预想通过这种机制定期删除过期数据。

**3.手动触发：**

一般来讲，手动触发compaction通常是为了执行major compaction，一般有这些情况需要手动触发合并是因为很多业务担心自动major compaction影响读写性能，因此会选择低峰期手动触发；也有可能是用户在执行完alter操作之后希望立刻生效，执行手动触发major compaction；是HBase管理员发现硬盘容量不够的情况下手动触发major compaction删除大量过期数据