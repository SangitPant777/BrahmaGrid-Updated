import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import brahmaGridLogo from '../assets/brahmgrid-logo.png';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const BRAHMAGRID_GOLD = '#FFD700';
const CHARCOAL = '#1E1E1E';

// Helper function to draw a pie chart
const drawPieChart = (
  doc: jsPDF,
  centerX: number,
  centerY: number,
  radius: number,
  data: Array<{ label: string; value: number; color: [number, number, number] }>
) => {
  let currentAngle = -Math.PI / 2; // Start from top
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  data.forEach(item => {
    if (item.value === 0) return;
    
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    const endAngle = currentAngle + sliceAngle;
    
    // Draw pie slice
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.circle(centerX, centerY, radius, 'F');
    
    // Create wedge using path
    const startX = centerX + radius * Math.cos(currentAngle);
    const startY = centerY + radius * Math.sin(currentAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);
    
    // Fill the wedge
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.triangle(centerX, centerY, startX, startY, endX, endY, 'F');
    
    currentAngle = endAngle;
  });
  
  // Draw outline
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.5);
  doc.circle(centerX, centerY, radius, 'S');
};

// Helper function to draw a progress bar
const drawProgressBar = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  percentage: number,
  fillColor: [number, number, number]
) => {
  // Background
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(x, y, width, height, 2, 2, 'F');
  
  // Progress fill
  if (percentage > 0) {
    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    doc.roundedRect(x, y, (width * percentage) / 100, height, 2, 2, 'F');
  }
  
  // Border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, width, height, 2, 2, 'S');
};

// Helper function to draw a bar chart
const drawBarChart = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  data: Array<{ label: string; value: number; color: [number, number, number] }>
) => {
  const barWidth = (width - (data.length - 1) * 5) / data.length;
  const maxValue = Math.max(...data.map(d => d.value));
  
  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * height;
    const barX = x + index * (barWidth + 5);
    const barY = y + height - barHeight;
    
    // Draw bar
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.roundedRect(barX, barY, barWidth, barHeight, 1, 1, 'F');
    
    // Draw value on top
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'bold');
    doc.text(String(item.value), barX + barWidth / 2, barY - 2, { align: 'center' });
    
    // Draw label below
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    const labelLines = doc.splitTextToSize(item.label, barWidth);
    doc.text(labelLines, barX + barWidth / 2, y + height + 4, { align: 'center' });
  });
};

// Convert BrahmaGrid logo to base64
const getBrahmaGridLogoBase64 = async (): Promise<string> => {
  try {
    const response = await fetch(brahmaGridLogo);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading BrahmaGrid logo:', error);
    return '';
  }
};

