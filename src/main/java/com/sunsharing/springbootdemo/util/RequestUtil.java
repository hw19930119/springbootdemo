/**
 * @(#)RequestUtil 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 * 
 * <br>
 *                 Copyright: Copyright (c) 2015 <br>
 *                 Company:厦门畅享信息技术有限公司 <br>
 * @author ulyn <br>
 *         15-12-23 下午3:58 <br>
 * @version 1.0 ———————————————————————————————— 修改记录 修改者： 修改时间： 修改原因： ————————————————————————————————
 */
package com.sunsharing.springbootdemo.util;

import javax.servlet.http.HttpServletRequest;

/**
 * <pre></pre>
 * 
 * <br>
 * ---------------------------------------------------------------------- <br>
 * <b>功能描述:</b> <br>
 * <br>
 * 注意事项: <br>
 * <br>
 * <br>
 * ---------------------------------------------------------------------- <br>
 */
public class RequestUtil {
	
	public static class RequestURL {
		
		String webPath; // 到上下文根
		String fullURL; // 当前全路径，包含queryString
		
		public RequestURL(String webPath, String fullURL) {
			this.webPath = webPath;
			this.fullURL = fullURL;
		}
		
		public String getFullURL() {
			return fullURL;
		}
		
		public String getWebPath() {
			return webPath;
		}
		
		public void setFullURL(String fullURL) {
			this.fullURL = fullURL;
		}
		
		public void setWebPath(String webPath) {
			this.webPath = webPath;
		}
	}
	
	public static RequestURL getFullRequestURL(HttpServletRequest request) {
		String location = request.getScheme() + "://" + request.getServerName();
		if (request.getServerPort() != 80) {
			location += ":" + request.getServerPort();
		}
		location += request.getContextPath();
		String reqUrl = location + request.getServletPath(); // 请求页面或其他地址
		if (request.getQueryString() != null) {
			reqUrl = reqUrl + "?" + (request.getQueryString()); // 参数
		}
		return new RequestURL(location, reqUrl);
	}
	
	/**
	 * 微信 获取地址
	 * @param weixinUrl
	 * @param request
	 * @return
	 */
	public static RequestURL getFullRequestURL(String weixinUrl, HttpServletRequest request) {
		String location = weixinUrl.substring(0, weixinUrl.length() - 1);
		
		String reqUrl = location + request.getServletPath(); // 请求页面或其他地址
		if (request.getQueryString() != null) {
			reqUrl = reqUrl + "?" + (request.getQueryString()); // 参数
		}
		return new RequestURL(location, reqUrl);
	}
}
