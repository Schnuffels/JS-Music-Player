/**
 *  轻旋韵音乐播放器封装类
 *  QQ:943771598、642476152
 *  Date of creation:2019/08/24
 *
 *  使用方法：创建一个播放器对象
 *  var MusicPlayerHCW = new MusicPlayerHCW(audio播放器对象, img封面图对象, {
 *    volume:音量大小,
 *    speed:播放速度,
 *    music:音乐资源,
 *    photo:封面图资源
 *  });
 */
(function () {
    var mediaPlay;
    var coverImg;
    var monitor;
    function MusicPlayerHCW(playerID, coverImgID, obj) {
        this.player = playerID;
        this.coverImg = coverImgID;
        this.volume = obj.volume == null ? 0.5 : obj.volume.toFixed(1);
        this.speed = obj.speed == null ? 1 : obj.speed.toFixed(1);
        this.music = obj.music;
        this.photo = obj.photo;
        this.progressPercent = '0.00%';
        this.state = false;
        this.actionAfter = [];

        let testPlay = document.querySelectorAll(this.player);
        if (testPlay.length > 1){
            alert('一个对象只能对应一个 class');
            return;
        }
        mediaPlay = document.querySelector(this.player);
        if (typeof (this.coverImg) != "undefined" && this.coverImg !== ''){
            coverImg = document.querySelectorAll(this.coverImg);
        }
        if (mediaPlay == null){
            alert('未找到播放器 audio 标签');
        }else if(coverImg == null){
            alert('未找到封面图 img 标签');
        } else{
            mediaPlay.setAttribute('src', this.music);
            this.initCoverImg = coverImg[0].getAttribute('src');
            for (let i = 0; i < coverImg.length; i++){
                coverImg[i].setAttribute('src',this.photo);
            }

            if (this.volume > 0.9){
                this.volume = 1; mediaPlay.volume = 1;
            }else if (this.volume <= 0.1){
                this.volume = 0; mediaPlay.volume = 0;
            }else {
                mediaPlay.volume = this.volume;
            }
            if (this.speed >= 1.5){
                this.speed = 1.5; mediaPlay.playbackRate = 1.5;
            }else if (this.speed <= 0.7){
                this.speed = 0.7; mediaPlay.playbackRate = 0.7;
            }else{
                mediaPlay.playbackRate = this.speed;
            }
        }
    }

    //获取音乐链接
    MusicPlayerHCW.prototype.getMusicSrc = function (type) {
        switch (type){
            case 'relative':
                return this.music;
            case 'absolutely':
                return mediaPlay.currentSrc;
            default:
                console.log('传入类型错误：分别为 relative 与 absolutely');
                return 'error:getMusicSrc(type)'
        }
    };

    //获取播放速度
    MusicPlayerHCW.prototype.getSpeed = function () {
        return mediaPlay.playbackRate;
    };

    //设置播放速度
    MusicPlayerHCW.prototype.setSpeed = function (speed) {
        if (speed >= 1.5){
            this.speed = 1.5;
            mediaPlay.playbackRate = 1.5;
        }else if (speed <= 0.7){
            this.speed = 0.7;
            mediaPlay.playbackRate = 0.7;
        }else{
            this.speed = speed;
            mediaPlay.playbackRate = speed;
        }
        return this;
    };

    //增加播放速度
    MusicPlayerHCW.prototype.speedUp = function () {
        if (mediaPlay.playbackRate > 1.4){
            mediaPlay.playbackRate = 1.5;
            this.speed = 1.5;
        }else{
            mediaPlay.playbackRate = (mediaPlay.playbackRate + 0.1).toFixed(1);
            this.speed = (mediaPlay.playbackRate).toFixed(1);
        }
    };

    //减小播放速度
    MusicPlayerHCW.prototype.speedDown = function () {
        if (mediaPlay.playbackRate < 0.8){
            mediaPlay.playbackRate = 0.7;
            this.speed = 0.7;
        }else{
            mediaPlay.playbackRate = (mediaPlay.playbackRate - 0.1).toFixed(1);
            this.speed = (mediaPlay.playbackRate).toFixed(1);
        }
    };

    //设置播放曲目
    MusicPlayerHCW.prototype.setMusic = function(musicSrc) {
        this.music = musicSrc;
        this.progressPercent = '0.00%';
        return this;
    };

    //设置封面图片
    MusicPlayerHCW.prototype.setCoverImage = function (photoSrc) {
        this.photo = photoSrc;
        return this;
    };

    //使改变的曲目在播放器中生效
    MusicPlayerHCW.prototype.change = function () {
        mediaPlay.setAttribute('src',this.music);
        for (let i = 0; i < coverImg.length; i++){
            coverImg[i].setAttribute('src',this.photo);
        }
        mediaPlay.playbackRate = this.speed;
        endTimeChange = true;
        return this;
    };

    //播放
    MusicPlayerHCW.prototype.play = function (callback) {
        this.state = true;
        timerState = true;
        var tempMonitor = window.setInterval(function () {
            if (mediaPlay.getAttribute('src').toString() !== ''){
                mediaPlay.play();
                window.clearInterval(tempMonitor);
            }
        },100);

        if (callback){callback();}
        return this;
    };

    //设置播放完成后执行的动作 (自定义传参参数，回调函数)
    MusicPlayerHCW.prototype.setActionsAfterPlayback = function (flag, callback) {
        for (let i = 0; i < this.actionAfter.length; i++){
            if (this.actionAfter[i] === flag){
                return;
            }
        }
        this.actionAfter.push(flag);
        mediaPlay.addEventListener('ended',function () {
            if (callback){callback()}
        });
    };

    //暂停
    MusicPlayerHCW.prototype.pause = function (callback) {
        this.state = false;
        mediaPlay.pause();

        if (callback){callback();}
    };

    //停止
    MusicPlayerHCW.prototype.stop = function (callback) {
        this.state = false;
        mediaPlay.pause();
        mediaPlay.currentTime = 0;
        mediaPlay.setAttribute('src', '');
        for (let i = 0; i < coverImg.length; i++){
            coverImg[i].setAttribute('src',this.initCoverImg);
        }
        if (callback){callback();}
    };

    //获取音乐播放状态
    MusicPlayerHCW.prototype.getPlayStatus = function () {
        return this.state;
    };

    //监听音乐播放状态发生改变时执行的结果（回调1：正在播放，回调2：无播放）
    var playStatusMonitor;
    MusicPlayerHCW.prototype.addPlayStatusEventListener = function (callback1, callback2) {
        var implementState = false;         //控制回调执行
        var timerState = true;              //放开闸口1次
        playStatusMonitor = window.setInterval(function () {
            //闸口
            implementState = mediaPlay.paused != timerState;
            //播放与暂停状态
            if (implementState){
                timerState = !timerState;
                implementState = false;
                if (!mediaPlay.paused){
                    if (callback1){callback1()}
                    this.state = true;
                }else{
                    if (callback2){callback2()}
                    this.state = false;
                }
            }
        },300);
    };

    //声音调整(number为空：返回系统音量值|0.0-1.0：音量阈值)
    MusicPlayerHCW.prototype.setVolume = function (number, type) {
        mediaPlay.volume = number;
        this.volume = number;
        return this;
    };

    //设置音量进度条
    MusicPlayerHCW.prototype.setVolumeProgress = function(event, object, type){
        let currentValue;
        type = type == null ? 'horizontal' : type;
        switch (type) {
            case 'horizontal':
                currentValue = event.offsetX / object.offsetWidth;
                break;
            case 'vertical':
                currentValue = event.offsetY / object.offsetHeight;
                break;
        }
        if (currentValue > 0.95){
            currentValue = 1;
        }else if (currentValue < 0.05){
            currentValue = 0;
        }
        mediaPlay.volume = currentValue;
        this.volume = currentValue;
    };

    //获取系统音量值
    MusicPlayerHCW.prototype.getVolume = function () {
        return this.volume;
    };

    //声音增强
    MusicPlayerHCW.prototype.volumeUp = function () {
        if (mediaPlay.volume > 0.9){
            mediaPlay.volume = 1;
            this.volume = 1;
        }else{
            mediaPlay.volume = (mediaPlay.volume + 0.1).toFixed(1);
            this.volume = (mediaPlay.volume).toFixed(1);
        }
    };

    //声音减弱
    MusicPlayerHCW.prototype.volumeDown = function () {
        if (mediaPlay.volume < 0.1){
            mediaPlay.volume = 0;
            this.volume = 0;

        }else{
            mediaPlay.volume = (mediaPlay.volume - 0.1).toFixed(1);
            this.volume =  (mediaPlay.volume).toFixed(1);
        }
    };

    //静音 (isMute为空：返回当前静音状态|true：静音|false：取消静音)
    MusicPlayerHCW.prototype.mute = function (isMute) {
        if (isMute){
            mediaPlay.volume = 0;
            this.isMute = true;
        }else if (isMute == false){
            mediaPlay.volume = this.volume;
            this.isMute = false;
        }else if (isMute == null){
            return this.isMute;
        }
    };

    //监听与更新音量进度条 (传入进度条类名)
    var volumeProgressMonitor;
    MusicPlayerHCW.prototype.addVolumeProgressEventListener = function (className, type = null) {
        var vProgressObj = document.querySelector(className);
        var parent = this;
        type = type == null ? 'horizontal' : type;
        volumeProgressMonitor = window.setInterval(function () {
            switch (type) {
                case 'horizontal':
                    vProgressObj.style.width = (parent.volume * 100) + '%';
                    break;
                case 'vertical':
                    vProgressObj.style.height = (parent.volume * 100) + '%';
                    break;
            }
        },100);
    };

    //获取当前进度百分比
    MusicPlayerHCW.prototype.getProgress = function () {
        var percent = mediaPlay.currentTime / mediaPlay.duration;
        this.progressPercent = (percent * 100 ).toFixed(2) + '%';
        return (percent * 100 ).toFixed(2) + '%';
    };

    //监听与更新进度条 (传入进度条类名, 开始时间类名, 结束时间类名)
    var progressMonitor;
    var endTimeChange = true;
    MusicPlayerHCW.prototype.addProgressEventListener = function (className, startTimeClassName, endTimeClassName) {
        var progressObj = document.querySelector(className);
        var startTime = document.querySelector(startTimeClassName);
        var endTime = document.querySelector(endTimeClassName);
        var buStopTimer = 0;
        var buStopStartTime;
        //进度条更新
        progressMonitor = window.setInterval(function () {
            startTime.innerHTML = formateTime(mediaPlay.currentTime);   //当前时间
            if (endTimeChange){
                endTimeChange = false;
                endTime.innerHTML = formateTime(mediaPlay.duration) === '0NaN:0NaN' ? '00:00' : formateTime(mediaPlay.duration);    //结束时间
                setTimeout(function () {
                    if (endTime.innerHTML.toString() === '00:00'){
                        endTimeChange = true;
                    }
                },1000);
            }

            //判断是否因缓冲问题中断播放
            if (!mediaPlay.paused && startTime.innerHTML.toString() !== endTime.innerHTML.toString()){
                if (buStopTimer === 10){
                    buStopStartTime = startTime.innerHTML.toString();
                }
                ++ buStopTimer;
                if (buStopTimer >= 30){
                    if (startTime.innerHTML.toString() === buStopStartTime){
                        buStop();
                        buStopSwitch = true;
                    }else{
                        buStopSwitch = false;
                    }
                    buStopTimer = 0;
                }

            }

            var percent = mediaPlay.currentTime / mediaPlay.duration;
            progressObj.style.width = (percent * 100).toFixed(2) + '%';
        },100);
    };

    //设置播放进度
    MusicPlayerHCW.prototype.setPlayProgress = function (event, object) {
        if (!isNaN(mediaPlay.duration)){
            //计算点击位置的百分比
            var currentValue = event.offsetX / object.offsetWidth;
            mediaPlay.currentTime = mediaPlay.duration * currentValue;
        }
    };

    //获取缓冲进度
    var bufferedMonitor;
    MusicPlayerHCW.prototype.addBufferedProgressEventListener = function (className) {
        //进度条更新
        bufferedMonitor = window.setInterval(function () {
            var buffered = mediaPlay.buffered, loaded;
            var bufferedProgressObj = document.querySelector(className);
            if (buffered.length) {
                // 获取当前缓冲进度
                loaded = 100 * buffered.end(0) / mediaPlay.duration;
                // 渲染缓冲条的样式
                bufferedProgressObj.style.width = (loaded.toFixed(2)) + '%';
            }
        },500);
    };

    //获取“进度条”监听器
    MusicPlayerHCW.prototype.getMonitorProgress = function () {
        monitor = progressMonitor;
        return this;
    };

    //获取“音量控制条”监听器
    MusicPlayerHCW.prototype.getMonitorVolumeProgress = function () {
        monitor = volumeProgressMonitor;
        return this;
    };

    //获取“缓冲条”监听器
    MusicPlayerHCW.prototype.getMonitorBufferedProgress = function () {
        monitor = bufferedMonitor;
        return this;
    };

    //获取“播放状态”监听器
    MusicPlayerHCW.prototype.getMonitorPlayStatus = function () {
        monitor = playStatusMonitor;
        return this;
    };

    //清理全部监听器
    MusicPlayerHCW.prototype.clearMonitor = function () {
        window.clearInterval(progressMonitor);
        window.clearInterval(volumeProgressMonitor);
        window.clearInterval(bufferedMonitor);
        window.clearInterval(playStatusMonitor);
    };

    //清除指定监听器
    MusicPlayerHCW.prototype.clear = function () {
        window.clearInterval(monitor);
        monitor = null;
    };

    //时间转换(格式化时间)
    function formateTime(time) {
        if (time > 3600) {
            var hour = parseInt(time / 3600);
            var minute = parseInt(time % 3600 / 60);
            var second = parseInt(time % 3600);
            hour = hour >= 10 ? hour : '0' + hour;
            minute = minute >= 10 ? minute : '0' + minute;
            second = second >= 10 ? second : '0' + second;
            return hour + ':' + minute + ':' + second;
        }
        else {
            var minute = parseInt(time / 60);
            var second = parseInt(time % 60);
            minute = minute >= 10 ? minute : '0' + minute;
            second = second >= 10 ? second : '0' + second;
            return minute + ':' + second;
        }
    }

    //设置缓冲导致的播放停止事件
    MusicPlayerHCW.prototype.setBufferUnexpectedStop = function (callback) {
        if(callback){
            buStop = function () {
                if (buStopSwitch){
                    return;
                }
                callback();
            }
        }
    };

    //缓冲导致播放停止
    var buStopSwitch = false;
    var buStop = function bufferUnexpectedStop(callback) {
        if (buStopSwitch){
            return;
        }
        if(callback){callback()}
    };

    window.MusicPlayerHCW = MusicPlayerHCW;
})(window);
