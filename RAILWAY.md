Railway deploy (Dockerfile)

- Use Dockerfile located at: `AgendaDoVale.API/Dockerfile`
- Set env vars/secrets in Railway:
  - `ConnectionStrings__DefaultConnection`
  - `Jwt__Secret`
  - `Cors__AllowedOrigins__0` (frontend URL)

- Railway provides `PORT`; Dockerfile respects `PORT`.
