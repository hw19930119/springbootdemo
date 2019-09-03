/*
 * @(#) ConfigParams
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author chenhao
 * <br> 2019-07-30 00:18:04
 *
 */

package com.sunsharing.springbootdemo.configuration.properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;


@Configuration
public class ConfigParams {
    //web缓存目录
    public static String localTempDir;
	//项目名称
	public static String bizProjectName;
    //cookie的key
    public static String qyWeixinUserIdToken = "qyWeixinUserIdToken";
    public static String schoolIdToken = "schoolIdToken";
    public static String schoolZoneIdToken = "schoolZoneIdToken";
    public static String teacherIdToken = "teacherIdToken";
    public static String wxToken = "wxToken";
    public static String ouIdToken = "ouIdToken";

    //#======在Linux下需要配置  ffmpeg 命令文件目录（用于音视频转换）start ===========#
    public static String file_conversion_path;
    //#在Linux下音频文件转换为mp3文件命令
    public static String command_amrTomp3;
    //#在Linux下转换视频文件转换为mp4文件命令
    public static String command_toMp4;

    //#足迹圈-APPID
    public static String zjq_appid;
    //#足迹圈-sdk发送方式 有body、xml、rest、自定义参数等
    public static String zjq_sdk_type;
    //#足迹圈-sdk配置的编码前缀
    public static String zjq_sdk_code;

    //项目系统地址前缀 注意最后要加/
    public static String project_url;

    // #企业号开发配置
    //#企业ID
    public static String CorpID = "";
    //#部门ID
    public static String department_id = "";
    //#应用0 ID
    public static String agentid = "";
    //#应用0 Secret
    public static String Secret = "";
    //#应用0消息 Token
    public static String sToken = "";
    //#应用0消息 EncodingAESKey
    public static String sEncodingAESKey = "";

    @Value("${weixin.CorpID}")
    public void setCorpID(String corpID) {
        CorpID = corpID;
    }

    @Value("${weixin.department_id}")
    public void setDepartment_id(String department_id) {
        ConfigParams.department_id = department_id;
    }

    @Value("${weixin.app0.agentid}")
    public void setAgentid(String agentid) {
        ConfigParams.agentid = agentid;
    }

    @Value("${weixin.app0.Secret}")
    public void setSecret(String secret) {
        Secret = secret;
    }

    @Value("${weixin.app0.message.sToken}")
    public void setsToken(String sToken) {
        ConfigParams.sToken = sToken;
    }

    @Value("${weixin.app0.message.sEncodingAESKey}")
    public void setsEncodingAESKey(String sEncodingAESKey) {
        ConfigParams.sEncodingAESKey = sEncodingAESKey;
    }


    @Value("${project_url}")
    public void setLesson_url(String project_url) {
        ConfigParams.project_url = project_url;
    }


    @Value("${file_conversion_path}")
    public void setFile_conversion_path(String file_conversion_path) {
        ConfigParams.file_conversion_path = file_conversion_path;
    }


    @Value("${command_amrTomp3}")
    public void setCommand_amrTomp3(String command_amrTomp3) {
        ConfigParams.command_amrTomp3 = command_amrTomp3;
    }

    @Value("${command_toMp4}")
    public void setCommand_toMp4(String command_toMp4) {
        ConfigParams.command_toMp4 = command_toMp4;
    }

    @Value("${zjq_appid}")
    public void setZjq_appid(String zjq_appid) {
        ConfigParams.zjq_appid = zjq_appid;
    }

    @Value("${zjq_sdk_type}")
    public void setZjq_sdk_type(String zjq_sdk_type) {
        ConfigParams.zjq_sdk_type = zjq_sdk_type;
    }

    @Value("${zjq_sdk_code}")
    public void setZjq_sdk_code(String zjq_sdk_code) {
        ConfigParams.zjq_sdk_code = zjq_sdk_code;
    }

    @Value("${localTempDir}")
    public void setLocalTempDir(String localTempDir) {
        ConfigParams.localTempDir = localTempDir;
    }

	 @Value("${bizProjectName}")
    public void setBizProjectName(String bizProjectName) {
        ConfigParams.bizProjectName = bizProjectName;
    }
}
