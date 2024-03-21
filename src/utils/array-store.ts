// 插入数组
import storage from './storage';

type CompareFunction<T> = (item: T) => boolean;

function inertArray<T>(arr: T[], val: T, compare: CompareFunction<T>, maxLen?: number) {
  //判断val是否在arr中
  const index = arr.findIndex(compare);
  if (index > -1) {
    return;
  }
  // 插入到数组的前面
  arr.unshift(val);

  // 判断是否超过最大长度
  if (maxLen && arr.length > maxLen) {
    arr.pop(); //先进先出
  }
}

// 从数组移除
function deleteFromArray<T>(arr: T[], compare: CompareFunction<T>) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

// 保存到localStorage
export function save<T>(item: T, key: string, compare: CompareFunction<T>, maxLen?: number) {
  const items = storage.get(key) || [];
  inertArray(items, item, compare, maxLen);
  storage.set(key, items);
  return items;
}

// 从localStorage移除
export function remove<T>(key: string, compare: CompareFunction<T>) {
  const items = storage.get(key) || [];
  deleteFromArray(items, compare);
  storage.set(key, items);
  return items;
}

// 初始加载的数据
export function load(key: string) {
  return storage.get(key) || [];
}

// 清空
export function clear(key: string) {
  storage.remove(key);
  return [];
}
