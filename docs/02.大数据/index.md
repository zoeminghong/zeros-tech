---
title: 介绍
nav: 
  title: 大数据
  order: 2
date: 2021-02-08 09:57:36
permalink: /pages/3a883a/
categories: 
  - 大数据
tags: 
  - 
---

# 介绍

## 优质文章

[HBase VS Kudu](https://bigdata.163.com/product/article/15)



## 名词

MPP

MPP ( Massively Parallel Processing )，即大规模并行处理，在数据库**非共享集群**中，每个节点都有**独立的磁盘存储系统和内存系统**，业务数据根据数据库模型和应用特点划分到各个节点上，每台数据节点通过专用网络或者商业通用网络互相连接，彼此协同计算，作为整体提供数据库服务。非共享数据库集群有完全的可伸缩性、高可用、高性能、优秀的性价比、资源共享等优势。简单来说，MPP 是将任务并行的分散到多个服务器和节点上，在每个节点上计算完成后，将各自部分的结果汇总在一起得到最终的结果 ( 与 Hadoop 相似 )。

## 项目概述

Doris 实时数据仓库

Doris 是分布式、面向交互式查询的分布式数据库，主要部分是 SQL，内部用到 MPP 技术。https://www.jishuwen.com/d/2T9h