# Vue 知识图谱

API：https://cn.vuejs.org/v2/api/

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

使用 `v-bind` 可以实现绑定变量

```js
<blog-post v-bind:title="post.title"></blog-post>
```

https://cn.vuejs.org/v2/guide/components-props.html#ad



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

## async/await

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