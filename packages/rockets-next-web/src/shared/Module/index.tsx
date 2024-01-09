import type {
  HeaderProps,
  RowProps,
} from "@concepta/react-material-ui/dist/components/Table/types";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { IChangeEvent } from "@rjsf/core";

import { useState, useMemo } from "react";
import {
  Table as RocketsTable,
  createTableStyles,
} from "@concepta/react-material-ui/";
import {
  Box,
  Drawer,
  Button,
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import useTable from "@concepta/react-material-ui/dist/components/Table/useTable";
import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";
import { SchemaForm } from "@concepta/react-material-ui";
import validator from "@rjsf/validator-ajv6";
import { toast } from "react-toastify";

type Action = "creation" | "edit" | "details" | "delete" | null;

interface DrawerState {
  isOpen: boolean;
  viewMode: Action;
}

interface ModuleProps {
  resource: string;
  tableSchema: HeaderProps[];
  formSchema: RJSFSchema;
  formUiSchema?: UiSchema;
}

const widgets = {
  TextWidget: CustomTextFieldWidget,
};

const Module = (props: ModuleProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerState, setDrawerState] = useState<DrawerState>({
    isOpen: false,
    viewMode: null,
  });
  const [selectedRow, setSelectedRow] = useState<User | null>();

  const tableProps = useTable(props.resource, {
    callbacks: {
      onError: () => toast.error("Failed to fetch data."),
    },
  });

  const { del, post, patch } = useDataProvider();

  const { execute: createItem, isPending: isLoadingCreation } = useQuery(
    (data: any) =>
      post({
        uri: `/${props.resource}`,
        body: data,
      }),
    false,
    {
      onSuccess: () => {
        toast.success("Data successfully created.");
        tableProps.refresh();
      },
      onError: () => toast.error("Failed to create data."),
    }
  );

  const { execute: editItem, isPending: isLoadingEdit } = useQuery(
    (data: any) =>
      patch({
        uri: `/${props.resource}/${data.id}`,
        body: data,
      }),
    false,
    {
      onSuccess: () => {
        toast.success("Data successfully updated.");
        tableProps.refresh();
      },
      onError: () => toast.error("Failed to edit data."),
    }
  );

  const { execute: deleteItem } = useQuery(
    (id: any) =>
      del({
        uri: `/${props.resource}/${id}`,
      }),
    false,
    {
      onSuccess: () => {
        toast.success("Data successfully deleted.");
        tableProps.refresh();
      },
      onError: () => toast.error("Failed to delete data."),
    }
  );

  const handleFormSubmit = async (values: IChangeEvent<any>) => {
    const fields = values.formData;

    if (drawerState.viewMode === "creation") {
      await createItem(fields);
    }

    if (drawerState.viewMode === "edit") {
      await editItem(fields);
    }
  };

  const theme = useTheme();

  const tableTheme = createTableStyles({
    table: {
      height: "100%",
    },
    root: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      overflow: "auto",
    },
    tableHeader: {
      ...theme.typography.caption,
      lineHeight: 1,
      fontWeight: 500,
      color: theme.palette.grey[500],
    },
    tableRow: {
      backgroundColor: "#F9FAFB",
      textTransform: "uppercase",
    },
    tableContainer: {
      flex: 1,
    },
  });

  const tableRows: RowProps[] = useMemo(() => {
    const data = tableProps.data || [];

    return data.map((row: any) => {
      return {
        ...row,
        actions: {
          component: (
            <Box>
              <IconButton
                onClick={() => {
                  setDrawerState({ viewMode: "edit", isOpen: true });
                  setSelectedRow(row);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteItem(row.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  setDrawerState({ viewMode: "details", isOpen: true });
                  setSelectedRow(row);
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          ),
        },
      };
    });
  }, [tableProps.data]);

  return (
    <Box>
      <RocketsTable.Root
        headers={props.tableSchema}
        rows={tableRows}
        sx={tableTheme.root}
        {...tableProps}
      >
        <TableContainer sx={tableTheme.tableContainer}>
          <RocketsTable.Table
            stickyHeader
            variant="outlined"
            sx={tableTheme.table}
          >
            <TableHead>
              <TableRow sx={tableTheme.tableRow}>
                <RocketsTable.HeaderCells />
              </TableRow>
            </TableHead>
            <TableBody>
              {!tableProps.data && (
                <TableRow>
                  <TableCell
                    colSpan={props.tableSchema.length}
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              )}
              <RocketsTable.BodyRows isLoading={tableProps.isPending} />
            </TableBody>
          </RocketsTable.Table>
        </TableContainer>
        <RocketsTable.Pagination variant="outlined" />
      </RocketsTable.Root>

      <Drawer open={drawerState.isOpen} anchor="right">
        <Box padding={4} mb={2}>
          <SchemaForm.Form
            schema={props.formSchema}
            validator={validator}
            onSubmit={handleFormSubmit}
            widgets={widgets}
            noHtml5Validate={true}
            showErrorList={false}
            formData={selectedRow}
            readonly={drawerState.viewMode === "details"}
          >
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              mt={4}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={
                  drawerState.viewMode === "details" ||
                  isLoadingCreation ||
                  isLoadingEdit
                }
                sx={{ flex: 1, mr: 1 }}
              >
                {isLoadingCreation || isLoadingEdit ? (
                  <CircularProgress sx={{ color: "white" }} size={24} />
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setDrawerState({ viewMode: null, isOpen: false });
                  setSelectedRow(null);
                }}
                sx={{ flex: 1, ml: 1 }}
              >
                Close
              </Button>
            </Box>
          </SchemaForm.Form>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Module;
