package com.sunsharing.springbootdemo.web.common;

import com.sunsharing.component.utils.base.DateUtils;
import com.sunsharing.component.utils.base.StringUtils;
import com.sunsharing.springbootdemo.configuration.properties.ConfigParams;
import com.sunsharing.springbootdemo.constant.MediaType;
import com.sunsharing.springbootdemo.model.vo.FileVo;
import com.sunsharing.springbootdemo.util.FileApiHelper;
import com.sunsharing.share.webex.annotation.ShareRest;
import com.sunsharing.share.webex.exception.ShareBusinessException;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import lombok.extern.log4j.Log4j2;

@RestController
@ConditionalOnExpression("'${isInnerNetwork}'=='false' || '${isInnerNetwork}'=='both' ")
@RequestMapping("/file")
@Log4j2
@ShareRest
public class FileController {
    @RequestMapping(value = "/upload-file-to-fs")
    public Object uploadFileToFs(Model model, @RequestParam("file") MultipartFile file, @RequestParam("mediaBizType") String mediaBizType,
                                 HttpServletRequest request) {
        log.info("本地文件上传成功:" + file.getName());
        FileVo fileVo = null;
        //web缓存目录
        final String rawFileDir = new StringBuilder().append(ConfigParams.localTempDir).append(File.separator).append("upload")
            .append(File.separator).append(DateUtils.getDBString(new Date()).substring(0, 8)).toString();
        // 判断文件目录是否创建 // 创建目录并且连带父目录一起创建
        final File directoryFile = new File(rawFileDir);
        if (!directoryFile.exists()) {
            directoryFile.mkdirs();
        }
        String fileName = StringUtils.generateUUID();
        final String originalFileName = file.getOriginalFilename();
        final String suffix = originalFileName.substring(originalFileName.lastIndexOf("."), originalFileName.length());

        File tempFile = new File(directoryFile, fileName + suffix);
        try {
            file.transferTo(tempFile.getAbsoluteFile());
            log.info("本地文件转存到缓存目录成功，路径:" + tempFile.getAbsolutePath());
            // 文件存储到fs上面去
            String mediaType = MediaType.MediaTypeMap.get(suffix);
            if (org.apache.commons.lang3.StringUtils.isBlank(mediaType)) {
                mediaType = MediaType.VIDEO;
            }
            final String fsPath = FileApiHelper.saveFileByMediaTypeReturnWithServletPath(tempFile, mediaType);
            fileVo = new FileVo();
            fileVo.setMediaType(mediaType);
            fileVo.setMediaBizType(mediaBizType);
            fileVo.setShowUri(fsPath);
            log.info("本地文件上传至FS成功，路径:" + fsPath);
        } catch (IOException e) {
            log.error("上传文件失败，错误信息：" + ExceptionUtils.getFullStackTrace(e));
            throw new ShareBusinessException(1500, "文件上传失败");//由框架解决
        } finally {
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
        log.info("/upload-file-to-fs 返回数据：" + fileVo);
        return fileVo;
    }
}
