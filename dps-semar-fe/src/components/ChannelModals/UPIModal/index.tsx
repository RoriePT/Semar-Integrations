import { Box, Button, Checkbox, Flex, Switch, Text, TextInput, FileInput, Loader } from "@mantine/core";
import { validatePattern, ValidateVPA } from "bhimupijs";
import React, { useEffect, useState } from "react";
import MobileNumberInput from "../../Common/ChangePassword/MobileNumberInput/Index";
import { notifications } from "@mantine/notifications";
import QrScanner from "qr-scanner";
import { FaCheck, FaTrash } from "react-icons/fa";
import { RiCloseLargeLine } from "react-icons/ri";

interface UPIFormData {
  upiId: string;
  mobile: string;
  email: string;
  isBusinessUpi?: boolean;
  channelIndex?: number;
  type?: string;
  beneficiaryName?: string;
  title?: string;
  enabled?: boolean;
  tr?: string;
}

interface UPIModalProps {
  opened: boolean;
  handlers: { close: () => void; open: () => void };
  handleSubmit: (data: UPIFormData) => void;
  initialData?: UPIFormData;
  businessUpi?: boolean;
  channelIndex: number;
  setChannelIndex?: (index: number) => void;
  forUpiVendor?: boolean;
  disableTitleAndUpiId?: boolean;
  isPreserved?: boolean;
  hasReceivedPayin?: boolean;
}

