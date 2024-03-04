import{_ as s,c as a,o as i,a2 as n}from"./chunks/framework.B3fADvCd.js";const F=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"examples/calendar/index.md","filePath":"examples/calendar/index.md"}'),t={name:"examples/calendar/index.md"},h=n(`<h3 id="引入" tabindex="-1">引入 <a class="header-anchor" href="#引入" aria-label="Permalink to &quot;引入&quot;">​</a></h3><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  import</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> calendar</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> }</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;grantguo-libs&#39;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  或</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  const</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> calendar</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> }</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">&#39;grantguo-libs&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><h3 id="方法列表" tabindex="-1">方法列表 <a class="header-anchor" href="#方法列表" aria-label="Permalink to &quot;方法列表&quot;">​</a></h3><table><thead><tr><th>方法名</th><th>调用方式</th></tr></thead><tbody><tr><td>获取年份</td><td>calendar.getYear()</td></tr><tr><td>获取月份</td><td>calendar.getMonth()</td></tr><tr><td>获取日期</td><td>calendar.getDate()</td></tr><tr><td>获取某年某月某日是星期几</td><td>calendar.getWeekDay()</td></tr><tr><td>获取某年某月天数</td><td>calendar.getDaysOfYearMonth()</td></tr><tr><td>获取某月第一天是星期几</td><td>calendar.getWeekOfMonth()</td></tr><tr><td>获取完整年月日，默认以 - 拼接</td><td>calendar.getFullYearMonthDay()</td></tr></tbody></table><h3 id="代码示例" tabindex="-1">代码示例 <a class="header-anchor" href="#代码示例" aria-label="Permalink to &quot;代码示例&quot;">​</a></h3><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  /* 获取年份 */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> year</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> calendar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getYear</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  /* 获取月份 */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> month</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> calendar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getMonth</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  /* 获取日期 */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> date</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> calendar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getDate</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  /* 获取某年某月某日是星期几, 默认输出当日 */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> week</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> calendar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getWeekDay</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(year:number, month:number, date:number)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  /* 获取某年某月天数, 默认输出当月天数 */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> days</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> calendar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getDaysOfYearMonth</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(year: number, month: number)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  /* </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    获取某月第一天是星期几, 默认输出当月第一天</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    场景说明：</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      针对每月天数及对应星期展示, 可输出个性化</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> firstDay</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> calendar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getWeekOfMonth</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(year: number, month: number)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  /* 获取完整年月日, 默认以 - 拼接 */</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> yearMonthDay</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> calendar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getFullYearMonthDay</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(char:string </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;-&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div>`,6),l=[h];function e(k,p,r,d,g,c){return i(),a("div",null,l)}const E=s(t,[["render",e]]);export{F as __pageData,E as default};