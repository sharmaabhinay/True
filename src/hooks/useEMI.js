import { useState, useMemo } from 'react';
import { calcEMIValues } from '../utils/formatters';

export function useEMI(initialPrincipal = 80000, initialMonths = 12, initialRate = 10) {
  const [principal, setPrincipal] = useState(initialPrincipal);
  const [months,    setMonths]    = useState(initialMonths);
  const [rate,      setRate]      = useState(initialRate);

  const result = useMemo(
    () => calcEMIValues(principal, months, rate),
    [principal, months, rate]
  );

  return { principal, setPrincipal, months, setMonths, rate, setRate, result };
}
