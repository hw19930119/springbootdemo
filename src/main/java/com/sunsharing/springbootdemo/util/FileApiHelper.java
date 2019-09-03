package com.sunsharing.springbootdemo.util;

import com.sunsharing.common.file.FileApi;
import com.sunsharing.common.file.FileFactory;
import com.sunsharing.common.file.impl.HDFS;
import com.sunsharing.springbootdemo.configuration.properties.ConfigParams;
import com.sunsharing.springbootdemo.constant.MediaType;
import com.sunsharing.springbootdemo.constant.OldFileStoreNameUrl;

import org.apache.commons.lang3.StringUtils;

import java.io.File;

public class FileApiHelper {
    public static String getFsProjectPath(){
        String fsProjectPath = File.separator + ConfigParams.bizProjectName;
        return fsProjectPath;
    }


    public static String saveFileByMediaTypeReturnWithServletPath(File file, String mediaType) {
        FileApi fileApi = FileFactory.api();
        String fsFullPath = "";
        if (fileApi instanceof HDFS) {
            fsFullPath = ((HDFS) fileApi).saveFile(file, getFsProjectPath());
        } else {
            fsFullPath = fileApi.saveFile(file);
        }
        fsFullPath = getOldServletDir(mediaType) + fsFullPath;
        return fsFullPath;
    }

    public static String getOldServletDir(String mediaType) {
        String oldServletDir = "";
        if (StringUtils.equals(mediaType, MediaType.PICTURE)) {
            oldServletDir += OldFileStoreNameUrl.PREFIX_IMG;
        } else if (StringUtils.equals(mediaType, MediaType.AUDIO)) {
            oldServletDir += OldFileStoreNameUrl.PREFIX_AUDIO;
        } else if (StringUtils.equals(mediaType, MediaType.VIDEO)) {
            oldServletDir += OldFileStoreNameUrl.PREFIX_VEDIO;
        }
        return oldServletDir;
    }
}
