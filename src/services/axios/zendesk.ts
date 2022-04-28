import axios from "axios";
import { User } from "model/user";

export const createTicket = async (user: User, librarySuggestion: string) => {
  try {
    await axios.post(
      `https://${process.env.REACT_APP_ZENDESK_DOMAIN_NAME}.zendesk.com/api/v2/tickets.json`,
      {
        ticket: {
          subject: 'New Library Request',
          comment: { body: librarySuggestion },
          requester: { name: user.firstName, email: user.email }
        }
      },
      {
        headers: { "Authorization": `Basic ${Buffer.from(`${process.env.REACT_APP_ZENDESK_API_EMAIL}/token:${process.env.REACT_APP_ZENDESK_API_TOKEN}`).toString('base64')}` },
      }
    );
    return true;
  } catch (e) {
    return false;
  }
}