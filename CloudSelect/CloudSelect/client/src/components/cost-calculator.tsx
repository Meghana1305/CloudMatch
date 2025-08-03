import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { type CloudProvider, type UserRequirements } from "@shared/schema";

interface CostCalculatorProps {
  providers: CloudProvider[];
  initialRequirements: UserRequirements;
}

interface CostConfig {
  compute: string;
  blockStorage: number;
  objectStorage: number;
  database: string;
  traffic: string;
}

export default function CostCalculator({ providers, initialRequirements }: CostCalculatorProps) {
  const [config, setConfig] = useState<CostConfig>({
    compute: "medium",
    blockStorage: initialRequirements.storage.block,
    objectStorage: initialRequirements.storage.object,
    database: initialRequirements.database ? "small" : "none",
    traffic: initialRequirements.expectedTraffic,
  });

  const calculateProviderCost = (provider: CloudProvider) => {
    let monthlyCost = 0;

    // Compute costs
    const computeMultiplier = config.compute === "light" ? 0.5 : config.compute === "medium" ? 1 : config.compute === "high" ? 2 : 4;
    const baseComputeCost = provider.services.compute[0]?.pricePerHour || 0.02;
    monthlyCost += baseComputeCost * 24 * 30 * computeMultiplier;

    // Storage costs
    const blockStorage = provider.services.storage.find(s => s.type === "block");
    const objectStorage = provider.services.storage.find(s => s.type === "object");
    
    if (blockStorage) {
      monthlyCost += blockStorage.pricePerGB * config.blockStorage;
    }
    if (objectStorage) {
      monthlyCost += objectStorage.pricePerGB * config.objectStorage;
    }

    // Database costs
    if (config.database !== "none" && provider.services.database.length > 0) {
      const dbMultiplier = config.database === "small" ? 1 : config.database === "medium" ? 2 : 4;
      const baseDatabaseCost = provider.services.database[0]?.pricePerHour || 0.02;
      monthlyCost += baseDatabaseCost * 24 * 30 * dbMultiplier;
    }

    // Traffic costs
    const trafficMultiplier = config.traffic === "low" ? 0.5 : config.traffic === "medium" ? 1 : config.traffic === "high" ? 2 : 4;
    monthlyCost += 10 * trafficMultiplier; // Base traffic cost

    // Apply provider pricing multipliers
    monthlyCost *= provider.pricing.computeMultiplier;

    return Math.round(monthlyCost);
  };

  const costs = providers
    .map(provider => ({
      provider,
      cost: calculateProviderCost(provider),
    }))
    .sort((a, b) => a.cost - b.cost);

  const maxCost = Math.max(...costs.map(c => c.cost));

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Cost Calculator</h2>
        <p className="text-xl text-slate-600">Estimate and compare costs across different cloud providers</p>
      </div>

      <Card className="bg-slate-50">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Inputs */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Configure Your Requirements</h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="compute" className="text-sm font-medium text-slate-700 mb-2">
                    Compute Requirements
                  </Label>
                  <Select value={config.compute} onValueChange={(value) => setConfig({ ...config, compute: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light (1 vCPU, 1GB RAM) - $20-30/mo</SelectItem>
                      <SelectItem value="medium">Medium (2 vCPU, 4GB RAM) - $40-80/mo</SelectItem>
                      <SelectItem value="high">High (4 vCPU, 8GB RAM) - $100-200/mo</SelectItem>
                      <SelectItem value="enterprise">Enterprise (8+ vCPU, 16GB+ RAM) - $300+/mo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2">Storage Needs</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="number"
                        placeholder="GB"
                        value={config.blockStorage}
                        onChange={(e) => setConfig({ ...config, blockStorage: parseInt(e.target.value) || 0 })}
                      />
                      <Label className="text-xs text-slate-500 mt-1">Block Storage</Label>
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="GB"
                        value={config.objectStorage}
                        onChange={(e) => setConfig({ ...config, objectStorage: parseInt(e.target.value) || 0 })}
                      />
                      <Label className="text-xs text-slate-500 mt-1">Object Storage</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="database" className="text-sm font-medium text-slate-700 mb-2">Database</Label>
                  <Select value={config.database} onValueChange={(value) => setConfig({ ...config, database: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="small">Small MySQL (1 vCPU, 1GB) - $15-25/mo</SelectItem>
                      <SelectItem value="medium">Medium MySQL (2 vCPU, 4GB) - $50-80/mo</SelectItem>
                      <SelectItem value="large">Large PostgreSQL (4 vCPU, 8GB) - $150-250/mo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="traffic" className="text-sm font-medium text-slate-700 mb-2">Monthly Traffic</Label>
                  <Select value={config.traffic} onValueChange={(value) => setConfig({ ...config, traffic: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (&lt; 1TB) - $5-15/mo</SelectItem>
                      <SelectItem value="medium">Medium (1-5TB) - $15-50/mo</SelectItem>
                      <SelectItem value="high">High (5-20TB) - $50-200/mo</SelectItem>
                      <SelectItem value="enterprise">Enterprise (20TB+) - $200+/mo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Cost Comparison Results */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Monthly Cost Comparison</h3>
              <div className="space-y-4">
                {costs.slice(0, 5).map(({ provider, cost }) => (
                  <div key={provider.id} className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <i className={`${provider.logo} text-xl mr-3`}></i>
                        <span className="font-semibold">{provider.displayName}</span>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${cost === costs[0].cost ? 'text-secondary' : ''}`}>
                          ${cost}
                        </div>
                        <div className="text-xs text-slate-500">per month</div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${cost === costs[0].cost ? 'bg-secondary' : 'bg-slate-400'}`}
                        style={{ width: `${(cost / maxCost) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <i className="fas fa-info-circle text-blue-600 mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-medium text-blue-800">Cost Breakdown</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Estimates include compute, storage, database, and basic networking. Actual costs may vary based on usage patterns.
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6">
                <i className="fas fa-download mr-2"></i>Export Cost Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
