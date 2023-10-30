import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  Button,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import validateTaxDetails from "corporate-taxid-checker-js";

const countries = [
  { code: "AD", label: "Andorra" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "AL", label: "Albania" },
  { code: "AM", label: "Armenia" },
  { code: "AR", label: "Argentina" },
  { code: "AT", label: "Austria" },
  { code: "AU", label: "Australia" },
  { code: "AZ", label: "Azerbaijan" },
  { code: "BD", label: "Bangladesh" },
  { code: "BE", label: "Belgium" },
  { code: "BG", label: "Bulgaria" },
  { code: "BO", label: "Bolivia" },
  { code: "BR", label: "Brazil" },
  { code: "BY", label: "Belarus" },
  { code: "BZ", label: "Belize" },
  { code: "CA", label: "Canada" },
  { code: "CH", label: "Switzerland" },
  { code: "CL", label: "Chile" },
  { code: "CN", label: "China" },
  { code: "CO", label: "Colombia" },
  { code: "CR", label: "Costa Rica" },
  { code: "CY", label: "Cyprus" },
  { code: "CZ", label: "Czech Republic" },
  { code: "DE", label: "Germany" },
  { code: "DK", label: "Denmark" },
  { code: "DO", label: "Dominican Republic" },
  { code: "DZ", label: "Algeria" },
  { code: "EC", label: "Ecuador" },
  { code: "EE", label: "Estonia" },
  { code: "EG", label: "Egypt" },
  { code: "ES", label: "Spain" },
  { code: "FI", label: "Finland" },
  { code: "FR", label: "France" },
  { code: "FO", label: "Faroe Islands" },
  { code: "GB", label: "United Kingdom" },
  { code: "GE", label: "Georgia" },
  { code: "GH", label: "Ghana" },
  { code: "GN", label: "Guinea" },
  { code: "GR", label: "Greece" },
  { code: "GT", label: "Guatemala" },
  { code: "HK", label: "Hong Kong" },
  { code: "HR", label: "Croatia" },
  { code: "HU", label: "Hungary" },
  { code: "ID", label: "Indonesia" },
  { code: "IE", label: "Ireland" },
  { code: "IL", label: "Israel" },
  { code: "IN", label: "India" },
  { code: "IS", label: "Iceland" },
  { code: "IT", label: "Italy" },
  { code: "JP", label: "Japan" },
  { code: "KE", label: "Kenya" },
  { code: "KH", label: "Cambodia" },
  { code: "KR", label: "South Korea" },
  { code: "LI", label: "Liechtenstein" },
  { code: "LT", label: "Lithuania" },
  { code: "LU", label: "Luxembourg" },
  { code: "LV", label: "Latvia" },
  { code: "MA", label: "Morocco" },
  { code: "FR", label: "Monaco" },
  { code: "MD", label: "Moldova" },
  { code: "ME", label: "Montenegro" },
  { code: "MK", label: "North Macedonia" },
  { code: "MT", label: "Malta" },
  { code: "MX", label: "Mexico" },
  { code: "MY", label: "Malaysia" },
  { code: "NG", label: "Nigeria" },
  { code: "NL", label: "Netherlands" },
  { code: "NO", label: "Norway" },
  { code: "NZ", label: "New Zealand" },
  { code: "PE", label: "Peru" },
  { code: "PH", label: "Philippines" },
  { code: "PL", label: "Poland" },
  { code: "PT", label: "Portugal" },
  { code: "PY", label: "Paraguay" },
  { code: "RO", label: "Romania" },
  { code: "RS", label: "Serbia" },
  { code: "RU", label: "Russia" },
  { code: "RW", label: "Rwanda" },
  { code: "SA", label: "Saudi Arabia" },
  { code: "SE", label: "Sweden" },
  { code: "SG", label: "Singapore" },
  { code: "SI", label: "Slovenia" },
  { code: "SK", label: "Slovakia" },
  { code: "SM", label: "San Marino" },
  { code: "SV", label: "El Salvador" },
  { code: "TH", label: "Thailand" },
  { code: "TN", label: "Tunisia" },
  { code: "TR", label: "Turkey" },
  { code: "TW", label: "Taiwan" },
  { code: "UA", label: "Ukraine" },
  { code: "US", label: "United States" },
  { code: "UY", label: "Uruguay" },
  { code: "VE", label: "Venezuela" },
  { code: "VN", label: "Vietnam" },
  { code: "ZA", label: "South Africa" },
];

const App = () => {
  const [country, setCountry] = useState(null);
  const [taxId, setTaxId] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [onlineCheck, setOnlineCheck] = useState(false);
  const [logs, setLogs] = useState([]);
  const [debug, setDebug] = useState(false);

  const captureConsoleLogs = (callback) => {
    const originalLog = console.log;
    const newLogs = [];

    console.log = (...args) => {
        const formattedMessage = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
        originalLog(...args);
        newLogs.push(formattedMessage);
    };

    callback();

    console.log = originalLog;
    setLogs(newLogs);
};

  const handleSubmit = async () => {
    if (country && taxId) {
      captureConsoleLogs(async () => {
        const result = await validateTaxDetails(
          country.code,
          taxId,
          onlineCheck,
          debug
        );
        setValidationResult(result);
      });
    }
  };

  const handleClear = () => {
    setCountry(null);
    setTaxId('');
    setValidationResult(null);
    setLogs([]);
};

  return (
    <Box
      sx={{
        padding: "40px 20px 20px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Card variant="outlined" sx={{ maxWidth: "794px", width: "100%" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "10px",
            }}
          >
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option.label}
              onChange={(event, newValue) => setCountry(newValue)}
              sx={{ width: "25%" }}
              renderInput={(params) => (
                <TextField {...params} label="Select Country" fullWidth />
              )}
            />
            <TextField
    fullWidth
    label="Enter Tax ID"
    value={taxId}
    onChange={(e) => setTaxId(e.target.value)}
    sx={{ width: '50%' }}
/>
{validationResult ? (
    <Button variant="contained" color="secondary" onClick={handleClear}>
        Clear
    </Button>
) : (
    <Button variant="contained" color="primary" onClick={handleSubmit}>
        Validate
    </Button>
)}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={onlineCheck}
                  onChange={(e) => setOnlineCheck(e.target.checked)}
                />
              }
              label="Online Check"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={debug}
                  onChange={(e) => setDebug(e.target.checked)}
                />
              }
              label="Debug"
            />
          </Box>
          {validationResult && (
            <Box sx={{ marginTop: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Check</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Overall Validity</TableCell>
                    <TableCell>
                      {validationResult.isValid ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Regex Valid</TableCell>
                    <TableCell>
                      {validationResult.regexValid ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                    </TableCell>
                  </TableRow>
                  {validationResult.checkSumCheckPresent && (
                    <TableRow>
                      <TableCell>Checksum</TableCell>
                      <TableCell>
                        {validationResult.checkSum ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                  {validationResult.onnlineCheckPresent && (
                    <TableRow>
                      <TableCell>Online Check</TableCell>
                      <TableCell>
                        {validationResult.onlineCheck ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
          {debug && (
            <Box
              sx={{
                marginTop: "20px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <div>Logs:</div>
              {logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default App;
