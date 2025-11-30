import { List, ActionPanel, Action, Icon, Color, Detail } from "@raycast/api";
import { useEffect, useState } from "react";
import { getRecentGames, getGameDetails, getChallengeDetails } from "./api/client";
import { FeedEntry, DailyChallengePayload, StreakPayload, DuelPayload, GameDetails } from "./types";

interface ParsedGame {
  type: "daily" | "streak" | "duel" | "unknown";
  time: string;
  title: string;
  subtitle: string;
  url: string;
  token: string; // Added for fetching details
  points?: number;
  icon: string;
  iconTint: Color;
}

export default function LastGamesCommand() {
  const [games, setGames] = useState<ParsedGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const feed = await getRecentGames(25);
        const parsedGames = feed.entries
          .map((entry) => parseGameEntry(entry))
          .filter((game): game is ParsedGame => game !== null);
        setGames(parsedGames);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGames();
  }, []);

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search games...">
      {games.map((game, idx) => (
        <List.Item
          key={`${game.time}-${idx}`}
          title={game.title}
          subtitle={game.subtitle}
          icon={{ source: game.icon, tintColor: game.iconTint }}
          accessories={[
            game.points !== undefined ? { text: `${game.points.toLocaleString("de-DE")} pts` } : {},
            { date: new Date(game.time) },
          ]}
          actions={
            <ActionPanel>
              <Action.Push title="View Game Details" target={<GameDetailView game={game} />} icon={Icon.Eye} />
              <Action.OpenInBrowser title="Open in Browser" url={game.url} />
              <Action.CopyToClipboard title="Copy Game Link" content={game.url} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

// NEW COMPONENT: Game Detail View
function GameDetailView({ game }: { game: ParsedGame }) {
  const [details, setDetails] = useState<GameDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        let data;
        if (game.type === "daily" || game.type === "unknown") {
          // For challenges, try challenge endpoint first, fallback to game endpoint
          try {
            data = await getChallengeDetails(game.token);
          } catch {
            data = await getGameDetails(game.token);
          }
        } else {
          data = await getGameDetails(game.token);
        }
        setDetails(data);
      } catch (err) {
        setError("Failed to load game details");
        console.error("Failed to fetch game details:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetails();
  }, [game.token, game.type]);

  if (error) {
    return <Detail markdown={`# ❌ Error\n\n${error}`} />;
  }

  if (!details) {
    return <Detail isLoading={isLoading} markdown="# Loading game details..." />;
  }

  const totalScore = details.player?.totalScore?.amount || game.points || 0;
  const guesses = details.player?.guesses || [];
  const rounds = details.rounds || [];

  const markdown = `
# ${game.title}

**${details.mapName || details.map?.name || "Unknown Map"}**

---

## 🎯 Final Score
**${totalScore.toLocaleString("de-DE")} points** ${details.player?.totalScore?.percentage ? `(${Math.round(details.player.totalScore.percentage)}%)` : ""}

## 📍 Rounds

${rounds
  .map((round, idx) => {
    const guess = guesses[idx];
    if (!guess) return `### Round ${idx + 1}\nNo guess data`;

    const distance = guess.distance?.amount
      ? guess.distance.amount > 1000
        ? `${Math.round(guess.distance.amount / 1000)} km`
        : `${Math.round(guess.distance.amount)} m`
      : "—";

    return `### Round ${idx + 1}
- **Score:** ${guess.roundScore?.amount?.toLocaleString("de-DE") || 0} pts
- **Distance:** ${distance}
- **Time:** ${guess.time}s ${guess.timedOut ? "⏱️ (Timed out)" : ""}
- **Location:** [${round.lat.toFixed(4)}, ${round.lng.toFixed(4)}](https://www.google.com/maps?q=${round.lat},${round.lng})
- **Your Guess:** [${guess.lat.toFixed(4)}, ${guess.lng.toFixed(4)}](https://www.google.com/maps?q=${guess.lat},${guess.lng})`;
  })
  .join("\n\n")}

---

## ⚙️ Game Settings
- **Mode:** ${details.mode || "Standard"}
- **Time Limit:** ${details.timeLimit ? `${details.timeLimit}s` : "No limit"}
- **Moving:** ${details.forbidMoving ? "❌ Forbidden" : "✅ Allowed"}
- **Zooming:** ${details.forbidZooming ? "❌ Forbidden" : "✅ Allowed"}
- **Rotating:** ${details.forbidRotating ? "❌ Forbidden" : "✅ Allowed"}

**Played:** ${new Date(details.created).toLocaleString("de-DE")}
  `;

  return (
    <Detail
      isLoading={isLoading}
      markdown={markdown}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Total Score" text={`${totalScore.toLocaleString("de-DE")} pts`} icon="🎯" />
          <Detail.Metadata.Label title="Map" text={details.mapName || details.map?.name || "—"} icon="🗺️" />
          <Detail.Metadata.Label title="Rounds" text={`${rounds.length}`} icon="📍" />

          <Detail.Metadata.Separator />

          {guesses.map((guess, idx) => (
            <Detail.Metadata.Label
              key={idx}
              title={`Round ${idx + 1}`}
              text={`${guess.roundScore?.amount?.toLocaleString("de-DE") || 0} pts`}
              icon={guess.roundScore?.percentage && guess.roundScore.percentage > 0.8 ? "🌟" : "📌"}
            />
          ))}

          <Detail.Metadata.Separator />

          <Detail.Metadata.Label
            title="Played"
            text={new Date(details.created).toLocaleDateString("de-DE")}
            icon="📅"
          />

          <Detail.Metadata.Separator />

          <Detail.Metadata.Link title="View in Browser" target={game.url} text="Open Game" />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action.OpenInBrowser title="Open in Browser" url={game.url} />
          <Action.CopyToClipboard
            title="Copy Game Token"
            content={game.token}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
          />
        </ActionPanel>
      }
    />
  );
}

function parseGameEntry(entry: FeedEntry): ParsedGame | null {
  try {
    // Type 2: Daily Challenge / Standard Game
    if (entry.type === 2) {
      const payload: DailyChallengePayload = JSON.parse(entry.payload);
      return {
        type: "daily",
        time: entry.time,
        title: payload.isDailyChallenge ? "📅 Daily Challenge" : `🎮 ${payload.gameMode}`,
        subtitle: `${payload.mapName} • ${payload.points.toLocaleString("de-DE")} pts`,
        url: `https://www.geoguessr.com/challenge/${payload.challengeToken}`,
        token: payload.challengeToken,
        points: payload.points,
        icon: Icon.Star,
        iconTint: payload.isDailyChallenge ? Color.Yellow : Color.Blue,
      };
    }

    // Type 7: Streak Games (array of games)
    if (entry.type === 7) {
      const streakGames: StreakPayload[] = JSON.parse(entry.payload);
      const totalPoints = streakGames.reduce((sum, game) => sum + game.payload.points, 0);
      const bestStreak = Math.max(...streakGames.map((game) => game.payload.points));
      const firstGame = streakGames[0]?.payload;

      return {
        type: "streak",
        time: entry.time,
        title: "🔥 Country Streak Session",
        subtitle: `${streakGames.length} games • Best: ${bestStreak}`,
        url: `https://www.geoguessr.com/game/${firstGame?.gameToken || ""}`,
        token: firstGame?.gameToken || "",
        points: totalPoints,
        icon: Icon.Flame,
        iconTint: Color.Orange,
      };
    }

    // Type 6: Duels
    if (entry.type === 6) {
      const payload: DuelPayload = JSON.parse(entry.payload);
      return {
        type: "duel",
        time: entry.time,
        title: "⚔️ Duel",
        subtitle: payload.competitiveGameMode || payload.gameMode,
        url: `https://game-server.geoguessr.com/api/duels/${payload.gameId}`,
        token: payload.gameId,
        icon: Icon.TwoPeople,
        iconTint: Color.Purple,
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to parse game entry:", error);
    return null;
  }
}
