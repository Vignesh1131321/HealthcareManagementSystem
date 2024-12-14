import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "12bec3e0568fc9",
        pass: "97407f058ed973",
      },
    });

    const actionPath = emailType === "VERIFY" ? "verify-email" : "resetpassword";
    const subject = emailType === "VERIFY" ? "Email Verification" : "Password Reset";

    const mailOptions = {
      from: "chandrahas7c@gmail.com",
      to: email,
      subject,
      html: `
        <p>
          Click <a href="${process.env.DOMAIN}/${actionPath}?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}.
        </p>
        <p>
          Or copy and paste the link below in your browser:
          <br>
          ${process.env.DOMAIN}/${actionPath}?token=${hashedToken}
        </p>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};
