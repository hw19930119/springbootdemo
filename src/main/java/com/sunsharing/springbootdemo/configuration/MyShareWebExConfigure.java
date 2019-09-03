/*
 * @(#) MyShareWebExConfigure
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author hanjb
 * <br> 2019-06-27 19:07:36
 */

package com.sunsharing.springbootdemo.configuration;

import com.sunsharing.share.webex.ShareWebExConfigure;
import com.sunsharing.share.webex.annotation.EnableShareAdvice;

import org.springframework.context.annotation.Configuration;

/**
 * Created by wucx on 2017/9/21.
 */
// 不能直接加载EnableWebMvc下，会无效
@Configuration
@EnableShareAdvice
public class MyShareWebExConfigure extends ShareWebExConfigure {

    @Override
    public boolean isDev() {
        // 返回false异常信息不会在浏览器显示正式环境建议设置为false
        return true;
    }
}
