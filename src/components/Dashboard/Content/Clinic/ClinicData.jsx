import React, { Fragment, useContext, useEffect, useState } from 'react'
import Box from '../Utils/Box'
import classes from './ClinicData.module.css'
import { StatefulPinInput } from 'react-input-pin-code'
import StyledButton from '../../../Utils/StyledButton/StyledButton'
import axios from 'axios'
import LoginContext from '../../../../context/login-context'
import { toast } from 'react-toastify';


const ClinicData = (props) => {

    const { clinicId, address, city, country, location, name, pincode, state } = props.clinicData

    const logout = useContext(LoginContext)
    const [data, setData] = useState(props.clinicData)

    useEffect(() => {
        setData(props.clinicData)
    }, [props])

    const dispatch = (name, value) => {
        if (name === 'pincode' && value.length) {
            value = value.match(/\d+/)[0].substring(0, 6)
        }
        setData((prop) => {
            return { ...prop, [name]: value }
        })
    }

    const editClinic = async () => {
        try {
            const res = await axios.patch('/api/v1/clinic/update', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                }
            })
            if (res.status === 200) {
                toast.success('Clinic Edited Successfully')
            }
        }
        catch (e) {
            if (e.response.status === 401) logout()
            return e
        }
    }

    const addClinic = async () => {
        axios.post(`/api/v1/clinic/save`, data , {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Content-type': 'application/json',
            }
        }).then(res => {
            props.setClinicData(null)
            toast.success(`Clinic : ${data.name} Saved Successfully`)
        }).catch(e => {
            if (e.response.status === 401) {
                logout()
            }
            else {
                toast.error(`Clinic Data Not Saved!!`)
            }
        });
    }

    const deleteClinic = async () => {
        axios.delete(`/api/v1/clinic/delete?clinicId=${clinicId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            }
        }).then(res => {
            props.setClinicData(null)
            toast.success(`Clinic : ${name} Deleted Successfully`)
        }).catch(e => {
            if (e.response.status === 401) {
                logout()
            }
            else {
                toast.error(`Clinic : ${name} Not Deleted!!`)
            }
        });
    }

    return (
        <Box>
            {props.type === 'edit' ? <h3 className={classes.name}>{name}</h3> : undefined}
            {props.type === 'add' ? <h3 className={classes.name}>Add Clinic</h3> : undefined}

            <div className={classes.box}>
                {
                    props.type === 'add' ? (
                        <div className={classes.cell}>
                            <p className={classes.label}>Name : </p>
                            <input value={data.name} onChange={(e) => dispatch('name', e.target.value)} type="text" className={`${classes['text-input']}`} />
                        </div>
                    ) : undefined
                }
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
            </div>
            <div className={classes['button-wrapper']}>
                <StyledButton onClick={props.cancel}>Cancel</StyledButton>
                {props.type === 'edit' ? (
                    <Fragment>
                        <StyledButton onClick={deleteClinic}>Delete</StyledButton>
                        <StyledButton onClick={editClinic}>Edit</StyledButton>
                    </Fragment>
                ) : undefined}
                {props.type === 'add' ? (
                    <StyledButton onClick={addClinic}>Save</StyledButton>
                ) : undefined}
            </div>
        </Box>
    )
}

export default ClinicData