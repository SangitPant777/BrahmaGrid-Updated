import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { iso27001Clauses, annexAControls } from "@/data/iso27001Controls";
import { generateGapAssessmentExcel } from "@/utils/gapAssessmentReport";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SubClauseData {
  id: string;
  title: string;
  description: string;
  expectedEvidence?: string;
  status: string;
  evidence: string;
}

interface AnnexControlData {
  id: string;
  title: string;
  description: string;
  domain: string;
  expectedEvidence?: string;
  status: string;
  evidence: string;
}

const BrahmaGap = () => {
  const navigate = useNavigate();
  const [organizationName, setOrganizationName] = useState("");
  const [organizationLogo, setOrganizationLogo] = useState<File | null>(null);
  const [subClauseData, setSubClauseData] = useState<SubClauseData[]>(
    iso27001Clauses.flatMap(clause => 
      clause.subClauses.map(sub => ({
        ...sub,
        status: "",
        evidence: ""
      }))
    )
  );

  const [annexControlData, setAnnexControlData] = useState<AnnexControlData[]>(
    annexAControls.map(control => ({
      ...control,
      status: "",
      evidence: ""
    }))
  );

  const handleStatusChange = (id: string, status: string) => {
    setSubClauseData(prev => prev.map(sc => 
      sc.id === id ? { ...sc, status } : sc
    ));
  };

  const handleEvidenceChange = (id: string, evidence: string) => {
    setSubClauseData(prev => prev.map(sc => 
      sc.id === id ? { ...sc, evidence } : sc
    ));
  };

  const handleAnnexStatusChange = (id: string, status: string) => {
    setAnnexControlData(prev => prev.map(ac => 
      ac.id === id ? { ...ac, status } : ac
    ));
  };

  const handleAnnexEvidenceChange = (id: string, evidence: string) => {
    setAnnexControlData(prev => prev.map(ac => 
      ac.id === id ? { ...ac, evidence } : ac
    ));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOrganizationLogo(e.target.files[0]);
      toast.success("Logo uploaded successfully");
    }
  };

  const handleGenerateReport = async () => {
    if (!organizationName) {
      toast.error("Please enter organization name");
      return;
    }

    const incompleteClauseItems = subClauseData.filter(c => !c.status);
    const incompleteAnnexItems = annexControlData.filter(c => !c.status);
    
    if (incompleteClauseItems.length > 0 || incompleteAnnexItems.length > 0) {
      toast.error("Please complete all clause and annex control assessments");
      return;
    }

    let logoBase64: string | undefined = undefined;
    if (organizationLogo) {
      const reader = new FileReader();
      logoBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(organizationLogo);
      });
    }

    await generateGapAssessmentExcel(organizationName, subClauseData, annexControlData, logoBase64);
    toast.success("Gap Assessment Report generated successfully!");
  };

  const getClauseProgress = (clauseNumber: string) => {
    const clause = iso27001Clauses.find(c => c.clause === clauseNumber);
    if (!clause) return { completed: 0, total: 0 };
    
    const subClauseIds = clause.subClauses.map(sc => sc.id);
    const total = subClauseIds.length;
    const completed = subClauseData.filter(sc => 
      subClauseIds.includes(sc.id) && sc.status
    ).length;
    
    return { completed, total };
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
          <h1 className="text-4xl font-bold text-primary mb-2">Brahma Gap</h1>
          <p className="text-muted-foreground">ISO 27001:2022 Clause-wise Gap Assessment</p>
        </div>

        <Card className="mb-6 border-border bg-card shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <div className="mt-1 flex items-center gap-2">
                <Input
                  id="organizationLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="flex-1"
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              {organizationLogo && (
                <p className="text-sm text-muted-foreground mt-1">
                  {organizationLogo.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>ISO 27001:2022 Clauses Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-4">
              {iso27001Clauses.map((clause) => {
                const progress = getClauseProgress(clause.clause);
                return (
                  <AccordionItem 
                    key={clause.clause} 
                    value={clause.clause}
                    className="border border-border rounded-lg bg-secondary/20"
                  >
                    <AccordionTrigger className="px-6 hover:no-underline hover:bg-secondary/40">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-semibold text-foreground">
                          Clause {clause.clause}: {clause.title}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {progress.completed}/{progress.total} completed
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-4 pt-4">
                        {clause.subClauses.map((subClause) => {
                          const data = subClauseData.find(sc => sc.id === subClause.id);
                          return (
                            <div
                              key={subClause.id}
                              className="p-4 border border-border rounded-lg bg-card"
                            >
                              <div className="grid gap-4">
                                <div>
                                  <h4 className="font-semibold text-foreground mb-1">
                                    {subClause.id}: {subClause.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {subClause.description}
                                  </p>
                                  {subClause.expectedEvidence && (
                                    <p className="text-xs text-primary/80 italic">
                                      Expected Evidence: {subClause.expectedEvidence}
                                    </p>
                                  )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`status-${subClause.id}`}>Implementation Status</Label>
                                    <Select
                                      value={data?.status || ""}
                                      onValueChange={(value) => handleStatusChange(subClause.id, value)}
                                    >
                                      <SelectTrigger id={`status-${subClause.id}`} className="mt-1">
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Implemented">Implemented</SelectItem>
                                        <SelectItem value="Partially Implemented">Partially Implemented</SelectItem>
                                        <SelectItem value="Not Implemented">Not Implemented</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label htmlFor={`evidence-${subClause.id}`}>Evidence / Remarks</Label>
                                    <Textarea
                                      id={`evidence-${subClause.id}`}
                                      value={data?.evidence || ""}
                                      onChange={(e) => handleEvidenceChange(subClause.id, e.target.value)}
                                      placeholder="Add evidence or remarks"
                                      className="mt-1 min-h-[80px]"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="mt-6 border-border bg-card shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>ISO 27001:2022 Annex A Controls Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {annexAControls.map((control) => {
                const data = annexControlData.find(ac => ac.id === control.id);
                return (
                  <div
                    key={control.id}
                    className="p-4 border border-border rounded-lg bg-secondary/20"
                  >
                    <div className="grid gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">
                            {control.id}: {control.title}
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {control.domain}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {control.description}
                        </p>
                        {control.expectedEvidence && (
                          <p className="text-xs text-primary/80 italic">
                            Expected Evidence: {control.expectedEvidence}
                          </p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`annex-status-${control.id}`}>Implementation Status</Label>
                          <Select
                            value={data?.status || ""}
                            onValueChange={(value) => handleAnnexStatusChange(control.id, value)}
                          >
                            <SelectTrigger id={`annex-status-${control.id}`} className="mt-1">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Implemented">Implemented</SelectItem>
                              <SelectItem value="Partially Implemented">Partially Implemented</SelectItem>
                              <SelectItem value="Not Implemented">Not Implemented</SelectItem>
                              <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`annex-evidence-${control.id}`}>Evidence / Remarks</Label>
                          <Textarea
                            id={`annex-evidence-${control.id}`}
                            value={data?.evidence || ""}
                            onChange={(e) => handleAnnexEvidenceChange(control.id, e.target.value)}
                            placeholder="Add evidence or remarks"
                            className="mt-1 min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleGenerateReport}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
              >
                <Download className="mr-2 h-5 w-5" />
                Generate Gap Assessment Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrahmaGap;
