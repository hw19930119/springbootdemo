package com.sunsharing.springbootdemo.util.weixin;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.sunsharing.component.utils.base.StringUtils;
import org.apache.commons.io.Charsets;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.XPath;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.XMLWriter;

import java.io.*;
import java.net.*;
import java.util.HashMap;
import java.util.List;

public class HttpSendShort {
	
	static Logger logger = Logger.getLogger(HttpSendShort.class);
	
	/**
	 * 发送请求
	 * 
	 * @param body
	 * @param wsdl
	 * @param action
	 * @return
	 * @throws Exception
	 */
	public static String sendByHttpClient(String body, String wsdl, String action) throws Exception {
		logger.info("发送报文：" + body);
		StringBuffer sb = new StringBuffer();
		if (wsdl.endsWith("wsdl") || wsdl.endsWith("WSDL")) {
			wsdl = wsdl.substring(0, wsdl.length() - 5);
			sendStrOfPost(wsdl, body, "UTF-8", sb, action);
		} else {
			if (StringUtils.isBlank(action)) {
				action = "application/json";
			}
			if (wsdl.indexOf("token") != -1) {
				return sendStrOfGet(wsdl);
			}
			sendStrOfPost(wsdl, body, "UTF-8", sb, "", "GET", action);
			logger.info("返回报文1：" + sb.toString());
			return sb.toString();
		}
		logger.info("返回报文：" + sb.toString());
		return writeWrite(sb);
	}
	
	/**
	 * 以URL方式发送数据
	 * 
	 * @param urlStr 发送地址
	 * @param contentStr 发送内容
	 * @param charset 发送字符集
	 * @param sResult 返回数据Buffer
	 * @param action 设置发送形式
	 * @return boolean 发送是否成功
	 */
	public static boolean sendStrOfPost(String urlStr, String contentStr, String charset, StringBuffer sResult, String action) {
		return sendStrOfPost(urlStr, contentStr, charset, sResult, action, "POST", "");
	}
	
	/**
	 * 以URL方式发送数据
	 * 
	 * @param urlStr 发送地址
	 * @param contentStr 发送内容
	 * @param charset 发送字符集
	 * @param sResult 返回数据Buffer
	 * @param action 设置发送形式
	 * @param requestMethod 提交方式
	 * @param accept 接收数据形式
	 * @return boolean 发送是否成功
	 */
	public static boolean sendStrOfPost(String urlStr, String contentStr, String charset, StringBuffer sResult, String action,
	        String requestMethod, String accept) {
		logger.info(urlStr + "=" + contentStr + "=" + charset + "=" + accept + "=" + requestMethod);
		boolean bResult = false;
		String charsetName = charset;
		URL url = null;
		HttpURLConnection httpConnection = null;
		InputStream httpIS = null;
		BufferedReader http_reader = null;
		try {
			url = new URL(urlStr);
			httpConnection = (HttpURLConnection)url.openConnection();

			// 设置连接主机超时(单位:毫秒)
			httpConnection.setConnectTimeout(10000);
			// 设置从主机读取数据超时(单位:毫秒)
			httpConnection.setReadTimeout(20000);

			httpConnection.setRequestMethod(requestMethod); // POST方式提交数据
			httpConnection.setDoOutput(true);
			httpConnection.setRequestProperty("Content-Length", String.valueOf(contentStr.getBytes().length));
			if (!StringUtils.isBlank(accept)) {
				httpConnection.setRequestProperty("Accept", accept);// "application/json"
			} else {
				httpConnection.setRequestProperty("SOAPAction", action);
				if (!StringUtils.isBlank(action)) {
					httpConnection.setRequestProperty("Content-Type", "text/xml;charset=UTF-8");
				}
			}
			// , soapAction
			PrintWriter out = null;
			out = new PrintWriter(new OutputStreamWriter(httpConnection.getOutputStream(), charsetName));// 此处改动
			// 发送请求
			out.print(contentStr);
			out.flush();
			out.close();
			int responseCode = httpConnection.getResponseCode();
			if (responseCode == HttpURLConnection.HTTP_OK) {
				// 发送正常
				bResult = true;

				// 读取数据
				httpIS = httpConnection.getInputStream();
				http_reader = new BufferedReader(new InputStreamReader(httpIS, charsetName));
				String line = null;
				while ((line = http_reader.readLine()) != null) {
					if (sResult.length() > 0) {
						sResult.append("\n");
					}
					sResult.append(line);
				}
				logger.info("[URL][response][success]" + sResult);
			} else {
				logger.info("[URL][response][failure][code : " + responseCode + " ]");
			}
		} catch (Exception e) {
			logger.error("[HttpUtil]sendStrOfPost error", e);
			throw new RuntimeException("调用服务出错");
		} finally {
			try {
				if (http_reader != null) {
					try {
						http_reader.close();
					} catch (Exception e) {
						
					}
				}
				if (httpIS != null) {
					try {
						httpIS.close();
					} catch (Exception e) {
						
					}
				}
				if (httpConnection != null) {
					httpConnection.disconnect();
				}
			} catch (Exception e) {
				logger.error("[HttpUtil]finally error", e);
			}
		}
		
		return bResult;
	}
	
