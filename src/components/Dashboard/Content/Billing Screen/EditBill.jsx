import React, { useContext } from 'react'
import BillInput from './BillInput/BillInput';
import axios from 'axios'
import LoginContext from '../../../../context/login-context'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBill = (props) => {

    const logout = useContext(LoginContext)

    const editBillApiCall = async (billDetail, billDetailRow) => {
        const data = {
            ...billDetail,
            billDetails: billDetailRow.map((rowData, index) => {
                return {
                    ...rowData.billDetailData,
                    lineNumber: index + 1,
                    sub_total: (+rowData.billDetailData.no_of_session * (+rowData.billDetailData.per_session_cost - +rowData.billDetailData.discount))
                }
            })
        }

        try {
            const res = await axios.patch('/api/v1/receipt/update', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                }
            })
            if (res.status === 200) {
                toast.success('Bill Edited Successfully')
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
        <BillInput value='Edit' apiCall={editBillApiCall} billId={props.billInfo.billId} patientId={props.patientData.id} initialBillDetails={props.billInfo} initialBillDetailRow={props.billInfo.billDetails} closeAddBill={props.closeBill} />
    )
}

export default EditBill