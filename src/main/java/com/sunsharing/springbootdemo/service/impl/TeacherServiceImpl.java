package com.sunsharing.springbootdemo.service.impl;

import com.sunsharing.springbootdemo.configuration.MybatisJYConfig;
import com.sunsharing.springbootdemo.configuration.MybatisOlregConfig;
import com.sunsharing.springbootdemo.mappers.jy.OrgUserDtoMapper;
import com.sunsharing.springbootdemo.mappers.jy.TeacherDtoMapper;
import com.sunsharing.springbootdemo.model.dto.TeacherDto;
import com.sunsharing.springbootdemo.model.vo.OrgUserVo;
import com.sunsharing.springbootdemo.model.vo.TeacherVo;
import com.sunsharing.springbootdemo.service.TeacherService;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.List;

import lombok.extern.log4j.Log4j2;

@Service
@ConditionalOnBean({MybatisJYConfig.class, MybatisOlregConfig.class})
@Transactional
@Log4j2
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    TeacherDtoMapper teacherDtoMapper;
    @Autowired
    OrgUserDtoMapper orgUserDtoMapper;

    @Override
    public TeacherVo getTeacherByWxUserId(String wxUserId) {
        TeacherVo teacherVo = new TeacherVo();
        List<TeacherDto> list = teacherDtoMapper.queryByWxUserId(wxUserId);
        if (CollectionUtils.isEmpty(list)) {
            return null;
        } else {
            BeanUtils.copyProperties(list.get(0), teacherVo);
            return teacherVo;
        }
    }

    @Override
    public TeacherVo getTeacherByTeacherId(String teacherId) {
        TeacherVo teacherVo = new TeacherVo();
        List<TeacherDto> list = teacherDtoMapper.getTeacherByTeacherId(teacherId);
        if (CollectionUtils.isEmpty(list)) {
            return null;
        } else {
            BeanUtils.copyProperties(list.get(0), teacherVo);
            return teacherVo;
        }
    }

    @Override
    public List<OrgUserVo> queryOrgUserByTeacherId(String teacherId) {
        List<OrgUserVo> list = orgUserDtoMapper.queryOrgUserByTeacherId(teacherId);
        return list;
    }


}
