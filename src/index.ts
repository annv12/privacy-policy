import express from "express";
import session from "express-session";
import passport from "passport";
import "./passport";

const app = express();

app.use(
  session({ secret: "secret_key", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send('<a href="/auth/facebook">Login with Facebook</a>');
});

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: [
      // "pages_show_list",
      // "pages_messaging",
      // "pages_messaging_subscriptions",
      // "pages_read_engagement",
      // "pages_read_user_content",
      // "pages_manage_posts",
      // "pages_manage_metadata",
      // "public_profile",
      "pages_manage_posts",
      "publish_to_groups",
    ],
  })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.send("✅ Đăng nhập thành công! Token đã được lưu.");
  }
);

app.listen(3000, () => {
  console.log("🚀 Server is running at http://localhost:3000");
});
