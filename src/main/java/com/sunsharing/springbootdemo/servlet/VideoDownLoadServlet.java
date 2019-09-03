package com.sunsharing.springbootdemo.servlet;

import com.sunsharing.common.file.FileApi;
import com.sunsharing.common.file.FileFactory;
import com.sunsharing.springbootdemo.constant.MediaType;

import org.apache.commons.lang3.tuple.Pair;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class VideoDownLoadServlet extends HttpServlet {
    private static final long serialVersionUID = -4796076699469752783L;

    public VideoDownLoadServlet() {
    }


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String range = request.getHeader("Range");//Range:bytes=9568256-
        if (org.apache.commons.lang3.StringUtils.isBlank(range)) {
            normalDoGet(request, response);
            return;
        }
        range = range.replace("bytes=", "");
        String[] rangeArray = range.split("-");

        String path = request.getPathInfo();
        path = path.split(";")[0];
        if (org.apache.commons.lang3.StringUtils.isBlank(path)) {
            return;
        }
        int idx = path.lastIndexOf(".");
        String filenameTail = idx == -1 ? "" : path.substring(idx);
        int lastIndex = path.lastIndexOf("/");
        String headAttachmentFileName = URLDecoder.decode(path.substring(lastIndex + 1), "UTF-8");
        //response 标准设置
        //response.setHeader("Content-Disposition", "attachment; filename=" + new String(headAttachmentFileName.getBytes("UTF-8"), "ISO8859-1"));

        String contentType = MediaType.ContentTypeMap.get(filenameTail);
        response.setContentType(contentType);
        response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
        response.setHeader("Accept-Ranges", "bytes");
            /*response.setHeader("Date", "02 Aug 2019 08:30:29 GMT");
            response.setHeader("ETag", "42b795-4867d5fcac1c0");
            response.addDateHeader("Last-Modified", DateUtils.addDay(new Date(), -1).getTime());
            response.addDateHeader("Expires", DateUtils.addDay(new Date(), 1).getTime());*/

            /*response.setHeader("ETag", Long.toString(System.currentTimeMillis()));
            response.addDateHeader("Last-Modified", System.currentTimeMillis());
            response.addDateHeader("Expires", System.currentTimeMillis() + 2592000000L);*/

        //一边读一边输出
        OutputStream os = null;
        FileApi fileApi = FileFactory.api();

        Long readLength = 1000000L;//1MB buffer
        Long start = 0L;
        if (rangeArray.length >= 1) {
            start = Long.parseLong(rangeArray[0]);
        }
        Long end = 0L;
        if (rangeArray.length == 2) {//有end头
            end = Long.parseLong(rangeArray[1]);
        } else {
            end = start + readLength - 1;
        }
        if (end - start > readLength - 1) {//太大，弄小
            end = start + readLength - 1;
        }

        Long fileLength = 0L;
        Pair<byte[], Long> pair = null;
        byte[] bytes = null;
        try {
            //确定坐标
            //读
            pair = fileApi.readFileBlock(path, start, end);
            if (pair != null) {
                bytes = pair.getKey();
                fileLength = pair.getValue();
            }
            if (bytes == null || bytes.length == 0) {
                throw new Exception();
            }
            end = new Long(start + bytes.length - 1);
            response.setContentLength(new Long(end - start + 1).intValue());
            response.setHeader("Content-Range", String.format("bytes %s-%s/%s", start, end, fileLength));
            os = response.getOutputStream();

            /*System.out.println("fileLength:" + fileLength);*/

            //继续-----------------------------------------------
            if (bytes != null && bytes.length != 0) {
                os.write(bytes);
            }


           /* System.out.println("bytes.length:" + bytes.length);
            System.out.println("start:" + start);
            System.out.println("end:" + end);*/
        } catch (Exception var14) {
            //log.error(ExceptionUtils.getFullStackTrace(var14));
            log.error("读取文件失败：" + path);
            /*if (!(var14 instanceof FileNotFoundException) && (var14.getCause() == null || !(var14.getCause() instanceof FileNotFoundException))) {
                response.sendError(500, var14.getMessage());
            } else {
                response.sendError(404, var14.getMessage());
            }*/
            return;
        } finally {
            if (os != null) {
                os.flush();
                os.close();
            }
        }
    }


    protected void normalDoGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        boolean changeStatus = this.getResponseStatus(request, response);
        if (changeStatus) {
            String path = request.getPathInfo();
            path = path.split(";")[0];
            if (!com.sunsharing.component.utils.base.StringUtils.isBlank(path)) {
                int idx = path.lastIndexOf(".");
                String filenameTail = idx == -1 ? "" : path.substring(idx);
                String headAttachmentFileName = request.getParameter("name");
                if (com.sunsharing.component.utils.base.StringUtils.isBlank(headAttachmentFileName)) {
                    int lastIndex = path.lastIndexOf("/");
                    headAttachmentFileName = URLDecoder.decode(path.substring(lastIndex + 1), "UTF-8");
                }

                response.setHeader("Content-Disposition", "attachment; filename=" + new String(headAttachmentFileName.getBytes("UTF-8"), "ISO8859-1"));
                response.setContentType("video/mp4");

                OutputStream os = response.getOutputStream();
                FileApi fileApi = FileFactory.api();
                Object var12 = null;

                byte[] bytes;
                try {
                    bytes = fileApi.readFile(path);
                } catch (Exception var14) {
                    log.error("读取文件失败：" + path, var14);
                    if (!(var14 instanceof FileNotFoundException) && (var14.getCause() == null || !(var14.getCause() instanceof FileNotFoundException))) {
                        response.sendError(500, var14.getMessage());
                    } else {
                        response.sendError(404, var14.getMessage());
                    }

                    return;
                }

                response.setHeader("ETag", Long.toString(System.currentTimeMillis()));
                response.setStatus(200);
                response.addDateHeader("Last-Modified", System.currentTimeMillis());
                response.addDateHeader("Expires", System.currentTimeMillis() + 2592000000L);
                if (bytes != null) {
                    os.write(bytes);
                }
                os.flush();
                os.close();
            }
        }

    }

    public boolean getResponseStatus(HttpServletRequest request, HttpServletResponse response) {
        long headerTime = request.getDateHeader("If-Modified-Since");
        if (headerTime > 0L) {
            response.setStatus(304);
            return false;
        } else {
            String previousToken = request.getHeader("If-None-Match");
            if (previousToken != null) {
                response.setStatus(304);
                return false;
            } else {
                return true;
            }
        }
    }
}

