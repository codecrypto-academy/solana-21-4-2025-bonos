# Solana Token Management System

Este proyecto es un sistema de gestión de tokens en la blockchain de Solana, que permite crear y administrar diferentes tipos de tokens, incluyendo bonos con cupones.

## Requisitos previos

- Node.js (v16 o superior)
- MongoDB
- Validador local de Solana

## Instalación de MongoDB

1. Descarga MongoDB Community Server desde [el sitio oficial](https://www.mongodb.com/try/download/community)
2. Instala siguiendo las instrucciones para tu sistema operativo
3. Inicia el servicio de MongoDB:

   ```bash
   # En Linux/macOS
   sudo systemctl start mongod

   # En Windows (desde PowerShell como administrador)
   net start MongoDB
   ```

4. Verifica que MongoDB esté funcionando:
   ```bash
   mongo --eval "db.version()"
   ```

## Configuración del validador local de Solana

1. Instala Solana CLI:

   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"
   ```

2. Configura Solana para usar la red local:

   ```bash
   solana config set --url localhost
   ```

3. Inicia un validador local:

   ```bash
   solana-test-validator
   ```

4. En otra terminal, verifica que el validador esté funcionando:
   ```bash
   solana cluster-version
   ```

## Instalación del proyecto

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd <nombre-del-directorio>
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/solana-tokens
   NEXT_PUBLIC_SOLANA_RPC_URL=http://localhost:8899
   ```

## Dependencias principales

El proyecto utiliza las siguientes bibliotecas:

- **Next.js**: Framework de React para el frontend y API routes
- **@solana/web3.js**: SDK oficial de Solana para interactuar con la blockchain
- **@solana/spl-token**: Biblioteca para interactuar con tokens SPL en Solana
- **mongodb**: Driver oficial de MongoDB para Node.js
- **tailwindcss**: Framework CSS para el diseño de la interfaz

## Ejecución del proyecto

1. Asegúrate de que MongoDB y el validador de Solana estén en ejecución
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## Funcionalidades principales

- Creación de usuarios y wallets
- Generación de tokens SPL en Solana
- Creación de bonos con cupones
- Transferencia de tokens entre wallets
- Pago de cupones para bonos
- Visualización de balances y tokens en wallets

## Estructura del proyecto

- `/src/app`: Componentes y páginas de la aplicación
- `/src/lib`: Utilidades y funciones para interactuar con Solana y MongoDB
- `/src/components`: Componentes reutilizables de UI
