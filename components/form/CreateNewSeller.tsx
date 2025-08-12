"use client";
import { useSellers } from "@/hook/useSellers";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { HelpText } from "../site/HelpText";
import { PhoneInput } from "../site/PhoneInput";
import { Button } from "../sub/button";
import { IconWithBackground } from "../sub/IconWithBackground";

const phoneValidationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(
      /^\+57\d{10}$/,
      "Número de celular inválido. Debe incluir el prefijo +57."
    )
    .required("El número de celular es obligatorio"),
});

type CreateNewSellerProps = {
  producerId: string;
};

const CreateNewSeller = ({ producerId }: CreateNewSellerProps) => {
  const { addSeller } = useSellers(producerId);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (values: { phoneNumber: string }) => {
    if (!values.phoneNumber) return;
    const success = await addSeller(values.phoneNumber);
    if (success) setPhoneNumber("");
  };

  return (
    <div className="flex w-96 flex-col items-start gap-6 px-6 py-6">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col items-center gap-4 px-6 py-6">
            <IconWithBackground size="large" icon="FeatherUser" />
            <span className="text-heading-3 font-heading-3 text-default-font">
              Crea nuevos vendedores
            </span>
          </div>
        </div>
        <Formik
          initialValues={{ phoneNumber: phoneNumber }}
          validationSchema={phoneValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4 w-full">
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="phoneNumber" className="text-sm font-medium">
                  Coloca el número de teléfono del vendedor
                </label>
                <PhoneInput
                  className="w-full"
                  value={phoneNumber}
                  onChange={(phone) => {
                    setFieldValue("phoneNumber", phone);
                    setPhoneNumber(phone);
                  }}
                  defaultCountry="CO"
                  placeholder="e.j., +57 317 828 38 38"
                />
                <HelpText>
                  **Recuerda que el vendedor deberá tener ya una cuenta en HUNT.
                </HelpText>
              </div>
              <Button className="h-10 w-full flex-none" type="submit">
                Agregar vendedor
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateNewSeller;
