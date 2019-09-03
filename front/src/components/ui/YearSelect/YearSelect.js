/*
 * @(#) Yearselect.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author lihui
 * <br> 2019-07-22 11:36:02
 */
import React,{Component} from "react";
import "./YearSelect.scss";
import {getCookie} from "../../../utils/utils";
class Yearselect extends Component{
    constructor(){
        super();
        this.state = {
            selectName:[],//年度统计下来框
            selectNamePercent:[],//完成听课任务的select下拉框
            //一下数组表示当前情况下所有查询结果的集合
            listentitle:[],//听课记录总条数
            listensubmit:[],//已提交听课记录
            teachtitle:[],//讲课记录总条数
            nolistensubmit:[],//未提交听课记录
            dutyPercent:[],//听课百分比
            selectValueOne:"", //页面渲染需要select值
        };
    }
    //组件初始化时不调用，组件接受新的props时调用。
    componentWillReceiveProps(nextProps){
        if(this.props != nextProps){
            let {data} = nextProps;
            let [yearSelectArr,dutySelectArr,tingKeSumArr,tingKeComArr,tingKeUnComArr,jiangKeSum,dutyPercentArr] = [[],[],[],[],[],[],[]];
            data.yearSelectList.map((item,index)=>{
                yearSelectArr.push(Object.keys(item)[0]);
                tingKeSumArr.push(Object.values(item)[0].tingKeSum);
                tingKeComArr.push(Object.values(item)[0].tingKeCommited);
                tingKeUnComArr.push(Object.values(item)[0].tingKeUnCommited);
                jiangKeSum.push(0);
            });
            data.dutySelectList.map((item,index)=>{
                dutySelectArr.push(Object.keys(item)[0]);
                dutyPercentArr.push(Object.values(item)[0]);
            });
            this.setState({
                            selectName:yearSelectArr,
                            selectNamePercent:dutySelectArr,
                            listentitle:tingKeSumArr,
                            listensubmit:tingKeComArr,
                            teachtitle:jiangKeSum,
                            nolistensubmit:tingKeUnComArr,
                            dutyPercent:dutyPercentArr,
                            selectValueOne:Object.keys(data.yearSelectList[0])[0],
                          });
        }
    }

    //select改变事件向父级传值
    onchange(e){
        //统计年度数据返回
        let {mark} = this.props;
        if(mark == 0){
            let R_arr = [];
            R_arr.push(this.state.listentitle[e.target.value]);
            R_arr.push(this.state.teachtitle[e.target.value]);
            R_arr.push(this.state.listensubmit[e.target.value]);
            R_arr.push(this.state.nolistensubmit[e.target.value]);
            this.props.R_fn(R_arr);
            console.log("afdafdafasdfasfdsad",this.state.selectName[e.target.value]);
            this.setState({selectValueO:this.state.selectName[e.target.value]},()=>{console.log("设置成功")});

        }else{
            //完成听课任务数据返回
            if(e.target.value > -1){
                let L_arr = this.state.dutyPercent[e.target.value];
                let L_selectName = this.state.selectNamePercent[e.target.value];
                this.props.L_fn(L_arr,L_selectName);
                this.setState({selectValueT:this.state.selectNamePercent[e.target.value]});
            }else{
                let L_arr = this.state.dutyPercent;
                let L_selectName = this.state.selectNamePercent;
                this.props.L_fn(L_arr,L_selectName);
                this.setState({selectValueT:"全部"});
            }
        }
    }
    render(){
        let {selectName,selectNamePercent,selectValueOne,selectValueO,selectValueTwo,selectValueT} = this.state;
        let {mark} = this.props;
        let SchoolName = getCookie('schoolZoneName');
        return (
            <div className="ys-yearcont">
                {
                    mark == 0?
                    <div className="ys-show"><span>{selectValueO?selectValueO:selectValueOne}</span><span className="i-icon"><i className="si si-com_angleright"></i></span></div>:
                    <div className="ys-show"><span>{selectValueT?selectValueT:"全部"}（{SchoolName}）</span><span className="i-icon"><i className="si si-com_angleright"></i></span></div>
                }
                <select onChange={this.onchange.bind(this)}>
                    {mark == 0?<option style={{display:"none"}}></option>:<option value="-1">全部</option>}
                    {
                        mark == 0?
                        selectName && selectName.map((item,index) => {
                            return (
                                <option value={index} key={index}>{item}</option>
                            )
                        }):
                        selectNamePercent && selectNamePercent.map((item,index) => {
                           return (
                               <option value={index} key={index}>{item}</option>
                           )
                       })
                    }
                </select>
            </div>
        )
    }
}
export default Yearselect;
