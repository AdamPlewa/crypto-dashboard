import React from 'react';
import PlanCard from './PlanCard';

function PlanList({ plans, onBuy }) {
  return (
    <div className="plans-list">
      {plans.map(plan => (
        <PlanCard key={plan.id} plan={plan} onBuy={onBuy} />
      ))}
    </div>
  );
}

export default PlanList;