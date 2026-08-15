// Server-side twin of the admin page's "Excel (Year Summary)" button.
//
// Same sheet name, same columns and the same trailing TOTAL row as
// DataAdded.jsx → exportYear(), so the attachment is byte-for-byte the file a
// staff member would have downloaded by hand. A second "Added By" sheet is
// appended because the e-mail has no clickable breakdown of its own.

const XLSX = require('xlsx');

/**
 * @param {object} report  the object returned by buildYearReport()
 * @returns {{ filename: string, buffer: Buffer }}
 */
function buildYearWorkbook(report) {
  const { year, months, total, staffTotal, userTotal, staff } = report;

  const summarySheet = XLSX.utils.json_to_sheet([
    ...months.map((m) => ({
      Month: `${m.label} ${year}`,
      'Total Added': m.count,
      'Staff Added': m.staff,
      'User Added': m.user,
    })),
    {
      Month: `TOTAL ${year}`,
      'Total Added': total,
      'Staff Added': staffTotal,
      'User Added': userTotal,
    },
  ]);
  summarySheet['!cols'] = [{ wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];

  const staffSheet = XLSX.utils.json_to_sheet(
    staff.length
      ? staff.map((s, i) => ({ 'S.No': i + 1, 'Added By': s.name, Records: s.count }))
      : [{ 'S.No': '', 'Added By': 'No records in this year', Records: 0 }]
  );
  staffSheet['!cols'] = [{ wch: 8 }, { wch: 32 }, { wch: 12 }];

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, summarySheet, `Data Added ${year}`);
  XLSX.utils.book_append_sheet(book, staffSheet, 'Added By');

  return {
    filename: `DataAdded_${year}.xlsx`,
    buffer: XLSX.write(book, { bookType: 'xlsx', type: 'buffer' }),
  };
}

module.exports = { buildYearWorkbook };
