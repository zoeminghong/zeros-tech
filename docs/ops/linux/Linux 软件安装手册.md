# Linux 软件安装手册

### rz sz 安装

```bash
yum install lrzsz
```

### nginx 安装

```shell
# centOS7.6下安装nginx
cd /

yum install gcc gcc-c++    # 安装依赖

wget http://nginx.org/download/nginx-1.17.1.tar.gz    # 下载nginx源码


tar -zxvf nginx-1.17.1.tar.gz    # 解压

cd nginx-1.17.1     # 进入解压后的文件夹


./configure --prefix=/usr/local/nginx    # 配置nginx安装路径

make
make install


ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx    # 创建nginx软链接，若已被占用，则在 /usr/bin 下 rm-rf nginx

nginx    # 启动ngixn
nginx -s stop     # 停止nginx服务
```

### node js 安装

```shell
# 添加NodeSource官方存储库，选择添加资源库版本，执行以下任意一个命令
curl --silent --location https://rpm.nodesource.com/setup_12.x | bash -
# 安装node
yum -y install nodejs
# 安装构建工具
yum groupinstall 'Development Tools'
```

这边的版本号，根据上方的规则进行配置。如果存在保存，可能是 gcc 版本太低导致的。

### nvm 安装

```shell
sudo yum update
sudo yum groupinstall 'Development Tools'
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash

command -v nvm
nvm ls-remote

nvm install v12.16.1
```

### gcc 升级

```shell
wget https://ftp.gnu.org/gnu/gcc/gcc-9.2.0/gcc-9.2.0.tar.gz
tar -xvf gcc-9.2.0.tar.gz
cd gcc-9.2.0
./contrib/download_prerequisites
mkdir build
cd build
../configure -enable-checking=release -enable-languages=c,c++ -disable-multilib
make
make install
g++ --version
```

最新版本可以从相应的地址上获取最新版的。

### Jdk 安装

```shell
yum list java*
yum install java-1.8.0-openjdk-devel.x86_64
# 编辑
vi /etc/profile
# 编辑内容
export JAVA_HOME=/usr/lib/jvm/java-1.8.0
export CLASSPATH=.:$JAVA_HOME/jre/lib/rt.jar:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=$PATH:$JAVA_HOME/bin
# 检查
java -version
```

### Redis 安装

```shell
tar -zxf redis-5.0.3.tar.gz
yum install gcc tcl -y
reboot
cd /usr/local/redis-5.0.3
make MALLOC=libc
cd src/
make install

vim /usr/local/redis-5.0.3/redis.conf

#bind 127.0.0.1  - 如果想让互联网上的其他机器也能访问redis，需要注释掉这句话
#protected-mode - 如果想让互联网上的其他机器也能访问redis，需要设置成no
#daemonize - 如果希望redis在后台运行, 需要设置成yes
#requirepass - 在这里设置密码， 如果不需要密码， 需要注释掉这句话
#daemonize yes - 后台运行

# 启动
usr/local/bin/redis-server /usr/local/redis-5.0.3/redis.conf

#无密码连接
./redis-cli

#带密码连接
./redis-cli -a your_password
```

### MySQL 安装

```
wget http://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm  #下载官方rpm包
yum localinstall mysql57-community-release-el7-11.noarch.rpm -y            #安装rpm包
yum repolist enabled | grep "mysql.*-community.*"  -y                      
yum install mysql-community-server -y                                      #安装mysql-server
systemctl start mysqld                                                     #启动mysql
grep 'temporary password' /var/log/mysqld.log                              #查看mysql 初始密码仓库

#修改密码
vi /etc/my.cnf
[mysqld]
skip-grant-tables
:wq! #保存退出
set password for 'root'@'%' = password('123456');

#远程访问，否则会报 1130 - Host '111.0.190.51' is not allowed to connect to this MySQL server
mysql -u root -p
use mysql;
update user set host = '%' where user = 'root';
select host, user from user;
```

