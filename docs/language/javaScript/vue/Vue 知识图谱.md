# Vue 知识图谱

API：https://cn.vuejs.org/v2/api/

## 常见标志

`v-html`：原生HTML

```html
<span v-html="rawHtml"></span>
```

`v-bind`：在 HTML 上绑定属性

```html
<div v-bind:id="dynamicId"></div>
# 使用表达式，只能单个表达式
<div v-bind:id="'list-' + id"></div>
<div :id="'list-' + id"></div>

<a v-bind:[attributeName]="url"> ... </a>
<a :[attributeName]="url"> ... </a>
```

` v-if`： If 语句

```html
<p v-if="seen">现在你看到我了</p>
```

`v-else`： else 语句

```html
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

`v-else-if`： elseIf 语句

```html
<div v-else-if="type === 'B'">
```

`v-on`：事件绑定

```html
<a v-on:click="doSomething">...</a>
<a @click="doSomething">...</a>
<a v-on:[eventName]="doSomething"> ... </a>
<a @[eventName]="doSomething"> ... </a>
```

‼️ 避免使用大写字符来命名键名，因为浏览器会把 attribute 名全部强制转为小写

`v-bind:class`： 动态切换样式class

```html
<div
  class="static"
  v-bind:class="{ active: isActive, 'text-danger': hasError }"
></div>
# 数组
<div v-bind:class="[activeClass, errorClass]"></div>
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

`v-show`：用于根据条件展示元素的选项

```html
<h1 v-show="ok">Hello!</h1>
```

不同的是带有 `v-show` 的元素始终会被渲染并保留在 DOM 中。`v-show` 只是简单地切换元素的 CSS property `display`。

`v-for`： for循环

```html
 <li v-for="item in items" :key="item.message">
    {{ item.message }}
  </li>
```



## methods VS computed

- methods 定义的是方法；
- computed 定义的是计算属性；

**计算属性是基于它们的响应式依赖进行缓存的**。只在相关响应式依赖发生改变时它们才会重新求值。这就意味着只要 `message` 还没有发生改变，多次访问 `reversedMessage` 计算属性会立即返回之前的计算结果，而不必再次执行函数。

❓ 我们为什么需要缓存？假设我们有一个性能开销比较大的计算属性 **A**，它需要遍历一个巨大的数组并做大量的计算。然后我们可能有其他的计算属性依赖于 **A**。如果没有缓存，我们将不可避免的多次执行 **A** 的 getter！如果你不希望有缓存，请用方法来替代。

## computed VS watch

computed 会显得更加简单简约，不需要在data中定义赋值对象；

watch 需要在data中先申明赋值对象；



## 自定义 Component

### 引用组件

```js
export default {
  name: "demo",
  components: {
    permissionBtns: () =>
      import("@/pages/manage/DiyBtn.vue")
  }
}
```

### 回调钩子

下面的$emit 实现。

### ref

子组件的实例名称。父组件可以通过 `this.$refs.[实例名]` 获取子组件实例。

```html
<input ref="input">
```

```js
methods: {
  // 用来从父级组件聚焦输入框
  focus: function () {
    this.$refs.input.focus()
  }
}
```

获取实例的意义，就是可以在父组件中调用子组件中的方法。

```js
this.$refs["menu"].init();
```

调用 ref 为 menu 的子组件实例中的 init 方法。

### Pop

父组件传递值到子组件的方式。

```js
Vue.component('blog-post', {
  // 在 JavaScript 中是 camelCase 的
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```

```html
<!-- 在 HTML 中是 kebab-case 的 -->
<blog-post post-title="hello!"></blog-post>
```

使用 `v-bind` 可以实现绑定变量（动态传递）

```js
<blog-post v-bind:title="post.title"></blog-post>
```

https://cn.vuejs.org/v2/guide/components-props.html#ad

#### pop 验证

