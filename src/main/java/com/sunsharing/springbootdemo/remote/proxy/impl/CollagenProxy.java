/*
 * @(#) CollagenProxy
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
import com.sunsharing.springbootdemo.remote.proxy.client.CollagenClient;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class CollagenProxy implements ProxyAbstract {

    public CollagenProxy() {
    }

    @Override
    public <T> T getProxy(Class clazz, String service) {
        InvocationHandler handler = new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                CollagenClient client = new CollagenClient();
                String paramJsonStr = JSON.toJSONString(args, SerializerFeature.WriteMapNullValue);
                log.info("serviceName = " + service);
                String resultJSON = client.callCollagen(service, method.getName(), paramJsonStr);
                log.info("协同平台返回结果 = " + resultJSON);
                //JSONObject resultObject = JSON.parseObject(parseXmlToResult(resultJSON));
                JSONObject resultObject = JSON.parseObject(resultJSON);
                if (!resultObject.getBoolean("status")) {
                    throw new RuntimeException("远程获取数据异常：" + resultObject.getString("result"));
                }
                return JSON.parseObject(resultObject.getString("result"), method.getGenericReturnType());
            }
        };
        T t = (T) Proxy.newProxyInstance(CollagenProxy.class.getClassLoader(), new Class[]{clazz}, handler);
        return t;
    }


    private String parseXmlToResult(String xml) throws DocumentException {
        Document document = DocumentHelper.parseText(xml);
        Element element = document.getRootElement();
        Element node = element.element("Output");
        return node.getText();
    }
}
