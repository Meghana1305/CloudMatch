import { z } from "zod";

// Cloud Provider Schema
export const cloudProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  logo: z.string(),
  description: z.string(),
  regions: z.array(z.string()),
  services: z.object({
    compute: z.array(z.object({
      name: z.string(),
      type: z.string(),
      vcpu: z.number(),
      memory: z.number(),
      pricePerHour: z.number(),
    })),
    storage: z.array(z.object({
      name: z.string(),
      type: z.string(),
      pricePerGB: z.number(),
    })),
    database: z.array(z.object({
      name: z.string(),
      type: z.string(),
      pricePerHour: z.number(),
    })),
  }),
  pricing: z.object({
    computeMultiplier: z.number(),
    storageMultiplier: z.number(),
    networkMultiplier: z.number(),
  }),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  bestFor: z.array(z.string()),
  setupComplexity: z.enum(["easy", "medium", "hard"]),
  supportQuality: z.enum(["basic", "good", "excellent"]),
  compliance: z.array(z.string()),
});

// User Requirements Schema
export const userRequirementsSchema = z.object({
  projectType: z.enum(["web-app", "data-analytics", "ecommerce", "enterprise", "mobile-app", "iot"]),
  budget: z.enum(["0-50", "50-200", "200-1000", "1000+"]),
  primaryRegion: z.string(),
  specificCountries: z.array(z.string()).optional(),
  multiRegion: z.boolean(),
  expectedTraffic: z.enum(["low", "medium", "high", "enterprise"]),
  scalingNeeds: z.enum(["static", "moderate", "aggressive", "enterprise"]),
  complianceRequirements: z.array(z.string()),
  technicalExpertise: z.enum(["beginner", "intermediate", "advanced"]),
  supportImportance: z.enum(["low", "medium", "high"]),
  compute: z.object({
    vcpu: z.number(),
    memory: z.number(),
  }),
  storage: z.object({
    block: z.number(),
    object: z.number(),
  }),
  database: z.boolean(),
});

// Recommendation Schema
export const recommendationSchema = z.object({
  providerId: z.string(),
  matchScore: z.number(),
  estimatedCost: z.object({
    min: z.number(),
    max: z.number(),
  }),
  reasons: z.array(z.string()),
  warnings: z.array(z.string()),
  recommendedServices: z.object({
    compute: z.string(),
    storage: z.array(z.string()),
    database: z.string().optional(),
  }),
});

// Assessment Result Schema
export const assessmentResultSchema = z.object({
  id: z.string(),
  requirements: userRequirementsSchema,
  recommendations: z.array(recommendationSchema),
  createdAt: z.date(),
});

export type CloudProvider = z.infer<typeof cloudProviderSchema>;
export type UserRequirements = z.infer<typeof userRequirementsSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
export type AssessmentResult = z.infer<typeof assessmentResultSchema>;

export const insertUserRequirementsSchema = userRequirementsSchema;
export const insertAssessmentResultSchema = assessmentResultSchema.omit({ id: true, createdAt: true });

export type InsertUserRequirements = z.infer<typeof insertUserRequirementsSchema>;
export type InsertAssessmentResult = z.infer<typeof insertAssessmentResultSchema>;

// Email Schema
export const emailRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  assessmentId: z.string(),
  subject: z.string().optional(),
});

export type EmailRequest = z.infer<typeof emailRequestSchema>;
