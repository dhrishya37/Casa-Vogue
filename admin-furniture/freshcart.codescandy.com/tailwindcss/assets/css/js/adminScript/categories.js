function openCategoryModal() {
    var myModal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
    myModal.show();
  }

  document.getElementById('submitCategoryForm').addEventListener('click',async function(e) {
    e.preventDefault();
    document.getElementById('submitCategoryForm').addEventListener('click', async function(e) {
      e.preventDefault();
  
      const categoryName = document.getElementById('categoryName').value;
      const categoryDescription = document.getElementById('categoryDescription').value;
      const categoryImage = document.getElementById('category-img').files[0];
  
      if (categoryName && categoryDescription && categoryImage) {
          // Prepare FormData
          const formData = new FormData();
          formData.append('categoryName', categoryName); // Add text data
          formData.append('categoryDescription', categoryDescription); // Add text data
          formData.append('categoryImage', categoryImage); // Add the image file
  
          try {
              const response = await fetch("/admin/categories/addCategories", {
                  method: "POST",
                  body: formData, // Send FormData, NOT JSON
              });
  
              const data = await response.json();
              if(data){
                setTimeout(()=>{
                  categoryAddedNotification(data.message)
                },1000)
              }
             
             
              window.reload()
          } catch (error) {
              console.error("Error inserting category:", error);
          }
  
          // Close the modal after form submission
          var myModal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
          myModal.hide();
  
          // Optionally, reset the form
          document.getElementById('categoryForm').reset();
      } else {
          alert('Please fill in all fields.');
      }
    })  });
  
    async function categoryAddedNotification(title){
      Swal.fire({
        title: title,
        icon: "success"
      });
    }
    
    