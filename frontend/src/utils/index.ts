import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: string | number): string {
  const numericValue = typeof value === 'string' 
    ? parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'))
    : value;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function getVehicleTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    carros: 'Carros',
    motos: 'Motos',
    caminhoes: 'Caminhões',
  };
  return labels[type] || type;
}

export function getVehicleTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    carros: '🚗',
    motos: '🏍️',
    caminhoes: '🚛',
  };
  return icons[type] || '🚗';
}

export function calculatePercentageDifference(value1: number, value2: number): number {
  if (value1 === 0) return 0;
  return ((value2 - value1) / value1) * 100;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
} 