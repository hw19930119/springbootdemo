/*
 * @(#) ClassNotFoundProxyException
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author hanjb
 * <br> 2019-07-17 10:59:20
 */

package com.sunsharing.springbootdemo.remote.proxy.exception;

public class ClassNotFoundProxyException extends Exception {

    public ClassNotFoundProxyException() {
    }

    public ClassNotFoundProxyException(String message) {
        super(message);
    }

    public ClassNotFoundProxyException(String message, Throwable cause) {
        super(message, cause);
    }

    public ClassNotFoundProxyException(Throwable cause) {
        super(cause);
    }
}
