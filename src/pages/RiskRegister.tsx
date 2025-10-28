import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { generateRiskRegisterExcel } from "@/utils/reportGenerator"; // Note: This function will need updates too

// ⭐ UPDATED: Risk interface with new fields
interface Risk {
  id: string;
  description: string;
  asset: string;
  threat: string;
  vulnerability: string;
  existingControl: string;
  // Pre-Treatment
  likelihood: string;
  impact: string;
  riskLevel: number; // Pre-treatment score
  // Treatment & Post-Treatment
  treatmentPlan: string;
  riskOwner: string;
  annexAControl: string; // New
  cost: string;           // New
  timeline: string;       // New
  postLikelihood: string; // New
  postImpact: string;     // New
  postRiskLevel: number;  // New (Post-treatment score)
  finalRemarks: string;   // New
}

// Helper function to get risk level text (Low, Medium, High)
const getRiskLevelText = (level: number): string => {
  if (level >= 15) return "High";
  if (level >= 9) return "Medium";
  if (level > 0) return "Low";
  return "-";
};

// Helper function to get risk level color class
const getRiskLevelColor = (level: number): string => {
  if (level >= 15) return "text-destructive";
  if (level >= 9) return "text-yellow-500";
  if (level > 0) return "text-green-500";
  return "text-muted-foreground"; // Default color for 0 or '-'
};

