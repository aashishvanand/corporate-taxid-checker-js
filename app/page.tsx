"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Box,
  Paper,
  Chip,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Collapse,
  Alert,
  Stack,
  IconButton,
  useMediaQuery,
  Divider,
  Link,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import BugReportIcon from "@mui/icons-material/BugReport";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  validateTaxId,
  getSupportedCountries,
  getTaxIdInfo,
  type TaxIdValidationResult,
  type TaxIdTypeInfo,
} from "corporate-taxid-checker-js";

const COUNTRY_NAMES: Record<string, string> = {
  AD: "Andorra", AE: "United Arab Emirates", AG: "Antigua and Barbuda",
  AL: "Albania", AM: "Armenia", AO: "Angola", AR: "Argentina", AT: "Austria",
  AU: "Australia", AZ: "Azerbaijan", BA: "Bosnia and Herzegovina",
  BB: "Barbados", BD: "Bangladesh", BE: "Belgium", BF: "Burkina Faso",
  BG: "Bulgaria", BH: "Bahrain", BM: "Bermuda", BO: "Bolivia", BR: "Brazil",
  BS: "Bahamas", BW: "Botswana", BY: "Belarus", BZ: "Belize", CA: "Canada",
  CD: "Congo (DRC)", CG: "Congo", CH: "Switzerland", CI: "Côte d'Ivoire",
  CL: "Chile", CM: "Cameroon", CN: "China", CO: "Colombia", CR: "Costa Rica",
  CV: "Cape Verde", CW: "Curaçao", CY: "Cyprus", CZ: "Czech Republic",
  DE: "Germany", DJ: "Djibouti", DK: "Denmark", DM: "Dominica",
  DO: "Dominican Republic", DZ: "Algeria", EC: "Ecuador", EE: "Estonia",
  EG: "Egypt", ES: "Spain", ET: "Ethiopia", FI: "Finland", FJ: "Fiji",
  FR: "France", GA: "Gabon", GB: "United Kingdom", GE: "Georgia",
  GH: "Ghana", GM: "Gambia", GR: "Greece", GT: "Guatemala", GY: "Guyana",
  HK: "Hong Kong", HN: "Honduras", HR: "Croatia", HU: "Hungary",
  ID: "Indonesia", IE: "Ireland", IL: "Israel", IN: "India", IQ: "Iraq",
  IS: "Iceland", IT: "Italy", JM: "Jamaica", JO: "Jordan", JP: "Japan",
  KE: "Kenya", KH: "Cambodia", KR: "South Korea", KW: "Kuwait",
  KZ: "Kazakhstan", LA: "Laos", LB: "Lebanon", LC: "Saint Lucia",
  LI: "Liechtenstein", LK: "Sri Lanka", LT: "Lithuania", LU: "Luxembourg",
  LV: "Latvia", MA: "Morocco", MC: "Monaco", MD: "Moldova", ME: "Montenegro",
  MG: "Madagascar", MK: "North Macedonia", ML: "Mali", MM: "Myanmar",
  MN: "Mongolia", MO: "Macao", MT: "Malta", MU: "Mauritius", MW: "Malawi",
  MX: "Mexico", MY: "Malaysia", MZ: "Mozambique", NA: "Namibia",
  NE: "Niger", NG: "Nigeria", NI: "Nicaragua", NL: "Netherlands",
  NO: "Norway", NP: "Nepal", NZ: "New Zealand", OM: "Oman", PA: "Panama",
  PE: "Peru", PG: "Papua New Guinea", PH: "Philippines", PK: "Pakistan",
  PL: "Poland", PT: "Portugal", PY: "Paraguay", QA: "Qatar", RO: "Romania",
  RS: "Serbia", RU: "Russia", RW: "Rwanda", SA: "Saudi Arabia",
  SC: "Seychelles", SE: "Sweden", SG: "Singapore", SI: "Slovenia",
  SK: "Slovakia", SL: "Sierra Leone", SM: "San Marino", SN: "Senegal",
  SV: "El Salvador", TG: "Togo", TH: "Thailand", TN: "Tunisia",
  TR: "Turkey", TT: "Trinidad and Tobago", TW: "Taiwan", TZ: "Tanzania",
  UA: "Ukraine", UG: "Uganda", US: "United States", UY: "Uruguay",
  UZ: "Uzbekistan", VC: "St. Vincent & Grenadines", VE: "Venezuela",
  VN: "Vietnam", ZA: "South Africa", ZM: "Zambia", ZW: "Zimbabwe",
};

function getCountryFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

interface CountryOption {
  code: string;
  label: string;
  flag: string;
}

function StatusIcon({ value, present }: { value: boolean; present?: boolean }) {
  if (present === false) {
    return <RemoveCircleOutlineIcon sx={{ color: "text.disabled" }} />;
  }
  return value ? (
    <CheckCircleIcon sx={{ color: "success.main" }} />
  ) : (
    <CancelIcon sx={{ color: "error.main" }} />
  );
}

export default function Home() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDark);
  const [country, setCountry] = useState<CountryOption | null>(null);
  const [taxId, setTaxId] = useState("");
  const [onlineCheck, setOnlineCheck] = useState(false);
  const [debug, setDebug] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TaxIdValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [countryInfo, setCountryInfo] = useState<TaxIdTypeInfo[] | null>(null);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#6366f1" },
          secondary: { main: "#ec4899" },
          background: darkMode
            ? { default: "#0f172a", paper: "#1e293b" }
            : { default: "#f8fafc", paper: "#ffffff" },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily:
            '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: { textTransform: "none", fontWeight: 600 },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const countries: CountryOption[] = useMemo(() => {
    return getSupportedCountries().map((code) => ({
      code,
      label: COUNTRY_NAMES[code] || code,
      flag: getCountryFlag(code),
    }));
  }, []);

  useEffect(() => {
    if (country) {
      const info = getTaxIdInfo(country.code);
      if (Array.isArray(info)) {
        setCountryInfo(info);
      } else {
        setCountryInfo(null);
      }
    } else {
      setCountryInfo(null);
    }
  }, [country]);

  const handleValidate = async () => {
    if (!country || !taxId.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);
    setDebugLogs([]);

    // Capture console.log for debug output
    const logs: string[] = [];
    const originalLog = console.log;
    if (debug) {
      console.log = (...args: unknown[]) => {
        logs.push(args.map(String).join(" "));
        originalLog(...args);
      };
    }

    try {
      const res = await validateTaxId(
        country.code,
        taxId.trim(),
        onlineCheck,
        debug
      );
      if (typeof res === "string") {
        setError(res);
      } else {
        setResult(res);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Validation failed");
    } finally {
      if (debug) {
        console.log = originalLog;
        setDebugLogs(logs);
      }
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCountry(null);
    setTaxId("");
    setResult(null);
    setError(null);
    setDebugLogs([]);
    setCountryInfo(null);
  };

  const handleCopyResult = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: darkMode
            ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f8fafc 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                Tax ID Checker
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Validate corporate tax IDs across 131 countries
              </Typography>
            </Box>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={{
                bgcolor: "action.hover",
                "&:hover": { bgcolor: "action.selected" },
              }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>

          {/* Main Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: 1,
              borderColor: "divider",
            }}
          >
            <Stack spacing={2.5}>
              {/* Country Selector */}
              <Autocomplete
                value={country}
                onChange={(_, val) => {
                  setCountry(val);
                  setResult(null);
                  setError(null);
                }}
                options={countries}
                getOptionLabel={(opt) => `${opt.flag} ${opt.label} (${opt.code})`}
                renderOption={(props, opt) => {
                  const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
                  return (
                    <li key={key} {...rest}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <span style={{ fontSize: "1.25rem" }}>{opt.flag}</span>
                        <span>{opt.label}</span>
                        <Chip label={opt.code} size="small" variant="outlined" />
                      </Box>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    placeholder="Search countries..."
                    fullWidth
                  />
                )}
                isOptionEqualToValue={(opt, val) => opt.code === val.code}
              />

              {/* Country Info Chips */}
              {countryInfo && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {countryInfo.map((info) => (
                    <Chip
                      key={info.type}
                      label={info.label}
                      size="small"
                      variant="outlined"
                      color={
                        info.hasChecksum && info.hasOnlineCheck
                          ? "success"
                          : info.hasChecksum
                          ? "primary"
                          : "default"
                      }
                      title={`Checksum: ${info.hasChecksum ? "Yes" : "No"} | Online: ${info.hasOnlineCheck ? "Yes" : "No"}`}
                    />
                  ))}
                </Box>
              )}

              {/* Tax ID Input */}
              <TextField
                label="Tax ID"
                value={taxId}
                onChange={(e) => {
                  setTaxId(e.target.value);
                  setResult(null);
                  setError(null);
                }}
                placeholder="Enter tax identification number"
                fullWidth
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleValidate();
                }}
              />

              {/* Options */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={onlineCheck}
                      onChange={(e) => setOnlineCheck(e.target.checked)}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2">Online Verification</Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={debug}
                      onChange={(e) => setDebug(e.target.checked)}
                      size="small"
                      color="secondary"
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <BugReportIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">Debug</Typography>
                    </Box>
                  }
                />
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  variant="contained"
                  onClick={handleValidate}
                  disabled={!country || !taxId.trim() || loading}
                  startIcon={<SearchIcon />}
                  sx={{ flex: 1 }}
                  size="large"
                >
                  {loading ? "Validating..." : "Validate"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  startIcon={<ClearIcon />}
                  size="large"
                >
                  Clear
                </Button>
              </Box>
            </Stack>

            {/* Error */}
            <Collapse in={!!error}>
              <Alert severity="error" sx={{ mt: 2.5 }}>
                {error}
              </Alert>
            </Collapse>

            {/* Result */}
            <Collapse in={!!result}>
              {result && (
                <Box sx={{ mt: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                    }}
                  >
                    <Chip
                      icon={
                        result.isValid ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )
                      }
                      label={result.isValid ? "VALID" : "INVALID"}
                      color={result.isValid ? "success" : "error"}
                      sx={{ fontWeight: 700, fontSize: "0.9rem" }}
                    />
                    <IconButton size="small" onClick={handleCopyResult} title="Copy JSON result">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {result.matchedLabel && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1.5 }}
                    >
                      Matched: {result.matchedLabel}{" "}
                      {result.matchedType && (
                        <Chip
                          label={result.matchedType}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 0.5 }}
                        />
                      )}
                    </Typography>
                  )}

                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, border: 0, pl: 0 }}>
                            Regex Format
                          </TableCell>
                          <TableCell align="right" sx={{ border: 0, pr: 0 }}>
                            <StatusIcon value={result.regexValid} />
                          </TableCell>
                        </TableRow>
                        {result.checkSumCheckPresent && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600, border: 0, pl: 0 }}>
                              Checksum
                            </TableCell>
                            <TableCell align="right" sx={{ border: 0, pr: 0 }}>
                              <StatusIcon value={result.checkSum} />
                            </TableCell>
                          </TableRow>
                        )}
                        {result.onlineCheckPresent && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600, border: 0, pl: 0 }}>
                              Online Authority
                            </TableCell>
                            <TableCell align="right" sx={{ border: 0, pr: 0 }}>
                              <StatusIcon
                                value={result.onlineCheck}
                                present={onlineCheck}
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Show all three if all present */}
                  {result.checkSumCheckPresent &&
                    result.onlineCheckPresent && (
                      <Alert
                        severity="info"
                        variant="outlined"
                        sx={{ mt: 1.5 }}
                      >
                        This country supports all three validation levels: regex,
                        checksum, and online authority check
                        {!onlineCheck && " (enable Online Verification to use it)"}.
                      </Alert>
                    )}
                </Box>
              )}
            </Collapse>

            {/* Debug Logs */}
            <Collapse in={debug && debugLogs.length > 0}>
              <Box sx={{ mt: 2.5 }}>
                <Divider sx={{ mb: 1.5 }} />
                <Typography
                  variant="subtitle2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 1,
                  }}
                >
                  <BugReportIcon fontSize="small" color="secondary" />
                  Debug Output
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    maxHeight: 250,
                    overflow: "auto",
                    bgcolor: darkMode ? "#0f172a" : "#f1f5f9",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    lineHeight: 1.6,
                  }}
                >
                  {debugLogs.map((log, i) => (
                    <Box key={i} sx={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                      {log}
                    </Box>
                  ))}
                </Paper>
              </Box>
            </Collapse>
          </Paper>

          {/* Footer */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Powered by{" "}
              <Link
                href="https://www.npmjs.com/package/corporate-taxid-checker-js"
                target="_blank"
                rel="noopener"
                underline="hover"
              >
                corporate-taxid-checker-js
              </Link>{" "}
              v2 — 131 countries, 60+ checksums, 24 online checks
            </Typography>
            <Box sx={{ mt: 1 }}>
              <IconButton
                href="https://github.com/AashishVanand/corporate-taxid-checker-js"
                target="_blank"
                size="small"
                color="inherit"
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
