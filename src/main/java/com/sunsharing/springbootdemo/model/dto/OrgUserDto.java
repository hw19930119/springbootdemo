package com.sunsharing.springbootdemo.model.dto;

import java.io.Serializable;

public class OrgUserDto implements Serializable {
    private static final long serialVersionUID = -2481179657115027471L;
    private String ouId;

    private String userId;

    private String orgId;

    private String dutyStatus;

    private String dutyName;

    private String createTime;

    private String inMeet;

    private String schoolZoneId;

    public String getOuId() {
        return ouId;
    }

    public void setOuId(String ouId) {
        this.ouId = ouId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public String getDutyStatus() {
        return dutyStatus;
    }

    public void setDutyStatus(String dutyStatus) {
        this.dutyStatus = dutyStatus;
    }

    public String getDutyName() {
        return dutyName;
    }

    public void setDutyName(String dutyName) {
        this.dutyName = dutyName;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getInMeet() {
        return inMeet;
    }

    public void setInMeet(String inMeet) {
        this.inMeet = inMeet;
    }

    public String getSchoolZoneId() {
        return schoolZoneId;
    }

    public void setSchoolZoneId(String schoolZoneId) {
        this.schoolZoneId = schoolZoneId;
    }
}