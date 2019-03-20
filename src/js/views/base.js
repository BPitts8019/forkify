export const DOM = {
    searchForm: document.querySelector(".search"),
    searchInput: document.querySelector(".search__field"),
    searchResult: document.querySelector(".results"),
    searchResultList: document.querySelector(".results__list"),
    searchResultPages: document.querySelector(".results__pages"),
    recipe: document.querySelector(".recipe"),
    shoppingList: document.querySelector(".shopping__list")
};

export const domStrings = {
    loader: "loader"
};

export const renderLoader = parent => {
    const loader = `
        <div class="${domStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

    parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${domStrings.loader}`);

    if (loader) {
        loader.parentElement.removeChild(loader);
    }
};