"use client";

import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import AuthModule from "@/components/AuthModule";

const ForgotPasswordModule = () => {
  return (
    <AuthModule
      route="forgotPassword"
      formSchema={{
        type: "object",
        required: ["email"],
        properties: {
          email: {
            type: "string",
            title: "Email",
            minLength: 3,
            format: "email",
          },
        },
      }}
      formUiSchema={{
        email: {
          "ui:widget": CustomTextFieldWidget,
        },
      }}
    />
  );
};

export default ForgotPasswordModule;
