import React from 'react';

interface TreeVisualizationProps {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
}

const TreeVisualizationNew: React.FC<TreeVisualizationProps> = ({ 
  balance, 
  income, 
  expenses, 
  savings 
}) => {
  // Calculate tree dimensions based on financial health
  const totalWealth = Math.max(0, balance + savings);
  const netIncome = Math.max(0, income - expenses);
  
  // Tree base dimensions (well-proportioned)
  const baseHeight = 400;
  const baseWidth = 500;
  
  // Trunk dimensions - grows with total wealth
  const trunkHeight = Math.max(80, Math.min(150, totalWealth / 2000 + 80));
  const trunkWidth = Math.max(25, Math.min(45, totalWealth / 5000 + 25));
  
  // Crown dimensions - grows with income
  const crownRadius = Math.max(60, Math.min(120, income / 1000 + 60));
  const crownHeight = crownRadius * 1.2;
  
  // Branch system - more branches with higher income
  const branchCount = Math.max(3, Math.min(8, Math.floor(income / 15000) + 3));
  
  // Leaflets - density based on income
  const leafletsPerBranch = Math.max(2, Math.min(8, Math.floor(netIncome / 8000) + 2));
  const totalLeaflets = branchCount * leafletsPerBranch;
  
  // Fruits - appear based on savings milestones
  const fruitThreshold = 25000; // ₹25,000 per fruit
  const fruitCount = Math.max(0, Math.min(15, Math.floor(savings / fruitThreshold)));
  
  // Tree health color
  const getHealthColor = () => {
    if (totalWealth > 200000) return '#22C55E'; // Excellent - bright green
    if (totalWealth > 100000) return '#65A30D'; // Good - lime green  
    if (totalWealth > 50000) return '#CA8A04'; // Growing - amber
    if (totalWealth > 0) return '#DC2626'; // Struggling - red
    return '#7F1D1D'; // Critical - dark red
  };

  const healthColor = getHealthColor();
  
  // Calculate positions
  const centerX = baseWidth / 2;
  const groundY = baseHeight - 20;
  const trunkTop = groundY - trunkHeight;
  const crownCenterY = trunkTop - crownHeight / 2;

  // Generate branch positions - starting from trunk and extending outward
  const branches = Array.from({ length: branchCount }, (_, i) => {
    const angle = (i * 360) / branchCount;
    const branchStartHeight = trunkTop + (trunkHeight * 0.2); // Start from upper part of trunk
    const branchLength = Math.max(40, Math.min(90, income / 1500 + 40));
    
    // Start from trunk edge
    const startX = centerX + Math.cos(angle * Math.PI / 180) * (trunkWidth / 2);
    const startY = branchStartHeight + (i * trunkHeight * 0.1); // Stagger branch heights
    
    // End extends outward into crown area
    const endX = centerX + Math.cos(angle * Math.PI / 180) * branchLength;
    const endY = startY - branchLength * 0.3; // Slight upward angle
    
    return { startX, startY, endX, endY, angle };
  });

  // Generate leaflet positions
  const leaflets: Array<{x: number, y: number, size: number, opacity: number}> = [];
  branches.forEach((branch) => {
    for (let j = 0; j < leafletsPerBranch; j++) {
      const progress = (j + 1) / (leafletsPerBranch + 1);
      const x = branch.startX + (branch.endX - branch.startX) * progress;
      const y = branch.startY + (branch.endY - branch.startY) * progress;
      
      // Add some randomness for natural look
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 15;
      
      leaflets.push({
        x: x + offsetX,
        y: y + offsetY,
        size: Math.random() * 4 + 3,
        opacity: 0.7 + Math.random() * 0.3
      });
    }
  });

  // Generate fruit positions
  const fruits = Array.from({ length: fruitCount }, (_, i) => {
    const angle = (i * 137.5) % 360; // Golden angle for natural distribution
    const radius = crownRadius * (0.4 + Math.random() * 0.3);
    const x = centerX + Math.cos(angle * Math.PI / 180) * radius;
    const y = crownCenterY + Math.sin(angle * Math.PI / 180) * radius * 0.7;
    
    return { x, y, size: 8 + Math.random() * 4 };
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-sky-100 to-green-50 rounded-2xl p-6">
      {/* Financial Stats */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold" style={{ color: healthColor }}>
          Your Money Tree
        </h2>
        <div className="text-sm text-gray-600 mt-1">
          Wealth: ₹{totalWealth.toLocaleString()} | Income: ₹{income.toLocaleString()} | Savings: ₹{savings.toLocaleString()}
        </div>
      </div>

      {/* Tree SVG */}
      <svg 
        width={baseWidth} 
        height={baseHeight} 
        className="transition-all duration-1000 drop-shadow-lg"
        viewBox={`0 0 ${baseWidth} ${baseHeight}`}
      >
        {/* Sky gradient background */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#98FB98" stopOpacity="0.1" />
          </linearGradient>
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        </defs>
        
        <rect width={baseWidth} height={baseHeight} fill="url(#skyGradient)" />

        {/* Ground */}
        <ellipse
          cx={centerX}
          cy={groundY + 10}
          rx={150}
          ry={20}
          fill="#8B7355"
          opacity={0.6}
        />
        <ellipse
          cx={centerX}
          cy={groundY + 5}
          rx={140}
          ry={15}
          fill="#A0522D"
          opacity={0.8}
        />

        {/* Tree Trunk */}
        <rect
          x={centerX - trunkWidth / 2}
          y={trunkTop}
          width={trunkWidth}
          height={trunkHeight}
          fill="#8B4513"
          rx={trunkWidth / 4}
          filter="url(#dropShadow)"
        />
        
        {/* Trunk texture lines */}
        {Array.from({ length: 3 }, (_, i) => (
          <line
            key={i}
            x1={centerX - trunkWidth / 3}
            y1={trunkTop + (i + 1) * trunkHeight / 4}
            x2={centerX + trunkWidth / 3}
            y2={trunkTop + (i + 1) * trunkHeight / 4}
            stroke="#654321"
            strokeWidth={1}
            opacity={0.5}
          />
        ))}

        {/* Main tree crown */}
        <circle
          cx={centerX}
          cy={crownCenterY}
          r={crownRadius}
          fill={healthColor}
          opacity={0.8}
          filter="url(#dropShadow)"
        />
        
        {/* Secondary crown layers for depth */}
        <circle
          cx={centerX - 15}
          cy={crownCenterY + 10}
          r={crownRadius * 0.7}
          fill={healthColor}
          opacity={0.6}
        />
        <circle
          cx={centerX + 20}
          cy={crownCenterY - 5}
          r={crownRadius * 0.6}
          fill={healthColor}
          opacity={0.7}
        />

        {/* Branches */}
        {branches.map((branch, i) => (
          <line
            key={`branch-${i}`}
            x1={branch.startX}
            y1={branch.startY}
            x2={branch.endX}
            y2={branch.endY}
            stroke="#8B4513"
            strokeWidth={Math.max(2, 6 - i * 0.5)}
            opacity={0.8}
          />
        ))}

        {/* Leaflets */}
        {leaflets.map((leaflet, i) => (
          <circle
            key={`leaflet-${i}`}
            cx={leaflet.x}
            cy={leaflet.y}
            r={leaflet.size}
            fill="#228B22"
            opacity={leaflet.opacity}
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.1}s`, animationDuration: '3s' }}
          />
        ))}

        {/* Fruits (savings rewards) */}
        {fruits.map((fruit, i) => (
          <g key={`fruit-${i}`}>
            <circle
              cx={fruit.x}
              cy={fruit.y}
              r={fruit.size}
              fill="#FF6347"
              opacity={0.9}
            />
            <circle
              cx={fruit.x - 2}
              cy={fruit.y - 2}
              r={fruit.size * 0.3}
              fill="#FF8C69"
              opacity={0.8}
            />
          </g>
        ))}

        {/* Tree health indicator text */}
        <text
          x={centerX}
          y={baseHeight - 5}
          textAnchor="middle"
          className="text-sm font-bold"
          fill={healthColor}
        >
          {totalWealth > 200000 ? "🌳 Thriving Wealth Tree!" : 
           totalWealth > 100000 ? "🌱 Growing Strong!" : 
           totalWealth > 50000 ? "🌿 Healthy Growth" : 
           totalWealth > 0 ? "🌱 Small Sapling" : "💀 Needs Nourishment"}
        </text>
      </svg>

      {/* Tree Growth Stats */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
        <div className="bg-green-100 rounded-lg p-2">
          <div className="font-bold text-green-800">{Math.round(crownRadius)}px</div>
          <div className="text-green-600">Crown Size</div>
        </div>
        <div className="bg-blue-100 rounded-lg p-2">
          <div className="font-bold text-blue-800">{totalLeaflets}</div>
          <div className="text-blue-600">Leaflets</div>
        </div>
        <div className="bg-red-100 rounded-lg p-2">
          <div className="font-bold text-red-800">{fruitCount}</div>
          <div className="text-red-600">Fruits</div>
        </div>
        <div className="bg-amber-100 rounded-lg p-2">
          <div className="font-bold text-amber-800">{branchCount}</div>
          <div className="text-amber-600">Branches</div>
        </div>
      </div>

      {/* Growth tips */}
      <div className="mt-3 text-xs text-center text-gray-500 max-w-md">
        {fruitCount === 0 ? 
          "💡 Save ₹25,000 to grow your first fruit! Fruits represent your savings milestones." :
        totalLeaflets < 20 ? 
          "💡 Increase your income to grow more leaflets on your tree branches!" :
          "🎉 Your money tree is flourishing! Keep growing your wealth!"
        }
      </div>
    </div>
  );
};

export default TreeVisualizationNew;

