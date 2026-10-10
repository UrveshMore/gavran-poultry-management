# Gavran Poultry Management — Database Design

## 1. Purpose

This document defines the planned MySQL database architecture for the Gavran/Desi Poultry Management application.

The database must support:
- Farm and shed management
- Bird and batch management
- Egg management
- Incubation and hatchery management
- Breeding and genealogy
- Health and veterinary records
- Mortality
- Feed and water
- Environment
- Biosecurity
- Worker management and training
- Tasks
- Sales and customers
- Suppliers and purchases
- Inventory
- Finance
- Payments and outstanding balances
- Alerts
- Reports
- Documents and photos
- QR codes
- Auditability
- Future offline synchronization
- Future IoT integration
- Safe AI-assisted record search and reporting

This document is design-only. It does not define Prisma code or migrations.

---

## 2. Database Principles

- MySQL is the system of record.
- Prisma will be the planned ORM.
- Referential integrity must be enforced.
- Important multi-step operations must use transactions.
- Business rules belong in the application/backend layer.
- Financial records must be auditable.
- Important farm relationships must remain traceable.
- Avoid unnecessary duplication.
- Avoid premature complexity.
- Derived/reporting data must not become the authoritative source of transactional truth.

---

## 3. ID and Timestamp Strategy

All major entities should use stable primary identifiers.

Recommended application strategy:
- UUID identifiers for major domain entities.
- Created timestamp.
- Updated timestamp.
- Optional archived/deleted timestamp where appropriate.

Operational records must preserve the original event date/time separately from system metadata when those concepts differ.

---

## 4. Major Data Categories

### Master/reference data
Examples:
- farms
- sheds
- users
- roles
- customers
- suppliers
- medicine reference records
- feed reference records
- configuration records

### Operational transactions
Examples:
- egg collection
- incubation events
- candling
- hatching
- feed consumption
- water observations
- mortality
- tasks
- vaccinations
- medicine administration

### Inventory
Examples:
- eggs
- feed
- medicine
- supplies
- equipment-related stock

### Financial transactions
Examples:
- income
- expenses
- purchases
- sales
- payments
- salaries

### Audit data
Examples:
- user actions
- important record changes
- financial changes
- permission changes

### Derived/reporting data
Examples:
- hatch rate
- fertility rate
- mortality percentage
- feed cost
- batch profitability
- farm profitability

---

## 5. Farm

Entity: `farms`

Purpose:
Represents a poultry farm/business location.

Key fields:
- id
- name
- code
- owner/user reference
- address/location fields
- active status
- timestamps

Relationships:
- farm → sheds
- farm → users/memberships
- farm → bird batches
- farm → eggs
- farm → incubators
- farm → financial records

Constraints:
- farm code should be unique where used.

---

## 6. Shed

Entity: `sheds`

Purpose:
Represents a physical poultry shed/section.

Key fields:
- id
- farm_id
- name
- code
- capacity
- shed type
- active status
- timestamps

Relationships:
- shed → batches
- shed → environment observations
- shed → biosecurity records
- shed → tasks

Constraints:
- shed belongs to exactly one farm.
- shed code should be unique within a farm.

---

## 7. Users and Roles

Core entities:
- users
- roles
- user_roles
- farm_memberships

Roles:
- Owner
- Farm Manager
- Worker
- Family Member
- Accountant
- Veterinarian/Advisor
- Read-only Viewer

Authorization must be enforced in backend operations.

A frontend role check is never sufficient by itself.

---

## 8. Bird Batches

Entity: `bird_batches`

Purpose:
Represents groups of ordinary poultry managed together.

Key fields:
- id
- farm_id
- shed_id
- batch_code
- bird_type/breed
- source
- hatch/source date
- acquisition date
- initial quantity
- current quantity
- male quantity
- female quantity
- status
- notes
- timestamps

Relationships:
- batch → shed
- batch → birds when individual tracking is used
- batch → health records
- batch → feed usage
- batch → mortality
- batch → sales
- batch → breeding relationships where applicable

