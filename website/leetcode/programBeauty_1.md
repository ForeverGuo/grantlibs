### 让 CPU 占用曲线听你指挥

<div :class="$style.qt">写一个程序，让用户来决定 Windows 任务管理器（Task Manager）的 CPU 占用率。程序越精简越好，计算机语言不限。例如，可以实现下面三种情况：</div>

1. CPU 的占用率固定在 50%，为一条直线
2. CPU 的占用率为一条直线，但是具体占用率由命令行参数决定（参数范围 1 -100）
3. CPU 的占用率状态是一个正弦曲线

<style module>
.qt {
  color: #E6A23C; 
  fontSize: 18px;
  padding: 20px 0;
}
</style>
