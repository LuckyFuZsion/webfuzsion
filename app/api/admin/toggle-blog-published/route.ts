import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const { slug, published } = await request.json()

    if (!slug) {
      return NextResponse.json({ success: false, message: "Slug is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Update the published status
    const { error } = await supabase
      .from("blog_posts")
      .update({ published, updated_at: new Date().toISOString() })
      .eq("slug", slug)

    if (error) {
      console.error("Error updating blog post status:", error)
      return NextResponse.json({ success: false, message: "Failed to update blog post status" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Blog post ${published ? "published" : "unpublished"} successfully`,
    })
  } catch (error) {
    console.error("Error toggling blog post status:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
