# Solana Bond System - EuroCC y BonoDeuda

Este proyecto implementa un sistema de emisión, compra y gestión de bonos de deuda sobre la blockchain de Solana utilizando el framework SPL Token. Los bonos (`BonoDeuda`) se compran con una stablecoin propia llamada `EuroCC`.

## Requisitos

- Tener instalado el CLI de Solana:
```bash
solana --version
```
- Ejecutar un nodo local:
```bash
solana-test-validator
```

## Instalación

```bash
npm install
```

Scripts disponibles
```bash
npm run dev         # Ejecuta la configuración inicial de wallets, airdrops y emisión de tokens
npm run balance     # Muestra balances de todos los participantes y tokens
npm run compra      # Simula la compra de 1 BonoDeuda a cambio de EuroCC
npm run transfer    # Transfiere 1 BonoDeuda de un adquirente a otro
npm run cupon       # Ejecuta el pago de cupones (intereses) en EuroCC a los poseedores de bonos
npm run test        # Ejecuta todos los scripts anteriores en secuencia
```

## Estructura de Archivos

- `src/main.ts`
> Configura el sistema: crea wallets, airdrops de SOL, emite tokens EuroCC y BonoDeuda, distribuye EuroCC a los adquirentes, y guarda toda la información en token-info.json.
- `src/utils.ts`
> Utilidades comunes: carga de wallets, carga de información de tokens, gestión de cuentas asociadas y funciones de transferencia.
- `src/compra.ts`
> Simula la compra de bonos: adquirente1 entrega EuroCC a emisorBonoDeuda y recibe BonoDeuda a cambio.
- `src/balance.ts`
> Muestra los balances actuales de tokens EuroCC y BonoDeuda para todos los actores involucrados.
- `src/transfer.ts`
> Transfiere un token BonoDeuda de adquirente1 a adquirente2.
- `src/pago-cupon.ts`
> Calcula y transfiere pagos de cupones (4%) desde emisorEuroCC hacia los titulares de BonoDeuda, en base a su balance.
- `token-info.json`
> Archivo generado automáticamente que contiene las direcciones públicas de las wallets y mints de los tokens.
- `wallets/`
> Carpeta que almacena los archivos .json con las claves secretas de las wallets creadas.

### Tokens creados

**EuroCC (EUROCC)**
- Tipo: Stablecoin
- Decimales: 2
- Supply inicial: 1,000,000,000.00 EUROCC
**BonoDeuda (BONO)**
- Tipo: Token sin decimales (representa un bono)
- Supply inicial: 10,000 BONO
