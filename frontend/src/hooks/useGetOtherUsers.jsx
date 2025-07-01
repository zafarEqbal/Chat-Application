import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setOtherUser } from '../Redux/userSlice';
export default function useGetOtherUsers() {
    const dispatch = useDispatch();
    useEffect(() => {
        const getOtherUsers = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get('http://localhost:3000/api/v1/user/');
                
                
                console.log(res);
                dispatch(setOtherUser(res.data));
            } catch (error) {
                console.log(error)
            }

        }
        getOtherUsers();
    }, [])

}