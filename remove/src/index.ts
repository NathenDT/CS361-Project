import express from 'express'
import fs from 'fs'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

interface DataRow {
  [key: string]: string
}

const app = express()
const port = process.env.REMOVE_PORT || 8002

// Middleware to parse JSON bodies
app.use(express.json())

app.use(cors())

// Define the TSV file path
const tsvFilePath = '../data.tsv'

// GET endpoint with url paramter ID to look for a task to remove
app.get('/remove/:id', (req: any, res: any) => {
  const { id } = req.params

  if (!id || typeof id !== 'string') {
    return res
      .status(400)
      .json({ error: 'ID is required and must be a string.' })
  }

  fs.readFile(tsvFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read the file.' })
    }

    const lines = data.trim().split('\n')
    const headers = lines[0].split('\t')

    const tasks = lines.slice(1).map((line) => {
      const values = line.split('\t')
      const task: any = {}
      headers.forEach((header, index) => {
        task[header] = values[index]
      })
      return task
    })

    const taskIndex = tasks.findIndex((task: any) => task.id === id)

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found.' })
    }

    tasks.splice(taskIndex, 1)

    const newTasks =
      [
        headers.join('\t'),
        ...tasks.map((task: any) => Object.values(task).join('\t')),
      ].join('\n') + '\n'

    fs.writeFile(tsvFilePath, newTasks, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write to the file.' })
      }

      res.status(200).json(tasks)
    })
  })
})

// Create an endpoint to delete all tasks
app.get('/remove_all', (req: any, res: any) => {
  const headers = ['id', 'title', 'status'].join('\t') + '\n'

  fs.writeFile(tsvFilePath, headers, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to write to the file.' })
    }

    res.status(200).json([])
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
