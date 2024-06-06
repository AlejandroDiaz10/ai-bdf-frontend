import React, { useEffect, useState } from 'react';
import './App.css';
import { Alert, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { AutoAwesome, CloudDone, FileUpload } from '@mui/icons-material';
import Individual from './pages/individual';
import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';


function App() {
  const [mode, setMode] = React.useState('individual'); 
  const [screenWidth, setScreenWidth] = useState(""); 
  const [file, setFile] = React.useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [response, setResponse] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleMode = (event: React.MouseEvent<HTMLElement>, newMode: string) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  // Función para manejar el cambio del archivo seleccionado
  const handleFileChange = (event: any) => {
    const file = event.target.files[0]; // Obtiene el archivo seleccionado
    if (file) {
      setFileName(file.name); // Actualiza el estado con el nombre del archivo
      setFile(file); // Actualiza el estado con el archivo
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handlePredict = async () => {
    setIsLoading(true);
    setError('');
  
    if (!file) {
      setError('No file selected');
      setIsLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('https://anteater-smiling-typically.ngrok-free.app/api/csv-predict', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.text(); // Intenta obtener información de error como texto
        throw new Error(errorData || 'Network response was not ok');
      }
  
      // Asume que la respuesta es un archivo en formato blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
  
      // Extrae la extensión del archivo y agrega '_SpamResults'
      const filename = file.name;
      const filenameParts = filename.split('.');
      const newName = filenameParts.slice(0, -1).join('.') + '_SpamResults.' + filenameParts.slice(-1);
      
      a.download = newName;
      document.body.appendChild(a);
      a.click();
      a.remove(); // Elimina el enlace una vez hecho el clic
      window.URL.revokeObjectURL(url); // Limpia la URL temporal
  
      setResponse('File successfully processed and downloaded.');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && window.innerWidth > 450) {
        setScreenWidth("65%");
      } else if (window.innerWidth <= 450) {
        setScreenWidth("80%");
      } else {
        setScreenWidth("40%");
      }
    };
  
    // Llamada inicial para establecer el ancho correcto al cargar
    handleResize();
  
    window.addEventListener("resize", handleResize);
    
    // Función de limpieza para eliminar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Dependencias vacías para que se ejecute solo al montar y desmontar el componente



  return (
    <div
      className="App"
      style={{
        backgroundColor: "#0F1214",
        height: "auto",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column", // Cambiamos a dirección de columna
        justifyContent: "center",
        alignItems: "center",
        padding: "20px 0",
      }}
    >
      <div style={{marginBottom: "30px"}}>
        <h1 style={{ color: "white", marginBottom: '3rem', fontSize:"40px" }}>Email Spam Detection</h1>
        <ToggleButtonGroup
          exclusive
          aria-label="Mode"
          value={mode}
          onChange={handleMode}
          sx={{
            backgroundColor: 'black', // Color de fondo del grupo de botones
            '& .MuiToggleButtonGroup-grouped': {
              color: 'white', // Color del texto
              borderColor: '#2D3032', // Color del borde
              '&.Mui-selected, &.Mui-selected:hover': {
                color: 'white', // Color del texto seleccionado
                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Color de fondo del botón seleccionado
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Color de fondo al pasar el mouse
              },
            },
          }}
          // onChange={handleChange} // Aquí puedes descomentar y usar tu función de manejo
        >
          <ToggleButton value="individual" sx={{textTransform: "none"}}>
            <AutoAwesome sx={{marginRight: "0.5rem"}} />
            Individual prediction
          </ToggleButton>
          <ToggleButton value="csv" sx={{textTransform: "none"}}>
            <FileUpload sx={{marginRight: "0.5rem"}} />
            Upload a CSV file
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      
      <div style={{
        width: screenWidth,
        
        }}>
        {mode === 'individual' ? (

          <Individual /> 

        ) : (

          <div>

            <Alert severity="info" style={{marginBottom: "20px"}}>
            <strong>Attention:</strong> The CSV file must be semicolon separated ( <strong>;</strong> ) and must contain the following columns: <strong>Email Subject</strong>, <strong>Email From</strong>, <strong>Attachment Extension</strong> and <strong>Attachment Count</strong>.
            </Alert>

            {fileName && ( 
              <div style={{ marginBottom: "10px", color: "white", fontSize: "16px", display: "flex", flexDirection: "column" }}>
                <div>
                  <CloudDone style={{color: "white", fontSize: "150px"}} />
                </div>
                <div style={{marginBottom: "20px"}}>
                File
                <span style={{fontWeight: "600", margin: "0 10px"}}>
                  {fileName}
                </span>
                successfully selected
              </div>
              </div>
            )}
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<FileUpload />}
              style={{ 
                marginTop: "10px", 
                width: screenWidth === "80%" ? "100%" : "40%", 
              }}
              sx={{
                textTransform: "none",
                backgroundColor: "#074FAD",
                borderRadius: "10px",
                fontSize: "18px",
                marginTop: "2rem",
                '&:hover': {
                  backgroundColor: "#08428C",
                },
              }}
            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={handleFileChange}/>
            </Button>
            <LoadingButton
              variant="contained"
              onClick={handlePredict}
              loading={isLoading}
              color="primary"
              style={{ marginTop: "10px", width: "100%" }}
              sx={{
                textTransform: "none",
                backgroundColor: "#419430",
                borderRadius: "10px",
                fontSize: "18px",
                marginTop: "2rem",
                '&:hover': {
                  backgroundColor: "#337126",
                },
                '&:disabled': {
                  backgroundColor: "#2D3032",
                },
                '.MuiCircularProgress-circle':{
                  color: "#C1C1C1",
                }
              }}
            >
              Predict
            </LoadingButton>

          {error && (
            <div style={{ marginTop: "20px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h3 style={{ color: "#E0E0E0", marginBottom: "10px", fontSize:"20px" }}>
                ❌ Prediction Error ❌
              </h3>
              <pre style={{ color: "#E0E0E0", backgroundColor: "#323232", padding: "10px", borderRadius: "10px", overflowX: "auto" }}>
                {error}
              </pre>
            </div>
          )}

          {response && (
            <div style={{ marginTop: "20px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h3 style={{ color: "#E0E0E0", marginBottom: "10px", fontSize:"20px" }}>
                ✅ Prediction Success ✅
              </h3>
              <pre style={{ color: "#E0E0E0", backgroundColor: "#323232", padding: "10px", borderRadius: "10px", overflowX: "auto" }}>
                📥 {response}
              </pre>
            </div>
          )}
          </div>

        )}

      </div>
    </div>

  );
}

export default App;
