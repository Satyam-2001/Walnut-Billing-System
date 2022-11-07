// import React, { useContext } from 'react'
// import ClinicData from './ClinicData'
// import StyledButton from '../../../Utils/StyledButton/StyledButton'
// import axios from 'axios'
// import LoginContext from '../../../../context/login-context'



// const ClinicEdit = (props) => {

//     const logout = useContext(LoginContext)

//     const editClinic = async () => {
//         try {
//             const res = await axios.patch('/api/v1/clinic/update', data, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
//                     'Content-type': 'application/json',
//                     'Access-Control-Allow-Origin': 'http://localhost:3000'
//                 }
//             })
//             if (res.status === 200) {
//                 toast.success('Clinic Edited Successfully')
//             }
//         }
//         catch (e) {
//             if (e.response.status === 401) logout()
//             return e
//         }
//     }
    
//     const deleteClinic = async () => {
//         axios.delete(`/api/v1/clinic/delete?clinicId=${clinicId}`, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
//             }
//         }).then(res => {
//             props.setClinicData(null)
//             toast.success(`Clinic : ${name} Deleted Successfully`)
//         }).catch(e => {
//             if (e.response.status === 401) {
//                 logout()
//             }
//             else {
//                 toast.error(`Clinic : ${name} Not Deleted!!`)
//             }
//         });
//     }

//     return (
//         <ClinicData {...props}>
//             <StyledButton onClick={() => { props.setIsEdit(false); props.setClinicData(null) }}>Cancel</StyledButton>
//             <StyledButton onClick={deleteClinic}>Delete</StyledButton>
//             <StyledButton onClick={editClinic}>Edit</StyledButton>
//         </ClinicData>
//     )
// }

// export default ClinicEdit