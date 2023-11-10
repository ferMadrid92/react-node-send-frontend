import { useContext, useEffect } from "react"
import Layout from "../components/Layout"
import Link from "next/link"
import authContext from "../context/auth/authContext"
import appContext from "../context/app/appContext"
import Alerta from "../components/Alerta"
import Dropzone from "../components/Dropzone"

export default function Home() {

  // extraer el usuario autenticado del storage
  const AuthContext = useContext(authContext)
  const { usuarioAutenticado, autenticado } = AuthContext

  //extraer el mensaje de error de archivos
  const AppContext = useContext(appContext)
  const { mensaje_archivo, url } = AppContext

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token) {
      usuarioAutenticado()
    }
    
  },[])

  return (
    <Layout>
      <div className="md:w-4/5 xl:w-3/5 mx-auto mb-32">
        { url ? (
          <>
            <div className="flex-col p-5">
              <p className="text-center text-lg md:text-2xl mt-10">
                <span className="font-bold text-red-700 text-2xl md:text-3xl uppercase">Tu URL es:</span> {`${process.env.NEXT_PUBLIC_FRONTEND_URL}/enlaces/${url}`}
              </p>
              <button
                  type="button"
                  className="bg-red-500 hover:bg-gray-900 w-full p-2 text-white uppercase font-bold mt-10"
                  onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/enlaces/${url}`)}
              >Copiar enlace</button>
            </div>
          </>
        ) : (
          <>
          <div className='px-4'>
            { mensaje_archivo && <Alerta />}
            <div className="lg:flex md:shadow-lg p-5 bg-white rounded-lg py-2 md:py-10">
              <Dropzone />
              <div className="md:flex-1 mb-3 mx-2 mt-16 lg:mt-0">
                <h2 className="text-4xl font-sans font-bold text-gray-800 my-4">Comparte archivos de forma sencilla y privada</h2>
                <p className="text-lg leading-loose"> Con <span className="text-red-500 font-bold">ReactNodeSend</span>, puedes enviar archivos de forma segura y confidencial. Los archivos se cifran antes de transmitirse y se borran una vez que se descargan. De esta manera, proteges tu privacidad y evitas que tus datos se queden en la red indefinidamente.
                </p>
                {!autenticado ? (
                  <Link className="text-red-500 font-bold text-lg hover:text-red-700" href={'/crear-cuenta'}>Crea una cuenta y obtén mayores beneficios</Link>
                ) : null}             
              </div>
            </div>
          </div>
          </>
        )}
      </div>
    </Layout>
  
  )
}
