import { useState } from "react";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <nav
      id="header"
      class="fixed w-full z-30 top-0 text-white border-y-green-500 border-t-6 bg-white"
    >
      <div class="w-full container mx-auto flex items-center justify-between mt-0 py-2">
        <div class="pl-4 flex items-center">
          <a
            class="toggleColour text-white no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
            href="/"
          >
            <img
              class="max-w-[200px] md:max-w-fu mx-auto h-auto"
              src="/images/logo-1.png"
              alt="Logo"
            />
          </a>
        </div>
        <div class="block lg:hidden pr-4">
          <button
            id="nav-toggle"
            class="flex items-center p-1 text-pink-800 hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            <svg
              class="fill-current h-6 w-6"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
        <div
          class="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 bg-white lg:bg-transparent text-black p-4 lg:p-0 z-20"
          id="nav-content"
        >
          <ul class="list-reset lg:flex justify-end flex-1 items-center text-2xl">
            <li class="mr-3">
              <a
                class="inline-block py-2 px-4 text-white no-underlin hover:text-green-500 hover:text-underline"
                class:list={[
                  Astro.url.pathname == "/" && "text-green-500 font-bold",
                ]}
                href="/"
              >
                Inicio
              </a>
            </li>
            <li class="mr-3">
              <a
                class="inline-block text-white no-underline hover:text-green-500 hover:text-underline py-2 px-4"
                class:list={[
                  Astro.url.pathname == "/servicios" &&
                    "text-green-500 font-bold",
                ]}
                href="servicios"
              >
                Servicios
              </a>
            </li>
            <li class="mr-3">
              <a
                class="inline-block text-white no-underline hover:text-green-500 hover:text-underline py-2 px-4"
                href="#"
              >
                Laboratorios
              </a>
            </li>
            <li class="mr-3">
              <a
                class="inline-block text-white no-underline hover:text-green-500 hover:text-underline py-2 px-4"
                class:list={[
                  Astro.url.pathname == "/nosotros" &&
                    "text-green-500 font-bold",
                ]}
                href="nosotros"
              >
                Nosotros
              </a>
            </li>
            <li class="mr-3">
              <a
                class="inline-block text-white no-underline hover:text-green-500 hover:text-underline py-2 px-4"
                class:list={[
                  Astro.url.pathname == "/contacto" &&
                    "text-green-500 font-bold",
                ]}
                href="contacto"
              >
                Contacto
              </a>
            </li>
            <li class="mr-3">
              <a
                class="inline-block text-white no-underline hover:text-green-500 hover:text-underline py-2 px-4"
                class:list={[
                  Astro.url.pathname == "/evaluacion-del-servicio" &&
                    "text-green-500 font-bold",
                ]}
                href="contacto"
              >
                Evaluación del Servicio
              </a>
            </li>
          </ul>
          <button
            id="navAction"
            class="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full mt-4 lg:mt-0 py-4 px-8 shadow opacity-75 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            Clientes
          </button>
        </div>
      </div>
      {/* <!-- <hr class="border-b border-gray-100 opacity-25 my-0 py-0" /> --> */}
    </nav>
  );
}
