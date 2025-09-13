import React, { useEffect } from 'react'
import ShowPdf from '../../components/PdfComponents/ShowPdf'
import PdfMenu from '../../components/PdfComponents/PdfMenu'
import { usePdf } from '../../context/PdfContext'
import verifyUser from '../../lib/verify'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function PdfShowAndAnnotate() {
  const { pdfError, setPdfError, initialPdfLoading, errorMsg, setErrorMsg } = usePdf()
  const { isLogin, setIsLogin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await verifyUser()
        if (!mounted) return
        if (!res) {
          setErrorMsg('Please login to see the PDF')
          setPdfError(true)
          setIsLogin(false)
        } else {
          setErrorMsg('')
          setPdfError(false)
          setIsLogin(true)
        }
      } catch (err) {
        if (!mounted) return
        setErrorMsg(err?.message || 'Verification failed')
        setPdfError(true)
        setIsLogin(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [setPdfError, setErrorMsg, setIsLogin])

  const handleRetry = () => {
    setPdfError(false)
    setErrorMsg('')
    window.location.reload()
  }

  return (
    <div className="w-[100dvw] h-[100dvh] flex justify-center items-center">
      {pdfError ? (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-0.5">
            <img src="icon.svg" alt="Error Icon" className="w-24 h-24" />
            <h1 className="text-4xl font-bold">PdfBuddy</h1>
          </div>
          <p className="font-bold text-3xl text-center">{errorMsg || 'No PDF found'}</p>

          {!isLogin ? (
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Login
            </button>
          ) : (
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Dashboard
              </button>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-[100dvw] h-[100dvh] flex flex-col">
          <ShowPdf />
          {!initialPdfLoading && (
            <div className="w-[100dvw] flex justify-center mt-2">
              <PdfMenu />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PdfShowAndAnnotate
