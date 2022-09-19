import axios from 'axios'
import React, { useContext, useState, useRef } from 'react'
import classes from './DynamicDropwdownInput.module.css'
import LoginContext from '../../../context/login-context'
import useOutsideAlerter from '../../../hooks/useOutsideAlerter'

const DynamicDropwdownInput = (props) => {

    const [name, setName] = useState('')
    const [options, setOptions] = useState([])
    const [timer, setTimer] = useState(setTimeout(() => { }, 1))
    const logout = useContext(LoginContext)
    const inputRef = useRef()
    const dropdownRef = useRef()
    useOutsideAlerter([inputRef, dropdownRef], () => setOptions([]))

    const callMethod = (name) => {
        if (name === '') setOptions([]);
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            props.getMatchingData(name).then(res => setOptions(res)).catch(e => {
                if (e.response.status === 401) {
                    logout()
                }
            })
        }, 500));
    }

    const changeInputValue = (event) => {
        setName(event.target.value)
        callMethod(event.target.value)
    }

    const selectName = (data) => {
        setName(data.fullName)
        setOptions([])
        props.callBack(data)
    }

    return (
        <div className={classes.wrapper}>
            <input ref={inputRef} className={classes['text-input']} type='text' onChange={changeInputValue} value={name} onClick={() => callMethod(name)} />
            {
                options.length > 0 ? (
                    <div ref={dropdownRef} className={classes.dropdown}>
                        {options.map(data => {
                            return (
                                <button key={data.id} className={classes.btn} onClick={() => selectName(data)}>{data[props.attr]}</button>
                            )
                        })}
                    </div>
                ) : undefined
            }
        </div>
    )
}

export default DynamicDropwdownInput