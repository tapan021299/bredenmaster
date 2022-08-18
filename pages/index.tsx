import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { Select } from 'antd';
const { Option } = Select;
import { Pie } from '@ant-design/plots';
import data from '../utils/data.json';

enum RESPONSE {
  C = 'YES',
  NC = 'NO',
  NA = 'NA'
}
const PROVIDER_HEADER_NAME = "Proveedor (responsable despacho)"
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
];

const IndexPage = () => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [pieDataForQuestionXResponse, setPieDataForQuestionXResponse] = useState([])
  const [pieDataForProviderXResponse, setPieDataForProviderXResponse] = useState([])

  const [providers, setProviders] = useState<string[]>([])
  const [selectedProviderIndex, setSelectedproviderIndex] = useState<number>(0);

  const handleChangeQuestion = (index:number) => {
    setSelectedQuestionIndex(index)
  }
  const handleChangeProvider = (index:number) => {
    setSelectedproviderIndex(index)
  }

  const processDataForQuestionXResponse = useCallback(() => {
    let C = 0;
    let NC = 0;
    let NA = 0;

    data.forEach(dataObj => {
      const response = dataObj[questions[selectedQuestionIndex]];
      if(response === RESPONSE.C){
        C += 1
      }else if (response === RESPONSE.NC){
        NC += 1
      }else if (response === RESPONSE.NA){
        NA += 1
      }
    })
    setPieDataForQuestionXResponse([
      {
        type: 'CUMPLE',
        value: C
      },
      {
        type: 'NO CUMPLE',
        value: NC
      },
      {
        type: 'NO APLICA',
        value: NA
      }
    ])
  }, [selectedQuestionIndex, data])

  const processDataForProviderXResponse = useCallback(() => {
    let C = 0;
    let NC = 0;
    let NA = 0;

    data.forEach(dataObj => {
      const response = dataObj[questions[selectedQuestionIndex]];
      if(dataObj[PROVIDER_HEADER_NAME] === providers[selectedProviderIndex]){
        if(response === RESPONSE.C){
          C += 1
        }else if (response === RESPONSE.NC){
          NC += 1
        }else if (response === RESPONSE.NA){
          NA += 1
        }
      }
    })

    setPieDataForProviderXResponse([
      {
        type: 'CUMPLE',
        value: C
      },
      {
        type: 'NO CUMPLE',
        value: NC
      },
      {
        type: 'NO APLICA',
        value: NA
      }
    ])
  }, [data, selectedProviderIndex])

useEffect(() => {
  setProviders(Array.from(new Set<string>(data.map(item => item[PROVIDER_HEADER_NAME]))))
}, [data])

useEffect(() => {
  processDataForQuestionXResponse()
}, [processDataForQuestionXResponse, selectedQuestionIndex])

useEffect(() => {
  processDataForProviderXResponse()
}, [processDataForProviderXResponse, selectedProviderIndex])

  const pieConfigProviderXResponse = {
    appendPadding: 10,
    data: pieDataForProviderXResponse,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };
  const pieConfigQuestionXResponse = {
    appendPadding: 10,
    data: pieDataForQuestionXResponse,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };

  return (
    <div className="w-screen h-screen">
      <div className="w-full bg-slate-50 h-16 p-4 border-b-[1px] border-[#e6e4e4]">
        <Image src={"/logo.png"} alt="arv_logo" width={124} height={46} />
      </div>
      <div className="w-full flex">
        <div className="w-[calc(50% -1rem)] h-full p-4 bg-blue-200 flex flex-col m-4 rounded-lg">
          <h1 className="w-full text-center text-2xl font-thin">Provider X Response</h1>
            <Select key={1} className="w-1/2" defaultValue={0} onChange={handleChangeProvider}>
              {providers.map((provider:string, index:number) => (
                <Option value={index}>{provider}</Option>
              ))}
            </Select>
            <Pie {...pieConfigProviderXResponse} />
        </div>
        <div className="w-[calc(50% -1rem)] h-full p-4 bg-blue-100 flex flex-col m-4 rounded-lg">
          <h1 className="w-full text-center text-2xl font-thin">Response X Question</h1>
          <Select key={2} className="w-1/2" defaultValue={0} onChange={handleChangeQuestion}>
            {questions.map((question:string, index:number) => (
              <Option value={index}>{question}</Option>
            ))}
          </Select>
          <Pie {...pieConfigQuestionXResponse} />
        </div>
      </div>
    </div>
  )
}

export default IndexPage
