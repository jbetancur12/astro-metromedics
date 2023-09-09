import { useState } from 'react';

function FileUploadForm() {
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comprueba si se ha seleccionado un archivo
    if (!selectedFile) {
      alert('Selecciona un archivo PDF antes de enviar.');
      return;
    }

    // Crea un objeto FormData para enviar los datos al servidor
    const formData = new FormData();
    formData.append('name', name);
    formData.append('pdf', selectedFile);

    console.log("🚀 ~ file: form.jsx:26 ~ handleSubmit ~ formData:", formData.getAll("name"))
    // En este punto, puedes enviar formData a tu API utilizando fetch o una biblioteca como Axios
    // try {
    //   const response = await fetch('URL_DE_TU_API', {
    //     method: 'POST',
    //     body: formData,
    //   });

    //   if (response.ok) {
    //     alert('Archivo enviado exitosamente.');
    //     // Limpia el formulario después de enviar
    //     setName('');
    //     setSelectedFile(null);
    //   } else {
    //     alert('Error al enviar el archivo.');
    //   }
    // } catch (error) {
    //   console.error('Error en la solicitud:', error);
    // }
  };

  return (
    <div>
      <h2>Formulario de Subida de PDF</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div>
          <label>Subir PDF:</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <button type="submit">Enviar</button>
        </div>
      </form>
    </div>
  );
}

export default FileUploadForm;
