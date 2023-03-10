import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (!locals.session) {
    throw redirect(302, "/auth/login")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: locals.session?.user?.id
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true
    }
  })

  return { user };
}