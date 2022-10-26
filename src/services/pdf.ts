import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export const exportToPDF = (head: any, body: any, fileName: string) => {
  const doc = new jsPDF();
  autoTable(doc, {head, body });
  doc.save(fileName)
}
