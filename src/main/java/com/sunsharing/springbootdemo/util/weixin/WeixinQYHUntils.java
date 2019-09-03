package com.sunsharing.springbootdemo.util.weixin;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.sunsharing.component.utils.base.StringUtils;
import com.sunsharing.springbootdemo.constant.CacheConstants;
import com.sunsharing.springbootdemo.configuration.properties.ConfigParams;
import com.sunsharing.springbootdemo.util.RedisOrMemCacheUtil;

import org.apache.log4j.Logger;

/**
 *
 * @ClassName: WeixinQYHUntils
 * @Description: 微信企业号 接口调用
 * @author ZD
 * @date 2016年7月12日 下午2:55:05
 *
 */
public class WeixinQYHUntils {

    static Logger logger = Logger.getLogger(WeixinQYHUntils.class);

    /**
     * 通用接口获取access_token凭证，注意不是网页的access_token
     *
     * @return
     */
    public static String get_AccessToken(String corpid, String corpsecret) {
        logger.info("参数：corpid:" + corpid + "  corpsecret:" + corpsecret);
        String accessTokenKey = CacheConstants.QYWX_ACCESSTOKEN +":"+ corpsecret;

        String access_token_or_url = (String) RedisOrMemCacheUtil.getCache(accessTokenKey);
        logger.info("access_token_or_url=" + access_token_or_url);
        if (!StringUtils.isBlank(access_token_or_url)) {
            if (accessTokenVerification(access_token_or_url)) {// 有效的access_token
                return access_token_or_url;
            } else {// 无效的access_token
                access_token_or_url = getTokenUrl(corpid, corpsecret);
            }
        } else {// 缓存中不存在access_token
            access_token_or_url = getTokenUrl(corpid, corpsecret);
        }
        logger.info("应用id：" + corpid);
        logger.info("秘钥：" + corpsecret);
        logger.info("access_token_or_url=" + access_token_or_url);
        final String result = HttpSendShort.getHTML(access_token_or_url, "UTF-8");
        logger.info("result:" + result);
        final JSONObject resJsonObject = JSON.parseObject(result);
        final String access_token = resJsonObject.getString("access_token");
        RedisOrMemCacheUtil.saveCacheByPriod(accessTokenKey, access_token, "7200");
        logger.info("获取token链接 access_token_or_url:" + access_token_or_url);
        logger.info("企业号- access_token:" + access_token);

        return access_token;
    }

    /**
     * 组装token的url
     * @author wangchuan 2017年6月15日 上午9:51:10
     * @param corpid
     * @param corpsecret
     * @return
     */
    private static String getTokenUrl(String corpid, String corpsecret) {
        if (StringUtils.isBlank(corpid) || StringUtils.isBlank(corpsecret)) {
            corpid = ConfigParams.CorpID;
            corpsecret = ConfigParams.Secret;
        }
        return "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=" + corpid + "&corpsecret=" + corpsecret;
    }

    /**
     * 验证access_token的有效性,调用获取企业号管理组应用列表的接口，来判断access_token是否有效
     * @author lixinqiao 2017年6月13日 下午3:05:43
     * @param access_token --要验证的access_token;
     * @return
     */
    public static boolean accessTokenVerification(String access_token) {
        final String url = "https://qyapi.weixin.qq.com/cgi-bin/agent/list?access_token=" + access_token;// 获取企业号应用概况列表
        final String result = HttpSendShort.getHTML(url, "UTF-8");
        System.out.println("access_token有效性验证,企业号结果集:result=" + result);
        final JSONObject resJonObject = JSON.parseObject(result);
        final String errcode = resJonObject.getString("errcode");
        System.out.println("errcode=" + errcode);
        if (!"0".equals(errcode)) {// 无效
            logger.info("access_token值无效");
            return false;
        } else if (StringUtils.isBlank(errcode)) {
            logger.info("access_token值无效");
            return false;
        } else {// 有效
            logger.info("access_token值有效");
            return true;
        }
    }

