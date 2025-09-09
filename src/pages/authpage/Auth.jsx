import React from 'react'
import { useAuth } from '../../context/AuthContext'
import LoginPage from '../../components/authPage/LoginPage'
import SignupPage from '../../components/authPage/SignupPage'

function Auth() {
    const {isLoginPageInTheWindow} = useAuth()
  return (
    <div>
      {
        isLoginPageInTheWindow
        ?
        <LoginPage/>
        :
        <SignupPage/>
      }
    </div>
  )
}

export default Auth
