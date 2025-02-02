---
title: Running with Docker, Traefik and NGINX
summary: An overview guide on how to run chibisafe with Traefik and NGINX
sidebar_position: 4
---

This guide provides detailed steps to deploy **chibisafe** using Docker, Traefik, and NGINX. It assumes that you have Docker, Docker Compose, and a running Traefik instance already installed and configured. If you don't have a Traefik installation, please refer to the [official Traefik documentation](https://doc.traefik.io/traefik).

> **Important:**  
> Replace all instances of `your-domain-name.com` and `cdn.your-domain-name.com` with your actual domain names to ensure correct routing and SSL certificate issuance.

## Prerequisites

Before proceeding, ensure you have the following installed:
- **Docker** ([Docs](https://docs.docker.com/engine/install))
- **Docker Compose** ([Docs](https://docs.docker.com/compose/install))
- **Traefik** as a reverse proxy

To verify your installation, run:
```bash
docker --version
docker-compose --version
```

## Directory Structure

Ensure you have the following directory structure:

```
/path/to/chibisafe
└── docker-compose.yml
/path/to/traefik
└── dynamic.yml # This is your Traefik configuration file.
```

## Chibisafe Docker Configuration

##### `path/to/chibisafe/docker-compose.yml`
```yml
services:
  chibisafe:
    restart: unless-stopped
    container_name: chibisafe
    image: chibisafe/chibisafe:latest
    hostname: chibisafe
    environment:
      - BASE_API_URL=http://chibisafe-server:8000
    networks:
      - traefik

    labels:
      traefik.enable: true

      # HTTP Router
      traefik.http.routers.chibisafe-http.entrypoints: web
      traefik.http.routers.chibisafe-http.middlewares: globalHeaders@file,redirect-to-https@docker,robotHeaders@file # Optional
      traefik.http.routers.chibisafe-http.rule: Host(`your-domain-name.com`) && !PathPrefix(`/api`) && !PathPrefix(`/docs`)
      traefik.http.routers.chibisafe-http.service: chibisafe

      # HTTPS Router (Secure)
      traefik.http.routers.chibisafe.entrypoints: websecure
      traefik.http.routers.chibisafe.middlewares: globalHeaders@file,secureHeaders@file,robotHeaders@file # Optional
      traefik.http.routers.chibisafe.rule: Host(`your-domain-name.com`) && !PathPrefix(`/api`) && !PathPrefix(`/docs`)
      traefik.http.routers.chibisafe.service: chibisafe
      traefik.http.routers.chibisafe.tls.certresolver: cfdns # Alternatively, you can use letsencrypt
      traefik.http.routers.chibisafe.tls.options: securetls@file

      traefik.http.services.chibisafe.loadbalancer.server.port: 8001

  chibisafe-server:
    restart: unless-stopped
    container_name: chibisafe-server
    image: chibisafe/chibisafe-server:latest
    hostname: chibisafe-server
    networks:
      - traefik

    labels:
      traefik.enable: true

      # HTTP Router
      traefik.http.routers.chibisafe-server-http.entrypoints: web
      traefik.http.routers.chibisafe-server-http.middlewares: globalHeaders@file,redirect-to-https@docker,robotHeaders@file # Optional
      traefik.http.routers.chibisafe-server-http.rule: Host(`your-domain-name.com`) && (PathPrefix(`/api`) || PathPrefix(`/docs`))
      traefik.http.routers.chibisafe-server-http.service: chibisafe-server

      # HTTPS Router (Secure)
      traefik.http.routers.chibisafe-server.entrypoints: websecure
      traefik.http.routers.chibisafe-server.middlewares: globalHeaders@file,secureHeaders@file,robotHeaders@file
      traefik.http.routers.chibisafe-server.rule: Host(`your-domain-name.com`) && (PathPrefix(`/api`) || PathPrefix(`/docs`)) # Optional
      traefik.http.routers.chibisafe-server.service: chibisafe-server
      traefik.http.routers.chibisafe-server.tls.certresolver: cfdns # Alternatively, you can use letsencrypt
      traefik.http.routers.chibisafe-server.tls.options: securetls@file

      traefik.http.services.chibisafe-server.loadbalancer.server.port: 8000

    volumes:
      - ./database:/app/database:rw
      - ./uploads:/app/uploads:rw
      - ./logs:/app/logs:rw

  chibisafe-cdn:
    restart: unless-stopped
    container_name: chibisafe-cdn
    image: nginx:latest
    hostname: chibisafe-cdn
    networks:
      - traefik

    labels:
      traefik.enable: true

      # HTTP Router
      traefik.http.routers.chibisafe-cdn-http.entrypoints: web
      traefik.http.routers.chibisafe-cdn-http.middlewares: globalHeaders@file,redirect-to-https@docker,robotHeaders@file # Optional
      traefik.http.routers.chibisafe-cdn-http.rule: Host(`cdn.your-domain-name.com`) # Make sure to set this as "Serve Uploads From" in settings later.
      traefik.http.routers.chibisafe-cdn-http.service: chibisafe-cdn

      # HTTPS Router (Secure)
      traefik.http.routers.chibisafe-cdn.entrypoints: websecure
      traefik.http.routers.chibisafe-cdn.middlewares: globalHeaders@file,secureHeaders@file,robotHeaders@file # Optional
      traefik.http.routers.chibisafe-cdn.rule: Host(`cdn.your-domain-name.com`) # Make sure to set this as "Serve Uploads From" in settings later.
      traefik.http.routers.chibisafe-cdn.service: chibisafe-cdn
      traefik.http.routers.chibisafe-cdn.tls.certresolver: cfdns # Alternatively, you can use letsencrypt
      traefik.http.routers.chibisafe-cdn.tls.options: securetls@file

      traefik.http.services.chibisafe-cdn.loadbalancer.server.port: 80

    volumes:
      - ./uploads:/usr/share/nginx/html:ro

networks:
  traefik:
    external: true
```
## Traefik Configuration

The config below includes the optional middleware defined in the `docker-compose.yml` above. You can find more on the config file from the [official Traefik documentation](https://doc.traefik.io/traefik/middlewares/overview/#configuration-example).

##### `path/to/traefik/dynamic.yml`
```yml
tls:
  options:
    securetls:
      minVersion: VersionTLS12
      sniStrict: true
      cipherSuites:
        - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
        - TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
        - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
        - TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305
        - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305

http:
  middlewares:
    globalHeaders:
      headers:
        frameDeny: false
        contentTypeNosniff: true

        hostsProxyHeaders:
          - 'X-Forwarded-Host'

        customResponseHeaders:
          server: ''
          x-xss-protection: ''

    secureHeaders:
      headers:
        sslProxyHeaders:
          X-Forwarded-Proto: https

    robotHeaders:
      headers:
        customResponseHeaders:
          X-Robots-Tag: 'none,noarchive,nosnippet,notranslate,noimageindex'
```

## Running the Setup

Execute the following commands to launch your services:

```bash
docker network create traefik

cd /path/to/traefik
docker-compose up -d

cd /path/to/chibisafe
docker-compose up -d
```

Once started, you should verify that the containers are running properly. If any issues arise, use:

```bash
docker logs <container_name>
```
