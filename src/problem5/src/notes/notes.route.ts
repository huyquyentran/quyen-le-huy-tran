import { Container } from 'typedi';
import { Router } from 'express';
import { NotesController } from './notes.controller';
import { authMiddleware } from '../auth/auth.middleware';
import { Tspec } from 'tspec';
import { NoteQueryDTO } from './dtos/note-query.dto';
import { CreateNoteReqDTO } from './dtos/create-note-req.dto';
import { UpdateNoteReqDTO } from './dtos/update-note-req.dto';

export const notesRouter = Router();
const notesController = Container.get(NotesController);

notesRouter.get('/', authMiddleware, notesController.list);
notesRouter.post('/', authMiddleware, notesController.create);
notesRouter.get('/:id', authMiddleware, notesController.getById);
notesRouter.put('/:id', authMiddleware, notesController.update);
notesRouter.delete('/:id', authMiddleware, notesController.delete);

// Swagger spec for the Notes API
export type NotesApiSpec = Tspec.DefineApiSpec<{
  basePath: '/v1/notes';
  tags: ['Notes'];
  security: 'BearerAuth';
  paths: {
    '/': {
      get: {
        summary: 'List of notes';
        handler: typeof notesController.list;
        query: NoteQueryDTO;
      };
      post: {
        summary: 'Create a note';
        handler: typeof notesController.create;
        body: CreateNoteReqDTO;
      };
    };
    '/{id}': {
      get: {
        summary: 'Get note by ID';
        handler: typeof notesController.getById;
        path: { id: number };
      };
      put: {
        summary: 'Update a note';
        handler: typeof notesController.update;
        path: { id: number };
        body: UpdateNoteReqDTO;
      };
      delete: {
        summary: 'Delete a note';
        handler: typeof notesController.delete;
        path: { id: number };
      };
    };
  };
}>;
