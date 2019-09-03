package com.sunsharing.springbootdemo.configuration;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import com.alibaba.fastjson.JSONObject;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Objects;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import lombok.extern.log4j.Log4j2;

@Aspect
@Component
@Log4j2
public class ParamLogger {
    @Pointcut("execution(* com.sunsharing.springbootdemo.web..*(..))")
    public void controller() {
    }

    @Pointcut("execution(* com.sunsharing.springbootdemo.service..*(..))")
    public void service() {
    }

    @Before("controller()")
    public void controller(JoinPoint point) {
    }

    @Around("controller()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        String uuid = "";

        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        log.info("\n\t请求标识: {}\n\t请求IP: {}\n\t请求路径: {}\n\t请求方式: {}\n\t方法描述: {}\n\t请求参数: {}",
            uuid, request.getRemoteAddr(), request.getRequestURL(), request.getMethod(),
            getMethodInfo(point), JSONObject.toJSONString(request.getParameterMap()));

        long startTime = System.currentTimeMillis();
        Object[] args = point.getArgs();
        Object retVal = point.proceed(args);
        long endTime = System.currentTimeMillis();

        log.info("\n\t请求标识: {} \n\t执行时间: {} ms \n\t返回值: {}", uuid, endTime - startTime, JSONObject.toJSONString(retVal));
        return retVal;
    }

    @Before("service()")
    public void service(JoinPoint point) {
        log.info("\n\tservice method: {}", getMethodInfo(point));
    }

    private String getMethodInfo(JoinPoint point) {
        HashMap<String, Object> info = new HashMap<>(3);

        info.put("class", point.getTarget().getClass().getSimpleName());
        info.put("method", point.getSignature().getName());

        String[] parameterNames = ((MethodSignature) point.getSignature()).getParameterNames();
        HashMap<String, Object> args = null;


        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd hh:mm:ss").create();

        if (Objects.nonNull(parameterNames)) {
            args = new HashMap<>(parameterNames.length);
            for (int i = 0; i < parameterNames.length; i++) {
                Object arg = point.getArgs()[i];
                if (!(arg instanceof MultipartFile)
                    && !(arg instanceof ServletRequest)
                    && !(arg instanceof ServletResponse)) {
                    args.put(parameterNames[i], arg);
                }
            }
            info.put("args", args);
        }

        return gson.toJson(info);
    }

}
