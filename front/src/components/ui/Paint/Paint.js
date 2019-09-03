import React from 'react';
import './Paint.scss';
import {dataURItoBlob} from './PaintInit';
import {Toast,Modal} from '@mshare/mshareui';
import $ from 'jquery';
import {paintColor} from './PaintInit';
const { alert } = Modal;
import {newUploadImg} from "../../../services/edu";
import {overFileMaxLength} from '../../../utils/formater';
var s_top=0;
// 禁止滚动
function bodyScroll(event){
    event.preventDefault();
}

//禁止背景页面滚动
function unScroll(){
    s_top = $(window).scrollTop();
    document.body.addEventListener('touchmove',bodyScroll,false);
    $('body').css({'position':'fixed',"width":"100%"});
}

// 恢复背景页面滚动
function scroll(){
    document.body.removeEventListener('touchmove',bodyScroll,false);
    $("body").css({"position":"initial","height":"auto"});
    $(window).scrollTop(s_top);
}
class Paint extends React.Component{
    constructor(){
        super()
        this.state = {
            paintOpened:false,
            colorShow:false,
            show:true
        }
        this.color = "#000";
        this.weight = '2';
    }
    openPaint = (()=>{
        let {max} = this.props;
        let {paintsData} = this.state;
        if(max<paintsData){
            alert('不能添加啦');
            return;
        }
        this.setState({paintOpened:true})
    })
    selectColor = ((item,e)=>{
        e.preventDefault();
        this.color = item;
        this.weight = "2";
        this.hideColor();
    })
    eraser = (()=>{
        this.color = "#dccab6";
        this.weight = '15';
    })
    draw = (()=>{
        this.color = "#000";
        this.weight = '2';
    })
    openColor = ((e)=>{
        e.preventDefault()
        this.setState({
            colorShow:true
        })
    })
    hideColor = (()=>{
        this.setState({
            colorShow:false
        })
    })
    clearCanvas = (()=>{
        let context = this.ctx;
        let canvas = this.canvas;
        if (typeof context != 'undefined') {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.lineWidth = 2;
            context.strokeStyle = 'rgba(0,0,0,0)';
            context.fillStyle = 'rgba(0,0,0,0)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            this.color = "#000";
            this.weight="2";
            this.setState({colorShow:false})
        }
    })
    createImg = ((type)=>{
        let that = this;
        let canvas=document.getElementById("myCanvas");
        var blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        let isPaint = canvas.toDataURL() == blank.toDataURL();
        console.log('isPaint',isPaint);
        if(isPaint){
            Toast.info('当前画板暂无内容，无法保存',4);
            return;
        }
        let {curentData} = this.props;
        let isOverFileMaxLength = overFileMaxLength(curentData,'CONTENT_DRAW',20);
        // if(isOverFileMaxLength){
        //     alert('画板最多上传20张', '', [
        //         { text: '我知道了', onPress: () => {
        //             that.dealClose()
        //         }},
        //     ]);
        //     return false
        // }

        let imgUrl = canvas.toDataURL("image/png");
        let blob = dataURItoBlob(imgUrl);
        let formData = new FormData();
        formData.append('file',blob,"file_" + Date.parse(new Date()) + ".jpg");
        formData.append('mediaBizType','CONTENT_DRAW');
        let {index} = this.props;
        Toast.loading("图片生成中",0);

        newUploadImg({body:formData}).then((resUrl)=>{
            this.props.changeFile('fileList', resUrl, index[0], index[1]);
            Toast.hide();
            if (type && type == "next") {
                // let isOverFileMaxLength = overFileMaxLength(curentData,'CONTENT_DRAW',20,2);
                // if(isOverFileMaxLength){
                //     alert('画板最多上传20张', '', [
                //                 { text: '我知道了', onPress: () => {
                //                     that.dealClose()
                //                 }},
                //             ]);
                //     return;
                // }
                that.clearCanvas();
            } else {
                that.dealClose()
            }
        }).catch((error)=>{
            Toast.fail("图片生成失败",4);
        })

    })
    dealClose = (()=>{
        this.clearCanvas();
        this.props.dealPaint(false);
        window.showPaint = false;
        scroll()
    })
    closePaint =()=>{
        let that = this;
        // that.dealClose();
        alert('关闭后将不会保存', '您确定关闭吗?', [
            { text: '取消', onPress: () => {
            }, style: 'default' },
            { text: '确定', onPress: () => {
                that.dealClose()
            }},
        ]);

    }
    next = (()=>{
        this.createImg('next')
    })
    componentWillReceiveProps(nextProps){
        if(nextProps.show){
            unScroll();
        }
    }
    componentDidMount(){
        window.showPaint = true;
        let that = this;
        var canvas=document.getElementById("myCanvas");
        this.canvas = canvas;
        var paintBox = document.getElementById("paintBox");
        let bodyWidth = paintBox.clientWidth;
        let bodyHeight = paintBox.clientHeight;
        var ctx=canvas.getContext("2d");
        canvas.width = bodyWidth*0.9;
        canvas.height = bodyHeight*0.85;
        this.ctx = ctx;
        let left =bodyWidth * 0.05;
        let top =  bodyWidth * 0.18;
        canvas.top = top;
        canvas.left = left;
        canvas.addEventListener("touchstart",function(e){
            e.preventDefault();
            var touches = e.changedTouches;
            var x = touches[0].clientX-left;
            var y = touches[0].clientY-top;
            ctx.beginPath();
            ctx.lineWidth = that.weight;
            ctx.strokeStyle = that.color;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.moveTo(x, y);
        },{ passive: false })
        canvas.addEventListener("touchmove",function(e){
            e.preventDefault();

            var touches = e.changedTouches;
            var x = touches[0].clientX-left;
            var y = touches[0].clientY-top;

            ctx.lineTo(x, y);
            ctx.stroke();
        },{ passive: false });
        //松开
        canvas.addEventListener("touchend",function(e) {
            e.preventDefault();
            ctx.closePath();
        },{ passive: false })
    }
    render(){
        let {show,curentData} = this.props;
        let isOverFileMaxLength = overFileMaxLength(curentData,'CONTENT_DRAW',19);
        let {colorShow} = this.state;
        let nextBtnShow = !isOverFileMaxLength;
        return (

            <div className="paint-box"  id="paintBox" style={{display:show?'block':'none'}}>
                <div className="canvas-box">
                    <canvas className="canvas"
                        // onTouchStart={this.touchstart}
                        // onTouchMove={this.touchmove}
                        // onTouchEnd={this.touchend}
                            ref={ele=>this.canvas=ele}
                            id="myCanvas"
                    ></canvas>
                </div>

                <i className="si si-com_closethin close-btn" onClick={this.closePaint}></i>
                <table className="color-table" style={{display:colorShow?'block':'none'}}>
                    <tbody>
                    {
                        paintColor && paintColor.map((tr,i)=>{
                            return (<tr key={i} className="tr">
                                {
                                    tr&& tr.map((td,j)=>{
                                        return (<td key={j} className="td" style={{background:td}} onClick={(e)=>this.selectColor(td,e)}></td>)
                                    })
                                }
                            </tr>)
                        })
                    }
                    </tbody>
                </table>
                <ul className="all-btns">
                    <li onClick={this.eraser} className={`${nextBtnShow?'':'four-cli'}`}>橡皮擦</li>
                    <li onClick={this.draw} className={`${nextBtnShow?'':'four-cli'}`}>画笔</li>
                    <li onClick={this.openColor} className={`${nextBtnShow?'':'four-cli'}`}>字体颜色</li>
                    <li onClick={this.createImg} className={`${nextBtnShow?'':'four-cli'}`}>保存</li>
                    <li onClick={this.next} style={{display:nextBtnShow?'flex':'none'}}>下一张</li>
                </ul>

            </div>

        )
    }
}
export default Paint;
