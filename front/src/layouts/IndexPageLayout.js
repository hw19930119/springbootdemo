import React, { Component } from 'react';
import { connect } from 'dva';
import { ActivityIndicator } from '@mshare/mshareui';
import DidCatch from 'components/hoc/DidCatch';

@DidCatch
@connect(({ global }) => ({
    loading: global.loading
}))
class IndexPageLayout extends Component {
    render() {
        const { children, loading } = this.props;

        return (
            <React.Fragment>
                {children}
                <ActivityIndicator toast text="加载中..." animating={loading} />
            </React.Fragment>
        );
    }
}

export default IndexPageLayout;
