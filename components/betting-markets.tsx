"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Calendar } from "lucide-react"

interface BettingEvent {
  id: string
  sport: string
  league: string
  homeTeam: string
  awayTeam: string
  startTime: string
  status: "upcoming" | "live" | "ended"
  markets: {
    matchWinner: {
      home: number
      draw?: number
      away: number
    }
    totalGoals?: {
      over: number
      under: number
      line: number
    }
    bothTeamsScore?: {
      yes: number
      no: number
    }
  }
}

export function BettingMarkets() {
  const [selectedBets, setSelectedBets] = useState<
    Array<{
      eventId: string
      market: string
      selection: string
      odds: number
      eventName: string
      sport: string
      league: string
    }>
  >([])

  const events: BettingEvent[] = [
    {
      id: "1",
      sport: "Football",
      league: "Premier League",
      homeTeam: "Manchester United",
      awayTeam: "Liverpool",
      startTime: "2024-01-20T15:00:00Z",
      status: "upcoming",
      markets: {
        matchWinner: { home: 2.5, draw: 3.2, away: 2.8 },
        totalGoals: { over: 1.85, under: 1.95, line: 2.5 },
        bothTeamsScore: { yes: 1.75, no: 2.1 },
      },
    },
    {
      id: "2",
      sport: "Basketball",
      league: "NBA",
      homeTeam: "Lakers",
      awayTeam: "Warriors",
      startTime: "2024-01-20T20:30:00Z",
      status: "live",
      markets: {
        matchWinner: { home: 1.95, away: 1.85 },
        totalGoals: { over: 1.9, under: 1.9, line: 220.5 },
      },
    },
    {
      id: "3",
      sport: "Football",
      league: "La Liga",
      homeTeam: "Real Madrid",
      awayTeam: "Barcelona",
      startTime: "2024-01-21T16:00:00Z",
      status: "upcoming",
      markets: {
        matchWinner: { home: 2.1, draw: 3.5, away: 3.2 },
        totalGoals: { over: 1.8, under: 2.0, line: 2.5 },
        bothTeamsScore: { yes: 1.65, no: 2.25 },
      },
    },
    {
      id: "4",
      sport: "Tennis",
      league: "ATP",
      homeTeam: "Novak Djokovic",
      awayTeam: "Rafael Nadal",
      startTime: "2024-01-20T14:00:00Z",
      status: "upcoming",
      markets: {
        matchWinner: { home: 1.75, away: 2.05 },
      },
    },
  ]

  const addToBetSlip = (
  eventId: string,
  market: string,
  selection: string,
  odds: number,
  eventName: string,
  sport: string,
  league: string
) => {
    const existingBet = selectedBets.find((bet) => bet.eventId === eventId && bet.market === market)
    if (existingBet) {
      setSelectedBets(selectedBets.filter((bet) => !(bet.eventId === eventId && bet.market === market)))
    } else {
      setSelectedBets([...selectedBets, { eventId, market, selection, odds, eventName, sport, league }])
    }
  }

  const isSelected = (eventId: string, market: string) => {
    return selectedBets.some((bet) => bet.eventId === eventId && bet.market === market)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString()
  }

  const EventCard = ({ event }: { event: BettingEvent }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {event.homeTeam} vs {event.awayTeam}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{event.league}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(event.status)}>
              {event.status === "live" ? "LIVE" : event.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {formatTime(event.startTime)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Match Winner</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={isSelected(event.id, "matchWinner-home") ? "default" : "outline"}
              className="flex flex-col h-auto py-2"
              onClick={() =>
                addToBetSlip(
                  event.id,
                  "matchWinner-home",
                  event.homeTeam,
                  event.markets.matchWinner.home,
                  `${event.homeTeam} vs ${event.awayTeam}`,
                  event.sport,
                  event.league
                )
              }
            >
              <span className="text-xs">{event.homeTeam}</span>
              <span className="font-bold">{event.markets.matchWinner.home}</span>
            </Button>
            {event.markets.matchWinner.draw && (
              <Button
                variant={isSelected(event.id, "matchWinner-draw") ? "default" : "outline"}
                className="flex flex-col h-auto py-2"
                onClick={() =>
                  addToBetSlip(
                    event.id,
                    "matchWinner-draw",
                    "Draw",
                    event.markets.matchWinner.draw!,
                    `${event.homeTeam} vs ${event.awayTeam}`,
                    event.sport,
                    event.league
                  )
                }
              >
                <span className="text-xs">Draw</span>
                <span className="font-bold">{event.markets.matchWinner.draw}</span>
              </Button>
            )}
            <Button
              variant={isSelected(event.id, "matchWinner-away") ? "default" : "outline"}
              className="flex flex-col h-auto py-2"
              onClick={() =>
                addToBetSlip(
                  event.id,
                  "matchWinner-away",
                  event.awayTeam,
                  event.markets.matchWinner.away,
                  `${event.homeTeam} vs ${event.awayTeam}`,
                  event.sport,
                  event.league
                )
              }
            >
              <span className="text-xs">{event.awayTeam}</span>
              <span className="font-bold">{event.markets.matchWinner.away}</span>
            </Button>
          </div>
        </div>

        {event.markets.totalGoals && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">
              Total {event.sport === "Basketball" ? "Points" : "Goals"} (O/U {event.markets.totalGoals.line})
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={isSelected(event.id, "totalGoals-over") ? "default" : "outline"}
                className="flex flex-col h-auto py-2"
                onClick={() =>
                  addToBetSlip(
                    event.id,
                    "totalGoals-over",
                    `Over ${event.markets.totalGoals!.line}`,
                    event.markets.totalGoals!.over,
                    `${event.homeTeam} vs ${event.awayTeam}`,
                    event.sport,
                    event.league
                  )
                }
              >
                <span className="text-xs">Over {event.markets.totalGoals.line}</span>
                <span className="font-bold">{event.markets.totalGoals.over}</span>
              </Button>
              <Button
                variant={isSelected(event.id, "totalGoals-under") ? "default" : "outline"}
                className="flex flex-col h-auto py-2"
                onClick={() =>
                  addToBetSlip(
                    event.id,
                    "totalGoals-under",
                    `Under ${event.markets.totalGoals!.line}`,
                    event.markets.totalGoals!.under,
                    `${event.homeTeam} vs ${event.awayTeam}`,
                    event.sport,
                    event.league
                  )
                }
              >
                <span className="text-xs">Under {event.markets.totalGoals.line}</span>
                <span className="font-bold">{event.markets.totalGoals.under}</span>
              </Button>
            </div>
          </div>
        )}

        {event.markets.bothTeamsScore && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Both Teams to Score</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={isSelected(event.id, "bothTeamsScore-yes") ? "default" : "outline"}
                className="flex flex-col h-auto py-2"
                onClick={() =>
                  addToBetSlip(
                    event.id,
                    "bothTeamsScore-yes",
                    "Yes",
                    event.markets.bothTeamsScore!.yes,
                    `${event.homeTeam} vs ${event.awayTeam}`,
                    event.sport,
                    event.league
                  )
                }
              >
                <span className="text-xs">Yes</span>
                <span className="font-bold">{event.markets.bothTeamsScore.yes}</span>
              </Button>
              <Button
                variant={isSelected(event.id, "bothTeamsScore-no") ? "default" : "outline"}
                className="flex flex-col h-auto py-2"
                onClick={() =>
                  addToBetSlip(
                    event.id,
                    "bothTeamsScore-no",
                    "No",
                    event.markets.bothTeamsScore!.no,
                    `${event.homeTeam} vs ${event.awayTeam}`,
                    event.sport,
                    event.league
                  )
                }
              >
                <span className="text-xs">No</span>
                <span className="font-bold">{event.markets.bothTeamsScore.no}</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const filterEventsBySport = (sport?: string) => {
    if (!sport || sport === "all") return events
    return events.filter((event) => event.sport.toLowerCase() === sport.toLowerCase())
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Live Betting Markets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All Sports</TabsTrigger>
                <TabsTrigger value="football">Football</TabsTrigger>
                <TabsTrigger value="basketball">Basketball</TabsTrigger>
                <TabsTrigger value="tennis">Tennis</TabsTrigger>
                <TabsTrigger value="live">Live</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </TabsContent>

              <TabsContent value="football" className="mt-4">
                {filterEventsBySport("football").map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </TabsContent>

              <TabsContent value="basketball" className="mt-4">
                {filterEventsBySport("basketball").map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </TabsContent>

              <TabsContent value="tennis" className="mt-4">
                {filterEventsBySport("tennis").map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </TabsContent>

              <TabsContent value="live" className="mt-4">
                {events
                  .filter((event) => event.status === "live")
                  .map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <BetSlip selectedBets={selectedBets} setSelectedBets={setSelectedBets} />
      </div>
    </div>
  )
}

function BetSlip({
  selectedBets,
  setSelectedBets,
}: {
  selectedBets: Array<{
    eventId: string
    market: string
    selection: string
    odds: number
    eventName: string
    sport: string
    league: string
  }>
  setSelectedBets: (bets: Array<{
    eventId: string
    market: string
    selection: string
    odds: number
    eventName: string
    sport: string
    league: string
  }>) => void
}) {
  const [stakes, setStakes] = useState<Record<string, number>>({})
  const [betType, setBetType] = useState<"single" | "accumulator">("single")

  const removeBet = (eventId: string, market: string) => {
    setSelectedBets(selectedBets.filter((bet) => !(bet.eventId === eventId && bet.market === market)))
    const key = `${eventId}-${market}`
    const newStakes = { ...stakes }
    delete newStakes[key]
    setStakes(newStakes)
  }

  const updateStake = (eventId: string, market: string, stake: number) => {
    const key = `${eventId}-${market}`
    setStakes({ ...stakes, [key]: stake })
  }

  const calculatePotentialWin = () => {
    if (betType === "single") {
      return selectedBets.reduce((total, bet) => {
        const key = `${bet.eventId}-${bet.market}`
        const stake = stakes[key] || 0
        return total + stake * bet.odds
      }, 0)
    } else {
      const totalStake = Object.values(stakes).reduce((sum, stake) => sum + stake, 0)
      const combinedOdds = selectedBets.reduce((odds, bet) => odds * bet.odds, 1)
      return totalStake * combinedOdds
    }
  }

  const getTotalStake = () => {
    return Object.values(stakes).reduce((sum, stake) => sum + stake, 0)
  }

  const placeBet = async () => {
    try {
      if (selectedBets.length === 0) {
        alert("No bets selected!");
        return;
      }

      const selections = selectedBets.map((bet) => ({
        eventId: bet.eventId,
        market: bet.market,
        selection: bet.selection,
        odds: bet.odds,
        eventName: bet.eventName,
        sport: bet.sport,
        league: bet.league,
      }));

      const payload = {
        selections,
        betType,
        stakes,
      };

      const response = await fetch("/api/bets/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to place bet");
      }

      const data = await response.json();
      alert(data.message || "Bet placed!");

      setSelectedBets([]);
      setStakes({});
    } catch (error) {
      console.error("Bet error:", error);
      alert((error as Error).message);
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Bet Slip</span>
          <Badge variant="secondary">{selectedBets.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedBets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select odds to add to your bet slip</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedBets.length > 1 && (
              <Tabs value={betType} onValueChange={(value) => setBetType(value as "single" | "accumulator")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single">Singles</TabsTrigger>
                  <TabsTrigger value="accumulator">Accumulator</TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            <div className="space-y-3">
              {selectedBets.map((bet) => {
                const key = `${bet.eventId}-${bet.market}`
                return (
                  <div key={key} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{bet.selection}</p>
                        <p className="text-xs text-muted-foreground">{bet.eventName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{bet.odds}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBet(bet.eventId, bet.market)}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                    {betType === "single" && (
                      <div className="space-y-2">
                        <input
                          type="number"
                          placeholder="Stake"
                          className="w-full px-3 py-2 border rounded-md text-sm"
                          value={stakes[key] || ""}
                          onChange={(e) => updateStake(bet.eventId, bet.market, Number.parseFloat(e.target.value) || 0)}
                        />
                        <div className="text-xs text-muted-foreground">
                          Potential win: ${((stakes[key] || 0) * bet.odds).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {betType === "accumulator" && selectedBets.length > 1 && (
              <div className="border rounded-lg p-3">
                <p className="text-sm font-medium mb-2">Accumulator Stake</p>
                <input
                  type="number"
                  placeholder="Total stake"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={stakes["accumulator"] || ""}
                  onChange={(e) => setStakes({ ...stakes, accumulator: Number.parseFloat(e.target.value) || 0 })}
                />
                <div className="text-xs text-muted-foreground mt-2">
                  Combined odds: {selectedBets.reduce((odds, bet) => odds * bet.odds, 1).toFixed(2)}
                </div>
              </div>
            )}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Stake:</span>
                <span className="font-medium">${getTotalStake().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Potential Win:</span>
                <span className="font-medium text-green-600">${calculatePotentialWin().toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={placeBet}
              disabled={getTotalStake() === 0}
            >
              Place Bet{selectedBets.length > 1 ? "s" : ""}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
