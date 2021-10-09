---
title: Nacos
date: 2021-09-16 22:21:25
permalink: /pages/ff4f85/
categories:
  - 架构
  - SpringCloud
tags:
  - 
---
TODO List

- [ ] 权限粒度
- [ ] 隔离方案

Nacos 以 Namespace 作为数据隔离粒度，可用于不同环境的间数据的隔离方案。

## 源码

```java
NacosPropertySourceLocator.loadNacosConfiguration #加载配置
NacosPropertySourceLocator.loadSharedConfiguration #加载 spring.cloud.nacos.config.shard-config 下面的配置
ClientWorker.getServerConfig # 真正调用API获取Nacos服务上的配置
```

```
ReactiveCompositeDiscoveryClient
```

## Config

### 动态更新

使用方式

```java
@Value(value = "${info:Local Hello world}")
private String info;

@NacosValue(value = "${info:Local Hello world}", autoRefreshed = true)
private String autoInfo;

@NacosConfigListener(dataId = "spring-cloud-nacos-config-example.yaml")
    public void configListener(String configInfo){
        log.info(configInfo);
    }
```

### Nacos动态更新原理

https://blog.csdn.net/China_eboy/article/details/112507139





```
NacosConfigService
```