import { Box, Typography } from "@mui/material";
import "./terms.scss";

const TermsAndConditions = (): JSX.Element => {
  return (
    <Box className="terms-holder">
      <Box className="heading-holder">
        <Typography component="strong" variant="body1" className="info-text">
          TFA
        </Typography>
        <Typography component="h1" variant="h1">
          About two-factor authentication
        </Typography>
        <Typography component="p">
          Here you will find all the details related to two-factor
          authentication security layer so as you can understand and use this
          feature in the best possible way.
        </Typography>
      </Box>
      <Box className="content-holder">
        <Typography component="h2" variant="h2">
          What is two-factor authentication?
        </Typography>
        <Typography component="p">
          Two-factor authentication (2FA) is an extra layer of security used
          when logging into websites or apps. With 2FA, you have to log in with
          your username and password and provide another form of authentication
          that only you know or have access to.
        </Typography>
        <Typography component="h2" variant="h2">
          How does TFA work?
        </Typography>
        <Typography component="p">
          For BAS, the first form of authentication is a code that's generated
          by an application on your mobile device. After you enable 2FA, BAS
          generates an authentication code any time someone attempts to sign
          into your BAS account. The only way someone can sign into your account
          is if they know both your password and have access to the
          authentication code on your phone.
        </Typography>
        <Typography component="p">
          After you configure 2FA using a mobile app or via text message, you
          can add a security key, like a fingerprint reader or Windows Hello.
          The technology that enables authentication with a security key is
          called WebAuthn. WebAuthn is the successor to U2F and works in all
          modern browsers. For more information, see "WebAuthn" and "Can I Use."
        </Typography>
        <Typography component="p">
          You can also configure additional recovery methods in case you lose
          access to your two-factor authentication credentials.
        </Typography>
        <Typography component="p">
          We strongly urge you to enable 2FA for the safety of your account, not
          only on BAS, but on other websites and apps that support 2FA. You can
          enable 2FA to access BAS and BAS Desktop.
        </Typography>
        <Typography component="h2" variant="h2">
          What is the use of recovery codes?
        </Typography>
        <Typography component="p">
          When you configure two-factor authentication, you'll download and save
          your 2FA recovery codes. If you lose access to your phone, you can
          authenticate to BAS using your recovery codes.
        </Typography>
      </Box>
    </Box>
  );
};

export default TermsAndConditions;
