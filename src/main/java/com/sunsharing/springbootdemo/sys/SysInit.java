/*
 * @(#) SysInit
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author hanjb
 * <br> 2019-06-27 18:19:47
 */

package com.sunsharing.springbootdemo.sys;

import com.sun.crypto.provider.SunJCE;
import com.sunsharing.common.file.FileFactory;
import com.sunsharing.springbootdemo.configuration.properties.FileSystemProperties;
import com.sunsharing.springbootdemo.remote.proxy.ProxyClientContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import java.security.Security;

/**
 * 此类可以做初始化操作
 */

@Component
@DependsOn({"applicationContextHelper", "fileSystemProperties"})
public class SysInit implements ApplicationRunner {
    @Autowired
    private FileSystemProperties fileSystemProperties;

    @Override
    public void run(ApplicationArguments applicationArguments) throws Exception {
        FileFactory.autoInit(fileSystemProperties);//fs初始化
        new ProxyClientContext("com.sunsharing.springbootdemo.service").init();//前后端通信通道初始化
        Security.addProvider(new SunJCE());
    }
}
