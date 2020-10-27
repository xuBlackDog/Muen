/**
 * 中文
 * @param {*} name
 */
export function isType(name) {
  var regName = /^[\u4e00-\u9fa5]{1,6}$/;
  if (!regName.test(name)) return false;
  return true;
}
/**
 * 中文文本
 * @param {*} text 文本
 * @param {*} beg 字符最多长度
 * @param {*} end 字符最大长度
 */
export function isChineseText(text, beg, end) {
  var regName = "/^[\u4e00-\u9fa5]{" + beg + "," + end + "}$/";
  var reg = eval(regName);
  if (!reg.test(text)) return false;
  return true;
}
/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
    s
  );
}
