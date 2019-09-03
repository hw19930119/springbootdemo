import $ from 'jquery';
export const getData = opt => {
    const bmContentType = {
        default: 'application/x-www-form-urlencoded',
        json: 'application/json'
    };
    let reqestData;

    if (opt.contentType === 'json')
    // if (opt.list) {
    //     reqestData = JSON.stringify({
    //         ...opt.data,
    //         currentPage: 1,
    //         linesPerPage: 10
    //     });
    // } else {
        reqestData = JSON.stringify(opt.data);
    else
    // }
        reqestData = opt.data;

    return new Promise((resolve, reject) => {
        $.ajax({
                   url: opt.url,
                   type: opt.type,
                   contentType: bmContentType[opt.contentType],
                   data: reqestData,
                   withCredentials: true,
                   success: e => {
                       if (e.status === '1200') resolve(e.data);
                       else {
                           // modal.warning({ content: e.message });
                           return console.error('wrong status');
                       }
                   },
                   error: e => {
                       if (e.readyState === 0) console.info(JSON.stringify(e));
                       // else modal.error({ content: JSON.stringify(e) });
                   }
               });
    });
};

// import axios from 'axios';
// import qs from 'qs';
// axios.defaults.baseURL = 'http://192.168.0.62:3000/mock/126';   // 路径
// axios.defaults.withCredentials = true;
// export const post=(url, data={})=>
// {
//     return new Promise((resolve, reject) => {
//         axios.post(url, qs.stringify(data),{
//             headers: {
//                 'Content-Type':'application/json'
//             }
//         }).then(res => {
//             console.log(res)
//             if (res.status === '1200')
//                 resolve(res.data)
//             else  return console.error('wrong status');
//         }).catch(err => {
//             console.log('err')
//             // reject(err)
//         })
//     })
// }
//
// export const get=(url, params)=>
// {
//     return new Promise((resolve, reject) => {
//         axios.get(url, {params:params}).then(res => {
//             if (e.status === '1200')
//             resolve(res.data)
//             else  return console.error('wrong status');
//
//         }).catch(err => {
//             console.log('err')
//             // reject(err)
//         })
//     })
// }

