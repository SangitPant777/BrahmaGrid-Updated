import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

const ModuleCard = ({ title, description, icon: Icon, onClick }: ModuleCardProps) => {
  return (
    <Card 
      onClick={onClick}
      className="group cursor-pointer border-2 border-border bg-card hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-gold)] hover:scale-105 animate-fade-in"
    >
      <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
        <div className="p-4 rounded-full bg-secondary group-hover:bg-primary/20 transition-colors">
          <Icon className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
