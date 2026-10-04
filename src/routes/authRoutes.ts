import { Router, Request, Response } from "express";
const authRouter = Router();

authRouter.get("/login", (req: Request, res: Response) => {
  res.render("pages/login", { title: "Login", error: null });
});

authRouter.post("/login", (req: Request<{}, {}, { username: string }>, res: Response) => {
  const username = req.body.username.trim();

  if (username === "") {
    res.status(400).render("pages/login", {
      title: "Login",
      error: "Enter username",
    });
    return;
  }

  res.cookie("username", username, { httpOnly: true });
  res.redirect("/");
});

authRouter.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("username");
  res.redirect("/");
});

export default authRouter
