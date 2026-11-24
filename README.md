# SMN México — tienda en línea

Sitio estático listo para publicar con GitHub Pages.

## Publicar en GitHub Pages
1. Crea o inicia sesión en https://github.com
2. Pulsa **New repository**.
3. Escribe `smn-mexico`, selecciona **Public** y crea el repositorio.
4. Pulsa **Add file → Upload files** y sube `index.html`, `styles.css` y `app.js`.
5. Pulsa **Commit changes**.
6. En el repositorio abre **Settings → Pages**.
7. En **Build and deployment**, selecciona **Deploy from a branch**.
8. Selecciona la rama **main** y la carpeta **/(root)**. Pulsa **Save**.
9. Espera unos minutos. GitHub mostrará la dirección pública de tu página en esa misma sección.

## Personalizar productos y precios
Abre `app.js` y edita el arreglo `products`. Cada producto tiene:
- `name`: nombre del producto.
- `category`: `Ropa` o `Accesorios`.
- `price`: precio numérico en pesos. Usa `0` para mostrar “Consultar precio”.
- `description`: descripción.
- `symbol`: letras o símbolo que aparece en la imagen ilustrativa.

El WhatsApp se configura al inicio de `app.js` en `WHATSAPP_NUMBER`, con código de país y sin espacios. El número proporcionado quedó configurado como `525662698251`.

## Importante
Esta versión es una tienda estática: el carrito funciona en el navegador y el pedido se envía a WhatsApp. No procesa pagos, no guarda pedidos en un servidor ni incluye un panel privado de administración. Para esas funciones se necesita un backend o un servicio de comercio electrónico. Los productos usan ilustraciones tipográficas de muestra; reemplázalas por fotografías reales antes de vender.
