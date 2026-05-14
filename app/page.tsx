'use client'
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Calendar, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- COMPONENTES AUXILIARES ---

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{ transition: 'transform 0.08s cubic-bezier(0.25, 1, 0.5, 1)' }}
    >
      <Heart fill="white" className="text-white w-full h-full -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

function BackgroundParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-pink-500 rounded-full"
          style={{
            top: `${(i * 7) % 100}%`,
            left: `${(i * 13) % 100}%`,
          }}
          animate={{
            y: [0, -60, 0],
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 5,
            delay: (i * 0.4) % 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// --- PÁGINA PRINCIPAL ---

export default function PedidoPage() {
  const [clicouSim, setClicouSim] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noButtonText, setNoButtonText] = useState("Não");

  const frasesEngracadas = ["Quase!", "Tente outra vez", "Ih, errou", "Nem tenta", "Caminho errado", "Apenas SIM!"];

  const fogeBotao = () => {
    // Valores de fuga ligeiramente reduzidos no mobile para garantir que o botão não saia completamente da tela
    const limiteX = window.innerWidth < 768 ? 100 : 260;
    const limiteY = window.innerHeight < 768 ? 100 : 260;

    const x = Math.random() * (limiteX * 2) - limiteX;
    const y = Math.random() * (limiteY * 2) - limiteY;
    setNoButtonPos({ x, y });
    
    const fraseAleatoria = frasesEngracadas[Math.floor(Math.random() * frasesEngracadas.length)];
    setNoButtonText(fraseAleatoria);
  };

  const handleYes = () => {
    setClicouSim(true);
    const end = Date.now() + 12 * 1000;
    const colors = ['#ff0000', '#ff69b4', '#ffffff', '#ffb6c1'];

    (function frame() {
      confetti({
        particleCount: window.innerWidth < 768 ? 2 : 4,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.85 },
        colors: colors
      });
      confetti({
        particleCount: window.innerWidth < 768 ? 2 : 4,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.85 },
        colors: colors
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-pink-500 font-sans relative">
      {/* Grid de fundo premium suave */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-15" />
      
      <CustomCursor />

      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative px-6 text-center z-10">
        <BackgroundParticles />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 w-full"
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1], filter: ["drop-shadow(0 0 8px rgba(236,72,153,0.3))", "drop-shadow(0 0 20px rgba(236,72,153,0.5))", "drop-shadow(0 0 8px rgba(236,72,153,0.3))"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4 inline-block"
          >
            <Heart className="text-pink-500 w-12 h-12 md:w-20 md:h-20 mx-auto" fill="#ec4899" />
          </motion.div>
          
          {/* Nome de vocês dois estilizado e ultra-responsivo */}
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tight leading-none py-2 flex flex-col items-center justify-center gap-1 md:gap-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-400">GABRIEL</span>
            <span className="text-pink-500 text-2xl md:text-5xl my-1 animate-pulse">&</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-400">LÍVIA</span>
          </h1>
          
          <p className="mt-6 text-pink-400 text-[10px] md:text-sm font-semibold tracking-[0.3em] uppercase bg-pink-950/30 px-4 py-2 rounded-full border border-pink-500/20 inline-block backdrop-blur-sm max-w-xs sm:max-w-none">
            Nossa História de Amor
          </p>
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/5 via-transparent to-transparent pointer-events-none" />
      </section>

      {/* Galeria de Fotos Interativa */}
      <section className="max-w-6xl mx-auto py-12 md:py-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 relative z-10">
        {[
          { file: "foto1.jpeg", date: "O Começo", cap: "Aquele brilho nos olhos que só você me dá." },
          { file: "foto2.jpeg", date: "Cumplicidade", cap: "Onde a gente se entende sem falar nada." },
          { file: "foto3.jpeg", date: "Nosso Futuro", cap: "O primeiro passo de uma vida inteira." }
        ].map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="relative bg-zinc-900/40 p-3 md:p-4 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl transition-all hover:border-pink-500/20 group cursor-pointer"
          >
            {/* H-350px no mobile garante uma navegação de scroll confortável em celulares */}
            <div className="overflow-hidden rounded-2xl h-[350px] md:h-[450px] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity z-10" />
              <img 
                src={`/${item.file}`} 
                alt="Nossa foto" 
                className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-105"
              />
            </div>
            <div className="mt-4 space-y-1 text-left px-1">
              <span className="text-pink-400 text-[11px] font-mono flex items-center gap-2 font-bold tracking-wider uppercase">
                <Calendar size={12} className="text-pink-500" /> {item.date}
              </span>
              <p className="text-zinc-300 italic font-light text-sm md:text-base leading-relaxed">
                “{item.cap}”
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Spotify Section */}
      <section className="py-12 md:py-20 flex flex-col items-center px-6 relative z-10">
        <div className="w-full max-w-xl bg-zinc-900/30 border border-white/5 backdrop-blur-md p-5 md:p-6 rounded-3xl shadow-3xl">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Music className="text-green-400 animate-bounce" size={18} />
            <h3 className="text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase text-zinc-400 font-bold">Nossa Trilha Sonora</h3>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-[#282828] border border-zinc-800">
            <iframe 
              src="http://googleusercontent.com/spotify.com/4" 
              width="100%" 
              height="152" 
              frameBorder="0" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              title="Spotify Player"
            />
          </div>
        </div>
      </section>

      {/* O Gran Finale */}
      <section className="h-screen flex flex-col items-center justify-center relative px-6 text-center z-10">
        <AnimatePresence mode="wait">
          {!clicouSim ? (
            <motion.div 
              key="pergunta"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              <div className="flex justify-center gap-2 mb-4">
                <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 animate-spin [animation-duration:8s]" />
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-pink-400 animate-pulse" />
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-8xl font-black mb-12 md:mb-16 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 leading-tight px-2">
                Então, Lívia... <br className="hidden sm:block" />aceita namorar comigo?
              </h2>
              
              {/* Layout de botões adaptável e otimizado para área de toque em smartphones */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center min-h-[140px] relative max-w-xs sm:max-w-md mx-auto w-full">
                <button 
                  onClick={handleYes}
                  className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full font-black text-xl md:text-2xl hover:from-pink-600 hover:to-rose-700 transition-all shadow-[0_0_25px_rgba(236,72,153,0.4)] z-50 active:scale-95 touch-manipulation"
                >
                  SIM! ❤️
                </button>
                
                <motion.button 
                  animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                  onMouseEnter={fogeBotao}
                  onTouchStart={(e) => {
                    e.preventDefault(); // Evita cliques acidentais e zoom no mobile
                    fogeBotao();
                  }}
                  className="w-full sm:w-auto px-8 py-4 border border-zinc-800 bg-zinc-950/60 backdrop-blur-sm rounded-full text-zinc-500 text-base md:text-lg font-medium transition-colors whitespace-nowrap touch-manipulation select-none"
                >
                  {noButtonText}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="sucesso"
              initial={{ scale: 0.5, opacity: 0, filter: "blur(15px)" }} 
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} 
              transition={{ type: "spring", damping: 16, stiffness: 95 }}
              className="space-y-4 px-4"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart fill="#ec4899" className="w-20 h-20 md:w-28 md:h-28 text-pink-500 mx-auto mb-2 drop-shadow-[0_0_25px_rgba(236,72,153,0.5)]" />
              </motion.div>
              <h2 className="text-5xl sm:text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 tracking-tighter uppercase">
                EU TE AMO!
              </h2>
              <p className="text-lg sm:text-2xl md:text-3xl text-zinc-300 font-light max-w-md md:max-w-xl mx-auto leading-relaxed">
                O melhor capítulo das nossas vidas começa agora. Obrigado por ser você! ❤️
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="py-8 text-center text-zinc-700 text-[9px] tracking-[0.4em] uppercase relative z-10 font-mono px-4">
        Desenvolvido com amor por Gabriel Braga
      </footer>
    </main>
  );
}