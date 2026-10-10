# Gavran Poultry Prisma Schema

This directory contains the Prisma schema definition for the Gavran Poultry Management System based on the database documentation.

## Prisma Schema Structure

The schema defines entities for:
- Farms and Sheds
- Users and Roles (including farm memberships)  
- Bird management (Batches, Individual Birds)
- Egg and Incubation operations
- Health records and veterinary systems
- Feed and water systems
- Environment monitoring
- Workers and tasks
- Sales and purchases
- Financial records
- Alert systems
- Audit logs

## Configuration

This schema requires a MySQL database connection in the `.env` file:
```
DATABASE_URL="mysql://user:password@localhost:3306/gavran_poultry_dev"
```

## Commands

To work with this schema:
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:studio` - Launch Prisma Studio UI
- `npm run prisma:migrate` - Create database migrations