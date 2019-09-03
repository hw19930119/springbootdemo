import React from 'react';
import './Audio.scss';
class Audio extends React.Component{
    constructor(){
        super()
    }
    componentDidMount(){
    }
    render(){
        return (
            <div className="audio-box clearfloat" style={{display:'none'}} id="audio-box">
                <div className="left"><span>录制时长：</span><span className="audio-time" id="showTimeAudio">00:00:00</span></div>
                <div className="right"><span id="pause">暂停</span><span id="end">结束</span></div>
            </div>
        )
    }
}
export default Audio;
