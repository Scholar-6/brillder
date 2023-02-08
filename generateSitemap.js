const fs = require("fs");
const axios = require("axios").default;
const dotenv = require("dotenv");
dotenv.config();

axios.get("https://api.brillder.com/sitemap.xml?baseUrl=https://app.brillder.com").then(response => {
    let xml = response.data;
    xml = xml.replace(`xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`, `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://app.brillder.com/play/dashboard/</loc></url><url><loc>https://app.brillder.com/login</loc></url><url><loc>https://app.brillder.com/home</loc></url>`)

    fs.writeFileSync("./public/sitemap.xml", xml);
});