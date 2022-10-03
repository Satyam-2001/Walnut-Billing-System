import React, { useContext, useState, useRef } from 'react'
import classes from './DynamicDropwdownInput.module.css'
import LoginContext from '../../../context/login-context'
import useOutsideAlerter from '../../../hooks/useOutsideAlerter'

const DynamicDropwdownInput = (props) => {

    const [name, setName] = useState('')
    const [options, setOptions] = useState([])
    const [selectButtonDisabled, setSelectButtonDisabled] = useState(true)
    const [buttonName, setButtonName] = useState('Select Patient')
    const [data, setData] = useState(null)
    const [timer, setTimer] = useState(setTimeout(() => { }, 1))
    const logout = useContext(LoginContext)
    const inputRef = useRef()
    const dropdownRef = useRef()
    useOutsideAlerter([inputRef, dropdownRef], () => setOptions([]))

    const callMethod = (name) => {
        clearTimeout(timer);
        if (name.length <= 2) {
            setOptions([]);
            return;
        }
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
        setSelectButtonDisabled(true)
    }

    const fetchBillData = () => {
        setSelectButtonDisabled(true)
        setButtonName('Change Patient')
        props.fetchBillData(data)
    }

    const selectName = (data) => {
        setSelectButtonDisabled(false)
        setName(data.fullName)
        setOptions([])
        setData(data)
    }

    const keyDownHandler = (e) => {
        if (e.key === 'Enter' && !selectButtonDisabled) {
            fetchBillData()
        }
    }

    return (
        <div className={classes['patient-input-wrapper']}>
            <div className={classes.wrapper}>
                <input ref={inputRef} className={classes['text-input']} type='text' onChange={changeInputValue} onKeyDown={keyDownHandler} value={name} onClick={() => callMethod(name)} />
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
            <button disabled={selectButtonDisabled} className={`${classes['submit-btn']} ${selectButtonDisabled ? classes['btn-disabled'] : undefined}`} onClick={fetchBillData}><p>{buttonName}</p></button>
        </div>
    )
}

export default DynamicDropwdownInput