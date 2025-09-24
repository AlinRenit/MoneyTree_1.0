
import React, { useState } from "react";
import Login from "./Login";
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [username, setUsername] = useState("");

if (!isAuthenticated) {
  return <Login onLogin={name => { setIsAuthenticated(true); setUsername(name); }} />;
}
function Tree() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [money, setMoney] = useState(50);
  const [savings, setSavings] = useState(10);
  const [spent, setSpent] = useState(0);

  // Leaves grow with money, decrease with spent
  const leaves = Math.max(0, Math.floor((money - spent) / 5));
  // Fruits grow with savings, but only if savings > 0
  const fruits = savings > 0 ? Math.floor(savings / 10) : 0;
  // Health decreases with spending
  const health = Math.max(0, 100 - spent);

  // Generate leaf positions (spread around canopy)
  const leafPositions = Array.from({ length: leaves }, (_, i) => ({
    x: 200 + 80 * Math.cos((i / leaves) * Math.PI * 2),
    y: 180 + 60 * Math.sin((i / leaves) * Math.PI * 2),
    rotate: Math.random() * 360,
  }));

  // Fixed fruit positions (coins hanging on branches)
  const fixedFruitPositions = [
    { x: 170, y: 120 },
    { x: 230, y: 120 },
    { x: 200, y: 90 },
    { x: 185, y: 150 },
    { x: 215, y: 150 },
  ];

  // Falling leaves if no savings or expenses > money
  const showFallingLeaves = savings === 0 || spent > money;
  const fallingLeaves = showFallingLeaves
    ? Array.from({ length: 8 }, (_, i) => ({
        x: 80 + i * 35,
        y: 470 + Math.random() * 10,
        rotate: Math.random() * 360,
      }))
    : [];

  // Fruit click handler
  const handleFruitClick = () => {
    alert(`Savings: $${savings}`);
  };

  return (
    <div style={{ textAlign: "center", background: "#4fc3f7", minHeight: "100vh", paddingTop: 20 }}>
      <h2>Money Tree</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setMoney(money + 10)}>Earn Money</button>
        <button onClick={() => setSavings(savings + 10)}>Save Money</button>
        <button
          onClick={() => {
            setSpent(spent + 10);
            setMoney(money - 10);
          }}
        >
          Spend Money
        </button>
      </div>
      <svg width="400" height="520" style={{ background: "#4fc3f7", borderRadius: 24 }}>
        {/* Background sky */}
        <rect x="0" y="0" width="400" height="520" fill="#4fc3f7" />
        {/* Grass at the bottom */}
        <ellipse cx="200" cy="500" rx="180" ry="30" fill="#7ec850" />
        <ellipse cx="80" cy="490" rx="40" ry="12" fill="#5cb85c" />
        <ellipse cx="320" cy="490" rx="40" ry="12" fill="#5cb85c" />
        {/* Tree trunk (broader and taller) */}
        <rect x="180" y="180" width="40" height="200" rx="18" fill="#145A32" />
        {/* Main Branch */}
        <path d="M200 220 Q160 160 200 100 Q240 40 200 20" stroke="#145A32" strokeWidth="20" fill="none" />
        {/* Side Branches */}
        <path d="M200 160 Q140 120 170 60" stroke="#145A32" strokeWidth="12" fill="none" />
        <path d="M200 160 Q260 120 230 60" stroke="#145A32" strokeWidth="12" fill="none" />
        {/* Canopy */}
        <ellipse cx="200" cy="120" rx="100" ry="80" fill="#34c759" opacity={0.95} />
        {/* Leaves (always green, realistic shape) */}
        {leafPositions.map((pos, i) => (
          <g key={i} transform={`translate(${pos.x},${pos.y}) rotate(${pos.rotate})`}>
            <path
              d="M0 0 Q8 12 0 24 Q-8 12 0 0"
              fill="#228B22"
              opacity={0.9}
              style={{ filter: "drop-shadow(0 2px 2px #7ec850)" }}
            />
          </g>
        ))}
        {/* Fruits: coins hanging on branches, only if savings > 0 */}
        {savings > 0 &&
          fixedFruitPositions.slice(0, fruits).map((pos, i) => (
            <g key={i} transform={`translate(${pos.x},${pos.y})`} style={{ cursor: "pointer" }} onClick={handleFruitClick}>
              <circle
                cx={0}
                cy={0}
                r="14"
                fill="#ffd700"
                stroke="#e6b800"
                strokeWidth="3"
                style={{ filter: "drop-shadow(0 2px 2px #e6b800)" }}
              />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill="#fff"
              >
                $
              </text>
            </g>
          ))}
        {/* Falling leaves on ground */}
        {fallingLeaves.map((pos, i) => (
          <g key={`fall-${i}`} transform={`translate(${pos.x},${pos.y}) rotate(${pos.rotate})`}>
            <path
              d="M0 0 Q8 12 0 24 Q-8 12 0 0"
              fill="#228B22"
              opacity={0.6}
            />
          </g>
        ))}
      </svg>
      <div style={{ marginTop: 16 }}>
        <p>
          <strong>Money:</strong> {money} &nbsp; | &nbsp;
          <strong>Savings:</strong> {savings} &nbsp; | &nbsp;
          <strong>Spent:</strong> {spent} &nbsp; | &nbsp;
          <strong>Health:</strong> {health}
        </p>
      </div>
    </div>
  );
}

export default Tree;