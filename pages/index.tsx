import Image from "next/image"
import { useEffect } from "react"
import data from "../utils/data.json"
const questions = [
  "No se observan productos o objetos no pertenecientes a la carga que podrian ser contaminantes",
  "no se evidencia olores desagradables que podrian indicar contaminacion",
  "Personal de camión se presenta con su uniforme en buenas condiciones",
  "No se observa presencia de plagas (",
  "Camión cumple condiciones de temperatura necesarias para cumplimiento de normativa nacional -12° C",
  "Equipo de fríose encuentra funcionando y con precamara antes",
  "Interior del camión se encuentra limpio, sin restos de productos y trozos de madera (Pallets) y en condiciones de higiene",
  "Anden",
  "Hora puesta",
  "Hora salida de Anden",
  "Temperatura visor del camión",
  "Temperatura de camión medición manual",
]
const IndexPage = () => {

  return (
    <div className="w-screen h-screen">
      <div className="w-full bg-slate-50 h-18 p-4 border-b-[1px] border-[#e6e4e4]">
        <Image src={"/logo.png"} alt="arv_logo" width={124} height={46} />
      </div>
      <div className="w-full">

      </div>
    </div>
  )
}

export default IndexPage
