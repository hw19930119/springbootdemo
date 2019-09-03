package com.sunsharing.springbootdemo.model.vo;

import java.io.Serializable;

public class FileVo implements Serializable {
    private static final long serialVersionUID = -7714013681416542150L;
    private String showUri;
    private String serverIds;
    private String mediaType;
    private String mediaBizType;

    public String getShowUri() {
        return showUri;
    }

    public void setShowUri(String showUri) {
        this.showUri = showUri;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public String getMediaBizType() {
        return mediaBizType;
    }

    public void setMediaBizType(String mediaBizType) {
        this.mediaBizType = mediaBizType;
    }

    public String getServerIds() {
        return serverIds;
    }

    public void setServerIds(String serverIds) {
        this.serverIds = serverIds;
    }
}
