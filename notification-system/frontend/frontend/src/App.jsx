import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography
} from "@mui/material";

function App() {
  const [items, setItems] = useState([]);
  const [type, setType] = useState("");
  const [top, setTop] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/notifications?page=1&limit=10"
      );
      const data = await response.json();

      setItems(data.notifications || []);
    } finally {
      setLoading(false);
    }
  }

  function getTop10(list) {
    const weight = { Placement: 3, Result: 2, Event: 1 };

    return [...list]
      .sort((a, b) => {
        if (weight[b.notification_type] !== weight[a.notification_type]) {
          return weight[b.notification_type] - weight[a.notification_type];
        }

        return new Date(b.created_at) - new Date(a.created_at);
      })
      .slice(0, 10);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = items.filter((item) => {
    if (!type) {
      return true;
    }

    return item.notification_type === type;
  });

  const finalItems = top ? getTop10(filteredItems) : filteredItems;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" sx={{ mb: 1 }}>
        Notification System
      </Typography>

      <Typography sx={{ mb: 3 }}>
        Simple college notifications view.
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="outlined" onClick={() => setType("")}>All</Button>
        <Button variant="outlined" onClick={() => setType("Placement")}>Placement</Button>
        <Button variant="outlined" onClick={() => setType("Result")}>Result</Button>
        <Button variant="outlined" onClick={() => setType("Event")}>Event</Button>
        <Button variant="contained" onClick={() => setTop(!top)}>
          Top 10 Priority
        </Button>
      </Stack>

      {loading && <Typography>Loading...</Typography>}

      {!loading && finalItems.length === 0 && (
        <Typography>No Notifications Found</Typography>
      )}

      {!loading &&
        finalItems.map((n) => (
          <Card key={n.id} sx={{ mb: 2 }}>
          <CardContent>
            <Chip
              label={n.notification_type}
              color={
                n.notification_type === "Placement"
                  ? "success"
                  : n.notification_type === "Result"
                  ? "warning"
                  : "info"
              }
              sx={{ mb: 1 }}
            />

            <Typography variant="h6">{n.title}</Typography>
            <Typography>{n.message}</Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {new Date(n.created_at).toLocaleString()}
            </Typography>

            <Typography>
              Status: {n.is_read ? "Read" : "Unread"}
            </Typography>
          </CardContent>
        </Card>
        ))}
    </Container>
  );
}

export default App;