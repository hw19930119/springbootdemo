package com.sunsharing.springbootdemo.configuration;

import com.alibaba.druid.pool.DruidDataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

@Configuration
@ConditionalOnExpression("'${isInnerNetwork}'=='true' || '${isInnerNetwork}'=='both' ")
@MapperScan(basePackages = "com.sunsharing.springbootdemo.mappers.jy", sqlSessionFactoryRef = "jySqlSessionFactory")
public class MybatisJYConfig {

    @Bean(name = "jiaoyuDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.jy")
    public DataSource getBusinessDataSource() {
        return DataSourceBuilder.create().type(DruidDataSource.class).build();
    }

    @Bean(name = "jySqlSessionFactory")
    public SqlSessionFactory bizSqlSessionFactory(@Qualifier("jiaoyuDataSource") DataSource datasource)
        throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(datasource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath*:mappers/jy/*.xml"));
        return bean.getObject();
    }

    @Bean("jySqlsessiontemplate")
    public SqlSessionTemplate bizSqlsessiontemplate(@Qualifier("jySqlSessionFactory") SqlSessionFactory sessionfactory) {
        return new SqlSessionTemplate(sessionfactory);
    }
}
