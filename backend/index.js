import express from "express"
import mysql from "mysql2"
import cors from "cors"

const app = express()

const db = mysql.createConnection({
  host: "localhost",
  user: "dnd_char_sheet",
  password: "&bH&cdos^6JGO274*%Dr",
  database: "dnd_char_sheet"
})

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  const query  = "SELECT * FROM test_table"
  db.query(query, (error, data) => {
    if (error) return res.json(error)
    return res.json(data)
  })
})

app.listen(8800, () => {
  console.log("Connected to backend.")
})