//Bling app.js by weishai

var Config = {
  API: {
    createSnap: 'api/create_snap',
    getSnap: 'api/create_snap'
  }
}

var Bling = function () {
  
}

Bling.prototype.init = function () {
  var self = this

  this.data = {}

  this.render()
}

Bling.prototype.getSnapId = function () {}

Bling.prototype.showSnap = function (cb) {
  var self = this
    , $body = $('body')
    , snapData = this.data.snap
    , isHideImg = false

  $body.addClass('bling-start')
    .one('touchstart', function(e) {
      var autoHideSet = null

      showSnapImg(snapData.snapShowTime)

      $body.one('touchend', function (et) {
        hideSnapImg(cb)
        et.preventDefault()
      })

      autoHideSet = setTimeout(function(){
        hideSnapImg(cb)
      }, snapData.snapShowTime)

      e.preventDefault()
    })

  function showSnapImg(time) {
    $body.addClass('bling-showimg')

    return true
  }

  function hideSnapImg(cb) {
    if(isHideImg){
      return
    }
    $body.addClass('bling-hideimg')
      .removeClass('bling-showimg')

    isHideImg = true
    cb && cb()
  }
}

Bling.prototype.showSnapLuck = function () {
  
}

Bling.prototype.render = function () {
  var self = this
    , curSnapId = this.getSnapId()

  if(!curSnapId){
    return false
  }

  $.post(Config.API.getSnap, {snapId: curSnapId}, function(data) {
    switch(data.code) {
      case 1001:
        console.log('该用户已看过')
        break
      case 1002:
        console.log('超过可看人数')
        break
      case 0:
        self.data.snap = data.data
        self.showSnap(data.data, function () {
          self.showSnapLuck()
        })
        break
      default:
        console.log('sys error')
        break
    }
  })
}