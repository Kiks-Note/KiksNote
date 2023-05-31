import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

 function ProfilSkeleton() {
  return (
    <>
      <Box style={{ width: "100vh", margin: "2%" }}>
        <Skeleton variant="rectangular" height={250} />

        <div
          style={{ display: "flex", flexDirection: "column", width: "100vh" }}
        >
          <Skeleton variant="rounded" height={150} style={{ marginTop: 30 }} />
          <Skeleton variant="rounded" height={200} style={{ marginTop: 30 }} />
          <Skeleton variant="rounded" height={118} style={{ marginTop: 30 }} />
          <Skeleton variant="rounded" height={118} style={{ marginTop: 30 }} />
        </div>
      </Box>
    </>
  );
}
export default ProfilSkeleton;
