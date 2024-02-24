/**
 * day：星期
 * offset：偏移天数
 */
export interface weekItem {
  day: string;
  offset: number;
}

/* 
  根据官方日历配置，如有特殊要求可自行配制 
*/
export const weeks: weekItem[] = [
  {
    day: '周日',
    offset: 0
  },
  {
    day: '周一',
    offset: 1
  },
  {
    day: '周二',
    offset: 2
  },
  {
    day: '周三',
    offset: 3
  },
  {
    day: '周四',
    offset: 4
  },
  {
    day: '周五',
    offset: 5
  },
  {
    day: '周六',
    offset: 6
  }
]