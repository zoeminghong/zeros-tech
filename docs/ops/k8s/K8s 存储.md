# K8s 存储

Kubernetes 支持多种方式的数据持久化方案，大致可以分为Pod 内外部两种。外部存储有 nfs、iscsi等，内部有emptyDir、hostPath 两种。

- [API信息](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#persistentvolumeclaimspec-v1-core)
- [入门必读](https://www.cnblogs.com/rexcheny/p/10925464.html)

TODO：

- 非本地存储方式一定要有PV和PVC吗？

常见 volume 参数信息

- **emptyDir** − Pod 在创建的时候，同时会创建有一个空的文件夹，随着 Pod 消失，存储内容也会消失；
- **hostPath** - 通过宿主机的文件路径进行数据持久化，不会随着 Pod 消失，丢失数据；
- **nfs** - 跟已经存在的 NFS (Network File System) 进行绑定，Pod 重启或被移除都不会导致数据丢失，只是未绑定状态；
- **iscsi** - 跟已经存在的  iSCSI (SCSI over IP) 进行绑定，Pod 重启或被移除都不会导致数据丢失，只是未绑定状态；
- **flocker** - 开源容器数据管理，其会通过 Flocker dataset 进行管理，如果之前没有被创建，需要使用 Flocker API 预先创建；
- **glusterfs** − Glusterfs 是一个开源的网络文件系统， 一个glusterfs 卷与 Pod 绑定；
- **rbd** − Rados Block Device，不会随着 Pod 消失，丢失数据；
- **cephfs** − 允许与已经存在的 cephfs 进行绑定；
- **gitRepo** − 与 git 仓库进行绑定；
- **persistentVolumeClaim** - 与 PersistentVolume 进行绑定，PersistentVolume 可以是任何的持久化云环境；
- **downwardAPI** − 绑定一个文件夹，写数据到plain text 文件中；

### emptyDir

emptyDir类型的Volume在Pod分配到Node上时被创建，Kubernetes会在Node上自动分配一个目录，因此无需指定宿主机Node上对应的目录文件。 这个目录的初始内容为空，当Pod从Node上移除时，emptyDir中的数据会被永久删除。

emptyDir Volume主要用于某些应用程序无需永久保存的临时目录，多个容器的共享目录等。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: gcr.io/google_containers/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir: {}
```

### hostPath

hostPath Volume为Pod挂载宿主机上的目录或文件。 hostPath Volume的使得容器可以使用宿主机的高速文件系统进行存储。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: gcr.io/google_containers/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    hostPath:
      # directory location on host
      path: /data # 物理节点上的真实路径
      type: Directory # Directory是要求目录必须存在
```

⚠️ hostPath 和 emptyDir 更多的适用于测试或者试用应用的时候使用，在生产环境下肯定是不可靠，也不推荐的方式，无法保证数据不丢失。同时，这些存储由于都是各自制定路径，无法统一管理，对于存储管理者来说，是非常的不友好的，生产环境更多的推荐分布式存储系统实现存储的要求。

缺点

- 不可持久化；
- Pod 重启可能数据发生丢失（重启后的Pod并不在之前持久化的Node上）；

> 可以通过 PersistentVolume  控制Pod的节点漂移问题。

### PersistentVolume 与 PersistentVolumeClaim

<u>外部存储需要通过 PersistentVolume 与 PersistentVolumeClaim方式实现与 Pod 的交互。</u>

PersistentVolume（**PV**）是集群中由管理员配置的**网络存储**。 它是集群中的资源，就像节点是集群资源一样。 PV是容量插件，如Volumes，但其生命周期独立于使用PV的任何单个pod。 此API对象捕获存储实现的详细信息，包括NFS，iSCSI或特定于云提供程序的存储系统。

PersistentVolumeClaim（**PVC**）是由**用户进行存储的请求**。也就是由用户决定要什么存储资源，存储空间大小。 它类似于pod。 Pod消耗节点资源，PVC消耗PV资源。Pod可以请求特定级别的资源（CPU和内存）。声明可以请求特定的大小和访问模式（例如，可以一次读/写或多次只读）。

**创建 PersistentVolume** 

hostPath 类型一般在 PersistentVolume 使用节点上的文件或目录来模拟附带网络的存储。

在生产集群中，您不会使用 hostPath。需要使用提供的网络存储资源，比如 Google Compute Engine 持久盘卷、NFS 共享卷或 Amazon Elastic Block Store 卷。

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: task-pv-volume
  labels:
    type: local
spec:
  storageClassName: manual  # 动态绑定的时候使用，当前例子中没有任何意义
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
```

- storageClassName - 用来将 PersistentVolumeClaim 请求绑定到该 PersistentVolume；
- accessModes - 读写权限模式，不同的存储系统支持的模式各不同；
  - ReadWriteOnce - 支持读写方式，卷只能被单一集群节点挂载读写；
  - ReadWriteMany - 多路读写，卷能被集群多个节点挂载并读写；
  - ReadOnlyMany - 多路只读，卷能被多个集群节点挂载且只能读；
- persistentVolumeReclaimPolicy：也有三种策略，这个策略是当与之关联的PVC被删除以后，这个PV中的数据如何被处理
  - Retain 当删除与之绑定的PVC时候，这个PV被标记为released（PVC与PV解绑但还没有执行回收策略）且之前的数据依然保存在该PV上，但是该PV不可用，需要手动来处理这些数据并删除该PV；
  - Delete 当删除与之绑定的PVC时候
  - Recycle 这个在1.14版本中以及被废弃，取而代之的是推荐使用动态存储供给策略，它的功能是当删除与该PV关联的PVC时，自动删除该PV中的所有数据；

```
kubectl create -f https://k8s.io/examples/pods/storage/pv-volume.yaml
```

查看 PersistentVolume

```
kubectl get pv task-pv-volume
```

PV 卷阶段状态

-  Available – 资源尚未被claim使用
-  Bound – 卷已经被绑定到claim了
-  Released – claim被删除，卷处于释放状态，但未被集群回收。
-  Failed – 卷自动回收失败

**PersistentVolumeClaim**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: task-pv-claim
spec:
  storageClassName: manual  # 动态绑定的时候使用，当前例子中没有任何意义
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 3Gi
```

```shell
kubectl create -f https://k8s.io/examples/pods/storage/pv-claim.yaml
```

查看

```shell
kubectl get pv task-pv-volume
kubectl get pvc task-pv-claim
```

**PV与PVC如何绑定**

1. PV和PVC中的spec关键字段要匹配，比如存储（storage）大小；
2. PV和PVC中的storageClassName字段必须一致；

注意，PVC 中 Label 标签与 PV 中的标签没有实际的意义。

**与 Pod 绑定**

直接使用PVC的名字即可。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: task-pv-pod
spec:
  volumes:
    - name: task-pv-storage
      persistentVolumeClaim:
        claimName: task-pv-claim
  containers:
    - name: task-pv-container
      image: nginx
      ports:
        - containerPort: 80
          name: "http-server"
      volumeMounts:
        - mountPath: "/usr/share/nginx/html"
          name: task-pv-storage
```

```shell
kubectl create -f https://k8s.io/examples/pods/storage/pv-pod.yaml
kubectl get pod task-pv-pod
kubectl exec -it task-pv-pod -- /bin/bash

root@task-pv-pod:/# apt-get update
root@task-pv-pod:/# apt-get install curl
root@task-pv-pod:/# curl localhost
```

以上的实现方式都是静态的方式，所谓静态方式就是需要先创建PV，然后创建PVC，如果 PVC 没有找到合适的PV或者忘记构建了，就会导致Pod无法正常启动。若能当PVC发现没有合适PV时，会自动创建理想的PV这样是不是比较合理。

<u>静态方式是根据 accessModes 和 存储空间大小进行匹配，存在满足条件的 PV 时，就会连接上。</u>

**StorageClass**

StorageClass 作用就是用于定义存储类型的，对于运维管理者只需要定义数据存储源信息就行了，不需要管理存储空间的大小，开发者应用使用多少交由开发者自己去定义。

👆在上面的例子中 `storageClassName  `参数的意义就在于指定 StorageClass。

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: slow
provisioner: kubernetes.io/aws-ebs
parameters:
  type: io1
  iopsPerGB: "10"
  fsType: ext4
```

这里有个要求就是你的存储系统需要提供某种接口来让controller可以调用并传递进去PVC的参数去创建PV，很多云存储都支持。可是也有不支持的，比如NFS就不支持所以我们需要一个单独的插件来完成这个工作。也就是例子中使用的`quay.io/external_storage/nfs-client-provisioner`镜像，但是创建PV也需要相关权限，也就是例子中rabc.yaml部分。在定义StorageClass中有一个叫做`provisioner: fuseim.pri/ifs`这个就是插件的名称，这个名称其实也就是官方例子中deployment中设置的名字，这个名字你可以修改。

<u>动态方式是根据 `storageClassName  `  值的设定来的。</u>

**生命周期**

PV是群集中的资源。PVC是对这些资源的请求，并且还充当对资源的检查。PV和PVC之间的相互作用遵循以下生命周期：

Provisioning ——-> Binding ——–>Using——>Releasing——>Recycling

- **供应准备Provisioning** ---通过集群外的存储系统或者云平台来提供存储持久化支持。
  -  静态提供Static：集群管理员创建多个PV。 它们携带可供集群用户使用的真实存储的详细信息。 它们存在于Kubernetes API中，可用于消费
  -  动态提供Dynamic：当管理员创建的静态PV都不匹配用户的PersistentVolumeClaim时，集群可能会尝试为PVC动态配置卷。 此配置基于StorageClasses：PVC必须请求一个类，并且管理员必须已创建并配置该类才能进行动态配置。 要求该类的声明有效地为自己禁用动态配置。
-  **绑定Binding**---用户创建pvc并指定需要的资源和访问模式。在找到可用pv之前，pvc会保持未绑定状态。
-  **使用Using**---用户可在pod中像volume一样使用pvc。
-  **释放Releasing**---用户删除pvc来回收存储资源，pv将变成“released”状态。由于还保留着之前的数据，这些数据需要根据不同的策略来处理，否则这些存储资源无法被其他pvc使用。
- **回收Recycling** --- pv 可以设置三种回收策略：保留（Retain），回收（Recycle）和删除（Delete）。
  -  \- 保留策略：允许人工处理保留的数据。
  -  \- 删除策略：将删除pv和外部关联的存储资源，需要插件支持。
  -  \- 回收策略：将执行清除操作，之后可以被新的pvc使用，需要插件支持。

 注：目前只有NFS和HostPath类型卷支持回收策略，AWS EBS,GCE PD,Azure Disk和Cinder支持删除(Delete)策略。

### 本地持久化存储拓展

本地持久化存储（Local Persistent Volume）就是把数据存储在POD运行的宿主机上，我们知道宿主机有hostPath和emptyDir，由于这两种的特定不适用于本地持久化存储。那么本地持久化存储必须能保证POD被调度到具有本地持久化存储的节点上。

> 为什么需要这种类型的存储呢？有时候你的应用对磁盘IO有很高的要求，网络存储性能肯定不如本地的高，尤其是本地使用了SSD这种磁盘。

但这里有个问题，通常我们先创建PV，然后创建PVC，这时候如果两者匹配那么系统会自动进行绑定，哪怕是动态PV创建，也是先调度POD到任意一个节点，然后根据PVC来进行创建PV然后进行绑定最后挂载到POD中，可是本地持久化存储有一个问题就是这种PV必须要先准备好，而且不一定集群所有节点都有这种PV，如果Pod随意调度肯定不行，如何保证Pod一定会被调度到有PV的节点上呢？这时候就需要在PV中**声明节点亲和**，且Pod被调度的时候还要考虑卷的分布情况。

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local-storage
  local: # local类型
    path: /data/vol1  # 节点上的具体路径
  nodeAffinity: # 这里就设置了节点亲和
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - node01 # 这里我们使用node01节点，该节点有/data/vol1路径
```

如果你在node02上也有/data/vol1这个目录，上面这个PV也一定不会在node02上，因为下面的nodeAffinity设置了主机名就等于node01。另外这种本地PV通常推荐使用的是宿主机上单独的硬盘设备，而不是和操作系统共有一块硬盘，虽然可以这样用。

**定义存储类**

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

这里的`volumeBindingMode: WaitForFirstConsumer`很关键，意思就是延迟绑定，当有符合PVC要求的PV不立即绑定。因为POD使用PVC，而绑定之后，POD被调度到其他节点，显然其他节点很有可能没有那个PV所以POD就挂起了，另外就算该节点有合适的PV，而POD被设置成不能运行在该节点，这时候就没法了，延迟绑定的好处是，POD的调度要参考卷的分布。当开始调度POD的时候看看它要求的LPV在哪里，然后就调度到该节点，然后进行PVC的绑定，最后在挂载到POD中，这样就保证了POD所在的节点就一定是LPV所在的节点。所以让PVC延迟绑定，就是等到使用这个PVC的POD出现在调度器上之后（真正被调度之前），然后根据综合评估再来绑定这个PVC。

**定义PVC**

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: local-claim
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: local-storage
```

**定义Pod**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tomcat-deploy
spec:
  replicas: 1
  selector:
    matchLabels:
      appname: myapp
  template:
    metadata:
      name: myapp
      labels:
        appname: myapp
    spec:
      containers:
      - name: myapp
        image: tomcat:8.5.38-jre8
        ports:
        - name: http
          containerPort: 8080
          protocol: TCP
        volumeMounts:
          - name: tomcatedata
            mountPath : "/data"
      volumes:
        - name: tomcatedata
          persistentVolumeClaim:
            claimName: local-claim
```

本地卷也就是LPV不支持动态供给的方式，延迟绑定，就是为了综合考虑所有因素再进行POD调度。其根本原因是动态供给是先调度POD到节点，然后动态创建PV以及绑定PVC最后运行POD；而LPV是先创建与某一节点关联的PV，然后在调度的时候综合考虑各种因素而且要包括PV在哪个节点，然后再进行调度，到达该节点后在进行PVC的绑定。也就说动态供给不考虑节点，LPV必须考虑节点。所以这两种机制有冲突导致无法在动态供给策略下使用LPV。换句话说动态供给是PV跟着POD走，而LPV是POD跟着PV走。