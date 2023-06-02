## Como instalar angular?

Paso 1. Instalar NodeJS en su ultima versión, para eso entraremos a su web oficial y descargaremos el instalador más actualizado [nodejs](https://nodejs.org/es/)

Paso 2. Actualizar NPM, el gestor de paquetes de node, para bajarnos las dependencias más actuales:

```
npm install -g npm@latest
```

Paso 3. Borrar la cache de NPM:

```
npm cache clean --force
```

Paso 4. Desactivar las auditorias de NPM para evitar fallos:

```
npm set audit false
```
Paso 5. Desinstalar los paquetes anteriores de Angular CLI

```
npm uninstall -g @angular/cli
```

Paso 6. Borrar la cache de NPM de nuevo:

```
npm cache clean --force
```

Paso 7. Instalar la última versión de Angular CLI para instalar Angular11:

```
npm install -g @angular/cli@
```

Ahora ya hemos instalado y actualizado Angular CLI y ya podemos generar un nuevo proyecto de Angular 11


