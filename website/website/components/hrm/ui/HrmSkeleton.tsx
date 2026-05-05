import React from 'react';

type Props = {
  lines?: number;
};

const HrmSkeleton: React.FC<Props> = ({ lines = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-lg bg-slate-200/70 animate-pulse"
          style={{ width: `${70 + ((i * 17) % 30)}%` }}
        />
      ))}
    </div>
  );
};

export default HrmSkeleton;
