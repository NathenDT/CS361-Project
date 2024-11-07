import express from 'express'
import fs from 'fs'
import cuid from 'cuid'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.ADD_PORT || 8001

// Middleware to parse JSON bodies
app.use(express.json())

app.use(cors())

// Define the TSV file path
const tsvFilePath = '../data.tsv'

// POST endpoint to add a task
app.post('/add', (req: any, res: any) => {
  const { task } = req.body

  if (!task || typeof task !== 'string') {
    return res
      .status(400)
      .json({ error: 'Task is required and must be a string.' })
  }

  const taskId = cuid()
  const taskEntry = `${taskId}\t${task}\tIn Progress\n`

  fs.appendFile(tsvFilePath, taskEntry, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to add task to the file.' })
    }
  })

  const data = readTSV(tsvFilePath)

  data.push({ id: taskId, title: task, status: 'In Progress' })

  res.json(data)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

interface DataRow {
  [key: string]: string
}

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
