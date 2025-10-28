import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { generateMeetingMinutesPDF } from "@/utils/reportGenerator";

interface Agenda {
  id: string;
  title: string;
  discussion: string;
  actionItems: string;
  responsiblePerson: string;
}

const MinutesByBrahma = () => {
  const navigate = useNavigate();
  const [organizationName, setOrganizationName] = useState("");
  const [organizationLogo, setOrganizationLogo] = useState<File | null>(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [meetingPurpose, setMeetingPurpose] = useState("");
  const [attendees, setAttendees] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [agendas, setAgendas] = useState<Agenda[]>([
    {
      id: "1",
      title: "",
      discussion: "",
      actionItems: "",
      responsiblePerson: "",
    }
  ]);

  const handleAddAgenda = () => {
    setAgendas([...agendas, {
      id: String(agendas.length + 1),
      title: "",
      discussion: "",
      actionItems: "",
      responsiblePerson: "",
    }]);
    toast.success("New agenda added");
  };

  const handleRemoveAgenda = (id: string) => {
    setAgendas(agendas.filter(a => a.id !== id));
    toast.success("Agenda removed");
  };

  const handleAgendaChange = (id: string, field: keyof Agenda, value: string) => {
    setAgendas(agendas.map(agenda =>
      agenda.id === id ? { ...agenda, [field]: value } : agenda
    ));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setOrganizationLogo(file);
        toast.success("Logo uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateReport = async () => {
    if (!organizationName || !meetingDate || !preparedBy || !approvedBy) {
      toast.error("Please fill in all required meeting details");
      return;
    }

    const incompleteAgendas = agendas.filter(a => !a.title || !a.discussion);
    if (incompleteAgendas.length > 0) {
      toast.error("Please complete all agenda items");
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

    await generateMeetingMinutesPDF(
      organizationName, 
      meetingDate, 
      preparedBy, 
      approvedBy, 
      agendas,
      meetingLocation,
      meetingPurpose,
      attendees,
      logoBase64
    );
    toast.success("Meeting Minutes generated successfully!");
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
          <h1 className="text-4xl font-bold text-primary mb-2">Minutes by Brahma</h1>
          <p className="text-muted-foreground">Professional Meeting Minutes Generator</p>
        </div>

        <Card className="mb-6 border-border bg-card shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Meeting Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizationName">Organization Name *</Label>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meetingDate">Date of Meeting *</Label>
                <Input
                  id="meetingDate"
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="meetingLocation">Meeting Location</Label>
                <Input
                  id="meetingLocation"
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                  placeholder="e.g., Headquarters, Board Room"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="meetingPurpose">Purpose of the Meeting</Label>
              <Input
                id="meetingPurpose"
                value={meetingPurpose}
                onChange={(e) => setMeetingPurpose(e.target.value)}
                placeholder="e.g., Discuss IS Audit Report"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="attendees">Attendees</Label>
              <Textarea
                id="attendees"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="List all attendees (comma-separated)"
                className="mt-1"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preparedBy">Prepared By *</Label>
                <Input
                  id="preparedBy"
                  value={preparedBy}
                  onChange={(e) => setPreparedBy(e.target.value)}
                  placeholder="Name of preparer"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="approvedBy">Approved By *</Label>
                <Input
                  id="approvedBy"
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                  placeholder="Name of approver"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Meeting Agendas ({agendas.length})</CardTitle>
            <Button
              onClick={handleAddAgenda}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Agenda
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {agendas.map((agenda, index) => (
              <div
                key={agenda.id}
                className="p-6 border border-border rounded-lg bg-secondary/30 relative"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveAgenda(agenda.id)}
                  className="absolute top-4 right-4 text-destructive hover:text-destructive/80"
                  disabled={agendas.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <h3 className="font-semibold text-lg mb-4 text-primary">
                  Agenda {index + 1}
                </h3>

                <div className="grid gap-4">
                  <div>
                    <Label>Agenda Title</Label>
                    <Input
                      value={agenda.title}
                      onChange={(e) => handleAgendaChange(agenda.id, "title", e.target.value)}
                      placeholder="Enter agenda title"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Discussion Summary</Label>
                    <Textarea
                      value={agenda.discussion}
                      onChange={(e) => handleAgendaChange(agenda.id, "discussion", e.target.value)}
                      placeholder="Summarize the discussion points"
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Action Items</Label>
                      <Textarea
                        value={agenda.actionItems}
                        onChange={(e) => handleAgendaChange(agenda.id, "actionItems", e.target.value)}
                        placeholder="List action items (optional)"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Responsible Person</Label>
                      <Input
                        value={agenda.responsiblePerson}
                        onChange={(e) => handleAgendaChange(agenda.id, "responsiblePerson", e.target.value)}
                        placeholder="Who is responsible? (optional)"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleGenerateReport}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[var(--shadow-gold)]"
              >
                <Download className="mr-2 h-5 w-5" />
                Generate Meeting Minutes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MinutesByBrahma;
