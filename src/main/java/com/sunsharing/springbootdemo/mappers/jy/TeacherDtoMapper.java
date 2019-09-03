package com.sunsharing.springbootdemo.mappers.jy;

import com.sunsharing.springbootdemo.model.dto.TeacherDto;

import java.util.List;

public interface TeacherDtoMapper {

    List<TeacherDto> selectByExample();


    List<TeacherDto> queryByWxUserId(String wxUserId);
    List<TeacherDto> getTeacherByTeacherId(String teacherId);
}