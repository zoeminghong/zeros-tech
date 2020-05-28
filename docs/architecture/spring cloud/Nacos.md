# Nacos

## 快速上手

```xml
<dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba.boot</groupId>
            <artifactId>nacos-discovery-spring-boot-starter</artifactId>
            <version>0.2.1</version>
        </dependency>
        <dependency>
          <groupId>com.alibaba.boot</groupId>
          <artifactId>nacos-config-spring-boot-starter</artifactId>
          <version>0.2.1</version>
        </dependency>
</dependencies>
```

> 版本 0.2.x.RELEASE 对应的是 Spring Boot 2.x 版本，版本 0.1.x.RELEASE 对应的是 Spring Boot 1.x 版本。

`application.yml`

```yml
server.port=8080
spring.application.name=nacos-springboot-discovery
nacos.discovery.server-addr=127.0.0.1:8848
```

启动程序即可

## 高级配置

```java
@Controller
@RequestMapping("config")
public class ConfigController {

    /**
     * @author : bilaisheng
     * @wechat: 878799579
     * @date : 2019/01/15 19:45
     * @return Map
     * @throws NacosException
     * @throws InterruptedException
     */
    @ResponseBody
    @RequestMapping("/get")
    public Map getConfig() throws NacosException, InterruptedException {
        // 用以演示用，页面返回数据展示
        Map map = new HashMap();
        //  服务地址。本机演示故写localhost。请根据实际情况替换对应IP
        String serverAddr = "localhost";
        String dataId = "nacos-spring";
        String group = "bilaisheng";
        Properties properties = new Properties();
        properties.put(PropertyKeyConst.SERVER_ADDR, serverAddr);
        // 创建ConfigService，此处通过Properties方式进行创建，另一种演示serviceaddr获取configService.
        // 原理上都是通过 ConfigFactory.createConfigService()去进行创建
        ConfigService configService = NacosFactory.createConfigService(properties);
        // ConfigService configService = NacosFactory.createConfigService(serverAddr);

        String content = configService.getConfig(dataId, group, 5000);
        System.out.println("config : " + content);
        map.put("content", content);
        // 添加Listener，用以演示receive获取数据结果
        configService.addListener(dataId, group, new Listener() {
            @Override
            public void receiveConfigInfo(String configInfo) {
                System.out.println("recieve : " + configInfo);
            }
            @Override
            public Executor getExecutor() {
                return null;
            }
        });

        // 推送config。将原有dataid中信息替换。
        boolean isPublishOk = configService.publishConfig(dataId, group, "publish config content");
        System.out.println("isPublishOk : " + isPublishOk);
        map.put("isPublishOk", isPublishOk);

        Thread.sleep(3000);
        content = configService.getConfig(dataId, group, 5000);
        System.out.println("Thread sleep 3000ms : " + content);
        map.put("Thread sleep 3000ms : ", content);

        // 删除指定dataid , group 配置
        boolean isRemoveOk = configService.removeConfig(dataId, group);
        System.out.println("remove " + dataId + "config is " + isRemoveOk);
        Thread.sleep(3000);

        content = configService.getConfig(dataId, group, 5000);
        System.out.println("content after 5000ms "+content);
        Thread.sleep(3000);
        return map;
    }
}
```

## 注解

@NacosValue

注入配置信息

@NacosInjected

采用注解注入形式@NacosInjected注入可以触发nacosConfigPublishedEvent回调，也就是配置注册到nacos的时候产生的回调，其余方式不会触发。

可以实现动态更新配置。当调用 `/register` 时，就会修改配置信息，如果配置不存在就会生成配置。

```java
@RestController
@RequestMapping("config")
public class ConfigController {

    @NacosValue(value = "${useLocalCache:false}", autoRefreshed = true)
    private boolean useLocalCache;
 
    //采用注解注入形式@NacosInjected注入可以触发nacosConfigPublishedEvent回调，也就是配置注册到nacos的时候产生的回调，其余方式不会触发
    @NacosInjected
    private ConfigService configService;

    @GetMapping(value = "/get")
    public boolean get() {
        return useLocalCache;
    }

    @GetMapping(value = "/register")
    public boolean register() {
        try {
            configService.publishConfig(EXAMPLE, DEFAULT_GROUP, "useLocalCache = true");
            return true;
        } catch (NacosException e) {
            e.printStackTrace();
            return false;
        }
    }

    @GetMapping(value = "/remove")
    public boolean remove() {
        try {
            configService.removeConfig(EXAMPLE, DEFAULT_GROUP);
            return true;
        } catch (NacosException e) {
            e.printStackTrace();
            return false;
        }
    }
}
```

