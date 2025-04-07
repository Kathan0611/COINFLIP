import axios from 'axios';

export const sendSMS = async (mobile_number: string, otp: string) => {
  if (process.env.MSG_ENABLED == 'true') {
    const params = {
      AUTH_KEY: process.env.AUTH_KEY,
      senderId: process.env.SENDER_ID,
      routeId: process.env.ROUTE_ID,
      mobileNos: mobile_number,
      templateId: process.env.TEMPLATE_ID,
      var1: otp,
    };

    const api_url = `${process.env.SEND_OTP_URL}?AUTH_KEY=${process.env.AUTH_KEY}&senderId=${process.env.SENDER_ID}&routeId=${process.env.ROUTE_ID}&mobileNos=${mobile_number}&templateid=${process.env.TEMPLATE_ID}&var1=${otp}`;

    try {
      const response = await axios.get(api_url);
      if (response.data.responseCode !== '3001') {
        throw new Error('ERROR_SENDING_SMS');
      }
      console.log(`SMS sent successfully to ${mobile_number}:`, response.data);
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log(`Your otp is ${otp}`);
  }
};
