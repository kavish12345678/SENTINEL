import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [operatorId, setOperatorId] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated Node Network Canvas from intelligence_entrance/code.html
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const numNodes = Math.floor((width * height) / 25000);
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
      });
    }

    const threatNodeIndex = Math.floor(Math.random() * nodes.length);
    let threatIntensity = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (threatIntensity < 1) threatIntensity += 0.003;

      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        nodeA.x += nodeA.vx;
        nodeA.y += nodeA.vy;

        if (nodeA.x < 0 || nodeA.x > width) nodeA.vx *= -1;
        if (nodeA.y < 0 || nodeA.y > height) nodeA.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            if (i === threatNodeIndex || j === threatNodeIndex) {
              ctx.strokeStyle = `rgba(129, 38, 39, ${((140 - dist) / 140) * threatIntensity * 0.6})`;
            } else {
              ctx.strokeStyle = `rgba(70, 71, 66, ${((140 - dist) / 140) * 0.4})`;
            }
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        if (i === threatNodeIndex) {
          ctx.fillStyle = '#c45855';
          const pulse = Math.sin(Date.now() * 0.003) * 1.5 * threatIntensity;
          ctx.arc(node.x, node.y, node.radius + pulse, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = '#464742';
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    login();
    setIsLoading(false);
    navigate('/dashboard');
  };

  const handleDemoAccess = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    login();
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="bg-[#0b0b0a] text-[#e5e2d9] h-screen w-screen overflow-hidden relative select-none font-sans">
      {/* Node Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50" />

      {/* Main Form Box */}
      <main className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="font-mono text-3xl md:text-4xl font-bold tracking-[0.2em] text-[#e5e2d9] mb-2">
            SENTINEL
          </h1>
          <h2 className="font-mono text-xs tracking-[0.25em] text-[#c7c7bf] uppercase">
            PRIVILEGED BEHAVIOUR INTELLIGENCE
          </h2>
        </header>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-6">
          <div className="relative group">
            <input
              type="text"
              id="operator_id"
              required
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
              placeholder=" "
              className="w-full bg-transparent border-0 border-b border-[#464742] px-0 py-2 font-mono text-xs text-[#e5e2d9] focus:ring-0 focus:border-[#e5e2d9] transition-colors peer"
            />
            <label
              htmlFor="operator_id"
              className="absolute left-0 top-2 font-mono text-xs text-[#91918a] transition-all peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-[#e8c178] peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#e8c178] pointer-events-none uppercase tracking-wider"
            >
              Operator ID
            </label>
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e8c178] transition-all duration-300 peer-focus:w-full" />
          </div>

          <div className="relative group">
            <input
              type="password"
              id="access_key"
              required
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder=" "
              className="w-full bg-transparent border-0 border-b border-[#464742] px-0 py-2 font-mono text-xs text-[#e5e2d9] focus:ring-0 focus:border-[#e5e2d9] transition-colors peer"
            />
            <label
              htmlFor="access_key"
              className="absolute left-0 top-2 font-mono text-xs text-[#91918a] transition-all peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-[#e8c178] peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#e8c178] pointer-events-none uppercase tracking-wider"
            >
              Access Key
            </label>
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e8c178] transition-all duration-300 peer-focus:w-full" />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full border border-[#464742] bg-[#1c1c16] text-[#e5e2d9] hover:bg-[#2a2a24] hover:border-[#e8c178] transition-all duration-200 py-3 px-6 flex items-center justify-center gap-2 group font-mono text-xs tracking-widest uppercase shadow-lg disabled:opacity-50"
          >
            <span>{isLoading ? 'INITIALIZING...' : 'INITIALIZE SESSION'}</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={isLoading}
            className="w-full bg-transparent border border-dashed border-[#464742] text-[#91918a] hover:text-[#e8c178] hover:border-[#e8c178]/50 py-2 font-mono text-[11px] uppercase tracking-wider transition-all"
          >
            [ Quick Demo Access ]
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 w-full flex justify-center z-10">
        <span className="font-mono text-[11px] text-[#91918a]/60 tracking-wider">
          SNTL // INTELLIGENCE ENGINE
        </span>
      </footer>
    </div>
  );
}
