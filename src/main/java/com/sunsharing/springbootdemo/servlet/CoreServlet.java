package com.sunsharing.springbootdemo.servlet;

import com.qq.weixin.mp.aes.AesException;
import com.qq.weixin.mp.aes.WXBizMsgCrypt;
import com.sunsharing.springbootdemo.configuration.properties.ConfigParams;

import org.apache.log4j.Logger;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @ClassName: CoreServlet
 * @Description: 微信企业号 验证的servlet
 * @author ZD
 * @date 2016年7月12日 上午9:57:21
 *
 */
public class CoreServlet extends HttpServlet {

    private static final long serialVersionUID = 5977096445022490516L;
    static Logger logger = Logger.getLogger(CoreServlet.class);

    /**
     * 确认请求来自微信服务器
     * @throws IOException
     */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String sToken = ConfigParams.sToken;// "sunsharing";//这个Token是随机生成，但是必须跟企业号上的相同
        String sCorpID = ConfigParams.CorpID;// "wx0f4bf1de37d87765";//这里是你企业号的CorpID
        String sEncodingAESKey = ConfigParams.sEncodingAESKey;// "wBEKoWmsNoWDvU1dlySz5BnjvU7FwY9QwecMn3Txhyi";//这个EncodingAESKey是随机生成，但是必须跟企业号上的相同

        logger.info("确认请求来自微信服务器.....doGet");
        // 微信加密签名
        String sVerifyMsgSig = request.getParameter("msg_signature");
        // 时间戳
        String sVerifyTimeStamp = request.getParameter("timestamp");
        // 随机数
        String sVerifyNonce = request.getParameter("nonce");
        // 随机字符串
        String sVerifyEchoStr = request.getParameter("echostr");
        String sEchoStr; // 需要返回的明文
        PrintWriter out = response.getWriter();
        WXBizMsgCrypt wxcpt;
        try {
            logger.info("确认请求来自微信服务器.....doGet..try");
            wxcpt = new WXBizMsgCrypt(sToken, sEncodingAESKey, sCorpID);
            sEchoStr = wxcpt.verifyUrl(sVerifyMsgSig, sVerifyTimeStamp, sVerifyNonce, sVerifyEchoStr);
            logger.info("微信返回参数       sVerifyMsgSig:" + sVerifyMsgSig);
            logger.info("微信返回参数       sVerifyTimeStamp:" + sVerifyTimeStamp);
            logger.info("微信返回参数       sVerifyNonce:" + sVerifyNonce);
            logger.info("微信返回参数       sVerifyEchoStr:" + sVerifyEchoStr);

            logger.info("确认请求来自微信服务器结果       sEchoStr:" + sEchoStr);
            // 验证URL成功，将sEchoStr返回
            out.print(sEchoStr);
        } catch (AesException e1) {
            e1.printStackTrace();
        }
    }

    /**
     * 处理微信服务器发来的消息
     */
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO 消息的接收、处理、响应
        logger.info("处理微信服务器发来的消息.....doPost");
    }

}
