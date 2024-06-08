import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Note, NoteRequest, NoteService } from '../service/note.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Category, CategoryService } from '../service/category.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-note-create',
  templateUrl: './note-create.component.html',
  styleUrl: './note-create.component.css'
})
export class NoteCreateComponent implements OnInit{

  categories:Category[]=[];
  categoriesSelected:number[]=[];

  myForm: FormGroup = this.formBuilder.group({
    note_title: ['', [Validators.required]],
    note_content: ['',[Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private noteService:NoteService,
    private categoryService:CategoryService,
    public matDialogRef:MatDialogRef<NoteCreateComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any
  ){}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next:(data)=>{
        this.categories = data;
      },
      error:(e)=>{
        console.error(`NoteCreateComponent::getCategories ~ Error:`,e);
      }
    });
  }

  createNote():void{
    const note:NoteRequest = {
      title:this.myForm.value.note_title,
      content: this.myForm.value.note_content,
      categoryIds: this.categoriesSelected
    };
    this.noteService.createNote(note).subscribe({
      next:(data)=>{
        console.info(`Note was create successfully`,data);
        this.closeDialog();
      },
      error: (e)=>{
        console.error(`NoteCreateComponent::createNote ~ Error:`,e);
      }
    })
  }

  onCheckboxChange(e:any) {
    const value = parseInt(e.target.value); // Convertir el valor a número
    if (e.target.checked) {
      this.categoriesSelected.push(value);
    } else {
      const index = this.categoriesSelected.indexOf(value);
      if (index !== -1) {
        this.categoriesSelected.splice(index, 1);
      }
    }

    console.info(`Categories selected: `,this.categoriesSelected);
  }

  closeDialog() {
    this.matDialogRef.close()
  }
}
