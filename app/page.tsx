'use client'
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Calendar, Sparkles, Star, Play, Pause } from 'lucide-react';
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

function SpotifyPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioCarregado, setAudioCarregado] = useState(false);

  useEffect(() => {
    async function carregarAudioRobusto() {
      if (!audioRef.current) return;
      try {
        const response = await fetch('/foiassim.mp3');
        
        if (!response.ok) {
          console.error("ALERTA: O arquivo 'foiassim.mp3' não foi encontrado na pasta public!");
          return;
        }
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        if (audioRef.current) {
          audioRef.current.src = blobUrl;
          audioRef.current.load();
          setAudioCarregado(true);
        }
      } catch (err) {
        console.warn("Fallback para streaming padrão devido a restrições de CORS:", err);
        if (audioRef.current) {
          audioRef.current.src = '/foiassim.mp3';
          setAudioCarregado(true);
        }
      }
    }

    carregarAudioRobusto();
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Impede o play se o arquivo não tiver sido localizado no servidor (evita o NotSupportedError)
      if (!audioCarregado && audioRef.current.readyState === 0) {
        alert("O áudio ainda está sendo carregado ou não foi encontrado na pasta public.");
        return;
      }

      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Erro ao reproduzir mídia:", err);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleAudioEnd = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, []);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-[340px] bg-[#121212] border border-zinc-800 p-5 rounded-3xl shadow-2xl flex flex-col items-center gap-5">
      <audio ref={audioRef} preload="auto" crossOrigin="anonymous" loop />

      {/* Foto Quadrada do Casal */}
      <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-inner bg-zinc-900 relative group">
        <img 
          src="/capa.png" 
          alt="Foto do Casal" 
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/foto1.jpeg";
          }}
        />
      </div>

      {/* Título da Música */}
      <div className="w-full flex flex-col text-left px-1">
        <span className="text-white font-black text-xl tracking-tight truncate">Foi Assim</span>
        <span className="text-zinc-400 text-sm font-medium mt-0.5 truncate">SOTAM</span>
      </div>

      {/* Ondas do Spotify */}
      <div className="w-full flex items-center justify-center gap-[3px] h-7 px-2 opacity-80 my-1">
        {[4, 2, 6, 3, 5, 7, 4, 8, 5, 2, 6, 3, 4, 7, 5, 8, 4, 2, 6, 3, 5, 4].map((h, i) => (
          <motion.div
            key={i}
            className="w-[3px] bg-white rounded-full"
            style={{ height: `${h * 3}px` }}
            animate={isPlaying ? {
              height: [`${h * 2}px`, `${h * 4.5}px`, `${h * 2}px`]
            } : { height: `${h * 3}px` }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.03,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Barra de Progresso */}
      <div className="w-full flex flex-col gap-1.5 px-1">
        <div className="flex items-center gap-3 w-full text-[11px] text-zinc-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min="0" 
            max={duration || 100} 
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#1db954] hover:accent-[#1ed760]"
            style={{
              backgroundImage: `linear-gradient(to right, #1db954 0%, #1db954 ${progressPercent}%, #27272a ${progressPercent}%, #27272a 100%)`
            } as React.CSSProperties}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Botão Play / Pause */}
      <div className="flex items-center justify-center mt-1">
        <button 
          onClick={togglePlay}
          className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform active:scale-95 shadow-lg"
        >
          {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
        </button>
      </div>
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
      <section className="max-w-5xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
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
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative bg-zinc-900/60 p-4 rounded-3xl border border-zinc-800 backdrop-blur-md shadow-2xl transition-all hover:border-pink-500/30 group cursor-pointer"
          >
            <div className="overflow-hidden rounded-2xl w-full aspect-[3/4] relative bg-zinc-950">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10" />
              <img 
                src={`/${item.file}`} 
                alt="Nossa foto" 
                className="w-full h-full object-cover object-center transition-transform duration-700 md:group-hover:scale-105"
              />
            </div>
            <div className="mt-4 space-y-2 text-left px-1">
              <span className="text-pink-400 text-[11px] font-mono flex items-center gap-2 font-bold tracking-wider uppercase">
                <Calendar size={13} className="text-pink-500" /> {item.date}
              </span>
              <p className="text-zinc-300 italic font-light text-sm md:text-base leading-relaxed">
                “{item.cap}”
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Seção da Música */}
      <section className="py-12 flex flex-col items-center px-4 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-5">
          <Music className="text-green-400 animate-bounce" size={18} />
          <h3 className="text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase text-zinc-400 font-bold">Nossa Trilha Sonora</h3>
        </div>
        <SpotifyPlayer />
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
                    e.preventDefault();
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