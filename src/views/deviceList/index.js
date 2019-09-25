/**
 * Created by zhongdabing on 2018/04/17 上午10:43
 **/

import {addClass,removeClass, is_touch_device,isCodeIn} from '../../util/index'
import config from '../../common/config'
import lang from '../../i18n/index.js'
import ajax from '../../common/ajax'
import indexTpl from './index.art';
import './index.scss'

  class DeviceList{
    constructor (context){
      this.context = context;
      this.userDomain = config.userDomain
      this.container = config.container
      this.callback = config.callback
      this.requesting = false
      this.intervalID = 0
      this.timeOutID = 0
      this.time = 0
      this.isPopUp = false
      this.init(context.option)
    }

  init(option){
    let data = {}
    if(config.challengeEventId){
      data.challengeEventId = config.challengeEventId
    }
    ajax.pageInit(data,(res)=>{console.log('pageinit suc',res)},(e)=>{console.log('fail',e)})
    let colorCss = 'hp-hj-container'
    if(this.userDomain ==='cc'){
      colorCss = 'hp-cc-container'
    }
    let lastLoginLang = lang.getLan('last_login')

    this.data = {
        colorCss:colorCss,
        title:config.isReplace?lang.getLan("device_full"):lang.getLan("device_management"), 
        devicesTips:config.isReplace?lang.getLan("replace_tips"):lang.getLan("device_tips"),
        delLabel:lang.getLan("delete"),
        thisDevice:lang.getLan("this_device"),
        dialog_content:lang.getLan("delete_tips"),
        dialog_cancel:lang.getLan("cancel"),
        dialog_confirm:lang.getLan("confirm"),
        hideHeader:config.hideHeader,
        devicesList:[{tracertNo:'123',deviceName:'我的IphoneX',icon:"mobile",brand:'apple',model:"IphoneX",lastLoginTime: '2019-09-01 19:20:21',lastLoginLocation:'上海',isCurrentDevice:true},
          {tracertNo:'345',deviceName:'我的 mi 9s手机',brand:'xiaomi',icon:"mobile",model:"mi 9s",lastLoginTime:'2019-09-01 19:20:21',lastLoginLocation:'上海',isCurrentDevice:false},
          {tracertNo:'456',deviceName:'200xx 的  Ipad',icon:"pad",brand:'apple',model:"",lastLoginTime:'2019-09-01 19:20:21',lastLoginLocation:'上海',isCurrentDevice:false},
          {tracertNo:'567',deviceName:'',icon:"mobile",brand:'huawei',model:"p30 pro 128G",lastLoginTime:'2019-09-01 19:20:21',lastLoginLocation:'上海',isCurrentDevice:false},
          {tracertNo:'789',deviceName:'',icon:"pc",brand:'samsung',model:"samsung galaxy note 10",lastLoginTime:'2019-09-01 19:20:21',lastLoginLocation:'上海',isCurrentDevice:false}
          ]
    }
    let deviceList = this.data.devicesList
    // this.data.devicesTips = this.data.devicesTips.replace(/\{num\}/, deviceList.length)
    let currentIndex = 0
    for(let i=0;i<deviceList.length;i++){
      let time,date
      if(deviceList[i].lastLoginTime){
        time = deviceList[i].lastLoginTime.split(' ')
      }
      if(time&&time.length>0){
        date = time[0].split('-')
      }
      if(date&&date.length>2){
        date = date[1] + '-' + date[2]
      }
      deviceList[i].lastLoginTime = lastLoginLang + ' ' + date
      if(!deviceList[i].deviceName){
        deviceList[i].deviceName = deviceList[i].brand + ' ' + deviceList[i].model
      }
      if(deviceList[i].isCurrentDevice){
        currentIndex = i
      }
    }
    if(currentIndex!=0){
      let currentDevice = deviceList.splice(currentIndex,1)
      deviceList.unshift(currentDevice[0])
    }
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
    this.toast = document.getElementsByClassName('hp-common-info')[0]
    this.dialog = document.getElementsByClassName('hp-dialog-box')[0]
    this.deviceList = document.getElementsByClassName('hp-lists')[0]
    this.comfirmClick //对话框按钮点击
  }

  addListener(){
    this.loginClick =  this.onClick.bind(this,'delete')
    if(this.isPopUp){
      this.closeClick = this.onClick.bind(this,'close')
      this.winResize = this.resize.bind(this)
      window.addEventListener('resize',this.winResize)
    }
    if(is_touch_device()){
      this.deviceList.addEventListener('touchstart',  this.loginClick,false)
    }else{
      this.deviceList.addEventListener('click',  this.loginClick,false)
    }
  }

  onClick(type,e){
    if(type === 'close'){
      this.closeDialog()
    }else if(type == 'delete'){
      if(e.target.type == 'button'){
        this.deleteIndex = parseInt(e.target.getAttribute('data-index'),10)
        this.showComfirm();
      }
    }else if(type == 'comfirm'){
      let btn =e.target.getAttribute('data-btn');
      if(btn =='confirm'){
        let deleteDevice = this.data.devicesList.splice(this.deleteIndex,1)
        console.log(deleteDevice[0])
        if(config.isReplace){
          ajax.replace({
            challengeEventId:this.config.challengeEventId,
            replacedTracertNo:deleteDevice[0].tracertNo
          },(res)=>{
            console.log('delete suc',res)
            if(config.platform=='app'){
              HJSDK.invoke('oauth_sendCode', {
                oauthUserDomain: 'deviceManagement',
                appId: settings.client_id,
                code: coderyuk
              }, function (data) {
                HJSDK.invokeOriginally('navigator_closeWindow')
              })
            }
          },(e)=>{console.log('delete fail',e)})
        }else{
          ajax.remove({tracertNo:deleteDevice[0].tracertNo},
            (res)=>{
              console.log('delete suc',res)
              
            },
            (e)=>{
              console.log('delete fail',e)
            })
        }
        
        this.closeComfirm()
        this.render()
      }else if(btn == 'cancel'){
        this.closeComfirm()
      }
    }
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

  showComfirm(){
    this.dialog.style.display = 'block';
    this.comfirmClick = this.onClick.bind(this,'comfirm')
    this.dialog.addEventListener('click',this.comfirmClick)
  }

  closeComfirm(){
    this.dialog.removeEventListener('click',this.comfirmClick)
    this.dialog.style.display = 'none';
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
    if(is_touch_device()){
      this.loginBtn.removeEventListener('touchstart',  this.loginClick,false)
    }else if(window.removeEventListener) {
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
    return indexTpl(this.data)
  }
}

export default DeviceList