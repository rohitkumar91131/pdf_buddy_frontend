import React from 'react'
import ShowPdf from '../PdfComponents/ShowPdf'
import PdfMenu from '../PdfComponents/PdfMenu'

function PdfShowAndAnnoate() {
  return (
    <div className='w-[100dvw] h-[100dvh] overflow-hidden'>
      <ShowPdf/>
      <PdfMenu/>
    </div>
  )
}

export default PdfShowAndAnnoate
