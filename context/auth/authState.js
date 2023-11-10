import { useReducer } from "react"
import Router from 'next/router'
import authContext from "./authContext"
import authReducer from "./authReducer"
import { 
    REGISTRO_EXITOSO,
    REGISTRO_ERROR,
    REINICIAR_MENSAJE,
    LOGIN_ERROR,
    LOGIN_EXITOSO,
    USUARIO_AUTENTICADO,
    CERRAR_SESION
 } from "../../types"
import clienteAxios from "../../config/axios"
import tokenAuth from "../../config/tokenAuth"

const AuthState = ({children}) => {

    // definir state inicial
    const initialState = {
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : '',
        autenticado: null,
        usuario: null,
        mensaje: null
    }

    // definir el reducer
    const [state, dispatch] = useReducer(authReducer, initialState)

    // registrar nuevos usuarios
    const registrarUsuario = async datos => {
        try {
            const respuesta = await clienteAxios.post('/api/usuarios', datos)
            dispatch({
                type: REGISTRO_EXITOSO,
                payload: respuesta.data.msg
            })

            setTimeout(() => {
                Router.push('/')
            }, 3000);

        } catch (error) {
            dispatch({
                type: REGISTRO_ERROR,
                payload: error.response.data.msg
            })
        }
        setTimeout(() => {
            dispatch({
                type: REINICIAR_MENSAJE
            })
        }, 3000);
    }

    // autenticar usuarios
    const iniciarSesion = async datos => {        
        try {
            const respuesta = await clienteAxios.post('/api/auth', datos)
            dispatch({
                type: LOGIN_EXITOSO,
                payload: respuesta.data.token
            })      
        } catch (error) {
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            })
        }
        setTimeout(() => {
            dispatch({
                type: REINICIAR_MENSAJE
            })
        }, 3000);
    }

    // funcion que retorna el usuario autenticado en base al JWT
    const usuarioAutenticado = async () => {
        const token = localStorage.getItem('token')
        if(token) {
            tokenAuth(token)
        }
        try {
            const respuesta = await clienteAxios('/api/auth')
            if(respuesta.data.usuario) {
                dispatch({
                    type: USUARIO_AUTENTICADO,
                    payload: respuesta.data.usuario
                })
            }
            
        } catch (error) {
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            })
        }
    }

    // cerrar sesion
    const cerrarSesion = () => {
        dispatch({
            type: CERRAR_SESION
        })
    }


    return (
        <authContext.Provider
            value={{
                token: state.token,
                autenticado: state.autenticado,
                usuario: state.usuario,
                mensaje: state.mensaje,
                registrarUsuario,            
                iniciarSesion,
                usuarioAutenticado,
                cerrarSesion
            }}
        >
            {children}
        </authContext.Provider>
    )
}

export default AuthState