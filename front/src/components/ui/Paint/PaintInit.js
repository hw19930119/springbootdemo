import { Toast} from "@mshare/mshareui";
export function orients() {
    if(window.orientation===undefined){//浏览器不支持window.orientation参数的情况下
        if(("createTouch" in document)){//移动端
            var agent = navigator.userAgent.toLowerCase();
            if(agent.match(/android/)=="android" || agent.match(/iphone/)=="iphone"){
                if(window.innerWidth > window.innerHeight){//如果屏幕的宽度大于高度，代表横屏
                    return false;
                }else{
                    return true;
                }
            }else if(agent.match(/ipad/)=="ipad"){
                if(window.orientation === 90 || window.orientation ===-90) {
                    //ipad、iphone竖屏；Andriod横屏
                    return false;
                }else if (window.orientation === 0 || window.orientation === 180) {
                    //ipad、iphone横屏；Andriod竖屏
                    return true;
                }
            }
        }else{//pc端
            return true;
        }
    }else{
        if(window.orientation === 90 || window.orientation ===-90) {
            //ipad、iphone竖屏；Andriod横屏
//		    jQ("body").attr("class", "landscape");
//		    orientation = 'landscape';//横屏
//		    $('#mymodal').addClass('none');
//		    colseBoard();
//		    handWrit(ios_result_img,ios_result_url,ios_num_ber);
//		    jQuery('#mymodal').hide();

            return false;
        }else if (window.orientation === 0 || window.orientation === 180) {
            //ipad、iphone横屏；Andriod竖屏
//		    jQ("body").attr("class", "portrait");
//		    orientation = 'portrait';//竖屏
//		    colseBoard();
//		    handWrit(ios_result_img,ios_result_url,ios_num_ber);
//		    $('#mymodal').removeClass('none');
//		    jQuery('#mymodal').hide();
//		    alertText('为了你更好的体验，请不要随意旋转屏幕!');
            return true;
        }
    }
}
export const paintColor = [
    ['#000','#555555','#555574','#5c7658','#65975c','#70b961','#7cda67','#89fc6e','#725655','#777759','#7e985d','#86b962','#90da68','#9bfb6f','#8f5857','#93785a','#99995e','#9fba63','#a7db69','#b1fc6f'],
    ['#000','#e93323','#ae5b58','#b17a5b','#b59a5f','#bbbb64','#c1dc6a','#c9fd70','#cd5e5a','#cf7c5c','#d39c60','#d7bc65','#dddd6b','#e3fe72','#ec615c','#ee7f5e','#f09e62','#f4bd67','#f9de6d','#ffff73'],
    ['#000','#e933f6','#ae5bf6','#b17af7','#b59af8','#bbbbf9','#c1dcfb','#c9fdfe','#cd5ef6','#cf7cf7','#d39cf8','#d7bcfa','#ddddfc','#e3fefe','#ec61f7','#ee7ff8','#f09ef9','#f4bdfa','#f9defc','#ffffc2']
]
export const dataURItoBlob = function(urlData){
    let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = window.atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}
