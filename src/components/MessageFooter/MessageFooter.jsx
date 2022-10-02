import React, { Fragment, useEffect } from 'react'
import classes from './MessageFooter.module.css'

const MessageFooter = (props) => {

    const [show, setShow] = useState(false)

    useEffect(() => {
        props.showMessage(msg => {
            setShow(true)
            setMessage(msg)
            const timer = setTimeout(() => {
                setShow(false)
                clearTimeout(timer)
            }, 4000)
        })
    }, [])

    return (
        <Fragment>
            {show ? (<div></div>) : undefined}
        </Fragment>
    )
}

export default MessageFooter