import React, { useContext, useEffect } from "react"
import Link from "next/link"
import authContext from "../context/auth/authContext"
import appContext from "../context/app/appContext"
import { useRouter } from "next/router"

export default function Header() {

  //routing
  const router = useRouter()

  // extraer el usuario autenticado del storage
  const AuthContext = useContext(authContext)
  const { usuario, usuarioAutenticado, cerrarSesion } = AuthContext

  // context de la aplicacion
  const AppContext = useContext(appContext)
  const { limpiarState } = AppContext

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token) {
      usuarioAutenticado()
    }
    
  },[])

  const redireccionar = () => {
    router.push('/')
    limpiarState()
  }

  return (
    <header className="py-8 flex flex-col md:flex-row items-center justify-between bg-white w-full md:px-12">
      <img
        className="w-64 mb-8 md:mb-0 cursor-pointer"
        src="/logo.svg"
        onClick={() => redireccionar()}
      />
      <div>
        {usuario ? (
          <div className="flex items-center">
            <p className="mr-4">
              Hola <span className="font-bold text-red-500">{usuario.nombre}</span>
            </p>
            <button
              type="button"
              className="bg-black px-5 py-3 rounded-lg text-white font-bold uppercase"
              onClick={() => cerrarSesion()}
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <>
            <Link
              href="/inicia-sesion"
              className="bg-red-500 px-5 py-3 rounded-lg text-white font-bold uppercase mr-2"
            >
              Iniciar Sesión
            </Link>

            <Link
              href="/crear-cuenta"
              className="bg-black px-5 py-3 rounded-lg text-white font-bold uppercase"
            >
              Crear Cuenta
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
