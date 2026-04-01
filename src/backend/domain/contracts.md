# ColloPay Gateway Contract Notes

## Money Precision Recommendations

1. Store monetary amounts only in minor units (`amountMinor`) as signed 64-bit integers in persistence layers.
2. Never use floating-point (`number` decimal fractions) for any fee or settlement arithmetic.
3. Represent percentage rates as basis points (`bps`) integers; apply using integer math with explicit rounding policies.
4. Standardize rounding policy per operation:
   - fee calculation: round half up to minor unit,
   - split allocations: deterministic largest-remainder allocation,
   - reconciliation: exact integer equality checks first, then configured tolerance if needed.
5. Include currency exponent map in config (e.g., USD=2, KES=2, JPY=0) and validate every incoming amount against expected exponent.
6. For cross-currency operations, store both source and converted amounts plus FX rate snapshot/version used.
7. Log pre- and post-rounding values for auditability whenever transformations occur.
