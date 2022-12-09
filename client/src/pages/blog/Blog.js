import {Avatar, Button, Card, CardActions, CardContent, CardHeader, Grid, Typography} from "@mui/material";
import MiniDrawer from "../../components/navbar/Navbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import * as PropTypes from "prop-types";

function MoreVertIcon() {
    return null;
}

function StarIcon(props) {
    return null;
}

StarIcon.propTypes = {color: PropTypes.string};

function Blog() {
    return (
        <>
            <Box sx={{flexGrow: 1}}>
                <Grid
                    container
                    spacing={{xs: 2, md: 3}}
                    columns={{xs: 4, sm: 8, md: 12}}
                >
                    <Card sx={{maxWidth: 345}}>
                        <CardHeader
                            avatar={<Avatar
                                src={'https://www.shutterstock.com/image-vector/man-icon-vector-260nw-1040084344.jpg'}></Avatar>}
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon/>
                                </IconButton>
                            }
                            title={'Title'}
                            subheader="Groupe"
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                This impressive paella is a perfect party dish and a fun meal to cook
                                together with your guests. Add 1 cup of frozen peas along with the
                                mussels, if you like.
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton/>
                        </CardActions>
                    </Card>
                </Grid>
            </Box>
        </>
    )
}

export default Blog