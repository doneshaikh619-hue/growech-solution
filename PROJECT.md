# Project: Growech Care — Enterprise Hospital & Clinic OS (SIMRS / HMS / EHR)

## Architecture
- **Runtime**: Zero-server-dependency standalone single-page web application at `public/care/index.html`.
- **Styling**: Tailwind CSS (CDN pre-configured with Growech Healthcare palette `#06080F`, `#0B0F19`, `#111827`, `#00C2CB`), Google Fonts (`Inter`, `Plus Jakarta Sans`, `JetBrains Mono`).
- **Icons**: Safe Lucide icons (`safeRenderIcons()`) with embedded inline SVG fallbacks for critical interactive controls.
- **Audio Synthesis**: Singleton Web Audio API `SoundEngine` synthesizing authentic dual-tone hospital chime (`523.25Hz` + `659.25Hz`) and Code Blue alert (`880Hz`) with zero external audio assets.
- **Specimen Barcoding**: Pure JavaScript vector Code128 (Subset B) SVG generator for specimen tubes and patient wristbands.
- **Dual Print Engine**: CSS `@media print` with `.print-a4` (clinical reports, pathology slips, discharge summaries) and `.print-thermal` (80mm cashier POS receipts).
- **State Management & Persistence**: `GrowechCareStore` reactive client-side store with `localStorage` persistence, automatic schema versioning, and pre-seeded rich clinical demo dataset.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Multi-Branch Facility Switcher | Switch between Karachi Main, Dubai Polyclinic, and London Medical Complex | M1 | Survey (A) |
| 2 | Departmental Configurations | 8 clinical departments (Gen Med, Cardio, Peds, Gyn, Surg, Derm, Ortho, ENT) | M1 | Survey (A) |
| 3 | Clinician Profiles & Rostering | Doctor credentials, qualifications, PMDC licenses, OPD fee schedules | M1 | Survey (A) |
| 4 | Configurable Fee Schedule | Master tariff schedule for consultations, daily bed rates, lab tests, and procedures | M1 | Survey (A) |
| 5 | Role-Based Access Control | 7 roles (Superuser, Doctor, Nurse, Pharmacist, Lab Tech, Cashier, Receptionist) | M1 | Survey (A) |
| 6 | Unique MRN Generator | Deterministic `GW-YYYY-XXXX` auto-incrementing MRN algorithm | M1 | Survey (B) |
| 7 | Demographic & Emergency Contacts | Patient profile capturing CNIC, phone, address, and emergency contact details | M1 | Survey (B) |
| 8 | Duplicate Detection Warnings | Active heuristic warning on phone/CNIC collision during registration | M1 | Survey (B) |
| 9 | Chronological Health Timeline | Reverse-chronological timeline of all clinical encounters per patient | M1 | Survey (B) |
| 10 | Family & Guardian Associations | Link parent/guardian MRN to pediatric/dependent patient records | M1 | Survey (B) |
| 11 | Appointment Booking Simulator | Slot booking with date, time, doctor, and department selection | M2 | Survey (C) |
| 12 | Doctor Availability Matrix | Shift schedules, session hours, slot capacity tracking | M2 | Survey (C) |
| 13 | Reception & Kiosk Check-In | Self-service check-in by MRN or phone number generating queue token | M2 | Survey (C) |
| 14 | Smart Token Triage Queue | FIFO queue with Normal, Priority (Senior/Infant), and Emergency triage tags | M2 | Survey (C) |
| 15 | Web Audio Chime Synthesizer | Dual-frequency chime calling next token with zero external audio files | M2 | Survey (C) |
| 16 | Estimated Wait-Time Calculation | Dynamic wait time estimate based on queue position and average consultation time | M2 | Survey (C) |
| 17 | SOAP Clinical Documentation | Structured Subjective, Objective, Assessment (ICD-10), and Plan clinical entry | M2 | Survey (D) |
| 18 | Specialty Examination Templates | Custom clinical exam templates for Cardiology, Pediatrics, and Orthopedics | M2 | Survey (D) |
| 19 | Real-Time Vitals & BMI Engine | BP, pulse, temp, SpO2, resp rate, height, weight, and automated BMI classification | M2 | Survey (D) |
| 20 | Digital E-Prescription Builder | Prescription builder with formulary picker, dosage, frequency, and duration | M2 | Survey (D) |
| 21 | Drug Allergy Alert Warning | Warning modal if prescribed medicine conflicts with patient's recorded allergies | M2 | Survey (D) |
| 22 | FEFO Pharmacy Stock Routing | Automatic routing of approved e-prescription to Pharmacy dispensing queue | M2 | Survey (D) |
| 23 | 3-Tier ER Rapid Triage Scoring | Red (Resuscitation), Yellow (Urgent), Green (Non-Urgent) clinical triage | M3 | Survey (E) |
| 24 | Minimal-Intake Emergency Registration | 15-second emergency intake creating instant encounter with temporary alias | M3 | Survey (E) |
| 25 | Trauma Resuscitation Timestamp Log | Real-time timestamped resuscitation actions log (Airway, Defib, IV, Bolus) | M3 | Survey (E) |
| 26 | Hospital-Wide Code Blue Alarm | Audio-visual Code Blue siren broadcast across emergency and trauma staff | M3 | Survey (E) |
| 27 | Inpatient Floor Maps (5 Wards) | Graphical floor maps for Trauma (6), ICU (6), Male (12), Female (12), VIP (4) | M3 | Survey (F) |
| 28 | Bed Occupancy State Machine | Real-time transitions: Vacant (Green), Occupied (Red), Cleaning (Orange), Reserved (Cyan) | M3 | Survey (F) |
| 29 | 1-Click Bed Admission Modal | Rapid admission assigning patient, admitting diagnosis, and attending doctor | M3 | Survey (F) |
| 30 | 1-Click Bed Transfer Modal | Relocate patient between wards while preserving clinical orders | M3 | Survey (F) |
| 31 | eMAR (Medication Administration) | Nursing checklist of scheduled inpatient drug doses with timestamped sign-offs | M3 | Survey (F) |
| 32 | 4-Gate Discharge Clearance | Sequential checklist: Doctor -> Nurse -> Pharmacy Returns -> Cashier Settlement | M3 | Survey (F) |
| 33 | OT Surgical Procedure Scheduling | Suite selection (OT-1 to OT-4), procedure, lead surgeon, anesthesiologist | M3 | Survey (G) |
| 34 | WHO Surgical Safety Checklist | Sign-In, Time-Out, and Sign-Out verification protocols | M3 | Survey (G) |
| 35 | PACU Aldrete Recovery Scoring | Post-anesthesia recovery tracking scoring motor, respiration, circulation, consciousness | M3 | Survey (G) |
| 36 | Surgical Consumables Reconciliation | Tracking implants, screws, meshes, and surgical packs charged to billing | M3 | Survey (G) |
| 37 | ICU Cardiac Telemetry Waveforms | Animated real-time ECG rhythm monitor (Sinus, Tachy, Brady, ST Elevation) | M3 | Survey (H) |
| 38 | ABP, CVP & MAP Telemetry Readouts | Live hemodynamics telemetry readouts with mean arterial pressure calculation | M3 | Survey (H) |
| 39 | Ventilator & Oxygen Metrics | Mode (SIMV/BiPAP), FiO2 (21-100%), PEEP, Tidal Volume, and PIP metrics | M3 | Survey (H) |
| 40 | Hourly Observation Flowsheet | 24-hr vital trending, GCS neurological score /15, fluid balance intake vs output | M3 | Survey (H) |
| 41 | Clinical Panic Alert Escalation | Automatic visual/audible alert when SpO2 < 90%, MAP < 65, or HR > 130 | M3 | Survey (H) |
| 42 | Pathology Test Order Directory | Comprehensive test menu: CBC, LFT, RFT, Electrolytes, Troponin-I, Coagulation | M4 | Survey (I) |
| 43 | Vector SVG Barcode Specimen Tracking | Pure JS Code128 vector barcode generation for specimen collection tubes | M4 | Survey (I) |
| 44 | Specimen Rejection & Redraw Workflow | Quality rejection logging (Hemolyzed, Clotted) triggering redraw notice | M4 | Survey (I) |
| 45 | Reference Ranges & Critical Panic Values | Age/gender reference intervals with immediate red banner for panic results | M4 | Survey (I) |
| 46 | Printable A4 Pathology Report | Formal hospital lab report letterhead with pathologist signature | M4 | Survey (I) |
| 47 | Radiology Imaging Worklists | Modality worklists for X-Ray, CT, MRI, Ultrasound, and 2D Echocardiography | M4 | Survey (J) |
| 48 | PACS Viewer Simulator & Findings | Simulated medical scan viewer with clinical indication, findings, and impressions | M4 | Survey (J) |
| 49 | Formulary Medicine Catalog | Generic name, brand, dosage form, strength, therapeutic class, and unit pricing | M4 | Survey (K) |
| 50 | Batch / Lot & Expiry Management | Multiple batches per drug with batch numbers, manufacturing, and expiry dates | M4 | Survey (K) |
| 51 | FEFO Dispensing Engine | Auto-allocation from earliest expiring batch; near-expiry (< 60 days) flags | M4 | Survey (K) |
| 52 | Auto Low-Stock Reorder Triggers | Automated purchase requisition creation when stock falls below reorder minimum | M4 | Survey (K) |
| 53 | Goods Receipt Notes (GRN) | Receiving supplier stock shipments, logging batch/expiry, updating inventory | M4 | Survey (K) |
| 54 | Departmental Stock Consumption | Tracking internal stock transfers to ER Crash Cart, ICU Store, OT Pharmacy | M4 | Survey (K) |
| 55 | Consolidated Itemized Billing Ledger | Central billing aggregator for consultations, bed days, pharmacy, lab, and surgery | M5 | Survey (L) |
| 56 | Deposits, Advances & Partial Payments | Advance deposit logging, partial payments, and live running balance calculation | M5 | Survey (L) |
| 57 | Approved Discounts & Waivers | Promotional, staff, and hardship discounts with manager authorization log | M5 | Survey (L) |
| 58 | Sehat Sahulat Card Panel Billing | Pakistan National Social Health Protection panel billing & package verification | M5 | Survey (L) |
| 59 | Corporate Insurance Pre-Authorization | Pre-authorization claims workflow for corporate insurers (Jubilee, EFU, Adamjee) | M5 | Survey (L) |
| 60 | Cashier Closing & Multi-Tender | Daily cashier shift reconciliation across Cash, Card, Raast, and Sehat Card | M5 | Survey (L) |
| 61 | Dual Receipt Print Engine (A4 & POS) | 1-click A4 clinical invoice/discharge clearance and 80mm thermal cashier receipt | M5 | Survey (L) |
| 62 | Staff Profiles & Credential Monitoring | Staff directory with PMDC license expiry tracking and 60/30-day compliance alerts | M5 | Survey (M) |
| 63 | Duty Shift Rosters | Morning, Evening, and Night duty roster matrices with on-call coverage | M5 | Survey (M) |
| 64 | Blood Bank Units & Cross-Match | ABO/Rh inventory, component units (PRBC, FFP, Platelets), cross-match testing | M5 | Survey (N) |
| 65 | CSSD Sterilization Cycles | Autoclave cycles, biological indicator tape results, sterile pack tracking | M5 | Survey (O) |
| 66 | Dietary & Clinical Meal Orders | Inpatient diet categories (Diabetic, Renal, Cardiac, NPO), kitchen dispatch | M5 | Survey (P) |
| 67 | Ambulance Fleet Dispatch | Fleet vehicle tracking, emergency GPS dispatch log, on-board O2/defib checks | M5 | Survey (Q) |
| 68 | Biomedical Maintenance Tickets | Medical device asset registry, calibration logs, and repair tickets | M5 | Survey (R) |
| 69 | Mobile Patient Self-Service Portal | Smartphone simulator with QR appointment pass, digital Rx, lab PDF report | M6 | Survey (Portal) |
| 70 | Interactive WhatsApp CRM Simulator | Chat simulator with realistic bubbles, verified header, action chips, instant bot reply | M6 | Survey (WhatsApp) |
| 71 | 8 Core Hospital Automations Engine | Interactive engine executing all 8 end-to-end multi-step hospital automations | M6 | Survey (Auto) |
| 72 | AI Operational Assistants Suite | Voice/WhatsApp AI receptionist, clinical note summarizer, complaint ticket classifier | M6 | Survey (AI) |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Core Admin, Multi-Branch & Patient EHR Engine | Modules A & B: Facility switcher, Dept configs, Fee schedules, RBAC (7 roles), Patient Registration, Unique MRN (`GW-YYYY-XXXX`), Heuristic Duplicate Warning, Clinical Timeline, Family links, `GrowechCareStore` persistence & auto-seed | none | IN_PROGRESS |
| M2 | Appointments, Smart Triage Queue & Clinical EMR | Modules C & D: Appointment booking, Doctor availability matrix, Kiosk check-in, Token queue, Web Audio chime synthesizer, Wait-time calculator, SOAP clinical notes, Specialty exam templates, Vitals + BMI engine, Digital E-Prescription builder with allergy alerts & FEFO routing | M1 | PLANNED |
| M3 | Emergency, Inpatient Bed Matrix, OT & Telemetry | Modules E, F, G, H: 3-tier ER triage (Red/Yellow/Green), minimal emergency intake, trauma resuscitation log, Code Blue alarm, 40-bed IPD matrix (5 wards), bed state machine (Vacant/Occupied/Cleaning/Reserved), 1-click admit/transfer/eMAR/discharge clearance, OT schedules, WHO checklist, PACU Aldrete score, surgical consumables, ICU ECG telemetry waveforms, ABP/CVP/MAP, ventilator metrics, fluid flowsheet, clinical panic alerts | M1, M2 | PLANNED |
| M4 | Diagnostics LIS/RIS, Central Pharmacy & FEFO Inventory | Modules I, J, K: Pathology test directory, Code128 vector barcode specimen labels, sample rejection/redraw, reference ranges & panic banners, printable A4 pathology report, Radiology modality worklists, PACS viewer simulator, Formulary catalog, Batch/lot & expiry tracking, FEFO dispensing, auto low-stock reorder triggers, Goods Receipt Notes (GRN), departmental consumption | M1, M2 | PLANNED |
| M5 | Medical Billing, Insurance Panels & Hospital Support Operations | Modules L, M, N, O, P, Q, R: Itemized billing ledger, advance deposits, discounts, Sehat Sahulat card panel billing, corporate pre-authorizations, daily cashier shift closing & multi-tender settlement, dual print engine (A4 & 80mm thermal receipt), Staff profiles & PMDC license expiry monitoring, Duty rosters, Blood Bank & cross-match, CSSD sterilization cycles, Dietary meal orders, Ambulance fleet dispatch, Biomedical maintenance tickets | M1, M2, M3, M4 | PLANNED |
| M6 | Patient Portal, WhatsApp Hub, 8 Core Automations & AI Suite | Patient Mobile Portal, WhatsApp CRM simulator with instant bot replies, Interactive 8 Core Hospital Automations visual execution engine, AI Receptionist (Roman Urdu/English), Clinical Note Summarizer, Complaint Ticket Categorizer | M1, M2, M3, M4, M5 | PLANNED |
| M7 | E2E Test Suite Pass & Adversarial Hardening | Phase 1: 100% pass across all E2E test tiers (Tiers 1-4). Phase 2: Tier 5 Adversarial coverage hardening with Challenger. Responsive layout verification (1920, 1440, 1024, 768, 375), zero console errors, build verification, sitemap verification, and git push | M1, M2, M3, M4, M5, M6 | PLANNED |

