# Vertx

## 底层实现

Vert.x最大的特点就在于异步（底层基于Netty），通过事件循环（EventLoop）来调起存储在异步任务队列（CallBackQueue）中的任务，大大降低了传统阻塞模型中线程对于操作系统的开销。因此相比较传统的阻塞模型，异步模型能够很大层度的提高系统的并发量

