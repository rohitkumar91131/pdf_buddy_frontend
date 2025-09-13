import React, { useEffect, useState } from 'react'
import ShowPdf from '../../components/PdfComponents/ShowPdf'
import PdfMenu from '../../components/PdfComponents/PdfMenu'
import { usePdf } from '../../context/PdfContext'
import verifyUser from '../../lib/verify'


function PdfShowAndAnnoate() {
  const { pdfError, setPdfError, initialPdfLoading } = usePdf()
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await verifyUser();
        console.log(res)
        if (!mounted) return
        if ( res.success === false ||  !res.success ){
          setErrorMsg(res.msg)
          setPdfError(true)
        } else {
          setErrorMsg('')
          setPdfError(false)
        }
      } catch (err) {
        if (!mounted) return
        setErrorMsg(err?.message || 'Verification failed')
        setPdfError(true)
      }
    })()
    return () => {
      mounted = false
    }
  }, [setPdfError])

  return (
    <div className="w-[100dvw] h-[100dvh] ">
      {pdfError ? (
        <p className="w-full h-full font-bold text-3xl flex justify-center items-center">
          {errorMsg || 'No Pdf found'}
        </p>
      ) : (
        <div>
          <ShowPdf />
          {!initialPdfLoading && <div className='w-[100dvw] flex justify-center'><PdfMenu /></div>}
        </div>
      )}
    </div>
  )
}

export default PdfShowAndAnnoate
