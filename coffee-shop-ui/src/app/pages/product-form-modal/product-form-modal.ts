import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form-modal.html',
})
export class ProductFormModal implements OnInit {
  @Input() product: Product | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  productForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;
  categories = ['Drink', 'Pastry', 'Food'];

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      category: ['Drink', Validators.required],
      price: [0, [Validators.required, Validators.min(0.1)]],
      active: [true],
      image: [null], // Initialize as null
    });

    if (this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        category: this.product.category,
        active: this.product.active ?? true,
      });
      if (this.product.imageUrl) {
        this.imagePreview = this.product.imageUrl;
      }
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Store the FILE OBJECT in the form
      this.productForm.patchValue({ image: file });
      this.productForm.get('image')?.updateValueAndValidity();

      // Create preview for UI
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      // Emit the raw form values (contains the File object)
      this.save.emit({
        ...this.productForm.value,
        id: this.product?.id,
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
