import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import QuestionnaireForm from "@/components/questionnaire-form";

export default function Questionnaire() {
  const [, setLocation] = useLocation();

  const handleComplete = (assessmentId: string) => {
    setLocation(`/results/${assessmentId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Cloud Assessment Questionnaire</h2>
            <p className="text-xl text-slate-600">Answer a few questions to get personalized cloud recommendations</p>
          </div>

          <QuestionnaireForm onComplete={handleComplete} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
