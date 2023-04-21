import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";

export default function TutoSkeleton() {
    return (
        <Grid item xs={2} sm={4} md={5}>
            <Box sx={{maxWidth: 350, m: 2}}>
                <Skeleton variant="rectangular" width={350} height={118}/>
                <Skeleton/>
                <Skeleton width="60%"/>
            </Box>
        </Grid>

    );
}