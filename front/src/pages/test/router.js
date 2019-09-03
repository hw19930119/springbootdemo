import React from 'react';
import { Router, Switch, Route } from 'dva/router';
import dynamic from 'dva/dynamic';
import Layout from '../../layouts/IndexPageLayout';

function RouterConfig({ history, app }) {
    const Home = dynamic({
        app,
        component: () => import('./routes/Home')
    });

    const NotFound = dynamic({
        app,
        component: () => import('components/ui/404')
    });

    const routes = [
        {
            path: '/',
            component: Home,
            exact: true
        }
    ];

    return (
        <Router history={history}>
            <Layout>
                <Switch>
                    {routes.map(route => <Route key={route.path} {...route} />)}
                    <Route path="*" component={NotFound} />
                </Switch>
            </Layout>
        </Router>
    );
}

export default RouterConfig;
