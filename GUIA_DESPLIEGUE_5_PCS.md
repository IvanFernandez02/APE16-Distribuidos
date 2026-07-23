# Guía de Despliegue en 5 PCs

En esta arquitectura, cada componente del sistema corre en una máquina distinta para un entorno distribuido real.

## Arquitectura de Red (Ejemplo)
- **PC 1 (Pagos 1):** `IP_PC1` (puerto 9001)
- **PC 2 (Pagos 2):** `IP_PC2` (puerto 9002)
- **PC 3 (Balanceador):** `IP_PC3` (puerto 8080)
- **PC 4 (Orquestador):** `IP_PC4` (puerto 8081)
- **PC 5 (Cliente/Frontend):** Corre la interfaz gráfica.

---

## 1. Configurar las IPs en el código (Antes de compilar)

Si quieres configurar esto tú mismo, debes editar los siguientes archivos. *(Si prefieres, **dime las IPs en el chat** y yo edito el código por ti).*

**Archivo 1:** `java/balanceador-service/src/main/resources/application.properties`
```properties
pagos1.url=http://[IP_PC1]:9001/
pagos2.url=http://[IP_PC2]:9002/
```

**Archivo 2:** `java/orquestador-service/src/main/resources/application.properties`
```properties
balanceador.url=http://[IP_PC3]:8080/
```

Una vez que guardes los cambios, abre tu terminal y ejecuta para generar los `.jar` actualizados:
```bash
./build.sh
```

---

## 2. Distribuir y Ejecutar

Ahora toma los `.jar` generados en la carpeta `target` de cada servicio y cópialos a sus respectivas PCs.

### PC 1: Nodo de Pago 1
Asegúrate de tener Java instalado, abre una terminal en esta PC y ejecuta:
```bash
java -jar pagos-service-0.0.1-SNAPSHOT.jar --server.port=9001 --pagos.nombre=Pagos1
```

### PC 2: Nodo de Pago 2
En la segunda PC, abre una terminal y ejecuta:
```bash
java -jar pagos-service-0.0.1-SNAPSHOT.jar --server.port=9002 --pagos.nombre=Pagos2
```

### PC 3: Balanceador
En la tercera PC, ejecuta el balanceador:
```bash
java -jar balanceador-service-0.0.1-SNAPSHOT.jar
```
*(Nota: Asegúrate de que los puertos 9001 y 9002 estén abiertos en el Firewall de PC 1 y PC 2 para que el balanceador pueda conectarse).*

### PC 4: Orquestador
En la cuarta PC, ejecuta el orquestador:
```bash
java -jar orquestador-service-0.0.1-SNAPSHOT.jar
```
*(Nota: Asegúrate de que el puerto 8080 esté abierto en el Firewall de la PC 3).*

### PC 5: Cliente / Frontend
En tu computadora (PC 5), debes arrancar el frontend:
```bash
cd frontend
npm run dev
```
Luego, entra a tu navegador, dale clic al ícono de configuración ⚙️ y pon las URLs correctas:
- **Balanceador URL:** `http://[IP_PC3]:8080`
- **Orquestador URL:** `http://[IP_PC4]:8081`

Pulsa **Guardar** y el sistema debería conectarse correctamente.
