/*
 * @(#) CallWebserviceClient
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author hanjb
 * <br> 2019-07-17 10:59:20
 */

package com.sunsharing.springbootdemo.remote.proxy.client;


import com.sunsharing.springbootdemo.configuration.ApplicationContextHelper;
import com.sunsharing.springbootdemo.remote.collagen.OpenService;
import com.sunsharing.springbootdemo.configuration.properties.ConfigParam;

import org.apache.axis2.addressing.EndpointReference;
import org.apache.axis2.client.Options;
import org.apache.axis2.rpc.client.RPCServiceClient;

import javax.xml.namespace.QName;

public class CallWebserviceClient {

    public static String service(String service, String method, String params) throws Exception {
        ConfigParam configParam = (ConfigParam) ApplicationContextHelper.getBean(ConfigParam.class);
        String tns = "http://collagen.remote.springbootdemo.sunsharing.com";
        // 使用RPC方式调用WebService
        RPCServiceClient serviceClient = new RPCServiceClient();
        Options options = serviceClient.getOptions();
        //设置客户端调用ws的超时时间
        options.setTimeOutInMilliSeconds(6000);
        // 指定调用WebService的URL
        EndpointReference targetEPR = new EndpointReference(configParam.getRemote_url());
        options.setTo(targetEPR);
        // 指定要调用的getGreeting方法及WSDL文件的命名空间
        QName requestMethod = new QName(tns, "callService");
        String digestCode = OpenService.calcDigestCode(service, method, params); //计算接口数字签名

        Object[] reqParam = new Object[]{service, method, params, digestCode};
        String result = (String) serviceClient.invokeBlocking(requestMethod, reqParam, new Class[]{String.class})[0];
        serviceClient.cleanupTransport();
        serviceClient.cleanup();
        serviceClient = null;
        return result;
    }
}
