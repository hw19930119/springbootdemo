/*
 * @(#) SchoolItem.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author liuxia
 * <br> 2019/7/23 17:19
 */
import React,{Component} from 'react';
import { List,InputItem,} from '@mshare/mshareui';
import './SchoolItem.scss'
import {schoolOption,teacherOption} from '../../../services/edu';
import {setData,removeByName} from "../../../utils/StoreUtil";
class SchoolItem extends Component {
    constructor(){
        super();
        this.state= {
            defaultList:[],//默认学校列表
            queryList:[], //查询到的符合条件的学校
            defaultValue: '',
            flag:true,//是否显示下拉框

        }

    }
    componentDidMount() {
        removeByName('schoolId');
        this.setState({
            currValue:this.props.defaultValue
        })
        schoolOption({}).then((res)=>{
            // console.log('res====学校信息',res);
            if(res && res.length > 0){
                this.setState({
                    defaultList:res
                })
            }
        })
    }

    componentWillReceiveProps(nextProps){
        // console.log("nextProps---",this.props,nextProps);
        if(this.props.defaultValue != nextProps.defaultValue){
            this.setState({
                currValue: nextProps.defaultValue
            })
        }
    }
    onChange = ((name,val)=>{
        // console.log("name====",name,val);
        let {defaultList} = this.state;
        let tempArr = [];
        for( let i in defaultList){
            if(val && defaultList[i]['value'].indexOf(val) != -1){
                tempArr.push(defaultList[i]);
            }
        }
        if(tempArr.length > 0){
            this.setState({
                queryList:tempArr,
                flag: false
            });
        }else{
            this.setState({
                flag: true
            });
        }
        setData("schoolId",'');
        this.props.changeBaseInfo(name,val)
    });
    onClick = ((name,item) =>{
        this.setState({
            [name]:item.value,
            flag: true
        });
        setData("schoolId",item.key);
        teacherOption(item.key).then((res)=>{
            console.log('res====教师信息',res);
            if(res){
                this.props.queryTeacherList(res)
            }else{
                console.log('没查到教师列表')
            }

        })
        this.props.changeBaseInfo(name,item.value)
    });

    render() {
        let {queryList,flag,currValue} = this.state;
        let {item,defaultValue,type} = this.props;
        console.log('this.props',this.props)
        let {name,title,placeholder,itemType,required} = item;
        let isHide = flag ? 'hide' : '';
        return (
            <div className="school-con">
                <InputItem
                           defaultValue={defaultValue}
                           value={currValue}
                           name={name}
                           placeholder={placeholder}
                           required={required}
                           disabled={type && type == 'detail' ? true :false}
                           onChange={val => this.onChange(name,val)}
                           itemType={itemType ? itemType : 'text'}>
                    {title}
                </InputItem>
                <div className={`school-con-hide ${isHide}`}>
                    <ul>
                        {
                            queryList && queryList.map((item,index)=>{
                                let {key,value} = item;
                                return (
                                    <li key={index} value={key} onClick={() =>this.onClick(name,item)}>{value}</li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
export default SchoolItem;
