export interface ConditionalValue {
  property: string;
  operator: 'eq' | 'neq';
  value: any;
}
