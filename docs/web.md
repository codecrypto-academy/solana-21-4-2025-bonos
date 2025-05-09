**I. Autenticación y Gestión de Usuarios/Wallets:**

1.  **Cabecera y Login:**
    * La web debe de tener una cabecera con el logo de la empresa y un botón de login.
    * El login nos pedirá el usuario.
2.  **Gestión de Wallets de Solana:**
    * El usuario puede crear wallets de Solana protegidas con password.
    * Estas se grabarán en MongoDB en una colección de `wallets` con `privateKey` encriptada, `publicKey` y el `nombre del user` para poder identificar la wallet.
    * Después del login, se listarán las wallets que tiene el usuario.
    * Debe de poderse añadir más wallets.
    * Cuando pulsemos en una wallet, nos debe de pedir la password y si es correcta nos dejará acceder a la wallet.

**II. Funcionalidades de la Plataforma:**

3.  **Faucet:**
    * Hay que hacer un faucet para poder solicitar SOL.
    * Hay que hacer un faucet para poder solicitar tokens EUROCC.
4.  **Compra de EUROCC:**
    * Usar la pasarela de pago de Stripe para poder comprar EUROCC.
5.  **Gestión de Bonos:**
    * El usuario podrá crear bonos. Se grabarán en MongoDB en una colección de `bonos` con los datos del bono.
    * Se debe de poder listar los bonos que hay en el sistema.
6.  **Interacción con Bonos:**
    * Se debe de poder comprar bonos. Hay que guardar la compra en la colección de `compras`.
    * Se debe de poder transferir bonos de un usuario a otro.
    * Se debe de poder saber el balance de los bonos que tiene el usuario.
    * Se debe de poder listar a los bonistas de un bono.
7.  **Pagos de Bonos (Propietario):**
    * El propietario del bono debe de poder pagar el cupón anual a los bonistas.
    * El propietario del bono debe de poder pagar el nominal al vencimiento.

**Justificación del Orden:**

* Comenzamos con la **autenticación y la gestión de las wallets**, ya que son la base para que un usuario pueda interactuar con las demás funcionalidades (recibir fondos, comprar, crear bonos, etc.).
* Luego se introducen las funcionalidades básicas para obtener fondos en la plataforma (**faucet y compra de EUROCC**).
* A continuación, se aborda la **creación y listado de bonos**, estableciendo la base para la interacción con estos activos.
* La sección de **interacción con bonos** agrupa las acciones que un usuario puede realizar con los bonos (comprar, transferir, ver su balance y los bonistas).
* Finalmente, se detallan las funcionalidades específicas para el **propietario del bono** relacionadas con los pagos.

Este orden facilita la comprensión del flujo de la aplicación y la dependencia entre las diferentes funcionalidades. ¡Espero que te sea útil!
