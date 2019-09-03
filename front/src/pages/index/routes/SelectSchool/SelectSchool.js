import React from 'react';
import { List, Radio ,Button,Toast} from '@mshare/mshareui';
import {getCookie,setCookie} from "../../../../utils/utils";
import './SelectSchool.scss';
import {getOrguserlist} from "../../../../services/edu";
const { RadioItem } = Radio;
class SelectSchool extends React.Component{
    constructor(){
        super()
        this.state = {
            school:{},
            schoolList:[]
        }
    }
    onChange = value => {
        console.log(value);
        this.setState({
            school:value,
        });
    };
    componentDidMount(){
        let that = this;
        let teacherId = getCookie('teacherIdToken');
        getOrguserlist(teacherId).then((res)=>{
            let schoolList =[]
            let list = res.orgUserVoList;
            list && list.map((item)=>{
                schoolList.push({
                    schoolId:item.schoolId,
                    label:item.schoolZoneName,
                    ouId:item.ouId
                })
            })
            that.setState({
                schoolList:schoolList,
                school:schoolList[0]
            })
        })
    }
    submit =(()=>{
        let {school} = this.state;
        setCookie("ouIdToken",school.ouId);
        setCookie("schoolIdToken",school.schoolId);
        setCookie("schoolZoneName",school.label);
        let codeEvaluateId = getCookie('codeEvaluateId');
        let teacherId = getCookie("teacherIdToken");
       if(codeEvaluateId){
           this.props.history.push(`/myLesson/add/?wx=${teacherId}`)
       } else {
           this.props.history.push({pathname: '/'})
       }

    })
    render(){
        const { school,schoolList } = this.state;
        return (
            <div className="select-school">
                <List renderHeader={() => '选择学校'}>
                    {schoolList.map(i => (
                        <RadioItem key={i.schoolId} checked={school.schoolId === i.schoolId} onChange={() => this.onChange(i)}>
                            {i.label}
                        </RadioItem>
                    ))}
                </List>
                <div className="bottom-btn">
                    <Button inline onClick={this.submit} type="primary">确定</Button>
                </div>

            </div>
        )
    }

}
export default SelectSchool;
