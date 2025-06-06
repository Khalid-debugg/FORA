const Spinner = () => {
  const numberOfBalls = 8;
  const radius = 80;

  return (
    <div className="relative bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full w-48 h-48">
      {/* Grass field background */}
      <div className="absolute inset-0 w-80 h-80 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
        <div className="w-full h-full rounded-full bg-gradient-radial from-green-400 via-green-500 to-green-600 opacity-30 blur-sm"></div>
        <div className="absolute inset-4 rounded-full border-2 border-white/20 border-dashed"></div>
      </div>

      {/* Main spinner container */}
      <div className="relative overflow-visible  ">
        <svg
          width="192"
          height="192"
          viewBox="0 0 192 192"
          className="absolute inset-0 overflow-visible"
        >
          {/* Field circle */}
          <defs>
            <radialGradient id="fieldGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0.3" />
            </radialGradient>

            <filter
              id="ballShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="2"
                dy="4"
                stdDeviation="3"
                floodColor="#000000"
                floodOpacity="0.3"
              />
            </filter>

            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Center field */}

          <circle
            cx="96"
            cy="96"
            r={radius + 5}
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.2"
            strokeDasharray="5,5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 96 96"
              to="360 96 96"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Soccer balls with trails */}
          {Array.from({ length: numberOfBalls }).map((_, index) => {
            const delay = index * 0.2;
            const ballId = `ball-${index}`;

            return (
              <g key={index}>
                {/* Ball trail effect */}
                <g opacity="0.6">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 96 96"
                    to="360 96 96"
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                    keyTimes="0;0.3;1"
                    keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1"
                    calcMode="spline"
                  />

                  {/* Trail circles */}
                  {[...Array(5)].map((_, trailIndex) => (
                    <circle
                      key={trailIndex}
                      cx={96 + radius}
                      cy="96"
                      r={8 - trailIndex * 1.2}
                      fill="white"
                      opacity={0.3 - trailIndex * 0.05}
                      transform={`rotate(${-trailIndex * 8} 96 96)`}
                    />
                  ))}
                </g>

                {/* Main ball */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 96 96"
                    to="360 96 96"
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                    keyTimes="0;0.3;1"
                    keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1"
                    calcMode="spline"
                  />

                  {/* Soccer ball */}
                  <g transform={`translate(${96 + radius}, 96)`}>
                    <circle
                      r="12"
                      fill="white"
                      fillOpacity="0.9"
                      stroke="#22c55e"
                      strokeWidth="2"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="16"
                      fill="#000000"
                      fontWeight="bold"
                    >
                      ⚽
                    </text>
                  </g>
                </g>
              </g>
            );
          })}

          {/* Center logo with pulse */}
          <g transform="translate(96, 96)">
            <circle r="15" fill="white" fillOpacity="0.9" filter="url(#glow)">
              <animate
                attributeName="r"
                values="15;18;15"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fill="#16a34a"
              fontWeight="bold"
            >
              ⚽
            </text>
          </g>
        </svg>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
