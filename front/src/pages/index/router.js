import React from 'react';
import { Router, Switch, Route } from 'dva/router';
import dynamic from 'dva/dynamic';
const App = ({ children }) => <div>{children}</div>;

function RouterConfig({ history, app }) {
    const Home = dynamic({
        app,
        component: () => import('./routes/Home')
    });
    const Info = dynamic({
        app,
        component: () => import('./routes/Info/Info')
    });
    const ListenList = dynamic({
         app,
         component: () => import('./routes/ListenList/ListenList')
     });
    const Total = dynamic({
         app,
         component: () => import('./routes/Total/Total')
     });
    const MyLesson = dynamic({
         app,
         component: () => import('./routes/MyLesson/MyLesson')
     });
    const SelectSchool = dynamic({
        app,
        component: () => import('./routes/SelectSchool/SelectSchool')
    });
    const Prevent = dynamic({
        app,
        component: () => import('./routes/MyLesson/Prevent')
    });
    //获取cookie
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
    function accessControl(page){
        let scookie = document.cookie;
        let url = location.href;
        if(scookie){
            //有cookie
            if(url.indexOf("draft") > 0 || url.indexOf("add") > 0){
                let teacherId = getCookie("teacherIdToken");
                let getWeixinWx = url.split("?")[1].split("=")[1];
                console.log("teacherId",teacherId,getWeixinWx);
                if(teacherId == getWeixinWx){
                    return page;
                }else{
                    return Prevent;
                }
            }else{
                return page;
            }
        }else{
            //没有cookie
                if(url.indexOf("detail") > 0){
                    return page;
                }else {
                    return Prevent;
                }
        }
    }
    const routes = [
        {
            key: 'index',
            path: '/',
            component: accessControl(Home),
            exact: true
        },
        {
            key: 'myLesson',
            path: '/myLesson/:type/:id?',
            component: accessControl(MyLesson),
            exact: false
        },
        {
            key: 'info',
            path: '/info',
            component: accessControl(Info),
            exact: true
        },
        {
            key: 'listenList',
            path: '/listenList',
            component: accessControl(ListenList),
            exact: true
        },
        {
            key: 'total',
            path: '/total',
            component: accessControl(Total),
            exact: true
        },
        {
            key: 'selectSchool',
            path: '/selectSchool',
            component: accessControl(SelectSchool),
            exact: true
        }
    ];
    return (
        <Router history={history}>
            <App>
                <Switch>{routes.map(route => <Route {...route} />)}</Switch>
            </App>
        </Router>
    );
}

export default RouterConfig;
