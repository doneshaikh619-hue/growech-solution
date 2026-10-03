const fs = require('fs');
const path = require('path');

function parseCsv(content) {
  const lines = content.trim().split('\n');
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const row = [];
    let cur = '';
    let inQ = false;
    for (const c of lines[i]) {
      if (c === '"') inQ = !inQ;
      else if (c === ',' && !inQ) { row.push(cur.trim()); cur = ''; }
      else cur += c;
    }
    row.push(cur.trim());
    if (row.length >= 8 && row[6] && row[7] && (row[4] || row[5])) {
      result.push({
        business_name: row[0],
        owner_name: row[1],
        designation: row[2],
        city: row[3],
        phone: row[4] || row[5],
        email: row[6].toLowerCase().trim(),
        website: row[7],
        pitch_angle: row[11] || ''
      });
    }
  }
  return result;
}

const f1 = fs.readFileSync('C:\\Users\\SDC TECH\\Desktop\\1_Pakistani_Architects_Interior_Designers_Owners.csv', 'utf8');
const f2 = fs.readFileSync('C:\\Users\\SDC TECH\\Desktop\\2_Pakistani_Dental_Aesthetic_Clinics_Owners.csv', 'utf8');
const f3 = fs.readFileSync('C:\\Users\\SDC TECH\\Desktop\\3_Pakistani_Car_Detailing_PPF_Studios_Owners.csv', 'utf8');

const allLeads = [...parseCsv(f1), ...parseCsv(f2), ...parseCsv(f3)];
const outPath = path.join(__dirname, 'master_verified_leads.json');
fs.writeFileSync(outPath, JSON.stringify(allLeads, null, 2), 'utf8');
console.log('Saved', allLeads.length, 'verified leads to', outPath);
