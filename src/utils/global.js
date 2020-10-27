//表格序号
export function serial(currpage, pagesize, index) {
  return (currpage - 1) * pagesize + index + 1;
}

//防抖
export const Throttle = (fn, t) => {
  let last;
  let timer;
  let interval = t || 500;
  return function() {
    let args = arguments;
    let now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        fn.apply(this, args);
      }, interval);
    } else {
      last = now;
      fn.apply(this, args);
    }
  };
};
// 返回 年-月-日-时-分-秒
export function get_tiem2() {
  var datetime = new Date();
  var year = datetime.getFullYear();
  var month =
    datetime.getMonth() + 1 < 10
      ? "0" + (datetime.getMonth() + 1)
      : datetime.getMonth() + 1;
  var date =
    datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
  var hours = datetime.getHours(); //获取当前小时数(0-23)

  var minutes = datetime.getMinutes(); //获取当前分钟数(0-59)

  var seconds = datetime.getSeconds();
  return year + "-" + month + "-" + date;
}
// 返回 年/月/日
export function get_tiem() {
  var datetime = new Date();
  var year = datetime.getFullYear();
  var month =
    datetime.getMonth() + 1 < 10
      ? datetime.getMonth() + 1
      : datetime.getMonth() + 1;
  var date =
    datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
  var hours = datetime.getHours(); //获取当前小时数(0-23)

  var minutes = datetime.getMinutes(); //获取当前分钟数(0-59)

  var seconds = datetime.getSeconds();
  return year + "/" + month + "/" + date;
}
// 返回 年-月-日-时-分-秒
export function get_date() {
  var datetime = new Date();
  var year = datetime.getFullYear();
  var month =
    datetime.getMonth() + 1 < 10
      ? "0" + (datetime.getMonth() + 1)
      : datetime.getMonth() + 1;
  var date =
    datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
  var hours = datetime.getHours(); //获取当前小时数(0-23)

  var minutes = datetime.getMinutes(); //获取当前分钟数(0-59)

  var seconds = datetime.getSeconds();
  return (
    year +
    "-" +
    month +
    "-" +
    date +
    "-" +
    hours +
    "-" +
    minutes +
    "-" +
    seconds
  );
}

// 对比两个对象的值是否完全相等 返回值 true/false
export function isObjectValueEqual(a, b) {
  //取对象a和b的属性名
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  //判断属性名的length是否一致
  if (aProps.length != bProps.length) {
    return false;
  }
  //循环取出属性名，再判断属性值是否一致
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}
//比较2个对象是否相同
export function isObjEqual(o1, o2) {
  var props1 = Object.getOwnPropertyNames(o1);
  var props2 = Object.getOwnPropertyNames(o2);
  if (props1.length != props2.length) {
    return false;
  }
  for (var i = 0, max = props1.length; i < max; i++) {
    var propName = props1[i];
    if (o1[propName] !== o2[propName]) {
      return false;
    }
  }
  return true;
}
//根据元素查找在数组中的位置
export function myindexOf(arr, item) {
  if (Array.prototype.indexOf) {
    return arr.indexOf(item);
  } else {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == item) {
        return i;
      }
    }
  }
  return -1;
}
