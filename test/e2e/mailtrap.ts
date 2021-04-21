import axios from "axios";

import dotenv from 'dotenv';
dotenv.config({ path: "test/e2e/.env" });

export const mailtrap = axios.create({
    headers: {
        Authorization: `Token token=${process.env.MAILTRAP_API_KEY}`,
    },
    baseURL: "https://mailtrap.io",
});

mailtrap.interceptors.request.use(req => {
    console.log(req);
    return req;
})

export const waitForEmail = async (since: Date, timeout: number = 10000) => {
    let received = false;
    const startTime = new Date();
    while (!received) {
        const response = await mailtrap.get(`/api/v1/inboxes/${process.env.MAILTRAP_INBOX_ID}/messages`);

        if(response.data.length > 0) {
            received = since.valueOf() < new Date(response.data[0].sent_at).valueOf();
        }

        if(received) {
            return response.data[0];
        } else if(new Date().valueOf() - startTime.valueOf() > timeout) {
            throw new Error("timed out");
        }
    }
}

const tokenRegex = /href="([^">]*(activateAccount)[^">]*)"/;
export const waitForToken = async (since: Date) => {
    const email = await waitForEmail(since);

    const { data }: { data: string } = await mailtrap.get(email.html_path);
    const link = data.match(tokenRegex)?.[1];
    return link;
}