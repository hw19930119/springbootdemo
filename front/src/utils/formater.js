import {Toast,Modal} from '@mshare/mshareui';
import {fsUp,convertFrontendFileJson,newUploadImg} from "../services/edu";
const { alert } = Modal;
export function formaterStageArr(arr,index,type) {
    let data = [].concat(arr);
    const numberArr = ['一','二','三','四','五','六','七','八','九'];
    let length = arr.length;
    if(type){
        if(length>=4){
            myLert('不能再添加了');
            // Toast.info('不能再添加了',2);
            return false;
        }
        data.push({
            title:`第${numberArr[length]}阶段`
        });
    } else {
        if(length == 1){
            myLert('不能再删除了');
            // Toast.info('不能再删除了',2);
            return false;
        }
        data.splice(index,1);
    }
    return data;
}
export function recordsTab(arr){
    let data = [];
    const numberArr = ['一','二','三','四','五','六','七','八','九'];
    arr.map((item,index)=>{
        data.push({
            title:`第${numberArr[index]}阶段`
        })
    })
    return data;
}

export function getById(id){
    return document.getElementById(id);
}
export function getByClass(name){
    return document.getElementsByClassName(name);
}
// export function timer(){
//     let hour= 0,minute=0,second = 0;
//     if(second>=60)
//     {
//         second=0;
//         minute=minute+1;
//     }
//
//     if(minute>=60)
//     {
//         minute=0;
//         hour=hour+1;
//     }
//
// }
export function getTabIndex(){
    let classTab = getByClass('mshare-tabs-default-bar-content');
    var boxArr = new Array();
    //boxArr 用来存储获取到的所有class为clsName的元素
    for(var i=0;i<classTab.length;i++){
        let oElements  = classTab[i].getElementsByClassName('mshare-tabs-default-bar-tab')
        for(var j=0;j<oElements.length;j++){
            if(oElements[j].className.indexOf('active')>-1){
                console.log('j=====',j);
                boxArr.push(j)
            }
        }
    }
    return boxArr;
}

