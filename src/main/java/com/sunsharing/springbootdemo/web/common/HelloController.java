package com.sunsharing.springbootdemo.web.common;



import com.alibaba.fastjson.JSONObject;
import com.sunsharing.component.utils.base.StringUtils;
import com.sunsharing.springbootdemo.model.dto.SelectOptionDto;
import com.sunsharing.springbootdemo.remote.proxy.ProxyClientContext;
import com.sunsharing.springbootdemo.service.SelectOptionService;
import com.sunsharing.share.webex.annotation.ShareRest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/hello")
@Log4j2
@ShareRest
public class HelloController {

    @GetMapping("/hello")
    public Object schoolOption() {
        SelectOptionService selectOptionService = ProxyClientContext.getBean(SelectOptionService.class);
        List<SelectOptionDto> list = selectOptionService.schoolOption();
        return list;
    }

    @RequestMapping("/ajaxGetRequest")
    public Object ajaxGetRequest(HttpServletRequest request, HttpServletResponse response,
                                 @RequestParam(value = "id",required = true)Integer id,
                                 @RequestParam(value = "name",required = true)String name) {
        JSONObject jsonObject=new JSONObject();
        jsonObject.put("id",id);
        jsonObject.put("name",name);
        jsonObject.put("id_Request",request.getParameter("id"));
        jsonObject.put("name_Request",request.getParameter("name"));
        return jsonObject;
    }
    @RequestMapping("/ajaxPostJsonRequest")
    public Object ajaxPostJsonRequest(HttpServletRequest request, HttpServletResponse response,
                                      @RequestBody JSONObject jsonObjectBody,
                                      //不行 @RequestParam(value = "id",required = true) Integer idRequestParam,
                                      @RequestParam(value = "queryParamsA",required = true) Integer queryParamsA,
                                      @RequestParam(value = "queryParamsB",required = true) String queryParamsB) {
        JSONObject jsonObject=new JSONObject();
        jsonObject.put("jsonObject",jsonObjectBody);
        //jsonObject.put("idRequestParam",idRequestParam);
        jsonObject.put("queryParamsA",queryParamsA);
        jsonObject.put("queryParamsB",queryParamsB);
        jsonObject.put("queryParamsA_Request",request.getParameter("queryParamsA"));
        jsonObject.put("queryParamsB_Request",request.getParameter("queryParamsB"));
        return jsonObject;
    }
    @RequestMapping("/ajaxPostFormUrlEncodedRequest")
    public Object ajaxPostFormUrlEncodedRequest(HttpServletRequest request, HttpServletResponse response,
                                                @RequestParam(value = "id",required = true) Integer id,
                                                @RequestParam(value = "name",required = true) String name,
                                                @RequestParam(value = "queryParamsA",required = true) Integer queryParamsA,
                                                @RequestParam(value = "queryParamsB",required = true) String queryParamsB) {
        JSONObject jsonObject=new JSONObject();
        jsonObject.put("id",id);
        jsonObject.put("name",name);
        jsonObject.put("id_Request",request.getParameter("id"));
        jsonObject.put("name_Request",request.getParameter("name"));
        jsonObject.put("queryParamsA",queryParamsA);
        jsonObject.put("queryParamsB",queryParamsB);
        jsonObject.put("queryParamsA_Request",request.getParameter("queryParamsA"));
        jsonObject.put("queryParamsB_Request",request.getParameter("queryParamsB"));
        return jsonObject;
    }
    @RequestMapping("/ajaxPostMultipartFormDataRequest")
    public Object ajaxPostMultipartFormDataRequest(HttpServletRequest request, HttpServletResponse response,
                                                   @RequestParam(value = "id",required = true) Integer id,
                                                   @RequestParam(value = "name",required = true) String name,
                                                   @RequestParam(value = "queryParamsA",required = true) Integer queryParamsA,
                                                   @RequestParam(value = "queryParamsB",required = true) String queryParamsB,
                                                   @RequestParam(value = "file",required = true) MultipartFile file) throws Exception{

        //文件处理
        String rawFileDir="C://opt";
        File directoryFile = new File(rawFileDir);
        if (!directoryFile.exists()) {
            // 创建目录并且连带父目录一起创建
            directoryFile.mkdirs();
        }
        String oldFileName = file.getOriginalFilename();
        final String suffix = oldFileName.substring(oldFileName.lastIndexOf("."), oldFileName.length());
        String fileName = StringUtils.generateUUID();
        File oldFile = new File(directoryFile, fileName + suffix);
        file.transferTo(oldFile.getAbsoluteFile());
        //返回数据
        JSONObject jsonObject=new JSONObject();
        jsonObject.put("id",id);
        jsonObject.put("name",name);
        jsonObject.put("id_Request",request.getParameter("id"));
        jsonObject.put("name_Request",request.getParameter("name"));
        jsonObject.put("queryParamsA",queryParamsA);
        jsonObject.put("queryParamsB",queryParamsB);
        jsonObject.put("queryParamsA_Request",request.getParameter("queryParamsA"));
        jsonObject.put("queryParamsB_Request",request.getParameter("queryParamsB"));
        jsonObject.put("filePath",oldFile.getAbsolutePath());
        return jsonObject;
    }
}
