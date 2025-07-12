// src/components/QuantitySelector.tsx

import React from 'react';
import styles from '../styles/QuantitySelector.module.css';

interface QuantitySelectorProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <div className={styles.controls}>
        <button className={styles.button} onClick={handleDecrement} disabled={value <= min}>
          -
        </button>
        <span className={styles.value}>{value}</span>
        <button className={styles.button} onClick={handleIncrement} disabled={value >= max}>
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;