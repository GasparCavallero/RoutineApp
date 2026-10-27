# RoutineApp

RoutineApp es una aplicación móvil desarrollada en TypeScript y Expo que te ayuda a organizar y gestionar tus rutinas diarias desde el smartphone.

## Características principales

- Gestión de rutinas diarias
- Notificaciones
- Interfaz sencilla y amigable
- 100% TypeScript

## Instalación y uso

### Requisitos

- Node.js 22.13 o superior en la línea 22, 24.3 o superior en la línea 24, o 26 o superior.
- [Expo Go](https://expo.dev/go) compatible con SDK 58 en tu dispositivo móvil.

### Pasos para empezar

1. Instala las dependencias fijadas en `package-lock.json`:

   ```bash
   npm ci
   ```

   Este comando ejecuta `postinstall` y aplica automáticamente el parche de compatibilidad de `react-native-draggable-flatlist` con Reanimated 4.

2. Inicia el servidor de desarrollo:

   ```bash
   npx expo start --tunnel --clear
   ```

   Si Expo pide iniciar sesión para abrir el túnel, ejecuta `npx expo login` y volvé a iniciar el servidor.

3. Escanea el QR con Expo Go. Si Expo Go indica que el proyecto no es compatible, actualizá o instalá una versión compatible con SDK 58 desde [expo.dev/go](https://expo.dev/go).

## Colaboración

¿Quieres colaborar? Por favor revisa [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencia

Ve el archivo [LICENSE](LICENSE) para más detalles.

---
