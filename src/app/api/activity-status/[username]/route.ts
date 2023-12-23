import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { CurrentActivityApiResponse } from "../../../../types";

export const GET = async (
  _request: NextRequest,
  {
    params: { username },
  }: {
    params: { username: string };
  },
) => {
  const token = cookies().get("token")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${String(
        username,
      )}/activity/current`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "client-ip": headers().get("client-ip") ?? "Unknown IP",
          "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
        },
        cache: "no-cache",
      },
    );

    const data = (await response.json()) as CurrentActivityApiResponse;

    return new NextResponse(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "An unknown error occurred" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
