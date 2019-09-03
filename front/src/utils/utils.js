/*
 * @(#) utils.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2018
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author weixl
 * <br> 2018-08-01 14:50:05
 */

/**
 *  * Created by liaoyf on 2017/10/17 0017.
 */

import $ from 'jquery';
// import PortalMessenger from '@share/portal-messenger';
// const portalMessenger = PortalMessenger('appiframe');
import {Toast} from '@mshare/mshareui';
import {baseItems,textItems} from "./config";

/**
 * 转换数组中的对象属性，如：let a = [{id: 1, text: 2}]，调用trnasformPropery(a, {id: 'value', text: 'label'}) ====> //a = [{value: 1, label: 2}];
 * @param data
 * @param fieldNameMap
 * @returns {Array}
 */
export const getValueByKey = (key, data) => {
    let value = '';
    if (!data || !key) {
        return value;
    }
    if (data instanceof Array) {
        let result = [];
        for (let i in data) {
            if (data[i][key]) {
                result.push(data[i][key]);
            }
        }
        return result;
    } else if (typeof data == 'object') {
        if (data[key]) {
            value = data[key];
        }
    }
    if (value == '') {
        value = data;
    }
    return value;
};
export function transformProperty(data, fieldNameMap){
    if (!data) return [];
    const tmpData = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < tmpData.length; i++){
        for (const prop in fieldNameMap){
            if (tmpData[i][prop]){
                tmpData[i][fieldNameMap[prop]] = tmpData[i][prop];
                delete tmpData[i][prop];
            }
        }
    }

    return tmpData;
}


/**
 * 判断两个对象或者数组是否相等
 * @param obj1
 * @param obj2
 * @returns {boolean}
 */
export function isEqual(obj1, obj2){
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}


export const ValidationTool = {
    // 是否为正整数
    isPositiveInteger(s){
        if (s === '') return true;
        const re = /^[0-9]+$/;

        return re.test(s);
    },
    // 是否为正数
    isPositive(num){
        if (num === '') return true;
        return !isNaN(num);
    },
    isInteger(num){
        if (num === '') return true;
        return (/^\d+$/).test(num);
    }
};

/*
保留两个小数点
 */
export const toDecimal = (num, fixNum) => {
    if (num.indexOf('.') === -1){
        return num;
    } else {
        return num.substring(0, num.indexOf('.') + 3);
    }
};

/**
 * 格式化文字：2=>02
 * @param num
 * @returns {string}
 */
export const formatNumZero = num => {
    return String(parseInt(num) < 10 ? `0${num}` : num);
};


/**
 * 比较函数
 * @param {Object} param1 要比较的参数1
 * @param {Object} param2 要比较的参数2
 * @return {Number} 如果param1 > param2 返回 1
 *                     如果param1 == param2 返回 0
 *                     如果param1 < param2 返回 -1
 */
function compareFunc(param1, param2){
    // 如果两个参数均为字符串类型
    if (typeof param1 === 'string' && typeof param2 === 'string'){
        return param1.localeCompare(param2);
    }
    // 如果参数1为数字，参数2为字符串
    if (typeof param1 === 'number' && typeof param2 === 'string'){
        return -1;
    }
    // 如果参数1为字符串，参数2为数字
    if (typeof param1 === 'string' && typeof param2 === 'number'){
        return 1;
    }
    // 如果两个参数均为数字
    if (typeof param1 === 'number' && typeof param2 === 'number'){
        if (param1 > param2) return 1;
        if (param1 == param2) return 0;
        if (param1 < param2) return -1;
    }
}

/**
 * 转换ulynlist为旧版数据结构
 * @param data
 */
export const transformUlynlistData = data => {
    return {
        status: true,
        data: {
            currentPage: data.page.currentPage,
            linesPerPage: data.page.linesPerPage,
            totalNum: data.page.totalNum,
            totalPage: data.page.totalPage,
            list: data.list
        }
    };
};

