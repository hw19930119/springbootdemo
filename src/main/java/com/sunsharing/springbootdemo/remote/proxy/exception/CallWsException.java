/*
 * @(#) CallWsException
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author hanjb
 * <br> 2019-07-17 10:59:20
 */

package com.sunsharing.springbootdemo.remote.proxy.exception;

/**
 * <pre></pre>
 * <br>----------------------------------------------------------------------
 * <br> <b>功能描述:</b>
 * <br> 调用ws异常
 * <br> 注意事项:
 * <br>
 * <br>
 * <br>----------------------------------------------------------------------
 * <br>
 */
public class CallWsException extends Exception {

    public CallWsException() {
    }

    public CallWsException(String message) {
        super(message);
    }

    public CallWsException(String message, Throwable cause) {
        super(message, cause);
    }

    public CallWsException(Throwable cause) {
        super(cause);
    }
}

