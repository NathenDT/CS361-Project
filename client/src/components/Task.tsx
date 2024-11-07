import { FaCheck } from 'react-icons/fa'
import { FaTrash } from 'react-icons/fa'
import { FaInfoCircle } from 'react-icons/fa'
import { useState } from 'react'

type TaskProps = {
  id: string
  title: string
  status: 'In Progress' | 'Completed' | 'Priority'
}

type Props = {
  id: string
  title: string
  setTasks: React.Dispatch<React.SetStateAction<TaskProps[]>>
}

export default function Task({ id, title, setTasks }: Props) {
  const [showDeleteTooltip, setShowDeleteTooltip] = useState(false)
  const [showCompleteTooltip, setShowCompleteTooltip] = useState(false)
  const [showDeleteInfoPopup, setShowDeleteInfoPopup] = useState(false)

  const handleDeleteClick = async () => {
    const response = await fetch(`http://localhost:8002/remove/${id}`, {
      method: 'GET',
    })

    const data = await response.json()
    setTasks(data)
  }

  return (
    <div className="flex items-center gap-2 p-2 m-2 rounded-lg border">
      <span>{title}</span>

      <div className="grow"></div>

      <div
        className="relative"
        onMouseEnter={() => setShowDeleteTooltip(true)}
        onMouseLeave={() => setShowDeleteTooltip(false)}
      >
        <div className="p-1">
          <button
            onClick={handleDeleteClick}
            className="p-2 flex m-2 border rounded-full hover:bg-slate-200"
          >
            <FaTrash />
          </button>
        </div>
        {showDeleteTooltip && (
          <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 translate-y-1 px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg flex items-center gap-1">
            Delete
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowDeleteInfoPopup(true)
              }}
              className="ml-1 text-blue-400 hover:text-blue-500"
            >
              <FaInfoCircle />
            </button>
          </div>
        )}
      </div>

      {showDeleteInfoPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-lg text-center max-w-xs">
            <p className="mb-4 text-gray-700">
              Deleting this task will remove it permanently. Are you sure you
              want to proceed?
            </p>
            <button
              onClick={() => setShowDeleteInfoPopup(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div
        className="relative"
        onMouseEnter={() => setShowCompleteTooltip(true)}
        onMouseLeave={() => setShowCompleteTooltip(false)}
      >
        <button className="p-2 flex m-2 border rounded-full hover:bg-slate-200">
          <FaCheck />
        </button>
        {showCompleteTooltip && (
          <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg">
            Complete
          </div>
        )}
      </div>
    </div>
  )
}
