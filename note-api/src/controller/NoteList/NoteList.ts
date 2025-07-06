import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'

const filePath = path.join(__dirname, '../../../note.txt')

function readNoteFile() {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  if (!content) return [];

  const rawLines = content
    .replace(/}\s*{/g, '}\n{') // split joined objects like {...}{...}
    .split('\n')
    .filter(Boolean);

  const notes = [];
  for (const line of rawLines) {
    try {
      notes.push(JSON.parse(line));
    } catch (e) {
      console.error(`Invalid JSON line: ${line}`);
      throw e;
    }
  }
  return notes;
}

function writeNoteFile(noteList: any[]) {
  const lines = noteList.map(item => JSON.stringify(item))
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8')
}

export function getNoteList(req: Request, res: Response) {
  const noteList = readNoteFile()
  res.json({ notelist: noteList })
}

export function addNoteList(req: Request, res: Response) {
  const noteList = readNoteFile()
  const newItem = req.body
  if (noteList.some(item => item.id === newItem.id)) {
    res.status(400).json({ msg: 'ID already exists' })
    return
  }
  fs.appendFileSync(filePath, JSON.stringify(newItem) + '\n', 'utf-8')
  res.status(201).json({ msg: 'Note added', note: newItem })
}

export function editNoteList(req: Request, res: Response) {
  const note_id = Number(req.params.note_id)
  const updatedData = req.body
  const noteList = readNoteFile()
  const index = noteList.findIndex(item => item.id === note_id)
  if (index === -1) {
    res.status(404).json({ msg: 'Note not found' })
    return
  }
  noteList[index] = { ...noteList[index], ...updatedData }
  writeNoteFile(noteList)
  res.status(200).json({ msg: 'Note updated', note: noteList[index] })
}

export function deleteNoteList(req: Request, res: Response) {
  const note_id = Number(req.params.note_id)
  const noteList = readNoteFile()
  const newList = noteList.filter(item => item.id !== note_id)
  if (newList.length === noteList.length) {
    res.status(404).json({ msg: 'Note not found' })
    return
  }
  writeNoteFile(newList)
  res.status(200).json({ msg: `Deleted Notelist ID ${note_id} successfully` })
}
