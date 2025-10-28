import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { annexAControls } from "@/data/iso27001Controls";
import { generateSoAPDF } from "@/utils/reportGenerator";

interface Control {
  id: string;
  title: string;
  applicable: string;
  justification: string;
}

const CraftYourSoA = () => {
  const navigate = useNavigate();
  const [organizationName, setOrganizationName] = useState("");
  const [organizationLogo, setOrganizationLogo] = useState<string | null>(null);
  const [assessmentDate, setAssessmentDate] = useState("");
  // ⭐ ADDED: New state for approval fields
  const [preparedBy, setPreparedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  
  const [controls, setControls] = useState<Control[]>(
    annexAControls.map(c => ({
      ...c,
      applicable: "",
      justification: ""
    }))
  );

  const handleApplicabilityChange = (id: string, value: string) => {
    setControls(controls.map(c => 
      c.id === id ? { ...c, applicable: value } : c
    ));
  };

  const handleJustificationChange = (id: string, value: string) => {
    setControls(controls.map(c => 
      c.id === id ? { ...c, justification: value } : c
    ));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setOrganizationLogo(reader.result as string);
        toast.success("Logo uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateReport = async () => {
    // ⭐ UPDATED: Validation to include new fields
    if (!organizationName || !assessmentDate || !preparedBy || !approvedBy) {
      toast.error("Please fill in all Document Information fields (Org Name, Date, Prepared By, Approved By)");
      return;
    }

    const incompleteControls = controls.filter(c => !c.applicable);
    if (incompleteControls.length > 0) {
      toast.error(`Please mark all controls as Applicable or Not Applicable (${incompleteControls.length} remaining)`);
      return;
    }

    // ⭐ UPDATED: Pass new fields to the PDF generator
    await generateSoAPDF(
      organizationName,
      controls,
      assessmentDate,
      preparedBy,
      approvedBy,
      organizationLogo || undefined
    );
    
    toast.success("Statement of Applicability generated successfully!");
  };

  const renderControlsForDomain = (domainName: string) => {
    const domainControls = annexAControls.filter(c => c.domain === domainName);
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">{domainName}</h3>
          <p className="text-sm text-muted-foreground">
            {domainControls.length} controls
          </p>
        </div>
        {domainControls.map((control) => {
          const controlData = controls.find(c => c.id === control.id);
          return (
            <div
              key={control.id}
              className="p-4 border border-border rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <h4 className="font-semibold text-foreground mb-2">
                {control.id}: {control.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">{control.description}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Applicability</Label>
                  <Select
                    value={controlData?.applicable || ""}
                    onValueChange={(value) => handleApplicabilityChange(control.id, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Applicable">Applicable</SelectItem>
                      <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Justification</Label>
                  <Textarea
                    value={controlData?.justification || ""}
                    onChange={(e) => handleJustificationChange(control.id, e.target.value)}
                    placeholder="Provide justification"
                    className="mt-1 min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const completionStats = {
    total: controls.length,
    completed: controls.filter(c => c.applicable).length
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-secondary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Craft Your SoA</h1>
          <p className="text-muted-foreground">Statement of Applicability Builder</p>
          <div className="mt-4 inline-block px-4 py-2 bg-secondary rounded-lg">
            <p className="text-sm font-medium text-foreground">
              Progress: {completionStats.completed} / {completionStats.total} controls
            </p>
          </div>
        </div>

        <Card className="mb-6 border-border bg-card shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Document Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
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
                <Label htmlFor="assessmentDate">Assessment Date</Label>
                <Input
                  id="assessmentDate"
                  type="date"
                  value={assessmentDate}
                  onChange={(e) => setAssessmentDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            {/* ⭐ ADDED: New input fields for approval */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preparedBy">Prepared By</Label>
                <Input
                  id="preparedBy"
                  value={preparedBy}
                  onChange={(e) => setPreparedBy(e.target.value)}
                  placeholder="Enter preparer's name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="approvedBy">Approved By</Label>
                <Input
                  id="approvedBy"
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                  placeholder="Enter approver's name"
                  className="mt-1"
                />
              </div>
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
                  Logo uploaded successfully
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Annex A Controls Assessment (93 Controls)</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="Organizational Controls" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="Organizational Controls">Organizational</TabsTrigger>
                <TabsTrigger value="People Controls">People</TabsTrigger>
                <TabsTrigger value="Physical Controls">Physical</TabsTrigger>
                <TabsTrigger value="Technological Controls">Technological</TabsTrigger>
              </TabsList>

              <TabsContent value="Organizational Controls">
                {renderControlsForDomain("Organizational Controls")}
              </TabsContent>

              <TabsContent value="People Controls">
                {renderControlsForDomain("People Controls")}
              </TabsContent>

              <TabsContent value="Physical Controls">
                {renderControlsForDomain("Physical Controls")}
              </TabsContent>

        <TabsContent value="Technological Controls">
                {renderControlsForDomain("Technological Controls")}
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleGenerateReport}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
              >
                <Download className="mr-2 h-5 w-5" />
                Generate SoA Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CraftYourSoA;