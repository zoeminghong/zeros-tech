**请说说面向对象的特征？**

四点：**封装**、**继承**、**多态**、**抽象**

1）封装

封装，给对象提供了隐藏内部特性和行为的能力。对象提供一些能被其他对象访问的方法来改变它内部的数据。在 Java 当中，有 4 种修饰符： `default`、`public`、`private` 和 `protected` 。**每一种修饰符给其他的位于同一个包或者不同包下面对象赋予了不同的访问权限。**

下面列出了使用封装的一些好处：

- 通过隐藏对象的属性来保护对象内部的状态。
- 提高了代码的可用性和可维护性，因为对象的行为可以被单独的改变或者是扩展。
- 禁止对象之间的不良交互提高模块化。

2）继承

继承，给对象提供了从基类获取字段和方法的能力。**继承提供了代码的重用行**，也可以在不修改类的情况下给现存的类添加新特性。

3）多态

多态，是编程语言**给不同的底层数据类型做相同的接口展示的一种能力**。一个多态类型上的操作，可以应用到其他类型的值上面。

4）抽象

抽象，是**把想法从具体的实例中分离出来的步骤**，因此，要根据他们的功能而不是实现细节来创建类。

Java 支持创建只暴露接口而不包含方法实现的抽象的类。这种抽象技术的主要目的是把类的行为和实现细节分离开。

**面向对象和面向过程的区别？**

- 面向过程
  - 优点：性能比面向对象高，因为类调用时需要实例化，开销比较大，比较消耗资源。比如，单片机、嵌入式开发、Linux/Unix 等一般采用面向过程开发，性能是最重要的因素。
  - 缺点：没有面向对象易维护、易复用、易扩展。
- 面向对象
  - 优点：易维护、易复用、易扩展，由于面向对象有封装、继承、多态性的特性，可以设计出低耦合的系统，使系统更加灵活、更加易于维护。
  - 缺点：性能比面向过程低。

## 什么是字节码？采用字节码的最大好处是什么？

**什么是字节码？**

> 这个问题，面试官可以衍生提问，Java 是编译执行的语言，还是解释执行的语言。

Java 中引入了虚拟机的概念，即在机器和编译程序之间加入了一层抽象的虚拟的机器。这台虚拟的机器在任何平台上都提供给编译程序一个的共同的接口。

编译程序只需要面向虚拟机，生成虚拟机能够理解的代码，然后由解释器来将虚拟机代码转换为特定系统的机器码执行。在 Java 中，这种供虚拟机理解的代码叫做字节码（即扩展名为 `.class` 的文件），它不面向任何特定的处理器，只面向虚拟机。

每一种平台的解释器是不同的，但是实现的虚拟机是相同的。Java 源程序经过编译器编译后变成字节码，字节码由虚拟机解释执行，虚拟机将每一条要执行的字节码送给解释器，解释器将其翻译成特定机器上的机器码，然后在特定的机器上运行。**这也就是解释了 Java 的编译与解释并存的特点**。

```
Java 源代码
=> 编译器 => JVM 可执行的 Java 字节码(即虚拟指令)
=> JVM => JVM 中解释器 => 机器可执行的二进制机器码 => 程序运行
```

**采用字节码的好处？**

Java 语言通过字节码的方式，在一定程度上解决了**传统解释型语言执行效率低的问题，同时又保留了解释型语言可移植的特点。**所以 Java 程序运行时比较高效，而且，由于字节码并不专对一种特定的机器，因此，Java程序无须重新编译便可在多种不同的计算机上运行。

> 解释型语言：解释型语言，是在运行的时候将程序翻译成机器语言。解释型语言的程序不需要在运行前编译，在运行程序的时候才翻译，专门的解释器负责在每个语句执行的时候解释程序代码。这样解释型语言每执行一次就要翻译一次，效率比较低。——百度百科
>
> 例如：Python、PHP 。

**char 型变量中能不能存贮一个中文汉字？为什么？**

- 在 C 语言中，char 类型占 1 个字节，而汉字占 2 个字节，所以不能存储。
- 在 Java 语言中，char 类型占 2 个字节，而且 Java 默认采用 Unicode 编码，一个 Unicode 码是 16 位，所以一个 Unicode 码占两个字节，Java 中无论汉字还是英文字母，**都是用 Unicode 编码来表示的**。所以，**在 Java 中，char 类型变量可以存储一个中文汉字。**

**String s = new String("xyz") 会创建几个对象？**

- 首先，在 String 池内找，找到 `"xyz"` 字符串，不创建 `"xyz"` 对应的 String 对象，否则创建一个对象。
- 然后，遇到 `new` 关键字，在内存上创建 String 对象，并将其返回给 `s` ，又一个对象。

所以，总共是 1 个或者 2 个对象。

**String 为什么是不可变的？**

简单的来说，String 类中使用 `final` 关键字字符数组保存字符串。代码如下：

```
// String.java

private final char[] value;
```

- 所以 String 对象是不可变的。

而 StringBuilder 与 StringBuffer 都继承自 AbstractStringBuilder 类，在 AbstractStringBuilder 中也是使用字符数组保存字符串 `char[] value` ，但是没有用 `final` 关键字修饰。代码如下：

```
// AbstractStringBuilder.java

char[] value;
```

- 所以这两种对象都是可变的。

**String 类能被继承吗，为什么？**

不能，因为 String 是 `final` 修饰。

## 什么是自动拆装箱？

自动装箱和拆箱，就是基本类型和引用类型之间的转换。

🦅 **为什么要转换？**

如果你在 Java5 下进行过编程的话，你一定不会陌生这一点，你不能直接地向集合( Collection )中放入原始类型值，因为集合只接收对象。

- 通常这种情况下你的做法是，将这些原始类型的值转换成对象，然后将这些转换的对象放入集合中。使用 Integer、Double、Boolean 等这些类，我们可以将原始类型值转换成对应的对象，但是从某些程度可能使得代码不是那么简洁精炼。
- 为了让代码简练，Java5 引入了具有在原始类型和对象类型自动转换的装箱和拆箱机制。
- 但是自动装箱和拆箱并非完美，在使用时需要有一些注意事项，如果没有搞明白自动装箱和拆箱，可能会引起难以察觉的 Bug 。

🦅 **int 和 Integer 有什么区别？**

- `int` 是基本数据类型。
- Integer 是其包装类，注意是一个类。

