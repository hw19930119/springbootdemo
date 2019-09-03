import React from 'react';
import { Preview,List } from '@mshare/mshareui';
import './AddFiles.scss';
import {getContextPath} from "../../../utils/utils";
import {uploadWxServer,startRecord} from '../../../utils/audio';
import $ from "jquery";
// import "../../../utils/audio";
let audio_config = {
    localId:null,
    index:999,
    wxObj:null,
    srcArr:null,
    palyType:null,
    upper_index:999
}
let context = getContextPath();
class AddFiles extends React.Component{
    constructor(){
        super()
        this.state = {
            isOpen: false
        }
    }
    componentDidMount(){
        let that = this;
        wx.ready(function(){
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
                    // alert(audio_config.upper_index);
                    // alert(audio_config.index);
                    if(audio_config.upper_index == audio_config.index){
                        if(audio_config.srcArr.length == 0){
                            $(audio_config.wxObj).removeClass('music-btn-pause');//播放完成
                            window.isPlaying = false;
                            audio_config.index = 999;
                            audio_config.wxObj = null;//清空缓存
                            audio_config.srcArr = null;//清空对象
                            audio_config.palyType = null;
                            audio_config.upper_index = 999;
                        }else{
                            that.wxPaly(audio_config.srcArr);
                        }
                    }else{
                        audio_config.upper_index = audio_config.index;
                    }
                }
            });
        });
    }
    deleteFile = ((deleteIndex,event)=>{
        event.stopPropagation();
        console.log('click===');
        let {filesData} = this.props;
        this.props.changeFile('fileList',filesData,deleteIndex);
    })

    clickAudio=((url,e)=>{
        let that = this;
        let obj = e.currentTarget;
        var index = $(".music-btn").index($(obj));
        $('.music-btn').each(function(j){
            if(j != index){
            if($(this).hasClass('music-btn-pause')){
                $(this).removeClass('music-btn-pause');//待播放状态
                //========= 暂停正在播放的音频对象 ==============//
                if(audio_config.palyType == 2) {
                    var audioDom = $(this).prevAll("audio");//音频播放对象
                    audioDom[0].pause();//暂停当前播放的音频文件
                } else {
                    if(audio_config.localId != null){
                        that.pauseVoice(audio_config.localId, j);
                        audio_config.localId = null;
                    }
                }
                audio_config.index = 999;//默认清空
            }
            }
        })

        if($(obj).hasClass('music-btn-pause')){//暂停
            $(obj).removeClass('music-btn-pause');
            window.isPlaying = false;
            //========= 暂停正在播放的音频对象 ==============//
            if(audio_config.palyType == 2){
                var audioDom = $(obj).prevAll("audio");//音频播放对象
                audioDom[0].pause();//暂停当前播放的音频文
            } else {
                this.pauseVoice(audio_config.localId, index);
            }

            audio_config.index = index;
        }else{//播放
            $(obj).addClass('music-btn-pause');
            window.isPlaying = true;
            this.palyAudio(obj, index);

        }

    })
    pauseVoice = ((localId, index)=>{
        audio_config.upper_index = index;
        wx.pauseVoice({
            localId: localId // 需要暂停的音频的本地ID，由stopRecord接口获得
        });
    })
    playVoice=((localId)=>{
        audio_config.localId = localId;
        wx.playVoice({
            localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
        });
    })
    palyAudio=((obj, index)=>{
        var audioSrc = $(obj).parent().find(".delete-btn").attr("address");//音频播放地址xxx,xxx,格式
        // var srcArr;
        // var srcArr = audioSrc.substring(0, audioSrc.length - 1).split(",");
        // var srcArr = audioSrc.split(",");
        // var palyAddrress = srcArr[0];
        var mp3_index = audioSrc.indexOf(".mp3");
        if(mp3_index > 0){ //音频标签<audio>播放
            var srcArr = audioSrc.substring(0, audioSrc.length - 1).split(",");
            this.aduioPaly(srcArr, obj, index);
            audio_config.palyType = 2;
        }else{//微信接口播放
           var  srcArr = audioSrc.split(",");
            if(audio_config.index == index){
                // alert(audio_config.index)
                var _index = srcArr.indexOf(audio_config.serverId);
                srcArr = srcArr.slice(_index + 1);
                audio_config.srcArr = srcArr;
                this.playVoice(audio_config.localId);
            }else{
                this.wxPaly(srcArr);
            }
            audio_config.wxObj = obj;
            audio_config.palyType = 1;
        }
    })

     aduioPaly=((srcArr, obj,index)=>{
        var audioDom = $(obj).prevAll("audio");//音频播放对象
         if(audio_config.index == index) {
             audioDom[0].play();
             var src = audioDom.attr("src");
             src  = src.replace(context,"");
             var _index = srcArr.indexOf(src);
             srcArr = srcArr.slice(_index + 1);
         } else {
             audioDom.attr("src", context + srcArr.shift());
             // audioDom[0].load();
             audioDom[0].play();
             audioDom.attr("autoplay",true);
         }

        //播放完成后接着播放下一段
        audioDom[0].onended = function(){
             // alert(srcArr);
             // alert(srcArr.length);
            if(srcArr.length > 0){
                audioDom.attr("src",context+srcArr.shift());
                audioDom[0].play();
            }else{
                $(obj).removeClass('music-btn-pause');//播放完成
                window.isPlaying = false;
                audio_config.palyType = null;
                audio_config.index = 999;
            }
        };
    })
    wxPaly = ((srcArr)=>{
        let that = this;
        var serverId = srcArr.shift();
        audio_config.srcArr = srcArr;
        audio_config.serverId = serverId;
        wx.downloadVoice({
            serverId:serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
            isShowProgressTips:0,// 默认为1，显示进度提示
            success:function (res) {
                var localId = res.localId; // 返回音频的本地ID
                that.playVoice(localId);
            }
        });
    })
    render(){
        let { filesData,type } = this.props;
        let imgs = [],paints = [],vedios=[],audios=[];
        filesData.map((item,index)=>{
            if(item.mediaBizType=="OPTIONS_ADDRESS"){
                imgs.push({...item,fileIndex:index})
            } else if(item.mediaBizType=="CONTENT_DRAW"){
                paints.push({...item,fileIndex:index})
            } else if(item.mediaBizType=="AUDIO_ADDRESS"){  //录音
                audios.push({...item,fileIndex:index})
            } else if(item.mediaBizType=="VIDEO_ADDRESS"){
                vedios.push({...item,fileIndex:index})
            } else {

            }
        })

        return(
            <List renderHeader={() => `${type&&type=="detail"?'附件':'附件上传（每种类型的附件不超过20张/个）'}`}>
                <ul className="all-files">
                    {
                        imgs&&imgs.length>0 && imgs.map((item,index1)=>{
                            let { mediaType,showUri,mediaBizType,fileIndex } = item;
                            showUri = context+showUri;
                            console.log("showUri",showUri)
                            let fileUrl = showUri.replace('file-system','fs-down');
                            return (
                                <li className="file-item" key={index1}>
                                    <div className={`img-item`}>
                                        <img
                                            src={fileUrl}
                                            onClick={() => this.props.showFile(fileUrl,mediaType,mediaBizType)}
                                        />
                                        {
                                            type &&  type == "detail"? false:
                                                <i className="si si-com_closethin" onClick={(e)=>{this.deleteFile(fileIndex,e)}}></i>

                                        }
                                    </div>
                                </li>)
                        })
                    }
                    {/*录音*/}

                    {
                        audios&&audios.length>0 ?

                                    audios.map((item,index2)=>{
                                        let { showUri,fileIndex,serverIds } = item;
                                        // showUri = "\/static/audio" + showUri;
                                        return (
                                            <li className="file-item" key={index2}>
                                                <div className="audio-item">
                                                    <audio src="" preload="true"></audio>
                                                    <a className="music-btn" onClick={(e)=>this.clickAudio(showUri,e)}></a>
                                                    <i className="si si-com_closethin delete-btn" onClick={(e)=>{this.deleteFile(fileIndex,e)}} address={showUri?showUri:serverIds} style={{display:type && type=="detail"?'none':'block'}}></i>


                                                </div>
                                            </li>)
                                    }):false

                    }
                    {/*视频*/}
                    {
                        vedios&&vedios.length>0 && vedios.map((item,index3)=>{
                            let { showUri,fileIndex } = item;
                            showUri = context+showUri;
                            console.log("showUri",showUri)
                            let fileUrl = showUri.replace('file-system','fs-down');
                            return (
                                <li className="file-item" key={index3}>
                                    <div className="vedio-item">
                                        <img src={require('../../../assets/images/movie-play-ico.png')} className="movie-play-ico" address={fileUrl} onClick={()=>this.props.showFile(fileUrl,"VIDEO")}></img>
                                        {/*<video id="video" width='80' height="80"  ref={(video)=>{this.video=video}} src={`${context}${showUri}`}></video>*/}
                                        {
                                            type && type =="detail"? false:
                                                <i className="si si-com_closethin" onClick={(e)=>{this.deleteFile(fileIndex,e)}}></i>
                                        }
                                    </div>
                                </li>)
                        })
                    }
                    {
                        paints && paints.length>0 && paints.map((item,index4)=>{
                            let { mediaType,showUri,mediaBizType,fileIndex } = item;
                            showUri = context+showUri;
                            console.log("showUri",showUri)
                            let fileUrl = showUri.replace('file-system','fs-down');
                            return (
                                <li className="file-item" key={index4}>
                                    <div className={`paint-img`}>
                                        <img
                                            src={fileUrl}
                                            onClick={() => this.props.showFile(fileUrl,mediaType,mediaBizType)}
                                        />
                                        {
                                            type &&  type == "detail"? false:
                                                <i className="si si-com_closethin" onClick={(e)=>{this.deleteFile(fileIndex,e)}}></i>

                                        }
                                    </div>
                                </li>)
                        })
                    }
                    {
                        filesData && filesData.length == 0 && <p className='no-file'>{type=="detail"?'你未上传附件信息':'请上传附件'}</p>
                    }

            </ul>
            </List>
        )

    }
}
export default AddFiles;
