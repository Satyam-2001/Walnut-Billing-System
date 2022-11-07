import React, { useContext, useState, useRef, useEffect } from 'react'
import classes from './DynamicDropwdownInput.module.css'
import LoginContext from '../../../context/login-context'
import useOutsideAlerter from '../../../hooks/useOutsideAlerter'
import StyledButton from '../StyledButton/StyledButton'

const DynamicDropwdownInput = (props) => {

    const [name, setName] = useState('')
    const [options, setOptions] = useState([])
    const [selectButtonDisabled, setSelectButtonDisabled] = useState(true)
    const [buttonName, setButtonName] = useState('Select')
    const [data, setData] = useState(null)
    const [timer, setTimer] = useState(setTimeout(() => { }, 1))
    const [selected, setSelected] = useState(0)
    const logout = useContext(LoginContext)
    const inputRef = useRef()
    const dropdownRef = useRef()
    useOutsideAlerter([inputRef, dropdownRef], () => setOptions([]))

    useEffect(() => {
        if(props.emptyField) {
            setName('')
        }
    }, [])

    useEffect(() => {
        setName('')
        setButtonName('Select')
        setSelectButtonDisabled(true)
        setData(null)
        setSelected(0)
        setOptions([])
    }, [props.buttonName])

    const callMethod = (name) => {
        clearTimeout(timer);
        if (name.length <= 2) {
            setOptions([]);
            return;
        }
        setTimer(setTimeout(() => {
            props.getMatchingData(name).then(res => {setSelected(0); setOptions(res || []);}).catch(e => {
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
        setButtonName('Change')
        props.fetchBillData(data)
    }

    const selectName = (data) => {
        setSelectButtonDisabled(false)
        setName(data[props.attr])
        setOptions([])
        setData(data)
    }

    const keyDownHandler = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            setSelected(prop => {
                if (prop + 1 >= options.length) return prop;
                return prop + 1;
            })
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault()
            setSelected(prop => {
                if (prop - 1 < 0) return prop;
                return prop - 1;
            })
        }
        if (e.key === 'Enter' && options.length) {
            setName(options[selected][props.attr])
            setOptions([])
            setSelected(0)
            setSelectButtonDisabled(true)
            setButtonName('Change ')
            props.fetchBillData(options[selected])
        }
    }

    return (
        <div className={classes['patient-input-wrapper']}>
            <div className={classes.wrapper}>
                <input id={`${props.buttonName} input`} ref={inputRef} className={classes['text-input']} type='text' onChange={changeInputValue} onKeyDown={keyDownHandler} value={name} onClick={() => callMethod(name)} />
                {
                    options.length > 0 ? (
                        <div ref={dropdownRef} className={classes.dropdown}>
                            {options.map((data, index) => {
                                return (
                                    <button key={data.id | data[props.attr]} className={`${classes.btn} ${index === selected ? classes.selected : undefined}`} onClick={() => selectName(data)}>{data[props.attr]}</button>
                                )
                            })}
                        </div>
                    ) : undefined
                }
            </div>
            <StyledButton disabled={selectButtonDisabled} onClick={fetchBillData}>{`${buttonName} ${props.buttonName}`}</StyledButton>
        </div>
    )
}

export default DynamicDropwdownInput