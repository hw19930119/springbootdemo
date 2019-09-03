package com.sunsharing.springbootdemo.mappers.jy;

import com.sunsharing.springbootdemo.model.dto.OrgUserDto;
import com.sunsharing.springbootdemo.model.vo.OrgUserVo;

import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface OrgUserDtoMapper {
    List<OrgUserVo> queryOrgUserByTeacherId(String teacherId);
}