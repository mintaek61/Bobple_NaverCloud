import React, { useEffect, useState } from 'react';
import PageHeader from "../../components/layout/PageHeader";
import axios from '../../utils/axios';
import '../../assets/style/myPage/MyRecipe.css';
import RecipeCard from '../../pages/recipe/RecipeCard';

function MyRecipe() {
    const [myRecipes, setMyRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyRecipes = async () => {
            const token = localStorage.getItem("token");
            const userIdx = localStorage.getItem("userIdx");

            try {
                const response = await axios.get(`/api/recipes/user/${userIdx}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setMyRecipes(response.data);
            } catch (error) {
                setError(error.message || '작성한 레시피를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyRecipes();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="myRecipe-main">
            <PageHeader title="작성한 레시피" />
            <div className="recipe-list">
                {myRecipes.length > 0 ? (
                    myRecipes.map(recipe => (
                        <div key={recipe.recipeIdx} className="recipe-list-item">
                            <RecipeCard recipe={recipe} />
                        </div>
                    ))
                ) : (
                    <div className="no-recipes-message">작성한 레시피가 없습니다.</div>
                )}
            </div>
        </div>
    );
}

export default MyRecipe;
