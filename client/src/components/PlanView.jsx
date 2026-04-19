import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MealPickerModal from './MealPickerModal';
import ShoppingListModal from './ShoppingListModal';
import { addPlannedMeal, getPlannedMeals, removePlannedMeal } from '../api';
import { weekCost } from '../mealLibrary';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snack'];

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function nextDays(count) {
  const out = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push(d);
  }
  return out;
}

export default function PlanView({ calorieGoal, weeklyBudget }) {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [picker, setPicker] = useState(null); // { date, slot }
  const [loading, setLoading] = useState(true);
  const [shoppingOpen, setShoppingOpen] = useState(false);

  const days = useMemo(() => nextDays(7), []);
  const startIso = isoDate(days[0]);
  const endIso = isoDate(days[days.length - 1]);

  useEffect(() => {
    setLoading(true);
    getPlannedMeals(startIso, endIso)
      .then(setPlans)
      .catch((err) => console.error('Failed to load plans:', err))
      .finally(() => setLoading(false));
  }, [startIso, endIso]);

  function byDaySlot(dateIso, slot) {
    return plans.find((p) => p.date === dateIso && p.slot === slot);
  }

  function dayTotal(dateIso) {
    return plans
      .filter((p) => p.date === dateIso)
      .reduce((a, p) => a + (p.calories || 0), 0);
  }

  async function handlePick(meal) {
    if (!picker) return;
    const { date, slot } = picker;
    setPicker(null);
    try {
      const created = await addPlannedMeal({
        date,
        slot,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        libraryId: meal.id,
      });
      setPlans((prev) => [...prev, created]);
    } catch (err) {
      console.error('Failed to add planned meal:', err);
    }
  }

  async function handleRemove(planId) {
    try {
      await removePlannedMeal(planId);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (err) {
      console.error('Failed to remove planned meal:', err);
    }
  }

  const dayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    [],
  );

  const weekKcal = plans.reduce((a, p) => a + (p.calories || 0), 0);
  const weekCostUsd = weekCost(plans);
  const overBudget = weeklyBudget && weekCostUsd > weeklyBudget;

  return (
    <>
      <header className="view-header">
        <div className="eyebrow">{t('viewPlanEyebrow')}</div>
        <h1 className="view-title">{t('viewPlanTitle')}</h1>
      </header>

      <section className="section plan-section">
        <div className="plan-week-summary">
          <div className="plan-summary-tile">
            <div className="eyebrow">{t('planWeekKcal')}</div>
            <div className="plan-summary-value">{weekKcal.toLocaleString()}</div>
            <div className="kcal-label">
              {calorieGoal ? `of ${(calorieGoal * 7).toLocaleString()}` : 'kcal'}
            </div>
          </div>
          <div className={`plan-summary-tile${overBudget ? ' over' : ''}`}>
            <div className="eyebrow">{t('planWeekCost')}</div>
            <div className="plan-summary-value">${weekCostUsd.toFixed(2)}</div>
            <div className="kcal-label">
              {weeklyBudget ? `of $${weeklyBudget.toFixed(0)}` : 'USD'}
            </div>
          </div>
          <button
            type="button"
            className="plan-shopping-btn"
            onClick={() => setShoppingOpen(true)}
          >
            {t('planShoppingBtn')} →
          </button>
        </div>

        {loading && plans.length === 0 && (
          <div className="plan-loading">{t('loading')}</div>
        )}
        {days.map((d, i) => {
          const iso = isoDate(d);
          const total = dayTotal(iso);
          const overGoal = calorieGoal && total > calorieGoal;
          return (
            <div key={iso} className={`plan-day${i === 0 ? ' today' : ''}`}>
              <div className="plan-day-head">
                <div>
                  <div className="eyebrow">{i === 0 ? t('today') : ''}</div>
                  <div className="plan-day-label">{dayFormatter.format(d)}</div>
                </div>
                <div className={`plan-day-total${overGoal ? ' over' : ''}`}>
                  <div className="meal-kcal">{total.toLocaleString()}</div>
                  <div className="kcal-label">kcal</div>
                </div>
              </div>
              <div className="plan-slots">
                {SLOTS.map((slot) => {
                  const entry = byDaySlot(iso, slot);
                  return (
                    <div key={slot} className={`plan-slot${entry ? ' filled' : ''}`}>
                      <div className="plan-slot-label">{t(`slot_${slot}`)}</div>
                      {entry ? (
                        <div className="plan-slot-body">
                          <div className="plan-slot-name">{entry.name}</div>
                          <div className="plan-slot-meta">
                            {entry.calories} kcal
                          </div>
                          <button
                            type="button"
                            className="meal-delete"
                            onClick={() => handleRemove(entry.id)}
                            aria-label={t('remove')}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="plan-slot-add"
                          onClick={() => setPicker({ date: iso, slot })}
                        >
                          + {t('addMeal')}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      <MealPickerModal
        open={!!picker}
        defaultCategory={picker?.slot || 'breakfast'}
        onPick={handlePick}
        onClose={() => setPicker(null)}
      />

      <ShoppingListModal
        open={shoppingOpen}
        plannedMeals={plans}
        onClose={() => setShoppingOpen(false)}
      />
    </>
  );
}
