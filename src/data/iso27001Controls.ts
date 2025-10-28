// Complete ISO 27001:2022 Clauses 4-10 with sub-clauses
export const iso27001Clauses = [
  {
    clause: "4",
    title: "Context of the Organization",
    subClauses: [
      { id: "4.1", title: "Understanding the organization and its context", description: "Determine internal and external issues that are relevant to the organization's purpose and that affect its ability to achieve the intended outcome(s) of the ISMS.", expectedEvidence: "SWOT analysis, context documentation, stakeholder maps" },
      { id: "4.2", title: "Understanding the needs and expectations of interested parties", description: "Determine interested parties and their relevant information security requirements.", expectedEvidence: "SWOT analysis, context documentation, stakeholder maps" },
      { id: "4.3", title: "Determining the scope of the information security management system", description: "Define the boundaries and applicability of the ISMS.", expectedEvidence: "SWOT analysis, context documentation, stakeholder maps" },
      { id: "4.4", title: "Information security management system", description: "Establish, implement, maintain and continually improve the ISMS.", expectedEvidence: "SWOT analysis, context documentation, stakeholder maps" },
    ]
  },
  {
    clause: "5",
    title: "Leadership",
    subClauses: [
      { id: "5.1", title: "Leadership and commitment", description: "Top management must demonstrate leadership and commitment to the ISMS.", expectedEvidence: "Management meeting records, policy document, role assignments" },
      { id: "5.2", title: "Policy", description: "Top management shall establish an information security policy aligned with the strategic direction.", expectedEvidence: "Management meeting records, policy document, role assignments" },
      { id: "5.3", title: "Organizational roles, responsibilities and authorities", description: "Roles related to information security must be assigned and communicated.", expectedEvidence: "Management meeting records, policy document, role assignments" },
    ]
  },
  {
    clause: "6",
    title: "Planning",
    subClauses: [
      { id: "6.1.1", title: "Actions to address risks and opportunities", description: "Plan actions to manage risks and opportunities for achieving ISMS objectives.", expectedEvidence: "Risk registers, risk assessment reports, treatment plans" },
      { id: "6.1.2", title: "Information security risk assessment", description: "Define and apply a process for periodic risk assessment.", expectedEvidence: "Risk registers, risk assessment reports, treatment plans" },
      { id: "6.1.3", title: "Information security risk treatment", description: "Define and apply a process for treating identified risks.", expectedEvidence: "Risk registers, risk assessment reports, treatment plans" },
      { id: "6.2", title: "Information security objectives and planning to achieve them", description: "Establish measurable security objectives and plans to meet them.", expectedEvidence: "Risk registers, risk assessment reports, treatment plans" },
      { id: "6.3", title: "Planning of changes", description: "Manage changes to the ISMS in a planned manner.", expectedEvidence: "Risk registers, risk assessment reports, treatment plans" },
    ]
  },
  {
    clause: "7",
    title: "Support",
    subClauses: [
      { id: "7.1", title: "Resources", description: "Determine and provide resources for the ISMS.", expectedEvidence: "Training logs, communication records, document control logs" },
      { id: "7.2", title: "Competence", description: "Ensure that relevant personnel are competent.", expectedEvidence: "Training logs, communication records, document control logs" },
      { id: "7.3", title: "Awareness", description: "Ensure personnel are aware of information security responsibilities.", expectedEvidence: "Training logs, communication records, document control logs" },
      { id: "7.4", title: "Communication", description: "Determine internal and external communication relevant to the ISMS.", expectedEvidence: "Training logs, communication records, document control logs" },
      { id: "7.5.1", title: "Documented information – General", description: "Maintain documented information as required by ISO 27001.", expectedEvidence: "Training logs, communication records, document control logs" },
      { id: "7.5.2", title: "Creating and updating", description: "Ensure documents are appropriately identified, formatted and reviewed.", expectedEvidence: "Training logs, communication records, document control logs" },
      { id: "7.5.3", title: "Control of documented information", description: "Ensure documents are adequately protected and accessible.", expectedEvidence: "Training logs, communication records, document control logs" },
    ]
  },
  {
    clause: "8",
    title: "Operation",
    subClauses: [
      { id: "8.1", title: "Operational planning and control", description: "Plan and control ISMS processes.", expectedEvidence: "Procedure documents, implementation records, risk logs" },
      { id: "8.2", title: "Information security risk assessment", description: "Perform risk assessments at defined intervals.", expectedEvidence: "Procedure documents, implementation records, risk logs" },
      { id: "8.3", title: "Information security risk treatment", description: "Implement the risk treatment plan.", expectedEvidence: "Procedure documents, implementation records, risk logs" },
    ]
  },
  {
    clause: "9",
    title: "Performance Evaluation",
    subClauses: [
      { id: "9.1", title: "Monitoring, measurement, analysis and evaluation", description: "Determine what and how to monitor and evaluate ISMS performance.", expectedEvidence: "Audit reports, performance dashboards, review minutes" },
      { id: "9.2", title: "Internal audit", description: "Conduct periodic internal audits to ensure ISMS compliance.", expectedEvidence: "Audit reports, performance dashboards, review minutes" },
      { id: "9.3.1", title: "Management review – General", description: "Top management must review the ISMS.", expectedEvidence: "Audit reports, performance dashboards, review minutes" },
      { id: "9.3.2", title: "Management review – Inputs", description: "Define inputs for the ISMS review.", expectedEvidence: "Audit reports, performance dashboards, review minutes" },
      { id: "9.3.3", title: "Management review – Results", description: "Document decisions and actions from ISMS reviews.", expectedEvidence: "Audit reports, performance dashboards, review minutes" },
    ]
  },
  {
    clause: "10",
    title: "Improvement",
    subClauses: [
      { id: "10.1", title: "Continual improvement", description: "Improve the effectiveness of the ISMS.", expectedEvidence: "Corrective action plans, improvement records, logs" },
      { id: "10.2", title: "Nonconformity and corrective action", description: "React to nonconformities and take corrective actions.", expectedEvidence: "Risk Register, Corrective action plans, improvement records, logs" },
    ]
  },
];

