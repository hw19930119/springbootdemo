import fetch from 'dva/fetch';
// import { notification } from 'antd';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { __MOCK__, COMMON_API_PREFIX, MOCK_API_PREFIX } from '../config/service';
import {Toast} from '@mshare/mshareui';
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) return response;

    // notification.error({
    //     message: `请求错误 ${response.status}: ${response.url}`,
    //     description: response.statusText || '没有返回相关的错误描述'
    // });
    const error = new Error(response.statusText);

    error.response = response;
    throw error;
}

function formatArgs(...args) {
    if (args.length === 2 && typeof args[1] === 'object') {
        args.push(false);
    }
    const requestParams = args.length > 1 ? args.slice(0, args.length - 1) : args;
    let [url, options = {}] = requestParams; // eslint-disable-line
    const [mock] = args.length > 1 ? args.slice(-1) : [false];

    if (__MOCK__) {
        const API_PREFIX = mock ? MOCK_API_PREFIX : COMMON_API_PREFIX;

        url = API_PREFIX + url;
        // 如果想返回不同期望的mock数据，则request最后一个参数传入类型为string的状态值
        if (typeof mock === 'string') {
            url += `?mockStatus=${mock}`;
        }
    } else {
        url = COMMON_API_PREFIX + url;
    }

    return { url, options };
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(...args) {
    const { url, options } = formatArgs(...args);
    const defaultOptions = {
        credentials: 'include'
    };
    const newOptions = { ...defaultOptions, ...options };

    if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
        console.log('url===',url)
        if(newOptions.type && newOptions.type =="upload"){
            newOptions.body = newOptions.body;
        } else {
            newOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                ...newOptions.headers
            };
            newOptions.body = JSON.stringify(newOptions.body);
        }

    }

    /**
     * 这边前后端约束，如果接口请求失败，则返回
     * {
     *   code: 10001,
     *   name: '校验错误',
     *   message: 'please input password',
     * }
     */
    NProgress.start();

    let  promise = new Promise((resolve, reject) => {


        fetch(url, newOptions)
        .then(checkStatus)
        .then(response => response.json())
        .then(response => {
            console.log('response',response)
            NProgress.done();
            if(url.indexOf('fs-up')>-1){
                resolve (response)
            }
            if(response.status != "1200"){
                Toast.fail(response.message,4);
            }
            resolve (response.data);
        })
        .then(error => {
            console.log("error",error)
            // if (error.code) {
            //     notification.error({
            //         message: error.name,
            //         description: error.message
            //     });
            // }

            // if ('stack' in error && 'message' in error) {
            //     notification.error({
            //         message: `请求错误: ${url}`,
            //         description: error.message
            //     });
            // }
            NProgress.done();
            reject(error);
        });
    })
    return warp_fetch(promise)
}
function warp_fetch(fetch_promise, timeout = 60000) {
    let timeout_fn = null;
    let abort = null;
    //创建一个超时promise
    let timeout_promise = new Promise(function (resolve, reject) {
        timeout_fn = function () {
            reject('网络请求超时');
        };
    });
    //创建一个终止promise
    let abort_promise = new Promise(function (resolve, reject) {
        abort = function () {
            reject('请求终止');
        };
    });
    //竞赛
    let abortable_promise = Promise.race([
        fetch_promise,
        timeout_promise,
        abort_promise,
    ])
    //计时
    setTimeout(timeout_fn, timeout);
    //终止
    abortable_promise.abort = abort;
    return abortable_promise;
}
