/*
 * @(#) Prevent.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author lihui
 * <br> 2019-08-06 17:04:43
 */
import React,{Component} from "react";
import "./Prevent.scss"
class Prevent extends Component{
    constructor(){
        super();
        this.state = {

        }
    }
    render(){
        return (
            <div className="box">
                <div className="boximg">!</div>
                <h3 className="boxtext">呃...您无法访问该页面！</h3>
                <h3 className="boxtextqy">如果您是企业用户请从企业入口进入</h3>
            </div>
        )
    }
}
export default Prevent;

