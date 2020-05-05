import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  imageURL: string;
  uploadForm: FormGroup;

  constructor(
    public authService: AuthService, public fb: FormBuilder
  ) { 
    this.uploadForm = this.fb.group({
      avatar: [null],
      name: ['']
    })
    
  }

  ngOnInit(): void {}
  // Image Preview
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.uploadForm.patchValue({
      avatar: file
    });
    this.uploadForm.get('avatar').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  // Submit Form
  submit() {
    console.log(this.uploadForm.value)
  }
  

}
