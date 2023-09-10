import PrintIcon from '@mui/icons-material/Print';

const PDFPrinter = ({ file }) => {
  const print = () => {
    const pdfFrame = document.createElement('iframe');
    pdfFrame.style.visibility = 'hidden';
    pdfFrame.src = file;

    document.body.appendChild(pdfFrame);

    pdfFrame.contentWindow.focus();
    pdfFrame.contentWindow.print();
  };

  return (
    <PrintIcon className="cursor-pointer" onClick={print} title="Imprimir" />
  );
};

export default PDFPrinter;
