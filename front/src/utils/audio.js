import $ from 'jquery';
import {Toast} from '@mshare/mshareui';
import {getById,getTabIndex} from "./formater";
import {uploadAudio} from "../services/edu";

var audio_config={
    "timer" : null,//音频文件 全局定时器对象，用于清偿定时器使用
    "arr_serverId" : new Array(),//定义一个数组对象 用于存储当前录音serverId
    "is_recording" : false,//是否在录制视频 默认为没有录制
    "index" : 999,//当前播放音频元素下标
    "isUploadWx":false, // 是否上传微信
    "wxObj":null,//表示微信接口播放时需要用到的当前播放音频文件所在的DOM元素对象
    "srcArr":null,//表示微信接口播放时需要用到的当前文件路径数组对象
    "localId":null, //表示微信接口播放时需要用到的临时本地音频文件ID
    "serverId":null,//表示微信接口播放时需要用到的临时微信服务ID
    "palyType":null,//表示播放类型， 1 代表 微信播放 2 代表aduio标签播放
    "upper_index":999,//表示微信接口音频播放时上一次播放的索引
    "stageNum":null//点击添加音频的阶段信息
};

//微信音频录音方法初始化
wx.ready(function(){

    //录音超过一分钟监听器
    wx.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: function (res) {
            //上传微信服务器
            uploadWxServer(res.localId,1);
            //======开始录音=========//
            startRecord();
        }
    });

    //播放音频文件结束监听器
    wx.onVoicePlayEnd({
        success: function (res) {
            if(audio_config.upper_index == audio_config.index){
                if(audio_config.srcArr.length == 0 && audio_config.palyType == 1){
                    $(audio_config.wxObj).removeClass('music-btn-pause');//播放完成
                    audio_config.index = 999;
                    audio_config.wxObj = null;//清空缓存
                    audio_config.srcArr = null;//清空对象
                    audio_config.palyType = null;
                    audio_config.upper_index = 999;
                }else{
                    wxPaly(audio_config.srcArr);
                }
            }else{
                audio_config.upper_index = audio_config.index;
            }
        }
    });

});
function wxPaly(srcArr){
    var serverId = srcArr.shift();
    audio_config.srcArr = srcArr;
    audio_config.serverId = serverId;
    wx.downloadVoice({
        serverId:serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
        isShowProgressTips:0,// 默认为1，显示进度提示
        success:function (res) {
            var localId = res.localId; // 返回音频的本地ID
            playVoice(localId);
        }
    });
}
//微信录音上传至微信服务
function uploadWxServer(localId,type,that){
    wx.uploadVoice({
        localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 0,// 默认为1，显示进度提示
        success: function (res) {
            // uploadAudio(res.serverId).then((res)=>{
            //     console.log("res====",res)
            // })
            var serverId = res.serverId; // 返回音频的服务器端ID
            audio_config.arr_serverId.push(serverId);
            audio_config.isUploadWx = true;
            if(type == 2){//type 1 正常录制中, type = 2 完成录制
                uploadAudioServer(that);
            }
        }
    });
}

//开始录制音频
function startRecord(){
    wx.startRecord();
    audio_config.is_recording = true;
    window.is_recording = true;
    audio_config.isUploadWx = false;//未上传

}

//微信播放接口
function playVoice(localId){
    audio_config.localId = localId;
    wx.playVoice({
        localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
    });
}
//暂停录制音频
function stopRecord(type,that){

    wx.stopRecord({
        success: function (res) {
            var localId = res.localId;
            console.log('localId',localId)
            //上传微信服务器
            uploadWxServer(localId,type,that);
        }
    });
    audio_config.is_recording = false;
}

function cancelRecord(){
    clearTimeout(audio_config.timer);
    //=======停止录音=============//
    wx.stopRecord({
        success: function (res) {
            audio_config.arr_serverId = new Array();
        }
    });
    //计时器清空
    $(".audio-box #showTimeAudio").text("00:00:00");
    $('.audio-box #pause').text('暂停');
    //关闭录制后状态变更为非录制状态
    audio_config.is_recording = false;
    window.is_recording = false;
    //重置变量
    audio_config.stageNum = null;
}

