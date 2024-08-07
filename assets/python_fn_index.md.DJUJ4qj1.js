import{_ as s,c as i,o as a,a4 as l}from"./chunks/framework.MxCO_SW-.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"python/fn/index.md","filePath":"python/fn/index.md","lastUpdated":1722991828000}'),n={name:"python/fn/index.md"},t=l(`<h2 id="函数定义" tabindex="-1">函数定义 <a class="header-anchor" href="#函数定义" aria-label="Permalink to &quot;函数定义&quot;">​</a></h2><ul><li>组织好的，可重复使用的，用来实现特定功能的代码段</li></ul><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">def my_fn </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">函数名</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(params 参数):</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  函数体</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 返回值</span></span></code></pre></div><h2 id="函数参数" tabindex="-1">函数参数 <a class="header-anchor" href="#函数参数" aria-label="Permalink to &quot;函数参数&quot;">​</a></h2><ul><li>位置参数：传递的参数和定义的参数的顺序及个数必须一致</li><li>关键字参数：通过 键=值 的形式 传入，如果有位置传参，必须放在关键字前面</li><li>不定长参数： <ol><li>位置不定长（*args） 传递的参数都会被 args 变量收集，会根据参数的位置合并为元组 tuple，args 是元组类型</li><li>关键字传递 （**kwargs） 传递的参数被 args 接收，会根据 键=值 形成一个字典</li></ol></li></ul><h2 id="函数返回值" tabindex="-1">函数返回值 <a class="header-anchor" href="#函数返回值" aria-label="Permalink to &quot;函数返回值&quot;">​</a></h2><ul><li>多个返回值，采用逗号分隔 return param1, param2</li><li>按照返回值的顺序，依次接收</li><li>支持不同类型数据 return</li></ul><h2 id="lambda-匿名函数" tabindex="-1">lambda 匿名函数 <a class="header-anchor" href="#lambda-匿名函数" aria-label="Permalink to &quot;lambda 匿名函数&quot;">​</a></h2><ul><li>只能写一行代码</li></ul><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// lambda 传入参数：函数体（一行代码）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">lambda x, </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">y</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> y;</span></span></code></pre></div><h2 id="函数说明文档" tabindex="-1">函数说明文档 <a class="header-anchor" href="#函数说明文档" aria-label="Permalink to &quot;函数说明文档&quot;">​</a></h2><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">def </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">add</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(x, y):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    add函数接收两个参数，进行2个数相</span><span style="--shiki-light:#B31D28;--shiki-dark:#FDAEB7;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">加</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    :param x</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    :param y</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    :</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> result</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  result = x + </span><span style="--shiki-light:#B31D28;--shiki-dark:#FDAEB7;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">y</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> result</span></span></code></pre></div><h2 id="函数的嵌套使用" tabindex="-1">函数的嵌套使用 <a class="header-anchor" href="#函数的嵌套使用" aria-label="Permalink to &quot;函数的嵌套使用&quot;">​</a></h2><ul><li>在一个函数中执行另一个函数</li></ul><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">def </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">func_a</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">def </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">func_b</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  func_a</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h2 id="变量的作用域" tabindex="-1">变量的作用域 <a class="header-anchor" href="#变量的作用域" aria-label="Permalink to &quot;变量的作用域&quot;">​</a></h2><ul><li><p>局部变量</p><p>定义在函数体内的变量，即只在函数体内生效</p></li><li><p>全局变量</p><p>函数体内，外都能生效的变量</p></li><li><p>global 关键字</p><p>函数内部声明变量为全局变量</p></li></ul>`,17),e=[t];function h(p,k,r,d,E,o){return a(),i("div",null,e)}const u=s(n,[["render",h]]);export{g as __pageData,u as default};