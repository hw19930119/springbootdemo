import React from 'react';
import { Tabs ,Button,Modal,Preview,Toast} from '@mshare/mshareui';
const { alert } = Modal;
import {lessonTab,textItems,baseItems} from '../../../../utils/config';
import './MyLesson.scss';
import BaseInfo from '../../../../components/ui/BaseInfo/BaseInfo';
import SecondForm from '../../../../components/ui/SecondForm/SecondForm';
import AddElement from '../../../../components/ui/AddElement/AddElement';
import Paint from '../../../../components/ui/Paint/Paint';
import {saveDetail,getShareCourseDetail,getJsSDK,getDetail,getMyDraftCount} from '../../../../services/edu';
import Comment from '../../../../components/ui/Coment/Comment';
import {formaterStageArr,numberArr} from '../../../../utils/formater';
// import {clickAudio } from '../../../../utils/audio';
import Audio from '../../../../components/ui/Audio/Audio';
import Vedio from '../../../../components/ui/Vedio/Vedio';
import {getData} from "../../../../utils/StoreUtil";
import {validateInfo,validateOther,myLert} from "../../../../utils/formater";
import {throttle,getCookie,delCookie} from "../../../../utils/utils";
let isResearch = false; //默认不是教研课
import {cancelRecord} from "../../../../utils/audio";
class MyLesson extends React.Component{
    constructor(){
        super();
        this.state = {
            baseInfo:{
                subjectName:'',
                teacheName:'',
                stratTime: '',
                address:'',
                schoolName:'',
                greadeName:'',
                className:'',
                courseName:'',
                courseType:'',
                courseClassify:'',
                towCodeImg:''
            }, //基本信息
            showTwoCode:false, //二维码图片
            recordsTab : [{
                title:'第一阶段'
            }],
            evaluate:{},
            classRecord:{stage0:{}}, //课堂记录
            pingyuVo:{}, //评语
            huizongPingjiaVo:{}, //汇总评价
            activeTab:0,
            showPaint:false,
            showVedio:false,
            classActiveTab:0,
            previewImg:false,
            previewImgData:[],
            shareCourseId:""
            // classRecordArr:[{stageId:0,contentInput:'111'},{stageId:0,contentInput:'222'}]
        }
        this.submit = throttle(this.submit,2000)  //增加防抖事件
    }
    resSetState=((res)=>{
        let {classCourse, evaluate, evaluateStageVoRealList, huizongPingjiaVo, pingyuVo} = res;
        let objClass = {},recordsTab=[];
        evaluateStageVoRealList.map((item,index)=>{
            objClass['stage'+index] = item;
            recordsTab.push({title:`第${numberArr[index]}阶段`})

        })
        console.log('recordsTab',recordsTab);
        this.setState({
            recordsTab:recordsTab,
            baseInfo: classCourse || {}, //基本信息
            classRecord:objClass, //课堂记录
            pingyuVo: pingyuVo || {},
            huizongPingjiaVo: huizongPingjiaVo || {},
            evaluate:evaluate || {}
        })
    })
    componentDidMount(){
        let {pathname} = this.props.location;
        let path = pathname && pathname.split('/');
        let type = path[2]; //获取我要听课页面的类型
        let evaluateId = path[3] || ''; //获取我要听课页面的类型
        let codeEvaluateId = getCookie('codeEvaluateId');
        if(evaluateId) {
            getDetail(evaluateId).then((res) => {
                console.log("返回详情", res);
                if (res) {
                    this.resSetState(res);
                    // let {classCourse, evaluate, evaluateStageVoRealList, huizongPingjiaVo, pingyuVo} = res;
                    // let objClass = {},recordsTab=[];
                    //
                    // evaluateStageVoRealList.map((item,index)=>{
                    //     objClass['stage'+index] = item;
                    //     recordsTab.push({title:`第${numberArr[index]}阶段`})
                    //
                    // })
                    // console.log('recordsTab',recordsTab)
                    // this.setState({
                    //     recordsTab:recordsTab,
                    //     baseInfo: classCourse || {}, //基本信息
                    //     classRecord:objClass, //课堂记录
                    //     pingyuVo: pingyuVo || {},
                    //     huizongPingjiaVo: huizongPingjiaVo || {},
                    //     evaluate:evaluate || {}
                    // })
                }

            })
        }
        if(type && type=="add"){
            getMyDraftCount().then((res)=>{
                if(res && res.draftCount){
                    console.log(parseInt(res.draftCount))
                    if(parseInt(res.draftCount)>=20){
                        const alertInstance = alert('您已有20条草稿数据,不能再保存草稿', '', [
                            { text: '我知道了', onPress: () => alertInstance.close(), style: 'default' }
                        ]);
                        // Toast.info("草稿数量已超过20条",2);
                    }
                }
            })
        }
        if(codeEvaluateId){
            getShareCourseDetail(codeEvaluateId).then((res)=>{
                if (res) {
                    let {subjectName,schoolName,teacheName,stratTime,address,greadeName,className,courseType,courseName,courseClassify,shareCourseId,teacheId,schoolId} = res;
                    this.setState({
                        baseInfo: {
                            subjectName: subjectName,
                            teacheName: teacheName,
                            stratTime: stratTime,
                            address: address,
                            schoolName: schoolName,
                            greadeName: greadeName,
                            className: className,
                            courseName: courseName,
                            courseType: courseType,
                            courseClassify: courseClassify,
                            teacheId:teacheId,
                            schoolId:schoolId
                        },
                        evaluate:{
                            shareCourseId:shareCourseId,
                        }

                    })
                }
                delCookie("codeEvaluateId");
            }).catch(()=>{
                Toast.info('信息获取失败',4);
                delCookie("codeEvaluateId");
            })

        }
        getJsSDK().then((res)=>{
            console.log('res_sdk(index)',res);
            wx.config({
                beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.appId, // 必填，企业微信的corpID
                timestamp: res.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.nonceStr, // 必填，生成签名的随机串
                signature: res.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
                jsApiList: [
                    "startRecord",
                    "stopRecord",
                    "onVoiceRecordEnd",
                    "playVoice",
                    "pauseVoice",
                    "stopVoice",
                    "onVoicePlayEnd",
                    "uploadVoice",
                    "downloadVoice",
                    "onVoicePlayEnd",
                    "translateVoice",
                    "shareAppMessage",
                    "shareWechatMessage",
                    "onMenuShareAppMessage",
                    "invoke",
                ] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
            });
            // clickAudio(this);
        });
    }
    componentWillUnmount(){
        cancelRecord();
        // delCookie("codeEvaluateId");
    }
    submitData=((type)=>{
       this.submit(type)
    })

