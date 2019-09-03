import dva from 'dva';
import '@share/shareui-font/dist/style.css';
import '../../assets/sass/_reset.scss';
import {orients} from "../../components/ui/Paint/PaintInit";
import {Toast} from '@mshare/mshareui';
// import Viewer from 'react-viewer-mobile';
// import 'react-viewer-mobile/dist/index.css';
// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('../../models/count'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');

let isOrients = orients();
if(!isOrients) {
    Toast.info("当前屏蔽体验不佳，请换成竖屏！", 0, () => {
    }, true);
}
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize",function(){
    let pageType = orients();
    if(!pageType) {
        Toast.info("当前屏蔽体验不佳，请换成竖屏！",0,()=>{},true);
        if(window.showPaint){
            document.getElementById('paintBox').style.display="none";
        }
    }else{
        Toast.hide();
        if(window.showPaint){
            document.getElementById('paintBox').style.display="block";
        }
    }
})