---

## 9. Individual Birds

Entity: `birds`

Use individual tracking only where justified.

Examples:
- breeders
- valuable birds
- sick birds
- special birds
- birds requiring individual history

Key fields:
- id
- batch_id
- bird identifier/tag
- sex
- breed
- birth/hatch reference
- status
- parent references when known
- timestamps

The system must not require every ordinary bird to have an individual row.

---

## 10. Breeding Groups and Genealogy

Entities:
- breeding_groups
- breeding_group_members
- bird_parent_relationships

Purpose:
Track breeding relationships and lineage.

Traceability:

Breeder / breeding group
→ Egg
→ Incubation batch
→ Hatch
→ Chick batch
→ Bird/batch
→ Breeder
→ Future egg

Parent information must remain historical where possible and must not be silently overwritten.

---

## 11. Eggs

Core entities:
- eggs
- egg_collections
- egg_inventory_movements

Egg fields should support:
- collection date/time
- source farm/bird/breeding group where known
- quantity
- quality
- size/grade if required
- destination
- status
- storage information
- incubation eligibility

Egg destinations may include:
- table/sale
- incubation
- rejected
- broken/damaged
- internal use
- other configured destination

---

## 12. Incubators

Entity: `incubators`

Key fields:
- id
- farm_id
- name
- code
- capacity
- incubator type
- status
- configured temperature/humidity references if needed
- timestamps

---

## 13. Incubation Batches

Entity: `incubation_batches`

Key fields:
- id
- incubator_id
- source egg collection/reference
- start date/time
- expected hatch date
- quantity placed
- status
- notes
- timestamps

The expected hatch date must be derived from configured incubation rules and remain editable only through authorized workflows.

---

## 14. Incubation Events

Entity: `incubation_events`

Examples:
- batch started
- turning/check
- temperature observation
- humidity observation
- movement
- transfer
- issue
- completion

Important events should contain:
- event date/time
- event type
- recorded by
- notes
- relevant measurements

---

## 15. Candling

Entity: `candling_events`

Track:
- date/time
- incubation batch
- eggs checked
- fertile
- infertile
- dead embryo
- removed
- recorder
- notes

Candling history must remain auditable.

---

## 16. Hatching

Entities:
- `hatch_events`
- `chick_batches`

Track:
- incubation batch
- hatch date
- successful hatch count
- unhatched count
- weak/dead count where applicable
- chick batch created
- notes

Hatch results must remain connected to the originating incubation batch.

---

## 17. Health

Entity: `health_records`

Purpose:
Store observed and approved health-related records.

Potential fields:
- id
- farm
- batch or bird reference
- observation date
- record type
- symptoms/observations
- approved status/category
- recorded by
- notes
- attachments

The database must not turn free-text symptoms into automatically generated medical decisions.

---

## 18. Veterinary SOPs

Entity: `veterinary_sops`

Purpose:
Store approved farm/veterinarian instructions.

Key fields:
- id
- title
- category
- version
- content/reference
- approved_by
- approved_at
- status
- effective date
- expiry/review date
- timestamps

These records are the authority for worker-facing veterinary instructions.

---

## 19. Vaccination

Entities:
- vaccination_plans
- vaccination_records

Vaccination records should reference approved schedules/configurations.

Track:
- batch/bird
- vaccine/reference
- scheduled date
- actual date
- approved dosage/reference from configured SOP
- administrator
- notes
- status

The application must never invent vaccine dosage or schedules.

---

## 20. Medicine

Entities:
- medicines
- medicine_records

Medicine inventory should be distinct from medicine administration history.

Medicine records should reference approved SOP information where applicable.

AI-generated treatment instructions must never be treated as authoritative database records.

---

## 21. Mortality

Entity: `mortality_records`

