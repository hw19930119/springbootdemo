/*
 * @(#) Recordlist.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author lihui
 * <br> 2019-07-19 15:03:31
 */
import React,{Component} from  'react';
import './RecordList.scss';
import { Button, List, Modal, WhiteSpace, WingBlank, Toast, ActionSheet} from '@mshare/mshareui';
import {deleteDetail,shareFootprintCircle} from "../../../services/edu";
const { alert } = Modal;
import {getJsSDK} from "../../../services/edu";
import getPicture from "../../../assets/images/zhujuquan.jpg";
//分享
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}
class RecordList extends React.Component{
    constructor(){
        super();
        this.state = {
            clicked: 'none',
            data:[]
        }
    }

    componentWillMount(){
        this.setState({data:this.props.data});
        getJsSDK().then((res)=>{
            console.log('res_sdk(record)',res);
        })
    };

    //删除点击事件
    showAlert = (e,id) => {
        // 阻止合成事件间的冒泡
        e.stopPropagation();
        let {data} = this.state;
        const alertInstance = alert('删除', '您确定删除吗?', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => {
                //请求删除数据库接口
                deleteDetail(id).then((res)=>{
                    console.log("删除成功",res);
                    if(res===1){
                        //删除确定按钮
                        data.map((item,index)=>{
                            if(item.evaluateId == id){
                                //splice返回的是被删除元素
                                data.splice(index,1);
                                this.setState({data:data});
                            }
                        });
                        Toast.success('删除成功', 4);
                    }else{
                        Toast.fail('删除失败', 4);
                    }
                })
            } },
        ]);
        setTimeout(() => {
            // 可以调用close方法以在外部close
            console.log('auto close');
            alertInstance.close();
        }, 500000);
        setTimeout(() => {
            Toast.hide();
        }, 300);
    };

    //分享
    dataList = [
        { url: 'umnHwvEgSyQtXlZjNJTt', title: '微信好友' },
        { url: '', title: '企业微信'},
        { url: 'cTTayShKtEIdQVEMuiWt', title: '足迹圈' },
    ].map(obj => ({
        icon: obj.url==''?<img src={getPicture} style={{ width: 36,height:36 }} />:<img src={`https://gw.alipayobjects.com/zos/rmsportal/${obj.url}.png`} alt={obj.title} style={{ width: 36 }} />,
        title: obj.title,
    }));
    showShareActionSheet = (id,event) => {
        // 阻止合成事件间的冒泡
        event.stopPropagation();
        let url = location.href.split('#')[0];
        ActionSheet.showShareActionSheetWithOptions({
            options: this.dataList,
            // title: 'title',
            message: '请选择以下分享内容',
        },
        (buttonIndex) => {
            this.setState({ clicked: buttonIndex > -1 ? this.dataList[buttonIndex].title : 'cancel' });
            //分享微信好友
            if(buttonIndex == 0){
                // console.log("ready====","aaaaaaaa");
                // alert("点击有效");
                // alert(window.navigator.userAgent);
                if(window.navigator.userAgent.indexOf("wxwork") < 0){
                    alert("使用企业微信app打开才能分享");
                }else {
                    wx.ready(function(){
                        // alert("执行开始");
                        wx.invoke(
                            "shareWechatMessage", {
                                title: '我的分享', // 分享标题
                                desc: '听课记录', // 分享描述
                                link: `${url}#/myLesson/detail/${id}`, // 分享链接
                                imgUrl: `${getPicture}` // 分享封面
                            }, function(res) {
                                // alert("执行回调函数",res);
                            }
                        );
                        // alert("执行完成");
                    })
                }
            }
            //分享到企业微信
            if(buttonIndex == 1){
                // alert("点击有效");
                if(window.navigator.userAgent.indexOf("wxwork") < 0){
                    alert("使用企业微信app打开才能分享");
                }else{
                    wx.ready(function(){
                        // alert("执行开始");
                        wx.invoke(
                            "shareAppMessage", {
                                title: '我的分享', // 分享标题
                                desc: '听课记录', // 分享描述
                                link: `${url}#/myLesson/detail/${id}`, // 分享链接
                                imgUrl: `${getPicture}` // 分享封面
                            }, function(res) {
                                // alert("执行回调函数",res);
                            }
                        );
                    });
                    // alert("执行完成");
                }
            }
            //分享足迹圈
            if(buttonIndex == 2){
                console.log("id===",id);
                Toast.loading('分享到足迹圈中',0);
                shareFootprintCircle(id).then((res)=>{
                    if(res && res.status=='1200'){
                        Toast.success(res.message,4);
                    } else {
                        Toast.fail(res.message,4);
                    }
                }).catch((error)=>{
                    Toast.fail('分享失败',4)
                })
            }
            // return new Promise((resolve) => {
            //     // Toast.info('closed after 1000ms');
            //     setTimeout(resolve, 100);
            // });
        });
    };

    // 跳转详情
    toDetail = (evaluateId,isEdit) =>{
        let type = isEdit === '0' ? 'draft':'detail'; // =0 草稿状态； =1 详情状态
        this.props.toDetail(evaluateId,type)
    };

    render(){
        let {data} = this.state;
        return(
            <div className="recordlist-after">
                {

                    data && data.map((item,index)=>{
                        let {evaluateId,subjectName,teacheName,stratTime,isEdit} = item;
                        return(
                            <div className="rl-box" key={index}>
                                {
                                    isEdit==="0" ?
                                        <span className="sign-icon rl-signOne"></span> :
                                        <span className="sign-icon rl-signTwo"></span>
                                }
                                <div className="rl-index">
                                    <div className="rl-name">{subjectName}</div>
                                    <div className="rl-people"><span>讲课人：</span>{teacheName}{isEdit==="0"?<span className="rl-draft">草稿</span>:""}</div>
                                    <div className="rl-time"><span>时间：</span>{stratTime}</div>
                                    <div className="rl-button">
                                        {
                                            isEdit=="0"?
                                            <div className="rl-icon">
                                                <i className="si si-com_edit"></i>
                                                <button onClick={()=>this.toDetail(evaluateId,isEdit)}>编辑</button>
                                                <i className="si si-com_delete"></i>
                                                <button onClick={(e) =>this.showAlert(e,evaluateId)}>删除</button>
                                            </div>:
                                            <div className="rl-icon">
                                                <i className="si si-com_link"></i>
                                                <button onClick={this.showShareActionSheet.bind(this,evaluateId)}>分享</button>
                                                <i className="si si-com_filetexto"></i>
                                                <button onClick={()=>this.toDetail(evaluateId,isEdit)}>查看详情</button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        )

                    })
                }
            </div>
        )
    }
}
export default RecordList;

