import React, { useContext } from 'react'
import DynamicDropwdownInput from '../../../Utils/Dynamic Dropdown Input/DynamicDropwdownInput'
import classes from './ClinicHeader.module.css'
import StyledButton from '../../../Utils/StyledButton/StyledButton'
import LoginContext from '../../../../context/login-context'
import axios from 'axios'

const ClinicHeader = (props) => {

    const logout = useContext(LoginContext)

    const getMatchingData = async (name) => {
        try {
            const res = await axios.get(`/api/v1/clinic/getMatchingClinic?clinicName=${name}`, {
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
                <h2 className={classes.title}>Clinic</h2>
                <StyledButton onClick = {props.addClinic}>Add Clinic</StyledButton>
            </div>
            <div className={classes.input}>
                <div className={classes.box}>
                    <p className={classes.label}>Clinic Name</p>
                    <DynamicDropwdownInput attr='name' getMatchingData={getMatchingData} fetchBillData={props.fetchBillData} buttonName='Clinic' />
                </div>
            </div>
            {props.children}
        </div>
    )
}

export default ClinicHeader