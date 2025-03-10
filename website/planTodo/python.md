## python 问题记录

### 如何一键删除 pip 安装的三方库

```shell
pip freeze | xargs pip uninstall -y
```

### 获取所有已安装的库的列表

```shell
pip freeze
```

### conda install 安装不成功怎么办 ?

- 选择加入对应通道

```shell
conda install -c conda-forge requests
```

### 创建当前项目的 env 环境

```shell
python3 -m venv env
```

<div>
参数 说明:
  -m m是module的缩写，即-m后面跟的是模块(module)名，意思是把模块当成脚本来运行。
  venv 为创建虚拟环境命令脚本
  env 为虚拟环境的路径
</div>

- 激活环境

```shell
# 当前路径执行
source /.venv/bin/activate
```

- 退出虚拟环境,

```shell
# 当前环境执行
deactivate
```
