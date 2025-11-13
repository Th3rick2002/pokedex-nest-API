<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Stack de desarrollo

- NestJS
- MongoDB
- Docker
- Typescript
- pnpm


# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar `pnpm install`
3. Tener Nest CLI instalado `pnpm i -g @nestjs/cli`
4. Levantar MongoDB `docker-compose up -d`
5. Clonar el archivo `.env.template` y renombrar la copia `.env`
6. Llenar las variables de entorno de `.env`
7. Ejecutar `pnpm start:dev`
8. Ejecutar Seed `http:localhost:3200/api/seed/insert`