#!/bin/bash
# Crea el sitio v2 (vista previa del rediseño) en nginx. SE CORRE COMO ROOT,
# desde la consola de DigitalOcean. No modifica el sitio real.
#
# Uso:
#   V2_PASS='clave-segura' bash nginx-v2.sh              # con contraseña (recomendado)
#   V2_PASS='' bash nginx-v2.sh                          # sin contraseña, solo noindex
# Variables opcionales: V2_DOMINIO (por defecto v2.metromedicslab.com), V2_USER (por defecto metromedics)
#
# Antes: el registro DNS de tipo A del subdominio debe apuntar a este servidor.
# Si algo falla, el script deja nginx como estaba.

set -u
DOMINIO="${V2_DOMINIO:-v2.metromedicslab.com}"
USUARIO="${V2_USER:-metromedics}"
CLAVE="${V2_PASS-}"
RAIZ="/var/www/${DOMINIO}/html"
RESPALDO="/root/nginx-v2-respaldo-$(date +%Y%m%d-%H%M%S)"

if [ "$(id -u)" -ne 0 ]; then echo "Corre este script como root."; exit 1; fi
command -v nginx >/dev/null || { echo "nginx no está instalado."; exit 1; }

# Dónde guarda este servidor sus sitios
if [ -d /etc/nginx/sites-available ] && [ -d /etc/nginx/sites-enabled ]; then
  CONF="/etc/nginx/sites-available/${DOMINIO}"
  ENLACE="/etc/nginx/sites-enabled/${DOMINIO}"
else
  CONF="/etc/nginx/conf.d/${DOMINIO}.conf"
  ENLACE=""
fi
echo "Archivo de configuración: $CONF"

mkdir -p "$RESPALDO" "$RAIZ"
cp -a /etc/nginx "$RESPALDO/" 
chown -R "${USUARIO}:${USUARIO}" "/var/www/${DOMINIO}" 2>/dev/null || true

# Autenticación básica (sin dependencias: openssl)
AUTH_LINEAS=""
if [ -n "$CLAVE" ]; then
  HASH=$(openssl passwd -apr1 "$CLAVE")
  echo "${USUARIO}:${HASH}" > "/etc/nginx/.htpasswd-${DOMINIO}"
  chmod 640 "/etc/nginx/.htpasswd-${DOMINIO}"
  chgrp www-data "/etc/nginx/.htpasswd-${DOMINIO}" 2>/dev/null || true
  AUTH_LINEAS='auth_basic "Vista previa Metromedics";
    auth_basic_user_file /etc/nginx/.htpasswd-'"${DOMINIO}"';'
  echo "Contraseña activada para el usuario '${USUARIO}'."
else
  echo "Sin contraseña: la vista previa quedará abierta (solo con noindex)."
fi

cat > "$CONF" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMINIO};

    root ${RAIZ};
    index index.html;

    # La vista previa no se indexa nunca
    add_header X-Robots-Tag "noindex, nofollow, noarchive" always;

    location / {
        ${AUTH_LINEAS}
        try_files \$uri \$uri/ \$uri.html =404;
    }

    error_page 404 /404.html;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
NGINX

[ -n "$ENLACE" ] && ln -sf "$CONF" "$ENLACE"

if nginx -t; then
  systemctl reload nginx && echo "nginx recargado."
else
  echo "La configuración de nginx NO es válida. Revirtiendo."
  rm -f "$CONF" "$ENLACE"
  nginx -t && systemctl reload nginx
  exit 1
fi

echo
echo "Ahora el certificado HTTPS (el DNS de ${DOMINIO} debe apuntar a este servidor):"
echo "  certbot --nginx -d ${DOMINIO}"
echo
echo "Para deshacer todo:"
echo "  rm -f ${CONF} ${ENLACE} /etc/nginx/.htpasswd-${DOMINIO}; nginx -t && systemctl reload nginx"
echo "Respaldo de nginx en: ${RESPALDO}"
