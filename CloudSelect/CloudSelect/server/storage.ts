import { type CloudProvider, type AssessmentResult, type UserRequirements, type Recommendation, type InsertAssessmentResult } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCloudProviders(): Promise<CloudProvider[]>;
  getCloudProvider(id: string): Promise<CloudProvider | undefined>;
  createAssessment(assessment: InsertAssessmentResult): Promise<AssessmentResult>;
  getAssessment(id: string): Promise<AssessmentResult | undefined>;
}

export class MemStorage implements IStorage {
  private providers: Map<string, CloudProvider>;
  private assessments: Map<string, AssessmentResult>;

  constructor() {
    this.providers = new Map();
    this.assessments = new Map();
    this.initializeProviders();
  }

  private initializeProviders() {
    const providers: CloudProvider[] = [
      {
        id: "aws",
        name: "aws",
        displayName: "Amazon Web Services",
        logo: "fab fa-aws",
        description: "Comprehensive cloud platform with the largest market share",
        regions: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1", "ap-northeast-1"],
        services: {
          compute: [
            { name: "EC2 t3.micro", type: "t3.micro", vcpu: 2, memory: 1, pricePerHour: 0.0104 },
            { name: "EC2 t3.small", type: "t3.small", vcpu: 2, memory: 2, pricePerHour: 0.0208 },
            { name: "EC2 t3.medium", type: "t3.medium", vcpu: 2, memory: 4, pricePerHour: 0.0416 },
            { name: "EC2 t3.large", type: "t3.large", vcpu: 2, memory: 8, pricePerHour: 0.0832 },
          ],
          storage: [
            { name: "EBS gp3", type: "block", pricePerGB: 0.08 },
            { name: "S3 Standard", type: "object", pricePerGB: 0.023 },
          ],
          database: [
            { name: "RDS MySQL db.t3.micro", type: "mysql", pricePerHour: 0.017 },
            { name: "RDS MySQL db.t3.small", type: "mysql", pricePerHour: 0.034 },
          ],
        },
        pricing: {
          computeMultiplier: 1.0,
          storageMultiplier: 1.0,
          networkMultiplier: 1.0,
        },
        strengths: ["Largest ecosystem", "Mature services", "Global reach", "Enterprise features"],
        weaknesses: ["Complex pricing", "Steep learning curve", "Can be expensive"],
        bestFor: ["Enterprise applications", "Complex architectures", "Global deployment"],
        setupComplexity: "medium",
        supportQuality: "excellent",
        compliance: ["SOC2", "ISO27001", "HIPAA", "GDPR", "PCI-DSS"],
      },
      {
        id: "gcp",
        name: "gcp",
        displayName: "Google Cloud Platform",
        logo: "fab fa-google",
        description: "Google's cloud platform with strong AI/ML and data analytics",
        regions: ["us-central1", "us-east1", "europe-west1", "asia-east1", "australia-southeast1"],
        services: {
          compute: [
            { name: "Compute Engine e2-micro", type: "e2-micro", vcpu: 1, memory: 1, pricePerHour: 0.008 },
            { name: "Compute Engine e2-small", type: "e2-small", vcpu: 1, memory: 2, pricePerHour: 0.016 },
            { name: "Compute Engine e2-medium", type: "e2-medium", vcpu: 1, memory: 4, pricePerHour: 0.033 },
            { name: "Compute Engine e2-standard-2", type: "e2-standard-2", vcpu: 2, memory: 8, pricePerHour: 0.067 },
          ],
          storage: [
            { name: "Persistent Disk", type: "block", pricePerGB: 0.04 },
            { name: "Cloud Storage Standard", type: "object", pricePerGB: 0.02 },
          ],
          database: [
            { name: "Cloud SQL MySQL db-f1-micro", type: "mysql", pricePerHour: 0.015 },
            { name: "Cloud SQL MySQL db-g1-small", type: "mysql", pricePerHour: 0.025 },
          ],
        },
        pricing: {
          computeMultiplier: 0.9,
          storageMultiplier: 0.8,
          networkMultiplier: 0.85,
        },
        strengths: ["Competitive pricing", "Strong AI/ML", "Good performance", "Sustainable"],
        weaknesses: ["Smaller ecosystem", "Less enterprise features", "Regional coverage"],
        bestFor: ["Data analytics", "AI/ML workloads", "Cost optimization"],
        setupComplexity: "easy",
        supportQuality: "good",
        compliance: ["SOC2", "ISO27001", "HIPAA", "GDPR"],
      },
      {
        id: "azure",
        name: "azure",
        displayName: "Microsoft Azure",
        logo: "fab fa-microsoft",
        description: "Microsoft's cloud platform with strong enterprise integration",
        regions: ["eastus", "westus2", "westeurope", "southeastasia", "australiaeast"],
        services: {
          compute: [
            { name: "B1s", type: "B1s", vcpu: 1, memory: 1, pricePerHour: 0.0104 },
            { name: "B2s", type: "B2s", vcpu: 2, memory: 4, pricePerHour: 0.0416 },
            { name: "B4ms", type: "B4ms", vcpu: 4, memory: 16, pricePerHour: 0.166 },
          ],
          storage: [
            { name: "Managed Disk Premium", type: "block", pricePerGB: 0.135 },
            { name: "Blob Storage", type: "object", pricePerGB: 0.0208 },
          ],
          database: [
            { name: "SQL Database Basic", type: "mssql", pricePerHour: 0.007 },
            { name: "SQL Database S0", type: "mssql", pricePerHour: 0.02 },
          ],
        },
        pricing: {
          computeMultiplier: 1.05,
          storageMultiplier: 1.1,
          networkMultiplier: 1.0,
        },
        strengths: ["Microsoft integration", "Hybrid cloud", "Enterprise features", "Good support"],
        weaknesses: ["Higher pricing", "Windows-centric", "Learning curve"],
        bestFor: ["Microsoft shops", "Enterprise", "Hybrid deployments"],
        setupComplexity: "medium",
        supportQuality: "excellent",
        compliance: ["SOC2", "ISO27001", "HIPAA", "GDPR", "FedRAMP"],
      },
      {
        id: "digitalocean",
        name: "digitalocean",
        displayName: "DigitalOcean",
        logo: "fas fa-server",
        description: "Developer-friendly cloud platform with simple pricing",
        regions: ["nyc1", "sfo2", "ams3", "sgp1", "fra1"],
        services: {
          compute: [
            { name: "Basic Droplet 1GB", type: "s-1vcpu-1gb", vcpu: 1, memory: 1, pricePerHour: 0.007 },
            { name: "Basic Droplet 2GB", type: "s-1vcpu-2gb", vcpu: 1, memory: 2, pricePerHour: 0.015 },
            { name: "Basic Droplet 4GB", type: "s-2vcpu-4gb", vcpu: 2, memory: 4, pricePerHour: 0.030 },
          ],
          storage: [
            { name: "Block Storage", type: "block", pricePerGB: 0.10 },
            { name: "Spaces Object Storage", type: "object", pricePerGB: 0.02 },
          ],
          database: [
            { name: "Managed MySQL Basic", type: "mysql", pricePerHour: 0.022 },
            { name: "Managed MySQL Professional", type: "mysql", pricePerHour: 0.045 },
          ],
        },
        pricing: {
          computeMultiplier: 0.7,
          storageMultiplier: 0.9,
          networkMultiplier: 0.8,
        },
        strengths: ["Simple pricing", "Developer friendly", "Great UX", "Predictable costs"],
        weaknesses: ["Limited enterprise features", "Fewer regions", "Basic compliance"],
        bestFor: ["Startups", "Simple applications", "Cost-conscious projects"],
        setupComplexity: "easy",
        supportQuality: "good",
        compliance: ["SOC2", "GDPR"],
      },
      {
        id: "linode",
        name: "linode",
        displayName: "Linode",
        logo: "fas fa-cloud",
        description: "High-performance cloud platform with competitive pricing",
        regions: ["us-east", "us-west", "eu-west", "ap-south", "ap-northeast"],
        services: {
          compute: [
            { name: "Nanode 1GB", type: "g6-nanode-1", vcpu: 1, memory: 1, pricePerHour: 0.007 },
            { name: "Linode 2GB", type: "g6-standard-1", vcpu: 1, memory: 2, pricePerHour: 0.015 },
            { name: "Linode 4GB", type: "g6-standard-2", vcpu: 2, memory: 4, pricePerHour: 0.030 },
          ],
          storage: [
            { name: "Block Storage", type: "block", pricePerGB: 0.10 },
            { name: "Object Storage", type: "object", pricePerGB: 0.02 },
          ],
          database: [
            { name: "Managed MySQL", type: "mysql", pricePerHour: 0.022 },
          ],
        },
        pricing: {
          computeMultiplier: 0.75,
          storageMultiplier: 0.85,
          networkMultiplier: 0.8,
        },
        strengths: ["High performance", "Competitive pricing", "Good support", "Simple interface"],
        weaknesses: ["Smaller ecosystem", "Limited enterprise features", "Fewer regions"],
        bestFor: ["High-performance apps", "Cost optimization", "Growing companies"],
        setupComplexity: "easy",
        supportQuality: "good",
        compliance: ["SOC2", "GDPR"],
      },
      {
        id: "ibm",
        name: "ibm",
        displayName: "IBM Cloud",
        logo: "fas fa-cloud",
        description: "Enterprise-focused cloud platform with strong AI and hybrid cloud capabilities",
        regions: ["us-east", "us-south", "eu-gb", "eu-de", "jp-tok", "au-syd"],
        services: {
          compute: [
            { name: "Virtual Server bx2-2x8", type: "bx2-2x8", vcpu: 2, memory: 8, pricePerHour: 0.095 },
            { name: "Virtual Server bx2-4x16", type: "bx2-4x16", vcpu: 4, memory: 16, pricePerHour: 0.190 },
          ],
          storage: [
            { name: "Block Storage", type: "block", pricePerGB: 0.10 },
            { name: "Object Storage", type: "object", pricePerGB: 0.023 },
          ],
          database: [
            { name: "Databases for MySQL", type: "mysql", pricePerHour: 0.030 },
          ],
        },
        pricing: {
          computeMultiplier: 1.15,
          storageMultiplier: 1.0,
          networkMultiplier: 1.05,
        },
        strengths: ["Enterprise integration", "AI/ML services", "Hybrid cloud", "Security focus"],
        weaknesses: ["Higher pricing", "Complex interface", "Limited regions"],
        bestFor: ["Enterprise applications", "AI/ML workloads", "Hybrid deployments"],
        setupComplexity: "hard",
        supportQuality: "excellent",
        compliance: ["SOC2", "ISO27001", "HIPAA", "GDPR", "FedRAMP"],
      },
      {
        id: "oracle",
        name: "oracle",
        displayName: "Oracle Cloud",
        logo: "fas fa-database",
        description: "Database-focused cloud platform with strong enterprise features",
        regions: ["us-ashburn-1", "us-phoenix-1", "eu-frankfurt-1", "uk-london-1", "ap-tokyo-1"],
        services: {
          compute: [
            { name: "VM.Standard2.1", type: "VM.Standard2.1", vcpu: 1, memory: 15, pricePerHour: 0.0255 },
            { name: "VM.Standard2.2", type: "VM.Standard2.2", vcpu: 2, memory: 30, pricePerHour: 0.051 },
          ],
          storage: [
            { name: "Block Volume", type: "block", pricePerGB: 0.0255 },
            { name: "Object Storage", type: "object", pricePerGB: 0.025 },
          ],
          database: [
            { name: "Autonomous Database", type: "oracle", pricePerHour: 0.36 },
          ],
        },
        pricing: {
          computeMultiplier: 0.95,
          storageMultiplier: 0.9,
          networkMultiplier: 1.0,
        },
        strengths: ["Database expertise", "Autonomous features", "Good pricing", "Always Free tier"],
        weaknesses: ["Oracle-centric", "Smaller ecosystem", "Limited third-party integrations"],
        bestFor: ["Database-heavy applications", "Oracle workloads", "Cost optimization"],
        setupComplexity: "medium",
        supportQuality: "good",
        compliance: ["SOC2", "ISO27001", "HIPAA", "GDPR"],
      },
      {
        id: "alibaba",
        name: "alibaba",
        displayName: "Alibaba Cloud",
        logo: "fas fa-cloud-upload-alt",
        description: "Leading cloud provider in Asia with strong presence in China",
        regions: ["cn-hangzhou", "cn-beijing", "us-east-1", "eu-central-1", "ap-southeast-1"],
        services: {
          compute: [
            { name: "ECS t5-lc1m1.small", type: "t5-lc1m1.small", vcpu: 1, memory: 1, pricePerHour: 0.009 },
            { name: "ECS t5-lc1m2.small", type: "t5-lc1m2.small", vcpu: 1, memory: 2, pricePerHour: 0.014 },
          ],
          storage: [
            { name: "Enhanced SSD", type: "block", pricePerGB: 0.08 },
            { name: "Object Storage Service", type: "object", pricePerGB: 0.02 },
          ],
          database: [
            { name: "ApsaraDB RDS MySQL", type: "mysql", pricePerHour: 0.022 },
          ],
        },
        pricing: {
          computeMultiplier: 0.8,
          storageMultiplier: 0.75,
          networkMultiplier: 0.85,
        },
        strengths: ["Asia-Pacific presence", "Competitive pricing", "Strong in China", "Good performance"],
        weaknesses: ["Language barriers", "Limited Western presence", "Compliance concerns"],
        bestFor: ["Asia market", "Cost-sensitive projects", "China deployment"],
        setupComplexity: "medium",
        supportQuality: "good",
        compliance: ["ISO27001", "SOC2"],
      },
      {
        id: "hetzner",
        name: "hetzner",
        displayName: "Hetzner Cloud",
        logo: "fas fa-server",
        description: "German cloud provider known for excellent price-performance ratio",
        regions: ["nbg1", "fsn1", "hel1", "ash", "hil"],
        services: {
          compute: [
            { name: "CX11", type: "cx11", vcpu: 1, memory: 4, pricePerHour: 0.005 },
            { name: "CX21", type: "cx21", vcpu: 2, memory: 8, pricePerHour: 0.010 },
            { name: "CX31", type: "cx31", vcpu: 2, memory: 8, pricePerHour: 0.015 },
          ],
          storage: [
            { name: "Local SSD", type: "block", pricePerGB: 0.0476 },
            { name: "Volume", type: "block", pricePerGB: 0.0476 },
          ],
          database: [],
        },
        pricing: {
          computeMultiplier: 0.6,
          storageMultiplier: 0.7,
          networkMultiplier: 0.5,
        },
        strengths: ["Excellent pricing", "High performance", "German engineering", "Simple interface"],
        weaknesses: ["Limited regions", "No managed databases", "Europe-focused"],
        bestFor: ["Budget-conscious projects", "European users", "High-performance computing"],
        setupComplexity: "easy",
        supportQuality: "good",
        compliance: ["GDPR", "ISO27001"],
      },
      {
        id: "ovh",
        name: "ovh",
        displayName: "OVHcloud",
        logo: "fas fa-cloud",
        description: "European cloud provider with focus on data sovereignty",
        regions: ["GRA", "SBG", "WAW", "UK1", "DE1", "US-EAST", "US-WEST"],
        services: {
          compute: [
            { name: "B2-7", type: "b2-7", vcpu: 2, memory: 7, pricePerHour: 0.0056 },
            { name: "B2-15", type: "b2-15", vcpu: 4, memory: 15, pricePerHour: 0.0113 },
          ],
          storage: [
            { name: "High Speed Volume", type: "block", pricePerGB: 0.08 },
            { name: "Object Storage", type: "object", pricePerGB: 0.0115 },
          ],
          database: [
            { name: "Public Cloud Databases", type: "mysql", pricePerHour: 0.024 },
          ],
        },
        pricing: {
          computeMultiplier: 0.65,
          storageMultiplier: 0.8,
          networkMultiplier: 0.7,
        },
        strengths: ["European data centers", "GDPR compliance", "Competitive pricing", "Data sovereignty"],
        weaknesses: ["Limited global presence", "Interface complexity", "Smaller ecosystem"],
        bestFor: ["European businesses", "GDPR compliance", "Data sovereignty requirements"],
        setupComplexity: "medium",
        supportQuality: "good",
        compliance: ["GDPR", "ISO27001", "SOC2"],
      },
      {
        id: "vultr",
        name: "vultr",
        displayName: "Vultr",
        logo: "fas fa-cloud-upload-alt",
        description: "High-performance cloud provider with global presence",
        regions: ["ewr", "ord", "dfw", "sea", "lax", "fra", "ams", "lon", "sgp", "nrt", "syd"],
        services: {
          compute: [
            { name: "Regular 1GB", type: "vc2-1c-1gb", vcpu: 1, memory: 1, pricePerHour: 0.007 },
            { name: "Regular 2GB", type: "vc2-1c-2gb", vcpu: 1, memory: 2, pricePerHour: 0.012 },
            { name: "Regular 4GB", type: "vc2-2c-4gb", vcpu: 2, memory: 4, pricePerHour: 0.024 },
          ],
          storage: [
            { name: "NVMe Block Storage", type: "block", pricePerGB: 0.10 },
            { name: "Object Storage", type: "object", pricePerGB: 0.02 },
          ],
          database: [
            { name: "Managed Database", type: "mysql", pricePerHour: 0.020 },
          ],
        },
        pricing: {
          computeMultiplier: 0.75,
          storageMultiplier: 0.85,
          networkMultiplier: 0.8,
        },
        strengths: ["High performance", "Global network", "SSD storage", "Developer-friendly"],
        weaknesses: ["Limited enterprise features", "Basic support", "No free tier"],
        bestFor: ["Performance-critical apps", "Global deployment", "Developer projects"],
        setupComplexity: "easy",
        supportQuality: "basic",
        compliance: ["SOC2", "GDPR"],
      },
    ];

    providers.forEach(provider => {
      this.providers.set(provider.id, provider);
    });
  }

  async getCloudProviders(): Promise<CloudProvider[]> {
    return Array.from(this.providers.values());
  }

  async getCloudProvider(id: string): Promise<CloudProvider | undefined> {
    return this.providers.get(id);
  }

  async createAssessment(insertAssessment: InsertAssessmentResult): Promise<AssessmentResult> {
    const id = randomUUID();
    const assessment: AssessmentResult = {
      ...insertAssessment,
      id,
      createdAt: new Date(),
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getAssessment(id: string): Promise<AssessmentResult | undefined> {
    return this.assessments.get(id);
  }
}

export const storage = new MemStorage();
