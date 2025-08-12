import { useAddProducerTaxData } from "@/hook/useAddProducerTaxData";
import { useDocumentTypes } from "@/hook/useDocumentTypes";
import { useEditProducerTaxData } from "@/hook/useEditProducerTaxData";
import { useProducerTaxData } from "@/hook/useProducerTaxData";
import { useUploadRut } from "@/hook/useUploadRut";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import FormInput from "../site/FormInput";
import FormSelect from "../site/FormSelect";
import { Button } from "../sub/button";
import { Input } from "../ui/input";

type ProfileBankingInformationProps = {
  close: () => void;
  producerId: string;
};

const profileBankingInformationValidationSchema = Yup.object().shape({
  companyName: Yup.string().required("El nombre de la empresa es requerido"),
  documentTypeId: Yup.string().required("El tipo de documento es requerido"),
  numberDocument: Yup.string().required("El número de documento es requerido"),
});

const ProfileBankingInformation = ({
  close,
  producerId,
}: ProfileBankingInformationProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    taxData,
    loading: loadingTaxData,
    fetchTaxData,
    error: errorTaxData,
  } = useProducerTaxData(producerId);

  const {
    uploadRut,
    loading: loadingUploadRut,
    url,
    error: errorUploadRut,
  } = useUploadRut();
  const {
    saveTaxData,
    loading: loadingSaveTaxData,
    message,
    error: errorSaveTaxData,
  } = useAddProducerTaxData();
  const {
    updateTaxData,
    loading: loadingUpdateTaxData,
    error: errorUpdateTaxData,
  } = useEditProducerTaxData(fetchTaxData);

  const isLoading =
    loadingTaxData ||
    loadingUploadRut ||
    loadingSaveTaxData ||
    loadingUpdateTaxData;

  const {
    documentTypes,
    loading: loadingDocumentTypes,
    error: errorDocumentTypes,
  } = useDocumentTypes();

  const initialValues = {
    companyName: taxData?.legal_name || "",
    numberDocument: taxData?.document_id || "",
    documentTypeId: taxData?.document_type_id || "",
    idNumberDocument: taxData?.div || "",
    pdfData: taxData?.rut || "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    if (!selectedFile && !taxData?.rut) {
      console.log("⚠️ No se ha seleccionado un archivo.");
      return;
    }

    let uploadedRut: string | null = taxData?.rut || null;

    if (selectedFile) {
      const response = await uploadRut(producerId, selectedFile);

      if (!response || response.error) {
        return;
      }

      uploadedRut = response.url || null;
    }
    const taxDataPayload = {
      producer_id: producerId,
      document_type_id: values.documentTypeId,
      document_id: values.numberDocument,
      div: values.idNumberDocument,
      legal_name: values.companyName,
      rut: uploadedRut || "",
    };

    if (taxData) {
      await updateTaxData(taxData.id!, taxDataPayload);
    } else {
      await saveTaxData(taxDataPayload);
    }
    close();
  };

  const options = documentTypes.map((documentType) => ({
    label: documentType.name,
    value: documentType.id,
  }));

  return (
    <div className="flex w-full flex-col items-start gap-4">
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <p>Cargando...</p>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={profileBankingInformationValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="flex w-full flex-col gap-8">
              <FormInput
                label="Nombre o Razón social"
                name="companyName"
                helpText="Esta información es privada y no se mostrará públicamente."
              />
              <FormSelect
                label="Tipo de documento"
                name="documentTypeId"
                options={options}
                helpText="Este información es privada."
              />
              <div className="flex w-full gap-4">
                <FormInput
                  label="Número de documento"
                  name="numberDocument"
                  helpText="Este información es privada."
                />
                <div className="w-10">
                  <FormInput label="Div" name="idNumberDocument" />
                </div>
              </div>
              <div className="flex w-full flex-col gap-1.5">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <label htmlFor="picture">Rut</label>
                  <Input
                    id="pdfData"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0] || null;
                      setFieldValue("pdfData", file);
                      setSelectedFile(file);
                      console.log(
                        "📁 Archivo seleccionado en input:",
                        file?.name
                      );
                    }}
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-400">
                      📁 Archivo: {selectedFile.name}
                    </p>
                  )}
                  {taxData?.rut && (
                    <p className="text-sm text-gray-400">
                      📁 Archivo: {taxData?.rut}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-wrap items-center justify-end gap-2">
                <Button variant="neutral-secondary" onClick={close}>
                  Cancelar
                </Button>
                <div className="flex items-center justify-end gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Confirmar"}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default ProfileBankingInformation;
