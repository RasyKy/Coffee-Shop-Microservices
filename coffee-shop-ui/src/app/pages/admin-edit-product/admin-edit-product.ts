import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-edit-product.html',
  styleUrls: ['./admin-edit-product.css'],
})
export class AdminEditProduct implements OnInit {
  editForm!: FormGroup;
  productId!: string;
  isLoading = true;
  isSubmitting = false;

  // Image handling
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  // FIX 1: Expanded arrays to catch lowercase/legacy data from DB
  categories = ['Drink', 'Pastry'];
  statuses = ['show', 'hide'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProduct();
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  loadProduct(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;

    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        // FIX 2: Handle data normalization if needed
        // If status is boolean true/false in DB, convert to string for dropdown
        let safeStatus = product.status;

        const patchData = {
          ...product,
          status: safeStatus,
        };

        this.editForm.patchValue(patchData);

        this.imagePreview = product.imageUrl;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.router.navigate(['/admin/products']);
      },
    });
  }
  // 1. FIX: Convert to Base64 IMMEDIATELY when file is picked
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Convert to Base64 right now
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;

        // Update Preview
        this.imagePreview = base64String;

        // CRITICAL FIX: Update the Form Control so it becomes VALID
        this.editForm.patchValue({ imageUrl: base64String });
        this.editForm.get('imageUrl')?.markAsDirty();
      };
      reader.readAsDataURL(file);
    }
  }

  // 2. FIX: Simplify Submit (since conversion is already done)
  onSubmit(): void {
    // Debugging loop
    if (this.editForm.invalid) {
      console.error('❌ FORM IS INVALID. See errors below:');
      Object.keys(this.editForm.controls).forEach((key) => {
        const controlErrors = this.editForm.get(key)?.errors;
        if (controlErrors) {
          console.error(`Field: "${key}" has errors:`, controlErrors);
        }
      });
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Just send the data (imageUrl is already inside editForm.value)
    const updatedProduct = this.editForm.value;

    this.productService.updateProduct(this.productId, updatedProduct).subscribe({
      next: () => {
        alert('Product updated successfully!');
        this.router.navigate(['/admin/products']);
      },
      error: (error) => {
        console.error('Error updating product:', error);
        alert('Failed to update product.');
        this.isSubmitting = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