    submit = ((type)=>{
        let {baseInfo,classRecord,pingyuVo,huizongPingjiaVo,evaluate} = this.state;

        // 验证必填信息
        console.log("this.state===",this.state);
        let classRecordArr = Object.values(classRecord);
        console.log("classRecordArr",classRecordArr);
        // 保存草稿的时候不需要验证
        if(validateInfo(baseItems,baseInfo,type)){
            return false;
        }
        if(type && type =="save"){
            if(!validateOther(baseInfo,classRecord,huizongPingjiaVo)){
                return false;
            }
        }
        if(window.is_recording){
            let info = `请结束录音后再${type=="save"?'提交':'保存'}`;
            myLert(info);
            // Toast.info(info,2);
            return;
        }
        console.log('teacheId', getData('teacheId'),getData('schoolId'));

       // baseInfo.courseClassify="1";
        let tempBase = {
            ...baseInfo,
            teacheId: getData('teacheId')!=undefined? getData('teacheId') : baseInfo.teacheId,
            schoolId: getData('schoolId') !=undefined? getData('schoolId'): baseInfo.schoolId,
        };
        if(evaluate && evaluate.evaluateId){

        } else {
            evaluate.id = ""
        }
        evaluate.isEdit = type == "draft" ? "0" : "1";

       let params = {
           evaluate:evaluate,
           classCourse:tempBase, //基本信息
           evaluateStageVoRealList:classRecordArr, //课堂记录
           pingyuVo,
           huizongPingjiaVo,
       };
        Toast.loading(`${type=="draft"?'保存草稿中':'提交中'}`,0);
        saveDetail(params).then((res)=>{
            console.log('res====',res);
            if(res){
                Toast.success(`${type=="draft"?'保存草稿成功':'提交成功'}`, 4);
                if(type=="save"){
                    this.props.history.push({pathname: '/listenList',state:{type:type}})
                } else {
                    this.resSetState(res);
                    // let {classCourse, evaluate, evaluateStageVoRealList, huizongPingjiaVo, pingyuVo} = res;
                    // let objClass = {},recordsTab=[];
                    // evaluateStageVoRealList.map((item,index)=>{
                    //     objClass['stage'+index] = item;
                    //     recordsTab.push({title:`第${numberArr[index]}阶段`})
                    //
                    // })
                    // console.log('recordsTab',recordsTab);
                    // this.setState({
                    //     recordsTab:recordsTab,
                    //     baseInfo: classCourse || {}, //基本信息
                    //     classRecord:objClass, //课堂记录
                    //     pingyuVo: pingyuVo || {},
                    //     huizongPingjiaVo: huizongPingjiaVo || {},
                    //     evaluate:evaluate || {}
                    // })
                }
            }
        }).catch((error)=>{
            console.log("error==",error)
            Toast.fail('提交失败', 4);
        })
    })
    // 课堂记录的数据改变
    changeClassRecord = ((name,val,index,deleteIndex)=>{
        let data = this.state.classRecord['stage'+index] || {};
        let fileList = data.fileList || [];
        if(name == "fileList"){
            if(deleteIndex != undefined){
                fileList.splice(deleteIndex,1);
            }
            else{
                fileList = fileList.concat(val);
            }
        }
        this.setState({
            classRecord: {
                ...this.state.classRecord,
                ['stage' + index]: {
                    // ['stageId']:index,
                    ...data,
                    [name]: name == "fileList" ? fileList : val
                }
            }
        })
    })