## Interface Contracts
### Module B (Patient EHR) ↔ All Clinical Modules
- Function: `getPatient(mrn: string): PatientRecord`
- Function: `registerPatient(data: PatientRegistrationInput): { success: boolean, mrn: string, warning?: string }`
- Function: `appendPatientTimeline(mrn: string, event: ClinicalTimelineEvent): void`

### Module D (Doctor EMR) ↔ Module K (Pharmacy) & Module L (Billing)
- Function: `submitPrescription(encounterId: string, mrn: string, items: PrescribedItem[]): PrescriptionRecord`
  - Side-effect 1: Enqueues into `pharmacyQueue` with FEFO batch assignment.
  - Side-effect 2: Adds debit entries to patient's `unbilledLedger` in Module L.
  - Allergy check: Raises warning before commit if patient allergic to drug class.

### Module I (Laboratory) ↔ Module L (Billing) & Module H (ICU Alerts)
- Function: `orderLabTest(mrn: string, testCode: string, urgency: 'routine'|'urgent'|'stat'): LabOrderRecord`
  - Generates `SPEC-YYYY-XXXX` and renders vector Code128 barcode SVG.
  - Appends test fee to billing ledger.
- Function: `finalizeLabResult(orderId: string, results: Record<string, number>): void`
  - Flags critical panic values; if in ICU/ER, triggers high-priority audio-visual clinician alert.

