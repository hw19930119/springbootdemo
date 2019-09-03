package com.sunsharing.springbootdemo.model.dto;

import java.io.Serializable;

public class SelectOptionDto implements Serializable {
    private static final long serialVersionUID = 8406648200734782702L;
    private String key;
    private String value;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
