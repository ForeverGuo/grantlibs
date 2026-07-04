# 郭永胜(Yanson)简历
## 基础信息
- 手机号：18626696269
- 邮箱：18626696269@163.com
- 所在地：上海
- 工作状态：在职

## 专业技能
1. 熟练web开发
2. 熟悉python开发
3. 熟悉mysql, redis
4. 熟悉使用flask, fastAPI
5. 熟悉golang开发

## 项目经历
### 基于 RAG 架构的智能知识库平台
**任职**：平台负责人，研发部
**时间**：2024年07月 - 2024年08月
**技术栈**：LangChain, Python, Streamlit, Vector DB (FAISS), OpenAI/Ollama

- **Situation（场景）**：解决企业内部非结构化文档（PDF、Markdown、Docx）检索困难，以及大模型在回答特定业务问题时存在的“幻觉”挑战。
- **Task（任务）**：快速搭建一套具备私有知识挂载、语义检索及多轮对话能力的 AI 问答平台，并支持多种文档格式的一键上传与向量化处理。
- **Action（行动）**
    1. 核心链路：使用 LangChain 构建 RAG（检索增强生成）管道；利用 RecursiveCharacterTextSplitter 优化长文本切片，并结合 Embeddings 技术将数据持久化至向量数据库。
    2. UI 开发：选用 Streamlit 快速实现响应式 Web 界面，集成文件上传组件、实时对话流（Chat UI）以及后台知识库管理功能。
    3. 性能优化：引入 ConversationBufferMemory 管理对话上下文；利用 Streamlit 的 session_state 维护多轮对话状态，确保逻辑连贯。
    4. 工程部署：基于 Docker 封装 Python 依赖环境，实现应用与向量数据库的解耦部署，确保跨环境运行的一致性。
- **Result（结果）**：从 0 到 1 仅用 1 周即完成原型验证与上线；文档回答准确率提升至 85% 以上；显著降低了内部信息获取成本，成为团队日常业务查询的核心工具。

### ETL 系统开发
**任职**：基础平台开发，研发部
**技术栈**：Python, Airflow, Docker
- **Action(行动)**：运用 Apache Airflow 框架和 Docker 技术，快速搭建并部署了 ETL 系统。同时使用了 MySQL 作为指标数据库，并借助 Looker Studio 快速构建 BI 系统，保障数据分析便捷性。
- **亮点**：仅用三天时间就完成了从调研到项目部署的全部工作，使团队能够迅速进入 ETL 开发阶段，并节省了 50% 的开发时间。搭建完成的系统能够高效输出数据，为公司业务决策提供可靠的数据支撑。

### 基于测试自动化的多agent搭建平台
**任职**：系统架构工程师，研发部
**技术栈**：Python 3.13、LangGraph、LangChain、LLM/Agent 编排、Tool Calling、Playwright、Appium、Pydantic、Rich CLI
#### 架构设计
设计并实现了基于 LangGraph 状态机的多 Agent 编排架构，设置单一入口 Router 开展意图识别，把用户自然语言请求分流至 design、code、test、swagger、ui、app、chat 共6条独立处理链路，做到一句话驱动全流程；抽象出统一的共享状态模型AgentState以及LLM Agent节点、ToolNode工具节点、纯状态辅助节点三类节点，拆分决策环节与执行环节，路由函数只读取状态、不再调用LLM，削减Token消耗，优化系统可测试性。
#### 核心链路实现
1. 搭建代码生成链路自动修复闭环：由Architect拆分任务，Coder分步产出代码，Tester负责验收；验收判定失败时会回退交由Coder重做修复，借助fix_attempts参数将最大重试次数限定为3次，规避死循环问题。
2. 设计4阶段顺序流转的design链路：产品方案&架构设计 → 数据库DDL设计 → 后端服务代码编写 → 前端页面开发；借助designer_context节点提取API清单，压缩上下文体量，解决单次LLM输出过长被截断的问题，适配Boot、Gin等6种后端框架以及Vue3、React等4种前端框架。
3. 搭建UI、App方向自动化测试链路：拆分Planner任务、Tester执行两大模块，依托Playwright适配二十余种浏览器操作、Appium实现移动端自动化，能够抓取网络请求、自动填写语义化表单、留存登录状态并且输出标准化测试报告。
4. 落地Swagger/OpenAPI接口自动化测试流程，自动解析接口文档，批量产出pytest格式测试用例。

## 教育经历
### 湖南科技学院
**就读时段**：2013年07月 – 2017年07月
- 专业：通信工程（本科，计算机院，全日制）

## 荣誉奖项
- 英语CET4级
- 软件设计师证书