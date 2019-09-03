/*
 * @(#) total.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author lihui
 * <br> 2019-07-19 10:56:37
 */
import React,{Component} from "react";
import "./Total.scss";
import Yearselect from "../../../../components/ui/YearSelect/YearSelect";
import { Progress, Button, WingBlank, WhiteSpace } from '@mshare/mshareui';
import {getAllStatistics} from "../../../../services/edu";
// import cookie from "react-cookie"
class Total extends Component{
    constructor(){
        super();
        this.state = {
            yearStatistics:[0,0,0,0],//年度统计数组
            sevendata:0, //最近7天听课记录
            fifteendata:0, //最近15天听课记录
            thirtydata:0, //最近30天听课记录
            // percent:0, //年度任务听课百分比
            // percentName:"", //年度百分比名字
            percentNameArr:[], //选择全部是的名字数组
            percentArr:[], //选择全部时的数据数组
            percentName:"", //选择单个是的名字
            percent:0, //选择单个时的数据
            arr:0, //年度统计状态
            mark:0, //表示select传参
            data:[] //请求数据包
        };
    };
    //请求数据
    componentDidMount(){
        //将请求的数数据拆分
        //请求接口测试环境不需要传参数
        getAllStatistics().then((res)=>{
            if(res == null){
                console.log("系统内部异常");
            }else{
                console.log("getres===",res.dutySelectList);
                let [yearAll,percentArr,percentNameArr] = [[],[],[]];
                let yearSelect = res.yearSelectList[0].全部;
                yearAll.push(yearSelect.tingKeSum);
                yearAll.push(0); //讲课功能尚未实现，默认数据为0
                yearAll.push(yearSelect.tingKeCommited);
                yearAll.push(yearSelect.tingKeUnCommited);
                res.dutySelectList.map((item,index)=>{
                    percentArr.push(Object.values(item)[0]);
                    percentNameArr.push(Object.keys(item)[0]);
                });
                let recentData = res.recentEvaluateCount
                this.setState({data:res,
                                  //年度统计初始化
                                  yearStatistics:yearAll,
                                  //最近任务听课初始化
                                  sevendata:recentData.recent7Commit,
                                  fifteendata:recentData.recent15Commit,
                                  thirtydata:recentData.recent30Commit,
                                  //年度任务百分比初始化
                                  percentArr:percentArr,
                                  percentNameArr:percentNameArr,
                              });
            }
        })
    }
    //子组件向父组件传值方法
    Rfn(data){
        this.setState({yearStatistics:data},()=>{});
    };
    Lfn(data,name){
        let a = typeof data+"";
        if(a == "object"){
            this.setState({arr:0});
            this.setState({percentArr:data,percentNameArr:name})
        }else{
            this.setState({arr:1});
            this.setState({percent:data,percentName:name},()=>{});
        }
    };

    render(){
        let {yearStatistics,percentName,percent,sevendata,fifteendata,thirtydata,mark,data,percentNameArr,percentArr,arr} = this.state;
        let [info,title,selectTileOne,selectTileTwo] = ["统计时间为当前时间前一天","最近提交的我的听课情况","统计年度","完成听课任务"];
        //年度统计数据
        let cont = [
            {name : "听课记录总条数",con:yearStatistics[0]},
            {name : "讲课记录总条数",con:yearStatistics[1]},
            {name : "已提交听课记录",con:yearStatistics[2]},
            {name : "未提交听课记录",con:yearStatistics[3]}
        ];
        return (
            <div className="bigBox">
                {/*我的听课统计标题*/}
                <div className="to-title"><div><span>i</span>{info}</div></div>
                {/*年度统计*/}
                <div className="ys-content">
                    <div className="ys-title">{selectTileOne}</div>
                    <Yearselect data={data} R_fn={this.Rfn.bind(this)} mark={mark}/>
                    <div className="ys-conten">
                        <div className="ys-cont">
                        {
                            cont && cont.map((item,index) => {
                                let {name,con} = item;
                                return(
                                    <div key={index}>
                                        <span>{con}</span>
                                        <span>{name}</span>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                </div>
                {/*最近听课记录*/}
                <div className="recentrecord">
                    <div className="rr-title">{title}</div>
                    <div className="rr-seven">最近<span> 7 </span>天您提交了<span> {sevendata} </span>条听课记录</div>
                    <div className="rr-fifteen">最近<span> 15 </span>天您提交了<span> {fifteendata} </span>条听课记录</div>
                    <div className="rr-thirty">最近<span> 30 </span>天您提交了<span> {thirtydata} </span>条听课记录</div>
                </div>
                {/*完成听课任务*/}
                <div className="listeningtask">
                    <div className="lt-title">{selectTileTwo}</div>
                    <Yearselect title={selectTileTwo} data={data} L_fn={this.Lfn.bind(this)}/>
                    {
                        arr == 0 ?
                        percentNameArr && percentNameArr.map((item,index)=>{
                            return (
                                <div className="lt-percent" key={index}>
                                    <div className="lt-time">{item}</div>
                                    <div className="progress-container">
                                        <WhiteSpace size="lg" />
                                        <Progress size="lg" text percent={percentArr[index]} position="normal" />
                                    </div>
                                </div>
                            )
                        }):
                        <div className="lt-percent">
                            <div className="lt-time">{percentName}</div>
                            <div className="progress-container">
                                <WhiteSpace size="lg" />
                                <Progress size="lg" text percent={percent} position="normal" />
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}
export default Total;
