import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary cursor-pointer">
                  <i className="fas fa-cloud mr-2"></i>CloudMatch
                </h1>
              </Link>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/questionnaire">
                <span className={`text-slate-600 hover:text-primary transition-colors cursor-pointer ${
                  location === "/questionnaire" ? "text-primary font-medium" : ""
                }`}>
                  Find My Cloud
                </span>
              </Link>
              <a href="#comparison" className="text-slate-600 hover:text-primary transition-colors">
                Compare Providers
              </a>
              <a href="#guides" className="text-slate-600 hover:text-primary transition-colors">
                Setup Guides
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-primary transition-colors">
                Pricing
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-slate-600 hover:text-primary transition-colors">
              <i className="fas fa-question-circle"></i>
            </button>
            <Link href="/questionnaire">
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
