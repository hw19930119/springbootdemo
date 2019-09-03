package com.sunsharing.springbootdemo.configuration.properties;

import com.google.common.base.CaseFormat;

import com.alibaba.fastjson.JSONObject;
import com.sunsharing.component.resvalidate.config.loader.prop.AbstractProp;
import com.sunsharing.component.resvalidate.exception.LoadConfigException;
import com.sunsharing.component.utils.base.MapHelper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;


@Configuration
@ConfigurationProperties(prefix = "share.commonfs")
public class FileSystemProperties extends AbstractProp {
    private String local_ip;
    private String file_server_type;
    private String file_server_dfs_real_ip;
    private String file_server_dfs_proxy_ip;
    private String file_server_dfs_port;
    private String file_server_jfs_path;
    private String file_limit_size;
    private String hadoopUri;
    private String hadoopAccount;
    private String hdfsReplication;
    private String hdfsBlocksize;
    private String hdfsExtProp;

    public String getLocal_ip() {
        return local_ip;
    }

    public void setLocal_ip(String local_ip) {
        this.local_ip = local_ip;
    }

    public String getFile_server_type() {
        return file_server_type;
    }

    public void setFile_server_type(String file_server_type) {
        this.file_server_type = file_server_type;
    }

    public String getFile_server_dfs_real_ip() {
        return file_server_dfs_real_ip;
    }

    public void setFile_server_dfs_real_ip(String file_server_dfs_real_ip) {
        this.file_server_dfs_real_ip = file_server_dfs_real_ip;
    }

    public String getFile_server_dfs_proxy_ip() {
        return file_server_dfs_proxy_ip;
    }

    public void setFile_server_dfs_proxy_ip(String file_server_dfs_proxy_ip) {
        this.file_server_dfs_proxy_ip = file_server_dfs_proxy_ip;
    }

    public String getFile_server_dfs_port() {
        return file_server_dfs_port;
    }

    public void setFile_server_dfs_port(String file_server_dfs_port) {
        this.file_server_dfs_port = file_server_dfs_port;
    }

    public String getFile_server_jfs_path() {
        return file_server_jfs_path;
    }

    public void setFile_server_jfs_path(String file_server_jfs_path) {
        this.file_server_jfs_path = file_server_jfs_path;
    }

    public String getFile_limit_size() {
        return file_limit_size;
    }

    public void setFile_limit_size(String file_limit_size) {
        this.file_limit_size = file_limit_size;
    }

    public String getHadoopUri() {
        return hadoopUri;
    }

    public void setHadoopUri(String hadoopUri) {
        this.hadoopUri = hadoopUri;
    }

    public String getHadoopAccount() {
        return hadoopAccount;
    }

    public void setHadoopAccount(String hadoopAccount) {
        this.hadoopAccount = hadoopAccount;
    }

    public String getHdfsReplication() {
        return hdfsReplication;
    }

    public void setHdfsReplication(String hdfsReplication) {
        this.hdfsReplication = hdfsReplication;
    }

    public String getHdfsBlocksize() {
        return hdfsBlocksize;
    }

    public void setHdfsBlocksize(String hdfsBlocksize) {
        this.hdfsBlocksize = hdfsBlocksize;
    }

    public String getHdfsExtProp() {
        return hdfsExtProp;
    }

    public void setHdfsExtProp(String hdfsExtProp) {
        this.hdfsExtProp = hdfsExtProp;
    }
    @Override
    public JSONObject loadParams(Object bean) throws LoadConfigException {
        return new JSONObject(MapHelper.objectToMap(this));
    }
    /**
     * 转换为 全部都小写以_连接的字符串
     *
     * @param src 待处理的文本
     * @return 全部都小写以_连接的字符串
     */
    public static final String toLowerUnderscore(String src) {
        return CaseFormat.UPPER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, src);
    }

}
