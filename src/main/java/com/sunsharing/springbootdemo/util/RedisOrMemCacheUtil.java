/*
 * @(#) RedisUtil
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author Administrator
 * <br> 2019-08-19 09:50:06
 */

package com.sunsharing.springbootdemo.util;

import com.sun.javaws.CacheUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.concurrent.TimeUnit;

@Component
public class RedisOrMemCacheUtil {
    public static StringRedisTemplate redisTemplate;
    public static String useRedis;
    @Autowired(required = false)
    public void setRedisTemplate(StringRedisTemplate redisTemplate) {
        RedisOrMemCacheUtil.redisTemplate = redisTemplate;
    }

    @Value("${useRedis}")
    public void setUseRedis(String useRedis) {
        RedisOrMemCacheUtil.useRedis = useRedis;
    }

    public static Object getCache(String key) {
        if("true".equals(useRedis)){
            return redisTemplate.opsForValue().get(key);
      }else{
            return null;
        }

    }

    public static void saveCache(String key, String value) {
        if("true".equals(useRedis)){
            redisTemplate.opsForValue().set(key,value);
        }else{
        }

    }

    public static void saveCacheByPriod(String key, String value, String priod) {
        if("true".equals(useRedis)){
            redisTemplate.opsForValue().set(key, value, Long.parseLong(priod), TimeUnit.SECONDS);
        }else{
        }
    }
}
