# Docker 网络

Docker 网络存在很多通信方面的场景，例如：容器之间的通讯；跨 Docker 宿主实例通讯等等。

## Docker的网络模式

docker目前支持以下5种网络模式：

docker run 创建 Docker 容器时，可以用 –net 选项指定容器的网络模式。

- **host模式 :** 使用 –net=host 指定。**与宿主机共享网络**，此时容器没有使用网络的namespace，宿主机的所有设备，如Dbus会暴露到容器中，因此存在安全隐患。
- **container模式 :** 使用 `–net=container:NAME_or_ID` 指定。指定与某个容器实例共享网络。
- **none模式 :** 使用 `–net=none` 指定。不设置网络，相当于容器内没有配置网卡，用户可以手动配置。
- **bridge模式 :** 使用 `–net=bridge` 指定，默认设置。此时docker引擎会创建一个veth对，一端连接到容器实例并命名为eth0，另一端连接到指定的网桥中（比如docker0），因此同在一个主机的容器实例由于连接在同一个网桥中，它们能够互相通信。容器创建时还会自动创建一条SNAT规则，用于容器与外部通信时。如果用户使用了-p或者-Pe端口端口，还会创建对应的端口映射规则。
- **自定义模式 :** 使用自定义网络，可以使用docker network create创建，并且默认支持多种网络驱动，用户可以自由创建桥接网络或者overlay网络。

> 默认是桥接模式，网络地址为172.17.0.0/16，同一主机的容器实例能够通信，但不能跨主机通信。

#### host模式

> 共用宿主环境

如果启动容器的时候使用 host 模式，那么这个容器将不会获得一个独立的 Network Namespace，而是和宿主机共用一个 Network Namespace。容器将不会虚拟出自己的网卡，配置自己的 IP 等，而是使用宿主机的 IP 和端口。

#### container模式

> 共享 IP

这个模式指定新创建的容器和已经存在的一个容器共享一个 Network Namespace，而不是和宿主机共享。新创建的容器不会创建自己的网卡，配置自己的 IP，而是**和一个指定的容器共享 IP、端口范围等。**同样，两个容器除了网络方面，其他的如文件系统、进程列表等还是隔离的。两个容器的进程可以通过 lo 网卡设备通信。

#### none模式

> 什么都没有

这个模式和前两个不同。在这种模式下，Docker 容器拥有自己的 Network Namespace，但是，并不为 Docker容器进行任何网络配置。也就是说，这个 Docker 容器没有网卡、IP、路由等信息。需要我们自己为 Docker 容器添加网卡、配置 IP 等。

```shell
docker run -it --network=none busybox
```

#### bridge模式

bridge 模式是 Docker 默认的网络设置，此模式会为每一个容器分配 Network Namespace、设置 IP 等，并将一个主机上的 Docker 容器连接到一个虚拟网桥上，bridge 名称默认是`name=bridge`。

```bash
# 查看IP
# ip a
docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:24:4f:12:d5 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:24ff:fe4f:12d5/64 scope link
       valid_lft forever preferred_lft forever
```

```bash
# docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
0b9964a24acd        bridge              bridge              local
4c99fbc647d7        host                host                local
a6b2fc2cfdac        none                null                local
```

```bash
# docker network inspect 0b9964a24acd
[
    {
        "Name": "bridge",
        "Id": "0b9964a24acd593ce7e4df3f01ddcf4e291982c37e48a31ee7e4730d850a704f",
        "Created": "2020-04-22T13:09:51.640308108+08:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",
                    "Gateway": "172.17.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "0d183acd753e2b90fcf51e9fca43e17acb7039c302e18b68f0e4675de982d681": {
                "Name": "jenkins-latest-qzj",
                "EndpointID": "a1f6700696806dc7ed83b13dbe6d802046614c5aba1a3fff1577a981d190496d",
                "MacAddress": "02:42:ac:11:00:02",
                "IPv4Address": "172.17.0.2/16",
                "IPv6Address": ""
            },
            "1d75c3a2ca4f8d88f0745d0c7975f9c120a707a8667fe9646710f7a58616e8c7": {
                "Name": "sentinel-1.6.2-xuzhian",
                "EndpointID": "e4a8845b4164cb2b2ce808fe5a6597ac1868432b9b633f3c6899cf0ef5c7eef4",
                "MacAddress": "02:42:ac:11:00:04",
                "IPv4Address": "172.17.0.4/16",
                "IPv6Address": ""
            }
        },
        "Options": {
            "com.docker.network.bridge.default_bridge": "true",
            "com.docker.network.bridge.enable_icc": "true",
            "com.docker.network.bridge.enable_ip_masquerade": "true",
            "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
            "com.docker.network.bridge.name": "docker0",
            "com.docker.network.driver.mtu": "1500"
        },
        "Labels": {}
    }
]

# Containers 中的信息代表有哪些容器共用了同一个虚拟网桥，在同一个网桥内的容器之间网络是互通的，可以相互访问。
```

当 Docker server 启动时，会在主机上创建一个名为 docker0 的虚拟网桥，此主机上启动的 Docker 容器会连接到这个虚拟网桥上。虚拟网桥的工作方式和物理交换机类似，这样主机上的所有容器就通过交换机连在了一个二层网络中。

## 场景

### 修改Host配置

#### 方式一：Docker run

```
docker run -d --name test1 \
    --add-host test1.a:1.2.3.4 \
    local/test
```

#### 方式二：docker-compose

```
test2:
  build: local/test
  extra_hosts:
    test1.a: 1.2.3.4
    test1.b: 4.3.2.1
```

#### 方式三：构建镜像

```
docker build \
    --add-host test.abc:1.2.3.4 \
    -t local/test \
    .
```

