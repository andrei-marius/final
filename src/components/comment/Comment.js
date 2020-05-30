import React from 'react';
import classes from './comment.module.css';

class Component extends React.Component {
    render() {
        return (
            <div className={classes['comment-container']}>
                <p>{this.props.text}</p>
            </div>
        ) 
    }
}

export default Component;