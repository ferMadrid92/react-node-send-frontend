import React from 'react'
import Head from 'next/head'
import Header from './Header'

export default function Layout({children}) {
  return (
    <>
        <Head>
            <title>ReactNodeSend</title>
        </Head>
        
        <div className='bg-gray-100 min-h-screen'>
        <Header/>
            <div className='container mx-auto'>
                
                <main className='mt-20'>
                    {children} 
                </main>
            </div>           
        </div>             
    </>
  )
}