export const getQueryString = function(location, name){
    // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
    if (location.search.indexOf('?') == -1 || location.search.indexOf(`${name}=`) == -1) {
        return '';
    }

    // 获取链接中参数部分
    let queryString = location.search.substring(location.search.indexOf('?') + 1);

    queryString = queryString.replace(/#.*$/, '');
    // 分离参数对 ?key=value&key2=value2
    const parameters = queryString.split('&');

    let pos, paraName, paraValue;

    for (let i = 0; i < parameters.length; i++) {
        // 获取等号位置
        pos = parameters[i].indexOf('=');
        if (pos == -1) {
            continue;
        }

        // 获取name 和 value
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);

        // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
        if (paraName == name) {
            return decodeURIComponent(paraValue.replace(/\+/g, ' '));
        }
    }
    return '';
};

/**
 * 判断数组中是否存在某一项元素
 * @param arr
 * @param val
 */
export const includesWith = (arr, val) => {
    let exists = false;
    let index = 0 ;
    for (let i = 0; i < arr.length; i++){
        if (arr[i] == val){
            exists = true;
            index = i;
            break;
        }
    }

    return {
        exists:exists,
        index:index
    };

};

export const isEmptyObj = arr => {
    let flag = true;

    for (const key in arr){
        if (arr[key] && arr[key] != ''){
            flag = false;
            break;
        }
    }

    return flag;
};

export const getCurrentYear = () => {
    return new Date().getFullYear();
};

export const dateTimeFormat = (timeStr, fmt) => {
    // fmt如：yyyy-MM-dd hh:mm:ss
    if (!timeStr){
        return '';
    }
    const date = new Date(timeStr);
    const isTime = isNaN(date.getTime());

    if (isTime){
        return '';
    }
    return date.format(fmt);
};
Date.prototype.format = function(fmt) {
    const o = {
        'M+': this.getMonth() + 1,                 // 月份
        'd+': this.getDate(),                    // 日
        'h+': this.getHours(),                   // 小时
        'm+': this.getMinutes(),                 // 分
        's+': this.getSeconds(),                 // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds()             // 毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
        }
    }
    return fmt;
};

export const getNowFormatDate = () => {
    const date = new Date();
    const seperator1 = '';
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();

    if (month >= 1 && month <= 9) {
        month = `0${month}`;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = `0${strDate}`;
    }
    const currentdate = year + seperator1 + month + seperator1 + strDate;

    return currentdate;
};


/**
 * 111  居民身份证
 * 414   护照
 * 513   港澳通行证
 * 517   台湾通行证
 * @param arr
 */
export const getZjlx = arr => {
    const zjArr = [111, 414, 513, 517];
    const result = [];

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < zjArr.length; j++) {
            if (arr[i].code == zjArr[j]) {
                result.push(arr[i]);
                continue;
            }
        }
    }
    return result;
};


export const ArrayTool = {
    updateArray: (array, val) => {
        const isExists = array.includes(val);

        if (isExists){
            const findIndex = array.findIndex(item => item === val);

            return [
                ...array.slice(0, findIndex),
                ...array.slice(findIndex + 1)
            ];
        } else {
            return [
                ...array,
                val
            ];
        }
    }
};

/**
 * 身份证号合法性检测
 * @param idcard 身份证号
 * @returns {boolean}
 */
