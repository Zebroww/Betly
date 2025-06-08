import { NextResponse } from "next/server"

interface LiveOdds {
  eventId: string
  event: string
  sport: string
  league: string
  startTime: string
  status: "upcoming" | "live" | "ended"
  markets: {
    matchWinner?: {
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
    handicap?: {
      home: number
      away: number
      line: number
    }
  }
  homeTeam: string
  awayTeam: string
  lastUpdated: string
}

export async function GET() {
  try {
    const liveOdds: LiveOdds[] = [
      {
        eventId: "evt_001",
        event: "Manchester United vs Liverpool",
        sport: "Football",
        league: "Premier League",
        homeTeam: "Manchester United",
        awayTeam: "Liverpool",
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        status: "upcoming",
        lastUpdated: new Date().toISOString(),
        markets: {
          matchWinner: {
            home: 2.5 + (Math.random() - 0.5) * 0.2,
            draw: 3.2 + (Math.random() - 0.5) * 0.3,
            away: 2.8 + (Math.random() - 0.5) * 0.2,
          },
          totalGoals: {
            over: 1.85 + (Math.random() - 0.5) * 0.1,
            under: 1.95 + (Math.random() - 0.5) * 0.1,
            line: 2.5,
          },
          bothTeamsScore: {
            yes: 1.75 + (Math.random() - 0.5) * 0.1,
            no: 2.1 + (Math.random() - 0.5) * 0.1,
          },
          handicap: {
            home: 1.9 + (Math.random() - 0.5) * 0.1,
            away: 1.9 + (Math.random() - 0.5) * 0.1,
            line: 0,
          },
        },
      },
      {
        eventId: "evt_002",
        event: "Lakers vs Warriors",
        sport: "Basketball",
        league: "NBA",
        homeTeam: "Lakers",
        awayTeam: "Warriors",
        startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        status: "upcoming",
        lastUpdated: new Date().toISOString(),
        markets: {
          matchWinner: {
            home: 1.95 + (Math.random() - 0.5) * 0.1,
            away: 1.85 + (Math.random() - 0.5) * 0.1,
          },
          totalGoals: {
            over: 1.9 + (Math.random() - 0.5) * 0.1,
            under: 1.9 + (Math.random() - 0.5) * 0.1,
            line: 220.5,
          },
          handicap: {
            home: 1.9 + (Math.random() - 0.5) * 0.1,
            away: 1.9 + (Math.random() - 0.5) * 0.1,
            line: -2.5,
          },
        },
      },
      {
        eventId: "evt_003",
        event: "Real Madrid vs Barcelona",
        sport: "Football",
        league: "La Liga",
        homeTeam: "Real Madrid",
        awayTeam: "Barcelona",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: "upcoming",
        lastUpdated: new Date().toISOString(),
        markets: {
          matchWinner: {
            home: 2.1 + (Math.random() - 0.5) * 0.2,
            draw: 3.5 + (Math.random() - 0.5) * 0.3,
            away: 3.2 + (Math.random() - 0.5) * 0.2,
          },
          totalGoals: {
            over: 1.8 + (Math.random() - 0.5) * 0.1,
            under: 2.0 + (Math.random() - 0.5) * 0.1,
            line: 2.5,
          },
          bothTeamsScore: {
            yes: 1.65 + (Math.random() - 0.5) * 0.1,
            no: 2.25 + (Math.random() - 0.5) * 0.1,
          },
        },
      },
      {
        eventId: "evt_004",
        event: "Novak Djokovic vs Rafael Nadal",
        sport: "Tennis",
        league: "ATP",
        homeTeam: "Novak Djokovic",
        awayTeam: "Rafael Nadal",
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        status: "upcoming",
        lastUpdated: new Date().toISOString(),
        markets: {
          matchWinner: {
            home: 1.75 + (Math.random() - 0.5) * 0.1,
            away: 2.05 + (Math.random() - 0.5) * 0.1,
          },
          totalGoals: {
            over: 1.85 + (Math.random() - 0.5) * 0.1,
            under: 1.95 + (Math.random() - 0.5) * 0.1,
            line: 21.5,
          },
        },
      },
      {
        eventId: "evt_005",
        event: "Chelsea vs Arsenal",
        sport: "Football",
        league: "Premier League",
        homeTeam: "Chelsea",
        awayTeam: "Arsenal",
        startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), 
        status: "live",
        lastUpdated: new Date().toISOString(),
        markets: {
          matchWinner: {
            home: 3.1 + (Math.random() - 0.5) * 0.3, 
            draw: 2.8 + (Math.random() - 0.5) * 0.3,
            away: 2.2 + (Math.random() - 0.5) * 0.2,
          },
          totalGoals: {
            over: 2.1 + (Math.random() - 0.5) * 0.2,
            under: 1.7 + (Math.random() - 0.5) * 0.2,
            line: 1.5, 
          },
          bothTeamsScore: {
            yes: 1.9 + (Math.random() - 0.5) * 0.2,
            no: 1.9 + (Math.random() - 0.5) * 0.2,
          },
        },
      },
    ]

    const formattedOdds = liveOdds.map((event) => ({
      ...event,
      markets: {
        ...event.markets,
        matchWinner: event.markets.matchWinner
          ? {
              home: Math.round(event.markets.matchWinner.home * 100) / 100,
              draw: event.markets.matchWinner.draw ? Math.round(event.markets.matchWinner.draw * 100) / 100 : undefined,
              away: Math.round(event.markets.matchWinner.away * 100) / 100,
            }
          : undefined,
        totalGoals: event.markets.totalGoals
          ? {
              over: Math.round(event.markets.totalGoals.over * 100) / 100,
              under: Math.round(event.markets.totalGoals.under * 100) / 100,
              line: event.markets.totalGoals.line,
            }
          : undefined,
        bothTeamsScore: event.markets.bothTeamsScore
          ? {
              yes: Math.round(event.markets.bothTeamsScore.yes * 100) / 100,
              no: Math.round(event.markets.bothTeamsScore.no * 100) / 100,
            }
          : undefined,
        handicap: event.markets.handicap
          ? {
              home: Math.round(event.markets.handicap.home * 100) / 100,
              away: Math.round(event.markets.handicap.away * 100) / 100,
              line: event.markets.handicap.line,
            }
          : undefined,
      },
    }))

    return NextResponse.json({
      success: true,
      events: formattedOdds,
      lastUpdated: new Date().toISOString(),
      totalEvents: formattedOdds.length,
    })
  } catch (error) {
    console.error("Get odds error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
