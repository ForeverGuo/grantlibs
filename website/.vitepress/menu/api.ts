/**
 * @description api 基础使用
 * @author grantguo
 * @date 2024-03-07 17:56:01
*/
export const apiMenu = [
  {
    text: '身份证idCard',
    collapsed: true,
    items: [
      {
        text: '出生年月',
        link: '/api/idCard/birthday',
      },
      {
        text: '性别',
        link: '/api/idCard/sex',
      }
    ]
  },
  {
    text: '发布订阅subscribe',
    collapsed: true,
    items: [
      {
        text: '订阅',
        link: '/api/subscribe/on',
      },
      {
        text: '一次订阅',
        link: '/api/subscribe/once',
      },
      {
        text: '取消订阅',
        link: '/api/subscribe/off',
      },
      {
        text: '执行订阅',
        link: '/api/subscribe/emit',
      }
    ]
  },
  {
    text: '克隆clone',
    collapsed: true,
    items: [
      {
        text: 'deep',
        link: '/api/clone/deep'
      },
      {
        text: 'shallow',
        link: '/api/clone/shallow'
      },
    ]
  },
  {
    text: '日历calendar',
    collapsed: true,
    items: [
      {
        text: '年',
        link: '/api/calendar/getYear'
      },
      {
        text: '月',
        link: '/api/calendar/getMonth'
      },
      {
        text: '日',
        link: '/api/calendar/getDate'
      },
      {
        text: '星期几',
        link: '/api/calendar/getWeekDay'
      },
      {
        text: '某年某月天数',
        link: '/api/calendar/getDaysOfYearMonth'
      },
      {
        text: '某月第一天星期几',
        link: '/api/calendar/getWeekOfMonth'
      },
      {
        text: '年月日',
        link: '/api/calendar/getFullYear'
      },
    ]

  },
  {
    text: '判断boolean',
    collapsed: true,
    items: [
      {
        text: 'isObject',
        link: '/api/boolean/isObject'
      },
      {
        text: 'isPromise',
        link: '/api/boolean/isPromise'
      },
      {
        text: 'isRegexp',
        link: '/api/boolean/isRegexp'
      },
      {
        text: 'isDef',
        link: '/api/boolean/isDef'
      },
    ]
  },
  {
    text: '时间time',
    collapsed: true,
    items: [
      {
        text: 'getTime',
        link: '/api/time/time'
      },
      {
        text: 'getHour',
        link: '/api/time/hour'
      },
      {
        text: 'getMinute',
        link: '/api/time/minute'
      },
      {
        text: 'getSecond',
        link: '/api/time/second'
      }
    ]
  },
  {
    text: '数组array',
    collapsed: true,
    items: [
      {
        text: 'sort',
        link: '/api/array/sort'
      },
      {
        text: 'unique',
        link: '/api/array/unique'
      },
      {
        text: 'chunk',
        link: '/api/array/chunk'
      },
      {
        text: 'count',
        link: '/api/array/count'
      },
      {
        text: 'difference',
        link: '/api/array/difference'
      },
      {
        text: 'group',
        link: '/api/array/group'
      },
      {
        text: 'move',
        link: '/api/array/move'
      },
      {
        text: 'takeWhile',
        link: '/api/array/takeWhile'
      },
      {
        text: 'shuffle',
        link: '/api/array/shuffle'
      },
    ]
  },
  {
    text: '正则匹配test',
    collapsed: true,
    items: [
      {
        text: '手机号',
        link: '/api/check/mobile'
      },
      {
        text: '邮箱',
        link: '/api/check/email'
      },
      {
        text: '身份证',
        link: '/api/check/idCard'
      },
      {
        text: '车牌号',
        link: '/api/check/plate'
      },
    ]
  },
  {
    text: '函数function',
    collapsed: true,
    items: [
      {
        text: '防抖',
        link: '/api/function/debounce'
      },
      {
        text: '节流',
        link: '/api/function/throttle'
      },
      {
        text: '执行次数',
        link: '/api/function/times'
      },
      {
        text: '缓存',
        link: '/api/function/memorize'
      },
    ]
  },
  {
    text: '存储store',
    collapsed: true,
    items: [
      {
        text: '设置',
        link: '/api/store/set'
      },
      {
        text: '获取',
        link: '/api/store/get'
      },
      {
        text: '检查是否有该值',
        link: '/api/store/has'
      },
      {
        text: '删除',
        link: '/api/store/del'
      },
      {
        text: '长度',
        link: '/api/store/size'
      },
    ]
  },
]