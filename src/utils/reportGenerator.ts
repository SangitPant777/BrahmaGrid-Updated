import jsPDF from 'jspdf';
// ⭐ FIX: Change to an explicit default import
import autoTable from 'jspdf-autotable'; 
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import brahmaGridLogo from '../assets/brahmgrid-logo.png';

// REMOVED: The JsPDFWithAutoTable interface is no longer needed with this import style.

const BRAHMAGRID_GOLD = '#FFD700';
const CHARCOAL = '#1E1E1E';

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

export const generateSoAPDF = async (
  organizationName: string,
  controls: any[],
  assessmentDate: string,
  // ⭐ ADDED: New parameters for approval
  preparedBy: string, 
  approvedBy: string, 
  organizationLogo?: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Get BrahmaGrid logo
  const brahmaLogo = await getBrahmaGridLogoBase64();

  // --- Header Section ---
  doc.setFillColor(30, 30, 30);
  doc.rect(0, 0, pageWidth, 35, 'F');
  if (brahmaLogo) {
    try {
      doc.addImage(brahmaLogo, 'PNG', 15, 6, 25, 25);
    } catch (error) { console.error('Error adding BrahmaGrid logo:', error); }
  }
  doc.setTextColor(255, 215, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Craft Your SoA', pageWidth / 2, 25, { align: 'center' });
  if (organizationLogo) {
    try {
      doc.addImage(organizationLogo, 'PNG', pageWidth - 35, 8, 20, 20);
    } catch (error) { console.error('Error adding organization logo:', error); }
  }
  doc.setDrawColor(255, 215, 0);
  doc.setLineWidth(1);
  doc.line(15, 45, pageWidth - 15, 45);
  // --- End Header ---

  // --- Title Section ---
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Statement of Applicability (SoA)', pageWidth / 2, 65, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('ISO 27001:2022 Annex A Controls', pageWidth / 2, 73, { align: 'center' });
  doc.text(
    `Assessment Date: ${new Date(assessmentDate).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    })}`,
    pageWidth / 2, 80, { align: 'center' }
  );
  // --- End Title ---

  // --- Introduction Section ---
  doc.setFillColor(250, 250, 250);
  doc.rect(15, 88, pageWidth - 30, 25, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const introText = `This Statement of Applicability documents the ISO 27001:2022 Annex A controls that ${organizationName} has determined to be applicable to its Information Security Management System (ISMS). Each control's applicability status is documented along with justification for the decision.`;
  const wrappedIntro = doc.splitTextToSize(introText, pageWidth - 40);
  doc.text(wrappedIntro, 20, 95);
  // --- End Introduction ---

  // --- Controls Table ---
  const tableData = controls.map((c) => [
    c.id,
    c.title,
    c.applicable,
    c.justification || 'N/A',
  ]);

  autoTable(doc, {
    startY: 118,
    head: [['Control ID', 'Control Title', 'Applicability', 'Justification']],
    body: tableData,
    theme: 'grid',
    margin: { bottom: 35 }, // Increased bottom margin to give space potentially for approval table
    headStyles: { /* ... your styles ... */ 
      fillColor: [30, 30, 30], textColor: [255, 215, 0], fontStyle: 'bold', fontSize: 9, halign: 'center', 
    },
    styles: { /* ... your styles ... */ 
      fontSize: 8, cellPadding: 3, lineColor: [200, 200, 200], lineWidth: 0.1, 
    },
    columnStyles: { /* ... your styles ... */ 
      0: { cellWidth: 20, halign: 'center', fontStyle: 'bold' }, 1: { cellWidth: 55 }, 2: { cellWidth: 30, halign: 'center' }, 3: { cellWidth: 80 }, 
    },
    alternateRowStyles: { /* ... your styles ... */ 
      fillColor: [248, 248, 248], 
    },
    didParseCell: function (data: any) { /* ... your cell parsing logic ... */ 
      if (data.section === 'body' && data.column.index === 2) {
        const applicable = data.cell.raw;
        if (applicable === 'Applicable') {
          data.cell.styles.textColor = [34, 139, 34]; data.cell.styles.fontStyle = 'bold';
        } else if (applicable === 'Not Applicable') {
          data.cell.styles.textColor = [150, 150, 150]; data.cell.styles.fontStyle = 'italic';
        }
      }
    },
  });
  // --- End Controls Table ---

  // ⭐ ADDED: Approval Table Section ---
  let finalY = (doc as any).lastAutoTable.finalY || 118; // Get Y pos or default if no table

  // Check if we need a new page for the approval table + footer
  if (finalY > pageHeight - 60) { // Approx height for table + footer
    doc.addPage();
    finalY = 20; // Start near top of new page
  } else {
    finalY += 10; // Add some space after the controls table
  }

  autoTable(doc, {
    startY: finalY,
    head: [['Role', 'Name', 'Signature', 'Date']],
    body: [
      [
        'Prepared By',
        preparedBy, 
        '', // Empty cell for signature space
        // Use assessmentDate for Prepared By date
        new Date(assessmentDate).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        })
      ],
      [
        'Approved By',
        approvedBy, 
        '', // Empty cell for signature space
        ''  // Empty date for Approved By
      ]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 215, 0],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center',
    },
    styles: {
      fontSize: 9,
      cellPadding: 4, // Slightly more padding
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
      minCellHeight: 18 // Ensure enough height for signature
    },
    columnStyles: {
      0: { cellWidth: 35, fontStyle: 'bold', halign: 'left' },
      1: { cellWidth: 50, halign: 'left' },
      2: { cellWidth: 55, halign: 'center' }, // Signature column
      3: { cellWidth: 'auto', halign: 'center' } // Date column
    },
    margin: { left: 15, right: 15 } // Match page margins
  });
  // --- End Approval Table ---

  // --- Footer Section ---
  // IMPORTANT: Calculate pageCount AFTER all content is added
  const pageCount = (doc as any).internal.getNumberOfPages(); 
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i); // Set current page for footer drawing
    
    // Draw line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 22, pageWidth - 15, pageHeight - 22);

    // Confidential text
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('Confidential - For Internal Use Only', pageWidth / 2, pageHeight - 15, { align: 'center' });

    // Page number
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`Page ${i} of ${pageCount}`, 15, pageHeight - 8);

    // Copyright
    doc.setTextColor(255, 215, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('BrahmaGrid © 2025', pageWidth - 15, pageHeight - 8, { align: 'right' });
  }
  // --- End Footer ---

  // --- Save Document ---
  doc.save(`${organizationName.replace(/[^a-z0-9]/gi, '_')}_SoA_${assessmentDate}.pdf`);
};
// ... generateRiskRegisterExcel remains unchanged ...

