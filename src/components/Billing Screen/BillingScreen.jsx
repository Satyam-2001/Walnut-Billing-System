import axios from 'axios'
import React, { useState, useContext } from 'react'
import AddBill from './AddBill'
import classes from './BillingScreen.module.css'
import DynamicDropwdownInput from '../Utils/Dynamic Dropdown Input/DynamicDropwdownInput'
import BillTable from './BillTable'
import LoginContext from '../../context/login-context'
import EditBill from './EditBill'

const BillingScreen = (props) => {

    const [isAddBillOpen, setIsAddBillOpen] = useState(false)
    const [isEditBillOpen, setIsEditBillOpen] = useState(undefined)
    const [billData, setBillData] = useState(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [patientData, setPatient] = useState(null)
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
            if (error.response.status === 401) {
                logout();
            }
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

    const fetchBillData = (patientData) => {
        setIsLoading(true)
        setIsAddBillOpen(false)
        setPatient(patientData)
        getBillData(patientData.id).then(res => {
            setIsLoading(false)
            setBillData(res)
        }
        )
    }

    const addBill = () => {
        if (!isAddBillOpen) setIsEditBillOpen(undefined)
        setIsAddBillOpen(prop => !prop)
    }

    const editBill = (data) => {
        setIsAddBillOpen(false)
        setIsEditBillOpen(data)
    }


    return (
        <div className={props.className}>
            <div className={classes.header}>
                <h2 className={classes.title}>Billing Screen</h2>
                <div className={classes['patient-input']}>
                    <div className={classes['patient-box']}>
                        <p className={classes.label}>Patient Name</p>
                        <DynamicDropwdownInput attr={'fullName'} getMatchingData={getMatchingPatient} fetchBillData={fetchBillData} />
                    </div>
                </div>
            </div>
            {typeof billData === 'object' ? (
                <div className={classes['receipt-box']}>
                    <div className={classes['receipt-title']}>
                        <h3>RECEIPT : {patientData.fullName}</h3>
                        <button onClick={addBill} className={classes['add-bill-btn']}><ion-icon name={isAddBillOpen ? "close-outline" : "add-outline"} className={classes.plus}></ion-icon><p>  Add Bill</p></button>
                    </div>
                    <hr />
                </div>
            ) : undefined}
            {!isAddBillOpen && isLoading ? <p className={classes.text}>Loading...</p> : undefined}
            {isAddBillOpen ? <AddBill username={props.username} patientData={patientData} closeBill={() => setIsAddBillOpen(false)} fetchBillData={fetchBillData} /> : undefined}
            {isEditBillOpen ? <EditBill patientData={patientData} closeBill={() => setIsEditBillOpen(undefined)} billInfo={isEditBillOpen} fetchBillData={fetchBillData} /> : undefined}
            {!isAddBillOpen && !isEditBillOpen && !isLoading && typeof billData === 'object' && billData.length > 0 ? <BillTable billData={billData} editBill={editBill} patientData={patientData} fetchBillData={fetchBillData} /> : undefined}
            {!isAddBillOpen && !isLoading && typeof billData === 'object' && billData.length === 0 ? <p className={classes.text}>No Bill Available</p> : undefined}
        </div>
    )
}

export default BillingScreen