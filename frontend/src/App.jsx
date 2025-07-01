import { useState,useEffect } from 'react'
import './App.css'
import './index.css'
import Homepage from './components/Homepage'
import FrontPage from './components/FrontPage'
import Signup from './components/Signup'
import Login from './components/Login'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser, setOnlineUsers } from './Redux/userSlice'
import {createBrowserRouter,RouterProvider}  from "react-router-dom"
import {io} from 'socket.io-client'
import { setSocket } from './Redux/socketSlice'
import OtpVerify from './components/otpVerify'

function AuthRoute() {
  const { authUser } = useSelector((state) => state.user);

  return authUser ? <Homepage /> : <FrontPage />;
}
const router = createBrowserRouter([
  {
    path:"/register",
    element:<Signup/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path: "/", // ✅ Add this route
    element: <AuthRoute/>,
  },
  {
  path: "/verify-otp",
  element: <OtpVerify />
}
])




function App() {
  const {authUser} = useSelector(store=>store.user);
  const dispatch = useDispatch();
  //const [socket,setSocket] = useState(null)
  useEffect(() => {
  let newsocket;

  if (authUser) {
   newsocket = io('http://localhost:3000', {
    // newsocket = io('http://192.168.1.9:3000', {
      query: {
        userId: authUser._id
      }
    });

    dispatch(setSocket(newsocket));

    newsocket.on('getOnlineUsers', (getOnlineUsers) => {
      dispatch(setOnlineUsers(getOnlineUsers));
    });
  }

  // Cleanup when authUser becomes null or component unmounts
  return () => {
    if (newsocket) {
      newsocket.disconnect();
      dispatch(setSocket(null));
    }
  };
}, [authUser]);

  const [count, setCount] = useState(0)
  

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      dispatch(setAuthUser(JSON.parse(storedUser)));
    }
  }, []);
  return (
    <>
    <div className='p-4 h-screen  flex items-center justify-center ' >
      <RouterProvider router={router}/>
    </div>
     
    </>
  )
}

export default App
