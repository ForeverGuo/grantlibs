## requests + BeautifulSoup

### requests 常用方法

- GET 请求方式获取 URL 位置的资源
- HEAD 获取资源的头部信息
- POST 请求方式获取 URL 位置的资源

### 方法介绍

- 基本语法

```js
url = "http://www.netbian.com/fengjing/";
response = requests.get(url);
```

- 常用参数

  1. url <br/>
     字符串类型，请求地址

  2. params <br/>
     字典类型，用来携带查询参数 <br/>
     该方法会自动对 params 字典进行编码，然后和 url 拼接 <br/>
     requests.get(url, params)

  3. headers <br/>
     字典类型，请求头，用来携带请求头部信息 <br/>

  4. cookies<br/>
     字典类型，携带登录状态等信息<br/>

  5. proxies <br/>
     字典类型，用来设置代理 ip 服务器，获取和使用方法同上<br/>

  6. timeout <br/>
     整数类型，用于设定请求超时时间，单位为妙 <br/>

- response 常用属性和方法

  1. status_code 属性 <br/>
     http 请求的返回状态，若为 200 则表示请求成功 <br/>

  2. text 属性 <br/>
     http 响应内容的字符串形式，即返回的页面内容 <br/>

  3. content 属性 <br/>
     http 响应的二进制形式，语法同上 <br/>

  4. encoding 属性 <br/>
     用来设置 response 的编码形式，如果请求的页面中包含中文，那么就需要设置 encoding 属性 <br/>

  5. raise_for_status() 方法 <br/>
     该方法判断 status_code 是否等于 200，如果不等于，则抛出异常。<br/>

  6. json() 方法 <br/>
     获取 http 响应内容的 json 格式数据

## selenium + PyQuery