function uploadAudioServer(that){
    //加载框弹出
    // var $loading = loadAlert();
    //外部变量 记录循次数
    var count = 1;
    // audio_config.stageNum = null;
    var tab = audio_config.stageNum;
    //重置变量
    Toast.loading('加载中', 0, () => {
        console.log('Load complete !!!');
    });
    // audio_config.stageNum = null;

    var int = setInterval(function(){
        if(audio_config.isUploadWx){
            clearInterval(int);//关闭定时器
            Toast.hide();
            var serverIds = audio_config.arr_serverId.join();
            Toast.loading("录音上传中",0);
            uploadAudio(serverIds).then((res)=>{
                // res =[{fsStorePath:'/static/audio/20190806/a57946efa51c459c9b8627ed63bec320.mp3,',
                //         showUri:null,
                //          mediaType:"AUDIO",
                //      mediaBizType:'AUDIO_ADDRESS',
                // serverIds:serverIds}]
                if(res){
                  that.props.changeFile('fileList',res,tab[0],tab[1]);
                  Toast.hide();
                  audio_config.arr_serverId = new Array();
                  audio_config.stageNum = null;
              }
            }).catch(()=>{
                Toast.fail("录音上传失败",4);
                audio_config.arr_serverId = new Array();
                audio_config.stageNum = null;
            })
        }else{
            if(count >= 100){
                clearInterval(int);//关闭定时器
                Toast.hide();
                Toast.fail('音频录制失败',4);
                audio_config.arr_serverId = new Array();
                audio_config.stageNum = null;
            }
        }
        count++;
    },100);
}
function timer(){
    // console.log('elementId',elementId)
    var timerHtml= getById('showTimeAudio').textContent;
    // var timerHtml = jQuery(elementId).text();
    var timerArr = timerHtml.split(":");
    var hour = parseInt(timerArr[0],10);
    var minute = parseInt(timerArr[1],10);
    var second = parseInt(timerArr[2],10);
    if(second >= 59){
        minute++;
        second = "00";
    }else{
        second++;
        if(second < 10){
            second = "0"+second;
        }
    }
    if(minute >= 59){
        hour++;
        minute = "00";
    }else{
        if(minute < 10){
            minute = "0"+minute;
        }
    }
    if(hour < 10){
        hour = "0"+hour;
    }
    getById('showTimeAudio').innerText = hour+":"+minute+":"+second;
    // jQuery(elementId).text(hour+":"+minute+":"+second);
    audio_config.timer = setTimeout(()=>timer(),1000);
}
function clickAudio(that){
    let start_audio = getById('start-audio');
    console.log('start_audio',start_audio);
    if(start_audio){
        start_audio.onclick = function(e){
            e.stopPropagation();
            //判断录音的个数
            let len = 0,elements;
            that.hideAddFile();
           let outTab = $('.mshare-tabs-default-bar-tab-active')[0];
            let inTab = $('.mshare-tabs-default-bar-tab-active')[1];
           let outIndex = $(outTab).index(),inIndex = $(inTab).index();
           if(outIndex==1){
               elements =  $('.tab-content-in:eq('+inIndex+')').find('.all-files .audio-item');
           } else {
              elements =  $('.tab-content-out:eq('+outIndex+')').find('.all-files .audio-item');
           }
            len = elements.length;
           console.log('len====',len);
            if(len && len>=20){
                Toast.info('录音最多上传20个',4);
                return;
            }
            if(audio_config.is_recording){
                Toast.info('正在录制中',4);
                return;
            }
            if(window.is_recording){
                Toast.info('请先结束上一段录音',4);
                return;
            }
            let isPlaying = false;
            $('.music-btn').each(function(j){
                if($(this).hasClass('music-btn-pause')) {
                    isPlaying = true;
                    return false;
                }
            })
            if(isPlaying){
                Toast.info('正在播放录音中',4);
                return;
            }
            $('.audio-box').show();
            $('.tab-content-out').css({paddingTop:'77px'});
            $('.add-stage-btn').css({top:'89px'});
            //======开始录音=========//
            // debugger;
            audio_config.timer = setTimeout(()=>timer(),100);
            let tab = getTabIndex();
            audio_config.stageNum = tab;

            startRecord();
            let pause = getById('pause');
            let end = getById('end');
            pause.onclick = function(e){
                e.stopPropagation();
                let text = pause.textContent;
                console.log('text===',text)
                if(text == '暂停') {
                    //=======关闭录制时间===========//
                    clearTimeout(audio_config.timer);
                    //=======暂停录音=============//
                    stopRecord(1);
                    pause.innerText='开始';

                } else if(text=='开始'){
                    audio_config.timer = setTimeout(()=>timer(),100);
                    //======开始录音=========//
                    startRecord();
                    pause.innerText='暂停';
                }
            }
            end.onclick = function(e){
                e.stopPropagation();
                var time = $('.audio-box #showTimeAudio').text();//获取录制时间
                $('.audio-box').hide();
                $('.audio-box #showTimeAudio').text("00:00:00");
                $('.audio-box #pause').text('暂停');
                $('.tab-content-out').css({paddingTop:'43px'});
                $('.add-stage-btn').css({top:'55px'});
                clearTimeout(audio_config.timer);
                window.is_recording = false;
                if(time!='00:00:00'){
                    //分为两种情况 第一种 正在录制 直接调用停止录制接口，第二种已处于暂停状态， 直接上传录音文件
                    // alert(audio_config.is_recording)
                    if(audio_config.is_recording){//正在录制
                        //=======停止录音=============//
                        stopRecord(2,that);
                    }else{//直接上传
                        uploadAudioServer(that);
                    }
                }else{
                    Toast.info("空录音文件不能上传",4);
                }
            }
        }
    }
}

export {uploadWxServer,startRecord,timer,playVoice,clickAudio,cancelRecord}