    //改变基本信息
    changeBaseInfo = ((name,val)=>{
        this.setState({
            baseInfo:{
                ...this.state.baseInfo,
                [name]:val
            }
        })
    })

    // 基本信息/课堂记录/评语-TAB的切换
    changePage = ((index,tab)=>{
        this.setState({
            activeTab:index
        })
    })
    // 第一阶段/第二阶段-TAB的切换
    changeClassPage = ((index,tab)=>{
        this.setState({
            classActiveTab:index
        })
    })
    // 选择添加的元素元素
    showType = ((type,url)=>{
        if(type=='paint'){
            this.setState({showPaint:true})
        } else if(type=='vedio'){
            this.setState({showVedio:true,vedioUrl:url})
        }
    })

    // 添加图片/录音/等后修改state的值
    changeFile = ((name,val,index,index2,type)=>{
        if(index==1){
            this.changeClassRecord(name,val,index2,type);
        }
        else{
            this.changeComment(name,val,index,type);
        }
    })
    changeComment = ((name,val,index,deleteIndex)=>{
        let {pingyuVo,huizongPingjiaVo} = this.state;
        let data,tabName;
        if(index==3){
            tabName='huizongPingjiaVo';
            data = huizongPingjiaVo
        } else {
            tabName="pingyuVo";
            data = pingyuVo
        }
        let fileList = data.fileList || [];
        if(deleteIndex != undefined){
            fileList.splice(deleteIndex,1);
        }
        else{
            fileList = fileList.concat(val);
        }
        this.setState({
            [tabName]: {
                ...data,
                [name]:name == "fileList" ? fileList : val
            }
        })
    })
    deleteStageData = ((index,type)=>{
        let { classRecord } = this.state;
        if(type =="delete"){
            delete classRecord['stage'+index];
        }
        else {
            classRecord[`stage${index}`] = {}
        }

        this.setState({
            classRecord:classRecord
        })
    })

