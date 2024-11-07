import React, { useState } from 'react'

type TaskType = {
  id: string
  title: string
  status: 'In Progress' | 'Completed' | 'Priority'
}

type Props = {
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>
}

export default function ClearAll({ setTasks }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClearAll = async () => {
    await fetch(`http://localhost:8002/remove_all`, {
      method: 'GET',
    })

    setTasks([])
    setIsModalOpen(false)
  }

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="m-2 p-2 border rounded-lg hover:bg-slate-200"
      >
        Clear All Tasks
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete all tasks?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
