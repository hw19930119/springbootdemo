/*
 * @(#) CollagenClient
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author hanjb
 * <br> 2019-07-17 10:59:20
 */

package com.sunsharing.springbootdemo.remote.proxy.client;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.sunsharing.collagen.data_item.Item;
import com.sunsharing.collagen.data_item.StructItem;
import com.sunsharing.collagen.exception.RequestException;
import com.sunsharing.collagen.request.RequestResult;
import com.sunsharing.collagen.request.RequestSetting;
import com.sunsharing.collagen.request.WebServiceProxy;
import com.sunsharing.springbootdemo.configuration.ApplicationContextHelper;
import com.sunsharing.springbootdemo.remote.collagen.OpenService;
import com.sunsharing.springbootdemo.configuration.properties.ConfigParam;

import java.util.List;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class CollagenClient {

    public String callCollagen(String service, String method, String params) {
        ConfigParam configParam = (ConfigParam) ApplicationContextHelper.getBean(ConfigParam.class);

        // 初始化信息，包括请求IP和端口，请求连接超时时间，请求ID，请求所属的域，服务代理流程ID。
        RequestSetting.getInstance().setIpAndPort(configParam.getCollagenIp(), configParam.getCollagenPort())
            .setRequestId(configParam.getCollagenRequestId())
            .setLocalDomain(configParam.getCollagenLocalDomain())
            .setSyncWsProxyFlowId(configParam.getCollagenWsProxyFlowId())
            .setSocketTimeOutInSecond(configParam.getCollagenRequestTimeOut());

        WebServiceProxy wsProxy = new WebServiceProxy(configParam.getOpenServiceId());
        wsProxy.setAuthorizeId(configParam.getOpenAuthorizeId());
        log.info("初始化协同平台：" + configParam.getOpenServiceId() + "," + configParam.getOpenAuthorizeId());
        Item struct_item = new StructItem("callService", "struct");
        struct_item.asStruct().appendStringItem("service", service);
        struct_item.asStruct().appendStringItem("method", method);
        struct_item.asStruct().appendStringItem("params", params);
        try {
            struct_item.asStruct().appendStringItem("digestCode", OpenService.calcDigestCode(service, method, params));
        } catch (Exception e) {
            log.error("计算接口数字签名出错:" + e.getMessage(), e);
            throw new RuntimeException("计算接口数字签名出错:" + e.getMessage());
        }
        wsProxy.appendItemParameter(struct_item);
        String str = "";
        try {
            RequestResult ret = wsProxy.request();
            log.info(ret);
            List<Item> retList = ret.getRetItems();
            if (retList.size() > 0) {
                Item firstItem = retList.get(0);//获得返回结果中数组中第一个值。
                if (firstItem instanceof StructItem) {
                    str = firstItem.asStruct().getItem(0).asSimple().getValueIfString("");
                }
            } else {
                log.info("返回参数为空!");
                JSONObject result = new JSONObject();
                result.put("status", false);
                result.put("result", "协同平台返回结果为空");
                str = JSON.toJSONString(result, SerializerFeature.WriteMapNullValue);
            }
        } catch (RequestException e) {
            log.error("协同出错:" + e.getErrorCodeStr(), e);
            throw new RuntimeException("协同出错:" + e.getErrorCodeStr());
        } catch (Exception e) {
            log.error("协同xxx出错:" + e.getMessage(), e);
            throw new RuntimeException("协同xx出错:" + e.getMessage());
        }
        return str;
    }
}

