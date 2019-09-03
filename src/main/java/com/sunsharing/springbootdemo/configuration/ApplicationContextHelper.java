/*
 * @(#) ApplicationContextHelper
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author chenhao
 * <br> 2019-07-29 22:58:46
 *
 */

package com.sunsharing.springbootdemo.configuration;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ContextLoader;

import lombok.extern.log4j.Log4j2;

@Component
@Log4j2
public class ApplicationContextHelper implements ApplicationContextAware {

    private static ApplicationContext applicationContext;

    public ApplicationContextHelper() {
        System.out.println(ContextLoader.getCurrentWebApplicationContext());
        log.info("init ==========  ApplicationContextAware");
    }

    @Autowired
    public void setApplicationContext(ApplicationContext ctx) throws BeansException {
        log.info("+++++++++++" + ctx.getId() + " ==== " + ctx.getApplicationName());
        applicationContext = ctx;
    }

    /**
     * 获取bean
     * @param clazz
     * @param <T>
     * @return
     */
    public static <T> T getBean(Class<T> clazz) {
        //先判断是否为空
        if (applicationContext == null) {
            return null;
        }
        return applicationContext.getBean(clazz);
    }

    /**
     * 获取bean
     * @param clazz
     * @param <T>
     * @return
     */
    public static <T> T getBean(String clazz) {
        //先判断是否为空
        if (applicationContext == null) {
            return null;
        }
        return (T) applicationContext.getBean(clazz);
    }


}
