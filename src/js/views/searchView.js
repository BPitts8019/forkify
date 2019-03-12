import {DOM} from "./base.js";

//private functions
const limitRecipeTitle = (title, limit = 17) => {
    const tempArr = [];

    if (title.length > limit) {
        title.split(" ").reduce((acc, curWord) => {
            let newLen = acc + curWord.length;
            if (newLen <= limit) {
                tempArr.push(curWord);
            }

            return newLen;
        }, 0);

        title = `${tempArr.join(" ")} ...`;
    }

    return title;
};
const renderRecipe = recipe => {
    const MARKUP = `
        <li title="${recipe.title}">
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    DOM.searchResultList.insertAdjacentHTML("beforeend", MARKUP);
};
// type: "prev" or "next"
const createButton = (page, type) => `
        <button class="btn-inline results__btn--${type}" data-goto="${(type === "prev")? page - 1 : page + 1}">
            <span>Page ${(type === "prev")? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${(type === "prev")? "left" : "right"}"></use>
            </svg>
        </button>
`;
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (pages > 1) {
        if (page === 1) {
            button = createButton(page, "next");
        } else if (page < pages) {
            button = `
                ${createButton(page, "prev")}
                ${createButton(page, "next")}
            `;
            
        } else if (page === pages) { 
            button = createButton(page, "prev");
        }
    }

    DOM.searchResultPages.insertAdjacentHTML("afterbegin", button);
};

//public functions
export const getInput = () => DOM.searchInput.value;
export const clearInput = () => {DOM.searchInput.value = "";};
export const renderSearch = (recipes, page = 1, resPerPage = 10) => {
    const start = (page-1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
};
export const clearSearch = () => {
    DOM.searchResultList.innerHTML = "";
    DOM.searchResultPages.innerHTML = ""
};
export const highlighSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll(".results__link--active"));
    resultsArr.forEach(item => {
        item.classList.remove("results__link--active");
    });

    document.querySelector(`a[href="#${id}"]`).classList.add("results__link--active");
}