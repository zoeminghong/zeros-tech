### 安装 Dashboard UI

https://kubernetes.io/zh/docs/tasks/access-application-cluster/web-ui-dashboard/

recommended.yaml 下不下来，可以到 github 上 release 中下载离线版本。

```yaml
kubectl apply -f recommended.yaml
```

获取 token 方式

```
kubectl -n kube-system describe secret default| awk '$1=="token:"{print $2}'
```

