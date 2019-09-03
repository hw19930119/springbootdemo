/*
 * @(#) ListenList.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author lihui
 * <br> 2019-07-26 14:42:21
 */
import React,{Component} from "react";
import "./ListenList.scss"
import Dropdown from "../../../../components/ui/DropDown/DropDown";
import {queryEvaluate,getJsSDK} from "../../../../services/edu";
import {getCookie} from "../../../../utils/utils";

class ListenList extends Component{
    constructor(){
        super();
        this.state = {
            years:[]
        };
    }
    componentDidMount(){
        queryEvaluate().then((res)=>{
            this.setState({years:res});
            console.log("years1===",res);
        });
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
                    "shareAppMessage",
                    "shareWechatMessage",
                    "onMenuShareAppMessage",
                    "invoke",
                ] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
            });
        });
    }

    toDetail = (evaluateId,type)=>{
        if(type == "draft"){
            let teacherId = getCookie("teacherIdToken");
            this.props.history.push(`myLesson/${type}/${evaluateId}?wx=${teacherId}`);
        }else{
            this.props.history.push(`myLesson/${type}/${evaluateId}`);
        }
    };
    render(){
        let title = "我的听课记录";
        let {years} = this.state;
        return (
            <div>
                <div className="lisenList-navigation">{title}</div>
                <Dropdown data={years} toDetail={this.toDetail}/>
            </div>
        );
    }
}
export default ListenList;

