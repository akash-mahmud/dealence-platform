import { Container, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Copyright from "../components/Copyright";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Title from "../components/Title";
import Typography from "@material-ui/core/Typography";
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
    appBarSpacer: theme.mixins.toolbar,
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },
    content: {
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
        flexDirection: "column",
        display: "flex"
    },
    referralLinkSpacing: {
        marginTop: 4
    }
}));

export default function Account() {
    const classes = useStyles();
    const [user, setUser] = useState({
        id: ""
    });

    useEffect(() => {
        const getUser = async () => {
            const res = await axios.get(
              `${process.env.REACT_APP_API_DATA}/user/me`,
              {
                withCredentials: true,
              }
            );

            setUser(res.data);
        };
        getUser();
    }, [])

    return (
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <div>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper className={classes.paper}>
                                <Title>Share the word</Title>
                                <Typography component="p" variant="body2">
                                    Invite a friend to Dealence using the link below to earn special rewards
                                </Typography>
                                <Link href={`http://localhost:3000/register?referral=${user.id}`} target="_blank" rel="noopener" className={classes.referralLinkSpacing}>
                                    localhost:3000/register?referral={user.id}
                                </Link>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Container>
            <Copyright />
        </main>
    )
}