export const checkSFZH = function (idcard) {
    const socialNo = idcard;
console.log('socialNo',socialNo)
    if (socialNo == '') {
        return (false);
    }
    // if (socialNo.length != 15 && socialNo.length != 18)
    if (socialNo.length != 18) {
        return (false);
    }
    const area = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外'
    };

    if (area[parseInt(socialNo.substr(0, 2))] == null) {
        return (false);
    }
    if (socialNo.length == 15) {
        pattern = /^\d{15}$/;
        if (pattern.exec(socialNo) == null) {
            return (false);
        }
        const birth = parseInt(`19${socialNo.substr(6, 2)}`);
        const month = socialNo.substr(8, 2);
        const day = parseInt(socialNo.substr(10, 2));

        switch (month) {
        case '01':
        case '03':
        case '05':
        case '07':
        case '08':
        case '10':
        case '12':
            if (day > 31) {
                return false;
            }
            break;
        case '04':
        case '06':
        case '09':
        case '11':
            if (day > 30) {
                return false;
            }
            break;
        case '02':
            if ((birth % 4 == 0 && birth % 100 != 0) || birth % 400 == 0) {
                if (day > 29) {
                    return false;
                }
            } else if (day > 28) {
                return false;
            }
            break;
        default:
            return false;
        }
        const nowYear = new Date().getYear();

        if (nowYear - parseInt(birth) < 15 || nowYear - parseInt(birth) > 100) {
            return false;
        }
        return (true);
    }
    const Wi = new Array(
        7, 9, 10, 5, 8, 4, 2, 1, 6,
        3, 7, 9, 10, 5, 8, 4, 2, 1
    );
    let lSum = 0;
    let nNum = 0;
    const nCheckSum = 0;

    for (let i = 0; i < 17; ++i) {
        if (socialNo.charAt(i) < '0' || socialNo.charAt(i) > '9') {
            return (false);
        } else {
            nNum = socialNo.charAt(i) - '0';
        }
        lSum += nNum * Wi[i];
    }
    if (socialNo.charAt(17) == 'X' || socialNo.charAt(17) == 'x') {
        lSum += 10 * Wi[17];
    } else if (socialNo.charAt(17) < '0' || socialNo.charAt(17) > '9') {
        return (false);
    } else {
        lSum += (socialNo.charAt(17) - '0') * Wi[17];
    }
    if ((lSum % 11) == 1) {
        return true;
    } else {
        return (false);
    }
};

export const  validateSfzh = function(idType,idno){
    let flag = true;
    if (idType.val() == '0') {//变为只验证身份证
        let idNumber = idno.val();
        if(idNumber){
            if(!checkSFZH(idNumber)){
                idno.parent().validateInfo(false, "身份证号格式错误");
                flag = false;
            }else{
                idno.parent().validateInfo(true, "");
            }
        }
    } else {
        idno.parent().validateInfo(true, "");
    }
    return flag;
}

/**
 * 获取下周期日期
 * @param  plType 频率类型 如"myyc","mjdyc","mbnyc","mnyc","mlnyc"
 * @param  date格式为yyyy-mm-dd的日期，如：2014-01-25
 */
export const getNextDate = function (plType, date) {
    const arr = date.split('-');
    const year = arr[0]; // 获取当前日期的年份
    const month = arr[1]; // 获取当前日期的月份
    const day = arr[2]; // 获取当前日期的日
    let days = new Date(year, month, 0);

    days = days.getDate(); // 获取当前日期中的月的天数
    let year2 = year;

    let month2;

    if (plType === 'myyc'){ // 每月一次
        month2 = parseInt(month) + 1;
    } else if (plType === 'mjdyc'){ // 每季度一次
        month2 = parseInt(month) + 3;
    } else if (plType === 'mbnyc'){ // 每半年一次
        month2 = parseInt(month) + 6;
    } else if (plType === 'mnyc'){ // 每年一次
        year2 = parseInt(year2) + 1;
        month2 = parseInt(month);
    } else if (plType === 'mlnyc'){ // 每两年一次
        year2 = parseInt(year2) + 2;
        month2 = parseInt(month);
    }
    if (month2 > 12) {
        year2 = parseInt(year2) + 1;
        month2 -= 12;
    }
    let day2 = day;
    let days2 = new Date(year2, month2, 0);

    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = `0${month2}`;
    }

    const t2 = `${year2}-${month2}-${day2}`;

    return t2;
};

export const concatUrlParam = function (url, paramObj) {
    if (!paramObj || paramObj == '' || paramObj == null){
        return url;
    }

    // let obj = eval('(' + paramObj + ')');
    const obj = paramObj;

    console.info('obj = ', obj);

    for (const key in obj){
        console.info('key = ', key);
        if (obj[key] && obj[key] != ''){
            url = url.indexOf('?') ? `${url}&${key}=${obj[key]}` : `${url}?${key}=${obj[key]}`;
        }
    }
    return url;
};

/**
 * 判断是不是标准的手机号码格式
 * @param arr
 * @returns {boolean}
 */
export const checkPhone =  v => {
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(v))) {
        return false;
    } else {
        return true;
    }
};

