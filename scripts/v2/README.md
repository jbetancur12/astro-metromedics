# Vista previa del rediseño (v2)

Publica el rediseño en un subdominio aparte, sin tocar el sitio real
(metromedicslab.com) y sin que se indexe.

## Pasos (una sola vez)

1. **DNS:** crear un registro `A` de `v2` apuntando a `209.97.156.169`.
2. **Nginx** (como root, desde la consola de DigitalOcean): copiar
   `scripts/v2/nginx-v2.sh` al servidor y correr
   `V2_PASS='la-clave' bash nginx-v2.sh`.
3. **HTTPS:** `certbot --nginx -d v2.metromedicslab.com`.

## Cada despliegue

```bash
bash deploy-v2.sh
```

## Qué protege la vista previa

- Contraseña (autenticación básica de nginx), si se define `V2_PASS`.
- `X-Robots-Tag: noindex` en nginx, `<meta robots noindex>` en cada página y
  `robots.txt` con `Disallow: /`. El sitemap no se genera.
- Sin analítica (GTM, PostHog, Pixel).
- El formulario de contacto y el modal de leads quedan apagados: la API apunta
  a un dominio inexistente a propósito, para que no lleguen correos a comercial.

El build normal (`npm run build`, `deploy.sh`) no cambia.
