/**
 * Deterministic Financial Calculator Engine — Public API Barrel
 */

// Types
export * from './types/money';
export * from './types/frequency';
export * from './types/rules';
export * from './types/calculator';

// Core utilities
export * from './core/money';
export * from './core/rounding';
export * from './core/percentage';
export * from './core/dates';
export * from './core/age';
export * from './core/errors';
export * from './core/warnings';
export * from './core/result';

// Validation
export * from './validation/errors';
export * from './validation/validator';

// Rules & Fixtures
export * from './rules/provider';
export * from './rules/fixtures/synthetic-rules';

// Engines
export * from './engines/premium';
export * from './engines/maturity';
export * from './engines/bonus';
export * from './engines/surrender';
export * from './engines/surrender-loss';
export * from './engines/surrender-analysis';
export * from './engines/comparison';
export * from './engines/loan';
export * from './engines/insurance';
export * from './engines/pension';

// Adapters
export * from './adapters/api-adapter';
export * from './adapters/ai-adapter';

// Registry
export * from './registry';
