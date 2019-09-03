import React from 'react';
import LessonText from '../LessonText/LessonText';
import AddFiles from '../AddFiles/AddFiles';
class Comment extends React.Component{
    constructor(){
        super()
        this.state = {
            showPaint:false
        }
    }
    changeClassRecord=((name,val,deleteIndex)=>{
        let {index} = this.props;
        this.props.changeComment(name,val,index,deleteIndex)
    })
    showType = ((type)=>{
        if(type=='paint'){
            this.setState({showPaint:true})
        }
    })
    render(){
        let {index,allData,data,type} = this.props;
        return (
            <React.Fragment>
                <LessonText type={type} data={data} index={index} changeClassRecord={this.changeClassRecord} value={allData && allData.contentInput||''}/>
                <AddFiles filesData={allData && allData.fileList ?allData.fileList: []} changeFile={this.changeClassRecord} showFile={this.props.showFile} type={type}></AddFiles>

            </React.Fragment>
        )
    }
}
export default Comment;
