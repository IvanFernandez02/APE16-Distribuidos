# Guía de Despliegue en 4 PCs

Para que todos los servicios se comuniquen correctamente en red local, ya he modificado los archivos de configuración (`application.properties` y frontend). 

## 1. Construir el proyecto
Dado que cambiamos las IPs en el código, **necesitas recompilar los JARs de Java**.
Ejecuta esto en tu PC (PC 1) para generar los `.jar` actualizados:

```bash
./build.sh
```

Una vez que termine, deberás copiar los `.jar` generados a las computadoras correspondientes o clonar el código allí y compilarlo en cada una.

## 2. PC 4: Servidor Nodos de Pago (IP: 192.168.1.10)
Esta PC correrá las dos instancias de pago. Necesita tener Java instalado y el archivo `java/pagos-service/target/pagos-service-0.0.1-SNAPSHOT.jar`.

Abre dos terminales en esta PC y ejecuta:
**Terminal 1:**
```bash
java -jar pagos-service-0.0.1-SNAPSHOT.jar --server.port=9001 --pagos.nombre=Pagos1
```
**Terminal 2:**
```bash
java -jar pagos-service-0.0.1-SNAPSHOT.jar --server.port=9002 --pagos.nombre=Pagos2
```

## 3. PC 3: Orquestador (IP: 192.168.1.12)
Esta PC correrá el orquestador. Necesita tener Java instalado y el archivo `java/orquestador-service/target/orquestador-service-0.0.1-SNAPSHOT.jar`.

Abre una terminal y ejecuta:
```bash
java -jar orquestador-service-0.0.1-SNAPSHOT.jar
```

## 4. PC 2: Balanceador (IP: 192.168.1.13)
Esta PC correrá el balanceador. Necesita tener Java instalado y el archivo `java/balanceador-service/target/balanceador-service-0.0.1-SNAPSHOT.jar`.

Abre una terminal y ejecuta:
```bash
java -jar balanceador-service-0.0.1-SNAPSHOT.jar
```
*(Nota: El balanceador creará su base de datos `nodos.db` en la carpeta donde lo ejecutes)*

## 5. PC 1: Cliente/Frontend (IP: 192.168.1.11)
Como eres el cliente, solo necesitas iniciar el frontend. Ya he configurado las IPs por defecto en `App.jsx` para que apunten a los servidores correspondientes.

Asegúrate de reiniciar el servidor frontend si ya estaba corriendo:
```bash
cd frontend
npm run dev
```

### Importante: Firewall y Configuración Frontend
1. **Firewall:** Asegúrate de que las PCs 2, 3 y 4 permitan conexiones entrantes en los puertos 8080, 8081, 9001 y 9002 respectivamente. En Windows suele salir una ventana del Firewall pidiendo permisos.
2. **Caché del Navegador:** Si abres el frontend en `http://localhost:5173/` y sigue buscando las IPs viejas (`127.0.0.1`), puede ser porque la configuración vieja se quedó en tu LocalStorage. Simplemente ve al ícono de Configuración ⚙️ en la esquina superior derecha del frontend y verás que las nuevas IPs ya están sugeridas como _placeholder_ o puedes guardar de nuevo para que sobrescriba tu caché.
