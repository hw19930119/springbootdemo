import React from 'react';
import './Vedio.scss';
class Vedio extends React.Component{
    constructor(){
        super()
    }
    componentDidMount(){
        let vedioBox = document.getElementById("vedioBox");
        let videoClose = document.getElementById("videoClose");
        let video = document.getElementById("video");
        videoClose.addEventListener("click",function(){
            video.pause();
            vedioBox.style.display="none";
        })
    }
    render(){
        // let {show,vedioUrl} = this.props;
        return (
        <div className="vedio-box"  id="vedioBox" style={{display:'none'}}>
            <video  src="" controls x-webkit-airplay="true" webkit-playsinline="true" autoPlay id="video">
                {/*<source src="" type="video/mp4"  id="source"/>*/}
            </video>
            <div className="close-vedio" id="videoClose">
                <i className="si si-com_closethin"></i>
            </div>
        </div>
        )
    }
}
export default Vedio;
