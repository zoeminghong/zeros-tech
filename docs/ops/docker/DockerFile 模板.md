# Dockerfile 模板

## 前端项目

`Dockerfile`

```
FROM centos

MAINTAINER hang

RUN yum install -y autoconf automake make wget net-tools zlib zlib-devel bzip2 gcc  openssl-devel pcre pcre-devel tar

WORKDIR /usr

RUN mkdir nginx

ADD nginx-1.16.1 /usr/nginx

WORKDIR /usr/nginx

RUN ./configure --prefix=/usr/local/nginx && make && make install

ENV PATH /usr/local/nginx/sbin:$PATH

RUN rm -rf /usr/local/nginx/conf/nginx.conf

ADD nginx.conf /usr/local/nginx/conf/

WORKDIR /usr/local/nginx/html

RUN rm -rf *

ADD ROOT /usr/local/nginx/html

WORKDIR /usr/local/nginx/html/assets/js

RUN ls

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```

