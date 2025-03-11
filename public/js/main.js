// Handle image preview for listing creation/edit
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.querySelector('input[type="file"][name="images"]');
    const previewContainer = document.getElementById('image-preview');

    if (imageInput && previewContainer) {
        imageInput.addEventListener('change', function() {
            previewContainer.innerHTML = '';
            
            [...this.files].forEach(file => {
                if (file) {
                    const reader = new FileReader();
                    const preview = document.createElement('div');
                    preview.className = 'preview-image-container mb-2';
                    
                    reader.onload = function(e) {
                        preview.innerHTML = `
                            <img src="${e.target.result}" class="img-thumbnail" style="max-height: 200px;">
                            <button type="button" class="btn btn-sm btn-danger remove-image">Remove</button>
                        `;
                    }
                    
                    reader.readAsDataURL(file);
                    previewContainer.appendChild(preview);
                }
            });
        });
    }

    // Handle remove image button clicks
    if (previewContainer) {
        previewContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-image')) {
                e.target.closest('.preview-image-container').remove();
            }
        });
    }
});

// Auto-dismiss alerts after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }, 5000);
    });
});

// Price formatting
document.addEventListener('DOMContentLoaded', function() {
    const priceInput = document.querySelector('input[name="price"]');
    if (priceInput) {
        priceInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d.]/g, '');
            if (value) {
                value = parseFloat(value).toFixed(2);
                e.target.value = value;
            }
        });
    }
});

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}); 