import React, { useEffect, useState, useContext, useReducer } from 'react'
import classes from './BillInput.module.css'
import axios from 'axios'
import SelectInput from '../../Utils/SelectInput/SelectInput'
import Table from '../../Utils/Table/Table'
import BillDetailRow from './BillDetailRow'
import LoginContext from '../../../context/login-context'

const initialBillDetailRow = {
    "lineNumber": undefined,
    "billId": undefined,
    "no_of_session": "",
    "per_session_cost": "",
    "discount": "",
    "discount_reason": "",
    "sub_total": undefined,
    "session_start_Date": "",
    "session_end_Date": "",
    "clinicId": "",
    "doctorId": "",
    "treatmentId": ""
}

const filterDate = (date) => {
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`
}


const reducer = (state, action) => {
    return { ...state, [action.type]: action[action.type] }
}

const rowReducer = (state, action) => {
    switch (action.type) {
        case 'addBill': {
            const id = Math.floor(Math.random() * 10000 + 1)
            return [...state, { id, billDetailData: initialBillDetailRow }];
        }
        case 'removeBill': {
            return state.filter(row => row.id !== action.id)
        }
        default:
            state.splice(action.index, 1, { ...state[action.index], billDetailData: { ...state[action.index].billDetailData, [action.type]: action[action.type] } })
            return [...state]
    }
}

const BillInput = (props) => {

    const tableHeaders = ['Doctor', 'Clinic', 'Treatment', 'No. of Sessions', 'Per Session Cost', 'Discount', 'Discount Reason', 'Start Date', 'End Date', 'Remove']
    const [billDetail, dispatch] = useReducer(reducer, props.initialBillDetails)
    const [billDetailRow, dispatchRow] = useReducer(rowReducer, props.initialBillDetailRow.map(billDetailData => { return { id: Math.floor(Math.random() * 10000 + 1), billDetailData } }))
    const [isValidate, setValidate] = useState(true)
    const [paymentDisabled, setPaymentDisabled] = useState(billDetail.paymentMode === "" || billDetail.paymentMode === 'Cash')
    const [serverError, setServerError] = useState(false)
    const logout = useContext(LoginContext)

    const total_amount = billDetailRow.reduce((value, data) => {
        return value + +data.billDetailData.no_of_session * (+data.billDetailData.per_session_cost - +data.billDetailData.discount);
    }, 0)

    const addRowHandler = () => {
        dispatchRow({ type: 'addBill' })
    }

    const removeRow = (id) => {
        if (billDetailRow.length === 1) return
        dispatchRow({ type: 'removeBill', id })
    }

    const validateData = () => {
        if (billDetail.paymentMode === "" || billDetail.paymentDate === "") return false;
        if (billDetail.paymentMode !== "Cash" && billDetail.patientId === "") return false;
        if (billDetailRow.find(row => { return (row.billDetailData.treatmentId === "" || row.billDetailData.no_of_session === "" || row.billDetailData.per_session_cost === "" || ((row.billDetailData.discount === "" || row.billDetailData.discount === '0')  && !(row.billDetailData.discount_reason === ""))) })) return false;
        return true;
    }

    const setPaymentMode = paymentMode => {
        if (paymentMode === 'Cash') {
            dispatch({ type: 'paymentId', paymentId: '' })
            dispatch({ type: 'paymentBank', paymentBank: '' })
            setPaymentDisabled(true)
        }
        else {
            setPaymentDisabled(false)
        }
        dispatch({ type: 'paymentMode', paymentMode })
    }

    const formSubmitHandler = async (event) => {
        event.preventDefault()
        if (!validateData()) {
            setValidate(false)
            return;
        }
        try {
            props.apiCall(billDetail, billDetailRow).then().catch(e => setServerError(true))
        }
        catch (e) {
            if (e.response.status === 401) logout()
        }
    }

    return (
        <div className={classes['add-bill']}>
            <h4>Bill Details {props.billId ? `: ${props.billId}` : undefined} : Amount - {total_amount}</h4>
            <hr />
            <Table header={tableHeaders} className={classes.table}>
                {billDetailRow.map((row, index) => {
                    return <BillDetailRow isValidate={isValidate} key={row.id} index={index} id={row.id} dispatch={dispatchRow} patientId={props.patientId} removeRow={removeRow} billDetail={row.billDetailData} />
                })}
            </Table>
            <div className={classes['add-row-btn-wrapper']}>
                <button className={classes.btn} onClick={addRowHandler}>Add More Bill Detail</button>
            </div>
            <h4>Payment Details</h4>
            <hr />
            <div className={classes.grid}>
                <div className={classes.cell}>
                    <label className={classes.label} htmlFor="Payment Date">Payment Date</label>
                    <input max={filterDate(new Date())} value={billDetail.paymentDate} id="Payment Date" type="date" className={`${classes['text-input']} ${!(isValidate || billDetail.paymentDate) ? classes['invalid-input'] : undefined}`} onChange={(e) => dispatch({ type: 'paymentDate', paymentDate: e.target.value })}></input>
                </div>
                <div className={classes.cell}>
                    <label className={classes.label}>Payment Mode</label>
                    <SelectInput className={`${classes['text-input']} ${!(isValidate || billDetail.paymentMode) ? classes['invalid-input'] : undefined}`} value={billDetail.paymentMode} getId={data => data} name={'Payment Mode'} attr={data => data} data={['Cash', 'UPI', 'Online Other']} callBack={setPaymentMode} />
                </div>
                <div className={classes.cell}>
                    <label className={classes.label} htmlFor="Payment Id">Payment Id</label>
                    <input disabled={paymentDisabled} value={billDetail.paymentId} id="Payment Id" type="text" className={`${classes['text-input']} ${!(isValidate || paymentDisabled || billDetail.paymentId !== "") ? classes['invalid-input'] : undefined}`} onChange={(e) => dispatch({ type: 'paymentId', paymentId: e.target.value })}></input>
                </div>
            </div>
            {
                (!isValidate || serverError) ? (
                    <div className={classes['validate-wrapper']}>
                        <p className={classes.invalid}>{serverError ? 'Unknown Error Ocuured' : 'Fill the required fields'}</p>
                    </div>
                ) : undefined
            }
            <div className={classes['btn-div']}>
                <input className={classes.btn} type='submit' value={`${props.value} Bill`} onClick={formSubmitHandler} />
                <button onClick={props.closeAddBill} className={classes.btn}>Cancel</button>
            </div>
        </div>
    )
}

export default BillInput