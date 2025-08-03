import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProviderCard from "@/components/provider-card";
import CostCalculator from "@/components/cost-calculator";
import ProviderComparison from "@/components/provider-comparison";
import EmailResults from "@/components/email-results";
import { Button } from "@/components/ui/button";
import { type AssessmentResult, type CloudProvider } from "@shared/schema";

interface ResultsProps {
  id: string;
}

export default function Results({ id }: ResultsProps) {
  const [showComparison, setShowComparison] = useState(false);
  
  const { data: assessment, isLoading: assessmentLoading } = useQuery<AssessmentResult>({
    queryKey: [`/api/assessment/${id}`],
  });

  const { data: providers, isLoading: providersLoading } = useQuery<CloudProvider[]>({
    queryKey: ["/api/providers"],
  });

  if (assessmentLoading || providersLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Analyzing your requirements...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!assessment || !providers) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Assessment Not Found</h2>
            <p className="text-slate-600 mb-8">The assessment you're looking for doesn't exist.</p>
            <Link href="/questionnaire">
              <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Start New Assessment
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const providersMap = new Map(providers.map(p => [p.id, p]));
  const topRecommendation = assessment.recommendations[0];
  const topProvider = providersMap.get(topRecommendation.providerId);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Results Header */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Your Personalized Recommendations</h2>
            <p className="text-xl text-slate-600 mb-6">Based on your requirements, here are the best cloud platforms for you</p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => setShowComparison(!showComparison)}
                variant={showComparison ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <i className="fas fa-chart-bar"></i>
                {showComparison ? "Hide Comparison" : "Compare Providers"}
              </Button>
              <EmailResults assessmentId={id} />
              <Button variant="outline" className="flex items-center gap-2">
                <i className="fas fa-download"></i>
                Download Report
              </Button>
            </div>
          </div>

          {/* Top Recommendation */}
          {topProvider && (
            <div className="gradient-secondary rounded-2xl p-8 text-white relative overflow-hidden mb-8 animate-bounce-in">
              <div className="absolute top-4 right-4">
                <span className="bg-white text-secondary px-3 py-1 rounded-full text-sm font-semibold">
                  <i className="fas fa-crown mr-1"></i>Best Match
                </span>
              </div>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <i className={`${topProvider.logo} text-4xl mr-4`}></i>
                    <div>
                      <h3 className="text-2xl font-bold">{topProvider.displayName}</h3>
                      <p className="text-emerald-100">Match Score: {topRecommendation.matchScore}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <div className="text-emerald-100 text-sm">Estimated Cost</div>
                      <div className="text-xl font-semibold">
                        ${topRecommendation.estimatedCost.min}-${topRecommendation.estimatedCost.max}/month
                      </div>
                    </div>
                    <div>
                      <div className="text-emerald-100 text-sm">Setup Complexity</div>
                      <div className="flex items-center">
                        <div className="flex space-x-1 mr-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i <= (topProvider.setupComplexity === "easy" ? 1 : topProvider.setupComplexity === "medium" ? 2 : 3)
                                  ? "bg-white"
                                  : "bg-emerald-300"
                              }`}
                            ></div>
                          ))}
                        </div>
                        <span className="capitalize">{topProvider.setupComplexity}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-emerald-100 text-sm">Global Regions</div>
                      <div className="text-xl font-semibold">{topProvider.regions.length} Regions</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 lg:mt-0">
                  <Link href={`/setup/${topProvider.id}`}>
                    <button className="bg-white text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors mr-4">
                      View Setup Guide
                    </button>
                  </Link>
                  <button 
                    onClick={() => setShowComparison(true)}
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-secondary transition-colors"
                  >
                    Compare Details
                  </button>
                </div>
              </div>
              
              {/* Why This Recommendation */}
              <div className="mt-6 pt-6 border-t border-emerald-400">
                <h4 className="font-semibold mb-2">Why {topProvider.displayName} is perfect for you:</h4>
                <ul className="text-emerald-100 space-y-1">
                  {topRecommendation.reasons.slice(0, 4).map((reason, index) => (
                    <li key={index}>• {reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Provider Comparison */}
          {showComparison && (
            <div className="mb-16 animate-fade-in">
              <ProviderComparison 
                providers={providers} 
                recommendations={assessment.recommendations}
                selectedProviders={assessment.recommendations.slice(0, 3).map(r => r.providerId)}
              />
            </div>
          )}

          {/* Alternative Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {assessment.recommendations.slice(1, 3).map((recommendation, index) => {
              const provider = providersMap.get(recommendation.providerId);
              if (!provider) return null;

              return (
                <div key={provider.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <ProviderCard
                    provider={provider}
                    recommendation={recommendation}
                    rank={index + 2}
                  />
                </div>
              );
            })}
          </div>

          {/* Detailed Comparison Table */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Detailed Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-sm border border-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Provider</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Compute</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Storage</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Database</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Est. Cost</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {assessment.recommendations.slice(0, 5).map((recommendation) => {
                    const provider = providersMap.get(recommendation.providerId);
                    if (!provider) return null;

                    return (
                      <tr key={provider.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <i className={`${provider.logo} text-2xl mr-3`}></i>
                            <div>
                              <div className="font-semibold">{provider.displayName}</div>
                              <div className="text-sm text-slate-500">{recommendation.matchScore}% match</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{recommendation.recommendedServices.compute}</td>
                        <td className="px-6 py-4 text-sm">{recommendation.recommendedServices.storage.join(", ")}</td>
                        <td className="px-6 py-4 text-sm">{recommendation.recommendedServices.database || "None"}</td>
                        <td className="px-6 py-4 text-sm font-semibold">
                          ${recommendation.estimatedCost.min}-${recommendation.estimatedCost.max}/mo
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/setup/${provider.id}`}>
                            <button className="text-primary hover:text-blue-700 font-medium text-sm">
                              Setup Guide <i className="fas fa-arrow-right ml-1"></i>
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Calculator */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CostCalculator 
            providers={providers} 
            initialRequirements={assessment.requirements}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
