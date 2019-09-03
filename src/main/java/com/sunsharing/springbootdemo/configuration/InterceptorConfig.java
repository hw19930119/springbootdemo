package com.sunsharing.springbootdemo.configuration;

import com.sunsharing.springbootdemo.interceptor.WeixinLoginInterceptor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class InterceptorConfig extends WebMvcConfigurerAdapter {

    // 这个方法是用来配置静态资源的，比如html，js，css，等等
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    }

    @Bean
    public WeixinLoginInterceptor getWeixinLoginInterceptor() {
        return new WeixinLoginInterceptor();
    }

    // 这个方法用来注册拦截器，我们自己写好的拦截器需要通过这里添加注册才能生效
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(getWeixinLoginInterceptor()).addPathPatterns("/evaluate/**", "/mystatistics/**").
            excludePathPatterns("/evaluate/get-detail", "/evaluate/upload-base64-image", "/evaluate/uploadVideo", "/evaluate/get-share-qr-image.jpg");
    }
}
