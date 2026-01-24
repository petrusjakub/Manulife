import React, { useState, useEffect, useRef } from 'react';
import { View, Product, NewsItem, ChatMessage } from './types';
import { sendMessageToGemini, initChat } from './services/geminiService';
import { 
  Home, 
  Shield, 
  MessageSquare, 
  User, 
  Bell, 
  Menu, 
  ChevronRight, 
  Search, 
  Heart,
  TrendingUp,
  Briefcase,
  Send,
  Loader2,
  Phone,
  FileText,
  CreditCard,
  MapPin,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  Landmark,
  PiggyBank
} from 'lucide-react';

// --- Constants ---
const CONTACT_NAME = "Susana";
const CONTACT_PHONE = "087781896087";
const CONTACT_WA_URL = "https://wa.me/6287781896087";
// Gambar cadangan jika gambar utama gagal dimuat (Manulife building or generic abstract)
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop";

// --- Mock Data (Updated with Reliable Image URLs) ---

const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'miuhc',
    name: 'MiUltimate HealthCare',
    category: 'Health',
    description: 'Solusi perlindungan kesehatan premium dengan pembayaran manfaat sesuai tagihan (as charged).',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    benefits: ['Limit hingga Rp 30 Miliar', 'Cover seluruh dunia (kecuali AS)', 'Perawatan Kanker & Dialisis']
  },
  {
    id: 'flexi',
    name: 'Manulife Perlindungan Syariah (FLEXI)',
    category: 'Syariah',
    description: 'Asuransi jiwa syariah yang memberikan keberkahan dan fleksibilitas bagi keluarga.',
    imageUrl: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=800&q=80',
    benefits: ['Prinsip Syariah', 'Fitur Wakaf', 'Surplus Underwriting']
  },
  {
    id: 'mccp',
    name: 'MiUltimate Critical Care',
    category: 'Health',
    description: 'Perlindungan terhadap penyakit kritis sejak tahap awal hingga usia 85 tahun.',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
    benefits: ['Cover Tahap Awal', 'Manfaat ICU Khusus', '100% UP Kembali jika Sehat (Usia 85)']
  },
  {
    id: 'mdsa',
    name: 'Dynamic Smart Assurance',
    category: 'Investment',
    description: 'Perlindungan jiwa sekaligus investasi cerdas dengan jaminan polis tetap aktif.',
    imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80',
    benefits: ['No Lapse Guarantee', 'Loyalty Benefit', 'Opsi Dana Investasi Beragam']
  },
  {
    id: 'msp',
    name: 'Manulife Saving Protector',
    category: 'Saving',
    description: 'Rencanakan masa depan dengan perlindungan jiwa dan manfaat tunai tahunan.',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
    benefits: ['Pembayaran Tunai Tahunan', 'Manfaat Meninggal Dunia', 'Pasti & Terjamin']
  },
  {
    id: 'legacy',
    name: 'MiPreparation Legacy',
    category: 'Life',
    description: 'Persiapkan warisan berharga yang dapat diteruskan ke generasi selanjutnya.',
    imageUrl: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=800&q=80',
    benefits: ['Polis Dapat Dialihkan (Anak)', 'Manfaat Tunai Pasti', 'Perlindungan Jangka Panjang']
  },
  {
    id: 'pap',
    name: 'ProActive Plus',
    category: 'Life',
    description: 'Asuransi jiwa berjangka dengan premi terjangkau untuk Anda yang aktif.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    benefits: ['Premi Terjangkau', 'Perlindungan Tinggi', 'Masa Bayar Singkat']
  },
  {
    id: 'mdla',
    name: 'Dynamic Life Assurance',
    category: 'Life',
    description: 'Perlindungan jiwa seumur hidup yang dinamis mengikuti tahapan kehidupan.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    benefits: ['Fleksibilitas Plan', 'Nilai Tunai', 'Perlindungan hingga 99 Tahun']
  },
  {
    id: 'mdwa',
    name: 'Dynamic Wealth Assurance',
    category: 'Saving',
    description: 'Lindungi masa depan dan raih kebebasan finansial sesuai gaya hidup Anda.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    benefits: ['Manfaat Tunai Berkala', 'Akumulasi Kekayaan', 'Fleksibel']
  }
];

