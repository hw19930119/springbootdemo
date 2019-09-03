package com.sunsharing.springbootdemo.util;

import com.sunsharing.component.utils.web.CookieUtils;

import org.apache.commons.lang.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RequestHelper {
    public static String getValueFromRequestParamOrCookie(String key, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        String value = CookieUtils.getCookieValue(httpServletRequest, key);
        if (StringUtils.isBlank(value)) {
            value = httpServletRequest.getParameter(key);//调试方便
            if (StringUtils.isNotBlank(value)) {
                CookieUtils.setCookie(httpServletResponse, key, value);
            }
        }
        return value;
    }
}
