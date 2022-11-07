import classNames from 'classnames'
import React from 'react'
import classes from './Box.module.css'

const Box = (props) => {
    return (
        <div className={classNames(classes.box, props.className)}>
            {props.children}
        </div>
    )
}

export default Box