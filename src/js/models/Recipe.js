import axios from "axios";
import {PROXY, API_KEY} from "../config"

export default class Recipe {
    constructor (id) {
        this.id = id;
    }

    //https://www.food2fork.com/api/get?key=YOUR_API_KEY&rId=35382
    //*** Get Recipe Details ***//
    //    URL: https://www.food2fork.com/api/get
    //    
    //    //*** Request Parameters ***//
    //    key: API Key
    //    rId: Id of desired recipe as returned by Search Query
    async getDetails () {
        try {
            const result = await axios(`${PROXY}https://www.food2fork.com/api/get?key=${API_KEY}&rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
        } catch (error) {
            console.error(`Something went wrong. ${error}`);
        }
    }

    async getTestDetails () {
        const result = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const result = {"recipe": {"publisher": "Closet Cooking", "f2f_url": "http://food2fork.com/view/35477", "ingredients": ["4 ounces cream cheese, room temperature", "1/4 cup sour cream", "1/4 cup mayonnaise", "1/2 cup mozzarella, grated", "1/4 cup parmigiano reggiano (parmesan), grated", "1 cup pizza sauce", "1/2 cup mozzarella, shredded/grated", "1/4 cup parmigiano reggiano (parmesan), grated", "2 ounces pepperoni, sliced", "2 tablespoons green pepper, sliced", "2 tablespoons black olives, sliced", "10 4/5 grams Test Ingredient, very secret"], "source_url": "http://www.closetcooking.com/2011/03/pizza-dip.html", "recipe_id": "35477", "image_url": "http://static.food2fork.com/Pizza2BDip2B12B500c4c0a26c.jpg", "social_rank": 99.99999999999994, "publisher_url": "http://closetcooking.com", "title": "Pizza Dip"}};
                this.title = result.recipe.title;
                this.author = result.recipe.publisher;
                this.img = result.recipe.image_url;
                this.url = result.recipe.source_url;
                this.ingredients = result.recipe.ingredients;
                resolve(result);
            }, 1500);
        });
    }

    calcTime () {
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = periods * 15;
    }

    calcServings () {
        this.servings = 4;
    }

    parseIngredients () {
        const newIngredients = this.ingredients.map(item => {
            const unitConversions = {
                tablespoons: "tbsp",
                tablespoon: "tbsp",
                teaspoons: "tsp",
                teaspoon: "tsp",
                "fluid ounces": "oz",
                "fluid ounce": "oz",
                ounces: "oz",
                ounce: "oz",
                cups: "cup",
                pounds: "lbs",
                pound: "lbs"
            };
            const shortUnits = Object.values(unitConversions);
            const units = [...shortUnits, "g", "kg"];

            //Standardize units
            let ingredient = item.toLowerCase();
            Object.keys(unitConversions).forEach(unit => {
                ingredient = ingredient.replace(unit, unitConversions[unit]);
            });
            
            //Remove parenthesis
            ingredient = ingredient.replace(/\s*\([^)]*\)\s*/g, " ");

            //Format ingredients into amount, unit and ingredient
            const arrIngredient = ingredient.split(" ");
            const unitIdx = arrIngredient.findIndex(word => units.includes(word));

            let objIngredient;
            if (unitIdx > -1) {
                //There is a unit; assume anything before the unit is an amount
                //Ex. 4 1/2 cups, arrAmount is [4, 1/2]
                //Ex. 4 cups, arrAmount is [4]
                const arrAmount = arrIngredient.slice(0, unitIdx);
                let amount;
                if (arrAmount.length === 1) {
                    amount = eval(arrAmount[0].replace("-", "+"));
                } else {
                    amount = eval(arrAmount.join("+"));
                }

                objIngredient = {
                    amount,
                    unit: arrIngredient[unitIdx],
                    ingredient: arrIngredient.slice(unitIdx + 1).join(" ")
                };
            } else if (Number.parseInt(arrIngredient[0])) {
                //This is no unit, but the first position is an amount
                objIngredient = {
                    amount: Number.parseInt(arrIngredient[0]),
                    unit: "",
                    ingredient: arrIngredient.slice(1).join(" ")
                }
            } else if (unitIdx === -1) {
                //No unit and no amount in 1st position
                objIngredient = {
                    amount: 1,
                    unit: "",
                    ingredient
                }
            }

            return objIngredient;
        });

        this.ingredients = newIngredients;
    }

    updateServings (type) {
        //Servings
        const newServings = (type === "dec")? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(item => {
            item.amount *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}