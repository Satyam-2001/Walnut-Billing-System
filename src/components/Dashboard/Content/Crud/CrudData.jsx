import React, { Fragment, useContext, useEffect, useState } from 'react'
import Box from '../Utils/Box'
import classes from './CrudData.module.css'
import StyledButton from '../../../Utils/StyledButton/StyledButton'
import axios from 'axios'
import LoginContext from '../../../../context/login-context'
import { toast } from 'react-toastify';

const TreatmentData = ({ data, dispatch }) => {
    return (
        <div className={classes.box}>
            <div className={classes.cell}>
                <p className={classes.label}>Name : </p>
                <input value={data.name} onChange={(e) => dispatch('name', e.target.value)} type="text" className={`${classes['text-input']}`}></input>
            </div>
            <div className={classes.cell}>
                <p className={classes.label}>Status : </p>
                <input value={data.status} onChange={(e) => dispatch('status', e.target.value)} type="text" className={`${classes['text-input']}`}></input>
            </div>
        </div>
    )
}

const DoctorData = ({ data, dispatch }) => {
    return (
        <div className={classes.box}>
            <div className={classes.cell}>
                <p className={classes.label}>First Name : </p>
                <input value={data.firstName} onChange={(e) => dispatch('firstName', e.target.value)} type="text" className={`${classes['text-input']}`}></input>
            </div>
            <div className={classes.cell}>
                <p className={classes.label}>Middle Name : </p>
                <input value={data.middleName} onChange={(e) => dispatch('middleName', e.target.value)} type="text" className={`${classes['text-input']}`}></input>
            </div>
            <div className={classes.cell}>
                <p className={classes.label}>Last Name : </p>
                <input value={data.lastName} onChange={(e) => dispatch('lastName', e.target.value)} type="text" className={`${classes['text-input']}`}></input>
            </div>
            <div className={classes.cell}>
                <p className={classes.label}>Gender : </p>
                <input value={data.gender} onChange={(e) => dispatch('gender', e.target.value)} type="text" className={`${classes['text-input']}`}></input>
            </div>
            <div className={classes.cell}>
                <p className={classes.label}>Status : </p>
                <input value={data.status} onChange={(e) => dispatch('status', e.target.value)} type="text" className={`${classes['text-input']}`}></input>
            </div>
        </div>
    )
}

const ClinincData = ({ data, dispatch, type }) => {
    return (
        <div className={classes.box}>
            {/* <div className={classes.box}>
                {
                    props.type === 'add' ? (
                        <div className={classes.cell}>
                            <p className={classes.label}>Name : </p>
                            <input value={data.name} onChange={(e) => dispatch('name', e.target.value)} type="text" className={`${classes['text-input']}`} />
                        </div>
                    ) : undefined
                }
            </div> */}
            <div className={classes.cell}>
                <p className={classes.label}>Name : </p>
                <input value={data.name} onChange={(e) => dispatch('name', e.target.value)} type="text" className={`${classes['text-input']}`} />
            </div>
            <div className={classes.cell}>
                <p className={classes.label}>Address : </p>
                <textarea value={data.address} onChange={(e) => dispatch('address', e.target.value)} type="text" className={`${classes['text-input']}`}></textarea>
            </div>
            <div className={classes.cell}>
                <p className={classes.label}>Country : </p>
                <input value={data.country} onChange={(e) => dispatch('country', e.target.value)} type="text" className={`${classes['text-input']}`}></input>
            </div>
            <div className={classes.cell}>
                <p className={classes.label}>State : </p>
                <input value={data.state} onChange={(e) => dispatch('state', e.target.value)} type="text" className={`${classes['text-input']}`}></input>
            </div>
            <div className={classes.cell}>
                <p className={classes.label}>City : </p>
                <input value={data.city} onChange={(e) => dispatch('city', e.target.value)} type="text" className={`${classes['text-input']}`}></input>
            </div>
            <div className={classes.cell}>
                <p className={classes.label}>Location : </p>
                <input value={data.location} onChange={(e) => dispatch('location', e.target.value)} type="text" className={`${classes['text-input']}`}></input>
            </div>
            <div className={classes.cell}>
                <p className={classes.label}>Pincode : </p>
                <input value={data.pincode} maxLength="6" onChange={(e) => dispatch('pincode', e.target.value)} type="text" pattern="[0-9]{6}" className={`${classes['text-input']}`}></input>
            </div>
            <div className={classes.cell}>
                <p className={classes.label}>Status : </p>
                <input value={data.status} onChange={(e) => dispatch('status', e.target.value)} type="text" className={`${classes['text-input']}`}></input>
            </div>
        </div>
    )
}


const CrudData = (props) => {

    const { [`${props.api_name.toLowerCase()}Id`]: id } = props.crudData

    const logout = useContext(LoginContext)
    const [data, setData] = useState(props.crudData)

    useEffect(() => {
        setData(props.crudData)
    }, [props])

    const dispatch = (name, value) => {
        if (name === 'pincode' && value.length) {
            value = value.match(/\d+/)[0].substring(0, 6)
        }
        setData((prop) => {
            return { ...prop, [name]: value }
        })
    }

    const editCrud = async () => {
        try {
            const res = await axios.patch(`/api/v1/${props.name.toLowerCase()}/update`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                }
            })
            if (res.status === 200) {
                toast.success(`${props.name} Edited Successfully`)
            }
        }
        catch (e) {
            if (e.response.status === 401) logout()
            return e
        }
    }

    const addCrud = async () => {
        axios.post(`/api/v1/${props.name.toLowerCase()}/save`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Content-type': 'application/json',
            }
        }).then(res => {
            props.setCrudData(null)
            toast.success(`${props.name} : ${props.showName(data)} Saved Successfully`)
        }).catch(e => {
            if (e.response.status === 401) {
                logout()
            }
            else {
                toast.error(`${props.name} Data Not Saved!!`)
            }
        });
    }

    const deleteCrud = async () => {
        axios.delete(`/api/v1/${props.name.toLowerCase()}/delete?${props.api_name.toLowerCase()}Id=${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            }
        }).then(res => {
            props.setCrudData(null)
            toast.success(`${props.name} : ${props.showName(data)} Deleted Successfully`)
        }).catch(e => {
            if (e.response.status === 401) {
                logout()
            }
            else {
                toast.error(`${props.name} : ${props.showName(data)} Not Deleted!!`)
            }
        });
    }

    return (
        <Box>
            {props.type === 'edit' ? <h3 className={classes.name}>{props.showName(data)}</h3> : undefined}
            {props.type === 'add' ? <h3 className={classes.name}>Add {props.name}</h3> : undefined}
            {props.name === 'Clinic' ? <ClinincData data={data} dispatch={dispatch} /> : undefined}
            {props.name === 'Doctors' ? <DoctorData data={data} dispatch={dispatch} /> : undefined}
            {props.name === 'Treatment' ? <TreatmentData data={data} dispatch={dispatch} /> : undefined}

            <div className={classes['button-wrapper']}>
                <StyledButton onClick={props.cancel}>Cancel</StyledButton>
                {props.type === 'edit' ? (
                    <Fragment>
                        <StyledButton onClick={deleteCrud}>Delete</StyledButton>
                        <StyledButton onClick={editCrud}>Edit</StyledButton>
                    </Fragment>
                ) : undefined}
                {props.type === 'add' ? (
                    <StyledButton onClick={addCrud}>Save</StyledButton>
                ) : undefined}
            </div>
        </Box>
    )
}

export default CrudData