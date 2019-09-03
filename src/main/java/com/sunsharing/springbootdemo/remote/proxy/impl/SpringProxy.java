/*
 * @(#) SpringProxy
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author hanjb
 * <br> 2019-07-17 10:59:20
 */

package com.sunsharing.springbootdemo.remote.proxy.impl;

import com.sunsharing.springbootdemo.configuration.ApplicationContextHelper;
import com.sunsharing.springbootdemo.remote.proxy.ProxyAbstract;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class SpringProxy implements ProxyAbstract {

    @Override
    public <T> T getProxy(Class clazz, String service) {
        return (T) ApplicationContextHelper.getBean(clazz);
    }

}
