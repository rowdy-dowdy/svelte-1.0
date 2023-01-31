import { f as fail, r as redirect } from './index2-e4abb57b.js';
import { p as prisma } from './prismadb-a6fac679.js';
import bcrypt from 'bcrypt';
import { r as removeSpace } from './validator-edcfa16f.js';
import { s as signToken } from './jwt-de383078.js';
import '@prisma/client';
import 'jsonwebtoken';
import './private-ddb7fb3a.js';

const load = async ({ locals }) => {
  if (!locals.session)
    return null;
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
  });
  return { user };
};
const actions = {
  login: async ({ cookies, request, url }) => {
    const data = await request.formData();
    let email = removeSpace(data.get("email") || ""), password = data.get("password") || "", remember = data.get("remember") || false;
    const user_data = await prisma.user.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        password: true
      }
    });
    if (!user_data) {
      return fail(400, { email, error: "Email not found" });
    }
    if (!await bcrypt.compare(password, user_data.password || "")) {
      return fail(400, { email, error: "Password is corrected" });
    }
    const user = {
      id: user_data.id,
      name: user_data.name,
      email: user_data.email,
      image: user_data.image
    };
    const token = await signToken(user);
    const refresh_token = await signToken(user, remember ? "60d" : "1d");
    var expires_refresh_token = new Date();
    expires_refresh_token.setDate(expires_refresh_token.getDate() + (remember ? 60 : 1));
    await prisma.verificationToken.create({
      data: {
        identifier: user.id,
        token: refresh_token,
        expires: expires_refresh_token
      }
    });
    cookies.set("token", token, { path: "/", httpOnly: true, maxAge: 3600 });
    cookies.set("refresh_token", refresh_token, { path: "/", httpOnly: true, maxAge: remember ? 2592e3 : 86400 });
    throw redirect(302, url.searchParams.get("redirect_url") || "/dashboard");
  },
  register: async (event) => {
  },
  logout: async (event) => {
    const refresh_token = event.cookies.get("refresh_token");
    await prisma.verificationToken.deleteMany({
      where: {
        token: refresh_token
      }
    });
    event.cookies.delete("token", { path: "/" });
    event.cookies.delete("refresh_token", { path: "/" });
    event.locals.session = null;
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 9;
const component = async () => (await import('./_page.svelte-2931d793.js')).default;
const file = '_app/immutable/components/pages/auth/login/_page.svelte-2c411a2d.js';
const imports = ["_app/immutable/components/pages/auth/login/_page.svelte-2c411a2d.js","_app/immutable/chunks/index-4e57025e.js","_app/immutable/chunks/forms-b0cb80c2.js","_app/immutable/chunks/parse-f0c618df.js","_app/immutable/chunks/singletons-94e6fee4.js","_app/immutable/chunks/navigation-bc9b83dc.js","_app/immutable/chunks/svelte-logo-24ddae96.js"];
const stylesheets = ["_app/immutable/assets/_page-9f110145.css"];
const fonts = [];

export { component, file, fonts, imports, index, _page_server_ts as server, stylesheets };
//# sourceMappingURL=9-47b1f4b6.js.map