Track:
- date/time
- farm
- shed
- batch/bird
- age/day if applicable
- quantity
- suspected reason or observation category
- symptoms/notes
- photo/document reference
- disposal information
- recorded by

Mortality percentages should be calculated from stored operational data.

---

## 22. Feed

Entities:
- feed_types
- feed_inventory
- feed_receipts
- feed_consumption

Track:
- feed type
- supplier
- quantity
- unit
- cost
- stock
- batch
- date
- consumption
- worker/recorder

Feed cost should be traceable to batch usage where possible.

---

## 23. Water

Entities:
- water_sources
- water_profiles
- water_observations
- water_usage

Track:
- source
- date/time
- quantity
- quality observations
- cleaning/maintenance
- issues
- recorder

Actual water usage and observational quality data must remain distinct.

---

## 24. Environment

Entity group:
- environment_observations
- environment_devices/configuration

Possible measurements:
- temperature
- humidity
- ventilation observation
- power status
- other configured environmental readings

Future IoT measurements should reuse a controlled boundary rather than altering business entities unnecessarily.

---

## 25. Biosecurity

Entities:
- biosecurity_checks
- biosecurity_incidents
- biosecurity_tasks

Track:
- area
- checklist/task
- date/time
- result
- issue
- corrective action
- responsible person

---

## 26. Workers

Core entities:
- workers
- worker_assignments
- worker_permissions where required
- worker_documents

Workers may be linked to application users.

Track employment/assignment status without mixing this with authentication data.

---

## 27. Worker Training

Entities:
- training_courses
- training_modules
- training_assignments
- training_attempts
- training_completions
- training_authorizations

Support:
- SOP training
- instructions
- videos/documents
- quizzes
- completion
- authorization

Training content must not independently create veterinary treatment instructions.

---

## 28. Tasks

Entity: `tasks`

Track:
- title
- description
- task type
- farm/shed/batch reference
- assigned worker
- due date/time
- status
- completion date/time
- related SOP
- notes

Tasks should support both recurring configured work and one-off operations.

---

## 29. Customers and Sales

Entities:
- customers
- sales_orders
- sales_order_items
- sales_deliveries
- sales_payments

Support products such as:
- eggs
- chicks
- birds
- other configured farm products

Sales must preserve quantity, price, customer, payment, and delivery relationships.

---

## 30. Suppliers and Purchases

Entities:
- suppliers
- purchase_orders
- purchase_order_items
- purchase_receipts
- supplier_payments

Purchases may include:
- feed
- medicine
- equipment
- supplies
- maintenance items

---

## 31. Inventory

Inventory should support:
- item master
- stock movements
- receipts
- consumption
- adjustments
- transfers
- wastage

Important stock changes should always have an auditable movement record.

---

## 32. Finance

Core entities may include:
- financial_accounts
- income_records
- expense_records
- payment_records
- salary_records
- loan_records
- loan_payments

Expenses should support categories such as:
- feed
- medicine
- electricity
- transport
- maintenance
- labour
- equipment
- other configured expenses

---

## 33. Payments and Outstanding

Payment records must link to the originating transaction where applicable.

Support:
- customer payments
- supplier payments
- salary payments
- expense payments
- outstanding balances

Balances should preferably be calculated from transaction history rather than stored as unverified manual totals.

---

## 34. Alerts

Entity: `alerts`

Track:
- alert type
- severity
- related entity
- due/trigger time
- recipient
- status
- acknowledgement
- resolution

Alerts must be based on configured/approved rules.

---

## 35. Reports

Reports should primarily be generated from transactional data.

Common derived metrics:
- fertility %
- hatch %
- mortality %
- feed cost
- sales total
- expense total
- batch profitability
- farm profitability

Do not use manually edited report totals as the authoritative source.

---

## 36. Photos and Documents

Entities:
- documents
- document_links

Files may be related to:
- birds
- batches
- eggs
- mortality
- workers
- suppliers
- customers
- finance
- SOPs

Metadata should identify the owning entity and uploader.

---

