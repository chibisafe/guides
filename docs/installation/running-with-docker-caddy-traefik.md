---
title: Running with Docker, Caddy and Traefik
summary: An overview guide on how to run chibisafe with Caddy and Traefik
sidebar_position: 3
---

This guide will hopefully serve as a starting point in helping you set up chibisafe using Docker Compose with Caddy and Traefik for HTTPS support.

## Prerequisites
You need to have Docker and Docker Compose installed on your system before proceeding any further, as this guide already assumes they are.

## Directory Structure

Ensure you have the following directory structure:

```
/path/to/chibisafe
├── Caddyfile
└── docker-compose.yml
/path/to/traefik
└── docker-compose.yml
```

```yml title="chibisafe/docker-compose.yml"
services:
  chibisafe:
    image: chibisafe/chibisafe:latest
    environment:
      - BASE_API_URL=http://chibisafe_server:8000
    expose:
      - 8001
    restart: unless-stopped
    networks:
      - internal
  chibisafe_server:
    image: chibisafe/chibisafe-server:latest
    volumes:
      - ./database:/app/database:rw
      - ./uploads:/app/uploads:rw
      - ./logs:/app/logs:rw
    expose:
      - 8000
    restart: unless-stopped
    networks:
      - internal
  caddy:
    image: caddy:2-alpine
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./uploads:/app/uploads:ro
    expose:
      - 80
    environment:
      - BASE_URL=":80"
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.caddy.rule=Host(`your-domain-name.com`)"
      - "traefik.http.routers.caddy.entrypoints=https"
      - "traefik.http.routers.caddy.tls.certresolver=le"
    networks:
      - traefik_web
      - internal
networks:
  traefik_web:
    external: true
  internal:
    external: false
```


```caddyfile title="chibisafe/Caddyfile"
{$BASE_URL} {
	route {
		file_server * {
				root /app/uploads
				pass_thru
		}
		@api path /api/*
		reverse_proxy @api http://chibisafe_server:8000 {
				header_up Host {http.reverse_proxy.upstream.hostport}
				header_up X-Real-IP {http.request.header.X-Real-IP}
		}
		@docs path /docs*
		reverse_proxy @docs http://chibisafe_server:8000 {
				header_up Host {http.reverse_proxy.upstream.hostport}
				header_up X-Real-IP {http.request.header.X-Real-IP}
		}
		reverse_proxy http://chibisafe:8001 {
				header_up Host {http.reverse_proxy.upstream.hostport}
				header_up X-Real-IP {http.request.header.X-Real-IP}
		}
	}
}
```

```yml title="/path/to/traefik/docker-compose.yml"
services:
  traefik:
    image: traefik:v2.11
    container_name: "traefik"
    restart: always
    command:
   
      - "--api.insecure=true"
      - "--providers.docker"
      - "--providers.docker.exposedByDefault=false"
      - "--providers.docker.network=traefik_web"
      - "--entrypoints.http.address=:80"
      - "--entrypoints.http.http.redirections.entrypoint.to=https"
      - "--entrypoints.http.http.redirections.entrypoint.scheme=https"
      - "--entrypoints.https.address=:443"
      - "--entrypoints.https.http.tls.certResolver=le"
      - "--certificatesresolvers.le.acme.tlschallenge=true"
      - "--certificatesresolvers.le.acme.email=your@mail.com"
      - "--certificatesresolvers.le.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./letsencrypt:/letsencrypt
    networks:
      - traefik_web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik.rule=Host(`traefik.your-domain-name.com`)"
      - "traefik.http.routers.traefik.entrypoints=https"
      - "traefik.http.routers.traefik.tls.certResolver=le"
      - "traefik.http.routers.traefik.service=api@internal"
      - "traefik.http.services.traefik.loadbalancer.server.port=8080"

networks:
  traefik_web:
    external: true
```

## Run

```bash
docker network create traefik_web
cd /path/to/traefik
docker-compose up -d
cd /path/to/chibisafe
docker-compose up -d
```
