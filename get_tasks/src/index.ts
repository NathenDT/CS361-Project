import express from 'express'
import fs from 'fs'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.GET_TASKS_PORT || 8000

interface DataRow {
  [key: string]: string
}

// Middleware to parse JSON bodies
app.use(express.json())

app.use(cors())

// Define the TSV file path
const tsvFilePath = '../data.tsv'

// POST endpoint to add a task
app.get('/get_tasks', (req: any, res: any) => {
  const data = readTSV(tsvFilePath)
  res.json(data)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

function readTSV(filePath: string): DataRow[] {
  const data = fs.readFileSync(filePath, 'utf8')
  const rows = data.trim().split('\n')
  const headers = rows[0].split('\t')

  return rows.slice(1).map((row) => {
    const values = row.split('\t')
    const result: DataRow = {}
    headers.forEach((header, index) => {
      result[header] = values[index]
    })
    return result
  })
}
