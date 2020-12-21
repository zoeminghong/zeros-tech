# Kubernetes RBAC

Kubernetes 中所有的 API 对象，都保存在 Etcd 里。可是，对这些 API 对象的操作，却一定都是通过访问 kube-apiserver 实现的。其中一个非常重要的原因，就是你需要APIServer 来帮助你做授权工作。

明确三个最基本的概念。

1. Role：**角色**，它其实是一组规则，定义了一组对 Kubernetes API 对象的操作权限。
2. Subject：**被作用者**，既可以是“人”，也可以是“机器”，也可以使你在 Kubernetes 里定义的“用户”。
3. RoleBinding：**定义了“被作用者”和“角色”的绑定关系**。

**Role**

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
 namespace: mynamespace
 name: example-role
rules:
- apiGroups: [""]
 resources: ["pods"]
 verbs: ["get", "watch", "list"]
```

这个 Role 对象指定了它能产生作用的 Namepace 是：mynamespace

> Namespace 是 Kubernetes 项目里的一个逻辑管理单位。不同 Namespace 的 API 对象，在通过 kubectl 命令进行操作的时候，是互相隔离开的。

这个 Role 对象的 rules 字段，就是它所定义的权限规则。在上面的例子里，这条规则的含义就是：允许“被作用者”，对 mynamespace 下面的 Pod 对象，进行 GET、WATCH 和 LIST 操作。

**RoleBinding**

RoleBinding 本身也是一个 Kubernetes 的 API 对象。

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
 name: example-rolebinding
 namespace: mynamespace
subjects:
- kind: User
 name: example-user
 apiGroup: rbac.authorization.k8s.io
roleRef:
 kind: Role
 name: example-role
 apiGroup: rbac.authorization.k8s.io
```

可以看到，这个 RoleBinding 对象里定义了一个 subjects 字段，即“被作用者”。它的类型是 User，即 Kubernetes 里的用户。这个用户的名字是 example-user。

可是，在 Kubernetes 中，其实并没有一个叫作“User”的 API 对象。而且，我们在前面和部署使用 Kubernetes 的流程里，既不需要 User，也没有创建过 User。

**❓这个 User 到底是从哪里来的呢？**

> 实际上，Kubernetes 里的“User”，也就是“用户”，只是一个授权系统里的逻辑概念。它需要通过外部认证服务，比如 Keystone，来提供。或者，你也可以直接给 APIServer 指定一个用户名、密码文件。那么 Kubernetes 的授权系统，就能够从这个文件里找到对应的“用户”了。当然，在大多数私有的使用环境中，我们只要使用 Kubernetes 提供的内置“用户”，就足够了。

通过 roleRef 字段，RoleBinding 对象就可以直接通过名字，来引用我们前面定义的 Role 对象（example-role），从而定义了“被作用者（Subject）”和“角色（Role）”之间的绑定关系。

‼️ Role 和 RoleBinding 对象都是 Namespaced 对象（Namespaced Object），它们对权限的限制规则仅在它们自己的 Namespace 内有效，roleRef 也只能引用当前 Namespace 里的 Role 对象。

### 授权

那么，对于非 Namespaced（Non-namespaced）对象（比如：Node），或者，某一个 Role 想要作用于所有的 Namespace 的时候，我们又该如何去做授权呢？

使用 ClusterRole 和 ClusterRoleBinding 这两个组合。这两个 API 对象的用法跟 Role 和 RoleBinding 完全一样。只不过，它们的定义里，没有了 Namespace 字段。

```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
 name: example-clusterrole
rules:
- apiGroups: [""]
 resources: ["pods"]
 verbs: ["get", "watch", "list"]
```

```yaml
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
 name: example-clusterrolebinding
subjects:
- kind: User
 name: example-user
 apiGroup: rbac.authorization.k8s.io
roleRef:
 kind: ClusterRole
 name: example-clusterrole
 apiGroup: rbac.authorization.k8s.io
```

verbs 就是用于控制用户权限，如果要赋予用户 example-user 所有权限

```yaml
verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

Role 对象的 rules 字段也可以进一步细化。比如，你可以只针对某一个具体的对象进行权限设置。

```yaml
rules:
- apiGroups: [""]
 resources: ["configmaps"]
 resourceNames: ["my-config"]
 verbs: ["get"]
```

而正如我前面介绍过的，在大多数时候，我们其实都不太使用“用户”这个功能，而是直接使用Kubernetes 里的“内置用户”。这个由 Kubernetes 负责管理的“内置用户”，正是我们前面曾经提到过的：ServiceAccount。

**ServiceAccount**

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
 namespace: mynamespace
 name: example-sa
```

一个最简单的 ServiceAccount 对象只需要 Name 和 Namespace 这两个最基本的字段。

通过编写 RoleBinding 的 YAML 文件，来为这个 ServiceAccount 分配权限。

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
 name: example-rolebinding
 namespace: mynamespace
subjects:
- kind: ServiceAccount
 name: example-sa
 namespace: mynamespace
roleRef:
 kind: Role
 name: example-role
 apiGroup: rbac.authorization.k8s.io
