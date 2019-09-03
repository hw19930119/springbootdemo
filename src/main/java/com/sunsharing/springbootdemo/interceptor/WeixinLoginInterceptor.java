package com.sunsharing.springbootdemo.interceptor;

import com.alibaba.fastjson.JSONObject;
import com.sunsharing.springbootdemo.web.lesson.UserController;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class WeixinLoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        if (!UserController.isNeedLoginQiyeWeixinM(httpServletRequest, httpServletResponse)) {
            return true;
        }
        //if (isAjaxRequest(httpServletRequest)) {
        JSONObject resposeJson = new JSONObject();
        resposeJson.put("status", "1401");
        resposeJson.put("message", "微信登录已失效，请退出后重新登录！");
        httpServletResponse.setContentType("application/json;charset=UTF-8");
        PrintWriter writer = httpServletResponse.getWriter();
        writer.write(resposeJson.toJSONString());
        writer.close();
        httpServletResponse.flushBuffer();
        //} else {
        //    httpServletRequest.getRequestDispatcher("/loginWeixin.html").forward(httpServletRequest, httpServletResponse);
        //}
        return false;
    }

    public static boolean isAjaxRequest(HttpServletRequest request) {
        String requestedWith = request.getHeader("x-requested-with");
        if (requestedWith != null && requestedWith.equalsIgnoreCase("XMLHttpRequest")) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {
    }
}
