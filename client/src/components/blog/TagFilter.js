import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import {CheckBox} from "@mui/icons-material";
import Tags from "./Tags";

export default function TagFilter() {
    return (
        <Box>
            <Card variant={"outlined"}>
                <CardContent>
                    <Typography variant="subtitle1" component="div">
                        Filtrer par tags
                    </Typography>
                    <Divider variant="string"/>

                    <Tags/>

                </CardContent>
            </Card>
        </Box>
    )
}