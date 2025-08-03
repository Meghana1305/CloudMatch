import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type EmailRequest } from "@shared/schema";

interface EmailResultsProps {
  assessmentId: string;
}

export default function EmailResults({ assessmentId }: EmailResultsProps) {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const emailMutation = useMutation({
    mutationFn: (emailData: EmailRequest) => 
      apiRequest("POST", `/api/email-results`, emailData),
    onSuccess: () => {
      toast({
        title: "Email Sent Successfully!",
        description: "Your cloud provider recommendations have been sent to your email.",
      });
      setEmail("");
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    emailMutation.mutate({
      email,
      assessmentId,
      subject: "Your CloudMatch Recommendations",
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <i className="fas fa-envelope"></i>
        Email Results
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="fas fa-envelope text-blue-500"></i>
          Email Your Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={emailMutation.isPending || !email}
              className="flex-1"
            >
              {emailMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Send Results
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            We'll send you a detailed comparison of your recommended cloud providers with setup guides.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}