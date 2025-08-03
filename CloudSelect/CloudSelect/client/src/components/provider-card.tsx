import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type CloudProvider, type Recommendation } from "@shared/schema";

interface ProviderCardProps {
  provider: CloudProvider;
  recommendation: Recommendation;
  rank: number;
}

export default function ProviderCard({ provider, recommendation, rank }: ProviderCardProps) {
  const getBadgeInfo = () => {
    if (rank === 2) return { label: "2nd Choice", className: "text-accent bg-amber-100" };
    if (recommendation.estimatedCost.max < 100) return { label: "Budget Pick", className: "text-primary bg-blue-100" };
    return { label: `#${rank} Choice`, className: "text-slate-600 bg-slate-100" };
  };

  const badgeInfo = getBadgeInfo();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <i className={`${provider.logo} text-3xl mr-3`}></i>
            <div>
              <h3 className="text-xl font-bold">{provider.displayName}</h3>
              <p className="text-slate-600">Match Score: {recommendation.matchScore}%</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-sm font-medium ${badgeInfo.className}`}>
            {badgeInfo.label}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-slate-500 text-sm">Est. Cost</div>
            <div className={`font-semibold ${recommendation.estimatedCost.max < 100 ? 'text-secondary' : ''}`}>
              ${recommendation.estimatedCost.min}-${recommendation.estimatedCost.max}/month
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-sm">Setup</div>
            <div className={`font-semibold capitalize ${provider.setupComplexity === 'easy' ? 'text-secondary' : ''}`}>
              {provider.setupComplexity}
            </div>
          </div>
        </div>
        
        <p className="text-slate-600 text-sm mb-4">
          {recommendation.reasons[0] || provider.description}
        </p>
        
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex-1">
            View Details
          </Button>
          <Link href={`/setup/${provider.id}`}>
            <Button variant="ghost" size="sm">
              <i className="fas fa-external-link-alt"></i>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
