/**
 * Created by zhongdabing on 2018/04/17 上午10:43
 **/


import {addClass,removeClass,hasClass, is_touch_device,isCodeIn,validByArray,validate} from '../../util/index'
import indexTpl from './index.art';
import lang from '../../i18n/index.js'
const countryList = [{"cName":"阿拉伯联合酋长国","eName":"United Arab Emirates","code":"971","area":"AE"},
                      {"cName":"阿根廷","eName":"Argentina","code":"54","area":"AR"},
                      {"cName":"奥地利","eName":"Austria","code":"43","area":"AT"},
                      {"cName":"澳大利亚","eName":"Australia","code":"61","area":"AU"},
                      {"cName":"德国","eName":"German","code":"49","area":"DE"},
                      {"cName":"俄罗斯","eName":"Russia","code":"7","area":"RU"},
                      {"cName":"法国","eName":"France","code":"33","area":"FR"},
                      {"cName":"菲律宾","eName":"Philippines","code":"63","area":"PH"},
                      {"cName":"韩国","eName":"Korea","code":"82","area":"KR"},
                      {"cName":"荷兰","eName":"Netherlands","code":"31","area":"NL"},
                      {"cName":"加拿大","eName":"Canada","code":"1","area":"CA"},
                      {"cName":"柬埔寨","eName":"Cambodia","code":"855","area":"KH"},
                      {"cName":"马来西亚","eName":"Malaysia","code":"60","area":"MY"},
                      {"cName":"美国","eName":"United States","code":"1","area":"US"},
                      {"cName":"缅甸","eName":"Myanmar","code":"95","area":"MM"},
                      {"cName":"墨西哥","eName":"Mexico","code":"52","area":"MX"},
                      {"cName":"日本","eName":"Japan","code":"81","area":"JP"},
                      {"cName":"瑞士","eName":"Switzerland","code":"41","area":"CH"},
                      {"cName":"泰国","eName":"Thailand","code":"66","area":"TH"},
                      {"cName":"西班牙","eName":"Spain","code":"34","area":"ES"},
                      {"cName":"新加坡","eName":"Singapore","code":"65","area":"SG"},
                      {"cName":"新西兰","eName":"New Zealand","code":"64","area":"NZ"},
                      {"cName":"意大利","eName":"Italy","code":"39","area":"IT"},
                      {"cName":"印度","eName":"India","code":"91","area":"IN"},
                      {"cName":"印度尼西亚","eName":"Indonesia","code":"62","area":"ID"},
                      {"cName":"英国","eName":"United Kingdom","code":"44","area":"GB"},
                      {"cName":"越南","eName":"Vietnam","code":"84","area":"VN"},
                      {"cName":"中国大陆","eName":"China","code":"86","area":"CN"},
                      {"cName":"中国澳门","eName":"Macau (China)","code":"853","area":"MO"},
                      {"cName":"中国台湾","eName":"Taiwan (China)","code":"886","area":"TW"},
                      {"cName":"中国香港","eName":"Hong Kong (China)","code":"852","area":"HK"}]

