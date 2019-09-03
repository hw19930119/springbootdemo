package com.sunsharing.springbootdemo.service;

import com.sunsharing.springbootdemo.model.vo.OrgUserVo;
import com.sunsharing.springbootdemo.model.vo.TeacherVo;
import com.sunsharing.springbootdemo.remote.proxy.anno.CollagenAnno;

import java.util.List;

@CollagenAnno
public interface TeacherService {
    TeacherVo getTeacherByWxUserId(String wxUserId);
    TeacherVo getTeacherByTeacherId(String teacherId);

    List<OrgUserVo> queryOrgUserByTeacherId(String teacherId);
}
