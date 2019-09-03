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
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

@Configuration
@ConditionalOnExpression("'${isInnerNetwork}'=='true' || '${isInnerNetwork}'=='both' ")
@MapperScan(basePackages = "com.sunsharing.springbootdemo.mappers.olreg", sqlSessionFactoryRef = "olregSqlSessionFactory")
public class MybatisOlregConfig {

    @Primary
    @Bean(name = "olregDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.olreg")
    public DataSource getBusinessDataSource() {
        return DataSourceBuilder.create().type(DruidDataSource.class).build();
    }

    @Bean(name = "olregSqlSessionFactory")
    public SqlSessionFactory bizSqlSessionFactory(@Qualifier("olregDataSource") DataSource datasource)
        throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(datasource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath*:mappers/olreg/*.xml"));
        return bean.getObject();
    }

    @Bean("olregSqlsessiontemplate")
    public SqlSessionTemplate bizSqlsessiontemplate(@Qualifier("olregSqlSessionFactory") SqlSessionFactory sessionfactory) {
        return new SqlSessionTemplate(sessionfactory);
    }
}
