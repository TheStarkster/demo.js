// Convert hex color to rgba format
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  // Remove the hash if it exists
  hex = hex.replace('#', '');
  
  // Parse the hex values
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  
  // Return as rgba
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Custom easing function for smooth cursor movement
export const customEasing = (t: number) => {
  return t < 0.8 
    ? t * 1.05 
    : 0.84 + (1 - 0.84) * (1 - Math.pow(1 - (t - 0.8) * 5, 2));
};

// Function to get target element position
export const getTargetPosition = (element: Element | null): { x: number, y: number } => {
  if (!element) {
    return { x: window.innerWidth + 50, y: window.innerHeight / 2 };
  }

  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}; 