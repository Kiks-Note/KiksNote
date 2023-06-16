const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generatePDF(inventoryData, res) {
    console.log('La fonction generatePDF est appelée.');
    console.log('Inventory Data:', inventoryData);

    const doc = new PDFDocument();
    doc.text('INVENTAIRE', { size: 20 });
    doc.text('---------------------------------------');

    inventoryData.forEach(item => {
        const createdAt = item.createdAt.toDate().toLocaleDateString();
        const acquisitiondate = item.acquisitiondate.toDate().toLocaleDateString();

        doc
            .fontSize(12)
            .text(`ID: ${item.id}`, { align: 'left' })
            .text(`Label: ${item.label}`, { align: 'left' })
            .text(`Categorie: ${item.category}`, { align: 'left' })
            .text(`Crée le: ${createdAt}`, { align: 'left' })
            .text(`Date d'acquisition: ${acquisitiondate}`, { align: 'left' })
            .text(`Campus: ${item.campus}`, { align: 'left' })
            .text(`Condition: ${item.condition}`, { align: 'left' })
            .text(`Référence: ${item.reference}`, { align: 'left' })
            .text(`Stockage: ${item.storage}`, { align: 'left' })
            .text(`Description: ${item.description}`, { align: 'left' })
            .text(`Prix: ${item.price}`, { align: 'left' })
            .text('---------------------------------------');
    });

    console.log('Avant d\'envoyer le PDF.');

    res.setHeader('Content-Disposition', 'attachment; filename="inventory.pdf"');
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);
    doc.end();
}

module.exports = generatePDF;
