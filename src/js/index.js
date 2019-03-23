//models
import Search from "./models/Search.js";
import Recipe from "./models/Recipe";
import List from "./models/List";

//views
import {DOM, renderLoader, clearLoader} from "./views/base.js";
import * as searchView from "./views/searchView.js";
import * as recipeView from "./views/recipeView.js";
import * as listView from "./views/listView.js";

/** Global app controller
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const APP = {};
window.APP = APP;

//*** private functions ***//
  //* Search Controller *//
const runSearch = async () => {
    //1. Get query from the view
    const query = searchView.getInput();
    
    //2. New Search object and add to APP_STATE
    if (query) {
        APP.search = new Search(query);
        
        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearSearch();
        renderLoader(DOM.searchResult);
        
        try {
            //4. Search for recipes
            // await APP.search.getResult();
            await APP.search.getTestResult();
            
            //5. Render the results of the search
            clearLoader();
            searchView.renderSearch(APP.search.result);
        } catch (error) {
            clearLoader();
        }

    } else {
        console.log("No query entered.");
    }
};

  //* Recipe Controller *//
const updateRecipe = async () => {
    //Get recipe ID from URL
    console.log("Updating recipe...");
    const id = window.location.hash.replace("#", "");
    console.log(id);

    if (id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(DOM.recipe);
        
        //highlight selected search
        if (APP.search) searchView.highlighSelected(id);

        //Create new recipe object
        APP.recipe = new Recipe(id);

        try {
            //Get recipe data and reformat ingredients
            // await APP.recipe.getDetails();
            await APP.recipe.getTestDetails();
            APP.recipe.parseIngredients();

            //Calculate servings and time
            APP.recipe.calcTime();
            APP.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(APP.recipe);
        } catch (error) {
            clearLoader();
            console.error(`Error processing recipe! ---> ${error}`);
        }
    }
};

  //* Shopping List Controller *//
const updateShoppingList = () => {
    //Create a new List if none exists
    if (!APP.shoppingList) APP.shoppingList = new List();

    //Add each ingredient to the list
    APP.recipe.ingredients.forEach(ingredient => {
        const item = APP.shoppingList.addItem(ingredient.amount, ingredient.unit, ingredient.name);
        listView.renderItem(item);
    });
};

//Setup Event Listeners
window.addEventListener("hashchange", updateRecipe);
window.addEventListener("load", updateRecipe);

DOM.searchForm.addEventListener("submit", event => {
    event.preventDefault(); //prevent default behavior if this event isn't handled. (needed for async behavior)
    runSearch();
});

DOM.searchResultPages.addEventListener("click", event => {
    const btn = event.target.closest(".btn-inline");

    if (btn) {
        const goToPage = Number.parseInt(btn.dataset.goto, 10);

        searchView.clearSearch();
        searchView.renderSearch(APP.search.result, goToPage);
    }
});

DOM.recipe.addEventListener("click", event => {
    if (event.target.matches(".btn-decrease, .btn-decrease *") && APP.recipe.servings > 1) {
        APP.recipe.updateServings("dec");
        recipeView.updateServingsIngredients(APP.recipe);
    } else if (event.target.matches(".btn-increase, .btn-increase *")) {
        APP.recipe.updateServings("inc");
        recipeView.updateServingsIngredients(APP.recipe);
    } else if (event.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
        updateShoppingList();
    }
});

DOM.shoppingList.addEventListener("click", event => {
    const id = event.target.closest(".shopping__item").dataset.itemid;

    //Handle the delete button
    if (event.target.matches(".shopping__delete, .shopping__delete *")) {
        APP.shoppingList.deleteItem(id);
        listView.deleteItem(id);
    } 
    //Handle amount adjustments
    else if (event.target.matches(".shopping__count--value")) { 
        const value = Number.parseFloat(event.target.value);
        APP.shoppingList.updateAmount(id, value);
    }
});

console.log("Application started.");