import React from 'react'
import classes from './Login.module.css'
import logo from '../../assets/logo.jpg'
import LoginBox from './LoginBox'

const Login = (props) => {
    return (
        <div className={classes['login-screen']}>
            <header className={classes.header}>
                <img src={logo} alt='Logo' className={classes.logo}></img>
            </header>
            <div className={classes.main}>
                <LoginBox loggedIn={props.loggedIn} />
            </div>
        </div>
    )
}

export default Login