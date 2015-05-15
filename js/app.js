// Bling app.js by weishai

var Config = {
  API: {
    createSnap: 'api/create_snap.json',
    getSnap: 'api/get_snap.json'
  }
}

//debug
Config.API.createSnap = '../test/api/create_snap.json'
Config.API.getSnap = '../test/api/get_snap.json'

var Bling = function () {
  
}

Bling.prototype.init = function () {
  var self = this

  this.data = {}

  this.render()
}

Bling.prototype.getSnapId = function () {
  //Todo: get from url
  return 'test'
}

Bling.prototype.showSnap = function (cb) {
  var self = this
    , $body = $('body')
    , snapData = this.data.snap
    , isHideImg = false

  $body.addClass('bling-start')
    .one('touchstart', function(e) {
      var autoHideSet = null

      showSnapImg(snapData.snapImgUrl, snapData.snapShowTime)

      $body.one('touchend', function (et) {
        hideSnapImg(cb)
        et.preventDefault()
      })

      autoHideSet = setTimeout(function(){
        hideSnapImg(cb)
      }, snapData.snapShowTime * 1000)

      e.preventDefault()
    })

  function showSnapImg(url, time) {
    console.log('bling-showimg')
    $body.addClass('bling-showimg')
      .find('#snapImg').attr('src', url)
    return true
  }

  function hideSnapImg(cb) {
    if(isHideImg){
      return
    }
    $body.addClass('bling-hideimg')
      // .removeClass('bling-showimg')

    isHideImg = true
    cb && cb()
  }
}

Bling.prototype.showSnapLuck = function () {
  var self = this
    , snapData = this.data.snap

  if(snapData.isSnapLuck){
    
  }
}

Bling.prototype.render = function () {
  var self = this
    , curSnapId = this.getSnapId()

  if(!curSnapId){
    return false
  }

  $.post(Config.API.getSnap, {snapId: curSnapId}, function(data) {
    //debug
    console.log(data)
    // data = JSON.parse(data)

    switch(data.code) {
      case 1001:
        console.log('该用户已看过')
        break
      case 1002:
        console.log('超过可看人数')
        break
      case 0:
        self.data.snap = data.data
        self.showSnap(function () {
          self.showSnapLuck()
        })
        break
      default:
        console.log('sys error')
        break
    }
  }, 'json')
}

var App = new Bling()
App.init()





















