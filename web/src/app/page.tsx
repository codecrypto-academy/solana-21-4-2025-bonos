export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 gap-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 items-center max-w-2xl">
        <h1 className="text-3xl font-bold text-center">Bonos de Deuda en Solana</h1>
        <p className="text-lg text-center">
          Bienvenido a la plataforma de gestión de bonos de deuda sobre la blockchain de Solana.
        </p>
        <ul className="list-disc list-inside text-base text-left space-y-2">
          <li>
            Los bonos de deuda son instrumentos financieros que permiten a los usuarios invertir y financiar proyectos de manera segura y transparente.
          </li>
          <li>
            Puedes adquirir bonos, transferirlos y consultar su estado en tiempo real gracias a la tecnología blockchain.
          </li>
          <li>
            Toda la información sobre los bonos está registrada de forma inmutable y accesible públicamente.
          </li>
          <li>
            Para comenzar, navega por el menú y explora las opciones disponibles para gestionar tus bonos de deuda.
          </li>
        </ul>
        <p className="text-center text-sm text-gray-500 mt-4">
          Si tienes dudas sobre el funcionamiento, consulta la documentación o contacta con soporte.
        </p>
      </main>
    </div>
  );
}
