# Gavran Poultry Management — Project Instructions

## 1. Project Purpose

Build a comprehensive Gavran/Desi poultry farm management application.

The application must support:
- Farm and shed management
- Bird and batch management
- Individual important-bird tracking
- Egg collection and inventory
- Incubation and hatchery management
- Candling and hatching
- Breeding and genealogy
- Health records
- Vaccination records
- Medicine records
- Mortality tracking
- Feed management
- Water management
- Environment monitoring
- Biosecurity
- Worker management
- Worker training and SOPs
- Tasks and daily operations
- Sales and customers
- Purchases and suppliers
- Inventory
- Finance and expenses
- Payments and outstanding amounts
- Reports
- Alerts and reminders
- Photos/documents
- QR codes
- Offline/PWA support
- Future IoT integration
- Future AI assistance under strict safety rules

Build the system incrementally and safely.

## 2. Development Principles

- Build one vertical feature at a time.
- Do not implement unrelated features.
- Do not delete working functionality without explicit approval.
- Do not make speculative changes.
- Prefer simple, maintainable architecture.
- Keep business logic on the backend.
- Keep the database as the source of truth.
- Use strict TypeScript.
- Validate all external input.
- Use transactions for operations requiring atomicity.
- Maintain traceability between related farm records.
- Every completed feature must be testable.

## 3. Technology Direction

Planned stack:

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide icons
- React Hook Form
- Zod
- TanStack Query
- Recharts

Backend:
- Node.js
- Express
- TypeScript

Database:
- MySQL
- Prisma ORM

Testing:
- Vitest
- Supertest
- Playwright where appropriate

Application direction:
- PWA
- Responsive
- Mobile-first for workers
- Desktop-friendly for management

Do not add major dependencies without justification.

## 4. Roles and Permissions

Primary application roles:

- Owner
- Farm Manager
- Worker
- Family Member
- Accountant
- Veterinarian/Advisor
- Read-only Viewer

Permissions must follow least privilege.

Workers must only access the information and actions required for their assigned responsibilities.

Sensitive financial and administrative functions must not automatically be available to workers.

## 5. Medical and Veterinary Safety

This is a critical rule.

The application must NEVER invent:
- diagnoses
- medicine recommendations
- medicine doses
- vaccination doses
- treatment protocols
- disease predictions presented as medical facts
- veterinary schedules

Medical and veterinary instructions must come only from approved farm/veterinarian SOP records or explicitly configured farm records.

Workers must receive approved instructions rather than being asked to make independent veterinary decisions.

AI must NEVER generate a treatment protocol from symptoms or free-form user input.

AI may:
- search approved records
- summarize approved records
- explain existing approved SOP information
- identify missing information
- organize records

AI must not independently prescribe or recommend veterinary treatment.

## 6. Poultry Traceability

Maintain traceability wherever applicable:

Breeder / breeding group
→ Egg
→ Incubation batch
→ Incubator
→ Candling events
→ Hatch
→ Chick batch
→ Bird/batch
→ Breeder
→ Future egg

The system must preserve source and relationship information.

## 7. Batch vs Individual Tracking

Use batch-level tracking for normal poultry operations where appropriate.

Use individual-bird tracking for:
- breeders
- valuable birds
- sick birds
- special birds
- birds requiring individual history

Do not force individual tracking for every ordinary bird unless the feature specifically requires it.

## 8. Farm Operations

The system should support operational records for:

- Farms
- Sheds
- Batches
- Birds
- Eggs
- Incubators
- Incubation batches
- Candling
- Hatching
- Breeding groups
- Feed
- Water
- Environment
- Health
- Mortality
- Biosecurity
- Workers
- Tasks
- Training
- SOPs

## 9. Finance

Financial records must be auditable.

Support:
- income
- expenses
- purchases
- sales
- supplier payments
- customer payments
- outstanding amounts
- worker salaries
- electricity
- transport
- maintenance
- feed costs
- medicine costs
- inventory costs
- optional loans/EMI
- batch profitability
- farm profitability
- cash flow
- profit and loss

Do not silently change financial records.

Use proper transaction handling where required.

## 10. Auditability

Important changes must be traceable.

Maintain appropriate audit information for:
- financial changes
- inventory changes
- health records
- mortality
- vaccination
- medicine
- user/role changes
- important farm configuration changes

Do not expose audit functionality to unauthorized users.

