/**
 * @description api 基础使用
 * @author grantguo
 * @date 2024-03-07 17:56:01
*/
export const apiMenu = [
  {
    text: '正则匹配test',
    link: '/api/check/index'
  },
  {
    text: '克隆clone',
    link: '/api/clone/index'
  },
  {
    text: '存储store',
    link: '/api/store/index'
  },
  {
    text: '身份证idCard',
    link: '/api/idCard/index'
  },
  {
    text: '发布订阅subscribe',
    link: '/api/eventEmitter/index'
  },
  {
    text: '防抖debounce',
    link: '/api/function/debounce'
  },
  {
    text: '节流throttle',
    link: '/api/function/throttle'
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
        text: '获取年月日',
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
  }
]