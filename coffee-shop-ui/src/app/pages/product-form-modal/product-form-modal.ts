import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
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

  productForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitting = false;

  categories = ['Drink', 'Pastry'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();

    if (this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        category: this.product.category,
        active: this.product.active ?? false,
      });

      if (this.product.imageUrl) {
        this.imagePreview = this.product.imageUrl;
      }
    }
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['Drink', Validators.required],
      price: [0, [Validators.required, Validators.min(0.1)]],
      active: [true],
      // No Validators.required here, so it is OPTIONAL
      image: [null],
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ image: file });
      this.productForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      this.save.emit({
        ...this.productForm.value,
        id: this.product?.id,
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
