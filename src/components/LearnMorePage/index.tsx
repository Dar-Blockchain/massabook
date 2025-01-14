import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const LearnMorePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "white",
          boxShadow: "none",
          borderBottom: `1px solid ${theme.palette.divider}`,
          height: 56,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            paddingX: "1rem",
          }}
        >
          {/* Back Button */}
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              marginLeft: "1rem",
              fontWeight: "bold",
              color: "text.primary",
            }}
          >
            Learn More
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="section"
        sx={{
          padding: {
            xs: "2rem 1rem",
            sm: "3rem 2rem",
            md: "4rem 6rem",
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "#F6F6F6",
        }}
      >
        {/* Hero Section */}
        <Typography
          variant="h1"
          sx={{
            fontSize: {
              xs: "2.5rem",
              sm: "3rem",
              md: "3.5rem",
            },
            color: theme.palette.primary.main,
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
            fontWeight: "bold",
            fontFamily:
              '"ABC Social", -apple-system, BlinkMacSystemFont, "avenir next", avenir, "segoe ui", "helvetica neue", helvetica, Ubuntu, roboto, noto, arial, sans-serif',
            maxWidth: "50rem",
          }}
        >
          Discover the Future of Social Networking
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginTop: "2rem",
            maxWidth: "40rem",
            fontSize: "1.125rem",
            lineHeight: 1.6,
            color: theme.palette.text.secondary,
          }}
        >
          Massabook is not just another social platform. It’s a fully on-chain
          decentralized experience powered by the Massa blockchain—putting data
          ownership and privacy back into the hands of the users.
        </Typography>
      </Box>

      {/* Content Sections */}
      <Container
        maxWidth="md"
        sx={{
          paddingY: "4rem",
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
        }}
      >
        {/* Section 1: Decentralization & Ownership */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="center"
          gap="2rem"
        >
          <Box
            component="img"
            src="/assets/images/decentralized 2.jpg"
            alt="Decentralized Illustration"
            sx={{
              width: { xs: "100%", md: "50%" },
              height: "auto",
              borderRadius: "10px",
            }}
          />
          <Box
            sx={{
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              True Decentralization
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", lineHeight: 1.7 }}
            >
              Massabook leverages the Massa blockchain to ensure that no single
              entity can control or censor the content. Unlike traditional
              social networks, data is stored securely on-chain, preventing
              manipulation and guaranteeing transparency. Your profile, posts,
              and friendships are protected from unauthorized alterations.
            </Typography>
          </Box>
        </Box>

        {/* Section 2: Privacy & Control */}
        <Box
          display="flex"
          flexDirection={{ xs: "column-reverse", md: "row" }}
          alignItems="center"
          gap="2rem"
        >
          <Box
            sx={{
              textAlign: { xs: "center", md: "left" },
              flex: 1,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Privacy & Control
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", lineHeight: 1.7 }}
            >
              With Massabook’s private pages and permission-based follows, you
              decide who sees your content. Want to share updates exclusively
              with close friends or page followers? It’s all up to you. Your
              data belongs to you, and you alone choose how it’s shared and who
              can view it.
            </Typography>
          </Box>
          <Box
            component="img"
            src="/assets/images/lock sec.jpg"
            alt="Privacy Illustration"
            sx={{
              width: { xs: "100%", md: "50%" },
              height: "auto",
              borderRadius: "10px",
            }}
          />
        </Box>

        {/* Section 3: Rich Community Interactions */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="center"
          gap="2rem"
        >
          <Box
            component="img"
            src="/assets/images/communityy.jpg"
            alt="Community Illustration"
            sx={{
              width: { xs: "100%", md: "50%" },
              height: "auto",
              borderRadius: "10px",
            }}
          />
          <Box
            sx={{
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Vibrant Communities & Pages
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", lineHeight: 1.7 }}
            >
              Create and follow pages dedicated to topics you love—whether it’s
              technology, music, art, or business. Engage with content through
              likes, comments, and reposts. With moderator-managed pages, the
              community remains respectful and curated. Building meaningful
              connections has never been simpler or more secure.
            </Typography>
          </Box>
        </Box>

        {/* Section 4: Future-Ready Platform */}
        <Box
          display="flex"
          flexDirection={{ xs: "column-reverse", md: "row" }}
          alignItems="center"
          gap="2rem"
        >
          <Box
            sx={{
              textAlign: { xs: "center", md: "left" },
              flex: 1,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Future-Ready & Scalable
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", lineHeight: 1.7 }}
            >
              Massabook is built to grow with you. As more users join, our
              decentralized infrastructure ensures efficiency, stability, and
              performance at scale. With regular updates, community-driven
              improvements, and an evolving feature set, we’re committed to
              leading the charge into the next era of social interaction.
            </Typography>
          </Box>
          <Box
            component="img"
            src="/assets/images/scalable.jpg"
            alt="Scalability Illustration"
            sx={{
              width: { xs: "100%", md: "50%" },
              height: "auto",
              borderRadius: "10px",
            }}
          />
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          paddingY: "4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#FFCCCC",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: (theme) => theme.palette.neutral.main,
            fontWeight: "bold",
            marginBottom: "2rem",
          }}
        >
          Ready to Get Started?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            maxWidth: "40rem",
            fontSize: "1.125rem",
            lineHeight: 1.6,
            marginBottom: "2rem",
            color: (theme) => theme.palette.neutral.mediumMain,
          }}
        >
          Join Massabook and become part of a community dedicated to privacy,
          freedom, and transparency. Harness the power of the blockchain to
          create, connect, and collaborate—your way.
        </Typography>

        <Button
          color="primary"
          size="large"
          sx={{
            backgroundColor: (theme) => theme.palette.primary.main,
            transitionTimingFunction: "ease-in-out",
            transitionProperty:
              "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
            cursor: "pointer",
            fontSize: "1.0625rem",
            color: "#fff",
            transitionDuration: ".15s",
            textTransform: "none",
            borderRadius: "16px",
            paddingX: {
              xs: "30px",
              sm: "50px",
            },
            height: "56px",
            width: "auto",
            fontWeight: "550",
            "&:hover": {
              boxShadow: (theme) =>
                `0 0 0 .125rem ${theme.palette.primary.main}`,
            },
          }}
          onClick={() => navigate(-1)}
        >
          Get Started
        </Button>
      </Box>
    </>
  );
};

export default LearnMorePage;
