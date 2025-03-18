# 选 Flask 还是 Django ?

### 我选轻量级的 Flask

## 目录架构

![](https://files.mdnice.com/user/94626/e5bfd2dd-5706-46bf-b870-0e986c10b7b2.png)

#### 灵活的项目架构,可以让你在后面业务扩展中,处理的游刃有余

## 环境设置

- **venv 创建**

```shell
# 创建环境
python3 -m venv dev
# 激活环境
. dev/bin/activate
```

- **conda 设置**

```shell
# 创建环境
conda create --name myenv python=3.9
# 激活环境
conda activate myenv
```

- **建议使用 venv 方式**

![](https://files.mdnice.com/user/94626/1441a661-e8b9-454e-80c8-a56d4556d301.png)

#### 好处: 全局不需要安装其他依赖, 自带, 直接使用 !

## 依赖安装

```shell
pip install flask
```

## 文件配置

- **主页模块(app/routes/admin/home.py)**

```python
from flask import Blueprint
from flask import render_template

# 设置蓝图
home_bp = Blueprint('home', __name__, url_prefix='/admin')

# 路由
@home_bp.route('/')
def index():
    # 这里使用静态模版文件
    return render_template('home/index.html', message="Hello World!")
```

- **模版(app/template/home/index.html)**

```js
<h1>{{ message }}</h1>
```

- **创建 Flask 应用程序实例(app/**init**.py)**

```python
from flask import Flask
def create_app(config_name=None):
    # 创建 Flask 应用程序实例
    app = Flask(__name__)
    # 注册蓝图
    from .routes import home_bp
    app.register_blueprint(home_bp)
    return app
```

## 运行服务

- **启动文件(run.py)**

```python
from app import create_app
app = create_app()
if __name__ == '__main__':
    app.run(debug=True)
```

- **执行 run.py**

```shell
python run.py
```

![](https://files.mdnice.com/user/94626/b667fcb5-3ee9-42c6-9d07-a20b72687512.png)

![](https://files.mdnice.com/user/94626/9a1b5dc3-a18c-44b6-8e90-bc5d0968bdb7.png)

## 常见问题解答

#### Q1: 蓝图之间如何共享数据？

- **通过应用上下文 (current_app) 或全局变量（不推荐）**
- **推荐使用 Flask 扩展（如数据库连接池）**

#### Q2: 如何实现跨蓝图的重定向？

```python
from flask import redirect, url_for
@admin_bp.route('/back-home')
def back_to_home():
    return redirect(url_for('home.index'))  # '蓝图名.视图函数名'
```

#### Q3: 为什么推荐使用工厂模式？

- **测试友好：可创建多个独立应用实例**
- **配置灵活：根据环境加载不同配置**
- **延迟加载：避免循环导入问题**
