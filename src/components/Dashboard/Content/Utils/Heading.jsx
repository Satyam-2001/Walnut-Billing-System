import React from 'react'
import classes from './Heading.module.css'
import classNames from 'classnames'

const Heading = (props) => {
    return (
        <div className={classNames(classes.header, props.className)}>
            <h2 className={classes.title}>{props.name}</h2>
            {props.children}
        </div>
    )
}

export default Heading