// src/components/Recipe/LatestRecipeCard.jsx
import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import errorImage from '../../assets/images/error_image.jpg';
import {Calendar, DefaultUser, View} from "../../components/imgcomponents/ImgComponents";
import dayjs from "dayjs";
import RecipeContext from "./RecipeContext";

function LatestRecipeCard({ recipe }) {
    const { formatViewsCount } = useContext(RecipeContext);

    return (
        <div className="latest-recipe-card">
            <Link to={`/recipe/${recipe.recipeIdx}`}>
                <div className="recipe-card-image">
                    <img src={recipe.picture || '/images/default_recipe_image.jpg'} alt={recipe.title} onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = errorImage;
                    }}/>
                </div>
                <div className="recipe-card-content">
                    <h5>{recipe.title}</h5>
                    <p className="recipe-writer"><DefaultUser /> {recipe.nickname} | <Calendar /> {dayjs(recipe.createdAt).format('YYYY-MM-DD')} | <View/> {formatViewsCount(recipe.viewsCount)}</p>
                    <p className="description">{recipe.content}</p>
                </div>
            </Link>
        </div>
    );
}

export default LatestRecipeCard;
