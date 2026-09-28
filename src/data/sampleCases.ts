import { SampleCase } from '../types/detective';

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'rahul-loan',
    title: "Rahul's Personal Loan Application",
    caseType: 'Personal Loan Application',
    domain: 'Banking & Credit Services',
    badge: 'Finance / Credit',
    description: 'A 25-year-old software developer applying for a ₹5,00,000 unsecured personal loan with missing employment duration, obligations, and credit history.',
    expectedMissingCount: 4,
    content: `APPLICANT FORM - UNSECURED PERSONAL LOAN

Applicant Name: Rahul Sharma
Age: 25
Occupation: Software Developer
Monthly Income: ₹45,000
Loan Amount Requested: ₹5,00,000
Purpose: Home Renovation / Personal
Current City: Bengaluru, Karnataka`
  },
  {
    id: 'insurance-claim',
    title: 'Post-Surgery Health Insurance Claim',
    caseType: 'Health Insurance Claim Reimbursement',
    domain: 'Health Insurance & Claims',
    badge: 'Healthcare / Insurance',
    description: 'An inpatient reimbursement claim with diagnosis notes but missing pre-authorization number, itemized hospital bill breakdown, and surgeon discharge certificate.',
    expectedMissingCount: 4,
    content: `HEALTH INSURANCE CLAIM REIMBURSEMENT FORM

Policyholder Name: Elena Ross
Policy Number: HIC-99281-B
Claim Amount: $14,200
Hospital Name: St. Jude Metropolitan Medical Center
Admission Date: 12-September-2026
Discharge Date: 16-September-2026
Procedure: Laparoscopic Appendectomy
Attending Physician: Dr. Marcus Vance, MD
Patient Status: Discharged Stable
Submitted Bills Total: $14,200 (Single Lump Sum Receipt)`
  },
  {
    id: 'senior-engineer',
    title: 'Senior Distributed Systems Engineer Application',
    caseType: 'Job Application / Technical Hiring',
    domain: 'Human Resources & Talent Acquisition',
    badge: 'HR / Recruitment',
    description: 'Applicant profile with skills and education, but missing work authorization status, notice period/availability date, and portfolio/code repository link.',
    expectedMissingCount: 3,
    content: `CANDIDATE INTAKE PROFILE - SENIOR SYSTEMS ENGINEER

Full Name: David K. Chen
Position Applied: Senior Distributed Systems Architect
Current Role: Lead Backend Engineer at Apex Tech
Primary Skills: Go, Kubernetes, Rust, gRPC, Distributed Consensus
Highest Degree: M.S. in Computer Science (2020)
Current Annual Compensation: $165,000
Expected Compensation: $190,000 - $210,000
Location: Seattle, WA (Open to Remote)`
  },
  {
    id: 'hospital-intake',
    title: 'Emergency Medical Inpatient Intake',
    caseType: 'Emergency Room Inpatient Intake',
    domain: 'Clinical & Hospital Administration',
    badge: 'Clinical / Triage',
    description: 'Urgent admission profile with acute symptoms but missing known drug allergies, emergency contact phone, and primary care physician.',
    expectedMissingCount: 3,
    content: `PATIENT CLINICAL ADMISSION RECORD

Patient Name: Maria Rodriguez
Date of Birth: 14-Aug-1972
Triage Category: Priority 2 (Urgent)
Presenting Complaint: Acute substernal chest discomfort radiating to left shoulder
Blood Pressure: 154/96 mmHg
Heart Rate: 104 bpm
SpO2: 96% on room air
Known Conditions: Type 2 Diabetes, Hypertension
Current Medications: Metformin 500mg, Lisinopril 10mg`
  },
  {
    id: 'vendor-onboarding',
    title: 'Enterprise Vendor Procurement Agreement',
    caseType: 'Commercial Vendor Compliance & Onboarding',
    domain: 'Corporate Procurement & Compliance',
    badge: 'Legal / Procurement',
    description: 'Supplier contract draft missing Federal Tax ID / EIN, certificate of general liability insurance, and authorized signatory resolution.',
    expectedMissingCount: 3,
    content: `VENDOR ONBOARDING QUESTIONNAIRE

Company Legal Name: CloudNova Solutions LLC
Business Type: Cloud Infrastructure Consulting
Registered Address: 400 Pine Street, Suite 500, Austin, TX 78701
Primary Contact: Sarah Jenkins, VP of Business Development
Email: s.jenkins@cloudnovasolutions.com
Annual Revenue: $4.2M
Services to Provide: Multi-cloud migration & 24/7 DevOps monitoring
Payment Terms Requested: Net 30`
  }
];
