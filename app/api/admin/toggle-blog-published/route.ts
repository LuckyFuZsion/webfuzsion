import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-client"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    const { slug, published } = await request.json()

    if (!slug) {
      return NextResponse.json({ success: false, message: "Slug is required" }, { status: 400 })
    }

    console.log(`Attempting to update blog post "${slug}" published status to: ${published}`)

    const supabase = createServerSupabaseClient()

    // First, check if the blog_posts table has a published column
    const { data: tableInfo, error: tableCheckError } = await supabase
      .from("blog_posts")
      .select("id, published")
      .limit(1)

    if (tableCheckError) {
      console.error("Error checking table structure:", tableCheckError)

      // If the error is because the published column doesn't exist, add it
      if (tableCheckError.message.includes("column") && tableCheckError.message.includes("published")) {
        console.log("Adding published column to blog_posts table")

        try {
          const alterTableQuery = `
            ALTER TABLE blog_posts 
            ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
          `

          const { error: alterError } = await supabase.rpc("execute_sql", { query: alterTableQuery })

          if (alterError) {
            console.error("Error adding published column:", alterError)
            return NextResponse.json(
              { success: false, message: "Failed to add published column to table" },
              { status: 500 },
            )
          }

          console.log("Successfully added published column")
        } catch (alterError) {
          console.error("Exception adding published column:", alterError)
          return NextResponse.json({ success: false, message: "Exception adding published column" }, { status: 500 })
        }
      } else {
        return NextResponse.json({ success: false, message: "Error checking table structure" }, { status: 500 })
      }
    }

    // Now update the published status
    console.log(`Updating blog post "${slug}" published status to: ${published}`)

    const { error } = await supabase
      .from("blog_posts")
      .update({
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug)

    if (error) {
      console.error("Error updating blog post status:", error)
      return NextResponse.json(
        { success: false, message: `Failed to update blog post status: ${error.message}` },
        { status: 500 },
      )
    }

    // Revalidate the blog paths to update the site
    revalidatePath("/blog")
    revalidatePath(`/blog/${slug}`)

    console.log(`Successfully updated blog post "${slug}" published status to: ${published}`)

    return NextResponse.json({
      success: true,
      message: `Blog post ${published ? "published" : "unpublished"} successfully`,
    })
  } catch (error) {
    console.error("Error in toggle-blog-published API:", error)
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
