# Projet

Webapp du projet hackathon MIA10.

## Docker

### Start prod

```shell
make prod
# ou
docker compose up -d --build
```

## Natif

Pour lancer le projet en local sans utiliser Docker, il faut créer le fichier .env.

```shell
cp .env.example .env
```

Version node.js minimale: 20.6.0

### Start dev

```shell
npm run dev
```

### Start prod

```shell
npm run build
npm run start
```

## Techos utilisées

- Adonis (Framework back)
- Inertia
- React (Lib front)
- Emotion (Style)
- Docker
