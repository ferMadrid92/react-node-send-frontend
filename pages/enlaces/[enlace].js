import { useContext, useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import clienteAxios from '../../config/axios'
import appContext from '../../context/app/appContext'
import Alerta from '../../components/Alerta'
import { useRouter } from 'next/router'

export async function getServerSideProps({params}) {
  const {enlace} = params
  try {
    const resultado = await clienteAxios(`/api/enlaces/${enlace}?descargas=true`)
    return {
      props: {
        enlace: resultado.data
      }
    }
  } catch (error) {
    // si la petición falla, devolver un mensaje de error o un valor por defecto como props
    return {
      notFound: true,
    }
  }
}

export async function getServerSidePaths() {
  try {
    // intentar hacer la petición de axios
    const enlaces = await clienteAxios("/api/enlaces")
    // si la petición tiene éxito, devolver los paths como un array de objetos
    return {
      paths: enlaces.data.enlaces.map((enlace) => ({
        params: { enlace: enlace.url },
      })),
      fallback: false,
    }
  } catch (error) {
    // si la petición falla, devolver un array vacío como paths
    return {
      paths: [],
      fallback: false,
    }
  }
}


export default function Enlace(props) {

  // context de la app
  const AppContext = useContext(appContext)
  const { mostrarAlerta, mensaje_archivo } = AppContext

   // extraer las propiedades enlace y descargas desde props
   const { enlace } = props

  const [tienePassword, setTienePassword] = useState(enlace.password)
  const [password, setPassword] = useState('')
  const [enlaceDescarga, setEnlaceDescarga] = useState('')
  const [respuesta, setRespuesta] = useState(null)
  const [cantidadDescargas, setCantidadDescargas] = useState(0)
  const [cargando, setCargando] = useState(true)

  // obtener el parámetro enlace desde la ruta
  const router = useRouter()
  //console.log(enlace)
  useEffect(() => {

  const { enlace: enlaceParam } = router.query

    if (enlace.descargas !== undefined) {
      setCantidadDescargas(enlace.descargas)
      setCargando(false)
    } else {
      // realizar una consulta a la API para obtener el valor de descargas
      const obtenerDescargas = async () => {
        const resultado = await clienteAxios.get(`/api/enlaces/${enlaceParam}/?descargas=true`)
        setCantidadDescargas(resultado.data.descargas)
        setCargando(false)
      }
      obtenerDescargas()
    }        
  },[])

  const validarPassword = async e => {
    e.preventDefault()
    const data = { 
      password
    }

    try {
      const resultado = await clienteAxios.post(`/api/enlaces/${enlace.enlace}`, data)
      setTienePassword(resultado.data.password)
    } catch (error) {
      mostrarAlerta(error.response.data.msg)
    }    

  }

  //console.log(cantidadDescargas)

  const handleClick = e => {

    if(!respuesta) {
      const resultado = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/archivos/${enlace.archivo}`
      setEnlaceDescarga(resultado)
      setRespuesta(true)
    } else if(cantidadDescargas <= 0 && respuesta) {        
        e.preventDefault();        
        descargaError();
    }
    setCantidadDescargas(cantidadDescargas => cantidadDescargas - 1)
  }


  // manejo de errores al descargar el archivo
  const descargaError = async () => {
    try {
      if(respuesta) {
        await clienteAxios.get(`/api/archivos/${enlace.archivo}`)
        return
      }

    } catch (error) {    
      
      //console.log(error)
      mostrarAlerta(error.response.data.msg)
    }

}

  let contador = cantidadDescargas
  if(cantidadDescargas < 0) {
    contador = 0
  }

  return (
    <Layout>
{
  tienePassword ? (
    <>
    <div className='px-4'>
      <p className='text-center text-2xl text-center text-gray-700'>Enlace protegido por contraseña, colócala a continuación:</p>

      { mensaje_archivo && <Alerta />}

        <div className='flex justify-center mt-5'>
          <div className="w-full max-w-lg">
            <form
              className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={e => validarPassword(e)}
            >
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-black text-sm font-bold mb-2"
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    placeholder="Contraseña del enlace"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="false"
                  />

                </div>
                <input
                  type="submit"
                  className="bg-red-500 hover:bg-gray-900 w-full p-2 text-white uppercase font-bold"
                  value="validar contraseña"
                />
            </form>
          </div>
        </div>
      </div>
    </>
  ) : ( 
    <>
    <div className='px-4'>
      { mensaje_archivo && <Alerta />}
        <h1 className=' text-3xl md:text-4xl text-center text-gray-700'>Descarga tu archivo con el siguiente enlace:</h1>
        <div className='flex items-center justify-center mt-10'>
          <a
            href={enlaceDescarga}
            onClick={handleClick}
            className='bg-red-500 text-center px-10 py-3 rounded uppercase font-bold text-white cursor-pointer'
            download
          >
            Descargar
          </a>       
        </div>
        <div className='flex items-center justify-center mt-8'>
            <p className='text-sm'>Descargas restantes: <span className='font-bold'>{cargando ? "Cargando..." : contador}</span></p>
        </div>
      </div>
    </>
  )
}



    </Layout>
  )
}
