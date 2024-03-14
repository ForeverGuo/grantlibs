import{_ as n,o as l,c as o,V as a,C as s}from"./chunks/framework.e196d495.js";const d=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"api/array/unique.md","filePath":"api/array/unique.md","lastUpdated":1710416389000}'),p={name:"api/array/unique.md"},e=a(`<h3 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h3><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#BABED8;">unique</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">grantlibs</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#BABED8;">或</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span><span style="color:#BABED8;"> unique </span><span style="color:#89DDFF;">}</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">=</span><span style="color:#BABED8;"> </span><span style="color:#82AAFF;">require</span><span style="color:#BABED8;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">grantlibs</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;">)</span><span style="color:#89DDFF;">;</span></span></code></pre></div><h3 id="方法列表" tabindex="-1">方法列表 <a class="header-anchor" href="#方法列表" aria-label="Permalink to &quot;方法列表&quot;">​</a></h3>`,3),t=s("table",{width:"820",cellspacing:"0"},[s("tr",null,[s("th",{align:"left"},"方法名"),s("th",{align:"center"},"调用方式"),s("th",{align:"center"},"参数 1"),s("th",{align:"center"},"参数 2"),s("th",{align:"center"},"返回值")]),s("tr",null,[s("td",null,"去重唯一值"),s("td",null,"unique(params1, params2)"),s("td",null,"数组[]"),s("td",null,"可选，根据字段去重，(a, b) => a.name === b.name"),s("td",null,"数组[]")])],-1),c=a(`<h3 id="代码示例" tabindex="-1">代码示例 <a class="header-anchor" href="#代码示例" aria-label="Permalink to &quot;代码示例&quot;">​</a></h3><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#82AAFF;">unique</span><span style="color:#BABED8;">([</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#F78C6C;">3</span><span style="color:#BABED8;">])</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//  =&gt; [1, 2, 3]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// --- Sorting by multiple properties ---</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#BABED8;"> arr </span><span style="color:#89DDFF;">=</span><span style="color:#BABED8;"> [</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">{</span><span style="color:#BABED8;"> </span><span style="color:#F07178;">id</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">tiny</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">{</span><span style="color:#BABED8;"> </span><span style="color:#F07178;">id</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">john</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#89DDFF;">{</span><span style="color:#BABED8;"> </span><span style="color:#F07178;">id</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">tiny</span><span style="color:#89DDFF;">&quot;</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#BABED8;">]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">unique</span><span style="color:#BABED8;">(arr</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> isEqual)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; [{ id: 1, name: &#39;tiny&#39; }, { id: 2, name: &#39;tiny&#39; }]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">unique</span><span style="color:#BABED8;">(arr</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">(</span><span style="color:#BABED8;font-style:italic;">a</span><span style="color:#89DDFF;">,</span><span style="color:#BABED8;"> </span><span style="color:#BABED8;font-style:italic;">b</span><span style="color:#89DDFF;">)</span><span style="color:#BABED8;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#BABED8;"> a</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">name </span><span style="color:#89DDFF;">===</span><span style="color:#BABED8;"> b</span><span style="color:#89DDFF;">.</span><span style="color:#BABED8;">name)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; [{ id: 1, name: &#39;tiny&#39; }, { id: 1, name: &#39;john&#39; },]</span></span></code></pre></div>`,2),r=[e,t,c];function D(y,F,i,B,A,E){return l(),o("div",null,r)}const _=n(p,[["render",D]]);export{d as __pageData,_ as default};
