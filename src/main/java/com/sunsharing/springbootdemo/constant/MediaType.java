package com.sunsharing.springbootdemo.constant;

import java.util.HashMap;
import java.util.Map;

public class MediaType {
    public static final String PICTURE = "PICTURE";
    public static final String AUDIO = "AUDIO";
    public static final String VIDEO = "VIDEO";

    public static final String ServerIdAudio = "ServerIdAudio";


    public static final Map<String, String> MediaTypeMap = new HashMap<String, String>() {
        private static final long serialVersionUID = -5721765408662652396L;

        {
            this.put(".bmp", "PICTURE");
            this.put(".jpg", "PICTURE");
            this.put(".jpeg", "PICTURE");
            this.put(".png", "PICTURE");
            this.put(".gif", "PICTURE");
            this.put(".mp3", "AUDIO");
            this.put(".wav", "AUDIO");
            this.put(".avi", "VIDEO");
            this.put(".mov", "VIDEO");
            this.put(".3gp", "VIDEO");
            this.put(".mp4", "VIDEO");
        }
    };
    public static final Map<String, String> ContentTypeMap = new HashMap<String, String>() {
        private static final long serialVersionUID = -5721765408662652396L;

        {
            this.put(".mp4", "video/mp4");
            this.put(".mp3", "audio/mpeg");
        }
    };

}
