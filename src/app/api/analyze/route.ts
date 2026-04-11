import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.records || !Array.isArray(body.records) || body.records.length === 0) {
      return NextResponse.json({ error: "Invalid payload. Expected a non-empty array of 'records'." }, { status: 400 });
    }

    // Try Docker internal network first, then localhost fallback
    const urls = [
      "http://model2-service:8000/analyze",
      "http://localhost:8002/analyze"
    ];

    let lastError = "";
    for (const url of urls) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          const errorText = await response.text();
          lastError = `Model 2 Error (${response.status}): ${errorText}`;
          continue;
        }

        const data = await response.json();
        return NextResponse.json(data);
      } catch (e: any) {
        lastError = e.message;
        continue;
      }
    }

    return NextResponse.json({ error: `Could not reach Model 2 service. ${lastError}` }, { status: 502 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
