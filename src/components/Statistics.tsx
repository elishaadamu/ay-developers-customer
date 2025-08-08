import { useState, useEffect, useRef } from "react";

export const Statistics = () => {
  interface statsProps {
    quantity: string;
    description: string;
    target: number;
  }

  const stats: statsProps[] = [
    {
      quantity: "2.7K+",
      description: "Users",
      target: 2700,
    },
    {
      quantity: "5",
      description: "Products",
      target: 5,
    },
    {
      quantity: "50+",
      description: "Projects",
      target: 50,
    },
    {
      quantity: "99%",
      description: "Satisfaction",
      target: 99,
    },
  ];

  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          startCounting();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const startCounting = () => {
    stats.forEach((stat, index) => {
      let start = 0;
      const increment = stat.target / 100; // Divide into 100 steps
      const timer = setInterval(() => {
        start += increment;
        if (start >= stat.target) {
          start = stat.target;
          clearInterval(timer);
        }
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = Math.floor(start);
          return newCounts;
        });
      }, 20); // Update every 20ms for smooth animation
    });
  };

  const formatNumber = (num: number, index: number) => {
    if (index === 0) return `${(num / 1000).toFixed(1)}K+`; // Users
    if (index === 2) return `${num}+`; // Projects
    if (index === 3) return `${num}%`; // Satisfaction
    return num.toString(); // Products
  };

  return (
    <section id="statistics" ref={statsRef}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map(({ description }, index) => (
          <div key={description} className="space-y-2 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">
              {formatNumber(counts[index], index)}
            </h2>
            <p className="text-xl text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