当然，要注意下 Integer 的缓存策略，可以看看 [《理解Java Integer 的缓存策略》](http://www.importnew.com/18884.html) 文章。

## equals 与 == 的区别？

- 值类型（int,char,long,boolean等）的话

  - 都是用 == 判断相等性。
  
- 对象引用的话

  - == 判断引用所指的对象是否是同一个。

  - equals 方法，是 Object 的成员函数，有些类会覆盖(`override`) 这个方法，用于判断对象的等价性。

    > 例如 String 类，两个引用所指向的 String 都是 `"abc"` ，但可能出现他们实际对应的对象并不是同一个（和 JVM 实现方式有关），因此用 == 判断他们可能不相等，但用 equals 方法判断一定是相等的。

🦅 **如何在父类中为子类自动完成所有的 hashCode 和 equals 实现？这么做有何优劣？**

父类的 equals ，一般情况下是无法满足子类的 equals 的需求。

- 比如所有的对象都继承 Object ，默认使用的是 Object 的 equals 方法，在比较两个对象的时候，是看他们是否指向同一个地址。但是我们的需求是对象的某个属性相同，就相等了，而默认的 equals 方法满足不了当前的需求，所以我们要重写 equals 方法。
- 如果重写了 equals 方法，就必须重写 hashCode 方法，否则就会降低 Map 等集合的索引速度。

🦅 **说一说你对 java.lang.Object 对象中 hashCode 和 equals 方法的理解。在什么场景下需要重新实现这两个方法?**

这个问题，和上个 [「如何在父类中为子类自动完成所有的 hashCode 和 equals 实现？这么做有何优劣？」](http://svip.iocoder.cn/Java/Core/Interview/#) 一样的答案。

🦅 **这样的 a.hashCode() 有什么用，与 a.equals(b) 有什么关系?**

> 这个问题，和上述问题，就是换个姿势，差不了太多。

1. equals 方法，用于比较对象的内容是否相等。

   > 当覆盖了 equals 方法时，比较对象是否相等将通过覆盖后的 equals 方法进行比较（判断对象的内容是否相等）。

2. hashCode 方法，大多在集合中用到。

   > 将对象放入到集合中时，首先判断要放入对象的 hashCode 值与集合中的任意一个元素的 hashCode 值是否相等，如果不相等直接将该对象放入集合中。
   >
   > 如果 hashCode 值相等，然后再通过 equals 方法判断要放入对象与集合中的任意一个对象是否相等，如果 equals 判断不相等，直接将该元素放入到集合中，否则不放入。

🦅 **有没有可能 2 个不相等的对象有相同的 hashCode？**

可能会发生，这个被称为**哈希碰撞**。当然，相等的对象，即我们重写了 equals 方法，一定也要重写 hashCode 方法，否则将出现我们在 HashMap 中，相等的对象作为 key ，将找不到对应的 value 。

所以说，equals 和 hashCode 的关系会是：

- equals 不相等，hashCode 可能相等。
- equals 相等，请重写 hashCode 方法，保证 hashCode 相等。

一般来说，hashCode 方法的重写，可以看看 [《科普：为什么 String hashCode 方法选择数字31作为乘子》](https://segmentfault.com/a/1190000010799123) 方法。

## final、finally、finalize 的区别？

1）final

`final` ，是修饰符关键字。

- 如果一个类被声明为 `final` ，意味着它不能再派生出新的子类，不能作为父类被继承。因此一个类不能既被声明为 `abstract` 的，又被声明为 `final` 的。
- 将变量或方法声明为 `final` ，可以保证它们在使用中不被改变。被声明为 final 的变量必须在声明时给定初值，而在以后的引用中只能读取，不可修改。被声明为 `final` 的方法也同样只能使用，不能重写。

> 另外，在早期的 Java 实现版本中，会将 `final` 方法转为内嵌调用。但是如果方法过于庞大，可能看不到内嵌调用带来的任何性能提升（现在的 Java 版本已经不需要使用 `final` 方法进行这些优化了）。类中所有的`private` 方法都隐式地指定为 `final` 。

2）finally

在异常处理时提供 `finally` 块来执行任何清除操作。如果抛出一个异常，那么相匹配的 `catch` 子句就会执行，然后控制就会进入 `finally` 块（如果有的话）。

在以下 4 种特殊情况下，finally块不会被执行：

- 在 `finally` 语句块中发生了异常。
- 在前面的代码中用了 `System.exit()` 退出程序。
- 程序所在的线程死亡。
- 关闭 CPU 。

3）finalize

`finalize` ，是方法名。

Java 允许使用 `#finalize()` 方法，在垃圾收集器将对象从内存中清除出去之前做必要的清理工作。这个方法是由垃圾收集器在确定这个对象没有被引用时对这个对象调用的。

- 它是在 Object 类中定义的，因此所有的类都继承了它。
- 子类覆盖 `finalize()` 方法，以整理系统资源或者执行其他清理工作。
- `#finalize()` 方法，**是在垃圾收集器删除对象之前对这个对象调用的。**

一般情况下，我们在业务中不会自己实现这个方法，更多是在一些框架中使用，例如 [《Netty Using finalize() to release ByteBufs》](https://github.com/netty/netty/issues/4145) 。

## 抽象类和接口有什么区别？

从设计层面来说，抽象是对类的抽象，是一种模板设计，接口是行为的抽象，是一种行为的规范。

- Java 提供和支持创建抽象类和接口。它们的实现有共同点，不同点在于：接口中所有的方法隐含的都是抽象的，而抽象类则可以同时包含抽象和非抽象的方法。
- 类可以实现很多个接口，但是只能继承一个抽象类。类可以不实现抽象类和接口声明的所有方法，当然，在这种情况下，类也必须得声明成是抽象的。
- 抽象类可以在不提供接口方法实现的情况下实现接口。
- Java 接口中声明的变量默认都是 `final` 的。抽象类可以包含非 `final` 的变量。
- Java 接口中的成员函数默认是 `public` 的。抽象类的成员函数可以是 `private`，`protected` 或者是 `public` 。
- 接口是绝对抽象的，不可以被实例化。抽象类也不可以被实例化，但是，如果它包含 `#main(String[] args)` 方法的话是可以被调用的。

继承和组合的区别在哪？

- 继承：指的是一个类（称为子类、子接口）继承另外的一个类（称为父类、父接口）的功能，并可以增加它自己的新功能的能力，**继承是类与类或者接口与接口之间最常见的关系。在 Java 中，此类关系通过关键字 `extends` 明确标识**，在设计时一般没有争议性。
- 组合：组合是关联关系的一种特例，他体现的是整体与部分、拥有的关系，即 has-a 的关系，**此时整体与部分之间是可分离的，他们可以具有各自的生命周期**，部分可以属于多个整体对象，也可以为多个整体对象共享。
  - 比如，计算机与 CPU 、公司与员工的关系等。
  - 表现在代码层面，和关联关系是一致的，只能从语义级别来区分。

因为组合能带来比继承更好的灵活性，所以有句话叫做“组合优于继承”。感兴趣的胖友，可以看看 [《怎样理解“组合优于继承”以及“OO的反模块化”，在这些方面FP具体来说有什么优势？》](https://www.zhihu.com/question/21862257) 文章。

请详细讲述一下 RandomAccess 接口有什么作用？

RandomAccess 用来当标记的，是一种标记接口，接口的非典型用法。意思是，随机访问任意下标元素都比较快。

用处，当要实现某些算法时，会判断当前类是否实现了 RandomAccess 接口，会根据结果选择不同的算法。

## 讲讲类的实例化顺序？

初始化顺序如下：

- 父类静态变量
- 父类静态代码块
- 子类静态变量、
- 子类静态代码块
- 父类非静态变量（父类实例成员变量）
- 父类构造函数
- 子类非静态变量（子类实例成员变量）
- 子类构造函数

## 什么是内部类？

简单的说，就是在一个类、接口或者方法的内部创建另一个类。这样理解的话，创建内部类的方法就很明确了。当然，详细的可以看看 [《Java 内部类总结（吐血之作）》](https://blog.csdn.net/hikvision_java_gyh/article/details/8964155) 文章。

🦅 **内部类的作用是什么？**

内部类提供了更好的封装，除了该外围类，其他类都不能访问。

🦅 **Anonymous Inner Class(匿名内部类)是否可以继承其它类？是否可以实现接口？**

可以继承其他类或实现其他接口，在 Java 集合的流式操作中，我们常常这么干。

🦅 **内部类可以引用它的包含类（外部类）的成员吗？有没有什么限制？**

一个内部类对象可以访问创建它的外部类对象的成员，包括私有成员。

## 什么是 Java 序列化？

序列化就是一种用来处理对象流的机制，所谓对象流也就是将对象的内容进行流化。

- 可以对流化后的对象进行读写操作，也可将流化后的对象传输于网络之间。
- 序列化是为了解决在对对象流进行读写操作时所引发的问题。

反序列化的过程，则是和序列化相反的过程。

> 另外，我们不能将序列化局限在 Java 对象转换成二进制数组，例如说，我们将一个 Java 对象，转换成 JSON 字符串，或者 XML 字符串，这也可以理解为是序列化。

🦅 **如何实现 Java 序列化？**

> 如下的方式，就是 Java 内置的序列化方案，实际场景下，我们可以自定义序列化的方案，例如说 Google Protobuf 。

将需要被序列化的类，实现 Serializable 接口，该接口没有需要实现的方法，`implements Serializable` 只是为了标注该对象是可被序列化的。

- 序列化
  - 然后，使用一个输出流(如：FileOutputStream)来构造一个 ObjectOutputStream(对象流)对象
  - 接着，使用 ObjectOutputStream 对象的 `#writeObject(Object obj)` 方法，就可以将参数为 `obj` 的对象写出(即保存其状态)。
- 反序列化
  - 要恢复的话则用输入流。

🦅 **Java 序列话中，如果有些字段不想进行序列化怎么办？**

对于不想进行序列化的变量，使用 `transient` 关键字修饰。

- 当对象被序列化时，阻止实例中那些用此关键字修饰的的变量序列化。
- 当对象被反序列化时，被 `transient` 修饰的变量值不会被持久化和恢复。
- `transient` 只能修饰变量，不能修饰类和方法。

## 如何实现对象克隆？

一般来说，有两种方式：

- 1、实现 Cloneable 接口，并重写 Object 类中的 `#clone()` 方法。可以实现**浅克隆**，也可以实现**深克隆**。
- 2、实现 Serializable 接口，通过对象的序列化和反序列化实现克隆。可以实现真正的**深克隆**。

> 艿艿：这个问题，也可以变种来问，什么是**浅克隆**和**深克隆**。

具体的代码实现，可以看看 [《Java 对象的浅克隆和深克隆》](https://blog.csdn.net/caomiao2006/article/details/52590622) 文章。

实际场景下，我们使用的克隆比较少，更多是对象之间的属性克隆。例如说，将 DO 的属性复制到 DTO 中，又或者将 DTO 的属性复制到 VO 中。此时，我们一般使用 BeanUtils 工具类。具体的使用，看看 [《浅谈 BeanUtils 的拷贝，深度克隆》](https://www.cnblogs.com/tison/p/7840647.html) 文章。

## error 和 exception 有什么区别？CheckedException 和 RuntimeException 有什么区别？

Java 的异常体系，基于共同的祖先 `java.lang.Throwable` 类。如下图所示：

![Throwable 类图](assets/3b7fc781e8c5f9b354fbab05639dbcca.png)

> 感谢【贾鹤鸣】胖友指出的问题。图有点问题：
>
> 1. 图中的 ArrithmeticException 异常，多了一个 r ，正确拼写是 ArithmeticException 。
> 2. 图中 ClassNotFoundException 异常，父类是 `ReflectiveOperationException => Exception` ，不属于 RunTimeException 。

- Error（错误），表示系统级的错误和程序不必处理的异常，是 Java 运行环境中的内部错误或者硬件问题。
  - 例如：内存资源不足等。
  - 对于这种错误，程序基本无能为力，除了退出运行外别无选择，它是由 Java 虚拟机抛出的。
- Exception（异常），表示需要捕捉或者需要程序进行处理的异常，它处理的是因为程序设计的瑕疵而引起的问题或者在外的输入等引起的一般性问题，是程序必须处理的。Exception 又分为运行时异常，受检查异常。
  - RuntimeException(运行时异常)，表示无法让程序恢复的异常，导致的原因通常是因为执行了错误的操作，建议终止逻辑，因此，编译器不检查这些异常。
  - CheckedException(受检查异常)，是表示程序可以处理的异常，也即表示程序可以修复（由程序自己接受异常并且做出处理），所以称之为受检查异常。

**异常的使用的注意地方？**

神作《Effective Java》中对异常的使用给出了以下指导原则：

> 艿艿：该书，十分推荐去阅读。

- 不要将异常处理用于正常的控制流（设计良好的 API 不应该强迫它的调用者为了正常的控制流而使用异常）。
- 对可以恢复的情况使用受检异常，对编程错误使用运行时异常。
- 避免不必要的使用受检异常（可以通过一些状态检测手段来避免异常的发生）。
- 优先使用标准的异常。
- 每个方法抛出的异常都要有文档。
- 保持异常的原子性
- 不要在 `catch` 中忽略掉捕获到的异常。

🦅 **Throwable 类常用方法？**

- `#getMessage()` 方法：返回异常发生时的详细信息。

- `#getCause()` 方法：获得导致当前 Throwable 异常的 Throwable 异常。

- ```
  #getStackTrace()
  ```

   

  方法：获得 Throwable 对象封装的异常信息。

  - `#printStackTrace()` 方法：在控制台上打印。

🦅 **请列出 5 个运行时异常？**

- NullPointerException
- IndexOutOfBoundsException
- ClassCastException
- ArrayStoreException
- BufferOverflowException

🦅 **throw 与 throws 的区别 ？**

- `throw` ，用于在程序中显式地抛出一个异常。
- `throws` ，用于指出在该方法中没有处理的异常。**每个方法必须显式指明哪些异常没有处理，以便该方法的调用者可以预防可能发生的异常**。最后，多个异常用逗号分隔。

🦅 **异常处理中 finally 语句块的重要性?**

不管程序是否发生了异常, `finally` 语句块都会被执行，甚至当没有`catch` 声明但抛出了一个异常时, `finally` 语句块也会被执行。

`finally` 语句块通常用于释放资源, 如 I/O 缓冲区, 数据库连接等等。

🦅 **异常被处理后异常对象会发生什么?**

> 艿艿：这个问题有点奇怪，从网上找来的…

异常对象会在下次 GC 执行时被回收。

🦅 **UnsupportedOperationException 是什么？**

UnsupportedOperationException ，是用于表明操作不支持的异常。

在 JDK 类中已被大量运用，在集合框架`java.util.Collections.UnmodifiableCollection` 将会在所有 add 和 remove 操作中抛出这个异常。

## 说说反射的用途及实现？

Java 反射机制主要提供了以下功能：

- 在运行时构造一个类的对象。
- 判断一个类所具有的成员变量和方法。
- 调用一个对象的方法。
- 生成动态代理。

反射的应用很多，很多框架都有用到：

- Spring 框架的 IoC 基于反射创建对象和设置依赖属性。
- Spring MVC 的请求调用对应方法，也是通过反射。
- JDBC 的 `Class#forName(String className)` 方法，也是使用反射。

不了解 Java 反射的同学，可以看看 [《什么是反射、反射可以做些什么》](http://www.cnblogs.com/zhaopei/p/reflection.html) 。

> 对于大多数 Java 萌新，包括艿艿在内。不过后来发现，再难的 Java 知识，未来都需要变成我们的基础知识，嘻嘻。

🦅 **反射中，Class.forName 和 ClassLoader 区别？**

这两者，都可用来对类进行加载。差别在于：

- `Class#forName(...)` 方法，除了将类的 `.class` 文件加载到JVM 中之外，还会对类进行解释，执行类中的 `static` 块。

- ClassLoader 只干一件事情，就是将 `.class` 文件加载到 JVM 中，不会执行 `static` 中的内容，只有在 newInstance 才会去执行 `static` 块。

  > `Class#forName(name, initialize, loader)` 方法，带参函数也可控制是否加载 `static` 块，并且只有调用了newInstance 方法采用调用构造函数，创建类的对象。

详细的测试，可以看看 [《Java 反射中，Class.forName 和ClassLoader 的区别(代码说话)》](https://blog.csdn.net/qq_27093465/article/details/52262340) 文章。

## 什么是注解？

直接看 [《深入浅出 Java 注解》](https://www.jianshu.com/p/5cac4cb9be54) 。

如果胖友没有自己实现自定义的注解，千万一定马上去尝试写下。酱紫，我们会对注解，有更好且清晰的认识。

## 什么时候用断言（`assert`）？

断言，在软件开发中是一种常用的调试方式，很多开发语言中都支持这种机制。

- 一般来说，**断言用于保证程序最基本、关键的正确性。**断言检查通常在开发和测试时开启。为了保证程序的执行效率，在软件发布后断言检查通常是关闭的。

- 断言是一个包含布尔表达式的语句，在执行这个语句时假定该表达式为`true`；如果表达式的值为 `false` ，那么系统会报告一个AssertionError 错误。断言的使用如下面的代码所示：

  ```
  assert(a > 0); // throws an AssertionError if a <= 0
  ```

  - 断言可以有两种形式：
    - `assert Expression1;` 。
    - `assert Expression1 : Expression2;` 。
    - Expression1 应该总是产生一个布尔值。
    - Expression2 可以是得出一个值的任意表达式；这个值用于生成显示更多调试信息的字符串消息。

- 要在运行时启用断言，可以在启动 JVM 时使用 `-enableassertions` 或者 `-ea` 标记。要在运行时选择禁用断言，可以在启动 JVM 时使用 `-da` 或者 `-disableassertions` 标记。要在系统类中启用或禁用断言，可使用 `-esa` 或 `-dsa` 标记。还可以在包的基础上启用或者禁用断言。

当然，实际场景下，我们会在 Spring 的源码中看到，它自己封装了 Assert 类，实现更方便的断言功能，并且，在生产环境下也启用。

另外，在单元测试中，也会使用自己封装的断言类，判断执行结果的正确与错误。

## Java 对象创建的方式？

1. 使用 `new` 关键字创建对象。
2. 使用 Class 类的 newInstance 方法(反射机制)。
3. 使用 Constructor 类的 newInstance 方法(反射机制)。
4. 使用 clone 方法创建对象。
5. 使用(反)序列化机制创建对象。

## Java 集合框架有哪些？

Java 集合框架，可以看看 [《Java 集合框架》](http://www.runoob.com/java/java-collections.html) 文章。

🦅 **说出一些集合框架的优点？**

集合框架的部分优点如下：

- 1、使用核心集合类降低开发成本，而非实现我们自己的集合类。
- 2、随着使用经过严格测试的集合框架类，代码质量会得到提高。
- 3、通过使用 JDK 附带的集合类，可以降低代码维护成本。
- 4、复用性和可操作性。

🦅 **集合框架中的泛型有什么优点？**

Java5 引入了泛型，所有的集合接口和实现都大量地使用它。泛型允许我们为集合提供一个可以容纳的对象类型。因此，如果你添加其它类型的任何元素，它会在编译时报错。这避免了在运行时出现 ClassCastException，因为你将会在编译时得到报错信息。

泛型也使得代码整洁，我们不需要使用显式转换和 `instanceOf` 操作符。它也给运行时带来好处，因为不会产生类型检查的字节码指令。

## Java 集合框架的基础接口有哪些？

- Collection ，为集合层级的根接口。一个集合代表一组对象，这些对象即为它的元素。Java 平台不提供这个接口任何直接的实现。
  - Set ，是一个不能包含重复元素的集合。这个接口对数学集合抽象进行建模，被用来代表集合，就如一副牌。
  - List ，是一个有序集合，可以包含重复元素。你可以通过它的索引来访问任何元素。List 更像长度动态变换的数组。
- Map ，是一个将 key 映射到 value 的对象。一个 Map 不能包含重复的 key，每个 key 最多只能映射一个 value 。
- 一些其它的接口有 Queue、Dequeue、SortedSet、SortedMap 和 ListIterator 。

🦅 **为何 Collection 不从 Cloneable 和 Serializable 接口继承？**

Collection 接口指定一组对象，对象即为它的元素。

- 如何维护这些元素由 Collection 的具体实现决定。例如，一些如 List 的 Collection 实现允许重复的元素，而其它的如 Set 就不允许。
- 很多 Collection 实现有一个公有的 clone 方法。然而，把它放到集合的所有实现中也是没有意义的。这是因为 Collection 是一个抽象表现，重要的是实现。

当与具体实现打交道的时候，克隆或序列化的语义和含义才发挥作用。所以，具体实现应该决定如何对它进行克隆或序列化，或它是否可以被克隆或序列化。在所有的实现中授权克隆和序列化，最终导致更少的灵活性和更多的限制，**特定的实现应该决定它是否可以被克隆和序列化**。

🦅 **为何 Map 接口不继承 Collection 接口？**

尽管 Map 接口和它的实现也是集合框架的一部分，但 Map 不是集合，集合也不是 Map。因此，Map 继承 Collection 毫无意义，反之亦然。

如果 Map 继承 Collection 接口，那么元素去哪儿？Map 包含 key-value 对，它提供抽取 key 或 value 列表集合( Collection )的方法，但是它不适合“一组对象”规范。

🦅 **Collection 和 Collections 的区别？**

- Collection ，是集合类的上级接口，继承与他的接口主要有 Set 和List 。
- Collections ，是针对集合类的一个工具类，它提供一系列静态方法实现对各种集合的搜索、排序、线程安全化等操作。

🦅 **集合框架里实现的通用算法有哪些？**

Java 集合框架提供常用的算法实现，比如排序和搜索。

Collections类包含这些方法实现。大部分算法是操作 List 的，但一部分对所有类型的集合都是可用的。部分算法有排序、搜索、混编、最大最小值。

🦅 **集合框架底层数据结构总结**

1）List

- ArrayList ：Object 数组。
- Vector ：Object 数组。
- LinkedList ：双向链表(JDK6 之前为循环链表，JDK7 取消了循环)。

2）Map

- HashMap ：
  - JDK8 之前，HashMap 由数组+链表组成的，数组是HashMap的主体，链表则是主要为了解决哈希冲突而存在的（“拉链法”解决冲突）。
  - JDK8 以后，在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8 ）时，将链表转化为红黑树，以减少搜索时间。
- LinkedHashMap ：LinkedHashMap 继承自 HashMap，所以它的底层仍然是基于拉链式散列结构即由数组和链表或红黑树组成。另外，LinkedHashMap 在上面结构的基础上，增加了一条双向链表，使得上面的结构可以保持键值对的插入顺序。同时通过对链表进行相应的操作，实现了访问顺序相关逻辑。详细可以查看：[《LinkedHashMap 源码详细分析（JDK1.8）》](https://www.imooc.com/article/22931) 。
- Hashtable ：数组+链表组成的，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的。
- TreeMap ：红黑树（自平衡的排序二叉树）。

3）Set

- HashSet ：无序，唯一，基于 HashMap 实现的，底层采用 HashMap 来保存元素。
- LinkedHashSet ：LinkedHashSet 继承自 HashSet，并且其内部是通过 LinkedHashMap 来实现的。有点类似于我们之前说的LinkedHashMap 其内部是基于 HashMap 实现一样，不过还是有一点点区别的。
- TreeSet ：有序，唯一，红黑树(自平衡的排序二叉树)。

## 什么是迭代器(Iterator)？

Iterator 接口，提供了很多对集合元素进行迭代的方法。每一个集合类都包含了可以返回迭代器实例的迭代方法。迭代器可以在迭代的过程中删除底层集合的元素，但是不可以直接调用集合的 `#remove(Object Obj)` 方法删除，可以通过迭代器的 `#remove()` 方法删除。

🦅 **Iterator 和 ListIterator 的区别是什么？**

- Iterator 可用来遍历 Set 和 List 集合，但是 ListIterator 只能用来遍历 List。
- Iterator 对集合只能是前向遍历，ListIterator 既可以前向也可以后向。
- ListIterator 实现了 Iterator 接口，并包含其他的功能。比如：增加元素，替换元素，获取前一个和后一个元素的索引等等。

🦅 **快速失败（fail-fast）和安全失败（fail-safe）的区别是什么？**

差别在于 ConcurrentModification 异常：

- 快速失败：当你在迭代一个集合的时候，如果有另一个线程正在修改你正在访问的那个集合时，就会抛出一个 ConcurrentModification 异常。 在 `java.util` 包下的都是快速失败。
- 安全失败：你在迭代的时候会去底层集合做一个拷贝，所以你在修改上层集合的时候是不会受影响的，不会抛出 ConcurrentModification 异常。在 `java.util.concurrent` 包下的全是安全失败的。

🦅 **如何删除 List 中的某个元素？**

有两种方式，分别如下：

- 方式一，使用 Iterator ，顺序向下，如果找到元素，则使用 remove 方法进行移除。
- 方式二，倒序遍历 List ，如果找到元素，则使用 remove 方法进行移除。

🦅 **Enumeration 和 Iterator 接口有什么不同？**

- Enumeration 跟 Iterator 相比较快两倍，而且占用更少的内存。
- 但是，Iterator 相对于 Enumeration 更安全，因为其他线程不能修改当前迭代器遍历的集合对象。同时，Iterators 允许调用者从底层集合中移除元素，这些 Enumerations 都没法完成。

对于很多胖友，可能并未使用过 Enumeration 类，所以可以看看 [《Java Enumeration 接口》](http://www.runoob.com/java/java-enumeration-interface.html) 文章。

🦅 **为何 Iterator 接口没有具体的实现？**

Iterator 接口，定义了遍历集合的方法，但它的实现则是集合实现类的责任。每个能够返回用于遍历的 Iterator 的集合类都有它自己的 Iterator 实现内部类。

这就允许集合类去选择迭代器是 fail-fast 还是 fail-safe 的。比如，ArrayList 迭代器是 fail-fast 的，而 CopyOnWriteArrayList 迭代器是 fail-safe 的。

## Comparable 和 Comparator 的区别?

- Comparable 接口，在 `java.lang` 包下，用于当前对象和其它对象的比较，所以它有一个 `#compareTo(Object obj)` 方法用来排序，该方法只有一个参数。
- Comparator 接口，在 `java.util` 包下，用于传入的两个对象的比较，所以它有一个 `#compare(Object obj1, Object obj2)` 方法用来排序，该方法有两个参数。

详细的，可以看看 [《Java 自定义比较器》](https://blog.csdn.net/whing123/article/details/77851737) 文章，重点是如何自己实现 Comparable 和 Comparator 的方法。

🦅 **compareTo 方法的返回值表示的意思？**

- 大于 0 ，表示对象大于参数对象。
- 小于 0 ，表示对象小于参数对象
- 等于 0 ，表示两者相等。

🦅 **如何对 Object 的 List 排序？**

- 对 `Object[]` 数组进行排序时，我们可以用 `Arrays#sort(...)` 方法。
- 对 `List` 数组进行排序时，我们可以用 `Collections#sort(...)` 方法。

## 有哪些关于 Java 集合框架的最佳实践？

- 基于应用的需求来选择使用正确类型的集合，这对性能来说是非常重要的。例如，如果元素的大小是固定的，并且知道优先级，我们将会使用一个 Array ，而不是 ArrayList 。
- 一些集合类允许我们指定他们的初始容量。因此，如果我们知道存储数据的大概数值，就可以避免重散列或者大小的调整。
- 总是使用泛型来保证类型安全，可靠性和健壮性。同时，使用泛型还可以避免运行时的 ClassCastException 异常。
- 在 Map 中使用 JDK 提供的不可变类作为一个 key，这样可以避免 hashcode 的实现和我们自定义类的 equals 方法。
- 应该依照接口而不是实现来编程。
- 返回零长度的集合或者数组，而不是返回一个 `null` ，这样可以防止底层集合是空的。

# 区别

## List 和 Set 区别？

List，Set 都是继承自 Collection 接口。

- List 特点：元素有放入顺序，元素可重复。
- Set 特点：元素无放入顺序，元素不可重复，重复元素会覆盖掉。

> 注意：元素虽然无放入顺序，但是元素在 Set 中的位置是有该元素的 hashcode 决定的，其位置其实是固定的。
>
> 另外 List 支持 `for` 循环，也就是通过下标来遍历，也可以用迭代器，但是 Set 只能用迭代，因为他无序，无法用下标来取得想要的值。

Set 和 List 对比：

- Set：检索指定的元素效率高，删除和插入效率高，插入和删除**可能会**引起元素位置改变。
- List：和数组类似，List 可以动态增长，查找**指定的**元素效率低，插入删除指定的元素效率低，因为可能会引起其他元素位置改变。

当然，如果是随机访问（指定下标），则 List 会快于 Set 。总之，什么场景下使用 Set ，什么场景下使用 List ，还是比较明确的。

## List 和 Map 区别？

- List 是对象集合，允许对象重复。
- Map 是键值对的集合，不允许 key 重复。

## Array 和 ArrayList 有何区别？什么时候更适合用 Array？

- Array 可以容纳基本类型和对象，而 ArrayList 只能容纳对象。
- Array 是指定大小的，而 ArrayList 大小是固定的，可自动扩容。
- Array 没有提供 ArrayList 那么多功能，比如 addAll、removeAll 和 iterator 等。

尽管 ArrayList 明显是更好的选择，但也有些时候 Array 比较好用，比如下面的三种情况。

- 1、如果列表的大小已经指定，大部分情况下是存储和遍历它们
- 2、对于遍历基本数据类型，尽管 Collections 使用自动装箱来减轻编码任务，在指定大小的基本类型的列表上工作也会变得很慢。
- 3、如果你要使用多维数组，使用 `[][]` 比 List 会方便。

## ArrayList 与 LinkedList 区别？

🦅 **ArrayList**

- 优点：ArrayList 是实现了基于动态数组的数据结构，因为地址连续，一旦数据存储好了，查询操作效率会比较高（在内存里是连着放的）。
- 缺点：因为地址连续，ArrayList 要移动数据，所以插入和删除操作效率比较低。

🦅 **LinkedList**

- 优点：LinkedList 基于链表的数据结构，地址是任意的，所以在开辟内存空间的时候不需要等一个连续的地址。对于新增和删除操作 add 和 remove ，LinedList 比较占优势。LinkedList 适用于要头尾操作或插入指定位置的场景。
- 缺点：因为 LinkedList 要移动指针，所以查询操作性能比较低。

🦅 **适用场景分析**：

- 当需要对数据进行对随机访问的情况下，选用 ArrayList 。

- 当需要对数据进行多次增加删除修改时，采用 LinkedList 。

  > 如果容量固定，并且只会添加到尾部，不会引起扩容，优先采用 ArrayList 。

- 当然，绝大数业务的场景下，使用 ArrayList 就够了。主要是，注意好避免 ArrayList 的扩容，以及非顺序的插入。

🦅 **ArrayList 是如何扩容的？**

直接看 [《ArrayList 动态扩容详解》](https://www.cnblogs.com/kuoAT/p/6771653.html) 文章，很详细。主要结论如下：

- 如果通过无参构造的话，初始数组容量为 0 ，当真正对数组进行添加时，才真正分配容量。每次按照 **1.5** 倍（位运算）的比率通过 copeOf 的方式扩容。
- 在 JKD6 中实现是，如果通过无参构造的话，初始数组容量为10，每次通过 copeOf 的方式扩容后容量为原来的 **1.5** 倍。

> 重点是 1.5 倍扩容，这是和 HashMap 2 倍扩容不同的地方。

🦅 **ArrayList 集合加入 1 万条数据，应该怎么提高效率？**

ArrayList 的默认初始容量为 10 ，要插入大量数据的时候需要不断扩容，而扩容是非常影响性能的。因此，现在明确了 10 万条数据了，我们可以直接在初始化的时候就设置 ArrayList 的容量！

这样就可以提高效率了~

## ArrayList 与 Vector 区别？

ArrayList 和 Vector 都是用数组实现的，主要有这么三个区别：

- 1、Vector 是多线程安全的，线程安全就是说多线程访问同一代码，不会产生不确定的结果，而 ArrayList 不是。这个可以从源码中看出，Vector 类中的方法很多有 `synchronized` 进行修饰，这样就导致了 Vector 在效率上无法与 ArrayList 相比。

  > Vector 是一种老的动态数组，是线程同步的，效率很低，一般不赞成使用。

- 2、两个都是采用的线性连续空间存储元素，但是当空间不足的时候，两个类的增加方式是不同。

- 3、Vector 可以设置增长因子，而 ArrayList 不可以。

适用场景分析：

- 1、Vector 是线程同步的，所以它也是线程安全的，而 ArrayList 是线程无需同步的，是不安全的。如果不考虑到线程的安全因素，一般用 ArrayList 效率比较高。

  > 实际场景下，如果需要多线程访问安全的数组，使用 CopyOnWriteArrayList 。

- 2、如果集合中的元素的数目大于目前集合数组的长度时，在集合中使用数据量比较大的数据，用 Vector 有一定的优势。

  > 这种情况下，使用 LinkedList 更合适。

## HashMap 和 Hashtable 的区别？

> Hashtable 是在 Java 1.0 的时候创建的，而集合的统一规范命名是在后来的 Java2.0 开始约定的，而当时其他一部分集合类的发布构成了新的集合框架。

- Hashtable 继承 Dictionary ，HashMap 继承的是 Java2 出现的 Map 接口。
- 2、HashMap 去掉了 Hashtable 的 contains 方法，但是加上了 containsValue 和 containsKey 方法。
- 3、HashMap 允许空键值，而 Hashtable 不允许。
- 【重点】4、HashTable 是同步的，而 HashMap 是非同步的，效率上比 HashTable 要高。也因此，HashMap 更适合于单线程环境，而 HashTable 适合于多线程环境。
- 5、HashMap 的迭代器（Iterator）是 fail-fast 迭代器，HashTable的 enumerator 迭代器不是 fail-fast 的。
- 6、HashTable 中数组默认大小是 11 ，扩容方法是 `old * 2 + 1` ，HashMap 默认大小是 16 ，扩容每次为 2 的指数大小。

一般现在不建议用 HashTable 。主要原因是两点：

- 一是，HashTable 是遗留类，内部实现很多没优化和冗余。
- 二是，即使在多线程环境下，现在也有同步的 ConcurrentHashMap 替代，没有必要因为是多线程而用 Hashtable 。

🦅 **Hashtable 的 `#size()` 方法中明明只有一条语句 `"return count;"` ，为什么还要做同步？**

同一时间只能有一条线程执行固定类的同步方法，但是对于类的非同步方法，可以多条线程同时访问。所以，这样就有问题了，可能线程 A 在执行 Hashtable 的 put 方法添加数据，线程 B 则可以正常调用 `#size()` 方法读取 Hashtable 中当前元素的个数，那读取到的值可能不是最新的，可能线程 A 添加了完了数据，但是没有对 `count++` ，线程 B 就已经读取 `count` 了，那么对于线程 B 来说读取到的 `count` 一定是不准确的。

**而给 `#size()` 方法加了同步之后，意味着线程 B 调用 `#size()` 方法只有在线程 A 调用 put 方法完毕之后才可以调用，这样就保证了线程安全性**。

## HashSet 和 HashMap 的区别？

- Set 是线性结构，值不能重复。HashSet 是 Set 的 hash 实现，HashSet 中值不能重复是用 HashMap 的 key 来实现的。

- Map 是键值对映射，可以空键空值。HashMap 是 Map 的 hash 实现，key 的唯一性是通过 key 值 hashcode 的唯一来确定，value 值是则是链表结构。

  > 因为不同的 key 值，可能有相同的 hashcode ，所以 value 值需要是链表结构。

他们的共同点都是 hash 算法实现的唯一性，他们都不能持有基本类型，只能持有对象。

> 为了更好的性能，Netty 自己实现了 key 为基本类型的 HashMap ，例如 [IntObjectHashMap](https://netty.io/4.1/api/io/netty/util/collection/IntObjectHashMap.html) 。

## HashSet 和 TreeSet 的区别？

- HashSet 是用一个 hash 表来实现的，因此，它的元素是无序的。添加，删除和 HashSet 包括的方法的持续时间复杂度是 `O(1)` 。
- TreeSet 是用一个树形结构实现的，因此，它是有序的。添加，删除和 TreeSet 包含的方法的持续时间复杂度是 `O(logn)` 。

🦅 **如何决定选用 HashMap 还是 TreeMap？**

- 对于在 Map 中插入、删除和定位元素这类操作，HashMap 是最好的选择。
- 然而，假如你需要对一个有序的 key 集合进行遍历， TreeMap 是更好的选择。

基于你的 collection 的大小，也许向 HashMap 中添加元素会更快，再将 HashMap 换为 TreeMap 进行有序 key 的遍历。

## HashMap 和 ConcurrentHashMap 的区别？

ConcurrentHashMap 是线程安全的 HashMap 的实现。主要区别如下：

- 1、ConcurrentHashMap 对整个桶数组进行了分割分段(Segment)，然后在每一个分段上都用 lock 锁进行保护，相对 于Hashtable 的 syn 关键字锁的粒度更精细了一些，并发性能更好。而 HashMap 没有锁机制，不是线程安全的。

  > JDK8 之后，ConcurrentHashMap 启用了一种全新的方式实现,利用 CAS 算法。

- 2、HashMap 的键值对允许有 `null` ，但是 ConCurrentHashMap 都不允许。

## 队列和栈是什么，列出它们的区别？

栈和队列两者都被用来预存储数据。

- ```
  java.util.Queue
  ```

   

  是一个接口，它的实现类在Java并发包中。

  - 队列允许先进先出（FIFO）检索元素，但并非总是这样。
  - Deque 接口允许从两端检索元素。

- 栈与队列很相似，但它允许对元素进行后进先出（LIFO）进行检索。

  - Stack 是一个扩展自 Vector 的类，而 Queue 是一个接口。

# 原理

## HashMap 的工作原理是什么？

我们知道在 Java 中最常用的两种结构是数组和模拟指针（引用），几乎所有的数据结构都可以利用这两种来组合实现，HashMap 也是如此。实际上 HashMap 是一个**“链表散列”**。

HashMap 是基于 hashing 的原理。

[HashMap 图解](http://dl.iteye.com/upload/attachment/177479/3f05dd61-955e-3eb2-bf8e-31da8a361148.jpg)

- 我们使用 `#put(key, value)` 方法来存储对象到 HashMap 中，使用 `get(key)` 方法从 HashMap 中获取对象。
- 当我们给 `#put(key, value)` 方法传递键和值时，我们先对键调用 `#hashCode()` 方法，返回的 hashCode 用于找到 bucket 位置来储存 Entry 对象。

🦅 **当两个对象的 hashCode 相同会发生什么？**

因为 hashcode 相同，所以它们的 bucket 位置相同，“碰撞”会发生。

因为 HashMap 使用链表存储对象，这个 Entry（包含有键值对的 Map.Entry 对象）会存储在链表中。

🦅 **hashCode 和 equals 方法有何重要性？**

HashMap 使用 key 对象的 `#hashCode()` 和 `#equals(Object obj)` 方法去决定 key-value 对的索引。当我们试着从 HashMap 中获取值的时候，这些方法也会被用到。

- 如果这两个方法没有被正确地实现，在这种情况下，两个不同 Key 也许会产生相同的 `#hashCode()` 和 `#equals(Object obj)` 输出，HashMap 将会认为它们是相同的，然后覆盖它们，而非把它们存储到不同的地方。

同样的，所有不允许存储重复数据的集合类都使用 `#hashCode()` 和 `#equals(Object obj)` 去查找重复，所以正确实现它们非常重要。`#hashCode()` 和 `#equals(Object obj)` 方法的实现，应该遵循以下规则：

- 如果 `o1.equals(o2)` ，那么 `o1.hashCode() == o2.hashCode()` 总是为 `true` 的。
- 如果 `o1.hashCode() == o2.hashCode()` ，并不意味 `o1.equals(o2)` 会为 `true` 。

🦅 **HashMap 默认容量是多少？**

默认容量都是 16 ，负载因子是 0.75 。就是当 HashMap 填充了 75% 的 busket 是就会扩容，最小的可能性是（`16 * 0.75 = 12`），一般为原内存的 2 倍。

🦅 **有哪些顺序的 HashMap 实现类？**

- LinkedHashMap ，是基于元素进入集合的顺序或者被访问的先后顺序排序。
- TreeMap ，是基于元素的固有顺序 (由 Comparator 或者 Comparable 确定)。

🦅 **我们能否使用任何类作为 Map 的 key？**

我们可以使用任何类作为 Map 的 key ，然而在使用它们之前，需要考虑以下几点：

- 1、如果类重写了 equals 方法，它也应该重写 hashcode 方法。

- 2、类的所有实例需要遵循与 equals 和 hashcode 相关的规则。

- 3、如果一个类没有使用 equals ，你不应该在 hashcode 中使用它。

- 4、用户自定义 key 类的最佳实践是使之为不可变的，这样，hashcode 值可以被缓存起来，拥有更好的性能。不可变的类也可以确保hashcode 和 equals 在未来不会改变，这样就会解决与可变相关的问题了。

  > 比如，我有一个 类MyKey ，在 HashMap 中使用它。代码如下：

  

  ```
  //传递给MyKey的name参数被用于equals()和hashCode()中
  MyKey key = new MyKey('Pankaj'); //assume hashCode=1234
  myHashMap.put(key, 'Value');
  // 以下的代码会改变key的hashCode()和equals()值
  key.setName('Amit'); //assume new hashCode=7890
  //下面会返回null，因为HashMap会尝试查找存储同样索引的key，而key已被改变了，匹配失败，返回null
  myHashMap.get(new MyKey('Pankaj'));
  ```

  

  - 那就是为何 String 和 Integer 被作为 HashMap 的 key 大量使用。

🦅 **HashMap 的长度为什么是 2 的幂次方？**

为了能让 HashMap 存取高效，尽量较少碰撞，也就是要尽量把数据分配均匀，每个链表/红黑树长度大致相同。这个实现就是把数据存到哪个链表/红黑树中的算法。

这个算法应该如何设计呢？我们首先可能会想到采用 `%` 取余的操作来实现。但是，重点来了：

- 取余(`%`)操作中如果除数是 2 的幂次则等价于与其除数减一的与(`&`)操作（也就是说 `hash % length == hash & (length - 1)` 的前提是 length 是 2 的 n 次方；）。
- 并且，采用二进制位操作 `&`，相对于 `%` 能够提高运算效率，

这就解释了 HashMap 的长度为什么是 2 的幂次方。

## HashSet 的工作原理是什么？

HashSet 是构建在 HashMap 之上的 Set hashing 实现类。让我们直接撸下源码，代码如下：



```
// HashSet.java

private transient HashMap<E,Object> map;

private static final Object PRESENT = new Object();
```



- `map` 属性，当我们创建一个 HashMap 对象时，其内部也会创建一个 `map` 对象。后续 HashSet 所有的操作，实际都是基于这个 `map` 之上的封装。

- `PRESENT` 静态属性，所有 `map` 中 KEY 对应的值，都是它，避免重复创建。

- OK ，再来看一眼 add 方法，代码如下：

  

  ```
  // HashSet.java
  
  public boolean add(E e) {
      return map.put(e, PRESENT) == null;
  }
  ```

  

  - 是不是一目了然。

🦅 **HashSet 如何检查重复？**

> 艿艿：正如我们上面看到 HashSet 的实现原理，我们自然可以推导出，HashMap 也是如何检查重复滴。

如下摘取自 《Head First Java》 第二版：

当你把对象加入 HashSet 时，HashSet会先计算对象的hashcode值来判断对象加入的位置，同时也会与其他加入的对象的hashcode值作比较。

- 如果没有相符的 hashcode ，HashSet会假设对象没有重复出现。
- 但是如果发现有相同 hashcode 值的对象，这时会调用 equals 方法来检查 hashcode 相等的对象是否真的相同。
  - 如果两者相同，HashSet 就不会让加入操作成功。
  - **如果两者不同，HashSet 就会让加入操作成功**。

## EnumSet 是什么？

`java.util.EnumSet` ，是使用枚举类型的集合实现。

- 当集合创建时，枚举集合中的所有元素必须来自单个指定的枚举类型，可以是显示的或隐示的。EnumSet 是不同步的，不允许值为 `null` 的元素。
- 它也提供了一些有用的方法，比如 `#copyOf(Collection c)`、`#of(E first, E... rest)` 和 `#complementOf(EnumSet s)` 方法。

关于 EnumSet 的源码解析，见 [《EnumSet 源码分析》](https://blog.csdn.net/u010887744/article/details/50834738) 文章。

## TODO TreeMap 原理

Java 中的 TreeMap 是使用红黑树实现的。

TODO TreeMap和TreeSet在排序时如何比较元素？Collections工具类中的sort()方法如何比较元素？

等到源码解析后，在进行补充。

## Java Priority Queue 是什么?

PriorityQueue 是一个基于优先级堆的无界队列，它的元素都以他们的自然顺序有序排列。

- 在它创建的时候，我们可以可以提供一个比较器 Comparator 来负责PriorityQueue 中元素的排序。
- PriorityQueue 不允许 `` null元素，不允许不提供自然排序的对象，也不允许没有任何关联 Comparator 的对象。
- 最后，PriorityQueue 不是线程安全的，在执行入队和出队操作它需要 `O(log(n))` 的时间复杂度。

🦅 **poll 方法和 remove 方法的区别？**

poll 和 remove 方法，都是从队列中取出一个元素，差别在于：

- poll 方法，在获取元素失败的时候会返回空
- remove() 方法，失败的时候会抛出异常。

🦅 **LinkedHashMap 和 PriorityQueue 的区别是什么？**

- PriorityQueue 保证最高或者最低优先级的的元素总是在队列头部，LinkedHashMap 维持的顺序是元素插入的顺序。
- 当遍历一个 PriorityQueue 时，没有任何顺序保证，但是 LinkedHashMap 课保证遍历顺序是元素插入的顺序。