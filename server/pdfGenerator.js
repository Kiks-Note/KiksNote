const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


function generatePDF(inventoryData, outputPath, res) {
    console.log('La fonction generatePDF est appelée.');
    console.log('Inventory Data:', inventoryData);

    const doc = new PDFDocument();
    doc.text('Inventaire', { size: 20 });
    doc.text('---------------------------------------');

    inventoryData.forEach(item => {
        doc.text(`Nom: ${item.name}`);
        doc.text(`Quantité: ${item.quantity}`);
        doc.text(`Prix: ${item.price}`);
        doc.text('---------------------------------------');
    });

    console.log('Avant d\'enregistrer le PDF.');

    doc.pipe(fs.createWriteStream(outputPath))
        .on('finish', () => {
            console.log('Le PDF a été enregistré avec succès.');
            res.sendFile(outputPath);
        });
    doc.end();
}

module.exports = generatePDF;
