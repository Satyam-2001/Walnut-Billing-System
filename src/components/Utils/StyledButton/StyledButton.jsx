import classNames from 'classnames'
import React from 'react'
import classes from './StyledButton.module.css'

const StyledButton = (props) => {
    return (
        <button
            {...props}
            className={classNames(props.className, classes.button, { [classes.disabled]: props.disabled })}
        >
            {props.children}
        </button>
    )
}

export default StyledButton