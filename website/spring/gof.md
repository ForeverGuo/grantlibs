## 代理模式的作用

1. 当一个对象需要受到保护的时候，可以考虑使用代理对象完成某个行为
2. 需要给某个对象进行功能增强的时候，可以考虑找一个代理进行增强
3. 在程序中，对象 A 和对象 B 无法直接交互时

## 代理模式三大角色

1. 目标对象
2. 代理对象
3. 目标对象和代理对象的公共接口

## 代理模式代码实现形式

1. 静态代理
   会造成类爆炸的问题
2. 动态代理
   - 动态代理模式还是代理模式，只不过添加了<span :class="$style.special_text">字节码生成技术</span>，可以在内存中为我们生成 class 字节码，
     这个字节码就是代理类，在内存中动态的生成字节码代理的技术
   - 解决代理类的数量
   - 解决代码复用

### 实现动态代理的方式

1. JDK 动态代理：只能代理接口
2. CGLIB 动态代理：既可以代理接口，又可以代理类（底层有个小而快的字节码处理框架 ASM）
3. javassist 动态代理

## 扩展

### 类和类之间的关系

1. 继承（耦合度较高）
2. 关联（耦合度较低）
3. 实现
4. 依赖
5. 组合
6. 聚合

<style module>
.special_text {
  color: #00BCD4; 
  font-size: 20px; 
  padding: 20px 0;
}
.common_text {
  color: #E6A23C; 
  font-size: 20px; 
  padding: 20px 0;
}
.red_text {
  color: #f04d3c;
  font-size: 20px; 
  padding: 20px 0;
}
</style>