/**
 * 判断是不是电话号码（手机号+固定电话）
 * @param arr
 * @returns {boolean}
 */
export const checkTelNumber = v => {
    if (!(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/).test(v)) {
        return false;
    } else {
        return true;
    }
};

/**
 * 从url字符串获取指定属性值
 * @param url
 * @param name 获取的key
 * @returns 属性值
 */
export const getUrlString = (url, name) => {
    // url信息获取
    // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
    if (url.indexOf('?') == -1 || url.indexOf(`${name}=`) == -1) {
        return '';
    }

    // 获取链接中参数部分
    let queryString = url.substring(url.indexOf('?') + 1);

    queryString = queryString.replace(/#.*$/, '');
    // 分离参数对 ?key=value&key2=value2
    const parameters = queryString.split('&');

    let pos, paraName, paraValue;

    for (let i = 0; i < parameters.length; i++) {
        // 获取等号位置
        pos = parameters[i].indexOf('=');
        if (pos == -1) {
            continue;
        }

        // 获取name 和 value
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);

        // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
        if (paraName == name) {
            return decodeURIComponent(paraValue.replace(/\+/g, ' '));
        }
    }
    return '';
};

export const changeURLArg = (url, arg, arg_val) => {
    const pattern = `${arg}=([^&]*)`;
    const replaceText = `${arg}=${arg_val}`;

    if (url.match(pattern)){
        let tmp = `/(${arg}=)([^&]*)/gi`;

        tmp = url.replace(eval(tmp), replaceText);
        return tmp;
    } else if (url.match('[\?]')) {
        return `${url}&${replaceText}`;
    } else {
        return `${url}?${replaceText}`;
    }
};

/**
 * Created by wumin on 2018/01/22.
 * i18nArr
 *  [{code:'jrsj',label:'来厦时间'}]
 */
// 获取行政区划
export const getI18nName = (key, i18nArr) => {

    let label = '';

    if (key && i18nArr.length > 0) {
        const arr = i18nArr.filter(item => item.code == key);

        if (arr.length > 0) {
            label = arr[0].label;
        }
    }

    return label;
};

export const delHtmlTag = function (str){
    const title = str.replace(/<[^>]+>/g, '');// 去掉所有的html标记

    return title;
};

export const formatXzqh = function (xzqh) {
    return xzqh.replace(/((0{2}){1,3}(0{3}){2})|((0{3}){1,2})$/g, '');
};

/**
 * 日期格式化
 * @param dateStr
 * @param formatType
 * @returns {*}
 */
export const toDisDate = function (dateStr, formatType) {
    if (!dateStr || dateStr.length < 6 || dateStr.length > 14) {
        return dateStr;
    } else {
        let charArr = [];

        switch (formatType) {
        case 'HY':
            charArr = ['-', '-', ' ', ':', ':'];
            break;
        case 'DOT':
            charArr = ['.', '.', ' ', ':', ':'];
            break;
        case 'CN':
            charArr = ['年', '月', '日', ':', ':'];
            break;
        case 'XX':
            charArr = ['/', '/', '', ':', ':'];
            break;
        default: charArr = ['-', '-', ' ', ':', ':'];
        }
        try {
            dateStr = dateStr.replace(/ /g, '').replace(/-/g, '')
                .replace(/:/g, '');
            switch (dateStr.length) {
            case 6:
                dateStr = dateStr.substr(0, 4) + charArr[0] + dateStr.substr(4, 2);
                break;
            case 8:
                dateStr = dateStr.substr(0, 4) + charArr[0] + dateStr.substr(4, 2) + charArr[1] + dateStr.substr(6, 2);
                break;
            case 10:
                dateStr = dateStr.substr(0, 4) + charArr[0] + dateStr.substr(4, 2) + charArr[1] + dateStr.substr(6, 2) + charArr[2] + dateStr.substr(8, 2);
                break;
            case 12:
                dateStr = dateStr.substr(0, 4) + charArr[0] + dateStr.substr(4, 2) + charArr[1] +
                        dateStr.substr(6, 2) + charArr[2] + dateStr.substr(8, 2) + charArr[3] + dateStr.substr(10, 2);
                break;
            case 14:
                dateStr = dateStr.substr(0, 4) + charArr[0] + dateStr.substr(4, 2) + charArr[1] +
                        dateStr.substr(6, 2) + charArr[2] + dateStr.substr(8, 2) + charArr[3] + dateStr.substr(10, 2) +
                        charArr[4] + dateStr.substr(12, 2);
                break;
            default:
                return dateStr;
            }
            return dateStr;
        } catch (ex) {
            return dateStr;
        }
    }
};