// Complete ISO 27001:2022 Annex A Controls (sample subset - expand as needed)
export const annexAControls = [
  // --- ORGANIZATIONAL CONTROLS (A.5: 37 controls) ---
  { id: "A.5.1.1", title: "Policies for information security", description: "Establish, approve, publish and communicate an organisation-wide information security policy aligned to business objectives.", domain: "Organizational Controls", expectedEvidence: "Information security policy document, management approval, distribution logs, review records" },
  { id: "A.5.1.2", title: "Review of information security policy", description: "Periodically review and update information security policies to ensure continuing suitability and alignment to risks and objectives.", domain: "Organizational Controls", expectedEvidence: "Policy review minutes, version history, change justification, review schedule" },
  { id: "A.5.2.1", title: "Organization roles and responsibilities", description: "Define, communicate and allocate information security roles and responsibilities across the organisation.", domain: "Organizational Controls", expectedEvidence: "Organisational chart, role descriptions, responsibility matrix, assignment records" },
  { id: "A.5.2.2", title: "Segregation of duties", description: "Design roles and processes to avoid conflicts of interest and reduce the risk of fraud or error by separating duties.", domain: "Organizational Controls", expectedEvidence: "SoD policy, access matrices, role assignment reviews, compensating control documentation" },
  { id: "A.5.3.1", title: "Contact with authorities", description: "Establish and maintain contacts with relevant authorities for security, legal or regulatory matters.", domain: "Organizational Controls", expectedEvidence: "Contact list, correspondence records, engagement logs" },
  { id: "A.5.3.2", title: "Contact with special interest groups", description: "Participate in or maintain contact with relevant special interest groups and professional bodies to stay informed of threats and best practices.", domain: "Organizational Controls", expectedEvidence: "Membership records, meeting minutes, event attendance, subscription receipts" },
  { id: "A.5.3.3", title: "Information security in project management", description: "Include information security requirements in project management activities to ensure security considerations are integrated.", domain: "Organizational Controls", expectedEvidence: "Project plans with security tasks, security requirement artifacts, project review minutes" },
  { id: "A.5.4.1", title: "Inventory of assets", description: "Maintain an inventory of information assets (data, devices, systems, services) and assign ownership.", domain: "Organizational Controls", expectedEvidence: "Asset inventory register, asset owners list, inventory update logs" },
  { id: "A.5.4.2", title: "Acceptable use of assets", description: "Define acceptable use rules for organisational assets and ensure users are aware of them.", domain: "Organizational Controls", expectedEvidence: "Acceptable use policy, signed user declarations, training records" },
  { id: "A.5.4.3", title: "Return of assets", description: "Ensure assets provided to personnel or third parties are returned or accounted for at end of assignment.", domain: "Organizational Controls", expectedEvidence: "Asset checkout/return logs, exit checklists, receipts" },
  { id: "A.5.5.1", title: "Classification of information", description: "Classify information based on confidentiality, integrity and availability requirements and apply handling rules accordingly.", domain: "Organizational Controls", expectedEvidence: "Classification scheme, labeled documents, handling procedures" },
  { id: "A.5.5.2", title: "Labelling of information", description: "Apply labels to information assets to indicate classification and handling requirements.", domain: "Organizational Controls", expectedEvidence: "Sample labeled documents, labeling policy, training material" },
  { id: "A.5.5.3", title: "Handling of assets", description: "Define and enforce handling procedures for information and media according to classification.", domain: "Organizational Controls", expectedEvidence: "Handling procedures, distribution logs, retention schedules" },
  { id: "A.5.6.1", title: "Access control policy", description: "Establish policies and controls to grant, change and revoke access to information and systems based on business need.", domain: "Organizational Controls", expectedEvidence: "Access control policy, access request/revocation records, access reviews" },
  { id: "A.5.6.2", title: "Identity and access management", description: "Implement processes for identification, authentication and authorization of users and services.", domain: "Organizational Controls", expectedEvidence: "IAM configurations, user account records, MFA logs" },
  { id: "A.5.6.3", title: "Privileged access management", description: "Protect and control privileged accounts and administrative functions with additional safeguards and monitoring.", domain: "Organizational Controls", expectedEvidence: "Privileged access policy, PAM logs, privileged account inventory" },
  { id: "A.5.7.1", title: "Threat intelligence", description: "Collect, analyze and use threat intelligence to inform risk treatment and security operations.", domain: "Organizational Controls", expectedEvidence: "Threat intelligence reports, intel subscriptions, SOC feeds" },
  { id: "A.5.8.1", title: "Information security in supplier relationships", description: "Establish policies and controls to manage information security risks arising from supplier relationships.", domain: "Organizational Controls", expectedEvidence: "Supplier security policy, due diligence records, supplier risk assessments" },
  { id: "A.5.8.2", title: "Addressing information security within supplier agreements", description: "Include information security obligations in contracts and agreements with suppliers.", domain: "Organizational Controls", expectedEvidence: "Supplier contracts with security clauses, SLA excerpts, contract review records" },
  { id: "A.5.8.3", title: "Managing information security in the ICT supply chain", description: "Manage security risks in complex ICT supply chains and third-party services.", domain: "Organizational Controls", expectedEvidence: "Supply chain risk register, mapping of dependencies, assurance evidence from suppliers" },
  { id: "A.5.8.4", title: "Monitoring, review and change management of supplier services", description: "Monitor supplier performance and manage changes in supplier services that affect security.", domain: "Organizational Controls", expectedEvidence: "Supplier monitoring reports, change control records, review minutes" },
  { id: "A.5.9.1", title: "Human resource screening", description: "Perform background checks and pre-employment screening appropriate to role and legal requirements.", domain: "Organizational Controls", expectedEvidence: "Screening policy, verification records, signed consent forms" },
  { id: "A.5.9.2", title: "Terms and conditions of employment", description: "Ensure employment contracts include information security responsibilities and confidentiality obligations.", domain: "Organizational Controls", expectedEvidence: "Employment contracts, NDAs, HR policy excerpts" },
  { id: "A.5.10.1", title: "Awareness, education and training", description: "Provide information security awareness and role-based training to personnel and relevant third parties.", domain: "Organizational Controls", expectedEvidence: "Training curricula, attendance records, competency assessments" },
  { id: "A.5.11.1", title: "Disciplinary process", description: "Establish a disciplinary process for information security policy violations.", domain: "Organizational Controls", expectedEvidence: "Disciplinary policy, case records, communications" },
  { id: "A.5.12.1", title: "Information security incident management planning and preparation", description: "Plan, prepare and test procedures to detect, respond to and recover from information security incidents.", domain: "Organizational Controls", expectedEvidence: "Incident response plan, exercise reports, runbooks" },
  { id: "A.5.12.2", title: "Assessment and decision on information security events", description: "Assess incidents to determine impact and classify events for appropriate response.", domain: "Organizational Controls", expectedEvidence: "Incident assessment records, classification criteria, decision logs" },
  { id: "A.5.12.3", title: "Response to information security incidents", description: "Execute response actions to contain, eradicate and recover from incidents.", domain: "Organizational Controls", expectedEvidence: "Incident timelines, remediation records, post-incident reports" },
  { id: "A.5.12.4", title: "Learning from information security incidents", description: "Capture lessons learned and apply improvements following incidents.", domain: "Organizational Controls", expectedEvidence: "Post-incident reviews, action tracking, improvement records" },
  { id: "A.5.12.5", title: "Collection of evidence", description: "Preserve, collect and protect evidence for investigations and legal/forensic needs.", domain: "Organizational Controls", expectedEvidence: "Forensic chain-of-custody logs, evidence preservation procedures" },
  { id: "A.5.13.1", title: "Information security continuity", description: "Integrate information security requirements into business continuity and disaster recovery planning.", domain: "Organizational Controls", expectedEvidence: "BC/DR plans, continuity tests, ICT readiness records" },
  { id: "A.5.13.2", title: "ICT readiness for business continuity", description: "Ensure ICT systems and services are prepared to support continuity requirements.", domain: "Organizational Controls", expectedEvidence: "BCP ICT runbooks, recovery time objectives, DR test results" },
  { id: "A.5.14.1", title: "Legal and regulatory requirements", description: "Identify and meet legal, statutory, regulatory and contractual requirements relevant to information security.", domain: "Organizational Controls", expectedEvidence: "Compliance register, legal assessments, contractual clauses" },
  { id: "A.5.14.2", title: "Intellectual property rights", description: "Protect intellectual property and manage rights in information assets.", domain: "Organizational Controls", expectedEvidence: "IP registers, licensing agreements, policy documents" },
  { id: "A.5.14.3", title: "Protection of records", description: "Protect records from loss, destruction and tampering and ensure their preservation.", domain: "Organizational Controls", expectedEvidence: "Records management policy, backup logs, retention schedules" },
  { id: "A.5.14.4", title: "Privacy and protection of personal data", description: "Ensure personal data is handled in compliance with applicable privacy laws and policies.", domain: "Organizational Controls", expectedEvidence: "Privacy policy, DPIA reports, consent logs" },
  { id: "A.5.15.1", title: "Independent review of information security", description: "Arrange for independent reviews and audits of the ISMS and controls.", domain: "Organizational Controls", expectedEvidence: "Audit reports, internal review schedules, auditor qualifications" },
  { id: "A.5.15.2", title: "Compliance with policies, rules and standards", description: "Monitor and demonstrate compliance with internal policies and external standards.", domain: "Organizational Controls", expectedEvidence: "Compliance assessments, gap analysis reports, corrective action plans" },

  // --- PEOPLE CONTROLS (A.6: 8 controls) ---
  { id: "A.6.1.1", title: "Screening", description: "Apply background verification and appropriate screening when hiring or moving personnel into sensitive roles.", domain: "People Controls", expectedEvidence: "Screening policy, background check results, hiring checklists" },
  { id: "A.6.1.2", title: "Terms and conditions of employment (people)", description: "Ensure employment terms address security responsibilities and obligations.", domain: "People Controls", expectedEvidence: "Employment contracts, confidentiality agreements, HR policies" },
  { id: "A.6.2.1", title: "Management responsibilities", description: "Ensure managers support, enforce and model information security responsibilities.", domain: "People Controls", expectedEvidence: "Manager training records, role accountability statements" },
  { id: "A.6.2.2", title: "Information security awareness, education and training", description: "Provide role-appropriate security awareness and training to personnel and relevant third parties.", domain: "People Controls", expectedEvidence: "Awareness campaigns, training logs, competency assessments" },
  { id: "A.6.3.1", title: "Disciplinary process (people)", description: "Apply disciplinary measures for breaches of security policy consistently and fairly.", domain: "People Controls", expectedEvidence: "Disciplinary records, policy references, incident logs" },
  { id: "A.6.3.2", title: "Termination and change of employment responsibilities", description: "Manage security responsibilities during role changes and on termination to protect assets.", domain: "People Controls", expectedEvidence: "Exit checklists, access revocation records, return of assets" },
  { id: "A.6.4.1", title: "Remote working", description: "Define controls to maintain security when personnel work remotely or use mobile/work-from-home arrangements.", domain: "People Controls", expectedEvidence: "Remote work policy, secure configuration baselines, VPN/connection logs" },
  { id: "A.6.4.2", title: "Physical and mental fitness for role", description: "Consider suitability and fitness for role where relevant to security (e.g., safety-critical roles).", domain: "People Controls", expectedEvidence: "Fit-for-duty checks, role suitability assessments, medical/fitness records (where lawful)" },

  // --- PHYSICAL CONTROLS (A.7: 14 controls) ---
  { id: "A.7.1.1", title: "Physical security perimeters", description: "Define and implement physical perimeters to protect facilities and assets against unauthorized access.", domain: "Physical Controls", expectedEvidence: "Facility plans, perimeter controls, CCTV records" },
  { id: "A.7.1.2", title: "Physical entry controls", description: "Control, log and audit entry to secure areas using appropriate mechanisms.", domain: "Physical Controls", expectedEvidence: "Access logs, badge records, visitor records" },
  { id: "A.7.1.3", title: "Securing offices, rooms and facilities", description: "Protect offices, rooms and facilities from unauthorized physical access and environmental threats.", domain: "Physical Controls", expectedEvidence: "Facility security procedures, environmental monitoring logs" },
  { id: "A.7.2.1", title: "Protecting against external and environmental threats", description: "Implement protections against fire, flood, power loss and other environmental hazards.", domain: "Physical Controls", expectedEvidence: "Environmental risk assessments, mitigation designs, test reports" },
  { id: "A.7.2.2", title: "Equipment siting and protection", description: "Locate and protect equipment to reduce risks from threats and environmental hazards.", domain: "Physical Controls", expectedEvidence: "Equipment location diagrams, protective measures documentation" },
  { id: "A.7.2.3", title: "Supporting utilities", description: "Ensure supporting utilities (power, cooling) are secure and resilient for critical systems.", domain: "Physical Controls", expectedEvidence: "Utility SLAs, UPS maintenance logs, redundancy design" },
  { id: "A.7.3.1", title: "Cabling security", description: "Protect cabling to prevent interception or damage to information in transit.", domain: "Physical Controls", expectedEvidence: "Cabling layouts, cable protection measures, physical inspection logs" },
  { id: "A.7.3.2", title: "Equipment maintenance", description: "Maintain equipment securely to ensure continued protection and availability.", domain: "Physical Controls", expectedEvidence: "Maintenance schedules, service reports, vendor tickets" },
  { id: "A.7.3.3", title: "Secure disposal or reuse of equipment", description: "Ensure secure disposal, sanitisation or reuse of equipment to prevent data leakage.", domain: "Physical Controls", expectedEvidence: "Disposal records, data sanitisation certificates, chain-of-custody" },
  { id: "A.7.3.4", title: "Removal of assets", description: "Control removal of assets from premises and record approvals and returns.", domain: "Physical Controls", expectedEvidence: "Asset removal logs, approval records, return receipts" },
  { id: "A.7.4.1", title: "Physical security monitoring", description: "Monitor physical security through appropriate detection and surveillance measures.", domain: "Physical Controls", expectedEvidence: "CCTV footage, alarm logs, monitoring procedures" },
  { id: "A.7.4.2", title: "Visitor access records and escorts", description: "Manage visitors to secure areas with authentication, recording and escorting as necessary.", domain: "Physical Controls", expectedEvidence: "Visitor logs, escort procedures, badge issuance records" },
  { id: "A.7.4.3", title: "Secure areas for sensitive information", description: "Define and secure areas where sensitive information is processed or stored.", domain: "Physical Controls", expectedEvidence: "Secure area designation, access lists, physical controls inventory" },
  { id: "A.7.5.1", title: "Storage media controls", description: "Protect storage media during handling, transport and storage to prevent unauthorized access or damage.", domain: "Physical Controls", expectedEvidence: "Media handling procedures, transfer logs, secure containers" },

  // --- TECHNOLOGICAL CONTROLS (A.8: 34 controls) ---
  { id: "A.8.1.1", title: "User endpoint devices", description: "Protect endpoints (workstations, laptops, mobile devices) against malware and misuse.", domain: "Technological Controls", expectedEvidence: "Endpoint protection logs, device inventory, configuration baselines" },
  { id: "A.8.1.2", title: "Secure configuration", description: "Establish and maintain secure configuration baselines for systems and devices.", domain: "Technological Controls", expectedEvidence: "Configuration baselines, hardening guides, configuration audit reports" },
  { id: "A.8.1.3", title: "Device hardening and patching", description: "Apply timely patching and hardening to reduce vulnerabilities on systems and devices.", domain: "Technological Controls", expectedEvidence: "Patch management records, vulnerability scan reports, change tickets" },
  { id: "A.8.1.4", title: "Return of assets (technical)", description: "Ensure secure return or re-provisioning of technical assets when no longer required.", domain: "Technological Controls", expectedEvidence: "Device return records, wipe/sanitisation reports" },
  { id: "A.8.2.1", title: "Inventory of information and other associated assets", description: "Maintain an inventory of information assets including owners and protection requirements.", domain: "Technological Controls", expectedEvidence: "Information asset register, owner assignments, classification metadata" },
  { id: "A.8.2.2", title: "Ownership of assets", description: "Assign owners for information assets responsible for protection and lifecycle decisions.", domain: "Technological Controls", expectedEvidence: "Owner assignment records, ownership policy" },
  { id: "A.8.2.3", title: "Acceptable use of assets (technical)", description: "Define acceptable use and secure handling for IT and information assets.", domain: "Technological Controls", expectedEvidence: "Acceptable use policy, user acknowledgements, monitoring logs" },
  { id: "A.8.3.1", title: "Management of removable media", description: "Control use, storage, transport and disposal of removable media to prevent data leakage.", domain: "Technological Controls", expectedEvidence: "Media register, issuance logs, sanitisation certificates" },
  { id: "A.8.3.2", title: "Secure disposal of media", description: "Ensure secure disposal and destruction of media containing sensitive information.", domain: "Technological Controls", expectedEvidence: "Destruction certificates, disposal logs, vendor receipts" },
  { id: "A.8.3.3", title: "Physical media transfer", description: "Protect media during transfer using controls appropriate to classification and risk.", domain: "Technological Controls", expectedEvidence: "Transfer logs, encryption records, delivery confirmations" },
  { id: "A.8.4.1", title: "Classification and handling of information (technical)", description: "Ensure systems enforce classification-based handling rules for stored/processed information.", domain: "Technological Controls", expectedEvidence: "System labels, DLP rules, access control enforcement logs" },
  { id: "A.8.5.1", title: "Secure authentication", description: "Use secure authentication mechanisms and multi-factor authentication where appropriate.", domain: "Technological Controls", expectedEvidence: "Authentication policy, MFA logs, access control lists" },
  { id: "A.8.5.2", title: "Password management", description: "Enforce strong password policies and secure credential management.", domain: "Technological Controls", expectedEvidence: "Password policy, password vault usage logs, provisioning records" },
  { id: "A.8.6.1", title: "Network security management", description: "Securely design, segment and manage networks to limit exposure and control access.", domain: "Technological Controls", expectedEvidence: "Network diagrams, segmentation rules, firewall configs" },
  { id: "A.8.6.2", title: "Secure communications", description: "Protect information in transit using appropriate cryptographic and protocol controls.", domain: "Technological Controls", expectedEvidence: "Encryption configurations, TLS usage reports, secure protocol lists" },
  { id: "A.8.7.1", title: "Management of technical vulnerabilities", description: "Identify, evaluate and remediate technical vulnerabilities in a timely manner.", domain: "Technological Controls", expectedEvidence: "Vulnerability scans, remediation tickets, risk acceptance records" },
  { id: "A.8.8.1", title: "Cryptographic controls (use of cryptography)", description: "Define and implement cryptographic controls where needed to protect information.", domain: "Technological Controls", expectedEvidence: "Cryptography policy, key management procedures, certificate records" },
  { id: "A.8.9.1", title: "Configuration management", description: "Manage system and network configurations to maintain integrity and security over time.", domain: "Technological Controls", expectedEvidence: "Configuration management database, change records, baseline comparisons" },
  { id: "A.8.10.1", title: "Information deletion", description: "Ensure information and data are securely deleted when no longer required.", domain: "Technological Controls", expectedEvidence: "Deletion procedures, wipe logs, retention schedules" },
  { id: "A.8.11.1", title: "Data masking", description: "Apply data masking techniques to limit exposure of sensitive data in non-production and operational contexts.", domain: "Technological Controls", expectedEvidence: "Masking rules, test data policies, implementation evidence" },
  { id: "A.8.12.1", title: "Data leakage prevention", description: "Deploy controls to detect and prevent unauthorized exfiltration of sensitive information.", domain: "Technological Controls", expectedEvidence: "DLP policies, DLP event logs, prevention rule sets" },
  { id: "A.8.13.1", title: "Logging", description: "Collect, store and protect logs of relevant events and ensure their availability for monitoring and investigation.", domain: "Technological Controls", expectedEvidence: "SIEM configuration, log retention policy, example logs" },
  { id: "A.8.14.1", title: "Monitoring activities", description: "Monitor networks, systems and user activities to detect anomalous or malicious behavior.", domain: "Technological Controls", expectedEvidence: "Monitoring dashboards, alert records, SOC reports" },
  { id: "A.8.15.1", title: "Detection, prevention and correction of malware", description: "Provide protection against malware, detect infections and respond appropriately.", domain: "Technological Controls", expectedEvidence: "Anti-malware logs, incident records, quarantine reports" },
  { id: "A.8.16.1", title: "Back-up", description: "Implement backup procedures that ensure the integrity and availability of information and systems.", domain: "Technological Controls", expectedEvidence: "Backup schedules, restoration test results, backup logs" },
  { id: "A.8.17.1", title: "Control of software installation", description: "Control installation of software to prevent unauthorized or insecure applications.", domain: "Technological Controls", expectedEvidence: "Application whitelists, install approval records, software inventories" },
  { id: "A.8.18.1", title: "Change management", description: "Manage changes to systems and applications using formal change control with security reviews.", domain: "Technological Controls", expectedEvidence: "Change tickets, approval records, post-implementation reviews" },
  { id: "A.8.19.1", title: "Capacity and performance management", description: "Manage and monitor system capacity and performance to ensure availability requirements are met.", domain: "Technological Controls", expectedEvidence: "Capacity plans, monitoring reports, scaling records" },
  { id: "A.8.20.1", title: "Protection of development environments", description: "Separate and protect development, test and production environments to prevent leakage and compromise.", domain: "Technological Controls", expectedEvidence: "Environment separation diagrams, access rules, CI/CD pipeline configs" },
  { id: "A.8.21.1", title: "Secure coding", description: "Incorporate secure coding practices, code review and testing to reduce vulnerabilities in software.", domain: "Technological Controls", expectedEvidence: "Secure coding standards, code review records, SAST/DAST reports" },
  { id: "A.8.22.1", title: "Web filtering", description: "Use web-filtering controls to limit exposure to malicious or inappropriate web content.", domain: "Technological Controls", expectedEvidence: "Web filter policies, filter logs, URL categorisation settings" },
  { id: "A.8.23.1", title: "Network resilience and segregation", description: "Design for resilience and apply segmentation to reduce risk and limit attack surface.", domain: "Technological Controls", expectedEvidence: "Network resilience plans, segmentation diagrams, test reports" },
  { id: "A.8.24.1", title: "Use of cryptography (technical)", description: "Apply cryptography for confidentiality, integrity and authentication where required by risk treatment.", domain: "Technological Controls", expectedEvidence: "Encryption implementation evidence, key inventories, crypto policies" },
  { id: "A.8.25.1", title: "Protection of log information", description: "Ensure logs are protected from tampering and retained for their required period.", domain: "Technological Controls", expectedEvidence: "Immutable log storage evidence, retention policies, audit trails" },
  { id: "A.8.26.1", title: "Web application security", description: "Apply security controls to web applications including testing and secure design.", domain: "Technological Controls", expectedEvidence: "Appsec test reports, WAF configs, secure SDLC artefacts" },
  { id: "A.8.27.1", title: "Monitoring of privileged activities", description: "Monitor and record privileged user activities to detect misuse.", domain: "Technological Controls", expectedEvidence: "Privileged session logs, monitoring policies, alert records" },
  { id: "A.8.28.1", title: "Protection against social engineering", description: "Reduce social engineering risk through awareness, testing and technical controls.", domain: "Technological Controls", expectedEvidence: "Phishing test results, training records, email filtering logs" },
  { id: "A.8.29.1", title: "Secure disposal of information", description: "Ensure data and copies are securely erased or destroyed when no longer required.", domain: "Technological Controls", expectedEvidence: "Sanitisation logs, deletion confirmations, disposal certificates" },
  { id: "A.8.30.1", title: "Application and interface security", description: "Protect application interfaces and APIs against unauthorized access and misuse.", domain: "Technological Controls", expectedEvidence: "API gateway configs, access policies, security test reports" },
  { id: "A.8.31.1", title: "Segregation in networks and applications", description: "Enforce segregation and least-privilege across networks, tenants, and applications.", domain: "Technological Controls", expectedEvidence: "Segregation diagrams, access control lists, tenant isolation evidence" },
  { id: "A.8.32.1", title: "Data integrity and validation", description: "Ensure data inputs and flows are validated to prevent corruption and injection attacks.", domain: "Technological Controls", expectedEvidence: "Validation rules, input sanitisation tests, data integrity checks" },
  { id: "A.8.33.1", title: "Endpoint detection and response (EDR)", description: "Deploy detection and response capabilities on endpoints to identify and mitigate threats.", domain: "Technological Controls", expectedEvidence: "EDR logs, detection rules, incident response outputs" },
  { id: "A.8.34.1", title: "Cloud security and controls", description: "Apply cloud-specific security controls and shared responsibility considerations for cloud services.", domain: "Technological Controls", expectedEvidence: "Cloud security architecture, CSP evidence, cloud configuration audits" }
];

