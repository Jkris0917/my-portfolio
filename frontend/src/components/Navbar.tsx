import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ink/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="font-mono text-accent font-semibold text-lg tracking-tight">
                    jk<span className="text-text-primary">.</span>dev
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={`font-mono text-sm transition-colors duration-200 ${location.pathname === link.href
                                ? 'text-accent'
                                : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <a href="https://github.com/Jkris0917"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline text-xs py-2 px-4"
                    >
                        GitHub ↗
                    </a>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-text-secondary hover:text-accent transition-colors"
                    aria-label="Toggle menu"
                >
                    <div className="flex flex-col gap-1.5 w-5">
                        <span className={`h-px bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                        <span className={`h-px bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            {
                menuOpen && (
                    <div className="md:hidden bg-surface border-t border-border px-6 py-4 flex flex-col gap-4">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`font-mono text-sm py-2 transition-colors ${location.pathname === link.href ? 'text-accent' : 'text-text-secondary'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )
            }
        </header >
    );
}