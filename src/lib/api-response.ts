import { NextResponse } from "next/server";

interface SuccessPayload<T> {
  success: true;
  message: string;
  data?: T;
}

interface ErrorPayload {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export function apiSuccess<T>(
  message: string,
  data?: T,
  status = 200
): NextResponse<SuccessPayload<T>> {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function apiError(
  message: string,
  status = 400,
  errors?: Record<string, string[]>
): NextResponse<ErrorPayload> {
  return NextResponse.json({ success: false, message, errors }, { status });
}
