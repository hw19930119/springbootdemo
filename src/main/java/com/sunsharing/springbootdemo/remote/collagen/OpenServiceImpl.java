/*
 * @(#) TalentXmzdCollagenImpl 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究 <br> Copyright: Copyright (c) 2019 <br> Company:厦门畅享信息技术有限公司 <br> @author hanjb <br> 2019-07-17
 * 10:59:20
 */

package com.sunsharing.springbootdemo.remote.collagen;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.sunsharing.component.utils.base.StringUtils;
import com.sunsharing.springbootdemo.configuration.ApplicationContextHelper;
import com.sunsharing.springbootdemo.remote.utils.JsonCommon;

import org.apache.commons.beanutils.MethodUtils;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;

import lombok.extern.log4j.Log4j2;

@Service("openServiceCollagen")
@Log4j2
public class OpenServiceImpl implements OpenService {

    @Override
    public String callService(String service, String method, String params, String digestCode) {
        String var12;
        try {
            Object ser = ApplicationContextHelper.getBean(service + "Impl");
            if (ser == null) {
                throw new RuntimeException("没有找到服务：" + service);
            }
            Method m = JsonCommon.getMethod(method, ser, params);
            if (m == null) {
                throw new RuntimeException("没有找到服务[" + service + "]所对应的方法[" + method + "]");
            }
            String digest = OpenService.calcDigestCode(service, method, params);
            if (!digest.equals(digestCode)) {
                throw new RuntimeException("接口数字签名[" + digestCode + "]计算错误");
            }
            Object[] arguments = null;
            if (!StringUtils.isBlank(params) && !"[\"\"]".equals(params) && !"null".equals(params)) {
                arguments = JSON.parseArray(params, m.getGenericParameterTypes()).toArray();
            }

            Object obj = MethodUtils.invokeMethod(ser, method, arguments);
            // log.info("服务[" + service + "] 参数[" + arguments + "] 返回结果： " + obj);
            if (obj != null && isBaseType(obj)) {
                var12 = obj.toString();
            } else {
                var12 = JSON.toJSONString(obj, new SerializerFeature[]{SerializerFeature.WriteNullStringAsEmpty,
                    SerializerFeature.WriteMapNullValue, SerializerFeature.BrowserCompatible});
            }
        } catch (Exception var16) {
            log.error(service + "Impl" + "远程服务调用出错", var16);
            String var6 = var16.getMessage();
            return getErrorResult(var6);
        }
        return getResult(var12);
    }

    private static boolean isBaseType(Object object) {
        Class className = object.getClass();
        return className.equals(Integer.class) || className.equals(Byte.class) || className.equals(Long.class)
            || className.equals(Double.class) || className.equals(Float.class) || className.equals(Character.class)
            || className.equals(Short.class) || className.equals(Boolean.class) || className.equals(String.class);
    }

    private String getErrorResult(String var6) {
        JSONObject result = new JSONObject();
        result.put("status", false);
        result.put("result", var6);
        return JSON.toJSONString(result, SerializerFeature.WriteMapNullValue);
    }

    private String getResult(String var12) {
        JSONObject jo = new JSONObject();
        jo.put("status", true);
        jo.put("result", var12);
        return JSON.toJSONString(jo, SerializerFeature.WriteMapNullValue);
    }

}
