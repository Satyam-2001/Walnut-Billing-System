import React, { useState } from 'react'
import classes from './LoginBox.module.css'
import { login } from '../Utils/Authorization/Authorization'

const LoginBox = (props) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [invalidUsername, setInvalidUsername] = useState(false)
    const [invalidPassword, setInvalidPassword] = useState(false)
    const [invalidCredential, setInvalidCredential] = useState(false)

    const loginClick = () => {
        if (username && password) {
            login(username, password).then(res => {
                if (res.loggedIn) props.loggedIn(username)
                else setInvalidCredential(true)
            });
            setPassword('')
            return;
        }
        if (username === '') setInvalidUsername(true)
        if (password === '') setInvalidPassword(true)
    }

    const fieldOnFocus = () => {
        if (invalidUsername) setInvalidUsername(false)
        if (invalidPassword) setInvalidPassword(false)
        setInvalidCredential(false)
    }

    return (
        <div className={classes['login-box']} >
            <span className={classes.title}>Login</span>
            <div className={classes['login-container']}>
                <div className={classes['login-credential']}>
                    <p className={classes.name}>Username</p>
                    <input name='username' type='text' required={true} className={`${classes['login-input']} ${invalidUsername ? classes.invalid : undefined}`} onChange={e => setUsername(e.target.value)} onFocus={fieldOnFocus} value={username}></input>
                    {invalidUsername ? <p className={classes['invalid-text']}>Username is required</p> : undefined}
                </div>
                <div className={classes['login-credential']}>
                    <p className={classes.name}>Password</p>
                    <input name='password' type='password' required={true} className={`${classes['login-input']} ${invalidPassword ? classes.invalid : undefined}`} onChange={e => setPassword(e.target.value)} onFocus={fieldOnFocus} value={password}></input>
                    {invalidPassword ? <p className={classes['invalid-text']}>Password is required</p> : undefined}
                </div>
                {invalidCredential ? <p className={classes['invalid-credential']}>username or password was invalid</p> : undefined}
                <button className={classes['login-btn']} onClick={loginClick}>Login</button>
            </div>
        </div>
    )
}

export default LoginBox