# Lua

在线编辑测试工具：https://c.runoob.com/compile/66

## 配置

### LUA_PATH

luaPath 配置于 `.bash_profile` 文件

```
export LUA_PATH="/usr/local/opt/openresty/lualib/?.lua;/usr/local/lib/luarocks/rocks-5.4/?.lua;;"
```

## Luarocks

正常安装使用：https://segmentfault.com/a/1190000003920034

### package 安装路径

被 luarocks 管理的包的路径其实就是 ROCKS_TREE 路径地址，在 Mac 上默认地址是`/usr/local/lib/luarocks/rocks-5.4`，不同的 lua 版本相互独立的。

执行 `luarocks config` 进行查看详细配置信息。

参考信息：

- https://groups.google.com/g/openresty/c/JKkrQHGCJVE

## APISIX

### 调试

状态码

https://apisix.apache.org/zh/docs/apisix/debug-function

https://githubmemory.com/repo/openresty/test-nginx#user-guide

```
prove -Itest-nginx/lib -r t/plugin/limit-conn.t
TEST_NGINX_BINARY=/usr/local/bin/openresty prove -Itest-nginx/lib -r t/plugin/auth-dew/redis.t
```

## 语法

### 函数

- 使用 function 声明的函数为全局函数，在被引用时可以不会因为声明的顺序而找不到
- 使用 local function 声明的函数为局部函数，在引用的时候必须要在声明的函数后面

### 遍历

https://blog.51cto.com/rangercyh/1032925