const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Manulife Indonesia Bayar Klaim Rp 10 Triliun',
    date: 'Update 2024',
    summary: 'Komitmen nyata pembayaran klaim kepada nasabah.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'n2',
    title: 'Pentingnya Asuransi Penyakit Kritis',
    date: 'Info Sehat',
    summary: 'Biaya medis meningkat, siapkan perlindungan sejak dini.',
    imageUrl: 'https://images.unsplash.com/photo-1581056771107-24ca5f025052?auto=format&fit=crop&w=200&q=80'
  }
];

// --- Components ---

const ImageWithFallback: React.FC<{ src: string, alt: string, className?: string }> = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className} 
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
};

const ProductCard: React.FC<{ product: Product, compact?: boolean }> = ({ product, compact = false }) => (
  <div className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col ${compact ? 'min-w-[280px] w-[280px]' : 'mb-4'}`}>
    <div className="h-32 w-full overflow-hidden relative">
      <ImageWithFallback 
        src={product.imageUrl} 
        alt={product.name} 
        className="w-full h-full object-cover" 
      />
      <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
        {product.category}
      </div>
    </div>
    <div className="p-4 flex flex-col flex-1">
      <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">{product.name}</h3>
      <p className="text-gray-500 text-xs line-clamp-2 mb-3">{product.description}</p>
      
      {!compact && (
        <div className="space-y-1 mb-4 flex-1">
          {product.benefits.slice(0, 3).map((benefit, idx) => (
            <div key={idx} className="flex items-start text-xs text-gray-600">
              <Shield className="w-3 h-3 text-emerald-500 mr-1.5 flex-shrink-0 mt-0.5" />
              <span className="flex-1">{benefit}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-auto">
        <a 
          href={CONTACT_WA_URL} 
          target="_blank" 
          rel="noreferrer"
          className="flex-1 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
        >
          <MessageCircle size={14} className="mr-1.5" />
          Tanya Susana
        </a>
      </div>
    </div>
  </div>
);

const QuickAction: React.FC<{ icon: React.ReactNode, label: string, color: string, onClick?: () => void }> = ({ icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-2 active:scale-95 transition-transform"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-2 shadow-sm text-white bg-opacity-90`}>
      {icon}
    </div>
    <span className="text-xs font-medium text-gray-700 text-center leading-tight">{label}</span>
  </button>
);

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}>
      <div 
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser 
            ? 'bg-emerald-600 text-white rounded-tr-sm' 
            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

// --- Views ---