export const generateGapAssessmentExcel = async (
  organizationName: string,
  clauseData: any[],
  annexData: any[],
  organizationLogo?: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Get BrahmaGrid logo
  const brahmaLogo = await getBrahmaGridLogoBase64();
  
  // Title Page Header
  doc.setFillColor(30, 30, 30);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Add BrahmaGrid logo on left
  if (brahmaLogo) {
    try {
      doc.addImage(brahmaLogo, 'PNG', 15, 8, 20, 20);
    } catch (error) {
      console.error('Error adding BrahmaGrid logo:', error);
    }
  }
  
  // Add organization logo on right
  if (organizationLogo) {
    try {
      doc.addImage(organizationLogo, 'PNG', pageWidth - 35, 8, 20, 20);
    } catch (error) {
      console.error('Error adding organization logo:', error);
    }
  }
  
  doc.setTextColor(255, 215, 0);
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.text('ISO 27001 Compliance Gap Assessment', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('Powered by BrahmaGrid', pageWidth / 2, 25, { align: 'center' });
  
  // Organization Info
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Organization Name: ${organizationName}`, 15, 50);
  doc.text(`Date: ${new Date().toISOString().split('T')[0]}`, 15, 56);
  
  // Calculate compliance statistics (combined clauses and annex)
  const allControls = [...clauseData, ...annexData];
  const implemented = allControls.filter(c => c.status === 'Implemented').length;
  const partial = allControls.filter(c => c.status === 'Partially Implemented').length;
  const notImplemented = allControls.filter(c => c.status === 'Not Implemented').length;
  const notApplicable = allControls.filter(c => c.status === 'Not Applicable').length;
  const total = allControls.length;
  const compliance = ((implemented + partial * 0.5) / total * 100).toFixed(2);
  
  // Visual Dashboard Section
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, 62, pageWidth - 30, 70, 3, 3, 'F');
  
  // Compliance Score Circle
  doc.setFillColor(255, 215, 0);
  doc.circle(45, 91, 18, 'F');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${compliance}%`, 45, 91, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Compliance', 45, 98, { align: 'center' });
  doc.text('Score', 45, 103, { align: 'center' });
  
  // Status Distribution Pie Chart
  const pieData = [
    { label: 'Implemented', value: implemented, color: [34, 139, 34] as [number, number, number] },
    { label: 'Partial', value: partial, color: [255, 140, 0] as [number, number, number] },
    { label: 'Not Implemented', value: notImplemented, color: [220, 20, 60] as [number, number, number] },
    { label: 'Not Applicable', value: notApplicable, color: [150, 150, 150] as [number, number, number] }
  ];
  
  // Draw simplified status bars instead of pie chart
  let statusY = 68;
  const barStartX = 75;
  const barWidth = 100;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Status Distribution:', barStartX, statusY);
  statusY += 8;
  
  pieData.forEach(item => {
    if (statusY > 126) return;
    
    // Label and count
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`${item.label}:`, barStartX, statusY);
    doc.setFont('helvetica', 'bold');
    doc.text(String(item.value), barStartX + 45, statusY);
    
    // Progress bar
    const percentage = (item.value / total) * 100;
    drawProgressBar(doc, barStartX + 52, statusY - 3, 40, 4, percentage, item.color);
    
    // Percentage
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`${percentage.toFixed(0)}%`, barStartX + 94, statusY);
    
    statusY += 6;
  });
  
  // Executive Summary Header
  doc.setFillColor(255, 215, 0);
  doc.rect(15, 138, pageWidth - 30, 8, 'F');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', 20, 144);
  
  // Executive Summary Content
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  const summaryText = `The ISO 27001 gap assessment has uncovered a compliance score of ${compliance}%, indicating ${parseFloat(compliance) >= 70 ? 'a strong' : 'a moderate'} alignment with the standard's requirements. Out of ${total} total requirements (${clauseData.length} mandatory clauses and ${annexData.length} Annex A controls), ${implemented} have been fully implemented, demonstrating ${implemented > total/2 ? 'a strong' : 'a foundational'} commitment to information security. ${partial > 0 ? `However, there remains significant room for improvement, with ${partial} requirements identified as partially implemented` : ''} ${notImplemented > 0 ? `and ${notImplemented} requirements as not implemented, highlighting crucial areas needing attention.` : '.'} ${notApplicable > 0 ? `Additionally, ${notApplicable} requirements were deemed not applicable to the organization's context.` : ''} To enhance the organization's compliance posture, particular focus should be directed at fully implementing remaining requirements to ensure a more robust security framework vital for safeguarding information assets.`;
  
  const wrappedSummary = doc.splitTextToSize(summaryText, pageWidth - 40);
  doc.text(wrappedSummary, 20, 150);
  
  let currentY = 150 + (wrappedSummary.length * 4.5) + 6;
  
  // Recommendations Header
  if (partial > 0 || notImplemented > 0) {
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFillColor(255, 215, 0);
    doc.rect(15, currentY, pageWidth - 30, 8, 'F');
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommendations for Improvement', 20, currentY + 6);
    
    currentY += 14;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    const recommendations = [
      `Develop detailed action plans for each of the ${partial} partially implemented requirements, assigning clear responsibilities and deadlines.`,
      `Conduct a thorough risk assessment focusing on the ${notImplemented} not implemented requirements to allocate necessary resources.`,
      'Implement a continuous improvement process that includes regular reviews and updates of the partially implemented requirements.',
      'Enhance training and awareness programs tailored to the unique requirements of the not implemented and partially implemented areas.',
      'Integrate automation where feasible to streamline the implementation of controls, reducing human error and improving accuracy.',
      'Establish a monitoring and review mechanism to regularly evaluate the effectiveness of implementation strategies.'
    ];
    
    recommendations.forEach(rec => {
      if (currentY > pageHeight - 30) {
        doc.addPage();
        currentY = 20;
      }
      const wrappedRec = doc.splitTextToSize(`• ${rec}`, pageWidth - 40);
      doc.text(wrappedRec, 20, currentY);
      currentY += wrappedRec.length * 4.5 + 2;
    });
  }
  
  // Add new page for detailed assessment
  doc.addPage();
  currentY = 20;
  
  // ===== ISO 27001 MANDATORY CLAUSES SECTION =====
  doc.setFillColor(255, 215, 0);
  doc.rect(15, currentY, pageWidth - 30, 8, 'F');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ISO 27001:2022 Mandatory Clauses Assessment', 20, currentY + 6);
  
  currentY += 14;
  
  // Clause Details
  clauseData.forEach((clause) => {
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(`${clause.id} - ${clause.title}`, 20, currentY);
    currentY += 5;
    
    // Description
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const descText = doc.splitTextToSize(clause.description, pageWidth - 45);
    doc.text(descText, 20, currentY);
    currentY += descText.length * 3.5 + 1.5;
    
    // Expected Evidence
    if (clause.expectedEvidence) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const evidenceText = doc.splitTextToSize(`Expected Evidence: ${clause.expectedEvidence}`, pageWidth - 45);
      doc.text(evidenceText, 20, currentY);
      currentY += evidenceText.length * 3.5 + 1.5;
    }
    
    // Status
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('Status:', 20, currentY);
    
    const statusColors: Record<string, [number, number, number]> = {
      'Implemented': [34, 139, 34],
      'Partially Implemented': [255, 140, 0],
      'Not Implemented': [220, 20, 60]
    };
    
    const color = statusColors[clause.status] || [60, 60, 60];
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(clause.status, 40, currentY);
    currentY += 5;
    
    // Evidence/Remarks
    if (clause.evidence) {
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const remarkText = doc.splitTextToSize(`Remarks: ${clause.evidence}`, pageWidth - 45);
      doc.text(remarkText, 20, currentY);
      currentY += remarkText.length * 3.5 + 1.5;
    }
    
    currentY += 4;
  });
  
  // Add new page for Annex A
  doc.addPage();
  currentY = 20;
  
  // ===== ANNEX A CONTROLS SECTION =====
  doc.setFillColor(255, 215, 0);
  doc.rect(15, currentY, pageWidth - 30, 8, 'F');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ISO 27001:2022 Annex A Controls Assessment', 20, currentY + 6);
  
  currentY += 14;
  
  // Annex Control Details
  annexData.forEach((control) => {
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(`${control.id} - ${control.title}`, 20, currentY);
    currentY += 5;
    
    // Domain badge
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`[${control.domain}]`, 20, currentY);
    currentY += 4;
    
    // Description
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const descText = doc.splitTextToSize(control.description, pageWidth - 45);
    doc.text(descText, 20, currentY);
    currentY += descText.length * 3.5 + 1.5;
    
    // Expected Evidence
    if (control.expectedEvidence) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const evidenceText = doc.splitTextToSize(`Expected Evidence: ${control.expectedEvidence}`, pageWidth - 45);
      doc.text(evidenceText, 20, currentY);
      currentY += evidenceText.length * 3.5 + 1.5;
    }
    
    // Status
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('Status:', 20, currentY);
    
    const statusColors: Record<string, [number, number, number]> = {
      'Implemented': [34, 139, 34],
      'Partially Implemented': [255, 140, 0],
      'Not Implemented': [220, 20, 60],
      'Not Applicable': [150, 150, 150]
    };
    
    const color = statusColors[control.status] || [60, 60, 60];
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(control.status, 40, currentY);
    currentY += 5;
    
    // Evidence/Remarks
    if (control.evidence) {
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const remarkText = doc.splitTextToSize(`Remarks: ${control.evidence}`, pageWidth - 45);
      doc.text(remarkText, 20, currentY);
      currentY += remarkText.length * 3.5 + 1.5;
    }
    
    currentY += 4;
  });
  
  // Professional Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
    
    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text(
      'This document contains confidential information and is intended solely for internal use.',
      pageWidth / 2,
      pageHeight - 15,
      { align: 'center' }
    );
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${pageCount}`, 15, pageHeight - 10);
    doc.setTextColor(255, 215, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('BrahmaGrid © 2025', pageWidth - 15, pageHeight - 10, { align: 'right' });
  }
  
  doc.save(`${organizationName.replace(/[^a-z0-9]/gi, '_')}_Gap_Assessment_${new Date().toISOString().split('T')[0]}.pdf`);
};
