declare module "twilio" {
  export default function twilio(
    accountSid: string,
    authToken: string
  ): {
    messages: {
      create: (opts: {
        body: string;
        from: string;
        to: string;
      }) => Promise<{ sid: string; status: string }>;
    };
  };
}
