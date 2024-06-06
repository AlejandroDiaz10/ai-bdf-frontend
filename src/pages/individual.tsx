import React, { useEffect } from 'react'
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AddPhotoAlternate, Delete } from '@mui/icons-material';
import { Divider, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { LoadingButton } from '@mui/lab';


export const Individual = () => {
  const [formData, setFormData] = React.useState({
    sender: "",  // Correo completo
    subject: "",
    attachment_count: "", // Cantidad de archivos adjuntos (string)
    extensions: "", // Separados por espacio
  });

  // Estado inicial para la respuesta y el error
  const [response, setResponse] = React.useState("");
  const [probs, setProbs] = React.useState("")
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false); // Para indicar que se está realizando la solicitud
  const [attachments, setAttachments] = React.useState<any[]>([]); 
  const [screenWidth, setScreenWidth] = React.useState(""); 


  const extensionsList = ['7z', 'bmp', 'btpqkd', 'cfqbr', 'com', 'coml', 'csv', 'db', 'dl', 'dlsgahx', 'doc', 'docx', 'dvbyngh', 'e', 'eml', 'emz', 'ftncpq', 'fuvmp', 'gif', 'gp', 'gpxjr', 'grnhj', 'htm', 'html', 'ics', 'itbcgkxg', 'jfif', 'jgntpdn', 'jpg', 'jpgx', 'kgxhfuk', 'kvewhp', 'lylner', 'mail', 'mixoobz', 'mhtml', 'mp3', 'mp4', 'mso', 'nmshd', 'one', 'p', 'pd', 'pdf', 'pkpass', 'png', 'pngx', 'ppt', 'pptx', 'pp', 'ptq', 'pwjeoj', 'pwplcw', 'qllj', 'qmujw', 'qnfjf', 'rar', 'rere', 'rlrf', 'rpmsg', 'rtf', 'rtpr', 'shtm', 'shtml', 'sap', 'tif', 'tiff', 'txt', 'udwp', 'vcf', 'veisus', 'vmbvuby', 'vbzjo', 'vcbv', 'wav', 'webp', 'wmz', 'xls', 'xlsb', 'xlsx', 'xlsm', 'xhtml', 'xjcqd', 'xla', 'xml', 'zibc', 'zcddgru', 'zfmxsw'];


  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddAttachment = () => {
    setAttachments([...attachments, { extension: '', quantity: 0 }]); // Añade un nuevo elemento vacío al arreglo (puedes modificar esto para manejar objetos si es necesario)
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index)); // Remueve el elemento en la posición 'index'
  };

  const handleAttachmentChange = (index: number, field: any, value: any) => {
    const newAttachments = [...attachments];
    newAttachments[index] = { ...newAttachments[index], [field]: value };
    setAttachments(newAttachments);
  };

  const handlePredict = async () => {
    // Calcula el total de attachments
    setIsLoading(true); // Inicia el indicador de carga
    setError(""); // Limpia el error si hubiera

    if(formData.sender === ""){
      setError("Sender field is required");
      setIsLoading(false);
      return;
    }

    const attachmentCount = attachments.reduce((acc, attachment) => acc + Number(attachment.quantity), 0);
  
    // Genera la lista de extensiones repetidas según quantity
    let extensions: any = [];
    attachments.forEach(attachment => {
      for (let i = 0; i < Number(attachment.quantity); i++) {
        extensions.push(attachment.extension);
      }
    });
  
    // Crea el objeto JSON a imprimir
    const jsonData = {
      sender: formData.sender,
      subject: formData.subject,
      attachment_count: String(attachmentCount), // Convertido a String
      extensions: extensions.join(' ') // Convirtiendo el array a string separado por espacios
    };
  
    // Imprime en consola
    console.log(jsonData);
  
    // Intenta enviar el dato al endpoint
    try {
      const response = await fetch('https://anteater-smiling-typically.ngrok-free.app/api/single-predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json(); // Suponiendo que la respuesta es en formato JSON
      if (data.class_prediction === "Spam"){
        setResponse("⛔️  Spam  ⛔️"); 
      } else {
        setResponse("✅  Not Spam  ✅");
      }
      setError(""); // Limpia el error si hubiera
      setProbs(data.class_probs);

      console.log('Response from the server:', data);
    } catch (error: any) {
      console.error('Error sending data:', error);
      setError(error.toString()); // Almacena el mensaje de error en el estado
    } finally {
      setIsLoading(false); // Finaliza el indicador de carga
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && window.innerWidth > 450) {
        setScreenWidth("medium");
      } else if (window.innerWidth <= 450) {
        setScreenWidth("small");
      } else {
        setScreenWidth("large");
      }
    }
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  } , []);


  return (
    <div 
    
    >
              <form
          // onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center"}}
        >
          <div style={{ display: "flex", width: "100%"}}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TextField
                label="Sender"
                variant="outlined"
                name="sender"
                error= {error === "Sender field is required"}
                helperText={error === "Sender field is required" ? "Sender field is required" : ""}
                value={formData.sender}
                onChange={handleChange}
                style={{ marginBottom: "20px", width: "100%"}}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                  style: {
                    color: "white",
                    borderColor: "white",
                    backgroundColor: "#323232",
                    borderRadius: "10px",
                  },
                }}
              
              />

              <TextField
                label="Email Subject"
                variant="outlined"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                style={{ marginBottom: "20px", width: "100%" }}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                  style: {
                    color: "white",
                    borderColor: "white",
                    backgroundColor: "#323232",
                    borderRadius: "10px",
                  },
                }}
              />
            </div>
            
          </div>
          {attachments.length > 0 && (
            <div 
            style={{ display: "flex", flexDirection: "column",marginTop: "20px", width: "100%", alignItems:"center", justifyContent:"center"}}
            
            >
              <h3 style={{ color: "#E0E0E0", marginBottom: "10px", fontSize:"20px" }}>Attachments</h3>
              <Divider variant="middle" style={{ backgroundColor: "#E0E0E0", marginBottom: "20px", width:"80%" }} />
            </div>
          )}
          {attachments.map((attachment, index) => (
            <div 
              key={index}  // Asegúrate de que key sea único y estable
              style={{ 
                marginBottom: "10px", 
                width: "100%", 
                display: 'flex', 
                justifyContent: 'space-between',
              }}
            >
              <FormControl fullWidth>
                <InputLabel id={`extension-label-${index}`} style={{ color: "white" }}>Extension</InputLabel>
                <Select
                  labelId={`extension-label-${index}`}
                  value={attachment.extension}
                  label="Extension"
                  onChange={(e) => handleAttachmentChange(index, 'extension', e.target.value)}
                  style={{ color: "white", backgroundColor: "#323232", marginBottom: '10px', borderRadius: "10px", }}
                >
                  {extensionsList.map((ext) => (
                    <MenuItem key={ext} value={ext}>{ext}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Quantity"
                type="number"
                value={attachment.quantity}
                onChange={(e) => handleAttachmentChange(index, 'quantity', e.target.value)}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                  style: {
                    color: "white",
                    backgroundColor: "#323232",
                    borderColor: "white",
                    borderRadius: "10px",
                  }
                }}
                style={{ width: "30%", margin: "0 10px" }}
              />
              <IconButton onClick={() => handleRemoveAttachment(index)} style={{ color: "white", height: "55px" }}>
                <Delete fontSize="inherit" />
              </IconButton>
            </div>
          ))}

          <Button
            variant="contained"
            startIcon={<AddPhotoAlternate />}
            onClick={handleAddAttachment}
            style={{ 
              marginTop: "10px", 
              width: screenWidth === "small" ? "100%" : "40%",
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
            Add Attachment
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
        </form>
        {response && (
          <div style={{ marginTop: "20px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h3 style={{ color: "#E0E0E0", marginBottom: "10px", fontSize:"20px" }}>
              Prediction Result
            </h3>
            <h2 style={{ color: "#E0E0E0", marginBottom: "-10px", fontSize:"50px" }}>
              {response}
            </h2>
            <h4 style={{ color: "#D0CECE", marginBottom: "10px", fontSize:"15px" }}>
              With a significance level of {probs}
            </h4>
          </div>
        )}

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
    </div>
  )
}
export default Individual