import axios from 'axios'
import React, { useEffect, useState, useContext, useReducer } from 'react'
import SelectInput from '../../Utils/SelectInput/SelectInput'
import Table from '../../Utils/Table/Table'
import classes from './AddBill.module.css'
import BillDetailRow from './BillDetailRow'
import LoginContext from '../../../context/login-context'

const filterDate = (date) => {
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`
}


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

const initialBillDetails = {
    "billId": undefined,
    "billDate": undefined,
    "paymentId": "",
    "paymentMode": "",
    "paymentDate": "",
    "paymentBank": "",
    "billStatus": "",
    "generatedBy": undefined,
    "remark": "",
    "patientId": undefined
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

const AddBill = (props) => {

    const tableHeaders = ['Doctor', 'Clinic', 'Treatment', 'No. of Sessions', 'Per Session Cost', 'Discount', 'Discount Reason', 'Start Date', 'End Date', 'Remove']
    const [billDetail, dispatch] = useReducer(reducer, initialBillDetails)
    const [billDetailRow, dispatchRow] = useReducer(rowReducer, [{ id: 0, billDetailData: initialBillDetailRow }])
    const [isValidate, setValidate] = useState(true)
    const logout = useContext(LoginContext)

    const addRowHandler = () => {
        dispatchRow({ type: 'addBill' })
    }

    const removeRow = (id) => {
        dispatchRow({ type: 'removeBill', id })
    }

    const validateData = () => {
        if (billDetail.paymentMode === "") return false;
        if (billDetailRow.find(row => row.billDetailData.treatmentId === "")) return false;
        return true;
    }

    const formSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            if (!validateData()) {
                setValidate(false)
                return;
            }

            const resId = await axios.get(`/api/v1/receipt/getReceiptId/${props.patientId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            })

            const data = {
                ...billDetail,
                billId: resId.data,
                patientId: props.patientId,
                generatedBy: props.patientName,
                billDate: filterDate(new Date()),
                billDetails: billDetailRow.map((rowData, index) => {
                    return {
                        ...rowData.billDetailData,
                        lineNumber: index + 1,
                        billId: resId.data,
                        sub_total: (+rowData.billDetailData.no_of_session * (+rowData.billDetailData.per_session_cost - +rowData.billDetailData.discount))
                    }
                })
            }
            const res = await axios.post('/api/v1/receipt/saveReceipt', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                }
            })
            if(res.status === 200) {
                props.fetchBillData(props.patientId)
            }
        }
        catch (e) {
            if (e.response.status === 401) logout()
        }
    }

    return (
        <form className={classes['add-bill']} onSubmit={formSubmitHandler}>
            <h4>Bill Details</h4>
            <hr />
            <div className={classes.grid}>
                <div className={classes.cell}>
                    <label className={classes.label} htmlFor="Bill Status">Bill Status</label>
                    <input required={true} value={billDetail.billStatus} name="Bill Status" id="Bill Status" type="text" className={classes['text-input']} onChange={(e) => dispatch({ type: 'billStatus', billStatus: e.target.value })}></input>
                </div>
                <div className={classes.cell}>
                    <label className={classes.label} htmlFor="Remark">Remark</label>
                    <input required={true} value={billDetail.remark} id="Remark" type="text" className={classes['text-input']} onChange={(e) => dispatch({ type: 'remark', remark: e.target.value })}></input>
                </div>
            </div>
            <Table header={tableHeaders} className={classes.table}>
                {billDetailRow.map((row, index) => {
                    return <BillDetailRow key={row.id} index={index} id={row.id} dispatch={dispatchRow} patientId={props.patientId} removeRow={removeRow} billDetail={row.billDetailData} />
                })}
            </Table>
            <div className={classes['add-row-btn-wrapper']}>
                <button className={classes.btn} onClick={addRowHandler}>Add More Bill Detail</button>
            </div>
            <h4>Payment Details</h4>
            <hr />
            <div className={classes.grid}>
                <div className={classes.cell}>
                    <label className={classes.label} htmlFor="Payment Id">Payment Id</label>
                    <input required={true} value={billDetail.paymentID} id="Payment Id" type="text" className={classes['text-input']} onChange={(e) => dispatch({ type: 'paymentId', paymentId: e.target.value })}></input>
                </div>
                <div className={classes.cell}>
                    <label className={classes.label}>Payment Mode</label>
                    <SelectInput className={classes['text-input']} selectedValue={billDetail.paymentMode} name={'Payment Mode'} attr={data => data} data={['Cash', 'UPI', 'Online Other']} callBack={paymentMode => { dispatch({ type: 'paymentMode', paymentMode }) }} />
                </div>
                <div className={classes.cell}>
                    <label className={classes.label} htmlFor="Payment Date">Payment Date</label>
                    <input required={true} value={billDetail.paymentDate} id="Payment Date" type="date" className={classes['text-input']} onChange={(e) => dispatch({ type: 'paymentDate', paymentDate: e.target.value })}></input>
                </div>
                <div className={classes.cell}>
                    <label className={classes.label} htmlFor="Payment Bank">Payment Bank</label>
                    <input required={true} value={billDetail.paymentBank} id="Payment Bank" type="text" className={classes['text-input']} onChange={(e) => dispatch({ type: 'paymentBank', paymentBank: e.target.value })}></input>
                </div>
            </div>
            {
                isValidate ? undefined : (
                    <div className={classes['validate-wrapper']}>
                        <p className={classes.invalid}>Every Field is required</p>
                    </div>
                )
            }
            <div className={classes['btn-div']}>
                <input className={classes.btn} type='submit' value='Add Bill' />
                <button onClick={props.closeAddBill} className={classes.btn}>Cancel</button>
            </div>
        </form>
    )
}

export default AddBill