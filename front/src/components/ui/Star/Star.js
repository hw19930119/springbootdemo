import React from 'react';
import {List,Icon} from '@mshare/mshareui';
import './Star.scss';
let scoreArr = [0, 1, 2, 3, 4];
// const textArr = ['','不好','不太好','好','很好','非常好']
class Star extends React.Component {
    constructor() {
        super()
        this.state = {
            score: 0
        }
    }

    componentDidMount() {
        let {score = 0} = this.props;
        this.setState({score: score})
    }

    clickStar = ((star) => {
        let {index} = this.props;
        this.setState({score:star},()=>{
            this.props.changeClassRecord('stageLevel',star,index)
        })
    })

    render() {
        let {title = '评价',type} = this.props;
        let {score} = this.state;
        score = parseInt(score);
        return (
            <div className="stars">
                <List renderHeader={() => title}>
                        {
                            scoreArr && scoreArr.map((item,index)=>{
                                return ( <i key={index} className={`si si-com_star ${item < score?'active':''}`} onClick={()=>{
                                    type && type == 'detail'?null:
                                    this.clickStar(index+1)}
                                }></i>)
                            })
                        }
                        {/*<span>{`${score+1} 星 ${textArr[score+1]}` }</span>*/}
                </List>
            </div>
        )
    }
}
export default Star;
