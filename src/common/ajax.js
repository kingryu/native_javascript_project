import jsonp from './jsonp'
import config from './config'

let uid = 1

jsonp.init({
  timeout:35000,
  error:function(){

  }
})

let errorArray = []

function getUrl(path){
  let protcol = 'https://'
  if(config.ishttp){
    protcol = "http://"
  }
  let domain = "pass"+config.passHost
  if(config.env == 'qa'||config.env == 'yz'){
    domain = protcol + config.env + domain + path;
  }else {
    domain = protcol + domain + path;
  }
  return domain
}

export default {
  pageInit:(data,suc,fail)=>{
    let id = uid++;
    console.log('id',uid)
    jsonp.get( getUrl('/intraApi/device/list'),
      data,
      function(res){
        if(res){
          delete errorArray['cb_'+id]
          suc(res)
          console.log(res)
        }
      }
    )
    errorArray.push(fail)
  },
  replace:function (data,suc,fail){
    let id = uid++;
    let url = getUrl('/intraApi/device/replace')
    console.log(url)
    jsonp.get( url,
      data,
      function(res){
        if(res){
          delete errorArray['cb_'+id]
          suc(res)
          console.log(res)
        }
      }
    )
    errorArray.push(fail)
  },
  remove:function (data,suc,fail){
    let id = uid++;
    let url = getUrl('/intraApi/device/remove')
    console.log(url)
    jsonp.get( url,
      data,
      function(res){
        if(res){
          delete errorArray['cb_'+id]
          suc(res)
          console.log(res)
        }
      }
    )
    errorArray.push(fail)
  }
}