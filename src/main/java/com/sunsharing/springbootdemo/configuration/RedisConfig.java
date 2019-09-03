/*
 * @(#) RedisConfig
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author Administrator
 * <br> 2019-08-06 18:44:16
 */

package com.sunsharing.springbootdemo.configuration;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.net.UnknownHostException;
import java.time.Duration;
import java.util.Arrays;

import redis.clients.jedis.JedisPoolConfig;

@Configuration
@EnableCaching//开启注解
@ConditionalOnProperty(name = "useRedis", havingValue = "true")
public class RedisConfig {
    public static RedisTemplate<String, Object> redisTemplate;
    public static StringRedisTemplate stringRedisTemplate;
    @Autowired
    public void setRedisTemplate(RedisTemplate<String, Object> redisTemplate) {
        RedisConfig.redisTemplate = redisTemplate;
    }
    @Autowired
    public void setStringRedisTemplate(StringRedisTemplate stringRedisTemplate) {
        RedisConfig.stringRedisTemplate = stringRedisTemplate;
    }

    @Value("${spring.redis.pool.max-idle}")
    private String maxIdea;
    @Value("${spring.redis.pool.max-total}")
    private String maxTotal;
    @Value("${spring.redis.database}")
    private String database;
    @Value("${spring.redis.host}")
    private String host;
    @Value("${spring.redis.port}")
    private String port;
    @Value("${spring.redis.timeout}")
    private String time;
    @Value("${spring.redis.password}")
    private String pwd;
    @Bean(name="redisConnectionFactory")
    public JedisConnectionFactory getRedisConnectionFactory(){
        JedisPoolConfig config = new JedisPoolConfig();
        config.setMaxTotal(Integer.valueOf(maxTotal));
        config.setMaxIdle(Integer.valueOf(maxIdea));
        config.setMaxWaitMillis(15000);
        config.setMinEvictableIdleTimeMillis(30000);
        config.setNumTestsPerEvictionRun(3);
        config.setTimeBetweenEvictionRunsMillis(60000);
        config.setTestOnBorrow(true);

        JedisConnectionFactory conn = new JedisConnectionFactory();
        conn.setDatabase(Integer.valueOf(database));
        conn.setHostName(host);
        conn.setPort(Integer.valueOf(port));
        if(StringUtils.isNotBlank(pwd)){
            conn.setPassword(pwd);
        }
        conn.setPoolConfig(config);
        conn.setUsePool(true);
        conn.setTimeout(Integer.valueOf(time));
        conn.afterPropertiesSet();
        return conn;
    }
    @Bean
    public CacheManager cacheManager(RedisTemplate<?, ?> redisTemplate) {
        CacheManager cacheManager = new RedisCacheManager(redisTemplate);
        return cacheManager;
        /*RedisCacheManager rcm = new RedisCacheManager(redisTemplate);
        // 多个缓存的名称,目前只定义了一个
        rcm.setCacheNames(Arrays.asList("thisredis"));
        //设置缓存默认过期时间(秒)
        rcm.setDefaultExpiration(600);
        return rcm;*/
    }
    @Bean
    @ConditionalOnMissingBean(name = "redisTemplate")
    public static RedisTemplate<String, Object> redisTemplate(
        RedisConnectionFactory redisConnectionFactory)
        throws UnknownHostException {

        Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<Object>(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);

        RedisTemplate<String, Object> template = new RedisTemplate<String, Object>();
        template.setConnectionFactory(redisConnectionFactory);
        template.setKeySerializer(jackson2JsonRedisSerializer);
        template.setValueSerializer(jackson2JsonRedisSerializer);
        template.setHashKeySerializer(jackson2JsonRedisSerializer);
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    @ConditionalOnMissingBean(StringRedisTemplate.class)
    public static StringRedisTemplate stringRedisTemplate(
        RedisConnectionFactory redisConnectionFactory)
        throws UnknownHostException {
        StringRedisTemplate template = new StringRedisTemplate();
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }
}