import React, { useState, useContext, useEffect } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/style/recipe/RecipeForm.css';
import axios from "../../utils/axios";

function RecipeForm() {
    const { createRecipe, updateRecipe, selectedRecipe, setSelectedRecipe } = useContext(RecipeContext);
    const { recipeIdx } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [calories, setCalories] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (recipeIdx) { // 레시피 수정 모드일 때
            setIsEditing(true);
            getRecipeById(recipeIdx);
        } else {
            // 레시피 작성 모드일 때 초기화
            setTitle('');
            setCookTime('');
            setCalories('');
            setIngredients('');
            setInstructions('');
            setImageUrl('');
            setIsEditing(false);
            setError(null);
        }
    }, [recipeIdx]);

    const getRecipeById = async (id) => {
        try {
            const response = await axios.get(`/api/recipes/${id}`);
            setSelectedRecipe(response.data);

            // 폼 필드 초기값 설정
            setTitle(response.data.title);
            setCookTime(response.data.cookTime);
            setCalories(response.data.calories);
            setIngredients(response.data.content.split('\n\n만드는 법:\n')[0].replace('재료:', '').trim());
            setInstructions(response.data.content.split('\n\n만드는 법:\n')[1]);
            setImageUrl(response.data.picture);
        } catch (error) {
            setError(error.message || '레시피 정보를 불러오는 중 오류가 발생했습니다.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 입력값 유효성 검사
        if (!title || !cookTime || !calories || !ingredients || !instructions) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        try {
            const newRecipe = {
                title,
                cookTime: parseInt(cookTime),
                calories: parseInt(calories),
                content: `재료: ${ingredients}\n\n만드는 법:\n${instructions}`,
                picture: imageUrl
            };

            if (isEditing) {
                await updateRecipe(recipeIdx, newRecipe);
                alert('레시피가 성공적으로 수정되었습니다.');
                navigate(`/recipe/${recipeIdx}`); // 수정 후 상세 페이지로 이동
            } else {
                await createRecipe(newRecipe);
                alert('레시피가 성공적으로 등록되었습니다.');
                navigate('/recipe'); // 등록 후 목록 페이지로 이동
            }
        } catch (error) {
            console.error('레시피 등록/수정 실패:', error);
            alert('레시피 등록/수정에 실패했습니다.');
        }
    };

    return (
        <div className="recipe-form-container">
            <h2>{isEditing ? '레시피 수정' : '레시피 등록'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="title">제목</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="form-field">
                    <label htmlFor="cookTime">조리 시간 (분)</label>
                    <input type="number" id="cookTime" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
                </div>
                <div className="form-field">
                    <label htmlFor="calories">칼로리 (kcal)</label>
                    <input type="number" id="calories" value={calories} onChange={(e) => setCalories(e.target.value)} />
                </div>
                <div className="form-field">
                    <label htmlFor="ingredients">재료 (쉼표로 구분)</label>
                    <textarea id="ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
                </div>
                <div className="form-field">
                    <label htmlFor="instructions">조리 방법</label>
                    <textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
                </div>
                <div className="form-field">
                    <label htmlFor="imageUrl">이미지 URL</label>
                    <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    {imageUrl && <img src={imageUrl} alt="레시피 이미지" className="recipe-image" />}
                </div>
                <button type="submit" className="submit-button">{isEditing ? '수정' : '등록'}</button>
            </form>
        </div>
    );
}

export default RecipeForm;
