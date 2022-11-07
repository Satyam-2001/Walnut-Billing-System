import React, { Fragment, useContext, useState } from 'react'
import axios from 'axios'
import LoginContext from '../../../../context/login-context'
import ClinicHeader from './ClinicHeader'
import ClinicData from './ClinicData'
// import ClinicEdit from './ClinicEdit'

const initialClinicData =
{
    "clinicId": 0,
    "name": "",
    "address": "",
    "country": "",
    "state": "",
    "city": "",
    "pincode": "",
    "location": "",
    "status": true
}

const Clinic = (props) => {

    const [isEdit, setIsEdit] = useState(false)
    const [isAdd, setIsAdd] = useState(false)
    const [clinicData, setClinicData] = useState(null)
    const logout = useContext(LoginContext)

    const fetchBillData = async (data) => {
        try {
            const res = await axios.get(`/api/v1/clinic?clinicId=${data.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setIsEdit(true)
            setIsAdd(false)
            setClinicData(res.data)
        }
        catch (error) {
            if (error.response.status === 401) {
                logout();
            }
        }
    }

    const addClinic = () => {
        setIsAdd(true)
        setIsEdit(false)
        setClinicData(initialClinicData)
    }

    const cancel = () => {
        setIsAdd(false)
        setIsEdit(false)
        setClinicData(null)
    }

    return (
        <Fragment>
            <ClinicHeader fetchBillData={fetchBillData} addClinic={addClinic} />
            {isEdit ? <ClinicData type='edit' cancel={cancel} setClinicData={setClinicData} clinicData={clinicData} /> : undefined}
            {isAdd ? <ClinicData type='add' cancel={cancel} setClinicData={(data) => {setIsEdit(false); setIsAdd(true); setClinicData(data);}} clinicData={clinicData} /> : undefined}
        </Fragment>
    )
}

export default Clinic