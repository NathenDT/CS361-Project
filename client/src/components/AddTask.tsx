import { useState } from 'react'

type Task = {
  id: string
  title: string
  status: 'In Progress' | 'Completed' | 'Priority'
}

type Props = {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export default function AddTask({ setTasks }: Props) {
  const [lastID, setLastID] = useState<null | string>(null)
  const [title, setTitle] = useState('')
  const [showUndoPopup, setShowUndoPopup] = useState(false)

  const onClick = async () => {
    const response = await fetch('http://localhost:8001/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: title }),
    })

    const data = await response.json()

    if (data.length) {
      setLastID(data[data.length - 1].id)
    }

    setTasks(data)
    setTitle('')
    setShowUndoPopup(true)
    setTimeout(() => {
      setShowUndoPopup(false)
    }, 3000) // Hide after 3 seconds
  }

  const handleUndo = async () => {
    setShowUndoPopup(false)

    if (!lastID) return

    const response = await fetch(`http://localhost:8002/remove/${lastID}`, {
      method: 'GET',
    })

    const data = await response.json()
    setTasks(data)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevent form submission if the input is in a form
      onClick()
    }
  }

  return (
    <>
      <div className="m-2 p-2 border rounded-lg">
        <h2 className="text-lg font-semibold m-2">Add a Task</h2>
        <p className="m-2 text-xs text-slate-400">
          Adding a task will append the task to the bottom of the list below
        </p>
        <div className="flex gap-2 m-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border rounded-lg p-2 grow"
            placeholder="Do my homework..."
          />
          <button
            onClick={onClick}
            className="border rounded-lg py-2 px-4 bg-sky-500 text-white font-semibold"
          >
            Add
          </button>
        </div>
      </div>

      {showUndoPopup && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4 z-50">
          <span>Task added.</span>
          <button
            onClick={handleUndo}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Undo
          </button>
        </div>
      )}
    </>
  )
}
