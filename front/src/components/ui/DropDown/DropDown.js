/*
 * @(#) dropdown.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author lihui
 * <br> 2019-07-19 14:28:21
 */
import React,{Component} from 'react';
import './DropDown.scss'
import { Accordion, List } from '@mshare/mshareui';
import Recordlist from '../RecordList/RecordList';
class Dropdown extends React.Component{
    constructor(){
        super();
        this.state = {

        };
    }
    onChange = (key) => {

    };
    toDetail = (evaluateId,type) => {
        this.props.toDetail(evaluateId,type);
    };
    render(){
        let {data} = this.props;
        console.log("data===",data);
        let yearName = data ? Object.keys(data).reverse() : [];
        let yearValue = data ? Object.values(data).reverse() : [];
        console.log("yearName===",yearName);
        return (
            <div className="dropdown-con">
                <div className="mid-wire"></div>
                <Accordion defaultActiveKey="0" accordion  className="my-accordion" onChange={this.onChange}>
                    {
                        yearName && yearName.map((item,index) =>{
                            return (
                                <Accordion.Panel key={index} header={item}>
                                    <List className="my-list">
                                        <Recordlist data={yearValue[index]} toDetail={this.toDetail}/>
                                    </List>
                                </Accordion.Panel>
                            )
                        })
                    }
                </Accordion>
            </div>
        )
    }
}
export default Dropdown;

