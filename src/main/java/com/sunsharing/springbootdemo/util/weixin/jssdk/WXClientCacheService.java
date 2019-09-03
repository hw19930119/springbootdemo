package com.sunsharing.springbootdemo.util.weixin.jssdk;

import com.sunsharing.springbootdemo.constant.CacheConstants;
import com.sunsharing.springbootdemo.configuration.properties.ConfigParams;
import com.sunsharing.springbootdemo.util.RedisOrMemCacheUtil;
import com.sunsharing.springbootdemo.util.weixin.WeixinQYHUntils;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

/**
 * <pre></pre>
 * <p/>
 * <br>
 * ---------------------------------------------------------------------- <br>
 * <b>功能描述:</b> <br>
 * 提供微信的缓存类<br>
 * 注意事项: <br>
 * <br>
 * <br>
 * ---------------------------------------------------------------------- <br>
 */
public class WXClientCacheService {

    static Logger logger = Logger.getLogger(WXClientCacheService.class);

    /**
     * 企业号 调用微信js sdk需要的临时票据 票据缓存时间 3600s
     * @return
     */
    public static String getQYHTicket() {
        String cacheKey = CacheConstants.QYWX_TICKET +":"+ ConfigParams.Secret;

        String ticketInM=(String)RedisOrMemCacheUtil.getCache(CacheConstants.QYWX_GROUP +":"+cacheKey);
        if(StringUtils.isBlank(ticketInM)){
            String ticket = WeixinQYHUntils.getTicket(WeixinQYHUntils.get_AccessToken(ConfigParams.CorpID, ConfigParams.Secret));
            RedisOrMemCacheUtil.saveCacheByPriod(CacheConstants.QYWX_GROUP +":"+cacheKey,ticket,"7200");
            return ticket;
        }else{
            return ticketInM;
        }

    }
}
