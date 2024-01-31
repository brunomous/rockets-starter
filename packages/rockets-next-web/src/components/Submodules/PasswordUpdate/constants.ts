import type { RJSFSchema } from "@rjsf/utils";
import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";
import { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";

import { ValidationRule } from "@/utils/formValidation/formValidation";
import { PasswordChangeFormData } from "@/types/Profile";

export const widgets = {
  TextWidget: CustomTextFieldWidget,
};

export const defaultPasswordChangeFormSchema: RJSFSchema = {
  type: "object",
  required: ["currentPassword", "newPassword", "confirmNewPassword"],
  properties: {
    currentPassword: { type: "string", title: "Current password" },
    newPassword: { type: "string", title: "New password" },
    confirmNewPassword: { type: "string", title: "Confirm new password" },
  },
};

export const defaultAdvancedProperties: Record<string, AdvancedProperty> = {
  currentPassword: {
    type: "password",
  },
  newPassword: {
    type: "password",
  },
  confirmNewPassword: {
    type: "password",
  },
};

export const defaultValidationRules: ValidationRule<PasswordChangeFormData>[] =
  [
    {
      field: "currentPassword",
      test: (value) => !value,
      message: "Required field",
    },
    {
      field: "newPassword",
      test: (value) => !value,
      message: "Required field",
    },
    {
      field: "confirmNewPassword",
      test: (value) => !value,
      message: "Required field",
    },
    {
      field: "confirmNewPassword",
      test: (value, formData) => value !== formData.newPassword,
      message: "Your passwords don't match. Please try again",
    },
  ];
