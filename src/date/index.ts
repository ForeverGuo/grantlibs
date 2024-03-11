/**
 * @description 获取当前时间
 * @author grantguo
 * @date 2024-03-11 21:55:09
*/
const now = new Date()
const hours = now.getHours().toString().padStart(2, '0');
const minutes = now.getMinutes().toString().padStart(2, '0');
const seconds = now.getSeconds().toString().padStart(2, '0');

export function getTime(): String {
  return `${hours}:${minutes}:${seconds}`;
}

export function getHour(): String {
  return `${hours}`;
}

export function getMinute(): String {
  return `${minutes}`;
}

export function getSecond(): String {
  return `${seconds}`;
}