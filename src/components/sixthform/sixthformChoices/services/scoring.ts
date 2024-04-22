// Most scoring is completed on the backend but sometimes scoring is done from immediate actions on the frontend
// these functions make sure that the scoring is bounded from 0 to 1

// We need these functions to ensure that multiplications never go beyond the bound of 1

// Sigmoid Function
export function sigmoid(x: number): number {
 return 1 / (1 + Math.exp(-x));
}

// Logit Function
export function logit(p: number): number {
 return Math.log(p / (1 - p));
}