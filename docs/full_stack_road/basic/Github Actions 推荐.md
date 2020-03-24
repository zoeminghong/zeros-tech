# Github Actions 推荐

## 推荐网站

[awesome-actions](https://github.com/sdras/awesome-actions)

[Marketplace](https://github.com/marketplace?type=actions)

## SSH

### appleboy/scp-action

将文件以 scp 方式提交到指定服务器的目标目录下。

```shell
name: scp files
on: [push]
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: copy file via ssh password
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        password: ${{ secrets.PASSWORD }}
        port: ${{ secrets.PORT }}
        source: "tests/a.txt,tests/b.txt"
        target: "test"
```

链接：https://github.com/appleboy/scp-action

### JimCronqvist/action-ssh

以 ssh 方式登录远程服务器，进行相应的命令操作

```shell
- name: Execute SSH commmands on remote server
  uses: JimCronqvist/action-ssh@master
  with:
    hosts: 'user@domain.com'
    privateKey: ${{ secrets.PRIVATE_KEY }}
    command: ls -lah
```

链接：https://github.com/JimCronqvist/action-ssh