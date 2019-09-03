package com.sunsharing.springbootdemo.constant;

/**
 * 主要存放缓存用到的key Created with IntelliJ IDEA. User: ulyn Date: 13-3-15 Time: 上午10:24 To change this template use File | Settings | File Templates.
 */
public class CacheConstants {
	public static final String PROJECT_NAME = "springbootdemo";

	/** 系统登陆用户的session的key */
	public static final String SESSIONUSERKEY = "SessionUser";
	/** 权限控制 **/
	public static final String RoleApp = "RoleApp";
	/** 权限控制 **/
	public static String token = "";
	/** tokenCookie **/
	public static String tokenCookie = "tokenCookie";


	/** 微信用户登录后存入缓存的唯一key **/
	public static final String WX_USERID = PROJECT_NAME+":"+"WX_USERID";
	/** 缓存组key **/
	public static final String QYWX_GROUP = PROJECT_NAME+":"+"QYWX_GROUP";
	/** 企业号ticket缓存key **/
	public static final String QYWX_TICKET = PROJECT_NAME+":"+"QYWX_TICKET";
	/**  ticket缓存key **/
	public static final String WX_TICKET = PROJECT_NAME+":"+"WX_TICKET";
	/**  token缓存的key **/
	public static final String QYWX_ACCESSTOKEN = PROJECT_NAME+":"+"QYWX_ACCESSTOKEN";
	/** 微信项目系统cookie老师唯一标识 **/
	public static final String TEACHER_ID = PROJECT_NAME+":"+"TEACHER_ID";
	/** 微信项目系统组织用户表唯一标识 **/
	public static final String OU_ID = PROJECT_NAME+":"+"OU_ID";
}
