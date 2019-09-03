export const CONTEXT = "/edu2-lesson";
export const isDev = process.env.NODE_ENV === 'development';
// 是否全局开启mock
export const __MOCK__ = isDev;

// 对应webpack-dev-server中的proxy配置/api, xxx配置为生产环境下
export const COMMON_API_PREFIX = isDev ? CONTEXT : CONTEXT;

// 对应webpack-dev-server中的proxy配置
export const MOCK_API_PREFIX = CONTEXT;
