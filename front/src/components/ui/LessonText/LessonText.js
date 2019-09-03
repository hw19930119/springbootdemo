import React from 'react';
import { List, TextareaItem,Toast } from '@mshare/mshareui';
import './LessonText.scss';
class LessonText extends React.Component{
    constructor(){
        super();
        this.state ={
            hasError:false
        }
    }
    onChange= ((count,value)=>{
        let {name} = this.props.data;
        if(value.length <= count){
            this.props.changeClassRecord(name,value);
        }

    })

    render(){
        let {hasError} = this.state;
        const {data,value,type} = this.props;
        const {title,placeholder='',row,count} = data;
        return (
            <div className="lesson-text">
                <List renderHeader={() => title} className={!title?'no-text-list':''}>

                            <TextareaItem
                            defaultValue={value||''}
                            error={hasError}
                            required={true}
                            autoHeight
                            editable={type && type == 'detail' ? false :true}
                            // style={{"minHeight":`${row}*100px`}}
                            // disabled={type && type == 'detail' ? true :false}
                            count={count?count:''}
                            onChange={val => this.onChange(count,val)}
                            placeholder={type && type=="detail" ? "":placeholder}
                        />
                    <span className="mshare-textarea-count"><span>{value.length>0? value.length: '0'}</span>/{count}</span>


                    {/*<div class="mshare-list-item mshare-textarea-item mshare-textarea-disabled mshare-textarea-has-count">*/}
                        {/*<div class="mshare-list-line">*/}
                            {/*<div class="mshare-textarea-control">*/}
                                {/*{value}*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}

                    {/*{*/}
                        {/*hasError && (<div style={{ color: 'red' }}>*/}
                            {/*{(getFieldError(name) || []).join(', ')}*/}
                        {/*</div>)*/}
                    {/*}*/}

                </List>

            </div>
        )
    }
}
export default  LessonText;
