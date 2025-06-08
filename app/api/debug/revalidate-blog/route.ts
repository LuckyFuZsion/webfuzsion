import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Revalidate the blog paths
    revalidatePath("/blog")
    revalidatePath("/blog/[slug]", "page")
    revalidatePath("/blog/test")

    return NextResponse.json({
      success: true,
      message: "Blog paths revalidated",
      revalidated: ["/blog", "/blog/[slug]", "/blog/test"],
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
