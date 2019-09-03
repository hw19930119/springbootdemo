/*
 * @(#) ProxyFactory
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author hanjb
 * <br> 2019-07-17 10:59:20
 */

package com.sunsharing.springbootdemo.remote.proxy;

import com.sunsharing.springbootdemo.configuration.ApplicationContextHelper;
import com.sunsharing.springbootdemo.configuration.ApplicationContextHelper;
import com.sunsharing.springbootdemo.remote.proxy.exception.ClassNotFoundProxyException;
import com.sunsharing.springbootdemo.configuration.properties.ConfigParam;

import java.util.HashMap;
import java.util.Map;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class ProxyFactory {

    private static final Map<String, String> proxyMap = new HashMap<>();

    private static ProxyAbstract proxyAbstract = null;

    static {
        proxyMap.put("webService", "WebserviceProxy");
        proxyMap.put("spring", "SpringProxy");
        proxyMap.put("collagen", "CollagenProxy");
    }


    public static ProxyAbstract crateProxy() throws ClassNotFoundProxyException {
        ConfigParam configParam = (ConfigParam) ApplicationContextHelper.getBean(ConfigParam.class);
        System.out.println(configParam);
        if (proxyAbstract == null) {
            Class<?> clazz;
            String proxyName = proxyMap.get(configParam.getProxyType());
            // String proxyName = "WebserviceProxy";
            try {
                clazz = Class.forName("com.sunsharing.springbootdemo.remote.proxy.impl." + proxyName);
                proxyAbstract = (ProxyAbstract) clazz.newInstance();
            } catch (Exception e) {
                throw new ClassNotFoundProxyException("没有获取到对应的代理类，请配置proxyType项");
            }
        }
        return proxyAbstract;
    }

}
