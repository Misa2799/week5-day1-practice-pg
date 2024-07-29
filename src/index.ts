import { app } from "./app";
import { PORT, HOST } from "./env";

app.listen(PORT, HOST, () => {
  console.log(`[server]: listening at http://${HOST}:${PORT}`);
});
