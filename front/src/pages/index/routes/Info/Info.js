/*
 * @(#) Index.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author liuxia
 * <br> 2019/7/18 9:51
 */
import React,{Component} from 'react';
import './Info.scss';
import {Panel,Paragraph,Button} from '@mshare/mshareui';

class Info extends Component {

    constructor() {
        super();
        this.state = {

        };
    }

    render() {
        let title = `系统简介`;
        let content = `<p>我的听课本是基于大渡口区教委官方企业号，为听课教师提供的一个方便、快捷记录听课内容的教育小工具。</p>
<p>该系统通过协同平台和大数据平台互联互通，通过协同平台获取大数据平台的学校及教师资源，方便老师直接应用，通过协同平台将听课信息汇总至大数据平台为教委教学管理提供数据支撑。</p>`;
        return (
            <div className="info-bag">
                <div className="info-con">
                    <p className="info-title">{title}</p>
                    <div className="info-content" dangerouslySetInnerHTML={{__html:content}}></div>
                </div>
            </div>

        );
    }

}
export default Info;
