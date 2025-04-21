# Proyecto de Bonos de Deuda en Solana

Este proyecto implementa un sistema de bonos de deuda en la blockchain de Solana, utilizando una stablecoin propia llamada EuroCoin y tokens de bonos llamados BonoDeuda.

## Descripción del Proyecto

El proyecto permite la emisión y compra de bonos de deuda con las siguientes características:

- Emision
- Vencimiento
- Nominal
- Pago interes: Anual | Anual
- Tipo de interés: Fijo 
- Cupón: porcentaje
- Devolución al vencimiento
- Compra mediante la stablecoin EuroCoin

## Fases del Proyecto

### Fase 1: Desarrollo del Script de Prueba.

- Creacion de wallet (emisor EuroCC, emisor BonoDeuda, adquirente1, adquirente2)
- Airdrop de SOL a las cuentas necesarias
- Creación del token EuroCC (stablecoin)
- Airdrop de EuroCC a la wallet emisor, adquirente1 y adquirente2
- Creación del token BonoDeuda
- Compra de tokens BonoDeuda con la stablecoin EuroCC (typescript)
- Transferencia de tokens BonoDeuda a otras cuentas (typescript)
- Caracteristicas de los bonos:
Datos del Bono (Actualizados):

        Nominal (Valor Facial): 1000 €
        Fecha de Emisión: 21 de abril de 2025
        Fecha de Vencimiento: 2029 (asumimos la misma fecha del mes para simplificar, es decir, alrededor del 21 de abril de 2029)
        Plazo: Aproximadamente 4 años
        Cupón Anual: 4% del nominal = 40 €
        Tasa de Reembolso al Vencimiento: 7% del nominal
        Calendario de Pago de Cupones:

        Asumiendo pagos anuales del cupón, las fechas de pago serían alrededor del aniversario de la fecha de emisión:

        21 de abril de 2026: Pago del primer cupón = 40 €
        21 de abril de 2027: Pago del segundo cupón = 40 €
        21 de abril de 2028: Pago del tercer cupón = 40 €
        21 de abril de 2029 (Vencimiento): Pago del cuarto y último cupón = 40 €
        Pago al Vencimiento (21 de abril de 2029):

        En la fecha de vencimiento, el inversor recibirá:

        Último Pago del Cupón: 40 €
        Devolución del Nominal: 1000 €
        Prima de Reembolso: 7% del nominal = 0.07 × 1000 € = 70 €
        Pago Total al Vencimiento = Último Cupón + Nominal + Prima de Reembolso
        Pago Total al Vencimiento = 40 € + 1000 € + 70 € = 1110 €

        Resumen del Flujo de Caja para el Inversor:

        21 de abril de 2026: +40 € (Primer pago de cupón)
        21 de abril de 2027: +40 € (Segundo pago de cupón)
        21 de abril de 2028: +40 € (Tercer pago de cupón)
        21 de abril de 2029: +1110 € (Cuarto y último pago de cupón + Devolución del nominal + Prima de Reembolso)




### Fase 2: Desarrollo de la Aplicación Web para la emisión y compra de bonos usando un MCP server.
- El mcp server debe permitir:
    - Crear bonos
    - Comprar bonos
    - Transferencias de bonos entre wallets
    - Consulta de bonos y saldo de EuroCC
    - Consulta de bonos y saldo de EuroCC
    


## Arquitectura del proyecto

### Tecnologias usadas

- Solana
    - Solana Cli
    - Solana Test Validator
    - Spl-token
    - Anchor
- Next.js en Typescript con Shadcn UI
