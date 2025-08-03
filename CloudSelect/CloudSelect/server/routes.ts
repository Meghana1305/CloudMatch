import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { userRequirementsSchema, type UserRequirements, type Recommendation } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all cloud providers
  app.get("/api/providers", async (req, res) => {
    try {
      const providers = await storage.getCloudProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  });

  // Get specific cloud provider
  app.get("/api/providers/:id", async (req, res) => {
    try {
      const provider = await storage.getCloudProvider(req.params.id);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      res.json(provider);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch provider" });
    }
  });

  // Submit requirements and get recommendations
  app.post("/api/assess", async (req, res) => {
    try {
      const requirements = userRequirementsSchema.parse(req.body);
      const providers = await storage.getCloudProviders();
      
      // Generate recommendations
      const recommendations = generateRecommendations(requirements, providers);
      
      // Save assessment
      const assessment = await storage.createAssessment({
        requirements,
        recommendations,
      });

      res.json({
        assessmentId: assessment.id,
        recommendations,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to process assessment" });
      }
    }
  });

  // Get assessment results
  app.get("/api/assessment/:id", async (req, res) => {
    try {
      const assessment = await storage.getAssessment(req.params.id);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  // Email Results
  app.post("/api/email-results", async (req, res) => {
    try {
      const { email, assessmentId, subject } = req.body;
      
      // In a real implementation, you would:
      // 1. Retrieve the assessment results
      // 2. Format them into a nice email template
      // 3. Send via email service (SendGrid, Mailgun, etc.)
      
      // For now, we'll simulate successful email sending
      console.log(`Email would be sent to: ${email} for assessment: ${assessmentId}`);
      console.log(`Subject: ${subject || 'Your CloudMatch Recommendations'}`);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({ 
        success: true, 
        message: "Email sent successfully" 
      });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to send email" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateRecommendations(requirements: UserRequirements, providers: any[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const provider of providers) {
    let score = 0;
    const reasons: string[] = [];
    const warnings: string[] = [];

    // Budget scoring
    const budgetRange = requirements.budget;
    const estimatedCost = calculateProviderCost(requirements, provider);
    
    if (budgetRange === "0-50" && estimatedCost.max <= 60) {
      score += 25;
      reasons.push("Fits within your budget constraints");
    } else if (budgetRange === "50-200" && estimatedCost.max <= 220) {
      score += 25;
      reasons.push("Good value within your budget range");
    } else if (budgetRange === "200-1000" && estimatedCost.max <= 1100) {
      score += 25;
      reasons.push("Suitable for your budget requirements");
    } else if (budgetRange === "1000+") {
      score += 25;
      reasons.push("Enterprise-level features for your budget");
    } else {
      warnings.push("May exceed your stated budget");
    }

    // Regional coverage scoring
    if (provider.regions.length >= 20) {
      score += 20;
      reasons.push("Excellent global coverage");
    } else if (provider.regions.length >= 10) {
      score += 15;
      reasons.push("Good regional availability");
    } else if (provider.regions.length >= 5) {
      score += 10;
      reasons.push("Adequate regional coverage");
    }

    // Project type compatibility
    if (requirements.projectType === "web-app") {
      if (provider.id === "aws" || provider.id === "azure") {
        score += 20;
        reasons.push("Excellent for web applications");
      } else if (provider.id === "gcp" || provider.id === "digitalocean" || provider.id === "vultr") {
        score += 18;
        reasons.push("Very good for web applications");
      } else if (provider.id === "hetzner" || provider.id === "linode") {
        score += 16;
        reasons.push("Good performance for web applications");
      }
    } else if (requirements.projectType === "data-analytics") {
      if (provider.id === "gcp") {
        score += 25;
        reasons.push("Industry-leading AI/ML and analytics services");
      } else if (provider.id === "aws") {
        score += 20;
        reasons.push("Comprehensive analytics platform");
      } else if (provider.id === "ibm") {
        score += 18;
        reasons.push("Strong AI and analytics capabilities");
      }
    } else if (requirements.projectType === "enterprise") {
      if (provider.id === "aws" || provider.id === "azure" || provider.id === "ibm") {
        score += 22;
        reasons.push("Enterprise-grade features and support");
      } else if (provider.id === "oracle") {
        score += 20;
        reasons.push("Strong enterprise database capabilities");
      }
    }

    // Regional preferences
    if (requirements.primaryRegion === "europe") {
      if (provider.id === "hetzner" || provider.id === "ovh") {
        score += 15;
        reasons.push("European-based provider with GDPR compliance");
      } else if (provider.id === "aws" || provider.id === "gcp" || provider.id === "azure") {
        score += 10;
        reasons.push("Strong European presence");
      }
    } else if (requirements.primaryRegion === "asia-pacific") {
      if (provider.id === "alibaba") {
        score += 15;
        reasons.push("Leading provider in Asia-Pacific region");
      } else if (provider.id === "aws" || provider.id === "gcp") {
        score += 12;
        reasons.push("Excellent Asia-Pacific coverage");
      }
    }

    // Cost optimization focus
    if (requirements.budget === "0-50" || requirements.budget === "50-200") {
      if (provider.id === "hetzner" || provider.id === "vultr" || provider.id === "ovh") {
        score += 15;
        reasons.push("Excellent price-performance ratio");
      } else if (provider.id === "digitalocean" || provider.id === "linode") {
        score += 12;
        reasons.push("Good value for money");
      } else if (provider.id === "oracle") {
        score += 10;
        reasons.push("Always Free tier available");
      }
    }

    // Setup complexity vs technical expertise
    if (requirements.technicalExpertise === "beginner") {
      if (provider.setupComplexity === "easy") {
        score += 15;
        reasons.push("Beginner-friendly setup process");
      } else if (provider.setupComplexity === "medium") {
        score += 8;
        warnings.push("Moderate setup complexity for beginners");
      } else {
        warnings.push("Complex setup may be challenging");
      }
    }

    // Compliance requirements
    if (requirements.complianceRequirements.length > 0) {
      const matchedCompliance = requirements.complianceRequirements.filter(req => 
        provider.compliance.includes(req)
      );
      if (matchedCompliance.length === requirements.complianceRequirements.length) {
        score += 15;
        reasons.push("Meets all compliance requirements");
      } else if (matchedCompliance.length > 0) {
        score += 10;
        reasons.push(`Meets ${matchedCompliance.length}/${requirements.complianceRequirements.length} compliance requirements`);
      } else {
        warnings.push("May not meet compliance requirements");
      }
    }

    // Support importance
    if (requirements.supportImportance === "high") {
      if (provider.supportQuality === "excellent") {
        score += 10;
        reasons.push("Excellent support quality");
      } else if (provider.supportQuality === "good") {
        score += 5;
        reasons.push("Good support available");
      }
    }

    recommendations.push({
      providerId: provider.id,
      matchScore: Math.min(score, 100),
      estimatedCost,
      reasons,
      warnings,
      recommendedServices: {
        compute: getRecommendedCompute(requirements, provider),
        storage: getRecommendedStorage(requirements, provider),
        database: requirements.database ? getRecommendedDatabase(requirements, provider) : undefined,
      },
    });
  }

  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}

function calculateProviderCost(requirements: UserRequirements, provider: any) {
  let monthlyCost = 0;

  // Compute costs
  const computeService = provider.services.compute.find((c: any) => 
    c.vcpu >= requirements.compute.vcpu && c.memory >= requirements.compute.memory
  ) || provider.services.compute[provider.services.compute.length - 1];
  
  monthlyCost += computeService.pricePerHour * 24 * 30;

  // Storage costs
  const blockStorage = provider.services.storage.find((s: any) => s.type === "block");
  const objectStorage = provider.services.storage.find((s: any) => s.type === "object");
  
  if (blockStorage) {
    monthlyCost += blockStorage.pricePerGB * requirements.storage.block;
  }
  if (objectStorage) {
    monthlyCost += objectStorage.pricePerGB * requirements.storage.object;
  }

  // Database costs
  if (requirements.database && provider.services.database.length > 0) {
    const dbService = provider.services.database[0];
    monthlyCost += dbService.pricePerHour * 24 * 30;
  }

  // Apply provider pricing multipliers
  monthlyCost *= provider.pricing.computeMultiplier;

  // Add buffer for networking and misc costs
  const networkingCost = monthlyCost * 0.1;
  monthlyCost += networkingCost;

  return {
    min: Math.round(monthlyCost * 0.8),
    max: Math.round(monthlyCost * 1.2),
  };
}

function getRecommendedCompute(requirements: UserRequirements, provider: any): string {
  const computeService = provider.services.compute.find((c: any) => 
    c.vcpu >= requirements.compute.vcpu && c.memory >= requirements.compute.memory
  ) || provider.services.compute[provider.services.compute.length - 1];
  
  return computeService.name;
}

function getRecommendedStorage(requirements: UserRequirements, provider: any): string[] {
  const storage = [];
  
  if (requirements.storage.block > 0) {
    const blockStorage = provider.services.storage.find((s: any) => s.type === "block");
    if (blockStorage) storage.push(blockStorage.name);
  }
  
  if (requirements.storage.object > 0) {
    const objectStorage = provider.services.storage.find((s: any) => s.type === "object");
    if (objectStorage) storage.push(objectStorage.name);
  }
  
  return storage;
}

function getRecommendedDatabase(requirements: UserRequirements, provider: any): string | undefined {
  if (provider.services.database.length > 0) {
    return provider.services.database[0].name;
  }
  return undefined;
}
