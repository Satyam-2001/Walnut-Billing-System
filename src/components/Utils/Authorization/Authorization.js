import axios from 'axios'

export const login = async (username, password) => {
    try {
        const res = await axios.post('/api/v1/user/login', { username, password }, { 'Content-type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:3000' });
        localStorage.setItem('auth_token', res.data['access_token']);
        localStorage.setItem('refresh_token', res.data['refresh_token']);
        return { loggedIn: true };
    }
    catch (e) {
        return e;
    }
}

export const getBillData = async (patientId) => {
    try {
        const res = await axios.get(`/api/v1/receipt/allReceipt/${patientId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        return res.data
    }
    catch(e) {
        console.log(e);
    }
}