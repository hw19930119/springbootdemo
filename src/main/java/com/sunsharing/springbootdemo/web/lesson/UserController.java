package com.sunsharing.springbootdemo.web.lesson;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.sunsharing.springbootdemo.constant.CacheConstants;
import com.sunsharing.springbootdemo.model.vo.OrgUserVo;
import com.sunsharing.springbootdemo.model.vo.TeacherVo;
import com.sunsharing.springbootdemo.remote.proxy.ProxyClientContext;
import com.sunsharing.springbootdemo.service.TeacherService;
import com.sunsharing.springbootdemo.configuration.properties.ConfigParams;
import com.sunsharing.springbootdemo.util.RedisOrMemCacheUtil;
import com.sunsharing.springbootdemo.util.RequestHelper;
import com.sunsharing.springbootdemo.util.weixin.HttpSendShort;
import com.sunsharing.springbootdemo.util.weixin.WeixinQYHUntils;
import com.sunsharing.springbootdemo.util.weixin.jssdk.MyWxQyhHelpUtils;
import com.sunsharing.share.webex.annotation.ShareRest;
import com.sunsharing.share.webex.exception.ShareBusinessException;

import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.log4j.Log4j2;

@RestController
@ConditionalOnExpression("'${isInnerNetwork}'=='false' || '${isInnerNetwork}'=='both' ")
@RequestMapping("/user")
@Log4j2
@ShareRest
public class UserController {

    @GetMapping("/getLoginUserInfoByWeixinCode")
    public Object getLoginUserInfoByWeixinCode(HttpServletRequest request, HttpServletResponse response) {
        String code = request.getParameter("code");
        log.info("企业号- 请求url：" + request.getQueryString());
        log.info("企业号 - code ：" + code);
        String httpUrl = "https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token="
            + WeixinQYHUntils.get_AccessToken(ConfigParams.CorpID, ConfigParams.Secret) + "&code=" + code;
        String codeResultJsonStr = HttpSendShort.getHTML(httpUrl, "UTF-8");
        JSONObject codeResultJson = JSON.parseObject(codeResultJsonStr);
        log.error("企业号- 微信授权反馈结果:" + codeResultJsonStr);

        if ("40029".equals(codeResultJson.getString("errcode"))) {//报错
            throw new ShareBusinessException(1401, "授权已过期");
        }
        if (!codeResultJson.containsKey("DeviceId")) {//报错
            throw new ShareBusinessException(1403, "您没有权限访问当前项目");
        }
        String wxUserId = codeResultJson.getString("UserId");
        if (StringUtils.isBlank(wxUserId)) {//报错
            throw new ShareBusinessException(1403, "不是该企业用户");
        }
        JSONObject result = new JSONObject();
        //未绑定教师，请联系教委管理员
        //查询教师
        TeacherService teacherService = ProxyClientContext.getBean(TeacherService.class);
        TeacherVo teacherVo = teacherService.getTeacherByWxUserId(wxUserId);
        if (teacherVo == null || StringUtils.isBlank(teacherVo.getTeacheId())) {
            throw new ShareBusinessException(1403, "系统内该企业微信用户没有绑定教师，请联系管理员");
        }
        String teacherId = teacherVo.getTeacheId();
        //查询学校和组织关系，如果多个关系，先在前端选择
        getOrgUserInfo(result,teacherId);//获取教师的组织关系
        result.put("wxUserId", wxUserId);
        result.put("teacherId", teacherId);
        String wxToken = com.sunsharing.component.utils.base.StringUtils.generateUUID();
        result.put("wxToken", wxToken);
        RedisOrMemCacheUtil.saveCache(CacheConstants.TEACHER_ID + ":" + teacherId, wxToken);
        return result;
    }