## 37. QR Codes

Entity: `qr_codes`

QR records should map to controlled application entities such as:
- batch
- bird
- incubator
- shed
- equipment

QR codes must not bypass authorization.

---

## 38. Audit Logs

Entity: `audit_logs`

Track important actions such as:
- creation
- modification
- archival
- financial changes
- permission changes
- health/veterinary record changes
- mortality
- inventory adjustments

Audit information should include:
- actor
- action
- entity
- entity id
- timestamp
- relevant before/after information where appropriate

Do not log secrets.

---

## 39. Offline Synchronization

Future entity:
`sync_operations`

Possible metadata:
- client operation id
- device id
- user
- entity
- operation
- timestamp
- sync state
- conflict state

Offline synchronization must not silently overwrite authoritative records.

---

## 40. IoT Boundary

Future IoT data may include:
- incubator temperature
- incubator humidity
- shed temperature
- shed humidity
- power
- water

IoT telemetry should be separated from core transactional records and should not directly modify veterinary, financial, or other authoritative business records.

---

## 41. AI Boundary

AI may:
- search stored records
- summarize records
- generate reports from actual data
- explain approved SOP text
- identify missing records
- assist administrative workflows

AI must not:
- diagnose disease
- prescribe medicine
- invent doses
- invent vaccination schedules
- invent treatment protocols
- override veterinarian-approved SOPs
- create authoritative medical records without approval
- perform financial transactions automatically

---

## 42. Important Relationships

Core traceability:

Farm
→ Shed
→ Bird Batch
→ Bird

Breeding Group
→ Breeder Birds
→ Egg
→ Incubation Batch
→ Candling
→ Hatch
→ Chick Batch
→ Bird/Batch

Operational relationships:

Batch
→ Health
→ Vaccination
→ Medicine
→ Mortality
→ Feed Consumption
→ Sales

Financial relationships:

Purchase
→ Inventory
→ Expense/Payment

Sale
→ Delivery
→ Payment
→ Customer Balance

---

## 43. Indexing Strategy

Indexes should exist for frequently queried relationships and operational filters.

Important candidates:
- farm_id
- shed_id
- batch_id
- bird_id
- incubator_id
- incubation_batch_id
- customer_id
- supplier_id
- worker_id
- user_id
- status
- event/transaction date
- created_at

Composite indexes should be used where real query patterns justify them.

---

## 44. Unique Constraints

Potential unique constraints:
- farm code
- shed code within farm
- batch code within farm
- bird tag within farm where applicable
- incubator code within farm
- employee/worker code where used
- customer code where used
- supplier code where used
- QR identifier

Uniqueness must respect the business scope of the identifier.

---

## 45. Transaction Requirements

Database transactions are required when a single business operation changes multiple related records.

Examples:
- receiving stock
- recording a sale and payment
- hatching and creation of a chick batch
- mortality and batch quantity update
- inventory consumption
- financial posting
- payment allocation

Operations must fail atomically when required.

---

## 46. Archive and Retention

Historical operational, financial, health, mortality, incubation, and audit data should not be hard-deleted casually.

Use archival/status mechanisms where required.

Financial and audit history should remain traceable.

---

## 47. V1 vs Future

V1 should focus on the core relational database and reliable farm workflows.

Future capabilities:
- offline sync
- IoT telemetry
- advanced analytics
- AI assistance
- automation integrations

Future features must not compromise the integrity of the core transactional database.

---

## 48. Prisma Readiness

The final Prisma schema must be generated only after:
1. Product requirements are approved.
2. Architecture is approved.
3. Database design is reviewed.
4. Relationships and constraints are reviewed.
5. Naming conventions are finalized.

This document intentionally does not contain Prisma implementation code.

---

## 49. Review Gate

Before implementation, review:
- entity completeness
- relationship correctness
- traceability
- permission boundaries
- financial integrity
- medical safety
- auditability
- indexing
- transaction boundaries
- future extensibility

