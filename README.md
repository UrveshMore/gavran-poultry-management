# Gavran Poultry Management System

## Project Overview

This is the foundation for a comprehensive Gavran/Desi poultry farm management application. The system supports farm and shed management, bird and batch tracking, egg collection and inventory, incubation operations, health records, worker management, and more.

## Setup Instructions (Windows PowerShell)

1. **Prerequisites:**
   - Node.js 18.x (LTS) installed
   - Git

2. **Installation:**
   ```powershell
   # Install dependencies for both client and server
   Set-Location client
   npm install
   Set-Location ../server  
   npm install
   ```

3. **Development:**
   ```powershell
   # Start development servers
   Set-Location client
   npm run dev
   
   # In another terminal
   Set-Location server
   npm run dev
   ```

4. **Building:**
   ```powershell
   # Build client and server projects
   Set-Location client
   npm run build
   
   Set-Location ../server
   npm run build
   ```

5. **Testing:**
   ```powershell
   # Run tests for both client and server 
   Set-Location client
   npm run test
   
   Set-Location ../server
   npm run test
   ```

## Project Structure

```
gavran-poultry-management/
├── client/           # Frontend (React + TypeScript)
├── server/           # Backend (Node.js + Express + TypeScript) 
├── docs/             # Documentation and requirements
├── .opencode/        # OpenCode agent configuration
├── AGENTS.md         # Project instructions and requirements
└── opencode.json     # OpenCode permissions
```

## Features in Development

- Farm and shed management (planned)
- Bird and batch tracking (planned) 
- Egg collection and inventory (planned)
- Incubation and hatchery operations (planned)
- Health records and veterinary safety (planned)
- Worker management and training (planned)
- Financial records and reporting (planned)
- Audit logs and traceability (planned)
- PWA support and offline capabilities (planned)

## Development Roadmap

This is the **PROJECT FOUNDATION** stage. Subsequent stages will build out the full set of features incrementally.

This system follows strict requirements from AGENTS.md including:
- Medical and veterinary safety rules
- Auditability principles  
- Role-based permissions
- PWA support
- Offline capability planning
- IoT integration safety measures

## License

MIT License - See LICENSE for details.