const HomeView: React.FC<{ onChangeView: (view: View) => void }> = ({ onChangeView }) => {
  return (
    <div className="pb-24">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-emerald-900 to-emerald-600 text-white p-6 pt-10 rounded-b-[2.5rem] shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
               <span className="font-bold text-lg text-white">M</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Manulife Info</span>
          </div>
          <a href={CONTACT_WA_URL} target="_blank" rel="noreferrer" className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition">
            <MessageCircle className="w-5 h-5 text-white" />
          </a>
        </div>
        
        <div className="relative z-10 mb-6">
          <h1 className="text-3xl font-bold mb-2 leading-tight">Masa Depan <br/>Dimulai Hari Ini</h1>
          <p className="opacity-90 text-sm mb-6 max-w-[80%]">Temukan solusi kesehatan, syariah, dan investasi terbaik bersama Susana.</p>
          
          <button 
            onClick={() => onChangeView(View.PRODUCTS)}
            className="bg-white text-emerald-800 px-6 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center"
          >
            Lihat Produk
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Agent Card Mini */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden border-2 border-white">
            <User className="w-6 h-6 text-yellow-800" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-emerald-100">Konsultan Anda</p>
            <p className="font-bold text-sm">{CONTACT_NAME}</p>
          </div>
          <a href={`tel:${CONTACT_PHONE}`} className="p-2 bg-emerald-500 rounded-full shadow-md">
            <Phone className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="px-4 mt-6">
        <h2 className="font-bold text-gray-800 mb-4 px-2">Kategori Produk</h2>
        <div className="grid grid-cols-4 gap-2">
          <QuickAction onClick={() => onChangeView(View.PRODUCTS)} icon={<Heart size={24} />} label="Kesehatan" color="bg-rose-500" />
          <QuickAction onClick={() => onChangeView(View.PRODUCTS)} icon={<Landmark size={24} />} label="Syariah" color="bg-green-600" />
          <QuickAction onClick={() => onChangeView(View.PRODUCTS)} icon={<PiggyBank size={24} />} label="Saving" color="bg-amber-500" />
          <a href={CONTACT_WA_URL} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-2 active:scale-95 transition-transform">
            <div className={`w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-2 shadow-sm text-white bg-opacity-90`}>
              <MessageCircle size={24} />
            </div>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">Chat WA</span>
          </a>
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4 mt-8 mb-6">
        <div className="flex justify-between items-end mb-4 px-2">
          <h2 className="text-lg font-bold text-gray-900">Produk Unggulan</h2>
          <button onClick={() => onChangeView(View.PRODUCTS)} className="text-xs text-emerald-600 font-semibold">Lihat Semua</button>
        </div>
        <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4 snap-x px-2">
          {FEATURED_PRODUCTS.slice(0, 4).map((p) => (
            <div key={p.id} className="snap-center">
              <ProductCard product={p} compact />
            </div>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">Info Terbaru</h2>
        <div className="space-y-4">
          {NEWS_ITEMS.map((item) => (
            <div key={item.id} className="flex bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <ImageWithFallback 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0" 
              />
              <div className="ml-3 flex flex-col justify-between py-1">
                <span className="text-xs text-emerald-600 font-medium">{item.date}</span>
                <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2">{item.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{item.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="px-6 mb-8 mt-8">
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
          <h3 className="font-bold text-emerald-900 mb-3">Mengapa Susana?</h3>
          <ul className="space-y-3">
             <li className="flex items-start text-sm text-gray-700">
               <div className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                 <Shield className="w-3 h-3 text-emerald-700" />
               </div>
               Agen resmi terlisensi & berpengalaman.
             </li>
             <li className="flex items-start text-sm text-gray-700">
               <div className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                 <Heart className="w-3 h-3 text-emerald-700" />
               </div>
               Konsultasi gratis & personal.
             </li>
             <li className="flex items-start text-sm text-gray-700">
               <div className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                 <MessageSquare className="w-3 h-3 text-emerald-700" />
               </div>
               Respon cepat via WhatsApp.
             </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ProductsView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  // Filters updated to match new categories
  const filters = ['All', 'Health', 'Syariah', 'Saving', 'Life', 'Investment'];

  const filteredProducts = activeFilter === 'All' 
    ? FEATURED_PRODUCTS 
    : FEATURED_PRODUCTS.filter(p => p.category === activeFilter);

  return (
    <div className="pt-6 pb-24 px-4 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 px-2">Katalog Produk</h1>
      <p className="text-gray-500 text-sm mb-6 px-2">Temukan perlindungan yang tepat untuk kebutuhan Anda.</p>
      
      {/* Search Bar */}
      <div className="relative mb-6 px-2">
        <input 
          type="text" 
          placeholder="Cari asuransi..." 
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        />
        <Search className="absolute left-5 top-3.5 text-gray-400 w-4 h-4" />
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar mb-6 px-2">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === filter 
                ? 'bg-emerald-600 text-white shadow-md transform scale-105' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid gap-4 px-2">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const AssistantView: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Halo! Saya Manu, asisten virtual Ibu ${CONTACT_NAME}. Saya bisa jelaskan detail tentang MiUltimate HealthCare, Asuransi Syariah, atau produk investasi kami. Apa yang ingin Anda tanyakan?`,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: botMsgId,
      role: 'model',
      text: '',
      timestamp: new Date()
    }]);

    await sendMessageToGemini(userMsg.text, (chunkText) => {
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId ? { ...msg, text: chunkText } : msg
      ));
    });

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50">
      <div className="bg-white p-4 shadow-sm border-b border-gray-100 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200">
             <MessageSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 leading-tight">Manu Assistant</h2>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1].text === '' && (
           <div className="flex justify-start mb-4">
             <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center space-x-2">
               <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
               <span className="text-xs text-gray-500">Sedang mengetik...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-4 border-t border-gray-200 pb-24 md:pb-4">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya tentang premi atau manfaat..."
            className="flex-1 bg-transparent text-sm focus:outline-none py-2"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`ml-2 p-2 rounded-full ${input.trim() ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-500'} transition-colors`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">
          Asisten AI dapat membantu menjawab pertanyaan dasar. Hubungi Susana untuk ilustrasi resmi.
        </p>
      </div>
    </div>
  );
};

const ContactView: React.FC = () => (
  <div className="bg-white min-h-screen pb-24 relative overflow-hidden">
    {/* Header Background */}
    <div className="h-48 bg-emerald-700 w-full rounded-b-[3rem] absolute top-0 left-0"></div>
    
    <div className="pt-24 px-6 relative z-10 flex flex-col items-center">
      {/* Profile Card */}
      <div className="w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-gray-100 text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
           {/* Placeholder for real photo */}
           <User size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{CONTACT_NAME}</h2>
        <p className="text-emerald-600 font-medium mb-1">Senior Insurance Agent</p>
        <p className="text-gray-400 text-xs mb-6">Manulife Indonesia</p>
        
        <div className="flex space-x-4 w-full justify-center">
          <a href={`tel:${CONTACT_PHONE}`} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm flex items-center justify-center hover:bg-gray-200 transition">
             <Phone size={16} className="mr-2" />
             Telepon
          </a>
          <a href={CONTACT_WA_URL} target="_blank" rel="noreferrer" className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center hover:bg-green-600 transition shadow-md shadow-green-200">
             <MessageCircle size={16} className="mr-2" />
             WhatsApp
          </a>
        </div>
      </div>

      {/* Info Sections */}
      <div className="w-full mt-6 space-y-4">
        <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-4 border border-gray-100">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600">
            <Phone size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Nomor Handphone</p>
            <p className="text-gray-800 font-medium">{CONTACT_PHONE}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-4 border border-gray-100">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Wilayah Layanan</p>
            <p className="text-gray-800 font-medium">Jakarta & Seluruh Indonesia (Online)</p>
          </div>
        </div>

        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 mt-4">
           <h3 className="font-bold text-emerald-900 mb-2">Butuh Ilustrasi Gratis?</h3>
           <p className="text-sm text-emerald-800 mb-4 leading-relaxed">
             Saya siap membantu menghitungkan premi terbaik sesuai budget dan kebutuhan perlindungan Anda.
           </p>
           <a 
             href={CONTACT_WA_URL}
             target="_blank"
             rel="noreferrer"
             className="w-full block text-center py-3 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700"
            >
              Minta Ilustrasi Sekarang
            </a>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App Layout ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);

  const renderView = () => {
    switch (currentView) {
      case View.HOME: return <HomeView onChangeView={setCurrentView} />;
      case View.PRODUCTS: return <ProductsView />;
      case View.ASSISTANT: return <AssistantView />;
      case View.CONTACT: return <ContactView />;
      default: return <HomeView onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="w-full md:max-w-md mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50">
        {renderView()}
      </div>

      {/* Floating Action Button for WhatsApp (Global) */}
      <a 
        href={CONTACT_WA_URL}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-24 right-4 md:right-[calc(50%-210px)] z-40 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-lg shadow-green-200 transition-transform hover:scale-110 active:scale-90 flex items-center justify-center"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 w-full md:max-w-md mx-auto bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <button 
          onClick={() => setCurrentView(View.HOME)}
          className={`flex flex-col items-center space-y-1 transition-colors ${currentView === View.HOME ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Home size={24} strokeWidth={currentView === View.HOME ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Beranda</span>
        </button>
        
        <button 
          onClick={() => setCurrentView(View.PRODUCTS)}
          className={`flex flex-col items-center space-y-1 transition-colors ${currentView === View.PRODUCTS ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Briefcase size={24} strokeWidth={currentView === View.PRODUCTS ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Produk</span>
        </button>

        {/* Center Button for Assistant */}
        <div className="relative -top-6">
          <button 
            onClick={() => setCurrentView(View.ASSISTANT)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 transform transition-all ${
              currentView === View.ASSISTANT 
                ? 'bg-emerald-700 scale-110 ring-4 ring-emerald-100' 
                : 'bg-emerald-600 hover:scale-105 hover:bg-emerald-700'
            }`}
          >
            <MessageSquare size={24} className="text-white" />
          </button>
        </div>

        <button 
          onClick={() => setCurrentView(View.CONTACT)}
          className={`flex flex-col items-center space-y-1 transition-colors ${currentView === View.CONTACT ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <User size={24} strokeWidth={currentView === View.CONTACT ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Kontak</span>
        </button>
      </nav>
    </div>
  );
};

export default App;