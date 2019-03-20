import {DOM} from "./base.js";

export const renderItem = item => {
    const markup = `
    <li class="shopping__item" data-itemid="${item.id}">
        <div class="shopping__count">
            <input class="shopping__count--value" type="number" value="${item.amount}" step="${item.amount}">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    `;

    DOM.shoppingList.insertAdjacentHTML("beforeend", markup);
}

export const deleteItem = id => {
    const listItem = document.querySelector(`[data-itemid="${id}"]`);
    listItem.parentElement.removeChild(listItem);
}