/*
 * @(#) ServiceApi.js
 * 版权声明 厦门畅享信息技术有限公司, 版权所有 违者必究
 *
 * <br> Copyright:  Copyright (c) 2019
 * <br> Company:厦门畅享信息技术有限公司
 * <br> @author liuxia
 * <br> 2019/7/23 14:06
 */
// export const context = `/edu2-lesson`; //项目文根
/* ============== 按照接口分类定义下列接口 ============== */
export const edu = {
    saveDetail : '/evaluate/save-detail',
    queryEvaluate : '/evaluate/query-my-year-evaluate',
    getDetail : '/evaluate/get-detail',
    getShareCourseDetail : '/evaluate/get-share-course-detail',
    getShareQrImage : '/evaluate/get-share-qr-image.jpg',
    deleteDetail : '/evaluate/delete-detail',
    shareFootprintCircle:'/evaluate/share-evaluate',
    convertFrontendFileJson : '/evaluate/convert-frontend-file-system-json',
    schoolOption : '/select-option/school-option',
    teacherOption : '/select-option/teacher-option',
    subjectTypeOption : '/select-option/subject-type-option',
    fsUp : '/fs-up',
    getAllStatistics:'/mystatistics/get-all-statistics',
    getJsSDK:'/user/getJsSDK-config',
    getOrguserlist:'/user/get-orguserlist-by-teacherid',
    uploadVideo:'/evaluate/uploadVideo',
    uploadAudio:'/evaluate/uploadAudio',
    validateLoginUser:'/user/validate-login-user',
    getDetailMustLogin:'/evaluate/get-detail-must-login',
    uploadImg:'/file/upload-file-to-fs',
    getMyDraftCount:'/evaluate/get-my-draft-count'
}
