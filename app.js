document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:5000/api/recipes';

    // Fetch and display recipes
    function fetchRecipes() {
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const tbody = document.querySelector('#recipe-table tbody');
          tbody.innerHTML = '';
          data.forEach(recipe => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${recipe.title}</td>
              <td>${recipe.ingredients}</td>
              <td>${recipe.instructions}</td>
              <td>${recipe.cookingTime}</td>
              <td>
                <button onclick="updateRecipe('${recipe._id}')">Update</button>
                <button onclick="deleteRecipe('${recipe._id}')">Delete</button>
              </td>
            `;
            tbody.appendChild(row);
          });
        })
        .catch(error => console.error('Error fetching recipes:', error));
    }

    // Add a new recipe
    document.querySelector('#add-recipe-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const title = document.querySelector('#title').value;
      const ingredients = document.querySelector('#ingredients').value;
      const instructions = document.querySelector('#instructions').value;
      const cookingTime = document.querySelector('#cookingTime').value;

      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, ingredients, instructions, cookingTime }),
      })
        .then(response => response.json())
        .then(data => {
          fetchRecipes(); // Refresh the table
        })
        .catch(error => console.error('Error adding recipe:', error));
    });

    // Update a recipe
    window.updateRecipe = function (id) {
      const title = prompt('Enter new title');
      const ingredients = prompt('Enter new ingredients');
      const instructions = prompt('Enter new instructions');
      const cookingTime = prompt('Enter new cooking time');

      fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, ingredients, instructions, cookingTime }),
      })
        .then(response => response.json())
        .then(data => {
          fetchRecipes(); // Refresh the table
        })
        .catch(error => console.error('Error updating recipe:', error));
    };

    // Delete a recipe
    window.deleteRecipe = function (id) {
      if (confirm('Are you sure you want to delete this recipe?')) {
        fetch(`${apiUrl}/${id}`, {
          method: 'DELETE',
        })
          .then(response => response.json())
          .then(data => {
            fetchRecipes(); // Refresh the table
          })
          .catch(error => console.error('Error deleting recipe:', error));
      }
    };

    // Initial fetch of recipes
    fetchRecipes();
  });
