import { useEffect, useState, useRef } from 'react';
import { TrendingUp, Users, Target, Award } from 'lucide-react';

interface Stat {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  {
    icon: <Users className="w-8 h-8" />,
    value: 15000,
    suffix: '+',
    label: 'Scans Analyzed',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <Target className="w-8 h-8" />,
    value: 94,
    suffix: '%',
    label: 'Accuracy Rate',
    color: 'from-brand-500 to-purple-500'
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: 2500,
    suffix: '+',
    label: 'Lives Impacted',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: <Award className="w-8 h-8" />,
    value: 45,
    suffix: '+',
    label: 'Partner Clinics',
    color: 'from-orange-500 to-red-500'
  }
];

function CounterNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div ref={counterRef} className="text-5xl md:text-6xl font-black">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function StatsCounter() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Making Real Impact
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Every scan brings us closer to early detection and better outcomes for patients across Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:-translate-y-2"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4 shadow-lg`}>
                  {stat.icon}
                </div>
                
                <div className={`text-transparent bg-clip-text bg-gradient-to-br ${stat.color} mb-2`}>
                  <CounterNumber target={stat.value} suffix={stat.suffix} />
                </div>
                
                <p className="text-slate-600 font-semibold text-lg">{stat.label}</p>
              </div>

              {/* Animated pulse on hover */}
              <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                <span className={`absolute inline-flex h-full w-full rounded-full bg-gradient-to-br ${stat.color} opacity-75 animate-ping`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
