import React from 'react';

// components
import { Button, WhiteSpace } from '@mshare/mshareui';

// styles
import styles from './styles/index.scss';

import { getUserList } from 'services/user';

class Home extends React.Component {
    state = {
        data: []
    };

    componentDidMount() {
        this.requestData();
    }

    requestData() {
        getUserList().then(data => {
            this.setState({
                data
            });
        });
    }

    render() {
        const { data } = this.state;

        return (
            <div className={styles.container}>
                <Button
                    type="primary"
                    onClick={() => {
                        dispatch({ type: 'global/loading', status: true });

                        setTimeout(() => dispatch({ type: 'global/loading', status: false }), 2000);
                    }}
                >
                    按鈕
                </Button>
                <WhiteSpace />
                <Button type="warning" onClick={() => this.setState({ data: null })}>
                    新增DidCatch
                </Button>
                {data.map(i => <div>{i.toString()}</div>)}
            </div>
        );
    }
}

export default Home;
