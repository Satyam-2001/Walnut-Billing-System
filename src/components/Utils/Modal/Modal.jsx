import React from 'react'
import classes from './Modal.module.css'

const Modal = (props) => {
    return (
        <div>
            <div className={classes.backdrop}></div>
            <div className={classes.modal}>
                <header className={classes.header}>Confirmation</header>
                <div className={classes.content}>
                    <p>Are you sure you want to delete Bill : {props.billId} ?</p>
                </div>
                <div className={classes['button-wrapper']}>
                    <button onClick={() => {props.deleteBill(props.billId); props.close()}}>Delete</button>
                    <button onClick={props.close}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Modal