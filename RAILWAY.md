Railway deploy (Dockerfile)

- Use Dockerfile located at: `AgendaDoVale.API/Dockerfile`
- The Dockerfile builds only the API and frontend static files; it does not start PostgreSQL.
- In Railway, add a PostgreSQL plugin or external Postgres service.

- Set env vars/secrets in Railway:
  - `DATABASE_URL` = private connection URL from Railway Postgres plugin
    - ex: `postgresql://postgres:password@railway_private_domain:5432/railway`
  - `DATABASE_PUBLIC_URL` = public connection URL if needed
    - ex: `postgresql://postgres:password@railway_tcp_proxy_domain:port/railway`
  - `PGHOST` = `{{RAILWAY_PRIVATE_DOMAIN}}`
  - `PGPORT` = `5432`
  - `PGDATABASE` = `{{POSTGRES_DB}}`
  - `PGUSER` = `{{POSTGRES_USER}}`
  - `PGPASSWORD` = `{{POSTGRES_PASSWORD}}`
  - `Jwt__Secret`
  - `Cors__AllowedOrigins__0` = frontend URL

- Railway provides `PORT`; Dockerfile respects `PORT`.

- Do not rely on `localhost:5432` in production. The app rejects localhost in non-development environments.
