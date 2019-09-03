/*
 * @(#) ProxyClientContext
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author hanjb
 * <br> 2019-07-17 10:59:20
 */

package com.sunsharing.springbootdemo.remote.proxy;

import com.sunsharing.springbootdemo.remote.proxy.anno.ClassFilter;
import com.sunsharing.springbootdemo.remote.proxy.anno.ClassUtils;
import com.sunsharing.springbootdemo.remote.proxy.anno.CollagenAnno;
import com.sunsharing.springbootdemo.remote.proxy.exception.ClassNotFoundProxyException;

import java.lang.annotation.Annotation;
import java.lang.reflect.Modifier;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class ProxyClientContext {


    public String packagePath;

    private static Map<String, Object> services = new HashMap<>();


    public ProxyClientContext(String packagePath) {
        this.packagePath = packagePath;
    }

    public void init() {
        ClassFilter filter = new ClassFilter() {
            @Override
            public boolean accept(Class clazz) {
                if (Modifier.isInterface(clazz.getModifiers())) {
                    Annotation ann = clazz.getAnnotation(CollagenAnno.class);
                    if (ann != null) {
                        return true;
                    }
                }
                return false;
            }
        };
        List<Class> classes = ClassUtils.scanPackage(packagePath, filter);
        try {
            ProxyAbstract proxyAbstract = ProxyFactory.crateProxy();
            classes.forEach(clazz -> {
                CollagenAnno ann = (CollagenAnno) clazz.getAnnotation(CollagenAnno.class);
                String service = getServiceName(clazz, ann.id());
                log.info("初始化代理类：" + service);
                Object bean = proxyAbstract.getProxy(clazz, service);
                services.put(clazz.getName(), bean);
            });
        } catch (ClassNotFoundProxyException e) {
            log.error("未获远程代理对象", e);
        }
    }

    public static <T> T getBean(Class clazz) {
        return (T) services.get(clazz.getName());
    }


    private String getServiceName(Class interfaces, String id) {
        if (id.equals("")) {
            id = interfaces.getSimpleName();
            id = Character.toLowerCase(id.charAt(0)) + id.substring(1);
        }
        return id;
    }
}
