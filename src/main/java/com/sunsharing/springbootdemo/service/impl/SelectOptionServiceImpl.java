package com.sunsharing.springbootdemo.service.impl;

import com.sunsharing.springbootdemo.configuration.MybatisJYConfig;
import com.sunsharing.springbootdemo.configuration.MybatisOlregConfig;
import com.sunsharing.springbootdemo.mappers.jy.SelectOptionDtoJyMapper;
import com.sunsharing.springbootdemo.mappers.olreg.SelectOptionDtoOlregMapper;
import com.sunsharing.springbootdemo.model.dto.SelectOptionDto;
import com.sunsharing.springbootdemo.service.SelectOptionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@ConditionalOnBean({MybatisJYConfig.class, MybatisOlregConfig.class})
@Transactional
public class SelectOptionServiceImpl implements SelectOptionService {
    @Autowired
    SelectOptionDtoJyMapper selectOptionDtoJyMapper;

    @Autowired
    SelectOptionDtoOlregMapper selectOptionDtoOlregMapper;

    @Override
    public List<SelectOptionDto> schoolOption() {
        return selectOptionDtoJyMapper.schoolOption();
    }

    @Override
    public List<SelectOptionDto> subjectTypeOption() {
        return selectOptionDtoOlregMapper.subjectTypeOption();
    }

    @Override
    public List<SelectOptionDto> teacherOption(String schoolId) {
        return selectOptionDtoJyMapper.teacherOption(schoolId);
    }
}
