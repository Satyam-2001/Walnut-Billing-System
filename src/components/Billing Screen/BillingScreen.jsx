import axios from 'axios'
import React, { useEffect, useState, useContext, Fragment } from 'react'
import AddBill from './AddBill/AddBill'
import classes from './BillingScreen.module.css'
import DynamicDropwdownInput from '../Utils/Dynamic Dropdown Input/DynamicDropwdownInput'
import BillTable from './BillTable'
import LoginContext from '../../context/login-context'

const BillingScreen = (props) => {

    const [isAddBillOpen, setIsAddBillOpen] = useState(false)
    const [billData, setBillData] = useState(undefined)
    const [patientData, setPatient] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [buttonName, setButtonName] = useState('Select Patient')
    const logout = useContext(LoginContext)

    const getMatchingPatient = async (name) => {
        try {
            const res = await axios.get(`/api/v1/patient/matchingPatient?name=${name}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            return res.data;
        }
        catch (error) {
            return error;
        }
    }

    const getBillData = async (patientId) => {
        try {
            const res = await axios.get(`/api/v1/receipt/allReceipt/${patientId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            return res.data
        }
        catch (error) {
            if (error.response.status === 401) {
                logout();
            }
        }
    }

    const fetchBillData = (billId) => {
        setIsLoading(true)
        setIsAddBillOpen(false)
        getBillData(billId).then(res => {
            setIsLoading(false)
            setButtonName('Change Patient')
            setBillData(res)
        }
        )
    }

    return (
        <div className={props.className}>
            <div className={classes.header}>
                <h2 className={classes.title}>Billing Screen</h2>
                <div className={classes['patient-input']}>
                    <div className={classes['patient-box']}>
                        <p className={classes.label}>Patient Name</p>
                        <DynamicDropwdownInput attr={'fullName'} getMatchingData={getMatchingPatient} callBack={(data) => setPatient(data)} />
                    </div>
                    <div className={classes['submit-btn-wrapper']}>
                        <button disabled={patientData === null} className={`${classes['submit-btn']} ${patientData === null ? classes['btn-disabled'] : undefined}`} onClick={() => fetchBillData(patientData.id)}><p>{buttonName}</p></button>
                    </div>
                </div>
            </div>
            {typeof billData === 'object' ? (
                <div className={classes['receipt-box']}>
                    <div className={classes['receipt-title']}>
                        <h3>RECEIPT : {patientData.fullName}</h3>
                        <button onClick={() => { setIsAddBillOpen(prop => !prop) }} className={classes['add-bill-btn']}><ion-icon name={isAddBillOpen ? "close-outline" : "add-outline"} className={classes.plus}></ion-icon><p>  Add Bill</p></button>
                    </div>
                    <hr />
                </div>
            ) : undefined}
            {!isAddBillOpen && isLoading ? <p className={classes.text}>Loading...</p> : undefined}
            {isAddBillOpen ? <AddBill patientId={patientData.id} patientName={patientData.fullName} closeAddBill={() => setIsAddBillOpen(false)} /> : undefined}
            {!isAddBillOpen && typeof billData === 'object' && billData.length > 0 ? <BillTable billData={billData} /> : undefined}
            {!isAddBillOpen && typeof billData === 'object' && billData.length === 0 ? <p className={classes.text}>No Bill Available</p> : undefined}
        </div>
    )
}

export default BillingScreen