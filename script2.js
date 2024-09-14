const categories = document.getElementById('categories');
const categorySelect = document.getElementById('category');  // Select element for categories
const recipes = document.getElementById('recipes');
const addRecipeForm = document.getElementById('add-recipe-form');
const successMessage = document.getElementById('success-message');

// Initialize categories and recipes arrays, with localStorage persistence
let categoriesArray = JSON.parse(localStorage.getItem('categories')) || ['Breakfast', 'Lunch', 'Dinner', 'Desserts'];
let recipesArray = JSON.parse(localStorage.getItem('recipes')) || [];

// Function to generate categories for the dropdown only
function generateCategories() {
    const categoryOptionsHtml = categoriesArray.map(category => {
        return `<option value="${category}">${category}</option>`;
    }).join('');
    categorySelect.innerHTML = categoryOptionsHtml;
}

// Function to generate recipes
function generateRecipes(category = 'All') {
    const filteredRecipes = category === 'All' ? recipesArray : recipesArray.filter(recipe => recipe.category === category);
    const recipesHtml = filteredRecipes.map((recipe, index) => {
        return `<article data-index="${index}">
            <h3>${recipe.name}</h3>
            <p><strong>Category:</strong> ${recipe.category}</p>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Steps:</strong> ${recipe.steps}</p>
            <p><strong>Notes:</strong> ${recipe.notes}</p>
            <button class="edit-recipe">Edit</button>
            <button class="delete-recipe">Delete</button>
        </article>`;
    }).join('');
    recipes.innerHTML = recipesHtml;
}

// Function to display success message
function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 3000); // Hide after 3 seconds
}

// Function to add a new recipe
addRecipeForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const newRecipe = {
        name: document.getElementById('recipe-name').value.trim(),
        category: document.getElementById('category').value,
        ingredients: document.getElementById('ingredients').value.trim(),
        steps: document.getElementById('steps').value.trim(),
        notes: document.getElementById('notes').value.trim()
    };

    if (validateRecipe(newRecipe)) {
        recipesArray.push(newRecipe);
        localStorage.setItem('recipes', JSON.stringify(recipesArray));
        generateRecipes();
        addRecipeForm.reset();
        showSuccessMessage('Recipe added successfully!');
    } else {
        alert('Please fill out all required fields.');
    }
});

// Function to validate recipe input
function validateRecipe(recipe) {
    return recipe.name && recipe.category && recipe.ingredients && recipe.steps;
}

// Function to edit a recipe
recipes.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-recipe')) {
        const index = event.target.closest('article').dataset.index;
        const recipe = recipesArray[index];
        
        document.getElementById('recipe-name').value = recipe.name;
        document.getElementById('category').value = recipe.category;
        document.getElementById('ingredients').value = recipe.ingredients;
        document.getElementById('steps').value = recipe.steps;
        document.getElementById('notes').value = recipe.notes;
        
        recipesArray.splice(index, 1);  // Remove the old recipe
        localStorage.setItem('recipes', JSON.stringify(recipesArray));
        generateRecipes();
    }
});

// Function to delete a recipe
recipes.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-recipe')) {
        const index = event.target.closest('article').dataset.index;
        recipesArray.splice(index, 1);  // Remove the recipe
        localStorage.setItem('recipes', JSON.stringify(recipesArray));
        generateRecipes();
    }
});

// Initialize the application
generateCategories();
generateRecipes();

// Add event listener to category links
categories.addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
        const category = event.target.textContent;
        generateRecipes(category);
    }
});