### Module F (Bed Matrix) ↔ Module L (Billing) & Housekeeping
- Function: `admitPatientToBed(bedId: string, mrn: string, doctorId: string, deposit: number): void`
  - Sets bed state to `Occupied`.
  - Records admission timestamp and deposit receipt in Module L.
- Function: `executeDischargeClearance(bedId: string): { cleared: boolean, invoiceId: string }`
  - Verifies 4 gates (Medical, Nursing, Pharmacy returns, Cashier settlement).
  - Sets bed state to `Cleaning`. Daily room charge automatically computed into invoice.

### Cashier & Print Engine
- Function: `printDocument(type: 'a4-invoice' | 'a4-lab' | 'thermal-receipt', data: any): void`
  - Dynamically sets document body class to `print-a4` or `print-thermal`.
  - Populates designated printable container and triggers `window.print()`.

## Code Layout
- **Target File**: `C:\growech-solution\public\care\index.html`
  - Lines 1-150: Document Head, Tailwind CDN, Lucide CDN, Google Fonts, Custom CSS (animations, custom scrollbars, print stylesheets for `.print-a4` and `.print-thermal`).
  - Lines 151-350: App Shell, Sidebar Navigation (5 functional categories covering Modules A through R + Portal + Automations + AI), Top Header (Facility switcher, Role switcher, Audio Chime toggle, Live Emergency Status pill, Demo Data reset/export).
  - Lines 351-1800: Workstation Views:
    - View 1: Executive Dashboard & Live Triage Overview
    - View 2: Patient Registration, MRN Directory & Health Timeline (Module B)
    - View 3: Appointments, Schedules & Smart Token Queue (Module C)
    - View 4: Doctor Clinical EMR, SOAP & E-Prescriptions (Module D)
    - View 5: Emergency Department (ER) & Trauma Resuscitation (Module E)
    - View 6: Inpatient Department (IPD) Bed Matrix Floor Plan (Module F)
    - View 7: Operation Theatre (OT) & Surgery Schedules (Module G)
    - View 8: ICU & Telemetry Cardiac Monitoring (Module H)
    - View 9: Diagnostic Laboratory (LIS) & Specimen Barcodes (Module I)
    - View 10: Radiology (RIS/PACS) Worklist & Viewer (Module J)
    - View 11: Pharmacy & Central FEFO Inventory (Module K)
    - View 12: Medical Billing, Insurance Panels & Cashier Closing (Module L)
    - View 13: HR, Clinician Credentials & Duty Rosters (Module M)
    - View 14: Hospital Support Operations (Blood Bank, CSSD, Dietary, Ambulance, Maintenance) (Modules N, O, P, Q, R)
    - View 15: Hospital Administration & Multi-Branch Setup (Module A)
    - View 16: Mobile Patient Self-Service Portal Simulator
    - View 17: Interactive WhatsApp CRM Hub Simulator
    - View 18: 8 Core Hospital Automations Visual Engine
    - View 19: AI Operational Assistants Suite
  - Lines 1801-2000: Modals & Print Containers:
    - Modal 1: Patient Registration & Duplicate Detection Modal
    - Modal 2: 1-Click Bed Admission Modal
    - Modal 3: Bed Transfer Modal
    - Modal 4: eMAR Administration Modal
    - Modal 5: 4-Gate Discharge Clearance Modal
    - Modal 6: New Appointment Modal
    - Modal 7: E-Prescription Form Modal with Allergy Warning
    - Modal 8: Lab Test Requisition Modal
    - Modal 9: Cashier Invoice & Payment Modal
    - Container `#printableA4Doc`: Full-size A4 clinical reports, discharge slips, and pathology slips.
    - Container `#printableThermalDoc`: Compact 80mm cashier thermal POS receipt.
  - Lines 2001-3800: JavaScript State & Control Engine:
    - Section 1: `SoundEngine` Web Audio API singleton (Chime & Code Blue).
    - Section 2: Zero-dependency SVG Code128 barcode generator.
    - Section 3: `DEFAULT_HOSPITAL_DATA` comprehensive pre-seeded dataset.
    - Section 4: `GrowechCareStore` persistence & state mutation methods.
    - Section 5: Navigation & View Switcher logic.
    - Section 6: Interactive Workstation event handlers and UI renderers.
    - Section 7: Modal controllers.
    - Section 8: Dual Print Engine dispatcher.
    - Section 9: 8 Core Automations interactive simulation runner.
    - Section 10: AI Assistants natural language simulation.