```js
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

## 自定义事件

```
this.$emit('myEvent')
<my-component v-on:my-event="doSomething"></my-component>
```

## 双向绑定

```html
<text-document v-bind.sync="doc"></text-document>
```

https://cn.vuejs.org/v2/guide/components-custom-events.html

## 常见知识点

### Vue.prototype.$globalConst

https://cn.vuejs.org/v2/cookbook/adding-instance-properties.html

### this[propertyName] 

在 JavaScript 中一个原型的方法会获得该实例的上下文。也就是说它们可以使用 `this` 访问数据、计算属性、方法或其它任何定义在实例上的东西。箭头函数不会生效。

```js
Vue.prototype.$reverseText = function (propertyName) {
  this[propertyName] = this[propertyName]
    .split('')
    .reverse()
    .join('')
}

new Vue({
  data: {
    message: 'Hello'
  },
  created: function () {
    console.log(this.message) // => "Hello"
    this.$reverseText('message')
    console.log(this.message) // => "olleH"
  }
})
```

### $emit

回调的一个钩子

```js
// Vue
Vue.component('welcome-button', {
  template: `
    <button v-on:click="$emit('welcome')">
      Click me to be welcomed
    </button>
  `
})
```

```html
// html
<div id="emit-example-simple">
  <welcome-button v-on:welcome="sayHi"></welcome-button>
</div>

```

```js
// vue
new Vue({
  el: '#emit-example-simple',
  methods: {
    sayHi: function () {
      alert('Hi!')
    }
  }
})
```

### Watch

```js
var data = { a: 1 }
// $watch 是一个实例方法
vm.$watch('a', function (newValue, oldValue) {
  // 这个回调将在 `vm.a` 改变后调用
})
```

用于监听 data 中值的变化，根据值变化，触发处理逻辑。

### 生命周期

beforeCreate

实例被创建钱执行代码。

created

可以用来在一个实例被创建之后执行代码。

mounted

挂载到el对象之后，执行的代码。

### [mixins](https://cn.vuejs.org/v2/api/#mixins)

合并两个数据集合，mixins中被引用的会先被调用。

```js
var mixin = {
  created: function () { console.log(1) }
}
var vm = new Vue({
  created: function () { console.log(2) },
  mixins: [mixin]
})
// => 1
// => 2
```

### format

数据格式化

```html
 <el-table-column
 prop="requestNum"
 label="本月调用次数"
 :formatter="formatterRequestNum">
 </el-table-column>
//js
formatterRequestNum(row, column, cellValue) {
                if (cellValue === null) {
                    return 0;
                } else {
                    return cellValue;
                }
            },
```

### JSON相关操作

#### 筛选列表中的值

```js
let dd = this.datasource.filter(function (d) {
    return d.id === id;
});
if (dd.length > 0) {
    dd[0].instanceId = id;
    this.$emit('onSelectDatasource', dd[0])
}
```

#### 删除值

```js
// splice
this.formData.splice(index, 1);
```

#### 添加值

```js
this.formData.push({
                    "parameterType": ''
                });
```

## async/await

Vue 模式请求是异步的方式，所以当存在先后顺序的场景，async/await 要求当前执行的内容结束之后，才能执行下面的。

异步调用实现方案。**await 只在异步函数里面才起作用**。它可以放在任何异步的，基于 promise 的函数之前。**它会暂停代码在该行上，直到 promise 完成**，然后返回结果值。在暂停的同时，其他正在等待执行的代码就有机会执行了。await 可以保证异步执行时的先后顺序。

- async 方法返回的是 Promise 对象
- 对于返回值的操作使用 then

- 对于异常处理使用 catch

```js
async function hello() {
  return greeting = await Promise.resolve("Hello");
};

hello().then(alert);
```

[https://developer.mozilla.org/zh-CN/docs/learn/JavaScript/%E5%BC%82%E6%AD%A5/Async_await](https://developer.mozilla.org/zh-CN/docs/learn/JavaScript/异步/Async_await)

## 冒号

加冒号的，说明后面的是一个变量或者表达式，没加冒号的后面就是对应的字符串字面量

## solt

https://juejin.im/post/5a69ece0f265da3e5a5777ed

https://cn.vuejs.org/v2/guide/components-slots.html

## 过滤器

```js
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>

filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

