import React from 'react';
import { Icon,Popover,Toast} from '@mshare/mshareui';
import './AddElement.scss';
// import '../../../utils/audio';
import {clickAudio } from '../../../utils/audio';
import {uploadVideo} from "../../../services/edu";
import {saveImg} from "../../../utils/formater";
import {overFileMaxLength} from "../../../utils/formater";

const creatImg = src => <img src={require(`../../../assets/images/${src}.png`)}></img>;
class AddElement extends React.Component{
    constructor(){
        super()
        this.state = {
            visible: false,
            selected: '',
            display:false
        }
    }
    showAddFile = (()=>{
        this.setState({
            display:true
        })
    })
    hideAddFile = (()=>{
        this.setState({
            display:false
        })
    })
    componentWillReceiveProps(nextProps){
        if(this.props.index.toString() != nextProps.index.toString()){
            this.setState({
                display:false
            })
        }
    }
    changeImg = ((e)=>{
        e.stopPropagation();
        this.hideAddFile();
        let {curentData} = this.props;

        let that = this;
        let files = e.target.files;
        if(files.length <= 0)return;
        if(files.length > 5){
            Toast.info("一次最多只能上传5张图片",4);
            return;
        }
        let isOverFileMaxLength = overFileMaxLength(curentData,'OPTIONS_ADDRESS',20,files.length);
        if(isOverFileMaxLength){
            Toast.info('图片最多上传20张',4);
            return false
        }

        let {index} = this.props;
        var count = files.length - 1;
        Toast.loading("图片上传中",0);
        for (var i = 0; i < files.length; i++) {
            var file = files.item(i);
            //验证是否为图片，不是就跳出循环
            if (!(/^image\/.*$/i.test(file.type))) {
                Toast.info("请选择图片",4);
                continue;
            }
            saveImg(file,count,i).then((res)=>{
                if(res){
                    that.props.changeFile('fileList',res,index[0],index[1]);
                }

            })
        }
    })
    componentDidMount(){
        let that = this;
        clickAudio(this);
        let page = document.getElementsByClassName('my-lesson-page ')[0];
        page.addEventListener('click',function(){
            if(that.state.display){
                that.hideAddFile();
            }

        })
    }
    changeVideo= ((e)=>{
        e.stopPropagation();
       this.hideAddFile();
        let {curentData} = this.props;
        let isOverFileMaxLength = overFileMaxLength(curentData,'VIDEO_ADDRESS');
        if(isOverFileMaxLength){
            Toast.info('视频最多上传20个',4);
            return false
        }
        let {index} = this.props;
        let that = this;
        let files = e.target.files;
        let file = files[0];
        var fileName = file.name;
        var suffix = fileName.substring(fileName.lastIndexOf(".")+1, fileName.length);
        suffix = suffix.toLocaleUpperCase();
        var suffixs = ["MP4","MOV"];
        if(suffixs.indexOf(suffix) == -1){//只能上传MP4文件，后续可以添加
            Toast.info("只能上传mp4或者mov格式的视频文件",4)
            return;
        }
        if(file.size > 20971520){
            Toast.info('视频文件不能超过20M',4);
            return;
        }
        var formData = new FormData();
        formData.append("videoFile",file);
        Toast.loading("视频上传中",0);
        uploadVideo({body:formData}).then((res)=>{
            Toast.hide();
            if(res){
                that.props.changeFile('fileList',res,index[0],index[1]);
            }

        }).catch((error)=>{
            Toast.fail('上传失败',4);
        })
    })
    openPaint=((e)=>{
        e.stopPropagation();
        // event.stopPropagation();
        this.hideAddFile();
        let {curentData} = this.props;
        let isOverFileMaxLength = overFileMaxLength(curentData,'CONTENT_DRAW',20);
        if(isOverFileMaxLength){
            Toast.info('画板最多上传20张',4);
            return false
        }
        this.props.showFile("",'drawPaint')
    })
    render(){
        let {display} = this.state;
        let {index,type} = this.props;
        return (
            <div className="add-element" ref="addElement" style={{display:index[0]==0 || type=="detail"?'none':'block'}}>
                {/*<ul className="all-element" >*/}
                <form id="myForm">
                <ul className="all-element" style={{"display":display?'block':'none'}}>
                    <li><input type="file" accept="image/*" multiple="multiple" id="uploadImg" onChange={this.changeImg}></input></li>
                    {/*录音*/}
                    <li id="start-audio" className="start-audio">{creatImg('btn_audio')}</li>
                    {/*视频*/}
                    <li><input  type="file" accept="video/*"  onChange={this.changeVideo}></input></li>
                    {/*<li onClick={()=>this.props.showType('paint')}>{creatImg('btn_paint')}</li>*/}
                    <li onClick={this.openPaint}>{creatImg('btn_paint')}</li>
                    <li className={`add-close-btn si si-com_closethin ${display?'active':''}`} onClick={this.hideAddFile}></li>
                </ul>
                </form>
                <div className="add-file-btn" onClick={this.showAddFile} style={{"display":!display?'block':'none'}}>+</div>
            </div>
        )
    }
}
export default AddElement;
