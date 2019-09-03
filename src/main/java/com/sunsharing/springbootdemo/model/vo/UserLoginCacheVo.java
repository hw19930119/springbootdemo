package com.sunsharing.springbootdemo.model.vo;

import java.io.Serializable;

public class UserLoginCacheVo implements Serializable {
    private String teacherId;

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }
}
