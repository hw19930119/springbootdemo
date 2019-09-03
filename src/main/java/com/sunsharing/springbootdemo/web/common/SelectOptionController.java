package com.sunsharing.springbootdemo.web.common;

import com.sunsharing.springbootdemo.model.dto.SelectOptionDto;
import com.sunsharing.springbootdemo.remote.proxy.ProxyClientContext;
import com.sunsharing.springbootdemo.service.SelectOptionService;
import com.sunsharing.share.webex.annotation.ShareRest;

import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.log4j.Log4j2;

@RestController
@ConditionalOnExpression("'${isInnerNetwork}'=='false' || '${isInnerNetwork}'=='both' ")
@RequestMapping("/select-option")
@Log4j2
@ShareRest
public class SelectOptionController {

    @GetMapping("/school-option")
    public Object schoolOption() {
        SelectOptionService selectOptionService = ProxyClientContext.getBean(SelectOptionService.class);
        List<SelectOptionDto> list = selectOptionService.schoolOption();
        return list;
    }

    @GetMapping("/subject-type-option")
    public Object subjectTypeOption() {
        SelectOptionService selectOptionService = ProxyClientContext.getBean(SelectOptionService.class);
        List<SelectOptionDto> list = selectOptionService.subjectTypeOption();
        return list;
    }

    @GetMapping("/teacher-option")
    public Object teacherOption(HttpServletRequest request, HttpServletResponse response) {
        SelectOptionService selectOptionService = ProxyClientContext.getBean(SelectOptionService.class);
        String schoolId = request.getParameter("schoolId");
        List<SelectOptionDto> list = selectOptionService.teacherOption(schoolId);
        return list;
    }
}