    setStage = ((data,index)=>{
        this.setState({
            recordsTab:data
        },()=>{
            this.setState({
                classActiveTab:index,
            })
        })
    })
    //增加阶段
    dealStage = ((index,type)=>{
        let that = this;
        let { recordsTab }= this.state;
        let newRecordsTab = formaterStageArr(recordsTab,index,type);
        if(!newRecordsTab){
            return false
        }
        if(type){ //增肌tab
            index = recordsTab.length;
            that.deleteStageData(index,"add");
            that.setStage(newRecordsTab,index)
        }
        else {
            alert('删除后信息不会保存', `您确定删除${recordsTab[index].title}吗?`, [
                { text: '取消', onPress: () => {
                }, style: 'default' },
                { text: '确定', onPress: () => {
                    that.deleteStageData(index,"delete");
                    index = index -1;
                    that.setStage(newRecordsTab,index)
                }},
            ]);

        }
    })
    showFile=((url,type,contextType)=>{
        if(type=="PICTURE"){
            let {previewImgData} = this.state;
            previewImgData.push({src:url,thumbnail:url,w: 0, h: 0, title: ''});
            if(contextType=="CONTENT_DRAW"){
                this.setState({previewImgData:previewImgData,previewImg:true,isPaint:true})
            } else {
                this.setState({previewImgData:previewImgData,previewImg:true})
            }

        } else if(type=="drawPaint"){
            // let pageType =  orients();
            // if(!pageType){
            //     Toast.info("画板功能横屏体验不佳，请换成竖屏",2);
            //     return;
            // }
            this.setState({showPaint:true})
        } else if(type=="VIDEO"){
                let vedioBox =  document.getElementById("vedioBox");
                let video =  document.getElementById("video");
                vedioBox.style.display='block';
                video.autoplay = "autoplay";
                video.src = url;
                video.load()
        }

    })
    handleClose = (()=>{
        this.setState({previewImg:false,previewImgData:[],isPaint:false})
    })
    dealPaint = ((status)=>{
        this.setState({
            showPaint:status
        })
    });
    render(){
        let {pathname} = this.props.location;
        let {evaluate} = this.state;
        let type = pathname && pathname.split('/')[2]; //获取我要听课页面的类型
        // let evaluateId = pathname && pathname.split('/')[3] || ''; //获取我要听课页面的类型
        let {evaluateId} = evaluate;
        const options = {
            showHideOpacity: true,
            // fullscreenEl: false
        };
        console.log("evaluateId",evaluateId);
        let {recordsTab,activeTab,classActiveTab,showPaint,baseInfo,classRecord,pingyuVo ,huizongPingjiaVo,showTwoCode,previewImg,previewImgData,showVedio,vedioUrl,isPaint} = this.state;
        let {courseClassify} = baseInfo;
        isResearch = courseClassify && (courseClassify.toString() == "JYK" || courseClassify.toString()=="教研课") ? true : false;
        //判断是否是教研课
        let curentData = activeTab==1?classRecord['stage'+classActiveTab]:activeTab==2?pingyuVo:huizongPingjiaVo;
        console.log('curentData===',curentData)
        curentData=curentData||{}
        curentData = curentData.fileList ? curentData.fileList : [];
        return (
            <div className={`my-lesson-page ${type=="detail"?'detail-page':''}`}>
                <div className="out-tab">
                    <Tabs className="out-tab"
                          tabs={isResearch ? lessonTab : lessonTab.slice(0,lessonTab.length-1)}
                          initialPage={0}
                          onChange={(tab, index) => {
                              console.log(tab, index)
                              // this.changePage(index,tab)
                          }}
                          onTabClick={(tab, index) => {
                              this.changePage(index,tab)
                          }}
                          swipeable={false}
                          page={activeTab}

                    >
                        <div className="tab-content tab-content-out" key={0}>
                            {/*{*/}
                                {/*type == "add" ?*/}
                                {/*<span className="add-scan" onClick={this.scanQRcode}>[ 扫一扫 ]</span>:*/}
                                {/*<span className="add-scan"></span>*/}
                            {/*}*/}
                            <BaseInfo type={type} baseInfo={baseInfo} evaluateId={evaluateId} changeBaseInfo={this.changeBaseInfo}></BaseInfo>
                        </div>
                        <div className={`tab-content class-records tab-content-out ${type && type=="detail"?'detail':''}`} key={1}>
                            <Tabs
                                tabs={recordsTab}
                                onChange={(tab2, index2) => {
                                   console.log(tab2, index2)
                                }}
                                onTabClick={(tab2, index2) => {
                                    this.changeClassPage(index2,tab2)
                                }}
                                initialPage={0}
                                page={classActiveTab}
                                swipeable={false}
                            >
                                {
                                    recordsTab.map((record,recordIndex)=>{
                                        return <div className="tab-content tab-content-in" key={recordIndex}>
                                            <SecondForm type={type} index={recordIndex} changeClassRecord={this.changeClassRecord} allData={classRecord['stage'+recordIndex]} showFile={this.showFile}></SecondForm>
                                        </div>
                                    })
                                }
                            </Tabs>
                            {
                                type && type !="detail"?
                                    <div className="add-stage-btn" onClick={()=>this.dealStage(classActiveTab,1)}>+</div>
                                    :false
                            }

                            {
                                activeTab == 1 && type && type !="detail"?
                                    (<div className="delete-state-box"><Button onClick={()=>this.dealStage(classActiveTab,0)} disabled={classActiveTab<recordsTab.length-1 || recordsTab.length==1} className="delete-state-btn"><i className="si si-com_closethin"></i>删除阶段</Button></div>)
                                    :false
                            }


                        </div>
                        <div className="tab-content tab-content-out" key={2}>
                            <Comment type={type} index={2} changeComment={this.changeComment} allData={pingyuVo} data={textItems.pingyuVo} showFile={this.showFile}></Comment>

                        </div>
                        <div className="tab-content tab-content-out" key={3}>
                            <Comment type={type} index={3} changeComment={this.changeComment} allData={huizongPingjiaVo} data={textItems.huizongPingjiaVo} showFile={this.showFile}></Comment>
                        </div>
                    </Tabs>
                </div>
                <AddElement showFile={this.showFile} changeFile={this.changeFile} index={activeTab==1 ? [activeTab,classActiveTab]:[activeTab,0]} refs={this.refs} type={type} curentData={curentData}/>

                {showPaint?<Paint show={showPaint} index={activeTab==1 ? [activeTab,classActiveTab]:[activeTab,0]} changeFile={this.changeFile} dealPaint={this.dealPaint} curentData={curentData}></Paint>:false}

                <Audio ref="audioBox"></Audio>
                <Vedio show={showVedio} vedioUrl={vedioUrl}></Vedio>
                {type && type != 'detail' ?
                    <div className="bottom-btns">
                        <Button inline onClick={()=>this.submitData('draft')} type="ghost">保存草稿</Button>
                        <Button inline onClick={()=>this.submitData('save')} type="primary">提交</Button>
                    </div> :
                    <div className="bottom-btns">
                        <Button inline onClick={()=>this.props.history.push({pathname: '/listenList'})} type="ghost">返回</Button>
                    </div>
                }
                <div  className={isPaint?'paint-img':''}>
                    <Preview
                        isOpen={previewImg}
                        items={previewImgData}
                        options={options}
                        onClose={this.handleClose}

                    />
                </div>


            </div>
        )
    }
}
export default MyLesson;
