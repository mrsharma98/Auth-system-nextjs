import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// **
// for every api call, we need to establish a connection to the DB in NextJs
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log("ReqBody login -> ", reqBody);

    // check if user exists
    const user = await User.findOne({ email });

    // No user
    if (!user) {
      return NextResponse.json(
        { error: "User does nt exist" },
        { status: 400 }
      );
    }

    // if user exists
    // check for password
    const validPassword = await bcryptjs.compare(password, user.password);

    // if passsword is wrong
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // if password is correct
    // Create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    // saving the token to the cokkie
    response.cookies.set("token", token, { httpOnly: true });

    // Now return the response and it will do everything
    // like send the response and save the token to the cokkie
    return response;
    //
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
