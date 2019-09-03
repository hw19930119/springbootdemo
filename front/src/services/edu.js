import request from '../utils/request';
import * as api from './ServiceApi';

//保存听课基本信息
export function saveDetail (params){
    return request(api.edu.saveDetail, {body:{...params},method: 'POST'},true);
}
//查询听课本详情
export function getDetail (params){ //params evaluateId
    return request(`${api.edu.getDetail}?evaluateId=${params}`, {method: 'GET'},true);
}
//我的听课记录
export function queryEvaluate (params){
    return request(api.edu.queryEvaluate, {method: 'GET'},true);
}
//学校下拉选择数据
export function schoolOption (){ //params evaluateId
    return request(api.edu.schoolOption, {method: 'GET'},true);
}
//老师下拉选择数据
export function teacherOption (params){ //params schoolId
    return request(`${api.edu.teacherOption}?schoolId=${params}`, {method: 'GET'},true);
}
//科目类别下拉选择数据
export function subjectTypeOption (){
    return request(api.edu.subjectTypeOption, {method: 'GET'},true);
}
//分享的二维码数据获取
export function getShareCourseDetail (params){
    return request(`${api.edu.getShareCourseDetail}?evaluateId=${params}`, {method: 'GET'},true);
}
//分享的二维码的图片地址
export function getShareQrImage (params){
    return request(api.edu.getShareQrImage, {...params,method: 'GET'},true);
}
//删除听课
export function deleteDetail (params){
    return request(`${api.edu.deleteDetail}?evaluateId=${params}`, {method: 'POST'},true);
}
//文件上传
export function fsUp (params){
    return request(api.edu.fsUp, {...params,method: 'POST',type:"upload"},true);
}
//文件上传后的返回数据转换
export function convertFrontendFileJson (params){
    return request(api.edu.convertFrontendFileJson, {...params,method: 'POST'},true);
}
//统计
export function getAllStatistics (){
    return request(api.edu.getAllStatistics,{method: 'GET'},true);
}
export function getJsSDK (){
    return request(`${api.edu.getJsSDK}`,{method: 'GET'},true);
}
export function getOrguserlist (params){
    return request(`${api.edu.getOrguserlist}?teacherId=${params}`,{method: 'GET'},true)
}
//分享到足迹圈
export function shareFootprintCircle (params){
    return request(`${api.edu.shareFootprintCircle}?evaluateId=${params}`,{method: 'POST'},true);
}
//上传视频
export function uploadVideo(params){
    return request(api.edu.uploadVideo, {...params,method: 'POST',type:"upload"},true);
}
export function uploadAudio(serverIds){
    return request(`${api.edu.uploadAudio}?serverIds=${serverIds}`,{method: 'GET'},true);
}
export function validateLoginUser() {
    return request(api.edu.validateLoginUser, {method : 'GET'},true);
}
export function getDetailMustLogin(params) {
    return request(`${api.edu.getDetailMustLogin}?evaluateId=${params}`, {method : 'GET'},true);
}
export function newUploadImg(params) {
    return request(api.edu.uploadImg, {...params,method: 'POST',type:"upload"},true);
}
export function getMyDraftCount(){
    return request(`${api.edu.getMyDraftCount}`,{method: 'GET'},true);
}

