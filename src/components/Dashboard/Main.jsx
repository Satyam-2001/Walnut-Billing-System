import React, { useState } from 'react'
import BillingScreen from './Content/Billing Screen/BillingScreen'
import AddPatient from './Content/AddPatient/AddPatient'
import classes from './Main.module.css'
import Navbar from './Navbar'
import Clinic from './Content/Clinic/Clinic'
import Crud from './Content/Crud/Crud'

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

const initialDoctorData = {
    "doctorId": 0,
    "firstName": "",
    "middleName": "",
    "lastName": "",
    "gender": "",
    "status": true
}

const initialTreatmentData = {
    "treatmentId": 0,
    "name": "",
    "status": true
}

const initialPatientData =
{
    "id": 0,
    "firstName": "",
    "middleName": "",
    "lastName": "",
    "fathersNumber": "",
    "motherNumber": "",
    "whatsappNumber": "",
    "address": "",
    "state": "",
    "city": "",
    "pincode": "",
    "dateOfBirth": "",
    "country": "",
    "gender": "",
    "email": ""
}

const doctor_api_info = {
    name: 'Doctor',
    url: {
        fetchBill: 'doctors?doctorId=',
        getMatching: 'doctors/getMatchingDoctor?doctorName=',
        save: 'doctors/save',
        update: 'doctors/update',
        delete: 'doctors/delete?doctorId='
    },
    id:  {
        get: 'doctor_id',
        data: 'docotrId'
    },
    getName: 'fullName'
}

const clinic_api_info = {
    name: 'Clinic',
    url: {
        fetchBill: 'clinic?clinicId=',
        getMatching: 'clinic/getMatchingClinic?clinicName=',
        save: 'clinic/save',
        update: 'clinic/update',
        delete: 'clinic/delete?clinicId='
    },
    id:  {
        get: 'id',
        data: 'clinicId'
    },
    getName: 'name'
}

const treatment_api_info = {
    name: 'Treatment',
    url: {
        fetchBill: 'treatment?treatmentId=',
        getMatching: 'treatment/getMatchingTreatment?treatmentName=',
        save: 'treatment/save',
        update: 'treatment/update',
        delete: 'treatment/delete?treatmentId='
    },
    id:  {
        get: 'id',
        data: 'treatmentId'
    },
    getName: 'name'
}

const patient_api_info = {
    name: 'Patient',
    url: {
        fetchBill: 'patient/getDetailsById?id=',
        getMatching: 'patient/matchingPatient?name=',
        save: 'patient/save',
        update: 'patient/edit',
        delete: 'patient/delete?id='
    },
    id:  {
        get: 'id',
        data: 'id'
    },
    getName: 'fullName'
}

const Main = (props) => {

    const [selected, setSelected] = useState('Billing Screen')

    const setOption = (option) => {
        if (option !== selected) setSelected(option)
    }

    const NavbarItems = {
        'Billing Screen': () => <BillingScreen username={props.username} />,
        'Add Patient': () => <AddPatient />,
        'Clinic': () => <Crud api_info={clinic_api_info} initialData={initialClinicData} showName={data => data.name} />,
        'Doctor': () => <Crud api_info={doctor_api_info} initialData={initialDoctorData} showName={data => `${data.firstName} ${data.middleName} ${data.lastName}`} />,
        'Treatment': () => <Crud api_info={treatment_api_info} initialData={initialTreatmentData} showName={data => data.name} />,
        'Patient': () => <Crud api_info={patient_api_info} initialData={initialPatientData} showName={data => `${data.firstName} ${data.middleName} ${data.lastName}`} />
    }

    return (
        <div className={classes.main}>
            <Navbar navbarOpen={props.navbarOpen} selected={selected} setOption={setOption} />
            <div className={classes['main-screen']}>{NavbarItems[selected]?.()}</div>
        </div>
    )
}

export default Main