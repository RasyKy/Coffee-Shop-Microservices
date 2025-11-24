import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

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

  categories = ['Coffee', 'Tea', 'Pastry', 'Breakfast', 'Merchandise'];
  statuses = ['ACTIVE', 'INACTIVE'];

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
      imageUrl: ['', [Validators.required]], // This holds the Base64 string
      status: ['', [Validators.required]],
    });
  }

  loadProduct(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;

    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        // Map backend 'show'/'hide' if necessary, or just use as is
        // Assuming backend returns exactly what matches our form now
        this.editForm.patchValue(product);
        
        // Set the preview to the existing image from DB
        this.imagePreview = product.imageUrl; 
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.router.navigate(['/']); 
      }
    });
  }

  // TRIGGERED WHEN USER SELECTS A NEW FILE
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // LOGIC: Did the user pick a NEW file?
    if (this.selectedFile) {
      // Yes: Convert new file to Base64 -> Update Form -> Send to Backend
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        
        // Update the form control with the new string
        this.editForm.patchValue({ imageUrl: base64String });
        
        // Now send to backend
        this.sendDataToBackend();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      // No: User kept the old image. Just send existing form data.
      this.sendDataToBackend();
    }
  }

  private sendDataToBackend() {
    const updatedProduct = this.editForm.value;

    this.productService.updateProduct(this.productId, updatedProduct).subscribe({
      next: () => {
        alert('Product updated successfully!');
        this.router.navigate(['/menu']); // Or wherever you want to go
      },
      error: (error) => {
        console.error('Error updating product:', error);
        alert('Failed to update product.');
        this.isSubmitting = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/menu']);
  }
}