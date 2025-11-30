import Link from "next/link";
import { IoLogoInstagram, IoMdMail } from 'react-icons/io';

export default function Footer() {
  return (
    <footer className="mt-12">
      {/* Definición del degradado para los iconos */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#833AB4" />
            <stop offset="50%" stopColor="#FD1D1D" />
            <stop offset="100%" stopColor="#F77737" />
          </linearGradient>
        </defs>
      </svg>

      {/* Espaciado inferior ajustado a pb-8 para que no toque el fondo */}
      <div className="px-4 pb-8 py-2 w-full"> 
        
        {/* CAMBIO 1: 'max-w-5xl' permite que la píldora sea más ancha */}
        <div className="mx-auto max-w-5xl w-full">
          
          {/* CAMBIO 2: 'justify-between' separa los elementos a los extremos
              CAMBIO 3: 'px-8' o 'px-10' da aire en las puntas */}
          <div className="rounded-full border border-emerald-800/20 bg-white text-slate-700 px-6 py-1 flex flex-wrap items-center justify-between shadow-sm">
            
            {/* Elemento 1: Título */}
            <span className="font-semibold text-base" style={{ color: "#0E6A52" }}>
              Alma de Luz
            </span>
            
            {/* Elemento 2: Instagram 1 */}
            <Link href="https://instagram.com/almadeluz.sahumerios" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 flex items-center gap-2 group transition-all">
              <IoLogoInstagram size={22} style={{ fill: "url(#instagram-gradient)" }} className="group-hover:scale-110 transition-transform"/>
              <span className="hidden sm:inline">@almadeluz.sahumerios</span> {/* Oculta texto en móviles muy chicos si es necesario */}
            </Link>
            
            {/* Elemento 3: Instagram 2 */}
            <Link href="https://instagram.com/almadeluz71" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 flex items-center gap-2 group transition-all">
              <IoLogoInstagram size={22} style={{ fill: "url(#instagram-gradient)" }} className="group-hover:scale-110 transition-transform"/>
              <span className="hidden sm:inline">@almadeluz71</span>
            </Link>
            
            {/* Elemento 4: Mail */}
            <a href="mailto:almadeluz@gmail.com" className="hover:text-emerald-700 flex items-center gap-2 group transition-all">
              <IoMdMail size={22} className="text-slate-500 group-hover:text-emerald-700 transition-colors"/> 
              <span className="hidden sm:inline">almadeluz@gmail.com</span>
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}