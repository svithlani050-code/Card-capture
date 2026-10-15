import { VisitorRecord } from '../types/card';

export function exportVisitorsToCSV(visitors: VisitorRecord[], filename?: string): boolean {
  const headers = [
    'Token No',
    'Date & Time',
    'Full Name',
    'Native Script Name',
    'Card Type',
    'Company',
    'Designation',
    'Department',
    'Primary Phone',
    'All Phones',
    'Email',
    'Website',
    'City',
    'State',
    'Pincode',
    'Full Address',
    'ID / Tax Numbers',
    'Languages Detected',
    'Host Person',
    'Purpose',
    'Operator Verified',
  ];

  const escapeCSV = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = (visitors || []).map((v) => {
    const primaryPhone = v.phones?.[0]?.number || '';
    const allPhones = v.phones?.map((p) => `${p.type || 'Phone'}: ${p.number}`).join('; ') || '';
    const emails = v.emails?.join('; ') || '';
    const websites = v.websites?.join('; ') || '';
    const idNums = v.idNumbers?.map((id) => `${id.label}: ${id.value}`).join('; ') || '';
    const langs = v.detectedLanguages?.join(', ') || '';

    return [
      escapeCSV(v.tokenNumber),
      escapeCSV(new Date(v.createdAt).toLocaleString()),
      escapeCSV(v.fullName),
      escapeCSV(v.localizedName || ''),
      escapeCSV(v.cardType),
      escapeCSV(v.company || ''),
      escapeCSV(v.designation || ''),
      escapeCSV(v.department || ''),
      escapeCSV(primaryPhone),
      escapeCSV(allPhones),
      escapeCSV(emails),
      escapeCSV(websites),
      escapeCSV(v.address?.city || ''),
      escapeCSV(v.address?.state || ''),
      escapeCSV(v.address?.pincode || ''),
      escapeCSV(v.address?.full || ''),
      escapeCSV(idNums),
      escapeCSV(langs),
      escapeCSV(v.hostPerson || ''),
      escapeCSV(v.visitorPurpose || ''),
      escapeCSV(v.operatorVerified ? 'Yes' : 'No'),
    ].join(',');
  });

  // Prepend UTF-8 BOM (\uFEFF) so Excel displays Indian scripts (Hindi, Gujarati, Marathi, Bengali) correctly
  const csvContent = '\uFEFF' + [headers.map((h) => `"${h}"`).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', filename || `visitors_log_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export function exportVisitorToVCard(visitor: VisitorRecord): void {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${visitor.fullName}`,
  ];

  if (visitor.company) {
    lines.push(`ORG:${visitor.company}`);
  }
  if (visitor.designation) {
    lines.push(`TITLE:${visitor.designation}`);
  }
  if (visitor.phones && visitor.phones.length > 0) {
    visitor.phones.forEach((p) => {
      lines.push(`TEL;TYPE=${(p.type || 'CELL').toUpperCase()}:${p.number}`);
    });
  }
  if (visitor.emails && visitor.emails.length > 0) {
    visitor.emails.forEach((email) => {
      lines.push(`EMAIL;TYPE=INTERNET:${email}`);
    });
  }
  if (visitor.websites && visitor.websites.length > 0) {
    visitor.websites.forEach((site) => {
      lines.push(`URL:${site}`);
    });
  }
  if (visitor.address?.full) {
    lines.push(
      `ADR;TYPE=WORK:;;${visitor.address.street || ''};${visitor.address.city || ''};${
        visitor.address.state || ''
      };${visitor.address.pincode || ''};India`
    );
  }
  if (visitor.notes || visitor.localizedName) {
    const noteText = [
      visitor.localizedName ? `Native Name: ${visitor.localizedName}` : '',
      visitor.notes || '',
    ]
      .filter(Boolean)
      .join(' | ');
    lines.push(`NOTE:${noteText}`);
  }
  lines.push('END:VCARD');

  const vcfContent = lines.join('\r\n');
  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = (visitor.fullName || 'contact').replace(/[^a-zA-Z0-9]/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `${safeName}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
