import { useState } from "react";
import { type CloudProvider, type Recommendation } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProviderComparisonProps {
  providers: CloudProvider[];
  recommendations: Recommendation[];
  selectedProviders?: string[];
}

export default function ProviderComparison({ providers, recommendations, selectedProviders = [] }: ProviderComparisonProps) {
  const [compareIds, setCompareIds] = useState<string[]>(selectedProviders.slice(0, 3));
  
  const providersMap = new Map(providers.map(p => [p.id, p]));
  const recommendationsMap = new Map(recommendations.map(r => [r.providerId, r]));
  
  const compareProviders = compareIds.map(id => providersMap.get(id)).filter(Boolean) as CloudProvider[];
  
  const toggleProvider = (providerId: string) => {
    setCompareIds(prev => {
      if (prev.includes(providerId)) {
        return prev.filter(id => id !== providerId);
      }
      if (prev.length >= 3) {
        return [providerId, ...prev.slice(0, 2)];
      }
      return [...prev, providerId];
    });
  };

  return (
    <div className="space-y-6">
      {/* Provider Selection */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Select Providers to Compare (up to 3)</h3>
        <div className="flex flex-wrap gap-2">
          {recommendations.slice(0, 6).map(rec => {
            const provider = providersMap.get(rec.providerId);
            if (!provider) return null;
            
            return (
              <button
                key={provider.id}
                onClick={() => toggleProvider(provider.id)}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  compareIds.includes(provider.id)
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <i className={`${provider.logo} text-xl mr-2`}></i>
                <span className="font-medium">{provider.displayName}</span>
                <Badge variant="secondary" className="ml-2">
                  {rec.matchScore}%
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Chart */}
      {compareProviders.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Provider Comparison</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-600">Feature</th>
                  {compareProviders.map(provider => (
                    <th key={provider.id} className="text-center p-4 min-w-[200px]">
                      <div className="flex flex-col items-center">
                        <i className={`${provider.logo} text-2xl mb-2`}></i>
                        <span className="font-semibold">{provider.displayName}</span>
                        <Badge variant="outline" className="mt-1">
                          {recommendationsMap.get(provider.id)?.matchScore}% match
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Match Score */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Match Score</td>
                  {compareProviders.map(provider => {
                    const rec = recommendationsMap.get(provider.id);
                    return (
                      <td key={provider.id} className="p-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                              style={{ width: `${rec?.matchScore || 0}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 font-semibold">{rec?.matchScore}%</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Estimated Cost */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Monthly Cost</td>
                  {compareProviders.map(provider => {
                    const rec = recommendationsMap.get(provider.id);
                    return (
                      <td key={provider.id} className="p-4 text-center">
                        <div className="font-semibold text-green-600">
                          ${rec?.estimatedCost.min}-${rec?.estimatedCost.max}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Setup Complexity */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Setup Difficulty</td>
                  {compareProviders.map(provider => (
                    <td key={provider.id} className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="flex space-x-1 mr-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i <= (provider.setupComplexity === "easy" ? 1 : provider.setupComplexity === "medium" ? 2 : 3)
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                          ))}
                        </div>
                        <Badge variant={
                          provider.setupComplexity === "easy" ? "secondary" :
                          provider.setupComplexity === "medium" ? "outline" : "destructive"
                        }>
                          {provider.setupComplexity}
                        </Badge>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Global Regions */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Global Regions</td>
                  {compareProviders.map(provider => (
                    <td key={provider.id} className="p-4 text-center">
                      <span className="font-semibold">{provider.regions.length}</span>
                      <div className="text-sm text-gray-500 mt-1">regions</div>
                    </td>
                  ))}
                </tr>

                {/* Support Quality */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Support Quality</td>
                  {compareProviders.map(provider => (
                    <td key={provider.id} className="p-4 text-center">
                      <Badge variant={
                        provider.supportQuality === "excellent" ? "default" :
                        provider.supportQuality === "good" ? "secondary" : "outline"
                      }>
                        {provider.supportQuality}
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Strengths */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Key Strengths</td>
                  {compareProviders.map(provider => (
                    <td key={provider.id} className="p-4">
                      <ul className="text-sm space-y-1">
                        {provider.strengths.slice(0, 3).map((strength, idx) => (
                          <li key={idx} className="flex items-center">
                            <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Best For */}
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-medium">Best For</td>
                  {compareProviders.map(provider => (
                    <td key={provider.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {provider.bestFor.slice(0, 3).map((use, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {use}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}