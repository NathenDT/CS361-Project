import { useEffect, useState } from 'react'
import AddTask from './components/AddTask'
import Task from './components/Task'
import ClearAll from './components/ClearAll'
import { FaInfoCircle } from 'react-icons/fa'

type TaskType = {
  id: string
  title: string
  status: 'In Progress' | 'Completed' | 'Priority'
}

export default function App() {
  const [tasks, setTasks] = useState<TaskType[]>([])
  const [showInfoPopup, setShowInfoPopup] = useState(true)

  useEffect(() => {
    ;(async () => {
      const response = await fetch(`http://localhost:8000/get_tasks`)
      const data = await response.json()
      setTasks(data)
    })()
  }, [])

  return (
    <div className="container mx-auto w-full sm:w-[500px]">
      <h1 className="text-xl font-bold m-2">TO-DO Application</h1>

      <AddTask setTasks={setTasks} />

      <ClearAll setTasks={setTasks} />

      <div>
        {tasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            title={task.title}
            setTasks={setTasks}
          />
        ))}
      </div>

      {showInfoPopup && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-3xl" />
            <span>
              This is a to-do application that allows users to add tasks they
              want to remember to do.
            </span>
            <button
              onClick={() => setShowInfoPopup(false)}
              className="ml-4 bg-blue-700 hover:bg-blue-800 text-white py-1 px-3 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