```

在这个 RoleBinding 对象里，subjects 字段的类型（kind），不再是一个 User，而是一个名叫 example-sa 的 ServiceAccount。而 roleRef 引用的 Role 对象，依然名叫 example-role。

```shell
kubectl get sa -n mynamespace -o yaml
- apiVersion: v1
 kind: ServiceAccount
 metadata:
 creationTimestamp: 2018-09-08T12:59:17Z
 name: example-sa
 namespace: mynamespace
 resourceVersion: "409327"
 ...
 secrets:
 - name: example-sa-token-vmfg6
```

Kubernetes 会为一个 ServiceAccount 自动创建并分配一个 Secret 对象，即：上述 ServiceAcount 定义里最下面的 secrets 字段。这个 Secret，就是这个 ServiceAccount 对应的、用来跟 APIServer 进行交互的授权文件，我们一般称它为：Token。Token 文件的内容一般是证书或者密码，它以一个 Secret 对象的方式保存在 Etcd 当中。

这时候，用户的 Pod，就可以声明使用这个 ServiceAccount 了，比如下面这个例子：

```yaml
apiVersion: v1
kind: Pod
metadata:
 namespace: mynamespace
 name: sa-token-test
spec:
 containers:
 - name: nginx
   image: nginx:1.7.9
serviceAccountName: example-sa
```

我定义了 Pod 要使用的要使用的 ServiceAccount 的名字是：example-sa。

等这个 Pod 运行起来之后，我们就可以看到，该 ServiceAccount 的 token，也就是一个 Secret 对象，被 Kubernetes 自动挂载到了容器的 `/var/run/secrets/kubernetes.io/serviceaccount` 目录下，如下所示：

```shell
$ kubectl describe pod sa-token-test -n mynamespace
Name: sa-token-test
Namespace: mynamespace
...
Containers:
 nginx:
 ...
 Mounts:
 /var/run/secrets/kubernetes.io/serviceaccount from example-sa-token-vmfg6 (ro)
```

这时候，我们可以通过 kubectl exec 查看到这个目录里的文件：

```shell
$ kubectl exec -it sa-token-test -n mynamespace -- /bin/bash
root@sa-token-test:/# ls /var/run/secrets/kubernetes.io/serviceaccount
ca.crt namespace token
```

如上所示，容器里的应用，就可以使用这个 ca.crt 来访问 APIServer 了。更重要的是，此时它只能够做 GET、WATCH 和 LIST 操作。因为 example-sa 这个 ServiceAccount 的权限，已经被我们绑定了 Role 做了限制。

如果一个 Pod 没有声明 serviceAccountName，Kubernetes 会自动在它的 Namespace 下创建一个名叫 default 的默认 ServiceAccount，然后分配给这个 Pod。

但在这种情况下，这个默认 ServiceAccount 并没有关联任何 Role。也就是说，此时它有访问APIServer 的绝大多数权限。当然，这个访问所需要的 Token，还是默认 ServiceAccount 对应的 Secret 对象为它提供的，如下所示。

```shell
$kubectl describe sa default
Name: default
Namespace: default
Labels: <none>
Annotations: <none>
Image pull secrets: <none>
Mountable secrets: default-token-s8rbq
Tokens: default-token-s8rbq
Events: <none>
$ kubectl get secret
NAME TYPE DATA AGE
kubernetes.io/service-account-token 3 82d
$ kubectl describe secret default-token-s8rbq
Name: default-token-s8rbq
Namespace: default
Labels: <none>
Annotations: kubernetes.io/service-account.name=default
 kubernetes.io/service-account.uid=ffcb12b2-917f-11e8-abde-42010aa80002
Type: kubernetes.io/service-account-token
Data
====
ca.crt: 1025 bytes
namespace: 7 bytes
token: <TOKEN 数据 >
```

可以看到，Kubernetes 会自动为默认 ServiceAccount 创建并绑定一个特殊的 Secret：它的类型是`kubernetes.io/service-account-token`；它的 Annotation 字段，声明了`kubernetes.io/service-account.name=default`，即这个 Secret 会跟同一 Namespace 下名叫 default 的 ServiceAccount 进行绑定。

**用户与用户组**

用户

```
system:serviceaccount:<ServiceAccount 名字 >
```

用户组

```
system:serviceaccounts:<Namespace 名字 >
```

定义一个 subjects

```yaml
# 作用于指定的 namespace 下的 ServiceAccount
subjects:
- kind: Group
 name: system:serviceaccounts:mynamespace
 apiGroup: rbac.authorization.k8s.io
```

```yaml
# 作用于整个系统里的所有 ServiceAccount
subjects:
- kind: Group	
 name: system:serviceaccounts
 apiGroup: rbac.authorization.k8s.io
```

**系统自带的 ClusterRole**

它们的名字都以 system: 开头。你可以通过 kubectl get clusterroles 查看到它们。

```shell
kubectl describe clusterrole system:kube-scheduler
```

这个 system:kube-scheduler 的 ClusterRole，就会被绑定给 kube-system Namesapce 下名叫 kube-scheduler 的 ServiceAccount，它正是 Kubernetes 调度器的 Pod 声明使用的 ServiceAccount。

除此之外，Kubernetes 还提供了四个预先定义好的 ClusterRole 来供用户直接使用：

1. cluster-amdin；

2. admin；

3. edit；
4. view。

