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

export function loadJs(src:string, callback?:Function) {
  let sc = document.createElement('script');
  sc.type = 'text/javascript';
  sc.src = src;
  if (callback) {
      sc.addEventListener("load", event=>callback(), false);
  }
  document.head.appendChild(sc);
}

export function loadStyle(src) {
  let link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = src
  document.head.appendChild(link)
}

export function getCookie(name) {
  const mat = new RegExp('(^|[^a-z])' + name + '=(.*?)(;|$)', 'i').exec(document.cookie)
  return mat ? decodeURIComponent(mat[2]) : ''
}
// time 秒
export function setCookie(name, value, time) {
  let cookie = name + '=' + encodeURIComponent(value) + '; path=/'
  if(time) {
      cookie += '; expires=' + new Date(+new Date + time*1000).toUTCString()
  }
  document.cookie = cookie
}

// 新建一个标签
export function newEl(tag, className, parent) {
  let el = document.createElement(tag)
  el.className = className
  if(parent) parent.appendChild(el)
  return el
}

// 新建一个div
export function newDiv(className, parent, html) {
  let el = newEl('div',className,parent)
  if(html) el.innerHTML = html
  return el
}

export function getEl(selector, root) {
  return (root||document).querySelector(selector)
}

export function hasEl(selector, root) {
  return (root||document).querySelector(selector) != null
}

export function setHtml(selector, root, html) {
  let el = getEl(selector, root)
  el.innerHTML = html
  return el
}

// 获取path中的id
export function getId() {
  let m = /\/([1-9]\d*)/.exec(location.pathname)
  return m && m.length ? m[1] : ''
}

export function inputValue(id) {
  const elem = document.getElementById(id)
  return elem && elem.value || ''
}

export function addClickHref(el, onClick) {
  el.addEventListener('click', event=>{
      let url = el.getAttribute('href')
      onClick&&onClick(url||'')
  })
}

export function getQueryStringByName(name) {
  let result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
  if (result === null || result.length < 1) {
    return "";
  }
  return decodeURIComponent(result[1]);
}


const wto = window.scrollTo;
export function toTop(y, div) {
  const SCROLL_TIME = 468;
  
  function step(context) {
      let time = Date.now();
      let elapsed = (time - context.startTime) / SCROLL_TIME;
  
      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;
  
      // apply easing to elapsed time
      let value = 0.5 * (1 - Math.cos(Math.PI * elapsed))
  
      let currentY = context.startY + (context.y - context.startY) * value;
  
      if(div) div.scrollTo(0, currentY);
      else wto(0, currentY)
  
      if (currentY !== context.y) {
          window.requestAnimationFrame(step.bind(div||window, context));
      }
  }
  step({
      startTime: Date.now(),
      startY: div?div.scrollTop:window.scrollY,
      y: y
  })
}

export function showToast(content,time=2000){
  // time= !time ? 2000 : time;
  let m = newDiv('toast', document.body);
  m.innerHTML = content;
  m.style.cssText = "max-width:70vw;min-width:200px;padding:20px 30px;color:white;line-height:1.5em;text-align:center;border-radius:14px;position: fixed;top: 50%;left: 50%;transform:translate(-50%, -50%);z-index:999999;background:rgba(0,0,0,.7);";
  setTimeout(function() {
    let d = 0.5;
    m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
    m.style.opacity = '0';
    setTimeout(function() { document.body.removeChild(m) }, d * 1000);
  }, time);
}


let oldTop = 0,elRoot = document.documentElement,elBody = document.body;
export function getScroll() {
    return elRoot.scrollTop || elBody.scrollTop
}
export function hideScroll() {
    oldTop = getScroll()
    let st = elBody.style
    st.position = 'fixed'
    st.top = `-${oldTop}px`
}
export function showScroll(top=-1) {
    let st = elBody.style
    st.position = 'static'
    elRoot.classList.add('noscroll')
    setTimeout(()=>{
        window.scrollTo(0, top!=-1?top:oldTop)
        elRoot.classList.remove('noscroll')
    }, 10)
}
export function log(...args) {
    let el = document.querySelector('.log')
    if(!el) {
        el = newDiv('log', document.body)
        el.setAttribute('style', 'position:fixed;left:0;top:0;z-index:9999;background-color:rgba(255,255,255,0.8);max-width:100%;word-break:break-all;font-size:0.8em;max-height:40vh;overflow:auto;')
    }
    let ss = '<p>'
    for(let i=0;i<args.length;i++){
        let a = args[i]
        if(typeof a!=='string') ss += `${JSON.stringify(a)}、`
        else ss += `${a}、`
    }
    ss += '</p>'
    newDiv('', el, ss)
    el.scrollTop = 1000000
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