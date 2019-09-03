/*
 * @(#) ConfigParam
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author hanjb
 * <br> 2019-07-17 11:29:48
 */

package com.sunsharing.springbootdemo.configuration.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@ConfigurationProperties(prefix = "share.config")
@Data
public class ConfigParam {

    private String remote_url;

    private String proxyType;

    private String openServiceId;

    private String openAuthorizeId;

    private String collagenIp;

    private String collagenPort;

    private String collagenRequestId;

    private String collagenLocalDomain;

    private String collagenWsProxyFlowId;

    private String collagenRequestTimeOut;

    public Integer getCollagenRequestTimeOut() {
        return Integer.valueOf(collagenRequestTimeOut);
    }

    public String getRemote_url() {
        return remote_url;
    }

    public String getProxyType() {
        return proxyType;
    }

    public String getOpenServiceId() {
        return openServiceId;
    }

    public String getOpenAuthorizeId() {
        return openAuthorizeId;
    }

    public String getCollagenIp() {
        return collagenIp;
    }

    public String getCollagenPort() {
        return collagenPort;
    }

    public String getCollagenRequestId() {
        return collagenRequestId;
    }

    public String getCollagenLocalDomain() {
        return collagenLocalDomain;
    }

    public String getCollagenWsProxyFlowId() {
        return collagenWsProxyFlowId;
    }

    @Override
    public String toString() {
        return "ConfigParam{" +
            "remote_url='" + remote_url + '\'' +
            ", proxyType='" + proxyType + '\'' +
            ", openServiceId='" + openServiceId + '\'' +
            ", openAuthorizeId='" + openAuthorizeId + '\'' +
            ", collagenIp='" + collagenIp + '\'' +
            ", collagenPort='" + collagenPort + '\'' +
            ", collagenRequestId='" + collagenRequestId + '\'' +
            ", collagenLocalDomain='" + collagenLocalDomain + '\'' +
            ", collagenWsProxyFlowId='" + collagenWsProxyFlowId + '\'' +
            ", collagenRequestTimeOut='" + collagenRequestTimeOut + '\'' +
            '}';
    }
}