function Compress(target, options){
    var _this = this;

    this.target = target;//目标File
    //参数对象{quality : 0.8//图像压缩比例, zoom : 0.8//缩放比例, checkSize : 0//临界值}
    this.options = options;
    //创建图片对象
    var img = new Image();
    //创建画板
    var canvas = document.createElement('canvas');
    //获取画板绘画对象，压缩图片全靠该对象了
    var ctx = canvas.getContext('2d');
    //获取
    var getUrl = function(file){
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    //上传Blob对象文件
    var uploadBlob = function(callback){
        var quality = 1;
        if(_this.options.quality && _this.options.quality <= 1 && _this.options.quality > 0){
            quality = _this.options.quality;
        }
        var base64 = canvas.toDataURL("image/jpeg", quality);
        base64 = base64.split(',')[1];
        base64 = window.atob(base64);
        var ia = new Uint8Array(base64.length);
        for (var i = 0; i < base64.length; i++) {
            ia[i] = base64.charCodeAt(i);
        };

        //删除 canvas 节点
        canvas = null;
        ctx = null;
        var blob = new Blob([ia], {
            type: "image/jpeg"
        });
        callback(blob,_this.target.name);
    }

    //暴露出去的方法
    var uploadImg = function(callback){
        //根据设置判断多大的文件需要压缩
        if(ckeckNum() < _this.target.size){
            img.src = getUrl(_this.target);
            img.onload = function(){
                var that = this;
                var w = that.width, h = that.height;
                var dw = w * _this.options.zoom || w;
                var dh = h * _this.options.zoom || h;
                dw = Math.round(dw);
                dh =Math.round(dh);
                canvas.width = dw;
                canvas.height = dh;
                ctx.drawImage(that,0,0,w,h,0,0, dw,dh);
                uploadBlob(callback);
            }
        } else {
            callback(_this.target,_this.target.name);
        }
    }

    var ckeckNum = function(){
        var re =  /^[1-9]+[0-9]*]*$/ ;
        if(re.test(_this.options.checkSize)){
            return _this.options.checkSize;
        }else{
            return 0;
        }
    }

    return{
        saveImg:uploadImg
    }
}
export function saveImg(file ,count, i){
    return new Promise(function(req,response){
        var compress = new Compress(file, {quality : 0.6, zoom : 0.8, checkSize : 0});
        var compress_callback = function(blob, fileName){
            var formData = new FormData();
            formData.append("file", blob, fileName);
            formData.append("mediaBizType","OPTIONS_ADDRESS");
            var parameter = {
                url : '',
                formData : formData,
                callBack : null,
                error : null
            }
            //回调函数
            var _callBack = function(data){
                if(i >= count){
                    Toast.hide()
                }
                // $loading.fadeOut(100);//关闭弹框
                var state = data.state;
                if(state == 'y'){
                    // jQueryDom.find(".delete-btn").attr("address", data.msg);
                }
            }

            //错误回调函数
            var error_callBack = function(){
                // jQueryDom.remove();
            }

            parameter.callBack = _callBack;
            parameter.error = error_callBack;
            //异步访问参数
            // ajaxFileData(parameter);
            // fsUp({body:parameter.formData}).then((res)=>{
            //     console.log('res====',res);
            //     if(res){
            //         let params = {
            //             upReturnJson:res,
            //             mediaBizType:"OPTIONS_ADDRESS"
            //         }
            //         convertFrontendFileJson({body:params}).then((resUrl)=>{
            //             Toast.hide();
            //             req(resUrl);
            //         }).catch((error)=>{
            //             Toast.info('上传失败！',1);
            //
            //         })
            //     }
            //     console.log("res=====",res);
            // }).catch((error)=>{
            //     Toast.info('上传失败',1);
            // })

            // let parms = {file:formData,mediaBizType:'OPTIONS_ADDRESS'}
            newUploadImg({body:formData}).then((resUrl)=>{
                Toast.hide();
                req(resUrl);
            }).catch((error)=>{
                Toast.fail('上传失败',4);
            })
        }
        compress.saveImg(compress_callback);
    })
}
// 异步上传文件公用方法
function ajaxFileData(parameter){
    return new Promise(function(req,response){
        fsUp({body:parameter.formData}).then((res)=>{
            console.log('res====',res);
            if(res){
                let params = {
                    upReturnJson:res,
                    mediaBizType:"OPTIONS_ADDRESS"
                }
                convertFrontendFileJson({body:params}).then((resUrl)=>{
                    req(resUrl)
                    // Toast.hide()
                    // that.props.changeFile('fileList',resUrl,index[0],index[1]);
                }).catch((error)=>{
                    alert(error)
                    // Toast.info('上传失败！',1);

                })
            }
            console.log("res=====",res);
        }).catch((error)=>{
            alert(error)
            // Toast.info('上传失败',1);
        })
    })

}
export const numberArr = ['一','二','三','四','五','六','七','八','九'];
export function overFileMaxLength(arr,type,max=20,fileLength){
   let length = 0;
    arr && arr.map((item)=>{
        if(item.mediaBizType == type){
            length = length+1;
        }
    })
    if(fileLength!=undefined){
        if(length + fileLength>max){
            return true
        }
    } else{
        if(length>=max){
            return true;
        }
    }

    return false;
}
export function validateInfo(arr,data,type){

    let hasError = false;
    for (let i=0;i<arr.length;i++){
        let { required,name,placeholder,title,length} = arr[i];
        if(type=="save"){
            if(required && !data[name]){
                myLert(placeholder);
                // Toast.info(placeholder,1);
                hasError = true;
                break;
            }
        }
        if(length && data[name] && data[name].length > length){
            // if(baseItems[i].length && val && val.length>baseItems[i].length){
            // Toast.info(`${title}字数不能超过${length}`,1);
            myLert(`${title}字数不能超过${length}`);
            hasError = true;
            break;
            // }
        }

    }
    return hasError;
}
export function validateOther(baseInfo,classRecord,huizongPingjiaVo){
    debugger;
    let validateClass = false,validateAllComment = false;
    let length = Object.keys(classRecord).length;
    if(length==0){
       myLert("请填写阶段信息");
        // Toast.info("请填写阶段信息",1);
    } else {
        let  info = Object.values(classRecord);
        for(let i=0;i<info.length;i++){
            if(info[i].contentInput || info[i].opinionInput || info[i].stageLevel || (info[i].fileList && info[i].fileList.length>0)){
                validateClass = true;
                break;
            }
        }
        if(!validateClass){
            myLert("请填写阶段信息");
        }

        // let info = classRecord["stage0"];
        // if(info.contentInput || info.opinionInput || info.stageLevel || (info.fileList && info.fileList.length>0)){
        //     validateClass = true;
        // } else {
        //     Toast.info("请填写第一阶段信息",1);
        // }
    }
    if(baseInfo.courseClassify=="JYK"){
        if(huizongPingjiaVo.contentInput || (huizongPingjiaVo.fileList && huizongPingjiaVo.fileList.length>0)){
            validateAllComment = true;
        } else {
           myLert("请填写汇总评价信息");
            // Toast.info("请填写汇总评价信息",1);
        }
    }  else {
        validateAllComment = true
    }
    return validateClass && validateAllComment

}
export function myLert(text){
    const alertInstance = alert(text,'', [
        { text: '我知道了', onPress: () => alertInstance.close(), style: 'default' }
    ]);
}

