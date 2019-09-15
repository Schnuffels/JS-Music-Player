# MusicPlayerHCW
一款好用的H5音乐播放器封装类

## 使用方法

> 说明

* 本音乐播放器主要针对 JS封装类 展开描述，不展开 CSS 与 HTML 的讨论  
* 本项目提供的界面只是给你看清功能，并不追求花哨  
* 你可以根据以下说明或者下载项目中的 HTML 例子进行参考或者修改

> 创建一个播放器对象

* playerId 为你的 audio 标签的 id 或者 class
* coverImgId 为你的 img 标签（此标签用作封面图）的 id 或者 class

```javascript
//创建播放器对象
var player = new MusicPlayerHCW(playerId,coverImgId,{
    'volume':0.5,       //初始音量大小（可以不设置）
    'speed':1,          //初始播放速度（可以不设置）
    'music':music,      //初始音乐播放路径
    'photo':photo       //初始封面图
});
//使用 jQuery框架 需特别注意，上面初始化播放器的代码须放在 $(function(){}) 外面
//默认情况下，上面的方法写在js脚本最外层，下面的“调用方法”全部写在 window.onlooad 或者 $(function(){}) 中
```


## 调用方法

这里说明调用方法的规范

>  播放

```javascript
player.play();

//播放并回调
player.play(function(){
  //内容
});
```

>  修改曲目并播放

* nextMusic 为要改变的歌曲 src
* nextPhoto 为要改变的歌曲封面 src
* change() 使设置生效

```javascript
player.setMusic(nextMusic).setCoverImage(nextPhoto).change().play();
```
>  暂停

```javascript
//直接调用暂停
player.pause();

//暂停并回调
player.pause(function(){
    //内容
});
```

>  停止

```javascript
//直接调用停止播放
player.stop();

//停止并回调
player.stop(function(){
    //内容
});
```

>  获取当前音量

```javascript
player.getVolume();
```

>  设置音量大小

* number 为音量大小，阈值为 0.0-1.0

```javascript
player.setVolume(number);
```

>  音量逐渐调整（增强/减弱）

```javascript
//音量增加
player.volumeUp();

//音量降低
player.volumeDown();
```

>  添加一个音量控制条监听器

* className 为你页面上，设计出来控制音量大小的控制条

```javascript
player.addVolumeProgressEventListener(className);

/**
 * 请注意，以上监听器添加完毕后，通过本类方法改动音量大小音量条会实时发生改变。
 * 如需要通过鼠标点击音量条改变大小，需要你另行设计一个透明元素通过定位方式悬浮在上方，且事件得您自己设计。
 */
```

>  静音

```javascript
//获取当前静音状态
player.mute();

//设置静音
player.mute(true);

//取消静音
player.mute(false);

//静音  JS外部调用方法
var muteButton = document.querySelector('.muteButton');
mutButton.addEventListener('click', function () {
    if (player.mute()){     //判断当前是否处于静音状态，是就取消静音
        player.mute(false);
    }else{
        player.mute(true);  //静音
    }
});

//静音  jQuery外部调用方法
$('.muteButton').on('click', function () {
    if (player.mute()){     //判断当前是否处于静音状态，是就取消静音
        player.mute(false);
    }else{
        player.mute(true);  //静音
    }
});

```

>  获取当前播放进度百分比

```javascript
player.getProgress();
```

>  设置并改变音乐播放进度

* 需要外部给进度条元素单独添加监听器，function 中 传入 event
* event 鼠标点击元素事件
* object 监听器监听对象

```javascript
player.setPlayProgress(event, object);

//JS 外部调用 setPlayProgress
var processBar = document.querySelector('.processBar');
processBar.addEventListener('click', function(event){
   player.setPlayProgress(event, this);   //传入 event 与 this
});

//jQuery 外部调用 setPlayProgress 
$('.processBar').on('click', function (event) {
    player.setPlayProgress(event, this);
});
```

>  添加一个进度条监听器

* className 为你设计的进度条的 class 或者 id
* startTimeClassName 为开始时间的(div盒子/容器)的 class 或者 id
* endTimeClassName 为结束时间的(div盒子/容器)的 class 或者 id

```javascript
player.addProgressEventListener(className, startTimeClassName, endTimeClassName);
```

>  添加一个缓冲条监听器

* className 为你自行设计的缓冲条元素的 class 或者 id

```javascript
player.addBufferedProgressEventListener(className);
```

>  获取音乐播放状态

```javascript
player.getPlayStatus();
```

>  添加一个播放状态监听器

* 本监听器仅播放状态发生改变时触发，每改变状态触发1次
* 本监听器可以监听的情况有如下：  
1.非用户操作的播放/暂停行为  
2.部分浏览器自带播放控件可对音乐进行播放/暂停操作  
3.JS脚本自动控制的播放/暂停操作  
* 如未添加本监听器，在未知情况下发生的控件操作行为网站往往探测不到，容易出现程序执行bug

```javascript
player.addPlayStatusEventListener(function () {
    //如果正在播放则执行
},function () {
    //如果无播放则执行
});
```

>  获取当前播放速度

```javascript
player.getSpeed();
```

>  设置播放速度

* speed 为速度大小，阈值为 0.7-1.5

```javascript
player.setSpeed(speed);
```

>  速度逐渐调整（加快/减弱）

```javascript
//速度增加
player.speedUp();

//速度降低
player.speedDown();
```

>  获取当前播放的音乐地址

* type: relative | absolutely
* relative 相对路劲、absolutely 绝对路劲
```javascript
player.getMusicSrc('relative');
```

>  因缓冲加载过慢导致播放停止时触发事件

```javascript
player.setBufferUnexpectedStop(function(){
    //当播放进度超过缓冲进度时触发
});
```

>  清除监听器

```javascript
player.clearMonitor();
```

>  清除指定监听器
```javascript
//清除“进度条”监听器
player.getMonitorProgress().clear();

//清除“音量控制条”监听器
player.getMonitorVolumeProgress().clear();

//清除“缓冲条”监听器
player.getMonitorBufferedProgress().clear();

//清除“播放状态”监听器
player.getMonitorPlayStatus().clear();
```


## 总结

* 本播放器封装类提供了多种监听器，建议在播放器对象创建完成后，直接将所有的监听方法实现。具体的例子可以下载整个项目查看 HTML 中怎么去操作。
* 音乐资源一个来源网络对象存储，一个来源本地。目的是为了观察缓冲条的状态与区别，不过对象存储服务器的加载速度也是非常快的，未必能看得清缓冲效果。
* 网络的音乐资源并不是一次性加载完成，有可能加载到某一个点停止缓冲，等快播放到的时候再开始缓冲，本地资源缓冲直接100%。
