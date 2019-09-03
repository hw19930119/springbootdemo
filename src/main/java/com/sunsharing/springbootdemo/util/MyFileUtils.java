package com.sunsharing.springbootdemo.util;

import com.sunsharing.component.utils.base.StringUtils;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLDecoder;
import java.util.*;

/**
 * @author Tom
 */
public class MyFileUtils {

	/**
	 *
	 */
	public static void qrOutputToClient(HttpServletRequest request, HttpServletResponse response, String filePath, String fileName)
			throws IOException {
		// 当前文件路径
		File file = new File(filePath);
		// 设置response的Header
		// 1.设置文件ContentType类型，这样设置，会自动判断下载文件类型
		response.setContentType("image/jpeg;charset=utf-8");
		// 2.设置文件头：最后一个参数是设置下载文件名(假如我们叫a.pdf)
		response.setHeader("Content-Disposition", "attachment;fileName="+fileName);
		ServletOutputStream out = null;
		FileInputStream inputStream = null;
		try {
			inputStream = new FileInputStream(file);
			// 3.通过response获取ServletOutputStream对象(out)
			out = response.getOutputStream();
			byte[] buffer = new byte[1024];
			int len;
			while ((len = inputStream.read(buffer)) > 0) {
				// 4.写到输出流(out)中
				out.write(buffer, 0, len);
				out.flush();
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (inputStream != null) {
				inputStream.close();
			}
			if (out != null) {
				out.close();
				out.flush();
			}
		}
	}
}
