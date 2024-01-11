import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { IChangeEvent } from "@rjsf/core";
import type { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";

import { useRouter } from "next/navigation";
import { Box, Button, Container, Card, CircularProgress } from "@mui/material";
import { Text, Link, SchemaForm } from "@concepta/react-material-ui";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import validator from "@rjsf/validator-ajv6";
import { toast } from "react-toastify";

interface SignUpSubmoduleProps {
  formSchema: RJSFSchema;
  formUiSchema?: UiSchema;
  advancedProperties?: Record<string, AdvancedProperty>;
  formData?: Record<string, unknown> | null;
  forgotPasswordPath?: string;
  signInPath?: string;
}

const SignUpSubmodule = (props: SignUpSubmoduleProps) => {
  const router = useRouter();
  const { post } = useDataProvider();

  const { execute: createAccount, isPending: isLoadingSignUp } = useQuery(
    (body: Record<string, unknown>) => post({ uri: "/user", body }),
    false,
    {
      onSuccess() {
        toast.success("Account successfully created.");

        if (props.signInPath) {
          router.push(props.signInPath);
        }
      },
      onError: (error) => {
        toast.error(
          // @ts-expect-error TODO: needs to fix types in rockets-react
          error?.response?.data?.message ??
            "An error has occurred. Please try again later or contact support for assistance."
        );
      },
    }
  );

  const handleSignUp = async (values: IChangeEvent<Record<string, string>>) => {
    const { email, username, password } = values.formData || {};
    createAccount({ email, username, password });
  };

  return (
    <Container maxWidth="xs" sx={{ textAlign: "center", padding: "48px 0" }}>
      <Card sx={{ padding: "24px", marginTop: "32px" }}>
        <Text
          variant="h4"
          fontFamily="Inter"
          fontSize={30}
          fontWeight={800}
          mt={1}
          gutterBottom
        >
          Sign up
        </Text>
        <SchemaForm.Form
          schema={props.formSchema}
          uiSchema={props.formUiSchema}
          validator={validator}
          formData={props.formData}
          onSubmit={handleSignUp}
          noHtml5Validate={true}
          showErrorList={false}
          advancedProperties={props.advancedProperties}
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={Boolean(isLoadingSignUp)}
              sx={{ flex: 1 }}
            >
              {isLoadingSignUp ? (
                <CircularProgress sx={{ color: "white" }} size={24} />
              ) : (
                "Send"
              )}
            </Button>
          </Box>
        </SchemaForm.Form>

        {props.signInPath ? (
          <Text fontSize={14} fontWeight={500} gutterBottom sx={{ mt: 3 }}>
            <Link href={props.signInPath} color="primary.dark">
              Already have an account? Sign in
            </Link>
          </Text>
        ) : null}
      </Card>
    </Container>
  );
};

export default SignUpSubmodule;
