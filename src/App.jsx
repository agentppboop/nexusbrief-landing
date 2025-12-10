// Version 2.0 - Pilot Update
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, CheckCircle, Shield, Menu, X, 
  Search, FileText, Upload, Zap, Lock, Loader2 
} from 'lucide-react';
// NOTE: Vercel Next.js analytics import removed to keep Vite build compatible.
// If you're running a Next.js app, use: import { Analytics } from "@vercel/analytics/next";

/* --- UPDATED COMPONENT: PILOT ACCESS MODAL (EXPANDED) --- */
const PilotModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submittedProblem, setSubmittedProblem] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // YOUR FORMSPREE ID GOES HERE
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeoyzbpj"; // Replace with your actual ID

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // store the submitted problem statement in component state for the success screen
        setSubmittedProblem(data.problem_statement || '');
        setLoading(false);
        setStep(2);
      } else {
        // try to parse JSON error message from Formspree
        let msg = `Submission failed (${response.status})`;
        try {
          const json = await response.json();
          if (json?.error) msg = json.error;
          else if (json?.errors) msg = Array.isArray(json.errors) ? json.errors.map(e => e.message || e).join(', ') : String(json.errors);
          else if (json?.message) msg = json.message;
        } catch (parseErr) {
          // ignore parse error and use default message
        }
        setErrorMessage(msg);
        setLoading(false);
      }
    } catch (error) {
      console.error('Network error posting to Formspree:', error);
      setErrorMessage('Network error. Check your connection or try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-[#EBE8E3] w-full max-w-lg p-8 shadow-2xl border border-white/20 animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors">
          <X size={20} />
        </button>

        {step === 1 ? (
          <>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Pilot Application</span>
              <h2 className="text-3xl font-serif mt-2 mb-2">Request Access</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tell us about your practice. We customize every pilot instance.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Name & Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Full Name</label>
                  <input type="text" name="name" required placeholder="John Doe" className="w-full bg-white px-4 py-3 text-sm border border-transparent focus:border-black focus:ring-0 outline-none placeholder:text-gray-300 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Role / Title</label>
                  <input type="text" name="role" required placeholder="Partner / Associate" className="w-full bg-white px-4 py-3 text-sm border border-transparent focus:border-black focus:ring-0 outline-none placeholder:text-gray-300 transition-all" />
                </div>
              </div>

              {/* Row 2: Firm & Email */}
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Firm Name</label>
                  <input type="text" name="firm_name" required placeholder="K&P Partners" className="w-full bg-white px-4 py-3 text-sm border border-transparent focus:border-black focus:ring-0 outline-none placeholder:text-gray-300 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Work Email</label>
                  <input type="email" name="email" required placeholder="name@firm.com" className="w-full bg-white px-4 py-3 text-sm border border-transparent focus:border-black focus:ring-0 outline-none placeholder:text-gray-300 transition-all" />
                </div>
              </div>

              {/* Row 3: WhatsApp */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-70">WhatsApp Number</label>
                <input type="tel" name="whatsapp" placeholder="+91 98765 43210" className="w-full bg-white px-4 py-3 text-sm border border-transparent focus:border-black focus:ring-0 outline-none placeholder:text-gray-300 transition-all" />
                <p className="text-[10px] text-gray-400 mt-1">Used only for urgent onboarding coordination.</p>
              </div>

              {/* Row 4: Problem Statement (Text Area) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-70">What problem are you trying to solve?</label>
                <textarea 
                  name="problem_statement" 
                  required 
                  rows="3"
                  placeholder="E.g., Reviewing 50+ vendor contracts a month manually takes too much time..." 
                  className="w-full bg-white px-4 py-3 text-sm border border-transparent focus:border-black focus:ring-0 outline-none placeholder:text-gray-300 transition-all resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Submit Application"}
                </button>
                {errorMessage && (
                  <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
                )}
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-serif mb-4">Request Received</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Thank you. Our team will review your requirements {submittedProblem ? `("${submittedProblem.slice(0, 30)}${submittedProblem.length > 30 ? '...' : ''}")` : ''} and contact you within 24 hours.
            </p>
            <button onClick={onClose} className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity">
              Back to Site
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- MAIN PAGE COMPONENT --- */
export default function NexusBriefEditorial() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // State to control the Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#EBE8E3] text-[#111111] font-sans selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* 1. RENDER MODAL HERE */}
      <PilotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-multiply" style={{backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')"}}></div>

      {/* --- NAVIGATION --- */}
      <nav className={`fixed w-full z-40 transition-all duration-500 ${scrolled ? 'bg-[#EBE8E3]/90 backdrop-blur-md py-4 border-b border-black/5' : 'bg-transparent py-8'}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold tracking-tight">nexusBrief.</div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide">
            <a href="#product" className="hover:opacity-60 transition-opacity">Product</a>
            <a href="#use-cases" className="hover:opacity-60 transition-opacity">Use Cases</a>
            <a href="#vision" className="hover:opacity-60 transition-opacity">Company</a>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:opacity-60 transition-opacity">Log in</a>
            {/* Connected Button 1 */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Get Started
            </button>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-serif leading-[0.95] tracking-tight mb-16 max-w-5xl animate-fade-in-up">
            Legal work, <br />
            <span className="italic font-light">within seconds.</span>
          </h1>

          <div className="grid lg:grid-cols-12 gap-8 items-end">
            
            {/* Left Visual */}
            <div className="lg:col-span-7 relative h-[600px] bg-[#D4D1CC] overflow-hidden group">
               <img 
                 src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200" 
                 alt="Professional working" 
                 className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-1000"
               />
               
               {/* Floating UI */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-md bg-white/95 backdrop-blur shadow-2xl p-6 rounded-none border border-gray-100">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Analysis Complete</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 </div>
                 <div className="space-y-3">
                   <div className="flex items-center gap-3 p-3 bg-[#F9F9F9] border-l-2 border-red-500">
                     <Shield size={16} className="text-red-500"/>
                     <span className="text-sm font-medium">Missing Liability Cap</span>
                   </div>
                   <div className="flex items-center gap-3 p-3 bg-[#F9F9F9] border-l-2 border-orange-500">
                     <FileText size={16} className="text-orange-500"/>
                     <span className="text-sm font-medium">Ambiguous Renewal Date</span>
                   </div>
                 </div>
               </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-5 lg:pl-12 pb-8">
              <p className="text-xl md:text-2xl text-[#333333] leading-relaxed mb-10 font-light">
                NexusBrief extracts clauses, flags risks, and tracks obligations—so mid-size Indian law firms and legal professionals can review contracts 20x faster while maintaining complete control.
              </p>
              
              <div className="flex flex-col gap-6">
                 {/* Connected Button 2 (Book a Demo) */}
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-black text-white px-8 py-4 text-base flex justify-between items-center group hover:bg-gray-800 transition-all"
                 >
                    <span>Book a demo</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
                 </button>
                 
                 <p className="text-sm text-gray-600 font-light">Flexible pilot pricing for mid-size firms • Early access</p>
                 
                 <div className="flex items-center gap-3 pt-6 border-t border-black/10">
                    <div className="flex -space-x-2">
                       <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-[#EBE8E3] flex items-center justify-center text-[10px] font-bold">BP</div>
                       <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[#EBE8E3] flex items-center justify-center text-[10px] text-white">AI</div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Built by researchers from <span className="text-black font-serif font-bold">BITS Pilani</span></span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 px-6 md:px-12 bg-white border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto">
           <div className="mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Workflow</span>
              <h2 className="text-4xl md:text-5xl font-serif mt-4">Intelligence in three steps.</h2>
           </div>

           <div className="grid md:grid-cols-3 gap-12">
              <div>
                 <div className="w-12 h-12 bg-[#EBE8E3] flex items-center justify-center mb-6 text-xl font-serif">1</div>
                 <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                    <Upload size={20}/> Upload Contract
                 </h3>
                 <p className="text-gray-500 leading-relaxed text-sm">
                    Drag and drop any PDF or Word document. Our secure parser extracts text while maintaining formatting.
                 </p>
              </div>
              <div>
                 <div className="w-12 h-12 bg-[#EBE8E3] flex items-center justify-center mb-6 text-xl font-serif">2</div>
                 <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                    <Zap size={20}/> AI Analysis
                 </h3>
                 <p className="text-gray-500 leading-relaxed text-sm">
                    Models trained on Indian case law identify clauses, flag risks, and cross-reference your playbook.
                 </p>
              </div>
              <div>
                 <div className="w-12 h-12 bg-[#EBE8E3] flex items-center justify-center mb-6 text-xl font-serif">3</div>
                 <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                    <CheckCircle size={20}/> Review & Export
                 </h3>
                 <p className="text-gray-500 leading-relaxed text-sm">
                    Accept or reject suggestions in one click. Export a clean summary or redlined version instantly.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* --- USE CASES --- */}
      <section id="use-cases" className="py-32 px-6 md:px-12 bg-[#EBE8E3]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 mb-20">
             <div className="lg:col-span-5">
                <h2 className="text-5xl md:text-6xl font-serif leading-tight">
                  NexusBrief meets lawyers where they are.
                </h2>
             </div>
             <div className="lg:col-span-7 flex items-end">
                <p className="text-lg text-gray-600 max-w-md">
                   Our platform integrates seamlessly into your existing document management systems, email, and drafting workflows.
                </p>
             </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 h-[500px]">
             <div className="md:col-span-1 bg-[#D4D1CC] relative overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Office" />
                <div className="absolute bottom-6 left-6 font-medium bg-white px-3 py-1 text-xs">During Client Meetings</div>
             </div>
             <div className="md:col-span-2 bg-[#D4D1CC] relative overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Meeting" />
                <div className="absolute bottom-6 left-6 font-medium bg-white px-3 py-1 text-xs">Managing 200+ Contracts</div>
             </div>
             <div className="md:col-span-1 bg-[#D4D1CC] relative overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Building" />
                <div className="absolute bottom-6 left-6 font-medium bg-white px-3 py-1 text-xs">In Audits</div>
             </div>
          </div>
        </div>
      </section>

      {/* --- FOUNDER & VISION BLOCK --- */}
      <section id="vision" className="py-32 px-6 md:px-12 bg-[#DCE4E1]">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-20">
           <div>
              <div className="uppercase tracking-widest text-xs font-bold mb-8 opacity-60">Our Vision</div>
              <div className="w-24 h-32 bg-gray-300 mb-8 overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover grayscale" />
              </div>
              <h2 className="text-3xl font-serif italic leading-relaxed mb-6">
                 "We are building the intelligence layer for Indian law. A system that understands context, not just keywords."
              </h2>
              <p className="text-sm font-bold">Ishan Arnepalli • Founder, NexusBrief</p>
           </div>
           
           <div className="flex flex-col justify-center">
              <p className="text-xl leading-relaxed mb-8">
                 NexusBrief is built for the strict confidentiality and compliance requirements of Indian law firms—with DPDP-ready architecture and enterprise-grade security.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-black/10">
                 <div>
                    <h4 className="font-bold mb-2 flex items-center gap-2"><Lock size={16}/> DPDP Compliant</h4>
                    <p className="text-sm opacity-70">AES-256 encryption built for India's data protection laws.</p>
                 </div>
                 <div>
                    <h4 className="font-bold mb-2 flex items-center gap-2"><Shield size={16}/> On-Premise Ready</h4>
                    <p className="text-sm opacity-70">Deploy on your own private cloud or servers for zero data leaving your firm.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="relative py-32 w-full bg-black text-white flex items-center justify-center overflow-hidden">
         <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-30" />
         
         <div className="relative z-10 text-center max-w-4xl px-6">
            <h2 className="text-5xl md:text-7xl font-serif mb-8">Ready to work without limits?</h2>
            <p className="text-xl opacity-80 mb-12">See what 95% faster contract review feels like.</p>
            <div className="flex flex-col items-center gap-4">
              {/* Connected Button 3 */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-black px-10 py-4 text-lg hover:bg-gray-200 transition-colors"
              >
                  Apply for Pilot Access
              </button>
              <p className="text-sm opacity-60">Early access • Scale with your firm</p>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black text-white pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
           <h1 className="text-[12vw] font-serif leading-none tracking-tight mb-20 text-center md:text-left opacity-90">
              NEXUSBRIEF
           </h1>
           
           <div className="grid md:grid-cols-4 gap-12 border-t border-white/20 pt-12">
              <div>
                 <p className="text-sm opacity-50 mb-4">Hyderabad, India</p>
                 <a href="mailto:contact@nexusbrief.com" className="text-sm block mb-4 hover:underline">contact@nexusbrief.com</a>
                 <p className="text-sm opacity-50">© 2024 NexusBrief</p>
              </div>
              <div>
                 <h4 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-70">Product</h4>
                 <ul className="space-y-3 text-sm opacity-80">
                    <li><a href="#" className="hover:text-gray-300">Features</a></li>
                    <li><a href="#" className="hover:text-gray-300">Security</a></li>
                    <li><a href="#" className="hover:text-gray-300">Integrations</a></li>
                    <li><a href="#" className="hover:text-gray-300">Pilot Pricing</a></li>
                 </ul>
              </div>
              <div>
                 <h4 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-70">Company</h4>
                 <ul className="space-y-3 text-sm opacity-80">
                    <li><a href="#" className="hover:text-gray-300">About Us</a></li>
                    <li><a href="#" className="hover:text-gray-300">Vision</a></li>
                    <li><a href="#" className="hover:text-gray-300">Careers</a></li>
                 </ul>
              </div>
              <div>
                 <h4 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-70">Social</h4>
                 <ul className="space-y-3 text-sm opacity-80">
                    <li><a href="#" className="hover:text-gray-300">LinkedIn</a></li>
                    <li><a href="#" className="hover:text-gray-300">Twitter</a></li>
                    <li><a href="#" className="hover:text-gray-300">Instagram</a></li>
                 </ul>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}