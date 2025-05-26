import React from 'react';

function PlanCard({ plan, onBuy }) {
  return (
    <div className="plan-card">
      <h2>{plan.name}</h2>
      <p><b>{plan.price} zł</b> / {plan.duration} dni</p>
      <ul>
        {plan.features.map(f => <li key={f}>{f}</li>)}
      </ul>
      <button className="primary-btn" onClick={() => onBuy(plan)}>
        Kup
      </button>
    </div>
  );
}

export default PlanCard;