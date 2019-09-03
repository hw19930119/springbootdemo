
/*
 * @(#) JsonCommon
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author hanjb
 * <br> 2019-07-17 11:15:16
 */

package com.sunsharing.springbootdemo.remote.utils;

import com.alibaba.fastjson.JSON;
import com.sunsharing.component.utils.base.StringUtils;

import java.lang.reflect.Method;

import lombok.extern.log4j.Log4j;

@Log4j
public class JsonCommon {
    /**
     * 获取方法
     * @param methodName 方法名
     * @param o 对象class
     * @return
     */
    public static Method getMethod(String methodName, Object o) {
        return getMethod(methodName, o, "");
    }

    /**
     * 获取方法
     * @param methodName 方法名
     * @param o 对象class
     * @param paramJson 入参
     * @return
     */
    public static Method getMethod(String methodName, Object o, String paramJson) {

        Method[] methods = o.getClass().getMethods();
        Method method = null;
        for (Method m : methods) {
            if (m.getName().equals(methodName)) {
                if (hasMethodParam(paramJson, m)) {
                    method = m;
                    break;
                }
            }
        }
        return method;
    }

    /**
     * 匹配方法参数
     * @param m
     * @return
     */
    public static boolean hasMethodParam(String paramString, Method m) {
        Object[] objParm = null;
        if (!StringUtils.isBlank(paramString)
            && !"[\"\"]".equals(paramString)
            && !"null".equals(paramString)) {
            objParm = JSON.parseArray(paramString).toArray();
            if (m.getParameterTypes().length != objParm.length) {
                return false;
            }
            try {
                Object[] arguments = JSON.parseArray(paramString, m.getGenericParameterTypes()).toArray();
                log.info(arguments);
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    /**
     * 根据方法名称取得反射方法的参数类型(没有考虑同名重载方法使用时注意)
     * @param methodName  方法名
     * @return
     * @throws ClassNotFoundException
     */
    public static Class[] getMethodParamTypes(Object classInstance, String methodName) throws ClassNotFoundException {
        Class[] paramTypes = null;
        Method[] methods = classInstance.getClass().getMethods();//全部方法
        for (int i = 0; i < methods.length; i++) {
            if (methodName.equals(methods[i].getName())) {//和传入方法名匹配
                Class[] params = methods[i].getParameterTypes();
                paramTypes = new Class[params.length];
                for (int j = 0; j < params.length; j++) {
                    paramTypes[j] = Class.forName(params[j].getName());
                }
                break;
            }
        }
        return paramTypes;
    }
}
