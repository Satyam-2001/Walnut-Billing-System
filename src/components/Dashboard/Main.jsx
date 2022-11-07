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

const Main = (props) => {

    const [selected, setSelected] = useState('Billing Screen')

    const setOption = (option) => {
        if (option !== selected) setSelected(option)
    }

    const NavbarItems = {
        'Billing Screen': () => <BillingScreen username={props.username} />,
        'Add Patient': () => <AddPatient />,
        'Clinic': () => <Crud api_credential={{ name: 'Clinic', api_name: 'Clinic', attr: 'id', getId: 'id', getName: 'name' }} initialData={initialClinicData} showName={data => data.name} />,
        'Doctor': () => <Crud api_credential={{ name: 'Doctors', api_name: 'Doctor', attr: 'doctorId', getId: 'doctor_id', getName: 'fullName' }} initialData={initialDoctorData} showName={data => `${data.firstName} ${data.middleName} ${data.lastName}`} />,
        'Treatment': () => <Crud api_credential={{ name: 'Treatment', api_name: 'Treatment', attr: 'treatmentId', getId: 'id', getName: 'name' }} initialData={initialTreatmentData} showName={data => data.name} />
    }

    return (
        <div className={classes.main}>
            <Navbar navbarOpen={props.navbarOpen} selected={selected} setOption={setOption} />
            <div className={classes['main-screen']}>{NavbarItems[selected]?.()}</div>
        </div>
    )
}

export default Main