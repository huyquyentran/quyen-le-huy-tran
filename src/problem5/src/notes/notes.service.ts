import { Inject, Service } from 'typedi';
import { DataSource, FindOptionsWhere, Like, Repository } from 'typeorm';
import createHttpError from 'http-errors';
import { DATA_SOURCE_TOKEN } from '../database/datasource';
import { Note } from './note.entity';
import { CreateNoteReqDTO } from './dtos/create-note-req.dto';
import { UpdateNoteReqDTO } from './dtos/update-note-req.dto';
import { NoteQueryDTO } from './dtos/note-query.dto';
import { PaginatedList } from '../shared/dtos/paginated-list.dto';

@Service()
export class NotesService {
  private readonly notesRepository: Repository<Note>;

  constructor(@Inject(DATA_SOURCE_TOKEN) readonly dataSource: DataSource) {
    this.notesRepository = dataSource.getRepository(Note);
  }

  async list(userId: number, filter: NoteQueryDTO): Promise<PaginatedList<Note>> {
    const condition: FindOptionsWhere<Note> = { userId };
    if (filter.title) {
      condition.title = Like(`%${filter.title}%`);
    }
    console.log(condition);

    const [notes, count] = await this.notesRepository.findAndCount({
      where: condition,
      take: filter.limit,
      skip: filter.limit * (filter.page - 1),
      order: { [filter.sortBy]: filter.sort },
    });

    const result = new PaginatedList<Note>(notes, count, filter.page, filter.limit);
    return result;
  }

  async getById(noteId: number): Promise<Note> {
    const note = await this.notesRepository.findOneBy({ id: noteId });
    if (!note) {
      throw new createHttpError.NotFound('Note not found');
    }

    return note;
  }

  async create(userId: number, data: CreateNoteReqDTO): Promise<Note> {
    const note = new Note({
      title: data.title,
      content: data.content,
      userId,
    });

    return this.notesRepository.save(note);
  }

  async update(userId: number, noteId: number, data: UpdateNoteReqDTO): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { id: noteId, userId } });
    if (!note) {
      throw new createHttpError.NotFound('Note not found');
    }

    note.title = data.title || note.title;
    note.content = data.content || note.content;

    return this.notesRepository.save(note);
  }

  async delete(userId: number, noteId: number): Promise<void> {
    await this.notesRepository.delete({ id: noteId, userId });
  }
}
