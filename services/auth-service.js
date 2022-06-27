const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const loginService = async ({ email, password }) => {

  try {
    const user = await User.findOne({ email });
    if (!user) return { code: 400, data: { msg: "User doesn't exist" } };

    const passwordValidation = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValidation)
      return { code: 400, data: { msg: "Email or Password is incorrect" } };

    // create token
    const token = jwt.sign({ id: user.id }, process.env.AUTH_TOKEN_SECRET, {
      expiresIn: 36000,
    });

    return {
      code: 200,
      data: {
        id: user.id,
        name: user.name,
        family_name: user.family_name,
        email: user.email,
        phone_number : user.phone_number,
        password : user.password,
        photoLink : user.photoLink,
        token
      }
    }
  } catch (e) {
    console.error(e);
    return { code: 500, data: { msg: "Could not login" } };
  }
}

const registerService = async (data) => {
  // verify existence of the email
  const userExist = await User.findOne({ email: data.email });
  if (userExist) return { code: 400, data: { msg: "Email already exist" } }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const newUser = new User({
    name: data.name,
    family_name: data.family_name,
    phone_number: data.phone_number,
    email: data.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await newUser.save();
    const token = jwt.sign(
      { id: savedUser._id },
      process.env.AUTH_TOKEN_SECRET,
      {
        expiresIn: 36000,
      }
    );
    return {
      code: 200,
      data: {
        id: savedUser.id,
        name: savedUser.name,
        family_name: savedUser.family_name,
        phone_number: savedUser.phone_number,
        email: savedUser.email,
        password : savedUser.password,
        photoLink : savedUser.photoLink,
        token
      }
    }
  } catch (e) {
    console.error(e);
    return { code: 500, data: { msg: "Could not register" } };
  }
}

module.exports = {
  loginService,
  registerService
}