import './index.scss'
import '../../template/phoneCode.scss'

  class QuickLogin{
  constructor (context){
    this.context = context;
    this.userDomain = context.option.userDomain||'hj'
    this.container = context.option.container
    this.callback = context.option.callback
    this.showImgCaptcha = false
    this.requesting = false
    this.intervalID = 0
    this.timeOutID = 0
    this.time = 0
    this.isPopUp = false
    this.currentName = '中国大陆'
    this.currentCode = '86'
    this.init(context.option)
  }

  init(option){
    // this.passSDK = new QuickLoginSDk(option)
    this.destory = this._destory.bind(this)
  }

  render(){
    if(this.container){
      this.isPopUp = false;
      this.container.innerHTML = this.getTpl()
    }else{
      this.isPopUp = true
      this.container = document.createElement('div')
      this.mask = document.createElement('div')
      this.container.innerHTML = this.getTpl()
      this.resize()
      document.getElementsByTagName('body')[0].appendChild(this.mask)
      document.getElementsByTagName('body')[0].appendChild(this.container)
    }
    this.setName()
    this.addListener()
  }

  resize(){
    this.container.setAttribute("class", "hp-container-dialog");
    this.mask.setAttribute("class", "hp-overlay");
    let bWidth=parseInt(document.documentElement.scrollWidth);
    let bHeight=parseInt(document.documentElement.scrollHeight);
    this.mask.style.width = bWidth+'px';
    this.mask.style.height =bHeight + 'px';
    this.container.style.top = Math.round(bHeight/2 - 150) + 'px';
  }

  setName(){
    this.mobileInput = document.getElementsByName('hp-mobile')[0]
    this.imgInput = document.getElementsByName('hp-img')[0]
    this.smsInput = document.getElementsByName('hp-sms')[0]
    this.mobileTips = document.getElementsByClassName('hp-mobiletips')[0]
    this.imgTips = document.getElementsByClassName('hp-imgtips')[0]
    this.smsTips = document.getElementsByClassName('hp-smstips')[0]
    this.otherTips = document.getElementsByClassName('hp-common-info-line')[0]
    this.toast = document.getElementsByClassName('hp-common-info')[0]
    this.loginBtn =document.getElementsByName('login-btn')[0]
    this.smsBtn =document.getElementsByName('sms-btn')[0]
    this.imgCaptcha = document.getElementsByClassName('hp-captcha-img')[0]
    this.closeBtn =document.getElementsByName('close-btn')[0]
    this.phoneCode = document.getElementsByClassName('selected-flag')[0]
    this.countryList = document.getElementsByClassName('country-list')[0]
    this.accountLogin = document.getElementsByClassName('hp-login-normal')[0]
    console.log(this.phoneCode)
  }

  addListener(){
    this.mobileBlur = this.onBlur.bind(this,'mobile')
    this.imgBlur = this.onBlur.bind(this,'img')
    this.smsBlur = this.onBlur.bind(this,'sms')
    this.mobileChange = this.onKeyUp.bind(this,'mobile')
    this.imgChange = this.onKeyUp.bind(this,'img')
    this.smsChange = this.onKeyUp.bind(this,'sms')
    this.loginClick =  this.onClick.bind(this,'login')
    this.smsClick = this.onClick.bind(this,'sms')
    this.changeImg = this.onClick.bind(this,'img')
    this.phoneCodeClick = this.onClick.bind(this,'country')
    this.accountClick = this.onClick.bind(this,'account')

    if(this.isPopUp){
      this.closeClick = this.onClick.bind(this,'close')
      this.winResize = this.resize.bind(this)
      window.addEventListener('resize',this.winResize)
    }
    this.mobileInput.addEventListener('blur', this.mobileBlur ,false)
    this.imgInput.addEventListener('blur', this.imgBlur,false)
    this.smsInput.addEventListener('blur', this.smsBlur,false)
    this.mobileInput.addEventListener('keyup',this.mobileChange,false)
    this.imgInput.addEventListener('keyup',this.imgChange,false)
    this.smsInput.addEventListener('keyup',this.smsChange,false)
    if(is_touch_device()){
      this.loginBtn.addEventListener('touchstart',  this.loginClick,false)
      this.smsBtn.addEventListener('touchstart', this.smsClick,false)
      this.imgCaptcha.addEventListener('touchstart', this.changeImg,false)
      this.phoneCode.addEventListener('touchstart',this.phoneCodeClick,false)
      this.accountLogin.addEventListener('touchstart',this.accountClick,false)
      this.closeBtn&&this.closeBtn.addEventListener('touchstart', this.closeClick,false)
    }else{
      this.loginBtn.addEventListener('click',  this.loginClick,false)
      this.smsBtn.addEventListener('click', this.smsClick,false)
      this.imgCaptcha.addEventListener('click', this.changeImg,false)
      this.phoneCode.addEventListener('click',this.phoneCodeClick,false)
      this.accountLogin.addEventListener('click',this.accountClick,false)
      this.closeBtn&&this.closeBtn.addEventListener('click', this.closeClick,false)
    }
  }

  onClick(type,e){
    let data = {}
    if(type === 'sms'){
      if(hasClass(this.smsBtn,'hp-disabled')){
        return
      }
      if(this.showImgCaptcha){
        let imgResult = this.checkInput('img')
        if(imgResult&&!imgResult.valid){
          return;
        }
        data.imgcode = this.imgInput.value;
      }
      let mobileResult = this.checkInput('mobile')
      if(mobileResult&&mobileResult.valid){
        data.mobile = this.mobileInput.value
        this.requesting = true
        this.btnEnable(this.smsBtn, false)
        this.passSDK.sendSMS(data,this.success.bind(this,'sendSms'),this.fail.bind(this,'sendSms'))
      }
    }else if(type === 'login'){
      if(hasClass(this.loginBtn,'hp-disabled')){
        return
      }
      let mobileResult = this.checkInput('mobile')
      let smsResult = this.checkInput('sms')
      if(mobileResult&&smsResult&&mobileResult.valid&&smsResult.valid){
        data.mobile = this.mobileInput.value
        data.msgpwd = this.smsInput.value
        data.source = 'passport'
        this.requesting = true
        this.btnEnable(this.loginBtn, false)
        console.log('登录请求')
      }else{
        console.log('表单校验失败')
      }
    }else if(type === 'img'){
      //更新图片验证码
      console.log('更新图片验证码')
    }else if(type === 'close'){
      this.closeDialog()
    }else if(type === 'country'){
      if(hasClass(this.countryList,'hide')){
        removeClass(this.countryList,'hide')
        this.countryList.addEventListener('click',this.onClick.bind(this,'contryList'))
      }else{
        addClass(this.countryList,'hide')
      }
    }else if(type == 'contryList'){
      if(e.target.hasChildNodes()){
        this.currentName = e.target.childNodes[1].innerText
        this.currentCode = e.target.childNodes[3].innerText
        console.log('hasChild',this.currentName,this.currentCode)
      }
      this.countryList.removeEventListener('click',this.onClick.bind(this,'contryList'))
      addClass(this.countryList,'hide')
      this.updateCode()
    }else if(type == 'account'){
      this.context.changeView('accountLogin')
    }
  }

  updateCode(){
    this.phoneCode.getElementsByClassName('flag')[0].innerText = '+' + this.currentCode
  }

  onKeyUp(type){
    if(type === 'mobile'){
      if(this.mobileInput.value.length === 11){
        this.onBlur(type)
      }
    }else if(type === 'sms'){
      if(this.smsInput.value.length === 6){
        this.onBlur(type)
      }
    }else if(type ==='img'){
      if(this.imgInput.value.length >= 4&&this.smsInput.value.length <= 8){
        this.onBlur(type)
      }
    }
  }

  onBlur(type){
    if(this.requesting){
      return
    }
    let result = this.checkInput(type)
    if(result){
      if(!result.valid){
        this.showErrorTips(type,result.errorMessage);
        if(type === 'mobile'){
          this.btnEnable(this.smsBtn,false)
          this.btnEnable(this.loginBtn,false)
        }else if(type === 'sms'){
          this.btnEnable(this.loginBtn,false)
        }else if(type ==='img'){
          this.btnEnable(this.smsBtn,false)
        }
      }else{
        this.hideErrorTips(type)
        if(type === 'mobile'){
          if(!this.showImgCaptcha){
            this.btnEnable(this.smsBtn,true)
          }else{
            let imgResult = this.checkInput('img');
            if(imgResult&&imgResult.valid){
              this.btnEnable(this.smsBtn,true)
            }
          }
          let smsResult = this.checkInput('sms');
          if(smsResult&&smsResult.valid){
            this.btnEnable(this.loginBtn,true);
          }
        }else if(type === 'sms'){
          let mobileResult = this.checkInput('mobile');
          if(mobileResult&&mobileResult.valid){
            this.btnEnable(this.loginBtn,true)
          }
        }else if(type === 'img'){
          let mobileResult = this.checkInput('mobile');
          if(mobileResult&&mobileResult.valid){
            this.btnEnable(this.smsBtn,true)
          }
        }
      }
    }
  }

  btnEnable(btn,enable){
    if(enable){
      removeClass(btn, 'hp-disabled')
    }else{
      addClass(btn, 'hp-disabled')
    }
  }

  setSmsBtn(text){
    this.smsBtn.innerHTML = text
  }

  countDown(){
    if(this.intervalID === 0){
      this.time = 59
      this.intervalID = setInterval(this.countTime.bind(this),1000)
    }
  }

  countTime(){
    this.time --
    this.setSmsBtn('重发('+this.time+'s)' )
    if(this.time<=0){
      clearInterval(this.intervalID)
      this.intervalID = 0
      this.setSmsBtn('重新发送')
      this.btnEnable(this.smsBtn,true)
    }
  }

  checkInput(type){
    let value=''
    if(type === 'mobile'){
      value = this.mobileInput.value;
    }else if(type === 'img'){
      value = this.imgInput.value;
    }else if(type === 'sms'){
      value = this.smsInput.value;
    }
    if(value === ''){
      return
    }
    return  validByArray(validate[type],value)
  }

  showErrorTips(type,msg){
    if(type === 'mobile'){
      addClass(this.mobileInput,'hp-error');
      this.mobileTips.innerHTML = msg;
    }else  if(type === 'img'){
      addClass(this.imgInput,'hp-error');
      this.imgTips.innerHTML = msg;
    }else  if(type === 'sms'){
      addClass(this.smsInput,'hp-error');
      this.smsTips.innerHTML = msg;
    }
  }

  hideErrorTips(type){
    if(type === 'mobile'){
      removeClass(this.mobileInput,'hp-error');
      this.mobileTips.innerHTML = '';
    }else  if(type === 'img'){
      removeClass(this.imgInput,'hp-error');
      this.imgTips.innerHTML = '';
    }else  if(type === 'sms'){
      removeClass(this.smsInput,'hp-error');
      this.smsTips.innerHTML = '';
    }else{
      this.otherTips.innerHTML = ''
    }
  }

  showToast(msg){
    if(this.timeOutID ===0){
      this.timeOutID = setTimeout(this.hideToast.bind(this),2300);
    }
    this.toast.style.display = 'table'
    this.otherTips.innerHTML = msg;
  }

  hideToast(){
    this.toast.style.display = 'none'
    this.otherTips.innerHTML = '';
    this.timeOutID = 0
  }

  closeDialog(){
    if(this.isPopUp){
      document.body.removeChild(this.container)
      document.body.removeChild(this.mask)
      this.container = ''
    }
    this.destory()
  }

  success(type,data){
      this.requesting = false
      if(type==='sendSms'){
        this.countDown()
      }else if(type ==='login'){
        this.callback&&this.callback(data)
        this.closeDialog()
      }else if(type === 'getImg'){
        document.getElementsByClassName('hp-captcha-img')[0].src = data
      }
  }

  fail(type, data){
    this.requesting = false
    if(isCodeIn(data.Code,1004, 1008, 1402)){
      this.showImgCaptcha = true
      //获取图片验证码
      removeClass(document.getElementsByClassName('hp-input-captcha')[0],'hp-hide')
    }
    this.showToast(data.Message)
  }

  _destory(){
    if(this.isPopUp){
      window.removeEventListener('resize',this.winResize)
    }
    this.mobileInput.removeEventListener('blur', this.mobileBlur ,false)
    this.imgInput.removeEventListener('blur', this.imgBlur,false)
    this.smsInput.removeEventListener('blur', this.smsBlur,false)
    this.mobileInput.removeEventListener('keyup',this.mobileChange,false)
    this.imgInput.removeEventListener('keyup',this.imgChange,false)
    this.smsInput.removeEventListener('keyup',this.smsChange,false)
    if(is_touch_device()){
      this.loginBtn.removeEventListener('touchstart',  this.loginClick,false)
      this.smsBtn.removeEventListener('touchstart', this.smsClick,false)
      this.imgCaptcha.removeEventListener('touchstart', this.changeImg,false)
      this.closeBtn&&this.closeBtn.removeEventListener('touchstart', this.closeClick,false)
    }else if(window.removeEventListener) {
      this.loginBtn.removeEventListener('click', this.loginClick, false)
      this.smsBtn.removeEventListener('click', this.smsClick, false)
      this.imgCaptcha.removeEventListener('click', this.changeImg,false)
      this.closeBtn&&this.closeBtn.removeEventListener('click', this.closeClick,false)
    }
    if(this.timeOutID!==0){
      clearTimeout(this.timeOutID)
    }
    if(this.intervalID!==0) {
      clearInterval(this.intervalID)
    }
    this.intervalID = 0
    this.timeOutID = 0
    this.time = 0
    this.showImgCaptcha = false
    this.requesting = false
  }

  getTpl(){
    let colorCss = 'hp-hj-container'
    if(this.userDomain ==='cc'){
      colorCss = 'hp-cc-container'
    }
    const data = {colorCss:colorCss,title:lang.getLan("login_title"),countryList:countryList,currentName:this.currentName,currentCode:'+'+this.currentCode};
    return indexTpl(data)
  }
}

export default QuickLogin