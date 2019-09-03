/*
 * @(#) TalentXmzdCollagen
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author hanjb
 * <br> 2019-07-17 10:59:20
 */

package com.sunsharing.springbootdemo.remote.collagen;

import com.sunsharing.common.utils.ThreeDS;
import com.sunsharing.share.common.text.Charsets;

import java.security.MessageDigest;

public interface OpenService {

    /**
     * webservice 服务端端代码
     * @param service service Bean 名称
     * @param method 方法名称
     * @param param 入参参数 ['']
     * @param digestCode 签名串，防篡改
     * @return json串
     */
    String callService(String service, String method, String param, String digestCode);

    /**
     * 生成签名串
     * @param service service Bean 名称
     * @param method 方法名称
     * @param param 入参参数 ['']
     * @return json串
     */
    public static String calcDigestCode(String service, String method, String param) throws Exception {
        byte[] keyBytes = new byte[]{70, 67, 54, 52, 51, 51, 50, 70, 52, 49, 50, 69, 65, 65, 49, 66, 65, 56, 69, 57, 56, 48, 49, 49};
        //byte[] keyBytes = service.getBytes(Charsets.UTF_8_NAME);
        StringBuffer srcBuf = new StringBuffer(method).append(param);

        //防止参数过长计算摘要耗资源，只提取前100K字节进行摘要；保证digestCode不会太长
        String src = srcBuf.substring(0, srcBuf.length() > 102400 ? 102400 : srcBuf.length());

        MessageDigest md5 = MessageDigest.getInstance("MD5");
        md5.update(src.getBytes(Charsets.UTF_8_NAME));

        return ThreeDS.byte2hex(ThreeDS.encryptMode(keyBytes, md5.digest()));
    }
}
