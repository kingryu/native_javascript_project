/**
 * Created by zhongdabing on 2018/04/18 上午11:19
 **/

export function hasClass( elements,cName ){
  return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") );
}

export function addClass( elements,cName ){
  if( !hasClass( elements,cName ) ){
    elements.className += " " + cName;
  }
}

export function removeClass( elements,cName ){
  if( hasClass( elements,cName ) ){
    elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" ), " " );
  }
}

export function is_touch_device() {
  return 'ontouchstart' in window // works on most browsers
    || 'onmsgesturechange' in window; // works on ie10 ios8
}

export function getQueryStringByName(name) {
  let result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
  if (result === null || result.length < 1) {
    return "";
  }
  return decodeURIComponent(result[1]);
}

export function isCodeIn (code, params) {
  if (typeof code === 'undefined') return;

  params = Array.prototype.slice.call(arguments, 1);

  for (let i = 0, len = params.length; i < len; i++) {
    if (params[i] === code) return true;
  }
  return false;
}
export const validate ={
  "mobile":[{
    rule: /^.{6,15}$/,
    errorMessage: '手机号格式错误'}],
  "img":[{
    rule: /^[A-Za-z0-9]{1,8}$/,
    errorMessage: '图片验证码错误'
  }],
  "sms":[{
    rule: /^[0-9]{3,8}$/,
    errorMessage: '短信验证码错误'
  }],
  "pwd":[
    {
      rule:/^.{5,18}$/,
      errorMessage:'密码格式错误'
    }
  ]
}

export function validByArray (rules, value) {
  let result = { valid: true, errorMessage: '' }
  for (let i = 0; i < rules.length; i++) {
    if(!rules[i].rule.test(value)){
      result.valid = false
      result.errorMessage = rules[i].errorMessage
      break
    }
  }
  return result
}