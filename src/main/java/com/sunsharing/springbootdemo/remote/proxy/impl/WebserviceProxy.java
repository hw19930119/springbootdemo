/*
 * @(#) WebserviceProxy
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author hanjb
 * <br> 2019-07-17 10:59:20
 */

package com.sunsharing.springbootdemo.remote.proxy.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.sunsharing.springbootdemo.remote.proxy.ProxyAbstract;
import com.sunsharing.springbootdemo.remote.proxy.client.CallWebserviceClient;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class WebserviceProxy implements ProxyAbstract {
    @Override
    public <T> T getProxy(Class clazz, String service) {
        InvocationHandler handler = new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                CallWebserviceClient client = new CallWebserviceClient();
                String paramJsonStr = JSON.toJSONString(args, SerializerFeature.WriteMapNullValue);
                log.info("远程调用serviceName = " + service);
                String resultJSON = client.service(service, method.getName(), paramJsonStr);
                log.info("远程调用返回结果 = " + resultJSON);
                JSONObject resultObject = JSON.parseObject(resultJSON);
                if (!resultObject.getBoolean("status")) {
                    throw new RuntimeException("远程获取数据异常：" + resultObject.getString("result"));
                }
                return JSON.parseObject(resultObject.getString("result"), method.getGenericReturnType());
            }
        };
        T t = (T) Proxy.newProxyInstance(WebserviceProxy.class.getClassLoader(), new Class[]{clazz}, handler);
        return t;
    }
}
