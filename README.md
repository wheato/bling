# Bling
Coming soon...

## Bling API

### POST  `api/create_snap`
##### 创建并提交图片，生成阅后即焚snap
请求参数
  - `imgId` : 图片的微信服务器端的serverId，后台可通过此Id下载图片来更新snapImgUrl，必须
  - `imgSet` : 为求简单与扩展性，图片配置信息都存在这Object对象，包括图片显示时间，可看人数，彩蛋类型等
  
返回
  - `code` : 默认 0 为成功，其他返回对应错误码
  - `msg` : "描述信息"
  - `data` : 
```
  {
    snapId: 阅后即焚Id,
    snapUrl：一般根据snapId生成，就是分享用的链接
    user: {
      uid: 
      nickname: 昵称
      userImgUrl: 用户头像图片url
    }
  }
```
  
### GET api/get_snap
##### 获取阅后即焚图片
  请求参数
  - `snapId` : 阅后即焚Id
  
  返回
  - `code` : 默认 0 为成功，1001为该用户已看过，1002为超过可看人数
  - `msg` : "描述信息"
  - `data` :
```
  {
    snapId: 阅后即焚Id,
    snapAuthor: { //该阅后即焚发起者信息
      uid: 
      nickname: 昵称
      userImgUrl: 用户头像图片url
    },
    snapImgId: 阅后即焚图片id，即图片的微信服务器端的serverId
    snapImgUrl: 阅后即焚图片url，后台从微信服务器下载图片后更新；若为空，前端根据snapImgId下载图片
    isSnapLuck: true //是否中彩蛋，后台随机判断返回结果
  }
```
