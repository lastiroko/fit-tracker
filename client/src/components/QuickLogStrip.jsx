import { useTranslation } from 'react-i18next';

const SUGGESTED_SNACKS = [
  { key: 'coffee', name: 'Coffee', calories: 5, protein: 0, carbs: 1, fat: 0, servingSize: '1 cup', novaGroup: 1, bg: 'cream' },
  { key: 'banana', name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, servingSize: '1 medium', nutriScore: 'a', novaGroup: 1, bg: 'butter' },
  { key: 'apple', name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0, servingSize: '1 medium', nutriScore: 'a', novaGroup: 1, bg: 'mint' },
  { key: 'yogurt', name: 'Yogurt', calories: 150, protein: 12, carbs: 20, fat: 4, servingSize: '1 cup', nutriScore: 'b', novaGroup: 2, bg: 'sky' },
  { key: 'proteinBar', name: 'Protein bar', calories: 220, protein: 20, carbs: 25, fat: 8, servingSize: '1 bar', nutriScore: 'c', novaGroup: 4, bg: 'coral' },
  { key: 'almonds', name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, servingSize: '1 oz', nutriScore: 'b', novaGroup: 1, bg: 'lavender' },
];

function toScanResult(item) {
  return {
    name: item.name,
    brand: item.brand ?? null,
    calories: item.calories,
    protein: item.protein,
    carbs: item.carbs,
    fat: item.fat,
    servingSize: item.servingSize,
    confidence: 1.0,
    source: 'favorite',
    nutriScore: item.nutriScore ?? null,
    novaGroup: item.novaGroup ?? null,
  };
}

const FAVORITE_BGS = ['butter', 'mint', 'coral', 'sky', 'lavender', 'cream'];

export default function QuickLogStrip({ favorites = [], onQuickLog, onRemoveFavorite }) {
  const { t } = useTranslation();

  const suggestions = SUGGESTED_SNACKS;
  const favTiles = favorites.map((fav, i) => ({
    key: `fav-${fav.id}`,
    name: fav.name,
    calories: fav.calories,
    protein: fav.protein,
    carbs: fav.carbs,
    fat: fav.fat,
    servingSize: fav.servingSize,
    nutriScore: fav.nutriScore,
    novaGroup: fav.novaGroup,
    bg: FAVORITE_BGS[i % FAVORITE_BGS.length],
    favoriteId: fav.id,
  }));

  const tiles = [...favTiles, ...suggestions];

  if (tiles.length === 0) return null;

  return (
    <section className="section quicklog">
      <div className="section-head">
        <h2 className="section-title">{t('quickLogTitle')}</h2>
        <div className="eyebrow" style={{ opacity: 0.7 }}>{t('quickLogHint')}</div>
      </div>
      <div className="quicklog-strip">
        {tiles.map((tile) => (
          <button
            key={tile.key}
            type="button"
            className="quicklog-tile"
            style={{ '--tile-bg': `var(--${tile.bg})` }}
            onClick={() => onQuickLog(toScanResult(tile))}
          >
            <div className="quicklog-kcal">{tile.calories}</div>
            <div className="quicklog-name">{tile.name}</div>
            <div className="kcal-label" style={{ opacity: 0.7 }}>kcal</div>
            {tile.favoriteId && onRemoveFavorite && (
              <span
                role="button"
                tabIndex={0}
                className="quicklog-remove"
                aria-label="Remove favorite"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(tile.favoriteId);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    onRemoveFavorite(tile.favoriteId);
                  }
                }}
              >
                ×
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