const RiskRegister = () => {
  const navigate = useNavigate();
  const [organizationName, setOrganizationName] = useState("");
  const [organizationLogo, setOrganizationLogo] = useState<File | null>(null);
  const [author, setAuthor] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [approver, setApprover] = useState("");

  // ⭐ UPDATED: Initial state includes new fields
  const initialRiskState: Risk = {
    id: "RISK-001",
    description: "",
    asset: "",
    threat: "",
    vulnerability: "",
    existingControl: "",
    likelihood: "",
    impact: "",
    riskLevel: 0,
    treatmentPlan: "",
    riskOwner: "",
    annexAControl: "",
    cost: "",
    timeline: "",
    postLikelihood: "",
    postImpact: "",
    postRiskLevel: 0,
    finalRemarks: "",
  };

  const [risks, setRisks] = useState<Risk[]>([initialRiskState]);

  // Combined function for calculating both pre and post risk levels
  const calculateRiskLevel = (likelihood: string, impact: string): number => {
    const l = parseInt(likelihood) || 0;
    const i = parseInt(impact) || 0;
    return l * i;
  };

  // ⭐ UPDATED: handleAddRisk includes new fields
  const handleAddRisk = () => {
    const newId = `RISK-${String(risks.length + 1).padStart(3, '0')}`;
    setRisks([...risks, { ...initialRiskState, id: newId }]);
    toast.success("New risk added");
  };

  const handleRemoveRisk = (id: string) => {
    setRisks(risks.filter(r => r.id !== id));
    toast.success("Risk removed");
  };

  // ⭐ UPDATED: handleRiskChange includes logic for post-treatment scores
  const handleRiskChange = (id: string, field: keyof Risk, value: string) => {
    setRisks(risks.map(risk => {
      if (risk.id === id) {
        const updated = { ...risk, [field]: value };

        // Calculate Pre-treatment score
        if (field === 'likelihood' || field === 'impact') {
          updated.riskLevel = calculateRiskLevel(
            field === 'likelihood' ? value : risk.likelihood,
            field === 'impact' ? value : risk.impact
          );
        }
        // Calculate Post-treatment score
        if (field === 'postLikelihood' || field === 'postImpact') {
          updated.postRiskLevel = calculateRiskLevel(
            field === 'postLikelihood' ? value : risk.postLikelihood,
            field === 'postImpact' ? value : risk.postImpact
          );
        }
        return updated;
      }
      return risk;
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOrganizationLogo(e.target.files[0]);
      toast.success("Logo uploaded successfully");
    }
  };

  const handleExportExcel = async () => {
    if (!organizationName) {
      toast.error("Please enter organization name");
      return;
    }
    
    // Basic validation, can be expanded
    const incompleteRisks = risks.filter(r => 
        !r.description || 
        !r.likelihood || !r.impact || // Pre-treatment required
        !r.treatmentPlan // Treatment plan is usually essential
    );
    if (incompleteRisks.length > 0) {
      toast.error(`Please complete required fields for all risks (Description, Likelihood, Impact, Treatment Plan). ${incompleteRisks.length} incomplete.`);
      return;
    }
    
    if (!author || !reviewer || !approver) {
      toast.error("Please fill in author, reviewer, and approver details");
      return;
    }
    
    // ❗ IMPORTANT: You MUST update generateRiskRegisterExcel in reportGenerator.ts 
    // to accept and correctly process the new fields in the `risks` array.
    await generateRiskRegisterExcel(risks, organizationName, author, reviewer, approver, organizationLogo);
    toast.success("Risk Register exported successfully!");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* --- Navigation and Header --- */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-secondary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Risk Register Pro</h1>
          <p className="text-muted-foreground">Information Security Risk Management</p>
        </div>

        {/* --- Organization & Approval Card --- */}
        <Card className="mb-6 border-border bg-card shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Organization & Approval Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ... Organization Name, Logo ... */}
             <div className="grid md:grid-cols-2 gap-4">
               <div>
                 <Label htmlFor="organizationName">Organization Name</Label>
                 <Input
                   id="organizationName"
                   value={organizationName}
                   onChange={(e) => setOrganizationName(e.target.value)}
                   placeholder="Enter organization name"
                   className="mt-1"
                 />
               </div>
               <div>
                 <Label htmlFor="organizationLogo">Organization Logo (Optional)</Label>
                 <Input
                   id="organizationLogo"
                   type="file"
                   accept="image/*"
                   onChange={handleLogoUpload}
                   className="mt-1"
                 />
                 {organizationLogo && (
                   <p className="text-sm text-muted-foreground mt-1">
                     {organizationLogo.name}
                   </p>
                 )}
               </div>
             </div>
            {/* ... Author, Reviewer, Approver ... */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reviewer">Reviewer</Label>
                <Input
                  id="reviewer"
                  value={reviewer}
                  onChange={(e) => setReviewer(e.target.value)}
                  placeholder="Reviewer name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="approver">Approver</Label>
                <Input
                  id="approver"
                  value={approver}
                  onChange={(e) => setApprover(e.target.value)}
                  placeholder="Approver name"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- Risk Entries Card --- */}
        <Card className="mb-6 border-border bg-card shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Risk Entries ({risks.length})</CardTitle>
            <Button
              onClick={handleAddRisk}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Risk
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {risks.map((risk) => (
              <div
                key={risk.id}
                className="p-6 border border-border rounded-lg bg-secondary/30 relative space-y-6" // Added space-y-6
              >
                {/* --- Risk Header & Remove Button --- */}
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-xl mb-4 text-primary">{risk.id}</h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRisk(risk.id)}
                        className="text-destructive hover:text-destructive/80 -mt-2 -mr-2" // Adjust position
                        disabled={risks.length === 1}
                        title="Remove Risk"
                    >
                        <Trash2 className="h-5 w-5" />
                    </Button>
                </div>
                
                {/* --- Risk Identification --- */}
                <div className="space-y-4">
                  <h4 className="font-medium text-lg text-foreground mb-2 border-b pb-1">Identification</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Risk Description</Label>
                      <Textarea value={risk.description} onChange={(e) => handleRiskChange(risk.id, "description", e.target.value)} placeholder="Describe the risk" className="mt-1"/>
                    </div>
                    <div>
                      <Label>Asset</Label>
                      <Input value={risk.asset} onChange={(e) => handleRiskChange(risk.id, "asset", e.target.value)} placeholder="Asset at risk" className="mt-1"/>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Threat</Label>
                      <Input value={risk.threat} onChange={(e) => handleRiskChange(risk.id, "threat", e.target.value)} placeholder="Threat source" className="mt-1"/>
                    </div>
                    <div>
                      <Label>Vulnerability</Label>
                      <Input value={risk.vulnerability} onChange={(e) => handleRiskChange(risk.id, "vulnerability", e.target.value)} placeholder="Vulnerability" className="mt-1"/>
                    </div>
                     <div>
                      <Label>Existing Control</Label>
                      <Input value={risk.existingControl} onChange={(e) => handleRiskChange(risk.id, "existingControl", e.target.value)} placeholder="Current controls" className="mt-1"/>
                    </div>
                  </div>
                </div>

                {/* --- Pre-Treatment Assessment --- */}
                <div className="space-y-4">
                  <h4 className="font-medium text-lg text-foreground mb-2 border-b pb-1">Pre-Treatment Assessment</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end"> 
                    <div>
                      <Label>Likelihood (1-5)</Label>
                      <Select value={risk.likelihood} onValueChange={(value) => handleRiskChange(risk.id, "likelihood", value)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{[1, 2, 3, 4, 5].map(n => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Impact (1-5)</Label>
                      <Select value={risk.impact} onValueChange={(value) => handleRiskChange(risk.id, "impact", value)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{[1, 2, 3, 4, 5].map(n => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Risk Score</Label>
                      <div className={`mt-1 h-10 px-3 rounded-md border border-input bg-background flex items-center justify-center font-bold text-lg ${getRiskLevelColor(risk.riskLevel)}`}>
                        {risk.riskLevel || "-"}
                      </div>
                    </div>
                     <div>
                      <Label>Risk Level</Label>
                      <div className={`mt-1 h-10 px-3 rounded-md border border-input bg-background flex items-center justify-center font-semibold ${getRiskLevelColor(risk.riskLevel)}`}>
                        {getRiskLevelText(risk.riskLevel)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- Treatment Plan --- */}
                 <div className="space-y-4">
                  <h4 className="font-medium text-lg text-foreground mb-2 border-b pb-1">Treatment</h4>
                   <div>
                     <Label>Treatment Plan</Label>
                     <Textarea value={risk.treatmentPlan} onChange={(e) => handleRiskChange(risk.id, "treatmentPlan", e.target.value)} placeholder="Risk treatment strategy" className="mt-1"/>
                   </div>
                   <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <Label>Risk Owner</Label>
                        <Input value={risk.riskOwner} onChange={(e) => handleRiskChange(risk.id, "riskOwner", e.target.value)} placeholder="Owner name" className="mt-1"/>
                      </div>
                      {/* ⭐ NEW FIELDS ADDED HERE */}
                      <div>
                        <Label>Annex A Control</Label>
                        <Input value={risk.annexAControl} onChange={(e) => handleRiskChange(risk.id, "annexAControl", e.target.value)} placeholder="e.g., A.5.1" className="mt-1"/>
                      </div>
                      <div>
                        <Label>Cost</Label>
                        <Input value={risk.cost} onChange={(e) => handleRiskChange(risk.id, "cost", e.target.value)} placeholder="e.g., $500, 2 days" className="mt-1"/>
                      </div>
                      <div>
                        <Label>Timeline</Label>
                        <Input value={risk.timeline} type="date" onChange={(e) => handleRiskChange(risk.id, "timeline", e.target.value)} className="mt-1"/>
                      </div>
                   </div>
                 </div>

                {/* --- ⭐ NEW: Post-Treatment Assessment --- */}
                <div className="space-y-4">
                  <h4 className="font-medium text-lg text-foreground mb-2 border-b pb-1">Post-Treatment Assessment</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <Label>Likelihood (1-5)</Label>
                      <Select value={risk.postLikelihood} onValueChange={(value) => handleRiskChange(risk.id, "postLikelihood", value)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{[1, 2, 3, 4, 5].map(n => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Impact (1-5)</Label>
                      <Select value={risk.postImpact} onValueChange={(value) => handleRiskChange(risk.id, "postImpact", value)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{[1, 2, 3, 4, 5].map(n => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Residual Risk Score</Label>
                      <div className={`mt-1 h-10 px-3 rounded-md border border-input bg-background flex items-center justify-center font-bold text-lg ${getRiskLevelColor(risk.postRiskLevel)}`}>
                        {risk.postRiskLevel || "-"}
                      </div>
                    </div>
                    <div>
                      <Label>Residual Risk Level</Label>
                       <div className={`mt-1 h-10 px-3 rounded-md border border-input bg-background flex items-center justify-center font-semibold ${getRiskLevelColor(risk.postRiskLevel)}`}>
                        {getRiskLevelText(risk.postRiskLevel)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- ⭐ NEW: Final Remarks --- */}
                <div className="space-y-2">
                    <Label>Final Remarks</Label>
                    <Textarea
                        value={risk.finalRemarks}
                        onChange={(e) => handleRiskChange(risk.id, "finalRemarks", e.target.value)}
                        placeholder="Add any final comments or observations..."
                        className="mt-1"
                    />
                </div>

              </div>
            ))}

            {/* --- Export Button --- */}
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleExportExcel}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
              >
                <Download className="mr-2 h-5 w-5" />
                Export Risk Register
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskRegister;