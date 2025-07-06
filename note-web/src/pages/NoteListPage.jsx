import { useEffect, useState } from 'react'
import { getNoteApi, addNoteApi, editNoteApi, deleteNoteApi } from '../api/note/Note.js'

const initialInput = {
  title: '',
  descript: '',
  completed: false,
}

export default function NoteListPage() {
  const [input, setInput] = useState(initialInput)
  const [notes, setNotes] = useState([])
  const [editId, setEditId] = useState(null)

  const fetchNotes = async () => {
    const res = await getNoteApi()
    setNotes(res.data.notelist)
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setInput((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editId) {
      await editNoteApi(editId, input)
      setEditId(null)
    } else {
      const newNote = { ...input, id: Date.now() }
      await addNoteApi(newNote)
    }
    setInput(initialInput)
    fetchNotes()
  }

  const handleDelete = async (id) => {
    await deleteNoteApi(id)
    fetchNotes()
  }

  const startEdit = (note) => {
    setInput({
      title: note.title,
      descript: note.descript,
      completed: note.completed,
    })
    setEditId(note.id)
  }

  const cancelEdit = () => {
    setInput(initialInput)
    setEditId(null)
  }

  return (
    <>
      <h1>My NoteList</h1>
      <form onSubmit={handleSubmit} className='flex flex-col w-64'>
        <input
                  className='input'
          name="title"
          placeholder="title"
          value={input.title}
          onChange={handleChange}
        />
        <textarea
                  className='textarea'
          name="descript"
          placeholder="description"
          value={input.descript}
          onChange={handleChange}
        />
        <label>
          Completed:
          <input
                    className='checkbox'
            type="checkbox"
            name="completed"
            checked={input.completed}
            onChange={handleChange}
          />
        </label>
        <button className='btn mb-4' type="submit">{editId ? 'Update' : 'Add'}</button>
        {editId && <button className='btn' type="button" onClick={cancelEdit}>Cancel</button>}
      </form>

      <ul>
        {notes.map((note) => (
          <li className='p-1' key={note.id}>
            <strong>{note.title}</strong> - {note.descript} [{note.completed ? '✔' : '❌'}]
            <button className='btn' onClick={() => startEdit(note)}>Edit</button>
            <button className='btn' onClick={() => handleDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  )
}