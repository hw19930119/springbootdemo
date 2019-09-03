/**
 * @(#)SigUtils 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br>
 *              Copyright: Copyright (c) 2015 <br>
 *              Company:厦门畅享信息技术有限公司 <br>
 * @author ulyn <br>
 *         15-12-28 下午4:37 <br>
 * @version 1.0 ———————————————————————————————— 修改记录 修改者： 修改时间： 修改原因： ————————————————————————————————
 */

package com.sunsharing.springbootdemo.util.weixin.jssdk;

import com.sunsharing.component.utils.base.StringUtils;
import com.sunsharing.springbootdemo.configuration.properties.ConfigParams;
import com.sunsharing.springbootdemo.util.HashUtil;
import com.sunsharing.springbootdemo.util.RequestUtil;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

/**
 * <pre></pre>
 *
 * <br>
 * ---------------------------------------------------------------------- <br>
 * <b>功能描述:</b> <br>
 * 提供给其他业务系统使用微信api功能的辅助类 <br>
 * 注意事项: <br>
 * <br>
 * <br>
 * ---------------------------------------------------------------------- <br>
 */
public class MyWxQyhHelpUtils {

    // private static Logod logod = LogodManager.getLogod(MyWxHelpUtils.class);

    public static String generateConfigJson(HttpServletRequest request) {
        String ticket = WXClientCacheService.getQYHTicket();
        String fullURL = request.getHeader("Referer");//ConfigParams.project_url+RequestUtil.getFullRequestURL(, request).getFullURL();
        String res = Sign.getRes(ticket, fullURL, ConfigParams.CorpID);
        return res;
    }

    public static boolean isURL(String str) {
        if (StringUtils.isBlank(str)) {
            return false;
        }
        // 转换为小写
        str = str.toLowerCase();
        String regex = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
            + "(([0-9]{1,3}\\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
            + "|" // 允许IP和DOMAIN（域名）
            + "([0-9a-z_!~*'()-]+\\.)*" // 域名- www.
            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\\." // 二级域名
            + "[a-z]{2,6})" // first level domain- .com or .museum
            + "(:[0-9]{1,4})?" // 端口- :80
            + "((/?)|" // a slash isn't required if there is no file name
            + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
        Pattern p = Pattern.compile(regex);
        Matcher matcher = p.matcher(str);
        return matcher.matches();
    }

    /**
     * iframe方式提供给业务系统 使用微信API的的签名方法，简单实现，使用的系统自己做这层签名 有签名 才允许调用
     * @param url
     * @return
     */
    public static String sig(String timestamp, String url) {
        String str = HashUtil.sha1(String.format("timestamp=%s&url=%s&key=%s", timestamp, url, "sunsharing_aiyoyo"));
        return str;
    }

    public static void throwExceptionIfNotAuth(String sig, String timestamp, String url) {
        if (isURL(url)) {
            // logod.info("校验签名URL错误，sig={},timestamp={},url={}",sig,timestamp,url);
            throw new RuntimeException("校验签名URL错误");
        }
        if (!sig(timestamp, url).equals(sig)) {
            // logod.info("校验签名错误，sig={},timestamp={},url={}",sig,timestamp,url);
            throw new RuntimeException("校验签名错误");
        }
        return;
    }

}
