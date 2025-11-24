import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-add-product.html',
  styleUrls: ['./admin-add-product.css'],
})
export class AdminAddProduct implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);

  productForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  imagePreview: string | ArrayBuffer | null = null;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['drink', Validators.required],
      price: [null, [Validators.required, Validators.min(0.5)]],
      status: [true],
      imageFile: [null, Validators.required],
    });
  }

  ngOnInit() {
    const user = this.authService.currentUser();
    if (!user || user.role !== 'ADMIN') {
      console.warn('Access Denied: Admin only');
      this.router.navigate(['/']);
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ imageFile: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formValue = this.productForm.value;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result as string;
      const productData = {
        name: formValue.name,
        description: formValue.description,
        price: formValue.price,
        category: formValue.category,
        status: formValue.status ? 'show' : 'hide',
        imageUrl: base64Image,
      };

      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Product added successfully!';
          this.productForm.reset({ category: 'drink', status: true });
          this.imagePreview = null;
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          console.error('Failed to create product', err);
          this.isLoading = false;
          this.errorMessage = 'Failed to add product. Is the backend running?';
        },
      });
    };

    reader.readAsDataURL(formValue.imageFile);
  }
}
