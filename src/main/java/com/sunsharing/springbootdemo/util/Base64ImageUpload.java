package com.sunsharing.springbootdemo.util;

import com.sunsharing.component.utils.base.DateUtils;
import com.sunsharing.component.utils.base.StringUtils;
import com.sunsharing.springbootdemo.constant.MediaType;
import com.sunsharing.springbootdemo.configuration.properties.ConfigParams;
import com.sunsharing.share.webex.exception.ShareBusinessException;

import sun.misc.BASE64Decoder;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.Date;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class Base64ImageUpload {
    /**
     * 将传入的base64字符串转成图片，并存到FS(服务器上面去)
     * @author lixinqiao 2017年7月20日 上午10:37:43
     * @param request
     * @param imgPath
     * @return
     */
    public static String uplodToFS(String imgStr) {
        // 文件所在服务器目录地址
        final String rawFilePath = new StringBuilder().append(ConfigParams.localTempDir).append(File.separator).append("/base64")
            .append(File.separator).append(DateUtils.getDBString(new Date()).substring(0, 8)).toString();
        // 判断文件目录是否创建
        final File directoryFile = new File(rawFilePath);
        if (!directoryFile.exists()) {
            // 创建目录并且连带父目录一起创建
            directoryFile.mkdirs();
        }
        log.info("创建的文件目录为:" + rawFilePath);

        final String fileName = StringUtils.generateUUID() + ".png";
        // 将base64字符串转成图片
        try {
            final File imgFile = GenerateImage(imgStr, directoryFile, fileName);// 将base64字符串转成本地图片
            if (imgFile != null) {
                log.info("返回的文件名为:fileName=" + File.separator + imgFile.getName());
                // 将base64转换的图片保存到JFS中去,并将tomcat服务器中产生的临时图片删除掉了。
                String filePath = FileApiHelper.saveFileByMediaTypeReturnWithServletPath(imgFile, MediaType.PICTURE);
                log.info("保存后的图片路径为:filePath=" + filePath);
                return filePath;
            } else {
                throw new ShareBusinessException(1500, "base64字符串转成图片异常");//由框架解决
            }
        } catch (Exception e) {
            throw new ShareBusinessException(1500, "base64字符串转成图片异常");//由框架解决
        }
    }

    /**
     * 将base64字符串转成图片
     * @author lixinqiao 2017年4月11日 下午3:57:50
     * @param imgStr
     * @param directoryFile
     * @param fileName
     * @return
     */
    public static File GenerateImage(String imgStr, File directoryFile, String fileName) { // 对字节数组字符串进行Base64解码并生成图片
        log.info("接收到的base64字符串为:" + imgStr.length());
        String[] imgStrs = imgStr.split("data:image/png;base64,");
        if (imgStrs != null && imgStrs.length == 1) {
            imgStrs = imgStr.split("data:image/jpeg;base64,");
        }
        if (imgStr == null || imgStrs.length < 2) {
            return null;
        }
        if (imgStrs.length > 1) {
            imgStr = imgStrs[1];
        }
        final BASE64Decoder decoder = new BASE64Decoder();
        File soureFile = null;
        try {
            // Base64解码
            final byte[] b = decoder.decodeBuffer(imgStr);
            for (int i = 0; i < b.length; ++i) {
                if (b[i] < 0) {// 调整异常数据
                    b[i] += 256;
                }
            }
            // 请求成功后创建文件
            soureFile = new File(directoryFile, fileName);
            if (!soureFile.exists()) {
                soureFile.createNewFile();
            }
            final OutputStream out = new FileOutputStream(soureFile);
            out.write(b);
            out.flush();
            out.close();
            return soureFile;
        } catch (final Exception e) {
            e.printStackTrace();
            log.info("base64字符串转图片异常!");
            return soureFile;
        }
    }
}
