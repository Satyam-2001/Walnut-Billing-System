import React, { Fragment, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import LoginContext from '../../../../context/login-context'
import CrudHeader from './CrudHeader'
import CrudData from './CrudData'

const Crud = (props) => {

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
            const res = await axios.get(`/api/v1/${props.api_info.url.fetchBill}${data[props.api_info.id.get]}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setIsEdit(true)
            setIsAdd(false)
            setCrudData(res.data)
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
            <CrudHeader emptyField={isAdd} api_info={props.api_info} fetchBillData={fetchBillData} addCrud={addCrud} />
            {isEdit ? <CrudData showName={props.showName} type='edit' api_info={props.api_info} cancel={cancel} setCrudData={setCrudData} crudData={crudData} /> : undefined}
            {isAdd ? <CrudData showName={props.showName} type='add' api_info={props.api_info} cancel={cancel} setCrudData={(data) => {setIsEdit(false); setIsAdd(true); setCrudData(data);}} crudData={crudData} /> : undefined}
        </Fragment>
    )
}

export default Crud