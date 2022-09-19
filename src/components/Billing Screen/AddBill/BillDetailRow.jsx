import React, { useContext, useState, useEffect } from 'react'
import classes from './BillDetailRow.module.css'
import axios from 'axios'
import LoginContext from '../../../context/login-context'
import SelectInput from '../../Utils/SelectInput/SelectInput'

const Input = (props) => {
    return (
        <input
            required={true}
            value={props.billDetail[props.name]}
            onChange={e => props.dispatch({ type: props.name, index: props.index, [props.name]: e.target.value })}
            type={props.type}
            min={props.min}
            className={classes['text-input']}
        />
    )
}

const BillDetailRow = (props) => {

    const [doctorData, setDoctorData] = useState(null)
    const [clinicData, setCLinicData] = useState(null)
    const [treatmentData, setTreatmentData] = useState(null)
    const [treatmentArray, setTreatmentArray] = useState([])
    const [doctorsArray, setDoctorsArray] = useState([])
    const [clinicArray, setClinicArray] = useState([])
    const logout = useContext(LoginContext)

    const getMappedDoctors = async () => {
        try {
            const res = await axios.get(`/api/v1/patient/getMappedDoctorsBasedOnPatient`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                },
                params: {
                    id: props.patientId
                }
            });
            return res;
        }
        catch (e) {
            if (e.response.status === 401) logout();
        }
    }

    const getMappedClients = async (doctorId) => {
        try {
            const res = await axios.get(`/api/v1/patient/getMappedClinicBasedOnPatientAndDoctor`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                },
                params: {
                    patientId: props.patientId,
                    doctorId
                }
            });
            return res;
        }
        catch (e) {
            if (e.response.status === 401) logout();
        }
    }

    const getMappedTreatments = async (clinicId) => {
        try {
            const res = await axios.get(`/api/v1/patient/getMappedClinicBasedOnPatientAndDoctorAndClinic`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                },
                params: {
                    patientId: props.patientId,
                    doctorId: doctorData.doctor_id,
                    clinicId
                }
            });
            return res;
        }
        catch (e) {
            if (e.response.status === 401) logout();
        }
    }

    useEffect(() => {
        getMappedDoctors().then(res => setDoctorsArray(res.data))
    }, [])

    const doctorCallBack = (data) => {
        setDoctorData(data)
        props.dispatch({type: 'doctorId', doctorId: data.doctor_id, index: props.index})
        getMappedClients(data.doctor_id).then(res => setClinicArray(res.data))
    }

    const clinicCallBack = (data) => {
        setCLinicData(data)
        props.dispatch({type: 'clinicId', clinicId: data.id, index: props.index})
        getMappedTreatments(data.id).then(res => setTreatmentArray(res.data))
    }

    const treatmentCallBack = (data) => {
        props.dispatch({type: 'treatmentId', treatmentId: data.id, index: props.index})
        setTreatmentData(data)
    }

    return (
        <tr>
            <td><SelectInput name={'Doctor'} attr={data => data.fullName} disabled={false} data={doctorsArray} callBack={doctorCallBack} /></td>
            <td><SelectInput name={'Clinic'} attr={data => data.name} disabled={doctorData === null} data={clinicArray} callBack={clinicCallBack} /></td>
            <td><SelectInput name={'Treatment'} attr={data => data.name} disabled={clinicData === null} data={treatmentArray} callBack={treatmentCallBack} /></td>
            <td><Input name='no_of_session' type="number" min={1} billDetail={props.billDetail} dispatch={props.dispatch} index={props.index}/></td>
            <td><Input name='per_session_cost' type="number" min={1} billDetail={props.billDetail} dispatch={props.dispatch} index={props.index}/></td>
            <td><Input name='discount' type="number" min={0} billDetail={props.billDetail} dispatch={props.dispatch} index={props.index}/></td>
            <td><Input name='discount_reason' type="text" billDetail={props.billDetail} dispatch={props.dispatch} index={props.index}/></td>
            <td><Input name='session_start_Date' type="date" billDetail={props.billDetail} dispatch={props.dispatch} index={props.index}/></td>
            <td><Input name='session_end_Date' type="date" billDetail={props.billDetail} dispatch={props.dispatch} index={props.index}/></td>
            <td><button onClick={() => props.removeRow(props.id)} className='icon-btn'><ion-icon name="trash"></ion-icon></button></td>
        </tr>
    )
}

export default BillDetailRow