    @GetMapping("/get-orguserlist-by-teacherid")
    public Object getOrgUserListByTeacherId(HttpServletRequest request, HttpServletResponse response,
                                            @RequestParam String teacherId) {
        log.info("请求 /user/get-orguserlist-by-teacherid");
        //未绑定教师，请联系教委管理员
        //查询教师
        JSONObject result = new JSONObject();
        getOrgUserInfo(result,teacherId);//获取教师的组织关系
        return result;
    }
    //获取教师的组织关系
    private void getOrgUserInfo(JSONObject result,String teacherId){
        TeacherService teacherService = ProxyClientContext.getBean(TeacherService.class);
        TeacherVo teacherVo = teacherService.getTeacherByTeacherId(teacherId);
        if (teacherVo == null || StringUtils.isBlank(teacherVo.getTeacheId())) {
            throw new ShareBusinessException(1403, "系统内该企业微信用户没有绑定教师，请联系管理员");
        }
        //查询学校和组织关系，如果多个关系，先在前端选择
        String ouId = "";
        String schoolId = "";
        String schoolZoneId = "";
        List<OrgUserVo> orgUserVoList = teacherService.queryOrgUserByTeacherId(teacherId);
        if (orgUserVoList.isEmpty()) {
            //schoolId = teacherVo.getSchoolId();
            throw new ShareBusinessException(1403,"教师没有所属组织，请联系管理员");
        } else if (orgUserVoList.size() == 1) {
            OrgUserVo orgUserVo = orgUserVoList.get(0);
            ouId = orgUserVo.getOuId();
            schoolId = orgUserVo.getSchoolId();
            schoolZoneId = orgUserVo.getSchoolZoneId();
            if (StringUtils.isAnyBlank(ouId, schoolId,schoolZoneId)) {
                throw new ShareBusinessException(1403, "教师没有所属组织，请联系管理员");
            }
        }
        result.put("ouId", ouId);
        result.put("schoolId", schoolId);
        result.put("schoolZoneId", schoolZoneId);
        result.put("orgUserVoList", orgUserVoList);
    }

    @GetMapping("/getWeixinCodeConfig")
    public Object getWeixinCodeConfig(HttpServletRequest request, HttpServletResponse response) {
        log.info("请求 /user/getWeixinCodeConfig");
        JSONObject result = new JSONObject();
        result.put("CorpID", ConfigParams.CorpID);
        result.put("department_id", ConfigParams.department_id);
        result.put("agentid", ConfigParams.agentid);
        result.put("Secret", ConfigParams.Secret);
        result.put("sToken", ConfigParams.sToken);
        result.put("sEncodingAESKey", ConfigParams.sEncodingAESKey);
        return result;
    }

    @GetMapping("/getJsSDK-config")
    public Object getJsSdKConfig(HttpServletRequest request, HttpServletResponse response) {
        log.info("请求 /user/getJsSDK-config");
        JSONObject result = JSONObject.parseObject(MyWxQyhHelpUtils.generateConfigJson(request));
        result.put("appId", ConfigParams.CorpID);
        return result;
    }

    @GetMapping("/validate-login-user")
    public Object validateLoginUser(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        log.info("请求 /user/validate-login-user");
        boolean isNeedLoginQiyeWeixin = isNeedLoginQiyeWeixinM(httpServletRequest, httpServletResponse);
        JSONObject result = new JSONObject();
        result.put("isNeedLoginQiyeWeixin", isNeedLoginQiyeWeixin);
        return result;
    }

    public static boolean isNeedLoginQiyeWeixinM(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        boolean isNeedLoginQiyeWeixin = false;
        //qyWeixinUserId
        String qyWeixinUserIdToken = RequestHelper.getValueFromRequestParamOrCookie(ConfigParams.qyWeixinUserIdToken, httpServletRequest, httpServletResponse);
        //teacherId
        String teacherIdToken = RequestHelper.getValueFromRequestParamOrCookie(ConfigParams.teacherIdToken, httpServletRequest, httpServletResponse);
        //schoolId
        String schoolIdToken = RequestHelper.getValueFromRequestParamOrCookie(ConfigParams.schoolIdToken, httpServletRequest, httpServletResponse);
        //schoolZoneId
        String schoolZoneIdToken = RequestHelper.getValueFromRequestParamOrCookie(ConfigParams.schoolZoneIdToken, httpServletRequest, httpServletResponse);
        //wxToken
        String wxToken = RequestHelper.getValueFromRequestParamOrCookie(ConfigParams.wxToken, httpServletRequest, httpServletResponse);
        //ouId
        String ouIdToken = RequestHelper.getValueFromRequestParamOrCookie(ConfigParams.ouIdToken, httpServletRequest, httpServletResponse);
        if (StringUtils.isAnyBlank(qyWeixinUserIdToken, teacherIdToken, schoolIdToken, wxToken,schoolZoneIdToken)) {//,ouIdToken
            isNeedLoginQiyeWeixin = true;
        } else {
            String wxTokenInCache = (String) RedisOrMemCacheUtil.getCache(CacheConstants.TEACHER_ID + ":" + teacherIdToken);
            if (StringUtils.isBlank(wxTokenInCache)
                || !StringUtils.equals(wxToken, wxTokenInCache)) {
                isNeedLoginQiyeWeixin = true;
            }
        }
        return isNeedLoginQiyeWeixin;
    }


}
