import StatisticsCard5 from './statistics-card-5';
import StatisticsCard2 from './statistics-card-2';

export default function CombinedStatistics() {
  return (
    <div className="grid grid-cols-6 gap-6 mb-8 items-stretch">
      {/* Balance Card - Takes 3 columns */}
      <div className="col-span-3 h-full">
        <StatisticsCard5 />
      </div>
      
      {/* Individual KPIs - Each takes 1 column */}
      <div className="col-span-3 h-full">
        <StatisticsCard2 />
      </div>
    </div>
  );
}