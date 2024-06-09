import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  optionDialog:string = "Create";

  myForm = this.formBuilder.group({
    note_title: ['', [Validators.required]],
    note_content: ['', [Validators.required]],
    categories: this.formBuilder.array([], this.atLeastOneSelectedValidator()) // FormArray para categorías seleccionadas
  });

  constructor(
    private formBuilder: FormBuilder,
    private noteService:NoteService,
    private categoryService:CategoryService,
    public matDialogRef:MatDialogRef<NoteCreateComponent>,
    @Inject(MAT_DIALOG_DATA) private data:Note
  ){}

  ngOnInit(): void {
    if (this.data) {
      this.optionDialog = "Update";
      this.myForm.patchValue({
        note_title: this.data.title,
        note_content: this.data.content
      });

      // Inicializa el FormArray con los IDs de las categorías seleccionadas
      if (this.data.categories) {
        const categoryIds = this.data.categories.map(category => category.id).filter((id): id is number => id !== undefined);
        this.setCategories(categoryIds);
      }
    }

    this.categoryService.getCategories().subscribe({
      next:(data)=>{
        this.categories = data;
      },
      error:(e)=>{
        console.error(`NoteCreateComponent::getCategories ~ Error:`,e);
      }
    });
  }
  modifyNote():void{
    if(this.data){
      this.updateNote();
    }else{
      this.createNote();
    }
  }
  createNote():void{
    const note:NoteRequest = {
      title: this.myForm.value.note_title!,
      content: this.myForm.value.note_content!,
      categoryIds: (this.myForm.get('categories') as FormArray).controls.map(control => control.value)
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

  updateNote():void{
    const note:NoteRequest = {
      id: this.data.id,
      title:this.myForm.value.note_title!,
      content:this.myForm.value.note_content!,
      categoryIds: (this.myForm.get('categories') as FormArray).controls.map(control => control.value),
    }
    this.noteService.updateNote(note).subscribe({
      next: (data)=>{
        console.info(`Note was update successfully`,data);
        this.closeDialog();
      },
      error: (e)=>{
        console.error(`NoteCreateComponent::updateNote ~ Error:`,e);
      }
    })
  }

  setCategories(categoryIds: number[]) {
    const categoryFormArray = this.myForm.get('categories') as FormArray;
    categoryFormArray.clear();
    categoryIds.forEach(id => categoryFormArray.push(new FormControl(id)));
  }

  isCategorySelected(id: number): boolean {
    return (this.myForm.get('categories') as FormArray).value.includes(id);
  }

  onCheckboxChange(event: any) {
    const categoryFormArray = this.myForm.get('categories') as FormArray;
    if (event.target.checked) {
      categoryFormArray.push(new FormControl(event.target.value));
    } else {
      const index = categoryFormArray.controls.findIndex(x => x.value === event.target.value);
      categoryFormArray.removeAt(index);
    }
  }

  closeDialog() {
    this.matDialogRef.close()
  }

  atLeastOneSelectedValidator(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      const selectedCount = (formArray as FormArray).controls.length;
      return selectedCount > 0 ? null : { required: true };
    };
  }
}
