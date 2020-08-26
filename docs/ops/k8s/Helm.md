# Helm

拓展阅读

- [Helm User Guide - Helm 用户指南](https://whmzsu.github.io/helm-doc-zh-cn/)

概念

- Char：一个 *Chart* 是一个 Helm 包。它包含在 Kubernetes 集群内部运行应用程序，工具或服务所需的所有资源定义。把它想像为一个自制软件，一个 Apt dpkg 或一个 Yum RPM 文件的 Kubernetes 环境里面的等价物。
- Repository：一个 *Repository* 是 Charts 收集和共享的地方，类比于 maven 仓库。
- Release：一个 *Release* 是处于 Kubernetes 集群中运行的 Chart 的一个实例。一个 chart 通常可以多次安装到同一个群集中。每次安装时，都会创建一个新 *release* 。比如像一个 MySQL chart。如果希望在群集中运行两个数据库，则可以安装该 chart 两次。每个都有自己的 *release*，每个 *release* 都有自己的 *release name*。
- Tiller：是Helm 的服务端。

## 使用

### install

安装指定 Chart，也就是应用程序。

```shell
$ cat <<EOF>  config.yaml
mariadbUser: user0
mariadbDatabase: user0db
EOF
$ helm install -f config.yaml stable/mariadb
```

在安装过程中有两种方式传递自定义配置数据：

- --values（或 - f）：指定一个 overrides 的 YAML 文件。可以指定多次，最右边的文件将优先使用
- --set (也包括 `--set-string` 和 `--set-file`): ：在命令行上指定 overrides。

如果两者都使用，则将 `--set` 值合并到 `--values` 更高的优先级中。指定的 override `--set` 将保存在 configmap 中。`--set` 可以通过使用特定的版本查看已经存在的值 `helm get values <release-name>`,`--set` 设置的值可以通过运行 helm upgrade 带有 --reset-values 参数重置。

**--set /  --set-string**

- 同行配置多个使用逗号 `,` 分隔；
- set 方式优先级高于 -f 方式；
- 多层级使用 `.` 分隔；

**--set /  --set-string** 区别，前者会将true转为数值类型，而后者认为是字符串类型。

#### 国内镜像源

##### 👍🏻Azure 镜像

```
helm repo add stable http://mirror.azure.cn/kubernetes/charts/
helm repo add incubator http://mirror.azure.cn/kubernetes/charts-incubator/
```

##### Git Pages 镜像

```
helm repo add stable https://burdenbear.github.io/kube-charts-mirror/
```

可以参考 [kube-charts-mirror](https://github.com/BurdenBear/kube-charts-mirror) ，搭建一个自主可控的镜像源。

#### 安装源

helm install 命令可以从多个来源安装：

- 一个 chart repository (像上面看到的)
- 一个本地 chart 压缩包 (`helm install foo-0.1.1.tgz`)
- 一个解压后的 chart 目录 (`helm install path/to/foo`)
- 一个完整 URL (`helm install https://example.com/charts/foo-1.2.3.tgz`)

## 权限

https://whmzsu.github.io/helm-doc-zh-cn/quickstart/rbac-zh_cn.html

## 命令

```shell
# 查看配置了哪些 repo
helm repo list
# 添加新的 repo
helm repo add dev https://example.com/dev-charts

# 查看有哪些 charts 可用
helm search
helm search mysql

# 安装
helm install <Chart>
--name # 实例名称
--set mariadbUser=user0,mariadbDatabase=user0db
===== --set =======
# 多层级
--set outer.inner=value
# 列表
--set name={a, b, c}
# 逗号转义，使用 \
# name: "value1,value2"
--set name="value1\,value2"
#nodeSelector:
#  kubernetes.io/role: master
--set nodeSelector."kubernetes.io/role"=master
===================

# 查看当前部署的所有 release
helm list
--deleted # 需要查看已删除的版本
--all  # 显示了所有 release
--replace # 重用现有 release 并替换其资源

# 查看包描述
helm inspect <Chart>
# 查看包中可以进行配置的参数项有哪些
helm inspect values stable/mariadb
# 将 Chart 所有文件下载到本地
helm fetch <Chart> --untar --untardir ./

# 跟踪 release 状态或重新读取配置信息
helm status <release name>

# 通过配置项进行 Chart 服务安装	
cat <<EOF>  config.yaml
mariadbUser: user0
mariadbDatabase: user0db
EOF
$ helm install -f config.yaml stable/mariadb

# 查看 release 已经存在的配置值
helm get values <release-name>

# 当新版本的 chart 发布时，或者当你想要更改 release 配置时
helm upgrade -f panda.yaml <release-name> <Chart>

# 回滚到指定的的版本
helm rollback [RELEASE] [REVISION]

# 查看特定版本的修订版号
helm history [RELEASE]
# 删除 
helm delete [RELEASE]

===== 创建一个自己的 chart ======
# 创建 chart
helm create [chart-name]
# 校验 chart 格式是否正确
helm lint
# 打包 chart
helm package deis-workflow
# 安装
helm install ./deis-workflow-0.1.0.tgz
```

在安装 / 升级 / 回滚期间，可以指定几个其他有用的选项来定制 Helm 的行为。请注意，这不是 cli 参数的完整列表。要查看所有参数的说明，请运行 helm --help。

- `--timeout`：等待 Kubernetes 命令完成的超时时间值（秒），默认值为 300（5 分钟）
- `--wait`：等待所有 Pod 都处于就绪状态，PVC 绑定完，将 release 标记为成功之前，Deployments 有最小（Desired-maxUnavailable）Pod 处于就绪状态，并且服务具有 IP 地址（如果是 `LoadBalancer`，则为 Ingress ）。它会等待 `--timeout` 的值。如果达到超时，release 将被标记为 FAILED。注意：在部署 replicas 设置为 1 maxUnavailable 且未设置为 0，作为滚动更新策略的一部分的情况下， `--wait` 它将返回就绪状态，因为它已满足就绪状态下的最小 Pod。
- `--no-hooks`：这会跳过命令的运行钩子
- `--recreate-pods`（仅适用于 upgrade 和 rollback）：此参数将导致重新创建所有 pod（属于 deployment 的 pod 除外）

由于 Helm 保留已删除 release 的记录，因此不能重新使用 release 名称。（如果 *确实* 需要重新使用此 release 名称，则可以使用此 `--replace` 参数，但它只会重用现有 release 并替换其资源。

## 创建自己的 Chart

[创建Chart](https://whmzsu.github.io/helm-doc-zh-cn/chart/charts-zh_cn.html)

