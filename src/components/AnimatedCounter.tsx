import React, { useEffect, useState, useRef } from "react";
import { AppSettings } from "../types";
import { formatCurrency } from "../utils/formatters";

interface AnimatedCounterProps {
  value: number;
  settings: AppSettings;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  isCurrency?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  settings,
  duration = 900,
  prefix = "",
  suffix = "",
  className = "",
  isCurrency = true
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const prevValueRef = useRef<number>(value);
  const reqIdRef = useRef<number | null>(null);

  useEffect(() => {
    const startVal = prevValueRef.current;
    const endVal = value;

    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out formula for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        reqIdRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endVal);
        prevValueRef.current = endVal;
      }
    };

    reqIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
      }
    };
  }, [value, duration]);

  const isInt = Number.isInteger(value);
  const roundedVal = isInt ? Math.round(displayValue) : Number(displayValue.toFixed(2));

  const formatted = isCurrency
    ? formatCurrency(roundedVal, settings)
    : `${prefix}${roundedVal.toLocaleString("en-IN")}${suffix}`;

  return <span className={className}>{formatted}</span>;
};
