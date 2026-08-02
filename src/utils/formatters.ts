import { AppSettings, Expense, Income } from "../types";

export function formatCurrency(amount: number, settings: AppSettings): string {
  const symbol = settings.currencySymbol || "₹";
  const formatted = amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
  return `${symbol}${formatted}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return dateString;
  }
}

export function exportToCSV(expenses: Expense[], incomes: Income[], settings: AppSettings) {
  const headers = ["Type", "ID", "Title/Source", "Category", "Amount (" + settings.currency + ")", "Date", "Payment Method", "Notes"];
  
  const expenseRows = expenses.map(e => [
    "Expense",
    e.id,
    `"${e.title.replace(/"/g, '""')}"`,
    e.category,
    e.amount,
    e.date,
    e.paymentMethod || "",
    `"${(e.notes || "").replace(/"/g, '""')}"`
  ]);

  const incomeRows = incomes.map(i => [
    "Income",
    i.id,
    `"${i.source.replace(/"/g, '""')}"`,
    "Income",
    i.amount,
    i.date,
    "-",
    `"${(i.notes || "").replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(","), ...expenseRows.map(r => r.join(",")), ...incomeRows.map(r => r.join(","))].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Student_Expense_Report_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data: any) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Student_Tracker_Backup_${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generatePrintablePDFReport(expenses: Expense[], incomes: Income[], settings: AppSettings, profileName: string) {
  const totalExp = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalInc = incomes.reduce((acc, i) => acc + i.amount, 0);
  const balance = totalInc - totalExp;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Student Expense Statement - ${profileName}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1e293b; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px; }
          .title { font-size: 24px; font-weight: bold; color: #0f172a; }
          .subtitle { font-size: 14px; color: #64748b; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
          .stat-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
          .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
          .stat-value { font-size: 20px; font-weight: bold; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f1f5f9; text-align: left; padding: 10px; font-size: 12px; border-bottom: 2px solid #cbd5e1; }
          td { padding: 10px; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
          .footer { font-size: 12px; text-align: center; color: #94a3b8; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">🎓 Student Expense Statement</div>
            <div class="subtitle">Generated for: ${profileName} | Date: ${new Date().toLocaleDateString()}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: bold;">Student Expense Tracker</div>
            <div class="subtitle">Secure Financial Report</div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-label">Total Income</div>
            <div class="stat-value" style="color: #16a34a;">${formatCurrency(totalInc, settings)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Total Expenses</div>
            <div class="stat-value" style="color: #dc2626;">${formatCurrency(totalExp, settings)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Net Balance</div>
            <div class="stat-value" style="color: #2563eb;">${formatCurrency(balance, settings)}</div>
          </div>
        </div>

        <h3>Expense Transactions (${expenses.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Category</th>
              <th>Method</th>
              <th>Notes</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${expenses.map(e => `
              <tr>
                <td>${e.date}</td>
                <td><strong>${e.title}</strong></td>
                <td>${e.category}</td>
                <td>${e.paymentMethod || "-"}</td>
                <td>${e.notes || "-"}</td>
                <td style="text-align: right; font-weight: bold;">${formatCurrency(e.amount, settings)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <h3>Income Records (${incomes.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Notes</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${incomes.map(i => `
              <tr>
                <td>${i.date}</td>
                <td><strong>${i.source}</strong></td>
                <td>${i.notes || "-"}</td>
                <td style="text-align: right; font-weight: bold; color: #16a34a;">${formatCurrency(i.amount, settings)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          Generated automatically by Student Expense Tracker • Keep track, manage budgets & save smart!
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
