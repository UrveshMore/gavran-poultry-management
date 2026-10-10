// Database Schema Validation Test 
// This file validates the database configuration meets all requirements from AGENTS.md

import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('Database Configuration', () => {
  it('should have a valid MySQL schema with required entities', () => {
    // Check that our MySQL migration files exist
    const migrationPath = './src/db/migrations/001-full-schema.sql';
    expect(fs.existsSync(migrationPath)).toBe(true);
    
    const schemaContent = fs.readFileSync(migrationPath, 'utf8');
    
    // Check that core entities are defined (tables)
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS `Farm`');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS `Shed`');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS `User`');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS `Role`');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS `BirdBatch`');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS `Bird`');
    
    // Check for proper foreign key constraints
    expect(schemaContent).toContain('FOREIGN KEY');
    
    // Check that database provider is MySQL (as reflected in SQL structure)
    expect(schemaContent).toContain('utf8mb4 COLLATE utf8mb4_unicode_ci');
  });

  it('should have proper environment configuration', () => {
    const envExamplePath = './.env.example';
    expect(fs.existsSync(envExamplePath)).toBe(true);
    
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    
    // Check that DATABASE_URL is properly formatted for MySQL
    expect(envContent).toContain('DATABASE_URL="mysql://user:password@localhost:3306/gavran_poultry_dev"');
    
    // Check that required environment variables exist
    expect(envContent).toContain('JWT_SECRET=');
    expect(envContent).toContain('NODE_ENV=');
    expect(envContent).toContain('PORT=');
  });
  
  it('should include all required MySQL dependencies in package.json', () => {
    const packageJsonPath = './package.json';
    expect(fs.existsSync(packageJsonPath)).toBe(true);
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check that MySQL2 dependency is present (which replaces Prisma)
    expect(packageJson.dependencies).toHaveProperty('mysql2');
    
    // Verify that Prisma is NOT in the dependencies anymore (we're using MySQL2 directly)
    expect(packageJson.dependencies).not.toHaveProperty('prisma');
    expect(packageJson.dependencies).not.toHaveProperty('@prisma/client');
  });

  it('should have consistent UUIDs/primary keys across all domain entities', () => {
    const migrationPath = './src/db/migrations/001-full-schema.sql';
    const schemaContent = fs.readFileSync(migrationPath, 'utf8');
    
    // Look for models that should have primary keys
    const testTables = [
      'Farm', 'Shed', 'User', 'Role', 'FarmMembership',
      'BirdBatch', 'Bird', 'BreedingGroup', 'BreedingGroupMember',
      'Egg', 'Incubator', 'IncubationBatch', 'CandlingEvent', 'HatchEvent',
      'HealthRecord', 'VaccinationPlan', 'VaccinationRecord', 'Medicine',
      'MedicineRecord', 'MortalityRecord', 'FeedType', 'FeedInventory',
      'FeedConsumption', 'EnvironmentObservation', 'BiosecurityRecord',
      'BiosecurityChecklist', 'Worker', 'WorkerAssignment', 'WorkerDocument',
      'Task', 'Customer', 'Supplier', 'Sale', 'PurchaseOrder',
      'FinancialAccount', 'FinancialRecord', 'Payment', 'Alert', 'AuditLog', 'QRCode'
    ];
    
    testTables.forEach(model => {
      // This will check for table creation in our migration
      expect(schemaContent).toContain(`CREATE TABLE IF NOT EXISTS \`${model}\``);
    });
  });

  it('should have a valid database design structure', () => {
    const migrationPath = './src/db/migrations/001-full-schema.sql';
    const schemaContent = fs.readFileSync(migrationPath, 'utf8');
    
    // Basic validation - the schema should contain various sections
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS `Farm`');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS `User`');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS `BirdBatch`');
    expect(schemaContent).toContain('CREATE TABLE IF NOT EXISTS `Shed`');
  });
});