/**
 * 获取url查询参数
 * @param key 查询参数
 * @returns {*}
 */
export const getQueryItem = function (props, key) {
    let queryString = props.location.search;

    queryString = queryString.substring(1, queryString.length);
    const queryItems = queryString.split('&');
    const queryMap = {};

    queryItems && queryItems.map(item => {
        const kv = item.split('=');

        queryMap[kv[0]] = kv[1];
    });
    console.info('请求参数：', queryMap);
    if (key){
        return queryMap[key];
    }
    return queryMap;
};

/**
 * 获取访问链接的上下文路径
 * @returns {string}
 */
export const getContextPath = function () {
    const host = window.location.host;
    const context = location.pathname;
    // const context = "/edu2-lesson";
    console.log('host==',host,"context",context);
    let contextNew = context.replace("/index.html","")
    return `http://${host + contextNew}`;
    // return `http://${host + context}`;
};

/**
 * 门户页内打开新标签
 * @param key
 * @param label tab名称
 * @param url 请求的url
 * @param props 上下文属性对象
 * @param isAddRandomKey 是否添加随机的key
 */
export const openTab = function(key, label, url, props, ignoreRandomKey){
    const stamp = !ignoreRandomKey && Date.parse(new Date()) || '';
    const mainUrl = url.replace(/fromPath=EventList+&*/g, '', '');

    const baseUrl = getContextPath();

    const ngApp = top.document.getElementsByTagName('html')[0].getAttribute('ng-app');

    console.info('基本url', baseUrl);

    if (ngApp === 'legendApp' || portalMessenger.isInIframe){
        props.history.push(url);
        console.info('非门户或门户2.0');
    } else {
        console.info('门户');
        portalMessenger.openTab({
            app_id: `${key}${stamp}`,
            key: `${key}${stamp}`,
            label: `${label}`,
            url: `${baseUrl}${mainUrl}`
        });
    }
};

/**
 * 关闭门户Tab
 * @param key
 */
export const closeTab = function(key, props){
    if (portalMessenger.isInIframe){
        props.history.push('/EventList');
    } else {
        portalMessenger.closeTab(key);
    }
};

/**
 *
 * @param url
 * @param data
 * @param success 请求成功后的回调函数
 */
export const httpPost = function (url, data, success){
    $.ajax({
        url,
        data: JSON.stringify(data),
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success,
        error: result => {
            console.info(`${url}请求失败`, result);
        }
    });
};

/**
 *
 * @param url
 * @param data
 * @param success 请求成功后的回调函数
 */
export const httpGet = function (url, data, success){
    $.ajax({
        url,
        data,
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',
        success,
        error: result => {
            console.info(`${url}请求失败`, result);
        }
    });
};

/**
 * 表码格式转换
 * @param data 要转的数据
 * @param isXzqh 是否行政区划
 * @returns {Array}
 */
export const selectFormat = (data, isXzqh) => {
    const opt = [];

    if (isXzqh){
        data.map(item => {
            opt.push({ value: item.code, label: item.name });
        });
    } else {
        data.map(item => {
            opt.push({ value: item.BH0000, label: item.MC0000 });
        });
    }
    return opt;
};

