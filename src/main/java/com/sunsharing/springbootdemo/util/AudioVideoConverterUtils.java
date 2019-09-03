package com.sunsharing.springbootdemo.util;

import com.sunsharing.springbootdemo.configuration.properties.ConfigParams;

import it.sauronsoftware.jave.AudioAttributes;
import it.sauronsoftware.jave.Encoder;
import it.sauronsoftware.jave.EncoderException;
import it.sauronsoftware.jave.EncodingAttributes;
import it.sauronsoftware.jave.InputFormatException;
import it.sauronsoftware.jave.VideoAttributes;

import org.apache.log4j.Logger;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.MessageFormat;

/**
 * <p>
 * amr格式文件转mp3文件格式
 * </p>
 * @author hanjianbo 2017年2月14日 上午11:44:03
 * @version V1.0
 * @modificationHistory=========================逻辑或功能性重大变更记录
 * @modify by user: {修改人} 2017年2月14日
 * @modify by reason:{方法名}:{原因}
 */
public class AudioVideoConverterUtils {

    static Logger logger = Logger.getLogger(AudioVideoConverterUtils.class);

    /**
     * 将amr文件转换为mp3文件 windows
     * @author hanjianbo 2017年2月14日 下午2:25:16
     * @param amrFile amr后缀文件
     * @param targetFile mp3 后缀文件
     * @throws IllegalArgumentException
     * @throws InputFormatException
     * @throws EncoderException
     */
    public static void amrToMp3(File amrFile, File targetFile)
        throws IllegalArgumentException, InputFormatException, EncoderException {
        final AudioAttributes audio = new AudioAttributes();
        final Encoder encoder = new Encoder();
        audio.setCodec("libmp3lame");
        audio.setBitRate(new Integer(128000));
        audio.setChannels(new Integer(2));
        audio.setSamplingRate(new Integer(44100));
        final EncodingAttributes attributes = new EncodingAttributes();
        attributes.setFormat("mp3");
        attributes.setAudioAttributes(audio);
        encoder.encode(amrFile, targetFile, attributes);
    }

    /**
     * 将amr文件转换成MP3文件 Linux
     * @author hanjianbo 2017年3月2日 下午2:18:12
     * @param sourePath 待转换文件存储路径
     * @param targerPath 目标文件存储路径
     */
    public static boolean amrToMp3(String sourePath, String targerPath) {
        final String command = ConfigParams.file_conversion_path + MessageFormat.format(ConfigParams.command_amrTomp3, sourePath, targerPath);
        logger.info("Linux amr转换Mp3文件 ，执行转换命令 ：" + command);
        Runtime rt = null;
        BufferedReader br = null;
        try {
            rt = Runtime.getRuntime();
            final Process proc = rt.exec(command);
            final InputStream stderr = proc.getErrorStream();
            final InputStreamReader isr = new InputStreamReader(stderr);
            br = new BufferedReader(isr);
            String line = null;
            while ((line = br.readLine()) != null) {
                logger.info("转换文件流：" + line);
            }
            final int exitVal = proc.waitFor();
            logger.info("转换结果：exitVal = " + exitVal);
            return exitVal == 0;
        } catch (final Throwable t) {
            logger.error("在Linux下周转换音频文件失败", t);
            return false;
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (final IOException e) {
                    logger.error(e);
                }
            }
            if (rt != null) {
                rt.freeMemory();// 释放内存
            }
        }
    }

    /**
     * 在windows下将视频文件转换成mp4格式
     * @author hanjianbo 2017年3月30日 下午2:56:07
     * @param soureFile 源文件
     * @param targerFile 转译文件
     * @throws EncoderException
     * @throws InputFormatException
     * @throws IllegalArgumentException
     */
    public static void toMp4File(File soureFile, File targerFile)
        throws IllegalArgumentException, InputFormatException, EncoderException {
        final AudioAttributes audio = new AudioAttributes();
        audio.setCodec("libmp3lame");
        audio.setBitRate(new Integer(128000));
        audio.setChannels(new Integer(2));
        audio.setSamplingRate(new Integer(44100));
        final VideoAttributes video = new VideoAttributes();
        video.setCodec("mpeg4");
        video.setBitRate(new Integer(160000));
        video.setFrameRate(new Integer(15));
        final EncodingAttributes attrs = new EncodingAttributes();
        attrs.setFormat("mp4");
        attrs.setAudioAttributes(audio);
        attrs.setVideoAttributes(video);
        final Encoder encoder = new Encoder();
        encoder.encode(soureFile, targerFile, attrs);
    }

    /**
     * 将MOV文件转换成mp4
     * @author hanjianbo 2017年3月3日 下午2:25:39
     * @param sourePath 待转换文件存储路径
     * @param targerPath 目标文件存储路径
     */
    public static boolean toMp4File(String sourePath, String targerPath) {
        final String command = ConfigParams.file_conversion_path + MessageFormat.format(ConfigParams.command_toMp4, sourePath, targerPath);
        logger.info("Linux 转换Mp4文件 ，执行转换命令 ：" + command);
        Runtime rt = null;
        BufferedReader br = null;
        try {
            rt = Runtime.getRuntime();
            final Process proc = rt.exec(command);
            final InputStream stderr = proc.getErrorStream();
            final InputStreamReader isr = new InputStreamReader(stderr);
            br = new BufferedReader(isr);
            String line = null;
            while ((line = br.readLine()) != null) {
                logger.info("转换文件流MP4：" + line);
            }
            final int exitVal = proc.waitFor();
            logger.info("转换结果：exitVal = " + exitVal);
            return exitVal == 0;
        } catch (final Throwable t) {
            t.printStackTrace();
            return false;
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (final IOException e) {
                    e.printStackTrace();
                }
            }
            if (rt != null) {
                rt.freeMemory();// 释放内存
            }
        }
    }
}
