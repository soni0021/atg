import Link from "next/link";
import { Brain, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    platform: [
      { name: "Custom Tests", href: "/custom-test" },
      { name: "NEET Mock Tests", href: "/neet-test" },
      { name: "Analytics Dashboard", href: "/dashboard" },
      { name: "Study Plans", href: "/study-plans" },
    ],
    subjects: [
      { name: "Physics", href: "/physics" },
      { name: "Chemistry", href: "/chemistry" },
      { name: "Biology", href: "/biology" },
      { name: "Previous Years", href: "/previous-years" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/mentorbox" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/mentorbox" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/mentorbox" },
  ];

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-8 md:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary flex items-center justify-center">
                <Brain className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-primary">
                MentorBox
              </span>
            </div>
            
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
              Empowering 50,000+ students to achieve their medical dreams through AI-powered learning, 
              personalized practice, and comprehensive analytics.
            </p>
            
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
                <Mail className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                <span>support@mentorbox.com</span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
                <Phone className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                <span>New Delhi, India</span>
              </div>
            </div>
            
            <div className="flex space-x-3 md:space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-smooth"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-foreground text-sm md:text-base">Platform</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects Links */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-foreground text-sm md:text-base">Subjects</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.subjects.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-foreground text-sm md:text-base">Support</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
            © 2024 MentorBox. All rights reserved. Empowering future doctors.
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-xs md:text-sm">
            <span className="text-muted-foreground text-center">Made with ❤️ for NEET aspirants</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-medium">50,000+ Active Students</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;