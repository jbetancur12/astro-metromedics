import axios from 'axios';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import ControlPanel from './ControlPanel';
import Loader from './Loader';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;



function PDFViewer() {
  const [scale, setScale] = useState(1.0);
  const [pdfURL, setPdfURL] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const pdfFileURL = 'http://192.168.0.6:9000/first-bucket/1694293885386-56373cert-balanzacc-mcs-m-4624-23%20%282%29.pdf';

    axios.get(pdfFileURL, { responseType: 'blob' })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const objectURL = URL.createObjectURL(blob);
        console.log("🚀 ~ file: Pdf.tsx:17 ~ .then ~ objectURL:", objectURL)
        setPdfURL(objectURL);
      })
      .catch((error) => {
        console.error('Error al descargar el PDF:', error);
        console.log('Respuesta completa del error:', error.response);
      });
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoading(false);
  }
  return (
    <div>
      {pdfURL && (
        <>
      <Loader isLoading={isLoading} />
      <section
        id="pdf-section"
        className="d-flex flex-column align-items-center w-100"
      >
        <ControlPanel
          scale={scale}
          setScale={setScale}
          numPages={numPages}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          file={pdfURL}
        />
        <Document
          file={pdfURL}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </section>
      </>
      )}
    </div>
  );
}

export default PDFViewer;
