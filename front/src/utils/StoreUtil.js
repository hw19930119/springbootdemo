/*
 * @(#) StoreUtil.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2018
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author liuxia
 * <br> 2019-07-17 15:46:11
 */

import  store from 'store';

/**
 * @author:liuxia
 * @description: 保存数据
 * @date: 2019/7/17 15:38
 * @params :
 * @return :
 */
export const setData = (name, data) => {
    store.set(name, data)
};

/**
 * @author:liuxia
 * @description: 获取数据
 * @date: 2019/7/17 15:39
 * @params :
 * @return :
 */
export const getData = (name) => {
    let data = store.get(name);
    return data;
};
/**
 * @author:liuxia
 * @description: 移除指定数据
 * @date: 2019/7/17 15:41
 * @params :
 * @return :
 */
export const removeByName = (name) => {
    store.remove(name);
};
/**
 * @author:liuxia
 * @description: 清空所有数据
 * @date: 2019/7/17 15:40
 * @params :
 * @return :
 */
export const clearAll = () => {
    store.clearAll();
}