export const generateRiskRegisterExcel = async (
  // Updated type for risks array to include new fields
  risks: {
    id: string;
    description: string;
    asset: string;
    threat: string; // Keep existing fields
    vulnerability: string; // Keep existing fields
    existingControl: string;
    likelihood: string;
    impact: string;
    riskLevel: number;
    treatmentPlan: string;
    riskOwner: string;
    // New fields
    annexAControl: string; 
    cost: string;           
    timeline: string;       
    postLikelihood: string; 
    postImpact: string;     
    postRiskLevel: number;  
    finalRemarks: string;   
  }[],
  organizationName: string,
  author: string,
  reviewer: string,
  approver: string,
  organizationLogo?: File | null
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'BrahmaGrid';
  workbook.created = new Date();
  
  // --- Get Logos (No changes needed here) ---
  const brahmaLogoResponse = await fetch(brahmaGridLogo);
  const brahmaLogoBlob = await brahmaLogoResponse.blob();
  const brahmaLogoBuffer = await brahmaLogoBlob.arrayBuffer();
  const brahmaLogoId = workbook.addImage({ buffer: brahmaLogoBuffer, extension: 'png' });
  let orgLogoId: number | undefined;
  if (organizationLogo) {
    const orgLogoBuffer = await organizationLogo.arrayBuffer();
    orgLogoId = workbook.addImage({
      buffer: orgLogoBuffer,
      extension: organizationLogo.type.includes('png') ? 'png' : 'jpeg',
    });
  }
  // --- End Logos ---

  // --- Cover Page (No changes needed here) ---
  const coverSheet = workbook.addWorksheet('Cover Page', { properties: { tabColor: { argb: 'FFFFD700' } } });
  // ... (Keep all existing Cover Page columns, merges, styling, image placement, text, table) ...
    coverSheet.columns = [ { width: 5 }, { width: 20 }, { width: 25 }, { width: 20 }, { width: 20 }, { width: 15 } ];
    coverSheet.mergeCells('A1:E7');
    const logoAreaCell = coverSheet.getCell('A1');
    logoAreaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    logoAreaCell.alignment = { horizontal: 'center', vertical: 'middle' };
    for (let i = 1; i <= 7; i++) { coverSheet.getRow(i).height = 18; }
    coverSheet.addImage(brahmaLogoId, { tl: { col: 0.15, row: 0.4 }, ext: { width: 105, height: 105 } });
    if (orgLogoId) { coverSheet.addImage(orgLogoId, { tl: { col: 4.35, row: 0.4 }, ext: { width: 105, height: 105 } }); }
    coverSheet.mergeCells('B8:E8');
    const titleCell = coverSheet.getCell('B8');
    titleCell.value = '🔒 RISK REGISTER PRO';
    titleCell.font = { name: 'Arial', size: 20, bold: true, color: { argb: 'FFFFD700' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E1E1E' } };
    coverSheet.getRow(8).height = 35;
    coverSheet.mergeCells('B9:E9');
    const subtitleCell = coverSheet.getCell('B9');
    subtitleCell.value = 'Powered by BrahmaGrid';
    subtitleCell.font = { name: 'Arial', size: 12, color: { argb: 'FFC0C0C0' } };
    subtitleCell.alignment = { horizontal: 'center' };
    subtitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E1E1E' } };
    coverSheet.mergeCells('B11:E11');
    const orgInfoHeader = coverSheet.getCell('B11');
    orgInfoHeader.value = 'ORGANIZATION INFORMATION';
    orgInfoHeader.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFD700' } };
    orgInfoHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2A2A2A' } };
    coverSheet.getRow(11).height = 25;
    coverSheet.getCell('B13').value = 'Organization Name:';
    coverSheet.getCell('B13').font = { bold: true, size: 11 };
    coverSheet.mergeCells('C13:E13');
    coverSheet.getCell('C13').value = organizationName;
    coverSheet.getCell('C13').font = { size: 11 };
    coverSheet.getCell('B14').value = 'Report Date:';
    coverSheet.getCell('B14').font = { bold: true, size: 11 };
    coverSheet.mergeCells('C14:E14');
    coverSheet.getCell('C14').value = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    coverSheet.getCell('C14').font = { size: 11 };
    coverSheet.mergeCells('B16:E16');
    const summaryHeader = coverSheet.getCell('B16');
    summaryHeader.value = 'EXECUTIVE SUMMARY';
    summaryHeader.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFD700' } };
    summaryHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2A2A2A' } };
    coverSheet.getRow(16).height = 25;
    coverSheet.mergeCells('B18:E20');
    const summaryText = coverSheet.getCell('B18');
    summaryText.value = 'This Risk Register is a comprehensive record of potential risks identified in the organization\'s information security landscape. It documents the nature of each risk, its impact and likelihood, treatment measures, and associated controls aligned with ISO 27001 Annex A.\n\nThe objective is to ensure proactive risk management, guide treatment planning, and enhance the organization\'s overall cybersecurity posture in line with compliance and governance standards.'; // Keep full text
    summaryText.font = { size: 10 };
    summaryText.alignment = { wrapText: true, vertical: 'top' };
    coverSheet.getRow(18).height = 60;
    coverSheet.mergeCells('B22:E22');
    const controlHeader = coverSheet.getCell('B22');
    controlHeader.value = 'DOCUMENT CONTROL';
    controlHeader.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFD700' } };
    controlHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2A2A2A' } };
    coverSheet.getRow(22).height = 25;
    const approvalTableHeaders = ['Role', 'Name', 'Signature', 'Date'];
    approvalTableHeaders.forEach((header, idx) => { /* ... Keep header styling ... */ 
      const cell = coverSheet.getCell(24, idx + 2);
      cell.value = header;
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E1E1E' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    const approvalTableData = [ ['Author', author, '', new Date().toISOString().split('T')[0]], ['Reviewer', reviewer, '', ''], ['Approver', approver, '', ''], ['Last Reviewed By', '', '', ''] ];
    approvalTableData.forEach((row, rowIdx) => { /* ... Keep data styling ... */ 
      row.forEach((value, colIdx) => {
          const cell = coverSheet.getCell(25 + rowIdx, colIdx + 2);
          cell.value = value;
          cell.font = { size: 10 };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          if (rowIdx % 2 === 0) { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F8F8' } }; }
      });
      coverSheet.getRow(25 + rowIdx).height = 25;
    });
    coverSheet.mergeCells('B30:E30');
    const footerCell = coverSheet.getCell('B30');
    footerCell.value = 'Confidential - For Internal Use Only';
    footerCell.font = { size: 9, color: { argb: 'FF808080' }, italic: true };
    footerCell.alignment = { horizontal: 'center' };
    coverSheet.mergeCells('B31:E31');
    const copyrightCell = coverSheet.getCell('B31');
    copyrightCell.value = 'BrahmaGrid © 2025';
    copyrightCell.font = { size: 9, bold: true, color: { argb: 'FFFFD700' } };
    copyrightCell.alignment = { horizontal: 'center' };
  // --- End Cover Page ---
  
  // ===== RISK REGISTER SHEET =====
  const riskSheet = workbook.addWorksheet('Risk Register', {
    properties: { tabColor: { argb: 'FFFFD700' } }
  });
  
  // ⭐ UPDATED: Define columns including new fields
  riskSheet.columns = [
    // Identification
    { header: 'Ref No', key: 'refNo', width: 10, style: { alignment: { horizontal: 'center' } } },
    { header: 'Risk Description', key: 'description', width: 35 },
    { header: 'Asset', key: 'asset', width: 20 },
    { header: 'Threat', key: 'threat', width: 20 },
    { header: 'Vulnerability', key: 'vulnerability', width: 20 },
    { header: 'Existing Controls', key: 'existingControl', width: 30 },
    // Pre-Treatment Assessment
    { header: 'Likelihood', key: 'likelihood', width: 12, style: { alignment: { horizontal: 'center' } } },
    { header: 'Impact', key: 'impact', width: 12, style: { alignment: { horizontal: 'center' } } },
    { header: 'Risk Score', key: 'riskLevel', width: 12, style: { alignment: { horizontal: 'center' } } },
    { header: 'Risk Level', key: 'riskLevelText', width: 12, style: { alignment: { horizontal: 'center' } } },
    // Treatment
    { header: 'Treatment Plan', key: 'treatmentPlan', width: 35 },
    { header: 'Risk Owner', key: 'riskOwner', width: 20 },
    { header: 'Annex A Control', key: 'annexAControl', width: 18 }, // New
    { header: 'Cost', key: 'cost', width: 15 },                     // New
    { header: 'Timeline', key: 'timeline', width: 15, style: { numFmt: 'yyyy-mm-dd' } }, // New - formatted as date
    // Post-Treatment Assessment
    { header: 'Post-Likelihood', key: 'postLikelihood', width: 15, style: { alignment: { horizontal: 'center' } } }, // New
    { header: 'Post-Impact', key: 'postImpact', width: 15, style: { alignment: { horizontal: 'center' } } },         // New
    { header: 'Residual Score', key: 'postRiskLevel', width: 15, style: { alignment: { horizontal: 'center' } } },   // New
    { header: 'Residual Level', key: 'postRiskLevelText', width: 15, style: { alignment: { horizontal: 'center' } } }, // New
    // Final Remarks
    { header: 'Final Remarks', key: 'finalRemarks', width: 30 }       // New (was comments)
  ];
  
  // Style header row (no changes needed)
  const headerRow = riskSheet.getRow(1);
  headerRow.height = 30;
  headerRow.font = { bold: true, color: { argb: 'FFFFD700' }, size: 11 };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E1E1E' } };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'medium', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    };
  });
  
  // Helper function for risk level text
  const getRiskLevelText = (level: number): string => {
      if (level >= 15) return "High";
      if (level >= 9) return "Medium";
      if (level > 0) return "Low";
      return "-";
  };

  // Add risk data
  risks.forEach((risk, index) => {
    // ⭐ UPDATED: Add row data including new fields and calculated levels
    const row = riskSheet.addRow({
      refNo: risk.id,
      description: risk.description,
      asset: risk.asset,
      threat: risk.threat,
      vulnerability: risk.vulnerability,
      existingControl: risk.existingControl,
      // Pre-Treatment
      likelihood: risk.likelihood ? parseInt(risk.likelihood) : undefined, // Store as number if possible
      impact: risk.impact ? parseInt(risk.impact) : undefined,          // Store as number if possible
      riskLevel: risk.riskLevel > 0 ? risk.riskLevel : undefined,        // Store as number if possible, blank if 0
      riskLevelText: getRiskLevelText(risk.riskLevel),
      // Treatment
      treatmentPlan: risk.treatmentPlan,
      riskOwner: risk.riskOwner,
      annexAControl: risk.annexAControl,
      cost: risk.cost,
      timeline: risk.timeline ? new Date(risk.timeline) : undefined, // Store as Date object if possible
      // Post-Treatment
      postLikelihood: risk.postLikelihood ? parseInt(risk.postLikelihood) : undefined,
      postImpact: risk.postImpact ? parseInt(risk.postImpact) : undefined,
      postRiskLevel: risk.postRiskLevel > 0 ? risk.postRiskLevel : undefined,
      postRiskLevelText: getRiskLevelText(risk.postRiskLevel),
      // Final Remarks
      finalRemarks: risk.finalRemarks
    });
    
    // Alternating row colors (apply based on index)
    row.fill = { 
        type: 'pattern', 
        pattern: 'solid', 
        fgColor: { argb: index % 2 === 0 ? 'FFF8F8F8' : 'FFFFFFFF' } 
    };
    
    // Style cells (Alignment and Font)
    row.alignment = { vertical: 'top', wrapText: true };
    row.font = { size: 10 };
    
    // ⭐ UPDATED: Apply borders to all cells in the row
    row.eachCell({ includeEmpty: true }, (cell) => { // Use includeEmpty: true just in case, though usually not needed here
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD3D3D3' } }, // Lighter grey border
        left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
      };
    });
    
    // Color code Pre-Treatment Risk Level Text
    const preLevelCell = row.getCell('riskLevelText');
    if (risk.riskLevel >= 15) { preLevelCell.font = { bold: true, color: { argb: 'FFFF0000' }, size: 10 }; } 
    else if (risk.riskLevel >= 9) { preLevelCell.font = { bold: true, color: { argb: 'FFFFA500' }, size: 10 }; } 
    else if (risk.riskLevel > 0) { preLevelCell.font = { color: { argb: 'FF008000' }, size: 10 }; }
    else { preLevelCell.font = { color: { argb: 'FF808080'}, size: 10 }; } // Grey for '-'

     // ⭐ ADDED: Color code Post-Treatment Risk Level Text
    const postLevelCell = row.getCell('postRiskLevelText');
    if (risk.postRiskLevel >= 15) { postLevelCell.font = { bold: true, color: { argb: 'FFFF0000' }, size: 10 }; } 
    else if (risk.postRiskLevel >= 9) { postLevelCell.font = { bold: true, color: { argb: 'FFFFA500' }, size: 10 }; } 
    else if (risk.postRiskLevel > 0) { postLevelCell.font = { color: { argb: 'FF008000' }, size: 10 }; }
    else { postLevelCell.font = { color: { argb: 'FF808080'}, size: 10 }; } // Grey for '-'

    // Center align specific columns (redundant if set in column definition but safe)
    ['refNo', 'likelihood', 'impact', 'riskLevel', 'riskLevelText', 'postLikelihood', 'postImpact', 'postRiskLevel', 'postRiskLevelText'].forEach(key => {
        const cell = row.getCell(key);
        cell.alignment = { ...cell.alignment, horizontal: 'center' };
    });

  });
  
  // Freeze top row (no changes needed)
  riskSheet.views = [{ state: 'frozen', ySplit: 1 }];
  
  // --- Likelihood Scale Sheet (No changes needed here) ---
  const likelihoodSheet = workbook.addWorksheet('Likelihood Scale', { properties: { tabColor: { argb: 'FFFFD700' } } });
  // ... (Keep existing Likelihood sheet setup) ...
    likelihoodSheet.columns = [ { header: 'LIKELIHOOD', key: 'level', width: 15 }, { header: 'DESCRIPTION', key: 'description', width: 20 }, { header: 'SUMMARY', key: 'summary', width: 80 } ];
    const likelihoodHeader = likelihoodSheet.getRow(1);
    likelihoodHeader.height = 25;
    likelihoodHeader.font = { bold: true, color: { argb: 'FFFFD700' }, size: 12 };
    likelihoodHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E1E1E' } };
    likelihoodHeader.alignment = { horizontal: 'center', vertical: 'middle' };
    const likelihoodData = [ ['1', 'Improbable', 'Has never happened before and there is no reason to think it is any more likely now'], 
    ['2', 'Unlikely', 'There is a possibility that it could happen, but it probably won\'t'], 
    ['3', 'Likely', 'On balance, the risk is more likely to happen than not'], 
    ['4', 'Very Likely', 'It would be a surprise if the risk did not occur either based on past frequency or current circumstances'], 
    ['5', 'Almost certain', 'Either already happens regularly or there is some reason to believe it is virtually imminent'] ]; 

    likelihoodData.forEach((data, index) => { /* ... Keep styling ... */ 
        const row = likelihoodSheet.addRow({ level: data[0], description: data[1], summary: data[2] });
        row.alignment = { vertical: 'middle', wrapText: true };
        if (index % 2 === 0) { row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F8F8' } }; }
    });
  // --- End Likelihood Scale Sheet ---
  
  // --- Impact Scale Sheet (No changes needed here) ---
  const impactSheet = workbook.addWorksheet('Impact Scale', { properties: { tabColor: { argb: 'FFFFD700' } } });
  // ... (Keep existing Impact sheet setup) ...
    impactSheet.columns = [ { header: 'IMPACT LEVEL', key: 'level', width: 18 }, { header: 'DESCRIPTION', key: 'description', width: 20 }, { header: 'SUMMARY', key: 'summary', width: 80 } ];
    const impactHeader = impactSheet.getRow(1);
    impactHeader.height = 25;
    impactHeader.font = { bold: true, color: { argb: 'FFFFD700' }, size: 12 };
    impactHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E1E1E' } };
    impactHeader.alignment = { horizontal: 'center', vertical: 'middle' };
    const impactData = [ ['1', 'Negligible', 'Minimal impact on operations, reputation, or compliance'], 
    ['2', 'Minor', 'Small impact with limited consequences'], 
    ['3', 'Moderate', 'Noticeable impact requiring management attention'], 
    ['4', 'Major', 'Significant impact with serious consequences'], 
    ['5', 'Catastrophic', 'Severe impact threatening organizational survival'] ]; 
    
    impactData.forEach((data, index) => { /* ... Keep styling ... */ 
        const row = impactSheet.addRow({ level: data[0], description: data[1], summary: data[2] });
        row.alignment = { vertical: 'middle', wrapText: true };
        if (index % 2 === 0) { row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F8F8' } }; }
    });
  // --- End Impact Scale Sheet ---
  
  // --- Generate and download file (No changes needed here) ---
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${organizationName.replace(/[^a-z0-9]/gi, '_')}_Risk_Register_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
  // --- End Generate/Download ---
};

export const generateMeetingMinutesPDF = async (
  organizationName: string,
  meetingDate: string,
  preparedBy: string,
  approvedBy: string,
  agendas: any[],
  meetingLocation?: string,
  meetingPurpose?: string,
  attendees?: string,
  organizationLogo?: string
) => {
  // We no longer need to cast the type
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ===== HEADER =====
  const brahmaLogo = await getBrahmaGridLogoBase64();
  doc.setFillColor(30, 30, 30);
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Left logo
  if (brahmaLogo) {
    try {
      doc.addImage(brahmaLogo, 'PNG', 15, 6, 25, 25);
    } catch (e) {
      console.error('Error adding BrahmaGrid logo:', e);
    }
  }

  // Title center
  doc.setTextColor(255, 215, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Minutes by Brahma', pageWidth / 2, 20, { align: 'center' });

  // Right logo
  if (organizationLogo) {
    try {
      doc.addImage(organizationLogo, 'PNG', pageWidth - 35, 8, 20, 20);
    } catch (e) {
      console.error('Error adding organization logo:', e);
    }
  }

  // ===== INTRODUCTION =====
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(60, 60, 60);

  const introText =
    'This document formally records the minutes of the meeting concluded as mentioned below. It serves as a comprehensive summary of the proceedings, including all agenda items discussed, key decisions made, and actionable items assigned. This record is crucial for maintaining transparency, ensuring accountability, and facilitating effective follow-up actions within the organization. All participants are encouraged to review these minutes to ensure accuracy and alignment.';
  const wrappedIntro = doc.splitTextToSize(introText, pageWidth - 30);
  doc.text(wrappedIntro, 15, 45);

  let y = 45 + wrappedIntro.length * 4 + 8;

  // ===== MEETING DETAILS =====
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.text(`Organization Name: ${organizationName}`, 15, y);
  y += 6;

  doc.text(`Date of Meeting: ${new Date(meetingDate).toISOString().split('T')[0]}`, 15, y);
  y += 6;

  if (meetingLocation) {
    doc.text(`Meeting Location: ${meetingLocation}`, 15, y);
    y += 6;
  }

  if (meetingPurpose) {
    const text = `Purpose of the Meeting: ${meetingPurpose}`;
    const maxWidth = pageWidth - 30; // 15px margin on each side
    const wrappedText = doc.splitTextToSize(text, maxWidth);
    doc.text(wrappedText, 15, y);
    y += wrappedText.length * 8; // Adjust spacing as needed
  }

  // ===== AGENDA SECTIONS =====
  agendas.forEach((agenda, index) => {
    if (y > pageHeight - 60) {
      doc.addPage();
      y = 20;
    }

    // Agenda header (gold bar)
    doc.setFillColor(255, 215, 0);
    doc.rect(15, y - 5, pageWidth - 30, 7, 'F');
    
    // Text styling for the header
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold'); // <-- Make the header bold
    
    doc.text(`Agenda ${index + 1}: ${agenda.title || agenda.topic || 'N/A'}`, 20, y);
    
    doc.setFont('helvetica', 'normal'); // <-- Reset to normal for following text
    y += 10;

    // Attendees
    if (attendees) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`Attendees: ${attendees}`, 20, y);
      y += 7;
    }

    // Discussion
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Discussion:', 20, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const discussionLines = doc.splitTextToSize(agenda.discussion || 'N/A', pageWidth - 40);
    discussionLines.forEach((line: string) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }
      doc.text(`• ${line}`, 25, y);
      y += 5;
    });
    y += 3;

    // Key Decisions
    if (agenda.actionItems) {
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Key Decisions:', 20, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const actionLines = doc.splitTextToSize(agenda.actionItems, pageWidth - 40);
      actionLines.forEach((line: string) => {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(`• ${line}`, 25, y);
        y += 5;
      });
      y += 3;
    }

    // Responsible Person
    if (agenda.responsiblePerson || agenda.responsible) {
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Responsible Person:', 20, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`• ${agenda.responsiblePerson || agenda.responsible}`, 25, y);
      y += 7;
    }

    y += 5;
  });

  // ===== APPROVAL TABLE =====
  if (y > pageHeight - 50) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(255, 215, 0);
  doc.rect(15, y, pageWidth - 30, 7, 'F');
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Approval Table', 20, y + 5);
  y += 12;

  // ⭐ FIX: Change doc.autoTable(...) to autoTable(doc, ...)
  autoTable(doc, {
    startY: y,
    head: [['Prepared By:', 'Approved By:']],
    body: [
      [preparedBy || 'N/A', approvedBy || 'N/A'],
      ['Signature:', 'Signature:'],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 215, 0],
      fontSize: 10,
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    margin: { left: 15, right: 15 },
  });

  // ===== FOOTER =====
  const totalPages = (doc as any).internal.getNumberOfPages(); // Use (doc as any) here as getNumberOfPages() might not be on the default type
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
      align: 'center',
    });
  }

  // ===== SAVE FILE =====
  doc.save(`${organizationName.replace(/[^a-z0-9]/gi, '_')}_Meeting_Minutes_${meetingDate}.pdf`);
};
