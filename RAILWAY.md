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
  - `Jwt__Secret` = JWT signing secret (32+ chars)
  - `Jwt__Issuer`
  - `Jwt__Audience`
  - `Cors__AllowedOrigins__0` = frontend URL

- Local development
  - Use user-secrets for local env values:
    - `dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Database=AgendaDoVale;Username=postgres;Password=<senha>"`
    - `dotnet user-secrets set "Jwt:Secret" "<sua-chave-32+>"`
    - `dotnet user-secrets set "Jwt:Issuer" "AgendaDoVale"`
    - `dotnet user-secrets set "Jwt:Audience" "AgendaDoVale"`

- Railway provides `PORT`; Dockerfile respects `PORT`.

- Do not rely on `localhost:5432` in production. The app rejects localhost in non-development environments.
