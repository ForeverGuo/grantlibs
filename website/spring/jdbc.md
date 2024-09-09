## 添加依赖

1. spring jdbc 依赖
2. mysql 驱动

## 配置数据源

1. 可以配置自己的数据源(只要实现 DataSource 接口即可)
2. 可以使用第三方例如 德鲁伊，c3p0，dbcp 连接池

## 注入 Bean

```js
<!--配置自己写的数据源-->
<!--当然也可以集成其他人的或组织的数据源 例如：dbcp，druid-->
<bean id="ds" class="com.powernode.spring6.bean.MyDataSource">
    <property name="driver" value="com.mysql.cj.jdbc.Driver" />
    <property name="url" value="jdbc:mysql://localhost:3306/db01" />
    <property name="username" value="xxx" />
    <property name="password" value="xxx" />
</bean>

<!--配置jdbcTemplate-->
<bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
    <property name="dataSource" ref="ds" />
</bean>
```

## 测试获取 bean

```js
@Test
public void testJdbc() {
    ApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
    JdbcTemplate jdbcTemplate = context.getBean("jdbcTemplate", JdbcTemplate.class);
    System.out.println(jdbcTemplate);
}
```