## 11. Security

- Authenticate users securely.
- Authorize every protected operation.
- Never trust frontend role checks alone.
- Validate all API input.
- Prevent unauthorized access to another user's/farm's data.
- Do not expose secrets in source code.
- Do not commit credentials.
- Do not log passwords, tokens, or sensitive secrets.

## 12. API Rules

Backend APIs must:
- validate input
- enforce authorization
- return consistent responses
- handle errors safely
- avoid leaking internal errors
- use appropriate HTTP status codes
- keep business rules in backend/domain services

## 13. Database Rules

- Use MySQL.
- Use Prisma.
- Use proper foreign keys and relationships.
- Use indexes where justified.
- Preserve referential integrity.
- Avoid unnecessary duplication.
- Use timestamps where appropriate.
- Use IDs consistently.
- Use transactions for multi-step atomic operations.
- Do not create migrations until database design is approved.

## 14. Offline/PWA

The application should eventually support:
- installable PWA
- mobile-friendly worker experience
- offline operation for appropriate workflows
- queued changes
- synchronization
- conflict handling

Do not implement complex offline synchronization prematurely.

## 15. IoT

Future IoT support may include:
- incubator temperature
- incubator humidity
- shed temperature
- shed humidity
- power status
- water monitoring

IoT must remain separated from core business logic.

Do not implement hardware integration unless explicitly requested.

## 16. AI Safety

AI is an assistant, not the authority.

AI may:
- summarize farm data
- search records
- explain existing approved information
- generate reports from stored data
- help workers understand approved SOPs
- identify missing records
- assist with administrative workflows

AI must NOT:
- diagnose disease
- prescribe medicine
- invent doses
- invent vaccination schedules
- invent treatment plans
- override veterinarian-approved SOPs
- make financial transactions automatically
- make irreversible farm decisions without explicit authorization

## 17. UI/UX

The UI should be:
- modern
- clean
- responsive
- mobile-first
- accessible
- simple for workers
- information-rich for managers
- suitable for desktop administration

Avoid unnecessary complexity.

## 18. Worker Experience

Workers should have simple workflows for:
- today's tasks
- assigned batches
- feeding
- watering
- vaccination tasks
- approved medicine/SOP tasks
- mortality reporting
- egg collection
- incubation tasks
- environmental observations
- training

Workers should not be forced to navigate complex management screens.

## 19. Training

Training should support:
- SOP content
- instructions
- videos/documents where appropriate
- quizzes
- completion tracking
- certification/authorization where appropriate
- role-based training

Training content must not create unauthorized veterinary treatment instructions.

## 20. Alerts

Alerts may cover:
- incubation milestones
- candling dates
- expected hatching
- vaccination reminders from approved schedules
- feed stock
- water issues
- mortality thresholds
- assigned tasks
- outstanding payments
- inventory thresholds
- important operational deadlines

Alerts must be based on configured/approved rules.

## 21. Reporting

Reports may include:
- daily operations
- weekly/monthly farm summaries
- incubation performance
- hatch rate
- fertility
- mortality
- feed consumption
- water consumption
- sales
- expenses
- inventory
- profitability
- worker/task completion

Reports must use actual stored data.

## 22. Git Rules

- Never commit automatically.
- Never push automatically.
- Never reset or clean the repository without explicit approval.
- Never delete user files without explicit approval.
- Keep commits focused and meaningful.
- Before committing, review changed files and tests.

## 23. Documentation Rules

Important project documentation should include:
- product requirements
- architecture
- database design
- API design
- development decisions

Documentation must remain aligned with the actual implementation.

Do not create documentation unless the current task explicitly requests it.

## 24. Change Control

Before modifying files:
1. Understand the current state.
2. Identify the minimum required changes.
3. Modify only files relevant to the current task.
4. Verify the result.
5. Report exactly what changed.

Never silently expand the scope.

## 25. Current Project Stage

Current stage:

PROJECT FOUNDATION

Completed/planned foundation:
- OpenCode configuration
- Agent team configuration
- Project instructions

Next project work must be performed one controlled step at a time.

Do not start application implementation until the required product, architecture, database, and implementation plans have been reviewed and approved.

## 26. Required Completion Report

After completing a requested task, report:

- Files created
- Files modified
- Files deleted
- Tests/checks performed
- Any warnings or unresolved issues

Do not perform additional tasks after completing the requested task.
