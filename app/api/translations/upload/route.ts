import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { UPLOAD, UPLOAD_PATH_RE, uploadMonth } from '@/lib/sworn-translations'

// Issues short-lived tokens so the browser can upload straight to the private
// Blob store (bypassing Vercel's ~4.5 MB request body limit).
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const match = UPLOAD_PATH_RE.exec(pathname)
        const now = new Date()
        const lastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
        // Only the current (or, around midnight UTC, previous) month folder is accepted
        if (!match || ![uploadMonth(now), uploadMonth(lastMonth)].includes(match[1])) {
          throw new Error('Invalid upload path.')
        }
        return {
          allowedContentTypes: [...UPLOAD.contentTypes],
          maximumSizeInBytes: UPLOAD.maxFileBytes,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60 * 1000,
        }
      },
    })
    return NextResponse.json(json)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
