## Spock

### 动态方法重载

```groovy
def 'test save map'() {
    given:
    GeneralRepository generalRepository = Mock(GeneralRepository)
    //1
    generalRepository.saveEntity(_) >> { Kpi kpi ->
        println kpi
        return kpi
    }
    KpiService kpiService = new KpiService(generalRepository: generalRepository)

    when:
    Kpi kpi = kpiService.save([kpiCode:"A01"])

    then:
    //2
    1 * generalRepository.saveEntity(_)
}
```

**1和2冲突，有2的话1不起作用**

### 异常测试

Spock 不支持将Exception场景和不存在Exception场景混到同一个方法里面，例如

```groovy
    def "createFeeEntity"() {
        given:
					....
        then:
        def ex = thrown(exception)
        ex.getMessage() == message
        if (result != null) {
            with(result) {
                ....
            }
        }
        where:
        existed || exception        | message
        true     | Exception | "demo"
        false    | null             | null
    }
```

Exception的场景必须单独写一个方法测试。

## Mock

### Mock 数据

```groovy
class DemoSpec extends Specification {

    class demo {
        String businessCode
    }

    private Object getJsonObject(String path, String field) {
        var let = Paths.get(getClass().getResource(path).toURI()).toFile().text
        new JsonSlurper().parseText(let)[field]
        var json = new JsonSlurper().parseText(let)
        field.split("\\.").each {
            if (it.contains('[')) {
                var index = it.substring(it.indexOf('[') + 1, it.indexOf(']'))
                json = json[it.substring(0, it.indexOf('['))][index as int]
            } else {
                json = json[it]
            }
        }
        return json
    }
    



    def "test"() {
        expect:
        var json = getJsonObject('/test.json', '1[0].businessCode')
        def jj = json as List<demo>
        println jj.get(0).businessCode
    }

}
```

### Spock中Mock()、Stub()、Spy()方法的区别

Spock的`Mock`方法不仅可以模拟方法返回结果，还可以**模拟方法行为**

`Stub()`存根方法也是一个虚拟类，比`Mock()`方法更简单一些，只返回事先准备好的假数据，而不提供交互验证（即该方法是否被调用以及将被调用多少次）。使用存根Stub只能验证状态（例如测试方法返回的结果数据是否正确，list大小等，是否符合断言）。

Spy 所包裹类的指定方法不被调用，直接返回期望的值。