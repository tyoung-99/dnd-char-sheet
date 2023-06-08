import React from "react"
import { useEffect, useState } from "react"
import axios from "axios"

const Home = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/")
        setData(res.data)
      } catch (error) {
        console.log(error)
      }
    };
    fetchData()
  }, [])

  return (
    <div>
      <h1>Data</h1>
      <div className="data">
        {data.map(elem => (
          <div className="elem" key={elem.id}>
            <h2>{elem.id}</h2>
            <p>{elem.test_data}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home