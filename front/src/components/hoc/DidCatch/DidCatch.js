import React, { Component } from 'react';
import { Button } from '@mshare/mshareui';
import { isDev } from 'config/service';

import styles from './styles/index.scss';

const DidCatch = WrapComponent => {
    return class extends Component {
        constructor(props) {
            super(props);
            this.state = { error: false };
        }

        componentDidCatch(error, info) {
            this.setState({ error, info });
        }

        render() {
            if (this.state.error) {
                return (
                    <React.Fragment>
                        <div className={styles.error_display__container}>
                            <img
                                className={styles.error_icon}
                                src="https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg"
                                alt="error"
                            />
                            <Button type="primary" onClick={() => window.location.reload()}>
                                重新加载
                            </Button>
                        </div>
                        {isDev && (
                            <div className={styles.error_container}>
                                <h1>Error AGAIN: {this.state.error.toString()}</h1>
                                {this.state.info && (
                                    <div className={styles.error_stack__info}>
                                        {this.state.info.componentStack.split('\n').map(i => {
                                            return <p key={i}>{i}</p>;
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </React.Fragment>
                );
            }

            return <WrapComponent {...this.props} />;
        }
    };
};

export default DidCatch;
