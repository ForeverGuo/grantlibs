### caddy.service: start-limit-hit 多久可以再次重启

解决方案:

1. 查看次数和重启限制

```shell
systemctl show caddy.service | grep "StartLimit"
```

2. 查看服务日志，了解为何服务无法启动：

```shell
journalctl -u caddy.service
```

3. 如果确认服务配置无误，且需要强制重启服务，可以清除启动计数器：

```shell
systemctl reset-failed caddy.service
```

4. 然后重新启动服务：

```shell
systemctl start caddy.service
```
