# CS432 - Databases | Assignment 2 | Track 1
### CheckInOut - Hostel Management System
**Mohit Kamlesh Panchal - 23110208**

---

## Module A - Lightweight DBMS with B+ Tree Index

B+ Tree implemented from scratch in Python, used as the indexing engine for an in-memory DBMS.

| What | Where |
|---|---|
| B+ Tree implementation | `module-a/database/bplustree.py` |
| Table & DatabaseManager | `module-a/database/table.py`, `db_manager.py` |
| BruteForceDB (baseline) | `module-a/database/bruteforce.py` |
| Performance benchmarking | `module-a/database/performance_analyzer.py` |
| Report + visualisations + benchmarks | `module-a/report.ipynb` |

---

## Module B - Local API Development, RBAC, and Database Optimisation

Next.js web app with JWT auth, role-based access control, audit logging, and SQL indexing.

| What | Where |
|---|---|
| API routes (CRUD) | `module-b/app/api/` |
| Auth (JWT + bcrypt) | `module-b/lib/auth.ts` |
| RBAC middleware | `module-b/lib/middleware.ts` |
| Audit logging | `module-b/lib/audit.ts` |
| Database schema (Drizzle) | `module-b/lib/db/schema.ts` |
| SQL indexes | `module-b/sql/indexes.sql` |
| Benchmark script | `module-b/sql/benchmark.py` |
| Audit log file | `module-b/logs/audit.log` |
| Report | `module-b/report.pdf` |
