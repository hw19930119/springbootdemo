package com.sunsharing.springbootdemo.mappers.jy;

import com.sunsharing.springbootdemo.model.dto.SelectOptionDto;

import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SelectOptionDtoJyMapper {
    List<SelectOptionDto> schoolOption();
    List<SelectOptionDto> teacherOption(@Param("schoolId") String schoolId);
}
