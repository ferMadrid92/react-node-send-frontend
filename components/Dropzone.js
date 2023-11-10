import React, { useState, useCallback, useContext, useEffect } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import appContext from '../context/app/appContext'
import authContext from '../context/auth/authContext'
import Formulario from './Formulario'

const Dropzone = () => {

    // context de la app
    const AppContext = useContext(appContext)
    const { mostrarAlerta, subirArchivo, cargando, crearEnlace } = AppContext

    // context de autenticacion
    const AuthContext = useContext(authContext)
    const { usuario, autenticado } = AuthContext

    const [image, setImage] = useState('')

    const onDropAccepted = useCallback(async (acceptedFiles) => {
        // crear un form Data
        const formData = new FormData()
        formData.append('archivo', acceptedFiles[0])        
        setImage(URL.createObjectURL(acceptedFiles[0]))
        
        subirArchivo(formData, acceptedFiles[0].path)

    },[])

    const onDropRejected = () => {
        if(!autenticado) {
            mostrarAlerta('El límite para subir archivos es de 1 MB, obtén una cuenta gratis para poder subir archivos de hasta 30 MB')
        } else {
            mostrarAlerta('No se pudo subir, el archivo supera el límite de 30 MB')
        }
    }


    // extraer contenido de Dropzone
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({onDropAccepted, onDropRejected, maxSize: autenticado ? 30000000 : 1000000})

    const archivos = acceptedFiles.map(archivo => (
        <li key={archivo.lastModified} className='bg-white flex-1 p-3 mb-4 shadow-lg rounded text-center'>
            <Image src={image} alt={`vista previa de ${archivo.name}`} width={300} height={100} className='w-2/5 h-auto m-auto' />
            <p className='font-bold text-xl break-all'>{archivo.path}</p>
            <p className='text-sm text-gray-500'>{(archivo.size / Math.pow(1024,2)).toFixed(3)} MB</p>
        </li>
    ))

  return (
    <div className="md:flex-1 mb-3 mx-2 mt-16 lg:mt-0 flex flex-col items-center justify-center border-dashed border-gray-400 border-2 bg-gray-100 px-4">
        { acceptedFiles.length > 0 ? (
            <div className='mt-10 w-full'>
                <h4 className='text-2xl font-bold text-center mb-4' >Archivo</h4>
                <ul>
                    {archivos}
                </ul>
                {
                    autenticado ? <Formulario/> : ''
                }

                {cargando ? <p className='my-10 text-center text-gray-600'>Subiendo Archivo...</p> : (
                    <button
                        type='button'
                        className='bg-blue-700 w-full py-3 rounded-lg text-white my-10 hover:bg-blue-800'
                        onClick={() => crearEnlace()}
                    >
                        Crear Enlace
                    </button>
                )}

            </div>
        ) : (
            <div { ...getRootProps({className: 'dropzone w-full py-10 md:py-32' })}>
            <input className='h-100' { ...getInputProps() }/>
           
                {
                    isDragActive ? <p className='text-2xl text-center text-gray 700'>Suelta el archivo</p> :
                    <div className='text-center'>
                        <p className='text-2xl text-center text-gray-700'>Arrastra un archivo aquí</p>
                        <button className='bg-blue-700 w-full py-3 rounded-lg text-white my-10 hover:bg-blue-800' type='button'>
                            Selecciona archivos para subir
                        </button>
                    </div>
                    }            
            </div>
        )}

    </div>
  )
}

export default Dropzone