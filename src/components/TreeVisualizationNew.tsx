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
  
  // Tree base dimensions (adjusted to show full tree)
  const baseHeight = 280;
  const baseWidth = 350;
  
  // Trunk dimensions - grows with total wealth
  const trunkHeight = Math.max(60, Math.min(100, totalWealth / 2000 + 60));
  const trunkWidth = Math.max(25, Math.min(45, totalWealth / 5000 + 25));
  
  // Crown dimensions - grows with income (reduced to fit better)
  const crownRadius = Math.max(45, Math.min(80, income / 1500 + 45));
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
  
  // Calculate positions with proper spacing from top
  const centerX = baseWidth / 2;
  const groundY = baseHeight - 30;
  const trunkTop = groundY - trunkHeight;
  const crownCenterY = Math.max(crownRadius + 20, trunkTop - crownRadius);

  // Generate branch positions - starting from trunk and extending outward
  const branches = Array.from({ length: branchCount }, (_, i) => {
    const angle = (i * 360) / branchCount;
    const branchStartHeight = trunkTop + (trunkHeight * 0.3); // Start from upper part of trunk
    const branchLength = Math.max(35, Math.min(65, income / 2000 + 35)); // Reduced length to fit
    
    // Start from trunk edge
    const startX = centerX + Math.cos(angle * Math.PI / 180) * (trunkWidth / 2);
    const startY = branchStartHeight + (i * trunkHeight * 0.08); // Stagger branch heights
    
    // End extends outward but stays within bounds
    const endX = centerX + Math.cos(angle * Math.PI / 180) * branchLength;
    const endY = Math.max(crownRadius + 25, startY - branchLength * 0.25); // Keep above minimum height
    
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
    <div 
      className="bg-gradient-to-b from-sky-100 to-green-50 rounded-xl" 
      style={{ 
        margin: 0, 
        padding: '2px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Compact Financial Stats */}
      <div style={{ margin: 0, padding: '2px', textAlign: 'center' }}>
        <h2 style={{ 
          color: healthColor, 
          margin: 0, 
          padding: 0, 
          fontSize: '16px',
          fontWeight: 'bold',
          lineHeight: '1.2' 
        }}>
          Your Money Tree
        </h2>
        <div style={{ 
          margin: 0, 
          padding: 0, 
          fontSize: '11px',
          color: '#6b7280',
          lineHeight: '1.1' 
        }}>
          Wealth: ₹{totalWealth.toLocaleString()} | Income: ₹{income.toLocaleString()} | Savings: ₹{savings.toLocaleString()}
        </div>
      </div>

      {/* Tree SVG */}
      <svg 
        width={baseWidth} 
        height={baseHeight} 
        className="transition-all duration-1000 drop-shadow-lg"
        viewBox={`0 0 ${baseWidth} ${baseHeight}`}
        style={{ margin: 0, padding: 0, display: 'block' }}
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
          cy={groundY + 8}
          rx={120}
          ry={15}
          fill="#8B7355"
          opacity={0.6}
        />
        <ellipse
          cx={centerX}
          cy={groundY + 5}
          rx={110}
          ry={12}
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
          y={baseHeight - 8}
          textAnchor="middle"
          className="text-xs font-bold"
          fill={healthColor}
        >
          {totalWealth > 200000 ? "🌳 Thriving!" : 
           totalWealth > 100000 ? "🌱 Growing!" : 
           totalWealth > 50000 ? "🌿 Healthy" : 
           totalWealth > 0 ? "🌱 Small" : "💀 Needs Care"}
        </text>
      </svg>

      {/* Compact Tree Growth Stats */}
      <div className="grid grid-cols-4 gap-0 text-center text-xs" style={{ margin: 0, padding: 0 }}>
        <div className="bg-green-100 rounded-sm px-1 py-0.5">
          <div className="font-bold text-green-800 text-xs">{Math.round(crownRadius)}</div>
          <div className="text-green-600 text-xs">Crown</div>
        </div>
        <div className="bg-blue-100 rounded-sm px-1 py-0.5">
          <div className="font-bold text-blue-800 text-xs">{totalLeaflets}</div>
          <div className="text-blue-600 text-xs">Leaves</div>
        </div>
        <div className="bg-red-100 rounded-sm px-1 py-0.5">
          <div className="font-bold text-red-800 text-xs">{fruitCount}</div>
          <div className="text-red-600 text-xs">Fruits</div>
        </div>
        <div className="bg-amber-100 rounded-sm px-1 py-0.5">
          <div className="font-bold text-amber-800 text-xs">{branchCount}</div>
          <div className="text-amber-600 text-xs">Branch</div>
        </div>
      </div>

      {/* Compact Growth tip */}
      <div className="text-xs text-center text-gray-500" style={{ margin: 0, padding: '2px' }}>
        {fruitCount === 0 ? 
          "💡 Save ₹25K for first fruit!" :
        totalLeaflets < 20 ? 
          "💡 Boost income for more leaves!" :
          "🎉 Tree is flourishing!"
        }
      </div>
    </div>
  );
};

export default TreeVisualizationNew;

