import React, { useContext, useState, useEffect } from 'react'
import classes from './BillDetailRow.module.css'
import axios from 'axios'
import LoginContext from '../../../context/login-context'
import SelectInput from '../../Utils/SelectInput/SelectInput'

const Input = (props) => {
    
    return (
        <input
            value={props.billDetail[props.name]}
            step={props.step}
            onChange={e => {
                if(props.type === 'number') e.target.value = Math.abs(e.target.value)
                if(props.name === 'discount' && +e.target.value > +props.billDetail.per_session_cost) return;                
                props.dispatch({ type: props.name, index: props.index, [props.name]: e.target.value })
            }}
            type={props.type}
            min={props.min}
            max={props.max}
            disabled={props.disabled}
            className={`${classes['text-input']} ${props.className}`}
        />
    )
}

const BillDetailRow = (props) => {

    const [doctorData, setDoctorData] = useState(props.billDetail.doctorId)
    const [clinicData, setClinicData] = useState(props.billDetail.clinicId)
    const [treatmentData, setTreatmentData] = useState(props.billDetail.treatmentId)
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

    const getMappedClinics = async (doctorId) => {
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
                    doctorId: doctorData,
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

    useEffect(() => {
        if (!doctorData) return
        getMappedClinics(doctorData).then(res => { setClinicArray(res.data) })
    }, [doctorData])

    useEffect(() => {
        if (!clinicData) return
        getMappedTreatments(clinicData).then(res => { setTreatmentArray(res.data) })
    }, [clinicData])

    const doctorCallBack = (data) => {
        setDoctorData(data)
        props.dispatch({ type: 'doctorId', doctorId: data, index: props.index })
        getMappedClinics(data).then(res => setClinicArray(res.data))
    }

    const clinicCallBack = (data) => {
        setClinicData(data)
        props.dispatch({ type: 'clinicId', clinicId: data, index: props.index })
        getMappedTreatments(data).then(res => setTreatmentArray(res.data))
    }

    const treatmentCallBack = (data) => {
        props.dispatch({ type: 'treatmentId', treatmentId: data, index: props.index })
        setTreatmentData(data)
    }
    
    return (
        <tr>
            <td><SelectInput value={doctorData} getId={data => data.doctor_id} className={!(props.isValidate || doctorData) ? classes['input-invalid'] : undefined} name={'Doctor'} attr={data => data.fullName} disabled={false} data={doctorsArray} callBack={doctorCallBack} /></td>
            <td><SelectInput value={clinicData} className={!(props.isValidate || clinicData) ? classes['input-invalid'] : undefined} name={'Clinic'} attr={data => data.name} disabled={doctorData === null} data={clinicArray} callBack={clinicCallBack} /></td>
            <td><SelectInput value={treatmentData} className={!(props.isValidate || treatmentData) ? classes['input-invalid'] : undefined} name={'Treatment'} attr={data => data.name} disabled={clinicData === null} data={treatmentArray} callBack={treatmentCallBack} /></td>
            <td><Input className={!(props.isValidate || props.billDetail.no_of_session !== "") ? classes['input-invalid'] : undefined} name='no_of_session' type="number" min={0} billDetail={props.billDetail} dispatch={props.dispatch} index={props.index} /></td>
            <td><Input className={!(props.isValidate || props.billDetail.per_session_cost !== "") ? classes['input-invalid'] : undefined} name='per_session_cost' step={100} type="number" min={0} billDetail={props.billDetail} dispatch={props.dispatch} index={props.index} /></td>
            <td><Input name='discount' type="number" min={0} disabled={props.billDetail.per_session_cost === "" || props.billDetail.per_session_cost === "0"} billDetail={props.billDetail} dispatch={props.dispatch} index={props.index} /></td>
            <td><Input className={!(props.isValidate || props.billDetail.discount === '0' || props.billDetail.discount === '' || props.billDetail.discount_reason !== "") ? classes['input-invalid'] : undefined} name='discount_reason' type="text" billDetail={props.billDetail} dispatch={props.dispatch} index={props.index} /></td>
            <td><Input name='session_start_Date' type="date" max={props.billDetail.session_end_Date} billDetail={props.billDetail} dispatch={props.dispatch} index={props.index} /></td>
            <td><Input name='session_end_Date' type="date" min={props.billDetail.session_start_Date} billDetail={props.billDetail} dispatch={props.dispatch} index={props.index} /></td>
            <td><button type='button' onClick={() => props.removeRow(props.id)} className='icon-btn'><ion-icon name="trash"></ion-icon></button></td>
        </tr>
    )
}

export default BillDetailRow