const UPIModal: React.FC<UPIModalProps> = ({
  opened,
  handlers,
  handleSubmit,
  initialData = {
    upiId: "",
    mobile: "",
    email: "",
    beneficiaryName: "",
    isBusinessUpi: false,
  },
  businessUpi = false,
  setChannelIndex,
  channelIndex,
  forUpiVendor = false,
  disableTitleAndUpiId = false,
  isPreserved = false,
  hasReceivedPayin = false,
}) => {
  const [title, setTitle] = useState<string>(initialData.title || "");
  const [upiId, setUpiId] = useState<string>(initialData.upiId);
  const [mobile, setMobile] = useState<string>(initialData.mobile);
  const [email, setEmail] = useState<string>(initialData.email);
  const [beneficiaryName, setBeneficiaryName] = useState<string>("");
  const [isBusinessUpi, setIsBusinessUpi] = useState<boolean>(
    forUpiVendor ? true : initialData.isBusinessUpi || false
  );
  const [enabled, setEnabled] = useState<boolean>(
    forUpiVendor
      ? initialData.enabled !== undefined
        ? initialData.enabled
        : true
      : true
  );
  const [errors, setErrors] = useState<{
    title?: string;
    upiId?: string;
    mobile?: string;
    email?: string;
    beneficairyName?: string;
    qrCode?: string;
  }>({});
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [qrCodeFullUrl, setQrCodeFullUrl] = useState<string | null>(null);
  const [trValue, setTrValue] = useState<string>("");
  const [isScanningQr, setIsScanningQr] = useState<boolean>(false);

  useEffect(() => {
    if (opened) {
      setTitle(initialData.title || "");
      setUpiId(initialData.upiId || "");
      setMobile(initialData.mobile || "");
      setEmail(initialData.email || "");
      setIsBusinessUpi(
        forUpiVendor ? true : initialData.isBusinessUpi || false
      );
      setBeneficiaryName(initialData.beneficiaryName || "");
      if (forUpiVendor) {
        setEnabled(
          initialData.enabled !== undefined ? initialData.enabled : true
        );
      }
      // Reset QR code related state when modal opens (only for new entries)
      if (!disableTitleAndUpiId) {
        setQrCodeFile(null);
        if (qrCodePreview) {
          URL.revokeObjectURL(qrCodePreview);
        }
        setQrCodePreview(null);
        setQrCodeFullUrl(null);
        setTrValue("");
      }
    }
  }, [initialData, forUpiVendor, opened, disableTitleAndUpiId]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (qrCodePreview) {
        URL.revokeObjectURL(qrCodePreview);
      }
    };
  }, [qrCodePreview]);

  const validateUPI = (vpa: string): string | null => {
    const validationResult: ValidateVPA = validatePattern(vpa);
    if (!validationResult.isQueryPatternValid) {
      return "Invalid UPI ID format.";
    }
    return null;
  };

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const validateQrCodeUrl = (url: string): boolean => {
    if (!url) return false;
    // Check if URL contains 'tr' parameter
    // Handle both standard URLs and UPI URLs (upi://pay?pa=...&tr=...)
    try {
      // Extract query string part
      const queryString = url.includes('?') ? url.split('?')[1] : '';
      if (!queryString) return false;
      
      // Parse parameters
      const params = new URLSearchParams(queryString);
      const hasTr = params.has('tr') && params.get('tr') !== '';
      
      return hasTr;
    } catch (error) {
      // Fallback: simple string check
      const hasTr = url.includes('&tr=') || url.includes('?tr=');
      return hasTr;
    }
  };

  const handleRemoveQrCode = () => {
    setQrCodeFile(null);
    if (qrCodePreview) {
      URL.revokeObjectURL(qrCodePreview);
    }
    setQrCodePreview(null);
    setQrCodeFullUrl(null);
    setTrValue("");
    setUpiId("");
    setErrors((prev) => ({ ...prev, qrCode: undefined, upiId: undefined }));
  };

  const handleQrCodeUpload = async (file: File | null) => {
    if (!file) {
      handleRemoveQrCode();
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        qrCode: "Please upload a valid image file.",
      }));
      setQrCodeFile(null);
      return;
    }

    setQrCodeFile(file);
    setIsScanningQr(true);
    setErrors((prev) => ({ ...prev, qrCode: undefined }));

    try {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setQrCodePreview(previewUrl);

      // Scan the QR code
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      });

      if (result && result.data) {
        // Store the full QR code URL/data
        const fullUrl = result.data.trim();
        setQrCodeFullUrl(fullUrl);

        // Extract URL from QR code data
        // QR code data might be a UPI payment URL (e.g., upi://pay?pa=...)
        // or just the UPI ID itself
        let extractedUrl = fullUrl;

        // Extract tr parameter from the URL
        let extractedTr = "";
        try {
          const queryString = fullUrl.includes('?') ? fullUrl.split('?')[1] : '';
          if (queryString) {
            const params = new URLSearchParams(queryString);
            extractedTr = params.get('tr') || "";
          }
        } catch (error) {
          // Fallback: simple regex match
          const trMatch = fullUrl.match(/[?&]tr=([^&]+)/);
          if (trMatch && trMatch[1]) {
            extractedTr = decodeURIComponent(trMatch[1]);
          }
        }
        setTrValue(extractedTr);

        // If it's a UPI payment URL, try to extract the UPI ID
        // Format: upi://pay?pa=<upi_id>&pn=...
        const upiMatch = extractedUrl.match(/pa=([^&]+)/);
        if (upiMatch && upiMatch[1]) {
          extractedUrl = decodeURIComponent(upiMatch[1]);
        }

        setUpiId(extractedUrl);
        setErrors((prev) => ({ ...prev, qrCode: undefined, upiId: undefined }));
      } else {
        throw new Error("No data found in QR code");
      }
    } catch (error: any) {
      console.error("Error scanning QR code:", error);
      const errorMessage = error?.message || "Failed to scan QR code";
      setErrors((prev) => ({
        ...prev,
        qrCode: errorMessage.includes("No QR code") 
          ? "No QR code found in the image. Please upload a valid QR code."
          : "Failed to scan QR code. Please ensure the image contains a valid QR code.",
      }));
      setQrCodeFile(null);
      if (qrCodePreview) {
        URL.revokeObjectURL(qrCodePreview);
      }
      setQrCodePreview(null);
      setQrCodeFullUrl(null);
      setTrValue("");
      setUpiId("");
      notifications.show({
        title: "Error",
        message: "Failed to scan QR code. Please try again with a clear image.",
        color: "red",
      });
    } finally {
      setIsScanningQr(false);
    }
  };

  const handleSave = () => {
    let isVerified = true;

    // For UPI vendor, only validate title and UPI ID if not disabled
    if (forUpiVendor) {
      if (!disableTitleAndUpiId) {
        if (!title) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            title: "Title is required.",
          }));
          isVerified = false;
        }

        // Validate QR code URL if it exists
        if (qrCodeFullUrl && !validateQrCodeUrl(qrCodeFullUrl)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            qrCode: "Transaction Reference (tr) missing",
          }));
          isVerified = false;
        }

        const upiIdError = !upiId ? "Please enter UPI ID" : "";
        setErrors((prevErrors) => ({
          ...prevErrors,
          upiId: upiIdError,
        }));

        if (upiIdError) {
          isVerified = false;
        } else {
          const errorMessage = validateUPI(upiId);
          if (errorMessage) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              upiId: errorMessage,
            }));
            isVerified = false;
          }
        }
      }
    } else {
      // Original validation for non-UPI vendor context
      if (!mobile) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          mobile: "Mobile number is required.",
        }));
        isVerified = false;
      } else if (!/^\d{10}$/.test(mobile.toString())) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          mobile: "Mobile number must be exactly 10 digits (numbers only).",
        }));
        isVerified = false;
      }

      if (!email) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email is required.",
        }));
        isVerified = false;
      } else {
        const emailError = validateEmail(email);
        if (emailError) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: emailError,
          }));
          isVerified = false;
        }
      }

      const upiIdError = !upiId ? "Please enter UPI ID" : "";
      setErrors((prevErrors) => ({
        ...prevErrors,
        upiId: upiIdError,
      }));

      if (upiIdError) {
        isVerified = false;
      } else {
        const errorMessage = validateUPI(upiId);
        if (errorMessage) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            upiId: errorMessage,
          }));
          isVerified = false;
        }
      }
    }

    if (isVerified) {
      if (forUpiVendor) {
        // When editing, preserve the existing channelIndex; otherwise increment
        const isEditing = initialData?.channelIndex !== undefined && initialData?.channelIndex !== null;
        const finalChannelIndex = isEditing ? initialData.channelIndex : channelIndex + 1;
        
        // When fields are disabled, use initialData values to ensure we have the correct data
        const finalTitle = disableTitleAndUpiId && initialData?.title ? initialData.title : title;
        const finalUpiId = disableTitleAndUpiId && initialData?.upiId ? initialData.upiId : upiId;
        
        if (!isEditing) {
          setChannelIndex && setChannelIndex(channelIndex + 1);
        }
        
        handleSubmit({
          title: finalTitle,
          upiId: finalUpiId,
          mobile: "", // Empty for UPI vendor
          email: "", // Empty for UPI vendor
          isBusinessUpi: true, // Always true for UPI vendor
          channelIndex: finalChannelIndex,
          type: "upi",
          beneficiaryName: "", // Empty for UPI vendor
          enabled: enabled, // Enabled toggle value
          tr: trValue, // Transaction Reference from QR code
        });
        // Don't close here - let handleAddUpi close the modal after state update
      } else {
        setChannelIndex && setChannelIndex(channelIndex + 1);
        handleSubmit({
          upiId,
          mobile,
          email,
          isBusinessUpi,
          channelIndex: channelIndex + 1,
          type: "upi",
          beneficiaryName,
        });
        handlers.close();
      }
    }
  };

  return (
    // <Modal centered opened={opened} onClose={handlers.close} title="Add UPI">
    <Box mb="md">
      <Flex direction="column" gap="lg">
        {forUpiVendor ? (
          <>
            <TextInput
              label="Title"
              placeholder="Add Title"
              withAsterisk
              error={errors.title}
              value={title}
              disabled={disableTitleAndUpiId}
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
              spellCheck={false}
              onChange={(e) => {
                setTitle(e.currentTarget.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
            />
            {!disableTitleAndUpiId ? (
              <>
                <FileInput
                  label="Upload QR Code"
                  placeholder="Click to upload QR code image"
                  accept="image/*"
                  withAsterisk
                  value={qrCodeFile}
                  onChange={handleQrCodeUpload}
                  error={errors.qrCode}
                  leftSection={isScanningQr ? <Loader size="xs" /> : null}
                  disabled={isScanningQr}
                />
                {qrCodePreview && (
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginTop: "8px",
                      gap: "8px",
                    }}
                  >
                    <Box style={{ position: "relative", display: "inline-block" }}>
                      <img
                        src={qrCodePreview}
                        alt="QR Code Preview"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          border: "1px solid #dee2e6",
                          borderRadius: "8px",
                        }}
                      />
                      <Button
                        variant="filled"
                        color="red"
                        size="xs"
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          minWidth: "auto",
                          width: "28px",
                          height: "28px",
                          padding: "0",
                          borderRadius: "50%",
                        }}
                        onClick={handleRemoveQrCode}
                        title="Remove QR code"
                      >
                        <FaTrash size={12} />
                      </Button>
                    </Box>
                    {qrCodeFullUrl && (() => {
                      const isValid = validateQrCodeUrl(qrCodeFullUrl);
                      return (
                        <Box
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            backgroundColor: isValid ? "#d4edda" : "#f8d7da",
                            borderRadius: "4px",
                            border: `2px solid ${isValid ? "#28a745" : "#dc3545"}`,
                          }}
                        >
                          <Flex align="center" gap="xs">
                            {isValid ? (
                              <>
                                <FaCheck size={16} color="#28a745" />
                                <Text 
                                  size="sm" 
                                  fw={500}
                                  c="green.7"
                                >
                                  QR Code is valid
                                </Text>
                              </>
                            ) : (
                              <>
                                <RiCloseLargeLine size={16} color="#dc3545" />
                                <Text
                                  size="sm"
                                  c="red.7"
                                  fw={500}
                                >
                                  Invalid or unsupported QR
                                </Text>
                              </>
                            )}
                          </Flex>
                        </Box>
                      );
                    })()}
                  </Box>
                )}
                <TextInput
                  label="UPI ID"
                  placeholder="UPI ID will be extracted from QR code"
                  withAsterisk
                  error={errors.upiId}
                  value={upiId}
                  readOnly
                  style={{
                    backgroundColor: "#f8f9fa",
                    cursor: "not-allowed",
                  }}
                />
              </>
            ) : (
              <TextInput
                label="UPI ID"
                placeholder="Add UPI id"
                withAsterisk
                error={errors.upiId}
                value={upiId}
                disabled={true}
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                spellCheck={false}
              />
            )}
            <Switch
              label="Enabled"
              checked={enabled}
              onChange={(e) => setEnabled(e.currentTarget.checked)}
            />
          </>
        ) : (
          <>
            <TextInput
              label="UPI ID"
              placeholder="Add UPI id"
              withAsterisk
              error={errors.upiId}
              value={upiId}
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
              spellCheck={false}
              onChange={(e) => {
                setUpiId(e.currentTarget.value);
                setErrors((prev) => ({ ...prev, upiId: undefined }));
              }}
            />
            <MobileNumberInput
              label="Mobile Number"
              withAsterisk
              value={mobile}
              onChange={(value) => {
                setMobile(`${value}`);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  mobile: undefined,
                }));
              }}
              error={errors.mobile}
            />
            <TextInput
              label="Email"
              placeholder="Add Email"
              withAsterisk
              error={errors.email}
              value={email}
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
              spellCheck={false}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  email: undefined,
                }));
              }}
            />
            <TextInput
              label="Beneficiary Name"
              placeholder="Add Beneficiary Name"
              error={errors.beneficairyName}
              value={beneficiaryName}
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
              spellCheck={false}
              onChange={(e) => {
                setBeneficiaryName(e.currentTarget.value);
                setErrors((prev) => ({ ...prev, beneficiaryName: undefined }));
              }}
            />
            {businessUpi && (
              <Checkbox
                label="This is a Business UPI."
                checked={isBusinessUpi}
                onChange={(e) => setIsBusinessUpi(e.currentTarget.checked)}
              />
            )}
          </>
        )}
        {isPreserved && !enabled && (
          <Text size="sm" c="orange" fw={500}>
            This is a reserved UPI ID. Disabling this will result in using the next available UPI ID for upcoming payin orders.
          </Text>
        )}
        <Button 
          onClick={handleSave}
          disabled={
            forUpiVendor && 
            !disableTitleAndUpiId && 
            (
              (qrCodeFullUrl && !validateQrCodeUrl(qrCodeFullUrl)) ||
              !title ||
              !upiId ||
              !!errors.title ||
              !!errors.upiId ||
              !!errors.qrCode
            )
          }
        >
          Save
        </Button>
      </Flex>
    </Box>

    //</Modal>
  );
};

export default UPIModal;
