# E2E Test Infra: Growech Care — Enterprise Hospital & Clinic OS

## Test Philosophy
- Opaque-box, requirement-driven derived strictly from `ORIGINAL_REQUEST.md` and `PROJECT.md § Feature Inventory`.
- Zero coupling to internal component structure; interacts through DOM endpoints, visual displays, audio chime calls, print triggers, state persistence, and responsive viewport behaviors.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial + Real-World Workload Testing.

## Test Architecture
- **Target Application**: `http://localhost:4173/care/` or `file:///C:/growech-solution/public/care/index.html` (and `dist/care/index.html`).
- **Test Runner Framework**: Node.js automated test harness / Playwright / Puppeteer / Browser DOM assertion scripts under `scripts/test-e2e-care.cjs`.
- **Pass/Fail Semantics**: Exit code 0 on complete pass; non-zero on any failure.
- **Verification Matrix**:
  - Headless Chromium verification across viewports: Desktop (1920x1080, 1440x900), Tablet (1024x768, 768x1024), Mobile (375x812).
  - Web Audio API chime invocation assertions (AudioContext state and frequency parameters).
  - Print container formatting assertions (`@media print` `.print-a4` and `.print-thermal`).
  - Barcode vector verification (valid SVG Code128 bar pattern and checksum).
  - `localStorage` persistence and multi-branch data isolation.

## Feature Coverage Matrix (Tiers 1 - 4)
- Total Features: 72 Features across Modules A through R + Portal + Automations + AI Suite.
- **Tier 1 (Feature Coverage)**: Happy-path validation for all 72 features in isolation.
- **Tier 2 (Boundary & Corner Cases)**: Edge cases, negative inputs, invalid CNIC/phone, zero stock dispensing, bed capacity saturation, extreme vitals, duplicate detection triggers.
- **Tier 3 (Cross-Feature Combinations)**: Multi-module interactions (e.g., Patient Registration -> Appointment -> Triage -> Doctor EMR -> E-Prescription -> Pharmacy FEFO Dispense -> Inventory Decrement -> Invoice Ledger -> Cashier Payment -> Receipt Print).
- **Tier 4 (Real-World Application Scenarios)**:
  1. Massive Polytrauma Code Red Influx & Emergency Surge.
  2. End-to-End Inpatient Admission, ICU Telemetry Monitoring, Step-down to General Ward, and 4-Gate Discharge.
  3. Emergency Laparoscopic Appendectomy with WHO Surgical Checklist, Consumable Billing, and PACU Recovery.
  4. Chronic Cardiac Outpatient Consultation with Drug Allergy Alert, Cardiology Template, and WhatsApp Follow-up.
  5. Multi-Branch Administrative Tariff Revision & Daily Cashier Multi-Tender Shift Closing Reconciliation.

## Coverage Goals & Thresholds
- Tier 1: >= 5 tests per major module area (>= 60 tests)
- Tier 2: >= 5 tests per boundary/corner condition (>= 40 tests)
- Tier 3: Pairwise combination across all cross-module transitions (>= 25 tests)
- Tier 4: Comprehensive real-world multi-module workflows (>= 5 extensive end-to-end scenarios)
- **Total Test Count**: >= 130 automated test assertions.
