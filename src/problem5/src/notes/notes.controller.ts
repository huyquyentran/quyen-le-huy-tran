import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import { NotesService } from './notes.service';
import { CreateNoteReqSchema } from './dtos/create-note-req.dto';
import { UpdateNoteReqSchema } from './dtos/update-note-req.dto';
import { NoteQuerySchema } from './dtos/note-query.dto';
import { PaginatedList } from 'shared/dtos/paginated-list.dto';
import { Note } from './note.entity';

@Service()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  list = async (req: Request, res: Response<PaginatedList<Omit<Note, 'user'>>>, next: NextFunction) => {
    try {
      const query = NoteQuerySchema.parse(req.query);
      const result = await this.notesService.list(req.user!.id, query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response<Omit<Note, 'user'>>, next: NextFunction) => {
    try {
      const result = await this.notesService.getById(+req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response<Omit<Note, 'user'>>, next: NextFunction) => {
    try {
      const payload = CreateNoteReqSchema.parse(req.body);
      const result = await this.notesService.create(req.user!.id, payload);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response<Omit<Note, 'user'>>, next: NextFunction) => {
    try {
      const payload = UpdateNoteReqSchema.parse(req.body);
      const result = await this.notesService.update(req.user!.id, +req.params.id, payload);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.notesService.delete(req.user!.id, +req.params.id);
      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  };
}
