import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { Select } from 'antd';
const { Option } = Select;
import { Pie } from '@ant-design/plots';
import { Column } from '@ant-design/plots';

import data from '../utils/data.json';

enum RESPONSE {
  C = 'YES',
  NC = 'NO',
  NA = 'NA'
}
enum RESPONSE_SLUG {
  C = 'C',
  NC = 'NC',
  NA = 'NA'
}
enum SLUG_RESPONSE {
  YES = 'C',
  NO = 'NC',
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
  const [dataForSupervisorXResponse, setDataForSupervisorXResponse] = useState([])
  const [graphData, setGraphData] = useState([]);
  const [selectedResponseType, setSelectedResponseType] = useState<string>(RESPONSE_SLUG.C);
  const [selectedQuestionIndexForGraph, setSelectedQuestionIndexForGraph] = useState<number>(0);
  const handleChangeQuestion = (index:number) => {
    setSelectedQuestionIndex(index)
  }
  const handleChangeResponseType = (type:RESPONSE_SLUG) => {
    setSelectedResponseType(type)
  }
  const handleChangeQuestionForGraph = (index:number) => {
    setSelectedQuestionIndexForGraph(index)
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

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  const processDataForSupervisorXResponse = useCallback(() => {
    const response = [];
    const supervisorScores = {}
    data.forEach((dataObj, dataInd) => {
      const truckId = dataInd + 1
      questions.forEach((question) => {
        if(SLUG_RESPONSE[dataObj[question]] === selectedResponseType){
          const truckWiseResponse = {
            [truckId]: SLUG_RESPONSE[dataObj[question]],
            checkedBy: dataObj['CheckedBy'],
            count: 1
          }
          const isDataEntryAlreadyPresent = response.filter(r => {
            return !!r[truckId]
          })
          if(isDataEntryAlreadyPresent.length){
            const index = response.findIndex(e => Number(getKeyByValue(e, selectedResponseType)) === truckId);
            response[index].count += 1
          }else{
            response.push(truckWiseResponse)
          }
        }
      })
    })
    response.forEach(res => {
      if(supervisorScores[res.checkedBy]){
        supervisorScores[res.checkedBy].push(res.count)
      }else{
        supervisorScores[res.checkedBy] = [res.count]
      }
    })
    const final = []
    Object.keys(supervisorScores).forEach(s => {
      final.push({
        supervisor: s,
        score: Number((supervisorScores[s].reduce((a, b) => a + b, 0) / supervisorScores[s].length).toFixed(1) || 0)
      })
    })
    setDataForSupervisorXResponse(final)
  }, [data, selectedResponseType])

  const processDataForgraph = useCallback(() => {
    const response = [];
    const truckScores = {}
    data.forEach((dataObj, dataInd) => {
      const truckId = dataInd + 1
      questions.forEach((question) => {
        const truckWiseResponse = {
          [truckId]: SLUG_RESPONSE[dataObj[question]],
          checkedBy: dataObj['CheckedBy'],
          count: 1
        }
        const isDataEntryAlreadyPresent = response.filter(r => {
          return !!r[truckId]
        })
        if(isDataEntryAlreadyPresent.length){
          // const index = response.findIndex(e => Number(getKeyByValue(e, selectedResponseType)) === truckId);
          // response[index].count += 1
        }else{
          response.push(truckWiseResponse)
        }
      })
    })
    console.log({response});

    response.forEach(res => {
      if(truckScores[res.checkedBy]){
        truckScores[res.checkedBy].push(res.count)
      }else{
        truckScores[res.checkedBy] = [res.count]
      }
    })
    const final = []
    Object.keys(truckScores).forEach(s => {
      final.push({
        supervisor: s,
        score: Number((truckScores[s].reduce((a, b) => a + b, 0) / truckScores[s].length).toFixed(1) || 0)
      })
    })
  }, [data, selectedQuestionIndexForGraph])

  const lineGraphConfig = {
    data: graphData,
    isGroup: true,
    xField: 'name',
    yField: 'response',
    seriesField: 'type',
  };
  useEffect(() => {
    // setProviders(Array.from(new Set<string>(data.map(item => item[PROVIDER_HEADER_NAME]))))
    // setSelectedSupervisors(Array.from(new Set<string>(data.map(item => item['CheckedBy']))))
  }, [data])

  useEffect(() => {
    processDataForQuestionXResponse()
  }, [processDataForQuestionXResponse, selectedQuestionIndex])

  useEffect(() => {
    processDataForSupervisorXResponse()
  }, [processDataForSupervisorXResponse, selectedResponseType])
  useEffect(() => {
    processDataForgraph()
  }, [processDataForgraph, selectedQuestionIndexForGraph])

  const pieConfigProviderXResponse = {
    data: dataForSupervisorXResponse,
    xField: 'supervisor',
    yField: 'score',
    seriesField: '',
    color: '#5B8FF9',
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
        <div className="h-full w-[49%] p-4 bg-blue-200 flex flex-col m-4 rounded-lg">
          <h1 className="w-full text-center text-2xl font-thin">Response X Supervisors</h1>
          <Select key={1} className="w-1/5" defaultValue={RESPONSE_SLUG.C} onChange={handleChangeResponseType}>
            {Object.keys(RESPONSE_SLUG).map((type:string) => (
              <Option value={type}>{type}</Option>
            ))}
          </Select>
          <Column {...pieConfigProviderXResponse} />
        </div>
        <div className="h-full w-[49%] p-4 bg-blue-100 flex flex-col m-4 rounded-lg">
          <h1 className="w-full text-center text-2xl font-thin">Response X Question</h1>
          <Select key={2} className="w-1/2" defaultValue={0} onChange={handleChangeQuestion}>
            {questions.map((question:string, index:number) => (
              <Option value={index}>{question}</Option>
            ))}
          </Select>
          <Pie {...pieConfigQuestionXResponse} />
        </div>
      </div>
      <div className="m-4 p-4 py-8 bg-slate-100 rounded-lg">
        <h1 className="w-full text-center text-2xl font-thin">Question X Response X Supervisor</h1>
        <Select key={3} className="!my-4" defaultValue={0} onChange={handleChangeQuestionForGraph}>
          {questions.map((provider:string, index:number) => (
            <Option value={index}>{provider}</Option>
          ))}
        </Select>
        <Column {...lineGraphConfig} />
      </div>
    </div>
  )
}

export default IndexPage
