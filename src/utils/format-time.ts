// 时间格式化
export function formatTime(interval: number) {
  interval = interval | 0; //向下取整
  const minute = (((interval / 60) | 0) + '').padStart(2, '0'); //分
  const second = ((interval % 60) + '').padStart(2, '0');
  return `${minute}:${second}`;
}
