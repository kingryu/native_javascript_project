import DeviceList from './views/deviceList/index'
import Home from './views/home/index'
import AccountLogin from './views/accountLogin/index'
import lang from './i18n/index'
import config from './common/config'
import './index.scss'

class NativeJsProject{
  constructor (option){
    Object.assign(config,option)
    this.context = {main:'',login:''}
    this.init()
  }

  init(){
    console.log('config',config.passHost)
    lang.setLanguage(config.language)
    if(window.navigator.userAgent.indexOf('HJApp')>-1){
      config.platform ='app';
    }
    console.log('config',config)
    this.context.changeView = this.changeView.bind(this)
    this.context.option = config
    this.view = new Home(this.context)
  }

  changeView(view){
    console.log('changeView',view)
    switch(view){
        case 'deviceManagement':
          console.log('deviceManagement',this.view)
          this.view.destory()
          this.view = new DeviceList(this.context)
          this.view.render()
          break;
        case 'home':
          this.view.destory()
          this.view = new Home(this.context)
          this.view.render()
          break;
        case 'accountLogin':
          this.view.destory()
          this.view = new AccountLogin(this.context)
          this.view.render()
          break;
        break;
    }
  }

  show(){
    this.view.render()
  }
}

window.NativeJsProject = NativeJsProject

export default NativeJsProject