// 附件图片回显数据格式化
export const fileFormat = (attachments, width, height) => {
    console.info('历史记录-回显附件', attachments);
    const fileList = [];// 图片列表回显

    attachments && attachments.map((item, idx) => {
        fileList.push({
            src: `${CONTEXT_PATH}/resource${item.uri || item.url}`,
            thumbnail: `${CONTEXT_PATH}/resource${item.uri || item.url}`,
            w: 1200,
            h: 900,
            width: 120,
            height: 90,
            title: item.name,
            type: +(item.attType || item.type),
            idx
        });
    });
    return fileList;
};
//获取当天时间字符串
/*export function getNowData() {
    let data = new Date;
    let month = (data.getMonth() + 1).toString();
    let day = (data.getDate()).toString();
    return `${data.getFullYear()}${month.padStart(2, 0)}${day.padStart(2, 0)}`
}*/
function dealData(num) {
    return num > 9 ? num : `0${num}`;
}
export function getNowData() {
    let data = new Date;
    let month = dealData(data.getMonth() + 1);
    let day = dealData(data.getDate());
    return `${data.getFullYear()}${month}${day}`
}

export function judgeTime(planTiem,now_time) {
    let flag = false;
    if (now_time) {
        now_time = now_time.substr(0, 8);
    }
    if (!planTiem) {
        return flag;
    }
    if (!planTiem || planTiem.length == 0) {
        return flag;
    }
    for (let i in planTiem) {
        let startTime = planTiem[i]['START_TIME'];
        let endTiem = planTiem[i]['END_TIME'];
        if (startTime <= now_time && now_time <= endTiem) {
            flag = true;
            break;
        }
    }
    return flag;
}
export function judgeProjectTime(planTiem,now_time) {
    console.log('服务器现在的时间：',now_time)
    let flag = false;
    if (now_time) {
        now_time = now_time.substr(0, 8);
    }
    if (!planTiem) {
        return flag;
    }
    if (!planTiem || planTiem.length == 0) {
        return flag;
    }
    for (let i in planTiem) {
        let startTime = planTiem[i]['XM_START_TIME'];
        let endTiem = planTiem[i]['XM_END_TIME'];
        if (startTime <= now_time && now_time <= endTiem) {
            flag = true;
            break;
        }
    }
    return flag;
}
export function judgeUpdateTime(planTiem,now_time) {
    console.log('服务器现在的时间：',now_time)
    let flag = false;
    if (now_time) {
        now_time = now_time.substr(0, 8);
    }
    if (!planTiem) {
        return flag;
    }
    if (!planTiem || planTiem.length == 0) {
        return flag;
    }
    for (let i in planTiem) {
        let startTime = planTiem[i]['XM_START_TIME'];
        let endTiem = planTiem[i]['XM_UPDATE_END_TIME'];
        if (startTime <= now_time && now_time <= endTiem) {
            flag = true;
            break;
        }
    }
    return flag;
}
function changeTime(str){
    let month = str.substr(4,1).indexOf('0')==0?str.substr(5,1):str.substr(4,2);
    let day = str.substr(6,1).indexOf('0')==0?str.substr(7,1):str.substr(6,2);
    let time = str.substr(0,4)+'年'+month+'月'+day+'日';
    return time;
}
export function fomateTime(planTime,now_time){
    let times = [];
    if (now_time) {
        now_time = now_time.substr(0, 8);
    }
    if (!planTime) {
        return times;
    }
    if (!planTime || planTime.length == 0) {
        return times;
    }

    for (let i in planTime) {
        let startTime = planTime[i]['START_TIME'];
        let endTime = planTime[i]['END_TIME']
        if (startTime <= now_time && now_time <= endTime) {
            let time = changeTime(startTime)+'-'+changeTime(endTime);
            times.push(time)
        }
    }
    return unique(times);
}
function unique(arr){//去重
    var x = new Set(arr);
    return [...x];
}

/**
 * @author:weixl
 * @description: 节流函数，通过控制每次事件执行的时间间隔控制短时间多次执行方法
 * handler:要执行的方法
 * wait：每次点击事件执行的时间间隔(毫秒)
 * @date: 2019/3/1 19:04
 * @params :
 * @return :
 */
export function throttle(handler, wait) {
    // debugger;

    var lastTime = 0;

    return function () {
        var nowTime = new Date().getTime();

        if (nowTime - lastTime > wait) {
            handler.apply(this, arguments);
            lastTime = nowTime;
        }else{
            Toast.info("请不要快速点击",1);
        }

    }
}
export function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

    if(arr=document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}
export function setCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

export function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
export function isIOS(){//校验是不是IOS系统浏览器访问
    var u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}
