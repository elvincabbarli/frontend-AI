import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { routes } from "../../routes";

export default function Home() {
  const concepts = routes.filter((route) => route.path !== "/");

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        React AI Practice Playground
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Pick a concept from the drawer, or jump in below:
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 2,
          maxWidth: 900,
        }}
      >
        {concepts.map((route) => (
          <Card key={route.path} variant="outlined">
            <CardActionArea component={Link} to={route.path} sx={{ height: "100%" }}>
              <CardContent>
                {route.group && (
                  <Typography
                    variant="overline"
                    color="primary"
                    sx={{ display: "block", fontWeight: 700, lineHeight: 1.8 }}
                  >
                    {route.group}
                  </Typography>
                )}
                <Typography sx={{ fontWeight: 600 }}>{route.label}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
