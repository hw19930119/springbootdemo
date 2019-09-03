package com.sunsharing.springbootdemo.remote.share;

import com.alibaba.fastjson.JSONObject;
import com.sunsharing.springbootdemo.configuration.properties.ConfigParams;
import com.sunsharing.ihome.air.ws.MainEntrance;

import java.util.List;
import java.util.Map;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class ShareHelper {
    /**
     * 发送调用协同平台请求
     *
     * @author wangchuan 2019年3月8日 下午4:44:30
     */
    public static boolean sendSDK(String evaluateId, String teacherId, List<Map<String, String>> teacherList) {
        boolean isFlag = false;
        try {
            //
            if (teacherList != null && teacherList.size() > 0) {
                final Map<String, String> map = teacherList.get(0);
                String subjectName = (String) map.get("SUBJECT_NAME");
                String personId = (String) map.get("TEACHER_ID");
                log.info("获取到的personId========" + personId);
                map.remove("TEACHER_ID");
                String data = JSONObject.toJSONString(map);
                final JSONObject dataJson = new JSONObject();
                final JSONObject content = new JSONObject();
                final String url = ConfigParams.project_url + "index.html#/myLesson/detail/" + evaluateId;
                log.info("url:" + url);
                content.put("text", subjectName);
                dataJson.put("data", data);
                dataJson.put("appId", ConfigParams.zjq_appid);
                dataJson.put("url", url);
                dataJson.put("content", content.toJSONString());
                dataJson.put("urlLogo", "");
                dataJson.put("title", "项目详情");
                dataJson.put("personId", personId);
                dataJson.put("nickname", "");
                dataJson.put("head", "");
                final JSONObject jsonObject = new JSONObject();
                jsonObject.put("type", "sdk");
                jsonObject.put("xtpt", ConfigParams.zjq_sdk_code);
                jsonObject.put("parsType", ConfigParams.zjq_sdk_type);
                jsonObject.put("pars", dataJson);

                try {
                    data = new MainEntrance().service(jsonObject.toJSONString());
                    final JSONObject jsonObject1 = JSONObject.parseObject(data);
                    if ("200".equals(jsonObject1.getString("code"))) {
                        isFlag = true;
                    }else{
                        log.error("调用协同平台分享 返回码不是200:", jsonObject1.toJSONString());
                    }
                } catch (final Exception e) {
                    log.error("调用协同平台异常第一处:", e);
                }
            }
        } catch (final Exception e) {
            log.error("调用协同平台异常第二处:", e);
        }
        return isFlag;
    }
}
