import { useList } from "@refinedev/core";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {
  PieChart,
  PropertyCard,
} from "components";

const Home = () => {
  const { data, isLoading, isError } = useList({
    resource: "properties",
    config: {
      pagination: {
        pageSize: 4,
      },
    },
  });

  const { data : allProperties } = useList({
    resource: "properties",
  });

  const { data : allProjects } = useList({
    resource: "projects",
  });

  const { data : allDevelopers } = useList({
    resource: "developers",
  });

  const latestProperties = data?.data ?? [];

  const properties = allProperties?.data ?? [];
  const projects = allProjects?.data ?? [];
  const developers = allDevelopers?.data ?? [];

  const propertiesForSale = properties.filter(
    (property) => property.purpose === "sale"
  );
  const propertiesForRent = properties.filter(
    (property) => property.purpose === "rent"
  );

   // Calculate total properties and percentages for dynamic series
   const totalProperties = properties.length;
   const salePercentage = totalProperties ? (propertiesForSale.length / totalProperties) * 100 : 0;
   const rentPercentage = totalProperties ? (propertiesForRent.length / totalProperties) * 100 : 0;
 

  const totalDevelopers = developers.length;
  const developerPercentage = totalDevelopers*100 ;

  const totalProjects = projects.length;
  const projectPercentage = totalProjects*100 ;

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Something went wrong!</Typography>;

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142D">
        Dashboard
      </Typography>

      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
        <PieChart
          title="Properties for Sale"
          value={propertiesForSale.length}
          series={[salePercentage, 100 - salePercentage]}
          colors={["#dc743c", "#c4e8ef"]}
        />
        <PieChart
          title="Properties for Rent"
          value={propertiesForRent.length}
          series={[rentPercentage, 100 - rentPercentage]}
          colors={["#dc743c", "#c4e8ef"]}
        />
        <PieChart
          title="Total Projects"
          value={totalDevelopers}
          series={[projectPercentage, 100 - projectPercentage]}
          colors={["#dc743c", "#c4e8ef"]}
        />
        <PieChart
          title="Total Developers"
          value={totalDevelopers}
          series={[developerPercentage, 100 - developerPercentage]}
          colors={["#dc743c", "#c4e8ef"]}
        />
      </Box>

      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
      </Stack>

      <Box
        flex={1}
        borderRadius="15px"
        padding="20px"
        bgcolor="#fcfcfc"
        display="flex"
        flexDirection="column"
        minWidth="100%"
        mt="25px"
      >
        <Typography fontSize="18px" fontWeight={600} color="#11142d">
          Latest Properties
        </Typography>

        <Box mt={2.5} sx={{ display : "flex", flexWrap: "wrap", gap: 4 }}>
          {latestProperties.map((property) => (
            <PropertyCard
              key={property._id}
              id={property._id}
              title={property.title}
              location={property.location}
              price={property.price}
              backgroundImage={property.images.backgroundImage}
              area={property.area}
              numOfbathrooms={property.numOfbathrooms}
              numOfrooms={property.numOfrooms}
            />
          ))}
        </Box>

        
      </Box>
    </Box>
  );
};

export default Home;
