import { useState, useRef } from "react";

export interface LoadingManager {
  isLoading: boolean;
  startLoading: (operation: string) => void;
  stopLoading: (operation?: string) => void;
  operations: Set<string>;
}

export const useLoadingManager = (): LoadingManager => {
  const [isLoading, setIsLoading] = useState(false);
  const operationsRef = useRef<Set<string>>(new Set());

  const startLoading = (operation: string) => {
    operationsRef.current.add(operation);
    setIsLoading(true);
  };

  const stopLoading = (operation?: string) => {
    if (operation) {
      operationsRef.current.delete(operation);
    } else {
      operationsRef.current.clear();
    }
    
    if (operationsRef.current.size === 0) {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    operations: operationsRef.current,
  };
};