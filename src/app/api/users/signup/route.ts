import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

// **
// for every api call, we need to establish a connection to the DB in NextJs
connect();

// ************ POST ***********
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log("Request body -> ", reqBody);

    // check if user already exists
    const user = await User.findOne({ email });

    // if exists
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // if does not exists
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("Saved user -> ", savedUser);

    return NextResponse.json(
      {
        message: "User created Successfully",
        success: true,
        savedUser,
      },
      { status: 201 }
    );

    //
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
