/**
 * Created by zhongdabing on 2018/04/17 上午10:43
 **/

import {addClass,removeClass,hasClass, is_touch_device,isCodeIn,validByArray,validate} from '../../util/index'
import indexTpl from './index.art';
import lang from '../../i18n/index.js'
import './index.scss'

  class AccountLogin{
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
    this.userNameInput = document.getElementsByName('hp-username')[0]
    this.imgInput = document.getElementsByName('hp-img')[0]
    this.pwdInput = document.getElementsByName('password')[0]
    this.userNameTips = document.getElementsByClassName('hp-usernametips')[0]
    this.imgTips = document.getElementsByClassName('hp-imgtips')[0]
    this.pwdTips = document.getElementsByClassName('hp-pwdtips')[0]
    this.otherTips = document.getElementsByClassName('hp-common-info-line')[0]
    this.toast = document.getElementsByClassName('hp-common-info')[0]
    this.loginBtn =document.getElementsByName('login-btn')[0]
    this.imgCaptcha = document.getElementsByClassName('hp-captcha-img')[0]
    this.phoneLogin = document.getElementsByClassName('hp-login-quick')[0]
  }

  addListener(){
    this.userNameBlur = this.onBlur.bind(this,'userName')
    this.pwdBlur = this.onBlur.bind(this,'pwd')
    this.imgBlur = this.onBlur.bind(this,'img')
    this.userNameChange = this.onKeyUp.bind(this,'userName')
    this.pwdChange = this.onKeyUp.bind(this,'pwd')
    this.imgChange = this.onKeyUp.bind(this,'img')
    this.loginClick =  this.onClick.bind(this,'login')
    this.changeImg = this.onClick.bind(this,'img')
    this.phoneLoginClick = this.onClick.bind(this,'phoneLogin')

    if(this.isPopUp){
      this.closeClick = this.onClick.bind(this,'close')
      this.winResize = this.resize.bind(this)
      window.addEventListener('resize',this.winResize)
    }
    this.userNameInput.addEventListener('blur', this.userNameBlur ,false)
    this.pwdInput.addEventListener('blur', this.pwdBlur,false)
    this.imgInput.addEventListener('blur', this.imgBlur,false)
    this.userNameInput.addEventListener('keyup',this.userNameChange,false)
    this.pwdInput.addEventListener('keyup',this.pwdChange,false)
    this.imgInput.addEventListener('keyup',this.imgChange,false)
    if(is_touch_device()){
      this.loginBtn.addEventListener('touchstart',  this.loginClick,false)
      this.imgCaptcha.addEventListener('touchstart', this.changeImg,false)
      this.phoneLogin.addEventListener('touchstart',this.phoneLoginClick,false)
      this.closeBtn&&this.closeBtn.addEventListener('touchstart', this.closeClick,false)
    }else{
      this.loginBtn.addEventListener('click',  this.loginClick,false)
      this.imgCaptcha.addEventListener('click', this.changeImg,false)
      this.phoneLogin.addEventListener('click',this.phoneLoginClick,false)
      this.closeBtn&&this.closeBtn.addEventListener('click', this.closeClick,false)
    }
  }

  onClick(type,e){
    let data = {}
    if(type === 'login'){
      if(hasClass(this.loginBtn,'hp-disabled')){
        return
      }
      let userNameResult = this.checkInput('userName')
      let pwdResult = this.checkInput('pwd')
      if(userNameResult&&pwdResult&&userNameResult.valid&&pwdResult.valid){
        data.userName = this.userNameInput.value
        data.pwd = this.pwdInput.value
        data.source = 'openauth'
        this.requesting = true
        this.btnEnable(this.loginBtn, false)
        // 账户密码登录
        
      }else{
        console.log('表单校验失败')
      }
    }else if(type === 'img'){
    }else if(type === 'close'){
      this.closeDialog()
    }else if(type == 'phoneLogin'){
      this.context.changeView('home')
    }
  }

  onKeyUp(type){
    if(type === 'userName'){
      if(this.userNameInput.value.length > 1){
        this.onBlur(type)
      }
    }else if(type === 'pwd'){
      if(this.pwdInput.value.length > 5){
        this.onBlur(type)
      }
    }else if(type ==='img'){
      if(this.imgInput.value.length > 0){
        this.onBlur(type)
      }
    }
  }

  onBlur(type){
    console.log('onBlur',type);
    if(this.requesting){
      return
    }
    let result = this.checkInput(type)
    console.log('result',result)
    if(result){
      if(!result.valid){
        this.showErrorTips(type,result.errorMessage);
        this.btnEnable(this.loginBtn,false)
      }else{
        this.hideErrorTips(type)
        if(this.showImgCaptcha){
          let imgResult = this.checkInput('img');
          if(imgResult&&imgResult.valid){
          }else{
            return
          }
        }
        let pwdResult = this.checkInput('pwd');
        if(pwdResult&&pwdResult.valid){
        }else{
          return
        }
        let userNameResult = this.checkInput('userName');
        if(userNameResult&&userNameResult.valid){
          this.btnEnable(this.loginBtn,true)
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

  checkInput(type){
    let value=''
    if(type === 'userName'){
      value = this.userNameInput.value;
      if(value.length>1){
        return {valid:true}
      }else{
        return {valid:false,errorMessage:'请输入正确的用户名'}
      }
    }else if(type === 'img'){
      value = this.imgInput.value;
    }else if(type === 'pwd'){
      value = this.pwdInput.value;
      if(value.length>5){
        return {valid:true}
      }else {
        return {valid:false,errorMessage:'密码格式错误'}
      }
    }
    if(value === ''){
      return 
    }
    return  validByArray(validate[type],value)
  }

  showErrorTips(type,msg){
    if(type === 'userName'){
      addClass(this.userNameInput,'hp-error');
      this.userNameTips.innerHTML = msg;
    }else  if(type === 'img'){
      addClass(this.imgInput,'hp-error');
      this.imgTips.innerHTML = msg;
    }else  if(type === 'pwd'){
      addClass(this.pwdInput,'hp-error');
      this.pwdTips.innerHTML = msg;
    }
  }

  hideErrorTips(type){
    if(type === 'userName'){
      removeClass(this.userNameInput,'hp-error');
      this.userNameTips.innerHTML = '';
    }else  if(type === 'img'){
      removeClass(this.imgInput,'hp-error');
      this.imgTips.innerHTML = '';
    }else  if(type === 'pwd'){
      removeClass(this.pwdInput,'hp-error');
      this.pwdTips.innerHTML = '';
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
      this.passSDK.getImageCaptcha({},this.success.bind(this,'getImg'),this.fail.bind(this,'getImg'))
      removeClass(document.getElementsByClassName('hp-input-captcha')[0],'hp-hide')
    }
    this.showToast(data.Message)
  }

  destory(){
    if(this.isPopUp){
      window.removeEventListener('resize',this.winResize)
    }
    this.userNameInput.removeEventListener('blur', this.userNameBlur ,false)
    this.imgInput.removeEventListener('blur', this.imgBlur,false)
    this.userNameInput.removeEventListener('keyup',this.userNameChange,false)
    this.imgInput.removeEventListener('keyup',this.imgChange,false)
    if(is_touch_device()){
      this.loginBtn.removeEventListener('touchstart',  this.loginClick,false)
      this.imgCaptcha.removeEventListener('touchstart', this.changeImg,false)
      this.closeBtn&&this.closeBtn.removeEventListener('touchstart', this.closeClick,false)
    }else if(window.removeEventListener) {
      this.loginBtn.removeEventListener('click', this.loginClick, false)
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
    const data = {colorCss:colorCss,title:lang.getLan('login_title')};
    return indexTpl(data)
  }
}

export default AccountLogin