package com.sunsharing.springbootdemo.model.vo;

import com.sunsharing.springbootdemo.model.dto.OrgUserDto;

import java.io.Serializable;

public class OrgUserVo extends OrgUserDto implements Serializable {
    private static final long serialVersionUID = -7146748126107032494L;
    private String schoolZoneName;
    private String schoolName;
    private String schoolId;


    public String getSchoolZoneName() {
        return schoolZoneName;
    }

    public void setSchoolZoneName(String schoolZoneName) {
        this.schoolZoneName = schoolZoneName;
    }

    public String getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(String schoolId) {
        this.schoolId = schoolId;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }
}