    /**
     * 通过API获取管理组JS-SDK凭据 与附录1-JS-SDK使用权限签名算法中的jsapi_ticket类似，开发者也是用access_token通过http GET请求获取管理组临时票据
     * @param AccessToken
     * @return
     */
    public static String getTicket(String AccessToken) {
        final String url = "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=" + AccessToken;
        // String url = "https://qyapi.weixin.qq.com/cgi-bin/ticket/get?access_token="+AccessToken+"&type=contact";
        final String result = HttpSendShort.getHTML(url, "UTF-8");
        final JSONObject resJsonObject = JSON.parseObject(result);
        logger.info("..resJsonObject(ticket):" + resJsonObject);
        final String ticket = resJsonObject.getString("ticket");
        logger.info("企业号-临时票据ticket:" + ticket);
        return ticket;
    }

    /**
     * 企业号：获取用户详细信息
     * @param wx_userid 微信授权之后获取到的userid
     * @return
     */
    public static JSONObject getWXUserInfo_BywxUserId(String wx_userid) {
        final String url = "https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token="
            + get_AccessToken(ConfigParams.CorpID, ConfigParams.Secret) + "&userid=" + wx_userid;
        final String result = HttpSendShort.getHTML(url, "UTF-8");
        final JSONObject resJsonObject = JSON.parseObject(result);
        logger.info("企业号-获取用户详细信息  -resJsonObject:" + resJsonObject.toJSONString());
        return resJsonObject;
    }

    public static String getWXps(String serid) {
        final String url = "https://qyapi.weixin.qq.com/cgi-bin/media/get?access_token="
            + get_AccessToken(ConfigParams.CorpID, ConfigParams.Secret) + "&media_id=" + serid;
        final String result = HttpSendShort.getHTML(url, "UTF-8");
        // JSONObject resJsonObject = JSON.parseObject(result);
        logger.info("企业号-获取用户详细信息  -resJsonObject:" + result);
        return result;
    }

    /**
     * 获取企业号 制定部门下的所有的用户
     * @return
     */
    public static JSONObject getAllWXUser() {
        final String getURL = "https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token="
            + get_AccessToken(ConfigParams.CorpID, ConfigParams.Secret) + "&department_id=" + ConfigParams.department_id
            + "&fetch_child=1&status=0";
        final String reString = HttpSendShort.getHTML(getURL, "UTF-8");
        final JSONObject resObject = JSONObject.parseObject(reString);
        return resObject;
    }

    /**
     * 向企业号中添加成员
     * @author zhengdong 2016年11月8日 上午11:23:12
     * @param jsonObject
     * @return
     */
    public static JSONObject createUser(JSONObject jsonObject) {
        final String url = "https://qyapi.weixin.qq.com/cgi-bin/user/create?access_token="
            + get_AccessToken(ConfigParams.CorpID, ConfigParams.Secret);
        new JSONObject();
        final JSONObject sendPost = HttpSendShort.sendPost(url, jsonObject);
        logger.info("向企业号中添加成员:" + sendPost);
        return sendPost;
    }

    /**
     * 向标签中添加成员
     * @author zhengdong 2016年11月8日 上午11:24:36
     * @param jsonObject
     * @return
     */
    public static JSONObject addTagUsers(JSONObject jsonObject) {
        final String url = "https://qyapi.weixin.qq.com/cgi-bin/tag/addtagusers?access_token="
            + get_AccessToken(ConfigParams.CorpID, ConfigParams.Secret);
        new JSONObject();
        final JSONObject sendPost = HttpSendShort.sendPost(url, jsonObject);
        logger.info("向标签中添加成员:" + sendPost);
        return sendPost;
    }

    /**
     * 删除标签成员
     * @author zhengdong 2016年11月8日 上午11:26:51
     * @param jsonObject
     * @return
     */
    public static JSONObject delTagUsers(JSONObject jsonObject) {
        final String url = "https://qyapi.weixin.qq.com/cgi-bin/tag/deltagusers?access_token="
            + get_AccessToken(ConfigParams.CorpID, ConfigParams.Secret);
        new JSONObject();
        final JSONObject sendPost = HttpSendShort.sendPost(url, jsonObject);
        return sendPost;
    }

    public static void main(String[] args) {
        System.out.println("返回结果：" + getAllWXUser());

    }
}
