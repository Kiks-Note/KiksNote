import React, { useEffect, useState } from 'react';

function PdfGenerator() {
    const [downloadLink, setDownloadLink] = useState('');

    const generatePdf = async () => {
        try {
            const response = await fetch('http://localhost:5050/inventory/pdfGenerator');
            console.log('Réponse du serveur :', response);

            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            setDownloadLink(downloadUrl);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF :', error);
        }
    };

    useEffect(() => {
        generatePdf();
    }, []);

    return (
        <div>
            {downloadLink ? (
                <div>
                    <h1>Génération du PDF terminée.</h1>
                    <a href={downloadLink} download="inventory.pdf">Télécharger le PDF</a>
                </div>
            ) : (
                <h1>Génération du PDF en cours...</h1>
            )}
        </div>
    );
}

export default PdfGenerator;
