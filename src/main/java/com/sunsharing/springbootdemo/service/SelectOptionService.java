package com.sunsharing.springbootdemo.service;

import com.sunsharing.springbootdemo.model.dto.SelectOptionDto;
import com.sunsharing.springbootdemo.remote.proxy.anno.CollagenAnno;

import java.util.List;
@CollagenAnno
public interface SelectOptionService {
    List<SelectOptionDto> schoolOption();
    List<SelectOptionDto> subjectTypeOption();
    List<SelectOptionDto> teacherOption(String schoolId);
}
