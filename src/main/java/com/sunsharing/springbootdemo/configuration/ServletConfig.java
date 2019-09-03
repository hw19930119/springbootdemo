package com.sunsharing.springbootdemo.configuration;

import com.sunsharing.common.file.servlet.DownLoadServlet;
import com.sunsharing.springbootdemo.servlet.CoreServlet;
import com.sunsharing.springbootdemo.servlet.VideoDownLoadServlet;

import org.apache.axis2.extensions.spring.receivers.ApplicationContextHolder;
import org.apache.axis2.transport.http.AxisServlet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class ServletConfig {
    @Value("${server.port}")
    public String configPort;

    @Bean  //一定要将这个定制器加入到容器中
    public EmbeddedServletContainerCustomizer embeddedServletContainerCustomizer() {
        return new EmbeddedServletContainerCustomizer() {

            //定制嵌入式的Servlet容器相关的规则
            @Override
            public void customize(ConfigurableEmbeddedServletContainer container) {
                container.setPort(Integer.parseInt(configPort));
            }
        };
    }
    //axis2
    @Bean
    public ApplicationContextHolder axis2ServiceBean() {
        ApplicationContextHolder applicationContextHolder = new ApplicationContextHolder();
        return applicationContextHolder;
    }
    @Bean
    public ServletRegistrationBean axis2ServletBean() {
        AxisServlet resourcesServlet = new AxisServlet();
        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(resourcesServlet, new String[]{"/services/*"});
        servletRegistrationBean.setLoadOnStartup(2);
        servletRegistrationBean.addInitParameter("axis2.repository.path", this.getClass().getResource("/WEB-INF").getPath().toString());
        return servletRegistrationBean;
    }
    //weixin
    @Bean
    public ServletRegistrationBean weixinCoreServlet() {
        /**
         * 第一个参数是我们自己的Servlet对象
         * 第二个参数是是对应的路径，可以写多个
         */
        ServletRegistrationBean reg = new ServletRegistrationBean(new CoreServlet(), "/weixinCoreServlet");
        return reg;
    }
    //文件
    @Bean
    public ServletRegistrationBean downloadFileServlet() {
        /**
         * 第一个参数是我们自己的Servlet对象
         * 第二个参数是是对应的路径，可以写多个
         */
        ServletRegistrationBean reg = new ServletRegistrationBean(new DownLoadServlet(), "/static/images/*");
        return reg;
    }
    @Bean
    public ServletRegistrationBean videoDownloadFileServlet() {
        /**
         * 第一个参数是我们自己的Servlet对象
         * 第二个参数是是对应的路径，可以写多个
         */
        ServletRegistrationBean reg = new ServletRegistrationBean(new VideoDownLoadServlet(), "/static/video/*", "/static/audio/*");
        return reg;
    }
}
