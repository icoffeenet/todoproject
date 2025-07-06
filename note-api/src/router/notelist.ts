import express from "express";

import {getNoteList, addNoteList, editNoteList, deleteNoteList} from "../controller/NoteList/NoteList";

const NoteListRouter = express.Router();

NoteListRouter.get('/', getNoteList);
NoteListRouter.post('/', addNoteList);
NoteListRouter.put('/:note_id', editNoteList);
NoteListRouter.delete('/:note_id', deleteNoteList);

export default NoteListRouter;