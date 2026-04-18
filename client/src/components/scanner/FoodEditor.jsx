import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function FoodEditor({ result, onSave, onCancel }) {
  const { t } = useTranslation();
  const [name, setName] = useState(result.name || '');
  const [calories, setCalories] = useState(result.calories || 0);
  const [protein, setProtein] = useState(result.protein || 0);
  const [carbs, setCarbs] = useState(result.carbs || 0);
  const [fat, setFat] = useState(result.fat || 0);
  const [servingSize, setServingSize] = useState(result.servingSize || '');

  function handleSave() {
    onSave({
      ...result,
      name,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      servingSize,
    });
  }

  return (
    <div className="food-editor">
      <h3 className="editor-title">{t('editFood')}</h3>

      <div className="editor-field">
        <label htmlFor="food-name">{t('foodName')}</label>
        <input
          id="food-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="editor-field">
        <label htmlFor="food-calories">{t('calories')}</label>
        <input
          id="food-calories"
          type="number"
          min="0"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />
      </div>

      <div className="editor-row">
        <div className="editor-field">
          <label htmlFor="food-protein">{t('protein')}</label>
          <input
            id="food-protein"
            type="number"
            min="0"
            step="0.1"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
        </div>
        <div className="editor-field">
          <label htmlFor="food-carbs">{t('carbs')}</label>
          <input
            id="food-carbs"
            type="number"
            min="0"
            step="0.1"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
        </div>
        <div className="editor-field">
          <label htmlFor="food-fat">{t('fat')}</label>
          <input
            id="food-fat"
            type="number"
            min="0"
            step="0.1"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
          />
        </div>
      </div>

      <div className="editor-field">
        <label htmlFor="food-serving">{t('serving')}</label>
        <input
          id="food-serving"
          type="text"
          value={servingSize}
          onChange={(e) => setServingSize(e.target.value)}
        />
      </div>

      <div className="editor-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          {t('cancel')}
        </button>
        <button type="button" className="btn-primary" onClick={handleSave}>
          {t('save')}
        </button>
      </div>
    </div>
  );
}
