import React, { Fragment, useRef, useState } from 'react'
import classes from './Header.module.css'
import useOutsideAlerter from '../../hooks/useOutsideAlerter'

const Menu = (props) => {

    const wrapperRef = useRef(null)
    useOutsideAlerter([wrapperRef, props.loginRef], props.lossFocus);

    return (
        <div className={classes.menu} ref={wrapperRef}>
            <button onClick={props.logoutHandler} className={classes['logout-btn']}>LogOut</button>
        </div>
    );
}

const Header = (props) => {

    const [isMenuOpen, setMenuOpen] = useState(false)
    const loginButtonRef = useRef(null)

    return (
        <Fragment>
            <header className={classes.header}>
                <div className={classes.title}>
                    <button onClick={props.toggleNavBar}><ion-icon name="menu" className={classes.btn}></ion-icon></button>
                    <h1>DASHBOARD</h1>
                </div>
                <div className={classes.user}>
                    <p className={classes.username}>{`Hello ${props.username}`}</p>
                    <button ref={loginButtonRef} onClick={() => setMenuOpen(prop => !prop)}><ion-icon name="person-circle-outline" classNmae={classes['user-icon']}></ion-icon></button>
                </div>
            </header>
            {isMenuOpen ? <Menu loginRef={loginButtonRef} logoutHandler={props.setLoggedOut} lossFocus={() => setMenuOpen(false)} /> : undefined}
        </Fragment>
    )
}

export default Header