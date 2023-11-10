import React from 'react'
import Layout from '../components/Layout'

export default function Error404() {
  return (
    <Layout>
      <div className='px-4'>
        <h1 className='text-4xl text-center text-gray-700'>404 - Página no encontrada</h1>
        <p className="text-center text-2xl mt-10">Lo sentimos, la página que buscas no existe o ha sido eliminada.</p>
      </div>
    </Layout>
  )
}
