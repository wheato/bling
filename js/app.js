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

    self.countDown(1, time*1000)
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

  if(!snapData.isSnapLuck){
    return
  }

  $('body').addClass('bling-upload')
    .on('touchstart', '[data-upload]', function(e) {
      self.choseImg()
      e.preventDefault()
    })
}

Bling.prototype.countDown = function (percent, time) {
  var canvas = document.getElementById('countDown');
  var ctx = canvas.getContext("2d");
  var W = canvas.width;
  var H = canvas.height;
  var R = H/2.5;
  var deg=0,new_deg=0,dif=0;
  var loop,re_loop;
  var text,text_w;

  $countDown = $('#countDown')
  $countDown.addClass('countDown-show')
  draw(percent, time)
  console.log(time)
  
  function init(){
    // ctx.clearRect(0,0,W,H);
    // ctx.beginPath();
    // ctx.strokeStyle="rgba(0,0,0,0)";
    // ctx.lineWidth=1;
    // ctx.arc(W/2,H/2,R,0,Math.PI*2,false);
    // ctx.stroke();
    
    var r = deg*Math.PI/180;
    ctx.beginPath();
    ctx.strokeStyle = "#cba200";
    ctx.lineWidth=1;
    ctx.arc(W/2,H/2,R,0-90*Math.PI/180,r-90*Math.PI/180,false);
    ctx.stroke();
    
    // ctx.fillStyle="#cba200";
    // ctx.font="12px";
    // text = Math.floor(deg/360*100)+"%";
    // text_w = ctx.measureText(text).width;
    // ctx.fillText(text,W/2 - text_w/2,H/2+15);
  }
  function draw(p, t){
    //new_deg = Math.round(Math.random()*360);
    new_deg = Math.round(p*360);
    dif = new_deg-deg;
    loop = setInterval(to,t/dif);
  }
  function to(){
    if(deg == new_deg){
      clearInterval(loop);
      $countDown.remove()
    }
    if(deg<new_deg){
      deg++;
    }else{
      deg--;
    }
    init();
  }
  //re_loop = setInterval(draw,2000);
}
Bling.prototype.choseImg = function () {
  var imgId = '../img/test.jpg'

  $('.page-upload').addClass('page-upload-ready')
  $('#Preview').attr('src', imgId)
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





















