import React, { useEffect, useState, useContext, useReducer } from 'react'
import classes from './BillInput.module.css'
import SelectInput from '../../../../Utils/SelectInput/SelectInput'
import Table from '../../../../Utils/Table/Table'
import BillDetailRow from './BillDetailRow'
import LoginContext from '../../../../../context/login-context'
import StyledButton from '../../../../Utils/StyledButton/StyledButton'
import Box from '../../Utils/Box'

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

    const tableHeaders = ['Doctor', 'Clinic', 'Treatment', 'No. of Sessions', 'Per Session Cost', 'Discount', 'Discount Reason', 'Start Date', 'End Date']
    if (!props.readOnly) {
        tableHeaders.push('Remove')
    }
    const [billDetail, dispatch] = useReducer(reducer, props.initialBillDetails)
    const [billDetailRow, dispatchRow] = useReducer(rowReducer, props.initialBillDetailRow.map(billDetailData => { return { id: Math.floor(Math.random() * 10000 + 1), billDetailData } }))
    const [isValidate, setValidate] = useState(true)
    const [paymentDisabled, setPaymentDisabled] = useState(billDetail.paymentMode === "" || billDetail.paymentMode === 'Cash')
    const [serverError, setServerError] = useState(false)
    const [error, setError] = useState('')
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
        if (billDetail.paymentMode === "" || billDetail.paymentDate === "") return {error: true, message: 'Fill the required fields'};
        if (billDetail.paymentMode !== "Cash" && billDetail.paymentId === "") return {error: true, message: 'Fill the required fields'};
        if (billDetailRow.find(row => { return (row.billDetailData.treatmentId === "" || row.billDetailData.no_of_session === "" || row.billDetailData.no_of_session === "0" || row.billDetailData.per_session_cost === "" || ((row.billDetailData.discount !== "" && row.billDetailData.discount !== '0' && row.billDetailData.discount !== 0) && (row.billDetailData.discount_reason === ""))) })) return {error: true, message: 'Fill the required fields'};
        if ((billDetail.paymentMode === "UPI" || billDetail.paymentMode === "RTGS") && billDetail.paymentId.length !== 16) return {error: true, message: `${billDetail.paymentMode} Id should be of 16 digits`}
        if (billDetail.paymentMode === "NEFT" && billDetail.paymentId.length !== 12) return {error: true, message: `${billDetail.paymentMode} Id should be of 12 digits`}
        return true;
    }

    useEffect(() => {
        setValidate(prop => prop || validateData())
    }, [billDetail, billDetailRow])

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
        const {error, message} = validateData()
        if (error) {
            setValidate(false)
            setError(message)
            return;
        }
        try {
            props.apiCall(billDetail, billDetailRow).then().catch(e =>
                setError('Unknown Error Ocuured'))
        }
        catch (e) {
            if (e.response.status === 401) logout()
        }
    }

    return (
        <Box>
            <h4>Bill Details {props.billId ? `: ${props.billId}` : undefined} : Amount - {total_amount}</h4>
            <hr />
            <Table header={tableHeaders} className={classes.table}>
                {billDetailRow.map((row, index) => {
                    return <BillDetailRow readOnly={props.readOnly} isValidate={isValidate} key={row.id} index={index} id={row.id} dispatch={dispatchRow} patientId={props.patientId} removeRow={removeRow} billDetail={row.billDetailData} />
                })}
            </Table>
            {!props.readOnly ? (
                <div className={classes['add-row-btn-wrapper']}>
                    <StyledButton onClick={addRowHandler}>Add More Bill Detail</StyledButton>
                </div>)
                : undefined
            }
            <h4>Payment Details</h4>
            <hr />
            <div className={classes.grid}>
                <div className={classes.cell}>
                    <label className={classes.label} htmlFor="Payment Date">Payment Date</label>
                    <input readOnly={props.readOnly} max={filterDate(new Date())} value={billDetail.paymentDate} id="Payment Date" type="date" className={`${classes['text-input']} ${!(isValidate || billDetail.paymentDate) ? classes['invalid-input'] : undefined}`} onChange={(e) => dispatch({ type: 'paymentDate', paymentDate: e.target.value })}></input>
                </div>
                <div className={classes.cell}>
                    <label className={classes.label}>Payment Mode</label>
                    <SelectInput readOnly={props.readOnly} className={`${classes['text-input']} ${!(isValidate || billDetail.paymentMode) ? classes['invalid-input'] : undefined}`} value={billDetail.paymentMode} getId={data => data} name={'Payment Mode'} attr={data => data} data={['Cash', 'UPI', 'NEFT', 'RTGS', 'Online Other']} callBack={setPaymentMode} />
                </div>
                <div className={classes.cell}>
                    <label className={classes.label} htmlFor="Payment Id">Payment Id</label>
                    <input readOnly={props.readOnly} autoComplete='off' disabled={paymentDisabled} value={billDetail.paymentId} id="Payment Id" type="text" className={`${classes['text-input']} ${!(isValidate || paymentDisabled || billDetail.paymentId !== "") ? classes['invalid-input'] : undefined}`} onChange={(e) => dispatch({ type: 'paymentId', paymentId: e.target.value })}></input>
                </div>
            </div>
            {
                (!isValidate || serverError) ? (
                    <div className={classes['validate-wrapper']}>
                        <p className={classes.invalid}>{error}</p>
                    </div>
                ) : undefined
            }
            <div className={classes['btn-div']}>
                {props.value !== 'view' ? <StyledButton onClick={formSubmitHandler}>{`${props.value} Bill`}</StyledButton> : undefined}
                <StyledButton onClick={props.closeAddBill}>Cancel</StyledButton>
            </div>
        </Box>
    )
}

export default BillInput