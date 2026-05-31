export default function Footer() {
    return (
        <footer className="border-t border-border py-8 mt-24">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="font-mono text-text-secondary text-sm">
                    © {new Date().getFullYear()} John Kris Gellado
                </p>
                <div className="flex items-center gap-6">

                    <a href="https://github.com/Jkris0917"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-text-secondary text-sm hover:text-accent transition-colors"
                    >
                        GitHub
                    </a>

                    <a href="https://linkedin.com/in/john-kris-gellado-792a8235b"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-text-secondary text-sm hover:text-accent transition-colors"
                    >
                        LinkedIn
                    </a>

                    <a href="mailto:gelladojohnkris@gmail.com"
                        className="font-mono text-text-secondary text-sm hover:text-accent transition-colors"
                    >
                        Email
                    </a>
                </div >
            </div >
        </footer >
    );
}