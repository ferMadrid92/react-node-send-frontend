import { useReducer } from "react"
import appContext from "./appContext"
import appReducer from "./appReducer"
import {
    MOSTRAR_MENSAJE,
    REINICIAR_MENSAJE,
    SUBIR_ARCHIVO,
    SUBIR_ARCHIVO_EXITO,
    SUBIR_ARCHIVO_ERROR,
    CREAR_ENLACE_EXITO,
    CREAR_ENLACE_ERROR,
    LIMPIAR_STATE,
    AGREGAR_PASSWORD,
    AGREGAR_DESCARGAS
} from '../../types'
import clienteAxios from "../../config/axios"

const AppState = ({children}) => {

    const initialState = {
        mensaje_archivo: '',
        nombre: '',
        nombre_original: '',
        cargando: false,
        descargas: 1,
        password: '',
        autor: null,
        url: ''
    }

    // crear dispatch y state
    const [state, dispatch] = useReducer(appReducer, initialState)

    //muestra una alerta
    const mostrarAlerta = msg => {
        dispatch({
            type: MOSTRAR_MENSAJE,
            payload: msg
        })
        setTimeout(() => {
            dispatch({
                type: REINICIAR_MENSAJE
            })
        }, 3000);
    }

    // subir los archivos al servidor
    const subirArchivo = async (formData, nombreArchivo) => {

        dispatch({
            type: SUBIR_ARCHIVO
        })

        try {            
        const resultado = await clienteAxios.post('/api/archivos', formData)
        
        dispatch({
            type: SUBIR_ARCHIVO_EXITO,
            payload: {
                nombre: resultado.data.archivo,
                nombre_original: nombreArchivo
            }
        })
        
        } catch (error) {
            console.log(error)
            dispatch({
                type: SUBIR_ARCHIVO_ERROR,
                payload: error.response.data.msg
            })
        }
    }

    // crear enlace una vez que se sube el archivo
    const crearEnlace = async () => {
        const data = {
            nombre: state.nombre,
            nombre_original: state.nombre_original,
            descargas: state.descargas,
            password: state.password,
            autor: state.autor
        }

        try {
            const resultado = await clienteAxios.post('/api/enlaces', data)
            dispatch({
                type: CREAR_ENLACE_EXITO,
                payload: resultado.data.msg
            })
        } catch (error) {
            console.log(error)
            dispatch({
                type: CREAR_ENLACE_ERROR,
                payload: error.response.data.msg
            })
        }
    }

    const limpiarState = () => {
        dispatch({
            type: LIMPIAR_STATE
        })
    }

    // agregar password al enlace
    const agregarPassword = password => {
        dispatch({
            type: AGREGAR_PASSWORD,
            payload: password
        })
    }

    // agregar cantidad descargas
    const agregarDescargas = descargas => {
        dispatch({
            type: AGREGAR_DESCARGAS,
            payload: descargas
        })
    }

    return (
        <appContext.Provider
            value={{
                mensaje_archivo: state.mensaje_archivo,
                nombre: state.nombre,
                nombre_original: state.nombre_original,
                cargando: state.cargando,
                descargas: state.descargas,
                password: state.password,
                autor: state.autor,
                url: state.url,
                mostrarAlerta,
                subirArchivo,
                crearEnlace,
                limpiarState,
                agregarPassword,
                agregarDescargas
            }}
        >
            {children}
        </appContext.Provider>
    )
}

export default AppState