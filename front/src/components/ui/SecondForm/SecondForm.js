import React from 'react';
import LessonText from '../LessonText/LessonText';
import {textItems} from '../../../utils/config';
import Star from '../Star/Star';
import AddFiles from '../AddFiles/AddFiles';
class SecondForm extends React.Component{
    constructor(){
        super()
    }
    changeClassRecord=((name,val,deleteIndex)=>{
        let {index} = this.props;
        this.props.changeClassRecord(name,val,index,deleteIndex)
    })
    render(){
        let {index,allData,type} = this.props;
        return (
            <React.Fragment>
                <LessonText data={textItems.contentInput} index={index} changeClassRecord={this.changeClassRecord} value={allData && allData.contentInput||''} type={type}/>
                <Star score={allData&&allData.stageLevel||0} index={index} changeClassRecord={this.changeClassRecord} type={type}></Star>
                <LessonText data={textItems.opinionInput|| ''} index={index} changeClassRecord={this.changeClassRecord} value={allData && allData.opinionInput||''} type={type}/>
                <AddFiles filesData={allData && allData.fileList ?allData.fileList: []} changeFile={this.changeClassRecord} showFile={this.props.showFile} type={type}></AddFiles>
                {/*<AddElement showType={this.showType}></AddElement>*/}
                {/*<Paint data={[1,2]} show={showPaint}></Paint>*/}

            </React.Fragment>
        )
    }
}
export default SecondForm;
