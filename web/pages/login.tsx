// import TestConnect from '../components/TestConnect'
// import Layout from '../components/Layout'
import axios from 'axios'
import { useRouter } from 'next/dist/client/router'
import React, { SetStateAction, useState } from 'react'
import classNames from '../utils/classNames'
import { useAlert, AlertManager } from 'react-alert'
import localforage from 'localforage'
import { useUser } from '../hooks/useUser'
import { useEffect } from 'react'
import { route } from 'next/dist/next-server/server/router'
import jwtDecode from 'jwt-decode'
import { Token } from './_app'

const tabs = [
  { name: 'login', href: '#' },
  { name: 'register', href: '#' },
]

interface ITabsComponentProps {
  setActiveTab: React.Dispatch<SetStateAction<string>>
  activeTab: string
}

const Tabs: React.FC<ITabsComponentProps> = ({ setActiveTab, activeTab }) => {
  return (
    <div>
      <div className='block'>
        <nav
          className='relative z-0 rounded-lg shadow flex divide-x divide-gray-200'
          aria-label='Tabs'
        >
          {tabs.map((tab, tabIdx) => (
            <a
              key={tab.name}
              href={tab.href}
              onClick={() => setActiveTab(tab.name)}
              className={classNames(
                tab.name === activeTab
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700',
                tabIdx === 0 ? 'rounded-l-lg' : '',
                tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10'
              )}
            >
              <span>{tab.name}</span>
              <span
                className={classNames(
                  tab.name === activeTab ? 'bg-indigo-500' : 'bg-transparent',
                  'absolute inset-x-0 bottom-0 h-0.5'
                )}
              />
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}

interface ITabProps {
  alert: AlertManager
  setTab?: React.Dispatch<SetStateAction<string>>
  login?: (username: string, id: number) => void
}
const SignIn: React.FC<ITabProps> = ({ alert, login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const token = await axios
        .post('http://localhost:3001/login', { username, password })
        .then(r => r.data)
      alert.success('Logged in successfully')
      await localforage.setItem('token', token)
      const decoded: Token = jwtDecode(token) as Token
      const id = decoded.sub.id
      login(username, id)
      router.push('/profile')
    } catch (e) {
      if (e?.response?.data?.message) {
        alert.error(e.response.data.message)
      } else {
        alert.error('Unknown error occured')
        console.error(e)
      }
    }
  }

  return (
    <div className='mt-8'>
      Sign in to get fuel quotes
      <div className='mt-6'>
        <form onSubmit={handleLogin} className='space-y-6'>
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-700'
            >
              Username
            </label>
            <div className='mt-1'>
              <input
                value={username}
                id='username'
                name='username'
                onChange={e => setUsername(e.currentTarget.value)}
                required
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
          </div>

          <div className='space-y-1'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <div className='mt-1'>
              <input
                value={password}
                onChange={e => setPassword(e.currentTarget.value)}
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Register: React.FC<ITabProps> = ({ alert, setTab }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  const router = useRouter()

  const validateRegistration = e => {
    e.preventDefault()

    if (password === password2) {
      handleRegistration()
    } else {
      alert.error(`Passwords don't match`)
    }
  }

  const handleRegistration = async () => {
    // TODO: send registration to backend , set UI to loading state
    try {
      await axios.post('http://localhost:3001/register', {
        username,
        password,
      })
      alert.success('Registration successful')
      // redirect to login tab so they can login
      setTab('login')
    } catch (e) {
      const msg = e?.response?.data?.message
      console.error(msg)
      alert.error(msg)
    }
  }

  return (
    <div className='mt-8'>
      Register to get fuel quotes
      <div className='mt-6'>
        <form onSubmit={validateRegistration} className='space-y-6'>
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-700'
            >
              Username
            </label>
            <div className='mt-1'>
              <input
                value={username}
                id='username'
                name='username'
                onChange={e => setUsername(e.currentTarget.value)}
                required
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
          </div>

          <div className='space-y-1'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <div className='mt-1'>
              <input
                value={password}
                id='password'
                name='password'
                onChange={e => setPassword(e.currentTarget.value)}
                type='password'
                autoComplete='current-password'
                required
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
          </div>

          <div className='space-y-1'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Confirm Password
            </label>
            <div className='mt-1'>
              <input
                value={password2}
                onChange={e => setPassword2(e.currentTarget.value)}
                id='confirmpassword'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const IndexPage = () => {
  const [activeTab, setActiveTab] = useState('login')
  const { user, login } = useUser()
  const router = useRouter()
  const alert = useAlert()

  // handle if the user directly navigated to this page but they're already logged in
  useEffect(() => {
    if (!user.loading && user.username) {
      router.push('/profile')
    }
  }, [user])

  return (
    <div className='bg-fuel h-screen'>
      <div className='h-full container mx-auto flex justify-center items-center'>
        <div className=' w-full h-full sm:h-auto sm:w-1/2 md:1/3 bg-white  rounded-lg'>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className='p-10'>
            {activeTab === 'login' ? (
              <SignIn login={login} alert={alert} />
            ) : (
              <Register setTab={setActiveTab} alert={alert} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
