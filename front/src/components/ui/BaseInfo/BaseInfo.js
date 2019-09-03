/*
 * @(#) BaseInfo.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author liuxia
 * <br> 2019/7/22 10:19
 */
import React,{Component} from 'react';
import {baseItems} from '../../../utils/config';
import { List, InputItem,DatePicker,Picker, WhiteSpace,Toast,TextareaItem } from '@mshare/mshareui';
import {subjectTypeOption} from '../../../services/edu';
import {format} from '../../../utils/utils';
import SchoolItem from '../SchoolItem/SchoolItem';
import {CONTEXT} from "../../../config/service";
import './BaseInfo.scss';
import TeacherItem from "../TeacherItem/TeacherItem";
import * as api from '../../../services/ServiceApi';
class BaseInfo extends Component {
    constructor(){
        super();
        this.state= {
            currInfo:{
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
            },
            courseTypeData:[]
        }

    }
    componentDidMount() {
        //科目选择类别
        subjectTypeOption().then((res)=>{
            console.log("科目选择类别",res);
            let tempArr = [];
            res && res.map((item)=>{
                tempArr.push({'label':item['value'],'value':item['key']})
            })
            console.log('tempKey====',tempArr)
            this.setState({
                courseTypeData: tempArr
            })
        })
        this.setState({
            currInfo: this.props.baseInfo
        })
        // console.log("currInfo",this.state.currInfo)
    }
    componentWillReceiveProps(nextProps){
        console.log("nextProps---",this.props,nextProps);
        if(this.props.baseInfo != nextProps.baseInfo){
            this.setState({
                currInfo: nextProps.baseInfo
            })
        }
    }
    onChange = ((name,val)=>{
        console.log("name==",name,val)
        // debugger
        let str = typeof(val) == 'string' && name != 'stratTime' ? val : '';
        // if(name == "courseClassify" || name == "greadeName"){
        if(name == "courseClassify"){  //暂时年级改为手动输入
            str = val.join("");
        }
        else if(name =="stratTime"){
            str = val.format('yyyy-MM-dd hh:mm:ss');
        }
        console.log("修改之后的值",str)
        this.setState({
            [name]:str
        });
        this.props.changeBaseInfo(name,str)
    });
    onBlur = ((name,val)=>{
        console.log("name===",name,val);
    })
    queryTeacherList = (queryList)=>{
        this.setState({
            queryList:queryList
        })
    }
    renderCell = (item,index)=>{
        let {type} = this.props;
        let {currInfo,courseTypeData,queryList} = this.state;
        let data = courseTypeData;  //年级与类别的前端码表
        let isDetail = type && type == 'detail' ? true : false;
        let {name,title,placeholder,itemType,required} = item;
        if(isDetail){
            if(name=="courseClassify"){
                console.log("data===111",data,currInfo)
                data && data.map((item,i)=>{
                    console.log(item)
                    if(item.value==currInfo[name]){
                        currInfo[name]=item.label;
                    }
                })
            }
            return this.renderDetailText(title,[currInfo[name]]||'')
        }

        if(name == 'schoolName'){
            return <SchoolItem type={type} key={index} item={item} defaultValue={currInfo[name]} changeBaseInfo={this.props.changeBaseInfo} queryTeacherList={this.queryTeacherList}></SchoolItem>
        }if(name == 'teacheName'){
            return <TeacherItem type={type} key={index} item={item} queryList={queryList} defaultValue={currInfo[name]} changeBaseInfo={this.props.changeBaseInfo}></TeacherItem>
        }else if(itemType == 'select'){
            // let data = name == 'greadeName'? greadeNameData : courseTypeData;  //年级与类别的前端码表
            if(name=="courseClassify" && !currInfo[name]){
                if(data && data.length>0){
                    currInfo[name] = data[0].value
                }
            }
            return (
                <div key={index} className={isDetail ? "detail-cell" : "edit-cell"}>
                    <Picker
                            data={data}
                            cols={1}
                            name={name}
                            value={[currInfo[name]]}
                            required={required}
                            disabled={isDetail ? true :false}
                            onChange={val =>  this.onChange(name,val)}>
                        <Picker.Item>{title}</Picker.Item>
                    </Picker>
                </div>
                )

            }else if(itemType == 'date'){
                let startTimeCn = currInfo[name] ? new Date(currInfo[name].replace(/-/g,'/')) : ""; //转化为中国标准时间
                return (
                    <div key={index} className={isDetail ? "detail-cell" : "edit-cell"}>
                        <DatePicker className='date-picker'
                            value={startTimeCn}
                            name={name}
                            required={required}
                            disabled={isDetail ? true :false}
                            onChange={val => this.onChange(name,val)}>
                            <DatePicker.Item>{title}</DatePicker.Item>
                        </DatePicker>
                    </div>
                )
            }else if(name == 'subjectName' || name == 'address'){

                    return (
                        <TextareaItem key={index}
                                      defaultValue={currInfo[name]}
                                      value={currInfo[name]}
                                      name={name}
                                      title={title}
                                      placeholder={placeholder}
                                      required={required}
                                      disabled={isDetail ? true :false}
                                      autoHeight
                                      onChange={val => this.onChange(name,val)}
                                      onBlur={val=>this.onBlur(name,val)}
                        >
                            {title}
                        </TextareaItem>

                    )


        } else {
            return (
                <InputItem key={index}
                           defaultValue={currInfo[name]}
                           value={currInfo[name]}
                           name={name}
                           placeholder={placeholder}
                           required={required}
                           disabled={isDetail ? true :false}
                           onChange={val => this.onChange(name,val)}
                           onBlur={val=>this.onBlur(name,val)}
                           itemType={itemType ? itemType : 'text'}>
                    {title}

                </InputItem>
            )
        }
    }
    renderDetailText = ((name,val)=>{
        return (

                <div className="mshare-list-item mshare-input-item mshare-list-item-middle detail-text-area" key={name}>
                    <div className="mshare-list-line"><div className="mshare-input-label mshare-input-label-5">{name}</div>
                        <div className="mshare-list-required"></div>
                        <div className="mshare-input-control">
                            {val}
                        </div>
                    </div></div>
        )
    })
    render() {
        let {evaluateId} =this.props;
        let twoCodeImg = evaluateId ? `${CONTEXT}${api.edu.getShareQrImage}?page=add&evaluateId=${evaluateId}` : null;
        // console.log("twoCodeImg",twoCodeImg)
        // let noAdd = type && type!='add' ? true : false;
        return (
            <div>
                <List renderHeader={() => ''} className="no-text-list">
                    {
                        baseItems && baseItems.map((item,index) =>{
                            return this.renderCell(item,index);
                        }
                        )
                    }

                </List>
                {
                    twoCodeImg ?
                        <List renderHeader={() => '分享听课二维码'}>
                            <div className="twoCode-con">
                                <div className="twoCode-bg">
                                    {twoCodeImg ? <img src={twoCodeImg} /> : '加载二维码失败'}
                                </div>
                            </div>
                        </List> : ""
                }

            </div>
        )
    }
}
export default BaseInfo;
// export default createForm()(BaseInfo);
