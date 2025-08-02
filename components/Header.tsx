'use client'

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Brain, TestTube, BarChart3 } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/", icon: BookOpen },
    { name: "Custom Test", href: "/custom-test", icon: Brain },
    { name: "NEET Test", href: "/neet-test", icon: TestTube },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-bounce">
              <Brain className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold text-primary">
              MentorBox
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="default" size="sm" asChild>
              <Link href="/neet-test">Start NEET Test</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-9 h-9"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-2">
                <Button variant="default" className="w-full" asChild>
                  <Link href="/neet-test" onClick={() => setIsMenuOpen(false)}>
                    Start NEET Test
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;