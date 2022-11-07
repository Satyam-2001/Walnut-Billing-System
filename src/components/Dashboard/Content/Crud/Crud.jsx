import React, { Fragment, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import LoginContext from '../../../../context/login-context'
import CrudHeader from './CrudHeader'
import CrudData from './CrudData'
// import CrudEdit from './CrudEdit'

const Crud = (props) => {

    const {name, attr, api_name, getName, getId} = props.api_credential
    const [isEdit, setIsEdit] = useState(false)
    const [isAdd, setIsAdd] = useState(false)
    const [crudData, setCrudData] = useState(null)
    const logout = useContext(LoginContext)

    useEffect(() => {
        setIsEdit(false)
        setIsAdd(false)
        setCrudData(null)
    }, [props])

    const fetchBillData = async (data) => {
        try {
            const res = await axios.get(`/api/v1/${name.toLowerCase()}?${api_name.toLowerCase()}Id=${data[getId]}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setIsEdit(true)
            setIsAdd(false)
            setCrudData(res.data)
            console.log(res.data);
            
        }
        catch (error) {
            if (error.response.status === 401) {
                logout();
            }
        }
    }

    const addCrud = () => {
        setIsAdd(true)
        setIsEdit(false)
        setCrudData(props.initialData)
    }

    const cancel = () => {
        setIsAdd(false)
        setIsEdit(false)
        setCrudData(null)
    }

    return (
        <Fragment>
            <CrudHeader emptyField={isAdd} getName={getName} name={name} api_name={api_name} fetchBillData={fetchBillData} addCrud={addCrud} />
            {isEdit ? <CrudData showName={props.showName} type='edit' name={name} api_name={api_name} cancel={cancel} setCrudData={setCrudData} crudData={crudData} /> : undefined}
            {isAdd ? <CrudData showName={props.showName} type='add' name={name} api_name={api_name} cancel={cancel} setCrudData={(data) => {setIsEdit(false); setIsAdd(true); setCrudData(data);}} crudData={crudData} /> : undefined}
        </Fragment>
    )
}

export default Crud