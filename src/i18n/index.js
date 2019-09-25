const lantext = {
  'cn': require('./cn.json'),
  'en': require('./en.json')
}

  let HJLan = lantext.cn
  function setLanguage(language){
    if(language.indexOf('en')>-1){
      HJLan = lantext.en
    }else{
      HJLan = lantext.cn
    }
  }
  function getLan(str){
    if(str){
      return HJLan[str]
    }else{
      return HJLan
    }
  }

module.exports =  {
  setLanguage:setLanguage,
  getLan:getLan,
}