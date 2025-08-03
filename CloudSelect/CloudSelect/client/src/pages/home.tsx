import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Cloud Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Get personalized recommendations from 10+ global cloud providers based on your budget, region, workload, and requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/questionnaire">
              <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
                <i className="fas fa-rocket mr-2"></i>Start Cloud Assessment
              </button>
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
              <i className="fas fa-play mr-2"></i>Watch Demo
            </button>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-blue-600">
            <div>
              <div className="text-3xl font-bold">10+</div>
              <div className="text-blue-200">Cloud Providers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">200+</div>
              <div className="text-blue-200">Global Regions</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-blue-200">Recommendations Made</div>
            </div>
            <div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-blue-200">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Provider Logos */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-600 mb-8">Trusted providers we compare</p>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-8 items-center justify-items-center opacity-60">
            <div className="text-center">
              <i className="fab fa-aws text-3xl text-orange-500"></i>
              <p className="text-xs mt-2">AWS</p>
            </div>
            <div className="text-center">
              <i className="fab fa-microsoft text-3xl text-blue-600"></i>
              <p className="text-xs mt-2">Azure</p>
            </div>
            <div className="text-center">
              <i className="fab fa-google text-3xl text-red-500"></i>
              <p className="text-xs mt-2">Google Cloud</p>
            </div>
            <div className="text-center">
              <i className="fas fa-cloud text-3xl text-blue-800"></i>
              <p className="text-xs mt-2">IBM Cloud</p>
            </div>
            <div className="text-center">
              <i className="fas fa-database text-3xl text-red-600"></i>
              <p className="text-xs mt-2">Oracle</p>
            </div>
            <div className="text-center">
              <i className="fas fa-server text-3xl text-blue-500"></i>
              <p className="text-xs mt-2">DigitalOcean</p>
            </div>
            <div className="text-center">
              <i className="fas fa-cloud text-3xl text-green-600"></i>
              <p className="text-xs mt-2">Linode</p>
            </div>
            <div className="text-center">
              <i className="fas fa-cloud-upload-alt text-3xl text-purple-600"></i>
              <p className="text-xs mt-2">+8 More</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose CloudMatch?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We simplify cloud platform selection with intelligent matching and comprehensive guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-brain text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Intelligent Matching</h3>
              <p className="text-slate-600">
                Our algorithm analyzes 15+ factors including budget, region, workload type, and compliance needs to find your perfect match.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-secondary text-white rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-chart-line text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-time Pricing</h3>
              <p className="text-slate-600">
                Get accurate cost estimates with up-to-date pricing from all major cloud providers, helping you make budget-conscious decisions.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent text-white rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-book-open text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Step-by-Step Guides</h3>
              <p className="text-slate-600">
                Beginner-friendly setup instructions with screenshots, code examples, and best practices for each recommended platform.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-globe text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Global Coverage</h3>
              <p className="text-slate-600">
                Compare providers across 200+ regions worldwide, ensuring optimal performance for your users wherever they are.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-600 text-white rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-shield-alt text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Compliance Ready</h3>
              <p className="text-slate-600">
                Filter providers by compliance requirements including GDPR, HIPAA, SOC 2, and industry-specific standards.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-headset text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Support</h3>
              <p className="text-slate-600">
                Get personalized recommendations from cloud architects and access to our community of developers and experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
