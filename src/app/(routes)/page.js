"use client";
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/shop/Hero";
import { ProductGrid } from "@/components/shop/ProductGrid";
import ProductModal from "@/components/shop/ProductModal";
import CartDrawer from "@/components/cart/CartDrawer";
import WishlistDrawer from "@/components/cart/WishlistDrawer";
import Footer from "@/components/layout/Footer";
import {
  Palette,
  Feather,
  ShieldCheck,
  ArrowUpRight,
  Flower2,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import OrbitImages from "@/components/ui/OrbitImages";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useShop } from "@/core/shop/ShopContext";

function FeedbackCard({ feed, index, total, scrollProgress }) {
  const cardCenter = (index + 0.5) / total;
  const glassOpacity = useTransform(
    scrollProgress,
    [
      cardCenter - 0.12,
      cardCenter - 0.02,
      cardCenter,
      cardCenter + 0.02,
      cardCenter + 0.12,
    ],
    [0, 0.85, 1, 0.85, 0],
  );
  const cardScale = useTransform(
    scrollProgress,
    [cardCenter - 0.12, cardCenter, cardCenter + 0.12],
    [1, 1.04, 1],
  );

  return (
    <motion.div
      style={{ scale: cardScale }}
      className="relative w-[75vw] sm:w-[320px] flex-shrink-0 bg-background rounded-2xl border border-border/60 p-7 sm:p-8 flex flex-col justify-between min-h-[280px] sm:min-h-[300px] transition-shadow duration-500 group origin-center"
    >
      {/* Glass overlay — appears on scroll focus */}
      <motion.div
        style={{ opacity: glassOpacity }}
        className="absolute inset-0 rounded-2xl bg-foreground/5 backdrop-blur-md border border-accent/20 pointer-events-none z-10"
      />

      <div className="flex flex-col gap-5 relative z-20">
        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground leading-tight">
          {feed.author}
        </h3>
        <p className="text-sm text-muted font-medium leading-relaxed">
          {feed.quote}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-6 mt-auto relative z-20">
        <MapPin size={12} className="text-muted/60 flex-shrink-0" />
        <span className="text-[10px] text-muted/70 font-semibold tracking-wide">
          {feed.location}
        </span>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const feedbacksRef = React.useRef(null);
  const cardsContainerRef = React.useRef(null);
  const [scrollRange, setScrollRange] = React.useState(0);
  const { showToast } = useShop();

  const [contactForm, setContactForm] = React.useState({
    name: "",
    email: "",
    inquiryType: "Custom Arrangement",
    message: "",
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) {
      if (showToast) showToast("Please fill in your name and email.");
      return;
    }
    const text = `Hello Bloom Atelier,\n\nI would like to inquire about placing a custom order.\n\n*Name:* ${contactForm.name}\n*Email:* ${contactForm.email}\n*Inquiry:* ${contactForm.inquiryType}\n*Message:* ${contactForm.message}`;
    const whatsappUrl = `https://wa.me/918714793136?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
    if (showToast) {
      showToast("Message compiled! WhatsApp chat opened.");
    }
    setContactForm({
      name: "",
      email: "",
      inquiryType: "Custom Arrangement",
      message: "",
    });
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (cardsContainerRef.current) {
        const range = cardsContainerRef.current.scrollWidth - window.innerWidth;
        setScrollRange(range > 0 ? range : 0);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    const timer = setTimeout(handleResize, 150);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: feedbacksRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });
  const xTranslation = useTransform(smoothProgress, [0, 1], [0, -scrollRange]);

  return (
    <main className="relative bg-background min-h-screen">
      <Navbar />

      {/* 2026 Interactive Hero Sequence */}
      <Hero />

      <div className="bg-background relative z-20">
        <ProductGrid featuredOnly={true} />
      </div>

      <section
        id="atelier"
        className="py-20 sm:py-36 border-t border-border bg-secondary/35 relative z-20 overflow-hidden"
      >
        <div className="container mx-auto px-6 sm:px-8">
          {/* Section Header with Orbiting Images */}
          <div className="relative w-full max-w-[1400px] mx-auto mb-16 sm:mb-24 overflow-visible">
            <OrbitImages
              images={[
                "/forest_zoom_1.png",
                "/forest_zoom_2.png",
                "/forest_zoom_3.png",
                "/forest_zoom_4.png",
                "/forest_zoom_5.png",
                "/hero.png",
              ]}
              shape="ellipse"
              baseWidth={1400}
              baseHeight={600}
              radiusX={460}
              radiusY={120}
              rotation={-6}
              duration={35}
              itemSize={80}
              responsive={true}
              centerContent={
                <div className="flex flex-col items-center text-center space-y-4 pointer-events-none select-none">
                  <span className="text-accent text-[10px] font-bold uppercase tracking-[0.6em]">
                    Our Work
                  </span>
                  <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter uppercase leading-[0.9] text-foreground">
                    The Archive <br />
                    <span className="opacity-30">Collection.</span>
                  </h2>
                  <p className="text-muted text-sm font-medium max-w-sm">
                    Discover the design and creation details of our permanent
                    arrangements.
                  </p>
                </div>
              }
            />
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {/* Bento Item 1: Made to Last */}
            <div className="md:col-span-8 bg-background p-6 sm:p-12 md:p-16 border border-border rounded-2xl flex flex-col justify-center space-y-6 sm:space-y-8 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(5,31,32,0.08)] hover:border-accent/40 transition-all duration-500 ease-butter group shadow-sm">
              <div className="space-y-3">
                <span className="text-[9px] uppercase tracking-[0.40em] text-accent font-black block">
                  Atelier Standards
                </span>
                <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tighter leading-none text-foreground uppercase">
                  Made To Last.
                </h3>
              </div>
              <p className="text-muted text-base sm:text-lg leading-relaxed max-w-md font-medium">
                Every single flower stem is created by hand in our studio. We
                make flowers that look beautiful and stay perfect forever.
              </p>
              <div className="flex items-center gap-6">
                <button className="w-full sm:w-auto text-center px-10 py-4.5 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 shadow-md">
                  Discover More
                </button>
              </div>
            </div>

            {/* Bento Item 2: Verified Archive */}
            <div className="md:col-span-4 bg-background p-6 sm:p-10 md:p-10 border border-border rounded-2xl flex flex-col items-start justify-between hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(5,31,32,0.08)] hover:border-accent/40 transition-all duration-500 ease-butter group gap-8 sm:gap-12 shadow-sm min-h-[300px]">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border text-accent group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-foreground">
                  Verified Archive
                </h3>
                <p className="text-muted text-sm leading-relaxed font-medium">
                  Each piece is numbered and registered to prove it is genuine.
                </p>
              </div>
              <div className="w-12 h-[1px] bg-border group-hover:w-full transition-all duration-700" />
            </div>

            {/* Bento Item 3: Materials */}
            <div className="md:col-span-4 bg-background p-6 sm:p-10 md:p-10 border border-border rounded-2xl flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(5,31,32,0.08)] hover:border-accent/40 transition-all duration-500 ease-butter group gap-8 sm:gap-12 shadow-sm min-h-[300px]">
              <div className="flex justify-between items-start w-full">
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-accent group-hover:bg-accent/10 transition-colors">
                  <Palette size={20} />
                </div>
                <ArrowUpRight
                  className="text-muted/60 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                  size={20}
                />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-foreground">
                  Materials
                </h4>
                <p className="text-muted text-sm leading-relaxed font-medium">
                  We use strong wires and high-quality silk so they keep their
                  shape.
                </p>
              </div>
            </div>

            {/* Bento Item 4: Long Lasting */}
            <div className="md:col-span-8 bg-background p-6 sm:p-10 md:p-10 border border-border rounded-2xl flex flex-col sm:flex-row items-center gap-6 sm:gap-10 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(5,31,32,0.08)] hover:border-accent/40 transition-all duration-500 ease-butter group shadow-sm">
              <div className="w-full sm:w-32 h-48 sm:h-32 rounded-xl border border-border flex-shrink-0 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 overflow-hidden shadow-sm">
                <img
                  src="/hero.png"
                  alt="Flower visual"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-3">
                <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-foreground">
                  Long Lasting
                </h4>
                <p className="text-muted text-sm leading-relaxed max-w-md font-medium">
                  No need to buy weekly flowers. A one-time choice that stays
                  beautiful forever, bringing eternal nature inside.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="feedbacks"
        ref={feedbacksRef}
        className="relative h-[250vh] z-20"
      >
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-secondary/20 border-t border-b border-border">
          <div className="container mx-auto px-6 sm:px-8">
            {/* Reverted Static Header */}
            <div className="flex flex-col items-center text-center space-y-4 mb-16 sm:mb-20">
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.6em]">
                Reviews
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter uppercase leading-[0.9] text-foreground">
                What <br />
                <span className="opacity-30">They Say.</span>
              </h2>
              <p className="text-muted text-sm font-medium max-w-sm mt-2">
                Read reviews from customers who bought our handmade flowers.
              </p>
            </div>

            {/* Horizontal Parallel Scroll Container */}
            <div className="relative w-full overflow-visible">
              <motion.div
                ref={cardsContainerRef}
                style={{ x: xTranslation }}
                className="flex gap-6 sm:gap-8 w-max px-4 sm:px-12 md:px-24"
              >
                {[
                  {
                    quote:
                      "I bought a custom bouquet for our dining table and it looks amazing. Everyone who visits asks where we got it from!",
                    author: "Mohammed Anas",
                    location: "Kochi, Kerala",
                  },
                  {
                    quote:
                      "The quality is excellent and they look so real. I love that I don't have to water them or buy new flowers every week.",
                    author: "Fathima Riza",
                    location: "Trivandrum, Kerala",
                  },
                  {
                    quote:
                      "Very neat packing and fast delivery to Kozhikode. The design matches my room perfectly. Worth every rupee.",
                    author: "Faisal Rahman",
                    location: "Kozhikode, Kerala",
                  },
                  {
                    quote:
                      "The rose gold metallic wire details are breathtaking. It adds a perfect minimalist vibe to my home studio.",
                    author: "Aisha Jasmine",
                    location: "Ernakulam, Kerala",
                  },
                  {
                    quote:
                      "Remarkable craftsmanship! Customer service was helpful in getting a custom order ready for our anniversary.",
                    author: "Rayan Ahmed",
                    location: "Malappuram, Kerala",
                  },
                  {
                    quote:
                      "Perfect gift for friends who love plants but have zero time to care for them. Exceeded all expectations!",
                    author: "Shifa Maryam",
                    location: "Kannur, Kerala",
                  },
                ].map((feed, i, arr) => (
                  <FeedbackCard
                    key={i}
                    feed={feed}
                    index={i}
                    total={arr.length}
                    scrollProgress={smoothProgress}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="py-14 sm:py-24 bg-[#FAF8F5] dark:bg-[#0a2a2b] relative z-20 overflow-hidden"
      >


        <div className="container mx-auto px-4 sm:px-8 relative z-10">

          {/* Get In Touch Hero Card */}
          <div className="rounded-xl bg-gradient-to-br from-[#051f20] via-[#0a2a2b] to-[#051f20] dark:from-[#051f20] dark:to-[#0d3536] p-8 sm:p-12 md:p-16 mb-8 sm:mb-12 relative overflow-hidden">
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="space-y-3 sm:space-y-4">
                <span className="text-[#F4C2C2] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.5em]">
                  Contact Us
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-[#D9D4C8] leading-[0.9]">
                  Get In Touch.
                </h2>
                <p className="text-sm sm:text-base text-[#D9D4C8]/50 max-w-md font-medium leading-relaxed">
                  Have a custom order in mind? We&apos;d love to hear from you.
                </p>
              </div>

              {/* Contact pills */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex items-center gap-2 bg-white/8 backdrop-blur-sm rounded-full px-4 py-2.5 border border-[#D9D4C8]/10">
                  <MapPin size={14} className="text-[#F4C2C2] flex-shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#D9D4C8]/80 whitespace-nowrap">Puthanathani, Kerala</span>
                </div>
                <div className="flex items-center gap-2 bg-white/8 backdrop-blur-sm rounded-full px-4 py-2.5 border border-[#D9D4C8]/10">
                  <Phone size={14} className="text-[#F4C2C2] flex-shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#D9D4C8]/80 whitespace-nowrap">+91 87147 93136</span>
                </div>
                <div className="flex items-center gap-2 bg-white/8 backdrop-blur-sm rounded-full px-4 py-2.5 border border-[#D9D4C8]/10">
                  <Mail size={14} className="text-[#F4C2C2] flex-shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#D9D4C8]/80 whitespace-nowrap">hello@bloomatelier.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form + Map Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-8">

            {/* Form */}
            <div className="lg:col-span-3 bg-white dark:bg-white/5 rounded-xl border border-[#051f20]/6 dark:border-[#D9D4C8]/8 p-5 sm:p-10">
              <div className="space-y-1 mb-5 sm:mb-6">
                <span className="text-[#F4C2C2] text-[9px] font-black uppercase tracking-[0.4em] block">
                  Inquiry
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#051f20] dark:text-[#D9D4C8]">
                  Send a Message
                </h3>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="w-full bg-[#FAF8F5] dark:bg-black/20 border border-[#051f20]/8 dark:border-[#D9D4C8]/15 focus:border-[#051f20]/30 dark:focus:border-[#F4C2C2]/50 focus:outline-none rounded-lg px-4 py-3 sm:py-3.5 text-sm text-[#051f20] dark:text-[#D9D4C8] placeholder-[#051f20]/30 dark:placeholder-[#D9D4C8]/35 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="w-full bg-[#FAF8F5] dark:bg-black/20 border border-[#051f20]/8 dark:border-[#D9D4C8]/15 focus:border-[#051f20]/30 dark:focus:border-[#F4C2C2]/50 focus:outline-none rounded-xl px-4 py-3 sm:py-3.5 text-sm text-[#051f20] dark:text-[#D9D4C8] placeholder-[#051f20]/30 dark:placeholder-[#D9D4C8]/35 transition-colors"
                  />
                </div>

                <div className="relative">
                  <select
                    value={contactForm.inquiryType}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        inquiryType: e.target.value,
                      })
                    }
                    className="w-full bg-[#FAF8F5] dark:bg-black/20 border border-[#051f20]/8 dark:border-[#D9D4C8]/15 focus:border-[#051f20]/30 dark:focus:border-[#F4C2C2]/50 focus:outline-none rounded-lg px-4 py-3 sm:py-3.5 text-sm text-[#051f20] dark:text-[#D9D4C8] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Custom Arrangement">Custom Arrangement</option>
                    <option value="Corporate Order">Corporate Order</option>
                    <option value="Event Design">Event Design</option>
                    <option value="Gifting Bouquet">Gifting Bouquet</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#051f20]/30 dark:text-[#D9D4C8]/40 text-[10px]">
                    ▼
                  </div>
                </div>

                <textarea
                  placeholder="Describe your vision..."
                  rows={3}
                  required
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="w-full bg-[#FAF8F5] dark:bg-black/20 border border-[#051f20]/8 dark:border-[#D9D4C8]/15 focus:border-[#051f20]/30 dark:focus:border-[#F4C2C2]/50 focus:outline-none rounded-lg px-4 py-3 sm:py-3.5 text-sm text-[#051f20] dark:text-[#D9D4C8] placeholder-[#051f20]/30 dark:placeholder-[#D9D4C8]/35 transition-colors resize-none"
                />

                <button
                  type="submit"
                  className="w-full py-3.5 sm:py-4 bg-[#051f20] dark:bg-[#F4C2C2] hover:bg-[#0a2a2b] dark:hover:bg-[#D9D4C8] text-white dark:text-[#051f20] text-[11px] font-black uppercase tracking-[0.3em] rounded-full transition-all duration-500 cursor-pointer"
                >
                  Send via WhatsApp
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="lg:col-span-2 rounded-xl overflow-hidden border border-[#051f20]/6 dark:border-[#D9D4C8]/8 relative min-h-[240px] sm:min-h-[340px]">
              <iframe
                title="Bloom Atelier — Puthanathani, Malappuram"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31258.59!2d76.21!3d11.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba64f7c3b6e9d1d%3A0x509d4f9e0fc7c56e!2sPuthanathani%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "saturate(0.3) contrast(1.1)",
                  opacity: 0.9,
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] dark:from-[#0a2a2b] via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                <div className="flex items-center gap-2 bg-white/80 dark:bg-[#051f20]/80 backdrop-blur-sm rounded-full px-3.5 py-2 w-fit border border-[#051f20]/6 dark:border-[#D9D4C8]/10">
                  <MapPin size={11} className="text-[#F4C2C2]" />
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[#051f20] dark:text-[#D9D4C8]">
                    Puthanathani, Malappuram
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      <Footer />

      <CartDrawer />
      <WishlistDrawer />
    </main>
  );
}
