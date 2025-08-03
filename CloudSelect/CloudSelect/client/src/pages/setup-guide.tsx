import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type CloudProvider } from "@shared/schema";

interface SetupGuideProps {
  providerId: string;
}

export default function SetupGuide({ providerId }: SetupGuideProps) {
  const { data: provider, isLoading } = useQuery<CloudProvider>({
    queryKey: [`/api/providers/${providerId}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Loading setup guide...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Provider Not Found</h2>
            <p className="text-slate-600 mb-8">The setup guide you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getSetupSteps = () => {
    switch (provider.id) {
      case "aws":
        return [
          {
            title: "Create AWS Account & Configure Billing",
            description: "Set up your AWS account with billing alerts to monitor costs",
            details: "Enable the AWS Free Tier to save costs during testing",
            commands: [
              "# Install AWS CLI",
              "curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'",
              "unzip awscliv2.zip",
              "sudo ./aws/install"
            ]
          },
          {
            title: "Launch EC2 Instance",
            description: "Create and configure your web server",
            details: "Recommended: t3.medium (2 vCPU, 4GB RAM), Amazon Linux 2, 20GB gp3, Security Group: HTTP, HTTPS, SSH",
            commands: [
              "# Create key pair",
              "aws ec2 create-key-pair --key-name my-key --query 'KeyMaterial' --output text > my-key.pem",
              "chmod 400 my-key.pem"
            ]
          },
          {
            title: "Set Up RDS Database",
            description: "Configure managed MySQL database for your application",
            details: "Use db.t3.micro for development, enable automated backups",
            commands: [
              "# Create RDS instance",
              "aws rds create-db-instance --db-instance-identifier mydb --db-instance-class db.t3.micro --engine mysql"
            ]
          },
          {
            title: "Configure S3 & Deploy Application",
            description: "Set up file storage and deploy your code",
            details: "Create S3 bucket for static assets and file uploads",
            commands: [
              "# Create S3 bucket",
              "aws s3 mb s3://my-app-bucket-$(date +%s)",
              "# Upload files",
              "aws s3 sync ./dist s3://my-app-bucket/static/"
            ]
          },
          {
            title: "Configure Load Balancer & Auto Scaling",
            description: "Ensure high availability and scalability",
            details: "Set up Application Load Balancer and Auto Scaling Group",
            commands: [
              "# Create load balancer",
              "aws elbv2 create-load-balancer --name my-load-balancer --subnets subnet-12345678 subnet-87654321"
            ]
          }
        ];
      
      case "gcp":
        return [
          {
            title: "Set Up Google Cloud Project",
            description: "Create a new project and enable billing",
            details: "Enable necessary APIs: Compute Engine, Cloud SQL, Cloud Storage",
            commands: [
              "# Install gcloud CLI",
              "curl https://sdk.cloud.google.com | bash",
              "exec -l $SHELL",
              "gcloud init"
            ]
          },
          {
            title: "Create Compute Engine Instance",
            description: "Launch your virtual machine",
            details: "Recommended: e2-medium, Ubuntu 20.04 LTS, 20GB standard disk",
            commands: [
              "# Create VM instance",
              "gcloud compute instances create my-instance --machine-type=e2-medium --image-family=ubuntu-2004-lts --image-project=ubuntu-os-cloud"
            ]
          },
          {
            title: "Set Up Cloud SQL",
            description: "Configure managed MySQL database",
            details: "Use db-f1-micro for development, enable automatic backups",
            commands: [
              "# Create Cloud SQL instance",
              "gcloud sql instances create my-database --database-version=MYSQL_8_0 --tier=db-f1-micro --region=us-central1"
            ]
          },
          {
            title: "Configure Cloud Storage",
            description: "Set up object storage for files",
            details: "Create bucket with appropriate access controls",
            commands: [
              "# Create storage bucket",
              "gsutil mb gs://my-app-bucket-$(date +%s)",
              "# Upload files",
              "gsutil -m cp -r ./dist gs://my-app-bucket/static/"
            ]
          }
        ];

      case "hetzner":
        return [
          {
            title: "Create Hetzner Cloud Account",
            description: "Sign up for Hetzner Cloud with excellent pricing",
            details: "Choose from Nuremberg, Falkenstein, or Helsinki data centers",
            commands: [
              "# Install hcloud CLI",
              "wget -O - https://github.com/hetznercloud/cli/releases/latest/download/hcloud-linux-amd64.tar.gz | tar -xzO hcloud > /usr/local/bin/hcloud",
              "chmod +x /usr/local/bin/hcloud"
            ]
          },
          {
            title: "Create Server Instance",
            description: "Launch your virtual server with SSD storage",
            details: "Recommended: CX21 (2 vCPU, 4GB RAM), Ubuntu 20.04, 40GB SSD",
            commands: [
              "# Create server",
              "hcloud server create --type cx21 --name my-server --image ubuntu-20.04"
            ]
          },
          {
            title: "Configure Networking & Security",
            description: "Set up firewall and network configuration",
            details: "Configure firewall rules for HTTP, HTTPS, and SSH access",
            commands: [
              "# Create firewall",
              "hcloud firewall create --name web-firewall",
              "hcloud firewall add-rule web-firewall --direction in --port 22 --protocol tcp --source-ips 0.0.0.0/0",
              "hcloud firewall add-rule web-firewall --direction in --port 80 --protocol tcp --source-ips 0.0.0.0/0"
            ]
          },
          {
            title: "Deploy Your Application",
            description: "Upload and configure your web application",
            details: "Use volumes for persistent data storage",
            commands: [
              "# Create volume",
              "hcloud volume create --name app-data --size 10 --location nbg1"
            ]
          }
        ];

      case "digitalocean":
        return [
          {
            title: "Set Up DigitalOcean Account",
            description: "Create account and add payment method",
            details: "Get $100 credit for new accounts, simple pricing structure",
            commands: [
              "# Install doctl CLI",
              "snap install doctl",
              "doctl auth init"
            ]
          },
          {
            title: "Create Droplet",
            description: "Launch your virtual server (Droplet)",
            details: "Recommended: Basic Plan, 2GB RAM, 50GB SSD, Ubuntu 20.04",
            commands: [
              "# Create droplet",
              "doctl compute droplet create my-app --size s-1vcpu-2gb --image ubuntu-20-04-x64 --region nyc1"
            ]
          },
          {
            title: "Configure Managed Database",
            description: "Set up managed MySQL or PostgreSQL database",
            details: "Use managed database for automatic backups and updates",
            commands: [
              "# Create database cluster",
              "doctl databases create my-db --engine mysql --size db-s-1vcpu-1gb --region nyc1"
            ]
          },
          {
            title: "Set Up Spaces & CDN",
            description: "Configure object storage and content delivery",
            details: "Spaces provides S3-compatible object storage with CDN",
            commands: [
              "# Create Spaces bucket via web interface",
              "# Configure CDN endpoint for static assets"
            ]
          }
        ];

      case "vultr":
        return [
          {
            title: "Create Vultr Account",
            description: "Sign up with high-performance cloud provider",
            details: "Choose from 25+ global locations with NVMe SSD storage",
            commands: [
              "# Install Vultr CLI",
              "curl -L https://github.com/vultr/vultr-cli/releases/latest/download/vultr-cli_$(uname -s)_$(uname -m).tar.gz | tar -xz",
              "sudo mv vultr-cli /usr/local/bin/"
            ]
          },
          {
            title: "Deploy High-Performance Instance",
            description: "Launch server with NVMe SSD storage",
            details: "Recommended: Regular Performance, 2GB RAM, 55GB NVMe SSD",
            commands: [
              "# Create instance",
              "vultr-cli instance create --region ewr --plan vc2-1c-2gb --os 387"
            ]
          },
          {
            title: "Configure Block Storage",
            description: "Add additional NVMe block storage",
            details: "Attach high-performance block storage for databases",
            commands: [
              "# Create block storage",
              "vultr-cli block-storage create --region ewr --size 40"
            ]
          },
          {
            title: "Set Up Application",
            description: "Deploy your application with load balancer",
            details: "Use Vultr's load balancer for high availability",
            commands: [
              "# Configure load balancer via dashboard",
              "# Deploy application code"
            ]
          }
        ];

      default:
        return [
          {
            title: "Set Up Account",
            description: "Create your cloud provider account",
            details: "Sign up and verify your account with payment method",
            commands: []
          },
          {
            title: "Create Server Instance",
            description: "Launch your virtual server",
            details: "Choose appropriate size based on your requirements",
            commands: []
          },
          {
            title: "Configure Database",
            description: "Set up managed database service",
            details: "Enable backups and configure security settings",
            commands: []
          },
          {
            title: "Deploy Application",
            description: "Upload and configure your application",
            details: "Set up SSL certificates and domain configuration",
            commands: []
          }
        ];
    }
  };

  const steps = getSetupSteps();
  const estimatedTime = provider.setupComplexity === "easy" ? "20-30" : provider.setupComplexity === "medium" ? "30-45" : "45-60";

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Step-by-Step Setup Guide</h2>
            <p className="text-xl text-slate-600">Complete guide for {provider.displayName}</p>
          </div>

          {/* Featured Setup Guide */}
          <Card className="overflow-hidden mb-12">
            <div className="gradient-primary p-8 text-white">
              <div className="flex items-center mb-4">
                <i className={`${provider.logo} text-4xl mr-4`}></i>
                <div>
                  <h3 className="text-2xl font-bold">{provider.displayName} Setup</h3>
                  <p className="text-blue-100">Complete guide for your recommended configuration</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <i className="fas fa-clock mr-2"></i>
                  <span>{estimatedTime} minutes</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-layer-group mr-2"></i>
                  <span>{steps.length} Steps</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-cog mr-2"></i>
                  <span className="capitalize">{provider.setupComplexity} Setup</span>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              {/* Architecture Overview */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4">What You'll Build</h4>
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-primary text-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-server"></i>
                      </div>
                      <h5 className="font-semibold">Compute Instance</h5>
                      <p className="text-sm text-slate-600">Virtual server for your app</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-secondary text-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-database"></i>
                      </div>
                      <h5 className="font-semibold">Managed Database</h5>
                      <p className="text-sm text-slate-600">MySQL/PostgreSQL database</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-accent text-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <i className="fas fa-cloud"></i>
                      </div>
                      <h5 className="font-semibold">Object Storage</h5>
                      <p className="text-sm text-slate-600">File and asset storage</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                      <p className="text-slate-600 mb-3">{step.description}</p>
                      {step.details && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start">
                            <i className="fas fa-lightbulb text-blue-600 mt-1 mr-3"></i>
                            <div>
                              <h5 className="font-medium text-blue-800">Configuration Details</h5>
                              <p className="text-blue-700 text-sm">{step.details}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {step.commands && step.commands.length > 0 && (
                        <div className="bg-slate-900 text-white p-4 rounded-lg">
                          <h5 className="font-medium mb-2 text-slate-300">Commands:</h5>
                          {step.commands.map((command, cmdIndex) => (
                            <div key={cmdIndex} className="font-mono text-sm mb-1">
                              {command}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center space-x-4">
                  <Button variant="outline">
                    <i className="fas fa-download mr-2"></i>Download PDF Guide
                  </Button>
                  <Button variant="ghost">
                    <i className="fas fa-bookmark mr-2"></i>Save for Later
                  </Button>
                </div>
                <Button>
                  Start Setup <i className="fas fa-external-link-alt ml-2"></i>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-book"></i>
                </div>
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-slate-600 text-sm mb-4">Official {provider.displayName} documentation and tutorials</p>
                <Button variant="outline" size="sm">View Docs</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-users"></i>
                </div>
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-slate-600 text-sm mb-4">Join the {provider.displayName} community for help and tips</p>
                <Button variant="outline" size="sm">Join Community</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-headset"></i>
                </div>
                <h3 className="font-semibold mb-2">Support</h3>
                <p className="text-slate-600 text-sm mb-4">Get help from {provider.displayName} support team</p>
                <Button variant="outline" size="sm">Get Support</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
