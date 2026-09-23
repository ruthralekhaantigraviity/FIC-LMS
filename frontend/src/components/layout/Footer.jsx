import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Globe,
  Shield,
  MessageCircle,
  Briefcase,
  Camera,
  Share2,
} from "lucide-react"; // Fallbacks for brand icons in older lucide versions
const Facebook = MessageCircle;
const Linkedin = Briefcase;
const Instagram = Camera;
const GlobeIcon = Globe;
const ShieldCheck = Shield;
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerLinks = [
    {
      title: "COMPANY",
      links: [
        { name: "About FIC", href: "#about" },
        { name: "Our Clientele", href: "#" },
        { name: "Success Stories", href: "#" },
        { name: "Partner with Us", href: "#" },
        { name: "Careers", href: "#" },
      ],
    },
    {
      title: "CORE SERVICES",
      links: [
        { name: "Job Consulting", href: "#" },
        { name: "IT Solutions", href: "#" },
        { name: "Digital Marketing", href: "#" },
        { name: "Insurance Services", href: "#" },
        { name: "Web & App Dev", href: "#" },
      ],
    },
    {
      title: "SUPPORT",
      links: [
        { name: "Help Center & FAQ", href: "#" },
        { name: "Contact Support", href: "#" },
        { name: "Member Login", href: "/login" },
        { name: "Terms of Service", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Refund Policy", href: "#" },
      ],
    },
  ];
  const locations = [
    {
      type: "HEAD OFFICE",
      city: "Krishnagiri",
      address:
        "RK Towers, Rayakottai Rd, opposite to HP Petrol Bunk, Wahab Nagar, Krishnagiri, Tamil Nadu 635002",
      phone: "+91 63694 06416",
    },
    {
      type: "BRANCH OFFICE",
      city: "Chennai",
      address:
        "22, VVM Towers, 3rd Floor, Pattullos Rd, Anna Salai, Royapettah, Chennai, Tamil Nadu 600002",
      phone: "+91 63694 06416",
    },
    {
      type: "LIAISON OFFICE",
      city: "Bangalore",
      address:
        "Excel coworks, Marilingappa layout, Nagarbhavi, Papareddypalya, Bangalore",
      phone: "+91 63694 06416",
    },
  ];
  return (
    <footer className="bg-[#050b1a] text-slate-400 pt-20 pb-10 border-t border-slate-800/50">
      {" "}
      <div className="max-w-7xl mx-auto px-6">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {" "}
          {/* Brand Info */}{" "}
          <div className="lg:col-span-4">
            {" "}
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.jpg" alt="FIC Logo" className="h-14 w-auto object-contain bg-white rounded-xl p-2" />
              <span className="font-bold text-xl tracking-tight text-white whitespace-nowrap">
                <span style={{ color: '#1A9FD4' }}>Forge</span> India <span className="text-slate-500">Connect</span>
              </span>
            </div>{" "}
            <p className="text-slate-400 mb-8 max-w-sm leading-relaxed text-sm">
              {" "}
              India's premier gateway for career placement, business excellence,
              and digital transformation. Bridging talent with global
              opportunities through a verified partner network.{" "}
            </p>{" "}
            <div className="flex items-center gap-3 mb-8">
              {" "}
              {[Facebook, Linkedin, Instagram, GlobeIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all group"
                >
                  {" "}
                  <Icon
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                  />{" "}
                </a>
              ))}{" "}
            </div>{" "}
            {/* ISO Certification Box */}{" "}
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800 max-w-sm">
              {" "}
              <div className="flex items-center gap-2 mb-3 text-cyan-400">
                {" "}
                <ShieldCheck size={20} />{" "}
                <span className="text-xs font-black tracking-wider uppercase">
                  ISO 9001:2015 CERTIFIED
                </span>{" "}
              </div>{" "}
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {" "}
                Government Approved Job Consultancy | MSME Registered | Trusted
                by 180+ Enterprise Partners across South India.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          {/* Links Grid */}{" "}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {" "}
            {footerLinks.map((section, i) => (
              <div key={i}>
                {" "}
                <div className="flex items-center gap-2 mb-8">
                  {" "}
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>{" "}
                  <h4 className="text-white font-black text-xs tracking-widest uppercase">
                    {section.title}
                  </h4>{" "}
                </div>{" "}
                <ul className="space-y-4">
                  {" "}
                  {section.links.map((link, j) => (
                    <li key={j}>
                      {" "}
                      {link.href.startsWith("/") ? (
                        <Link
                          to={link.href}
                          className="text-sm hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                        >
                          {" "}
                          {link.name}{" "}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-sm hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                        >
                          {" "}
                          {link.name}{" "}
                        </a>
                      )}{" "}
                    </li>
                  ))}{" "}
                </ul>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
        {/* Office Locations */}{" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-800/50">
          {" "}
          {locations.map((loc, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800/50 hover:border-cyan-500/30 transition-all group"
            >
              {" "}
              <div className="flex flex-col gap-4">
                {" "}
                <div>
                  {" "}
                  <p className="text-[10px] font-black text-slate-500 tracking-widest mb-3 uppercase">
                    {loc.type}
                  </p>{" "}
                  <div className="flex items-center gap-2 text-white mb-3">
                    {" "}
                    <MapPin size={18} className="text-indigo-500" />{" "}
                    <span className="font-black text-lg">{loc.city}</span>{" "}
                  </div>{" "}
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[40px]">
                    {" "}
                    {loc.address}{" "}
                  </p>{" "}
                </div>{" "}
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm pt-4 border-t border-slate-800/50 group-hover:text-cyan-300 transition-colors">
                  {" "}
                  <Phone size={14} /> <span>{loc.phone}</span>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>{" "}
        <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          {" "}
          <p className="text-xs text-slate-500 font-medium">
            {" "}
            © {currentYear} FORGE INDIA CONNECT. All rights reserved.{" "}
          </p>{" "}
          <div className="flex gap-6 text-xs text-slate-500 font-medium">
            {" "}
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>{" "}
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>{" "}
            <a href="#" className="hover:text-white transition">
              Refund Policy
            </a>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </footer>
  );
}
