import React, { useContext } from 'react'
import DynamicDropwdownInput from '../../../Utils/Dynamic Dropdown Input/DynamicDropwdownInput'
import classes from './CrudHeader.module.css'
import StyledButton from '../../../Utils/StyledButton/StyledButton'
import LoginContext from '../../../../context/login-context'
import axios from 'axios'

const CrudHeader = (props) => {

    const logout = useContext(LoginContext)

    const getMatchingData = async (name) => {
        try {
            const res = await axios.get(`/api/v1/${props.name.toLowerCase()}/getMatching${props.api_name}?${props.api_name.toLowerCase()}Name=${name}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            return res.data;
        }
        catch (error) {
            if (error.response.status === 401) {
                logout();
            }
        }
    }

    return (
        <div className={classes.header}>
            <div className={classes['heading']}>
                <h2 className={classes.title}>{props.api_name}</h2>
                <StyledButton onClick = {props.addCrud}>Add {props.api_name}</StyledButton>
            </div>
            <div className={classes.input}>
                <div className={classes.box}>
                    <p className={classes.label}>{props.api_name} Name</p>
                    <DynamicDropwdownInput emptyField={props.emptyField} attr={props.getName} getMatchingData={getMatchingData} fetchBillData={props.fetchBillData} buttonName={props.api_name} />
                </div>
            </div>
            {props.children}
        </div>
    )
}

export default CrudHeader