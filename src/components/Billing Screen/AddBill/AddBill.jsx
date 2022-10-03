import axios from 'axios'
import React, { useContext } from 'react'
import BillInput from '../BillInput/BillInput'
import LoginContext from '../../../context/login-context'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    "generatedBy": undefined,
    "patientId": undefined
}

const AddBill = (props) => {

    const logout = useContext(LoginContext)


    const addBillApiCall = async (billDetail, billDetailRow) => {
        
        const resId = await axios.get(`/api/v1/receipt/getReceiptId/${props.patientData.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        })
        
        const data = {
            ...billDetail,
            billId: resId.data,
            patientId: props.patientData.id,
            generatedBy: props.username,
            billDate: filterDate(new Date()),
            billDetails: billDetailRow.map((rowData, index) => {
                return {
                    ...(rowData.billDetailData),
                    lineNumber: index + 1,
                    billId: resId.data,
                    sub_total: (+rowData.billDetailData.no_of_session * (+rowData.billDetailData.per_session_cost - +rowData.billDetailData.discount))
                }
            })
        }
        try {
            const res = await axios.post('/api/v1/receipt/saveReceipt', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                }
            })
            
            if (res.status === 200) {
                toast.success('Bill Added Successfully')
                props.closeBill()
                props.fetchBillData(props.patientData)
            }
        }
        catch (e) {
            if (e.response.status === 401) logout()
            return e
        }
    }

    return (
        <BillInput value='Add' apiCall={addBillApiCall} patientId={props.patientData.id} initialBillDetails={initialBillDetails} initialBillDetailRow={[initialBillDetailRow]} closeAddBill={props.closeBill} />
    )
}

export default AddBill