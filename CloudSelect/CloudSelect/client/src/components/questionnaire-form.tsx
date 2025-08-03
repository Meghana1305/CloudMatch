import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { userRequirementsSchema, type UserRequirements } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface QuestionnaireFormProps {
  onComplete: (assessmentId: string) => void;
}

const totalSteps = 6;

export default function QuestionnaireForm({ onComplete }: QuestionnaireFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<UserRequirements>({
    resolver: zodResolver(userRequirementsSchema),
    defaultValues: {
      projectType: "web-app",
      budget: "50-200",
      primaryRegion: "",
      specificCountries: [],
      multiRegion: false,
      expectedTraffic: "medium",
      scalingNeeds: "moderate",
      complianceRequirements: [],
      technicalExpertise: "intermediate",
      supportImportance: "medium",
      compute: {
        vcpu: 2,
        memory: 4,
      },
      storage: {
        block: 20,
        object: 10,
      },
      database: false,
    },
  });

  const assessmentMutation = useMutation({
    mutationFn: async (data: UserRequirements) => {
      const response = await apiRequest("POST", "/api/assess", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Assessment Complete!",
        description: "Your personalized recommendations are ready.",
      });
      onComplete(data.assessmentId);
    },
    onError: (error) => {
      toast({
        title: "Assessment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: UserRequirements) => {
    assessmentMutation.mutate(data);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm font-medium text-slate-600">{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full">
            <CardContent className="pt-6">
              {/* Step 1: Project Type */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-6">What type of project are you deploying?</h3>
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <div className="relative w-full">
                                  <RadioGroupItem value="web-app" className="peer sr-only" />
                                  <div className="border-2 border-slate-200 rounded-lg p-6 cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-blue-50 transition-all">
                                    <div className="flex items-center mb-3">
                                      <i className="fas fa-globe text-2xl text-primary mr-3"></i>
                                      <h4 className="text-lg font-semibold">Web Application</h4>
                                    </div>
                                    <p className="text-slate-600">Frontend/backend apps, APIs, microservices</p>
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <div className="relative w-full">
                                  <RadioGroupItem value="data-analytics" className="peer sr-only" />
                                  <div className="border-2 border-slate-200 rounded-lg p-6 cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-blue-50 transition-all">
                                    <div className="flex items-center mb-3">
                                      <i className="fas fa-chart-line text-2xl text-primary mr-3"></i>
                                      <h4 className="text-lg font-semibold">Data & Analytics</h4>
                                    </div>
                                    <p className="text-slate-600">Data processing, ML/AI, business intelligence</p>
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <div className="relative w-full">
                                  <RadioGroupItem value="ecommerce" className="peer sr-only" />
                                  <div className="border-2 border-slate-200 rounded-lg p-6 cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-blue-50 transition-all">
                                    <div className="flex items-center mb-3">
                                      <i className="fas fa-shopping-cart text-2xl text-primary mr-3"></i>
                                      <h4 className="text-lg font-semibold">E-commerce</h4>
                                    </div>
                                    <p className="text-slate-600">Online stores, payment processing</p>
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <div className="relative w-full">
                                  <RadioGroupItem value="enterprise" className="peer sr-only" />
                                  <div className="border-2 border-slate-200 rounded-lg p-6 cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-blue-50 transition-all">
                                    <div className="flex items-center mb-3">
                                      <i className="fas fa-building text-2xl text-primary mr-3"></i>
                                      <h4 className="text-lg font-semibold">Enterprise App</h4>
                                    </div>
                                    <p className="text-slate-600">ERP, CRM, internal tools</p>
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Budget */}
              {currentStep === 2 && (
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-6">What's your monthly budget range?</h3>
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <div className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-primary w-full">
                                  <RadioGroupItem value="0-50" className="mr-4" />
                                  <div>
                                    <div className="font-semibold">$0 - $50/month</div>
                                    <div className="text-slate-600 text-sm">Perfect for small projects and learning</div>
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <div className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-primary w-full">
                                  <RadioGroupItem value="50-200" className="mr-4" />
                                  <div>
                                    <div className="font-semibold">$50 - $200/month</div>
                                    <div className="text-slate-600 text-sm">Great for small to medium businesses</div>
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <div className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-primary w-full">
                                  <RadioGroupItem value="200-1000" className="mr-4" />
                                  <div>
                                    <div className="font-semibold">$200 - $1,000/month</div>
                                    <div className="text-slate-600 text-sm">Suitable for growing applications</div>
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <div className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-primary w-full">
                                  <RadioGroupItem value="1000+" className="mr-4" />
                                  <div>
                                    <div className="font-semibold">$1,000+/month</div>
                                    <div className="text-slate-600 text-sm">Enterprise-level requirements</div>
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Geographic Requirements */}
              {currentStep === 3 && (
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-6">Where are your users located?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormField
                      control={form.control}
                      name="primaryRegion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Region</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select primary region..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="north-america">North America</SelectItem>
                              <SelectItem value="europe">Europe</SelectItem>
                              <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                              <SelectItem value="south-america">South America</SelectItem>
                              <SelectItem value="africa">Africa</SelectItem>
                              <SelectItem value="middle-east">Middle East</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specificCountries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specific Countries (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., United States, Germany, Japan" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="multiRegion"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I need multi-region deployment for high availability
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 4: Technical Requirements */}
              {currentStep === 4 && (
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-6">What are your technical requirements?</h3>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="expectedTraffic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Traffic Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select traffic level..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low (&lt; 1,000 users/month)</SelectItem>
                              <SelectItem value="medium">Medium (1,000 - 50,000 users/month)</SelectItem>
                              <SelectItem value="high">High (50,000 - 500,000 users/month)</SelectItem>
                              <SelectItem value="enterprise">Enterprise (500,000+ users/month)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scalingNeeds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scaling Requirements</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select scaling needs..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="static">Static (no scaling needed)</SelectItem>
                              <SelectItem value="moderate">Moderate (occasional traffic spikes)</SelectItem>
                              <SelectItem value="aggressive">Aggressive (frequent scaling up/down)</SelectItem>
                              <SelectItem value="enterprise">Enterprise (complex auto-scaling)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="database"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I need a managed database service
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Expertise & Support */}
              {currentStep === 5 && (
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-6">What's your technical expertise level?</h3>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="technicalExpertise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technical Expertise</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your expertise level..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner (new to cloud platforms)</SelectItem>
                              <SelectItem value="intermediate">Intermediate (some cloud experience)</SelectItem>
                              <SelectItem value="advanced">Advanced (extensive cloud experience)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="supportImportance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How important is customer support?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select support importance..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low (community support is fine)</SelectItem>
                              <SelectItem value="medium">Medium (some paid support needed)</SelectItem>
                              <SelectItem value="high">High (priority support required)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Compliance & Final Details */}
              {currentStep === 6 && (
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-6">Any compliance requirements?</h3>
                  <div className="space-y-6">
                    <div>
                      <FormLabel className="text-base font-medium">Compliance Standards (check all that apply)</FormLabel>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        {["GDPR", "HIPAA", "SOC2", "ISO27001", "PCI-DSS", "FedRAMP"].map((compliance) => (
                          <FormField
                            key={compliance}
                            control={form.control}
                            name="complianceRequirements"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={compliance}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(compliance)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, compliance])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== compliance
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {compliance}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={previousStep}
                  disabled={currentStep === 1}
                >
                  <i className="fas fa-arrow-left mr-2"></i>Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Next<i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                ) : (
                  <Button type="submit" disabled={assessmentMutation.isPending}>
                    {assessmentMutation.isPending ? "Analyzing..." : "Get Recommendations"}
                    <i className="fas fa-rocket ml-2"></i>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
