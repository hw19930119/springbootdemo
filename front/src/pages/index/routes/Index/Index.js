/*
 * @(#) Index.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author liuxia
 * <br> 2019/7/18 9:51
 */
import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import './Index.scss';
import {Panel, Paragraph, Modal, Button, WhiteSpace, WingBlank, Toast} from '@mshare/mshareui';
import {getCookie} from "../../../../utils/utils";

const { alert } = Modal;
class Index extends Component {
    constructor() {
        super();
        this.state = {
            sHeight:document.body.scrollHeight,
            flag:''
        };
        this.toPage = this.toPage.bind(this);
    }
    componentDidMount(){
        window.onorientationchange = this.readDeviceOrientation;
    }

    readDeviceOrientation =()=> {
        if (Math.abs(window.orientation) === 90) {
            this.setState({
                sHeight:document.body.scrollHeight,
                flag:'1'
            });
        } else {
            this.setState({
                sHeight:document.body.scrollHeight,
                flag: '0'
            });
        }
    };

    //点击事件跳转路由
    toPage(path){
        this.props.history.push(path);
    }

    //未开通功能点击提示语句
    showAlert = () => {
        const alertInstance = alert('该功能尚未开通！', '请耐心等待', [
        ]);

        setTimeout(() => {
            // 可以调用close方法以在外部close
            console.log('auto close');
            alertInstance.close();
        }, 1000);
    };
    render() {
        let {flag,sHeight} = this.state;
        let id = '',type='add';
        let data = [
            {name:'简介',subTitle:'Brief Introduction',pic:'',path:'/info'},
            {name:'讲课信息发布',subTitle:'Info Delivery',pic:'',path:'/publish'},
            {name:'我的讲课记录',subTitle:'Lecture record',pic:'',path:'/publishList'},
            {name:'我的听课记录',subTitle:'Lecture record',pic:'',path:'/listenList'},
            {name:'统计',subTitle:'Statistics',pic:'',path:'/total'},
            // {name:'我要听课',subTitle:'My I-textbook',pic:'',path:'/myLesson'},
        ];
        let icon = ["si si-app_rztj-51","si si-app_ywh","si si-app_zzyw","si si-app_xqjm","si si-app_bjsl"];
        //获取cookie
        let teacherId = getCookie("teacherIdToken");
        return (
            <div className="index-wrapper" key={flag} style={{height:sHeight}}>
                    <div className="index-left">
                        {
                            data && data.map((item,index) =>{
                                let {name,path} = item;
                                //未开通功能if语句
                                if(index === 1||index === 2){
                                    return (
                                        <div key={index} onClick={this.showAlert.bind(this)}>{name}</div>
                                    )
                                }else{
                                    return (
                                        <div key={index} onClick={()=>this.toPage(path)}>{name}</div>
                                    )
                                }
                            })
                        }
                    </div>
                    <div className="index-middle">
                        <img src={require("../../../../assets/images/homepageTwo.png")}/>
                    </div>
                    <div className="index-right">
                        {
                            data && data.map((item,index) =>{
                                let {subTitle,path} = item;
                                if(index === 1||index === 2){
                                    return (
                                        <div key={index} onClick={this.showAlert.bind(this)}>{subTitle}<i className={icon[index]}></i></div>
                                    )
                                }else{
                                    return (
                                        <div key={index} onClick={()=>this.toPage(path)}>{subTitle}<i className={icon[index]}></i></div>
                                    )
                                }

                            })
                        }
                    </div>
                    <div className="text-bottom">
                        <div>
                            <div onClick={()=>this.toPage(`/myLesson/${type}/${id}?wx=${teacherId}`)}>
                                <div>我要听课</div>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }

}
// export default Index;
export default withRouter(Index);
