import React, { useState, useContext, Fragment } from 'react'
import classes from './BillRow.module.css'
import axios from 'axios'
import Modal from '../../../Utils/Modal/Modal'
import EditBill from './EditBill'
import LoginContext from '../../../../context/login-context'
import { toast } from 'react-toastify';
import BillInput from './BillInput/BillInput'

const BillRow = (props) => {

    const [isLoadingDownload, setIsLoadingDownload] = useState(false)
    const [isLoadingMail, setIsLoadingMail] = useState(false)
    const [isModalOpen, setModalOpen] = useState(false)
    const [isView, setIsView] = useState(false)
    const { billId, billDate, paymentMode, total } = props.billInfo
    const logout = useContext(LoginContext)

    const downloadReceipt = () => {
        setIsLoadingDownload(true)
        axios.get(`/api/v1/receipt/downloadReceipt/${billId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
            responseType: "blob"
        })
            .then(blob => {
                const url = window.URL.createObjectURL(blob.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${billId}-receipt.pdf`
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                setIsLoadingDownload(false);
            })
            .catch(e => {
                if (e.response.status === 401) {
                    logout()
                }
            })
    }

    const sendBillViaMail = () => {
        setIsLoadingMail(true)
        axios.get(`/api/v1/receipt/sendCopyViaMail/${billId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            }
        }).then(res => {
            toast.success(`Receipt : ${billId} Sended Via Mail`)
            setIsLoadingMail(false)
        }).catch(e => {
            if (e.response.status === 401) logout()
        });
    }

    const deleteBill = () => {
        axios.delete(`/api/v1/receipt/delete?billId=${billId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            }
        }).then(res => {
            props.fetchBillData(props.patientData)
            toast.success(`Bill : ${billId} Deleted Successfully`)
        }).catch(e => {
            if (e.response.status === 401) {
                logout()
            }
            else {
                toast.error(`Bill : ${billId} Not Deleted!!`)
            }
        });
    }

    const Spinner = <img className={classes.spinner} src={require('../../../../assets/spinner.gif')} />

    return (
        <Fragment>
            {isModalOpen ? <Modal billId={billId} close={() => setModalOpen(false)} deleteBill={deleteBill} /> : undefined}
            <tr key={billId}>
                <td>{billId}</td>
                <td>{billDate}</td>
                <td>{paymentMode}</td>
                <td>{total}</td>
                <td>{isLoadingDownload ? Spinner : <button onClick={() => downloadReceipt(true)} className={'icon-btn'}><ion-icon name="download"></ion-icon></button>}</td>
                <td>{isLoadingMail ? Spinner : <button onClick={() => sendBillViaMail(true)} className={'icon-btn'}><ion-icon name="mail"></ion-icon></button>}</td>
                <td><button onClick={() => { setIsView(prop => !prop) }} className={'icon-btn'}><ion-icon name={isView ? "eye-off-outline" : "eye-outline"}></ion-icon></button></td>
                <td><button onClick={() => { props.editBill(props.billInfo) }} className={'icon-btn'}><ion-icon name="pencil-sharp"></ion-icon></button></td>
                <td><button onClick={() => { setModalOpen(true) }} className={'icon-btn'}><ion-icon name="trash"></ion-icon></button></td>
            </tr>
            {isView ? (
                <tr><td colSpan={9} style={{ height: '100%', width: '100%' }}>
                    <BillInput value='view' readOnly={true} billId={billId} patientId={props.patientData.id} initialBillDetails={props.billInfo} initialBillDetailRow={props.billInfo.billDetails} closeAddBill={() => setIsView(false)} />
                </td></tr>
            ) : undefined}

            {/* <div className={classes['view-bill']}>Satyam Lohiya is here , check check chekc</div> */}
        </Fragment>
    )
}

export default BillRow