	public static String sendStrOfGet(String url) throws IOException {
		
		StringBuffer sBuffer = new StringBuffer();
		BufferedReader reader = null;
		HttpURLConnection connection = null;
		try {
			// 拼凑get请求的URL字串
			String getURL = url;
			URL getUrl = new URL(getURL);
			// 根据拼凑的URL，打开连接，URL.openConnection()函数会根据
			// URL的类型，返回不同的URLConnection子类的对象，在这里我们的URL是一个http，因此它实际上返回的是HttpURLConnection
			connection = (HttpURLConnection)getUrl.openConnection();
			// 建立与服务器的连接，并未发送数据
			connection.connect();
			// 发送数据到服务器并使用Reader读取返回的数据
			reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
			String lines;
			while ((lines = reader.readLine()) != null) {
				sBuffer.append(lines);
			}
		} catch (Exception e) {
			logger.error("[HttpUtil]sendStrOfGet error", e);
			throw new RuntimeException("调用服务出错");
		} finally {
			reader.close();
			// 断开连接
			connection.disconnect();
		}
		logger.info("get返回报文:" + sBuffer.toString());
		return sBuffer.toString();
	}
	
	public static void main(String[] a) throws Exception {
		// String str =
		// HttpSendShort.sendByHttpClient("<soapenv:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:web=\"http://webservice.sinosoft.com\">\n"
		// +
		// "   <soapenv:Header/>\n" +
		// "   <soapenv:Body>\n" +
		// "      <web:returnString soapenv:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\n"
		// +
		// "         <name xsi:type=\"soapenc:string\" xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\">1</name>\n"
		// +
		// "      </web:returnString>\n" +
		// "   </soapenv:Body>\n" +
		// "</soapenv:Envelope>","http://192.168.0.142:8082/ws/services/helloService?wsdl");
		//
		// System.out.println(str);
		ServerSocket s = new ServerSocket(9000);
		Socket ss = s.accept();
		InputStream input = ss.getInputStream();
		byte[] aa = new byte[1024];
		int len = 0;
		while ((len = input.read(aa)) != -1) {
			System.out.print(new String(aa, 0, len));
		}
	}
	
	public static String writeWrite(StringBuffer buffer) throws Exception {
		Document doc = DocumentHelper.parseText(buffer.toString());
		
		HashMap xmlMap = new HashMap();
		xmlMap.put("env", "http://www.w3.org/2003/05/soap-envelope");
		XPath x = doc.createXPath("//env:Body");
		x.setNamespaceURIs(xmlMap);
		
		org.dom4j.Element result = (org.dom4j.Element)x.selectSingleNode(doc);
		if (result == null) {
			HashMap xmlMap2 = new HashMap();
			xmlMap2.put("env", "http://schemas.xmlsoap.org/soap/envelope/");
			XPath x2 = doc.createXPath("//env:Body");
			x2.setNamespaceURIs(xmlMap2);
			result = (org.dom4j.Element)x2.selectSingleNode(doc);
		}
		List list = result.elements();
		if (list.size() > 0) {
			org.dom4j.Element lll = (org.dom4j.Element)list.get(0);
			org.dom4j.Element list2 = null;
			if ((lll).elements().size() > 0) {
				list2 = (org.dom4j.Element)((lll).elements().get(0));
				if (list2.elements().size() == 0) {
					return list2.getText();
				} else {
					Document returnDoc = DocumentHelper.createDocument();
					returnDoc.add((org.dom4j.Element)list2.clone());
					OutputFormat format = new OutputFormat("    ", true);
					// 设置编码
					format.setEncoding("UTF-8");
					// xml输出器
					StringWriter out = new StringWriter();
					XMLWriter xmlWriter = new XMLWriter(out, format);
					// 打印doc
					xmlWriter.write(returnDoc);
					xmlWriter.flush();
					// 关闭输出器的流，即是printWriter
					String s = out.toString();
					out.close();
					return s;
				}
			} else {
				return lll.getText();
			}
			
			// Document returnDoc = DocumentHelper.createDocument();
			// returnDoc.add((org.dom4j.Element)list2.clone());
			// OutputFormat format = new OutputFormat("    ", true);
			// //设置编码
			// format.setEncoding("UTF-8");
			// //xml输出器
			// StringWriter out = new StringWriter();
			// XMLWriter xmlWriter = new XMLWriter(out, format);
			// //打印doc
			// xmlWriter.write(returnDoc);
			// xmlWriter.flush();
			// //关闭输出器的流，即是printWriter
			// String s = out.toString();
			// out.close();
			// return list2.toString();
		}
		return buffer.toString();
	}
	
	public static String getHTML(String httpUrl, String Charset) {
		String html = "";
		
		try {
			URL url = new URL(httpUrl.toString());
			StringBuffer document = new StringBuffer();
			try {
				URLConnection urlCon = url.openConnection();
				BufferedReader reader = new BufferedReader(new InputStreamReader(urlCon.getInputStream()));
				String Result = "";
				while ((Result = reader.readLine()) != null) {
					document.append(Result);
				}
				
				html = document.toString();
			} catch (IOException e) {
				html = "服务未响应";
				
			}
		} catch (MalformedURLException e) {
			html = "不支持的协议";
			
		}
		
		return html;
	}
	
	/**
	 * 发送post请求
	 * 
	 * @param url
	 * @param param 封装一个 JSON 对象
	 * @return JSONObject
	 * @throws Exception
	 */
	public static JSONObject sendPost(String url, JSONObject param) {
		try {
			HttpPost request = new HttpPost(url);
			// 绑定到请求 Entry
			StringEntity se = new StringEntity(param.toString(), Charsets.UTF_8);
			request.setEntity(se);
			logger.info("开始准备发送sendPost请求到微信....");
			HttpResponse httpResponse = new DefaultHttpClient().execute(request);
			// 得到应答的字符串，这也是一个 JSON 格式保存的数据
			String retSrc = EntityUtils.toString(httpResponse.getEntity(), Charsets.UTF_8);
			logger.info("结束发送sendPost请求到微信->返回：" + retSrc);
			// 生成 JSON 对象
			JSONObject jobj = JSON.parseObject(retSrc);
			return jobj;
		} catch (Exception e) {
			logger.info(e);
			e.printStackTrace();
		}
		return null;
		
	}
	
}
