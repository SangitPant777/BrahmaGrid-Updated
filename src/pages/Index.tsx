import { useNavigate } from "react-router-dom";
import { FileCheck2, Shield, ClipboardList, FileText } from "lucide-react";
import ModuleCard from "@/components/ModuleCard";
import brahmaGridLogo from "@/assets/brahmgrid-logo.png";

const Index = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Brahma Gap",
      description: "ISO 27001:2022 Clause-wise Gap Assessment",
      icon: FileCheck2,
      path: "/brahma-gap",
    },
    {
      title: "Craft Your SoA",
      description: "Statement of Applicability Builder",
      icon: Shield,
      path: "/craft-soa",
    },
    {
      title: "Risk Register Pro",
      description: "Information Security Risk Management",
      icon: ClipboardList,
      path: "/risk-register",
    },
    {
      title: "Minutes by Brahma",
      description: "Professional Meeting Minutes Generator",
      icon: FileText,
      path: "/minutes",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <header className="text-center mb-16 animate-fade-in">
          <div className="mb-8 flex justify-center">
            <img 
              src={brahmaGridLogo} 
              alt="BrahmaGrid Logo - Precision. Power. Protection." 
              className="h-40 w-auto animate-scale-in"
            />
          </div>
          <p className="text-2xl text-muted-foreground font-light tracking-wide">
            Precision. Power. Protection.
          </p>
        </header>

        <main>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {modules.map((module, index) => (
              <div
                key={module.title}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ModuleCard
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  onClick={() => navigate(module.path)}
                />
              </div>
            ))}
          </div>
        </main>

        <footer className="text-center pt-12 border-t border-border space-y-4">
          <p className="text-lg text-muted-foreground italic">
            "One Step Closer to ISO 27001:2022"
          </p>
          <p className="text-muted-foreground">
            Powered by <span className="text-primary font-semibold">BrahmaGrid</span> © 2025
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
