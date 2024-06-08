import { Component } from '@angular/core';
import { NoteService, Note } from '../service/note.service';
import { MatDialog } from '@angular/material/dialog';
import { NoteCreateComponent } from '../note-create/note-create.component';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})
export class NoteListComponent {

  unarchivedNotes: Note[] = [];
  archivedNotes:Note[] = [];

  isShowingUnarchivedNotes:boolean = true;

  constructor(
    private noteService: NoteService,
    private _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadUnarchivedNotes();
  }

  showUnarchivedNotes():void{
    this.isShowingUnarchivedNotes = true;
    this.loadUnarchivedNotes();
  }

  showArchivedNotes(): void {
    this.isShowingUnarchivedNotes = false;
    this.loadArchivedNotes();
  }

  createNote(data: any = null): void {
    //TODO: open a modal to create a note
    this._matDialog.open(NoteCreateComponent, {
      data: data
    }).afterClosed().subscribe({
      next:(data)=>{
        this.loadUnarchivedNotes();
      }
    });
  }

  editNote(note: Note): void { }
  deleteNote(id: number): void { }
  archiveNote(id: number): void {
    this.noteService.archiveNoteById(id).subscribe({
      next: (data) => {
        this.loadUnarchivedNotes();
      },
      error: (e) => {
        console.error(`NoteListComponent::archiveNote ~ Error: `, e);
      }
    });
  }

  unarchiveNote(id: number): void {
    this.noteService.unarchiveNoteById(id).subscribe({
      next: (data) => {
        this.loadArchivedNotes();
      },
      error: (e) => {
        console.error(`NoteListComponent::unarchiveNote ~ Error: `, e);
      }
    });
  }

  private loadUnarchivedNotes(): void {
    this.noteService
      .getUnarchivedNotes()
      .subscribe({
        next: (data) => {
          this.unarchivedNotes = data;
          console.info('Notes listed correctly.');
          console.info(`Notes: `,this.unarchivedNotes);
        },
        error: (e) => {
          console.error(`NoteListComponent::getUnarchivedNotes ~ Error:`, e);
        }
      });
  }

  private loadArchivedNotes():void{
    this.noteService.getArchivedNotes().subscribe({
      next: (data)=>{
        this.archivedNotes = data;
      },
      error: (e)=>{
        console.error(`NoteListComponent::loadArchivedNotes ~ Error: `,e);
      }
    });
  }
}
