import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { initiateLogin, verifyLogin, loginUser, fetchCurrentUser, logout } from '../store/authSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, pendingLogin, loading, verifying, error } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('auth_token')
    if (token && !user) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, user])

  const login = async () => {
    await dispatch(initiateLogin())
  }

  const verify = async () => {
    await dispatch(verifyLogin())
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const refreshUser = async () => {
    await dispatch(fetchCurrentUser())
  }

  return {
    user,
    pendingLogin,
    loading,
    verifying,
    error,
    login,
    verify,
    logout: handleLogout,
    refreshUser,
  }
}
