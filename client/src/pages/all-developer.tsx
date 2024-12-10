import Add from "@mui/icons-material/Add";
import { useTable } from "@refinedev/core";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

import { DeveloperCard, CustomButton } from "components";

const AllDevelopers = () => {
  const navigate = useNavigate();

  const {
    tableQuery: { data, isLoading, isError },
    current,
    setCurrent,
    setPageSize,
    pageCount,
    sorter,
    setSorter,
    filters,
    setFilters,
  } = useTable();

  const allProjects = data?.data ?? [];

  const currentPrice = sorter.find((item) => item.field === "startPrice")?.order;

  const toggleSort = (field: string) => {
    setSorter([{ field, order: currentPrice === "asc" ? "desc" : "asc" }]);
  };

  const currentFilterValues = useMemo(() => {
    const logicalFilters = filters.flatMap((item) =>
      "field" in item ? item : [],
    );

    return {
      title: logicalFilters.find((item) => item.field === "projectName")?.value || "",
      projectType:
        logicalFilters.find((item) => item.field === "projectType")?.value ||
        "",
    };
  }, [filters]);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error...</Typography>;

  return (
    <Box position="relative" padding="20px">
      <Typography fontSize={25} fontWeight={700} color="#11142d" mb={3}>
        {!allProjects.length ? "There are no projects" : "All Projects"}
      </Typography>

      <Box
        mb={2}
        display="flex"
        width="100%"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Box
          display="flex"
          gap={2}
          flexWrap="wrap"
          mb={{ xs: "20px", sm: 0 }}
          width="100%"
        >
          <CustomButton
            title={`Sort price ${currentPrice === "asc" ? "↑" : "↓"}`}
            handleClick={() => toggleSort("startPrice")}
            backgroundColor="#dc743c"
            color="#fcfcfc"
          />
          <TextField
            variant="outlined"
            color="info"
            placeholder="Search by project Name"
            value={currentFilterValues.title}
            onChange={(e) => {
              setFilters([
                {
                  field: "projectName",
                  operator: "contains",
                  value: e.currentTarget.value
                    ? e.currentTarget.value
                    : undefined,
                },
              ]);
            }}
            sx={{ flex: 1, maxWidth: "300px" }}
          />
          <Select
            variant="outlined"
            color="info"
            displayEmpty
            required
            inputProps={{ "aria-label": "Without label" }}
            defaultValue=""
            value={currentFilterValues.projectType}
            onChange={(e) => {
              setFilters(
                [
                  {
                    field: "projectType",
                    operator: "eq",
                    value: e.target.value,
                  },
                ],
                "replace",
              );
            }}
            sx={{ flex: 1, maxWidth: "200px" }}
          >
            <MenuItem value="">All</MenuItem>
            {[
              "Apartment",
              "Villa",
              "Farmhouse",
              "Condos",
              "Townhouse",
              "Duplex",
              "Studio",
              "Chalet",
            ].map((type) => (
              <MenuItem key={type} value={type.toLowerCase()}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <Box position="absolute" top="20px" right="20px" zIndex={1000}>
        <CustomButton
          title="Add Project"
          handleClick={() => navigate("/projects/create")}
          backgroundColor="#dc743c"
          color="#fcfcfc"
          icon={<Add />}
        />
      </Box>

      <Box mt="40px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {allProjects?.map((project) => (
          <DeveloperCard
            key={project._id}
            id={project._id}
            projectName={project.projectName}
            description={project.description}
            startPrice={project.startPrice}
            images={project.images}
            size={project.size} 
            location={project.location} 
            rooms={project.rooms}         
           />
        ))}
      </Box>

      {allProjects.length > 0 && (
        <Box display="flex" gap={2} mt={3} flexWrap="wrap">
          <CustomButton
            title="Previous"
            handleClick={() => setCurrent((prev) => prev - 1)}
            backgroundColor="#dc743c"
            color="#fcfcfc"
            disabled={!(current > 1)}
          />
          <Box
            display={{ xs: "hidden", sm: "flex" }}
            alignItems="center"
            gap="5px"
          >
            Page{" "}
            <strong>
              {current} of {pageCount}
            </strong>
          </Box>
          <CustomButton
            title="Next"
            handleClick={() => setCurrent((prev) => prev + 1)}
            backgroundColor="#dc743c"
            color="#ffffff"
            disabled={current === pageCount}
          />
          <Select
            variant="outlined"
            color="info"
            displayEmpty
            required
            inputProps={{ "aria-label": "Without label" }}
            defaultValue={10}
            onChange={(e) =>
              setPageSize(e.target.value ? Number(e.target.value) : 10)
            }
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <MenuItem key={size} value={size}>
                Show {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
    </Box>
  );
};

export default AllDevelopers;
