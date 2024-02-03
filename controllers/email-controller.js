import { ctrlWrapper } from '../decorators/index.js';
import sendEmail from '../helpers/sendEmail.js';

const sendEmailToSupport = async (req, res) => {
  const { textMessage, emailForSupport } = req.body;

  const verifyEmail = {
    subject: 'Need Help',
    html: `<p>Email: ${emailForSupport}</p>
    <p>Message: ${textMessage}</p>
    `,
  };
  await sendEmail(verifyEmail);
  res.json({ message: 'message sent successfully' });
};

export default {
  sendEmailToSupport: ctrlWrapper(sendEmailToSupport),
};
